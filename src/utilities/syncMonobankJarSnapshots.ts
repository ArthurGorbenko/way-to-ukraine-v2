import configPromise from '@payload-config'
import { promises as fs } from 'fs'
import { revalidatePath, revalidateTag } from 'next/cache'
import os from 'os'
import path from 'path'
import { getPayload } from 'payload'

import {
  fetchMonobankJarById,
  parseMonobankClientId,
  resolveMonobankExtJarId,
} from '@/utilities/monobankJarSnapshot'
import type { MonobankJar } from '@/payload-types'
import type { Payload } from 'payload'

type SyncResult = {
  total: number
  success: number
  failed: number
  skipped: number
  errors: { jarUrl: string; error: string }[]
}

const MONOBANK_SYNC_LOCK_FILE = path.join(os.tmpdir(), 'way-to-ukraine-monobank-sync.lock')
const MONOBANK_SYNC_STATE_FILE = path.join(os.tmpdir(), 'way-to-ukraine-monobank-sync-state.json')
const MONOBANK_SYNC_LOCK_TTL_MS = 30 * 60 * 1000
const MONOBANK_SYNC_COOLDOWN_MS = 5 * 60 * 1000
const MONOBANK_SYNC_INTERVAL_MS = 60 * 1000

export class MonobankSyncAlreadyRunningError extends Error {
  constructor() {
    super('Monobank sync is already running')
    this.name = 'MonobankSyncAlreadyRunningError'
  }
}

export class MonobankSyncCooldownError extends Error {
  retryAfterMs: number

  constructor(retryAfterMs: number) {
    super(`Monobank sync cooldown active. Retry in ${Math.ceil(retryAfterMs / 1000)}s`)
    this.name = 'MonobankSyncCooldownError'
    this.retryAfterMs = retryAfterMs
  }
}

function formatJarForLog(jarUrl: string, clientId?: string | null, extJarId?: string | null): string {
  const parts = [jarUrl]
  if (clientId) parts.push(`clientId=${clientId}`)
  if (extJarId) parts.push(`extJarId=${extJarId}`)
  return parts.join(' | ')
}

async function getConfiguredJars(payload: Payload): Promise<MonobankJar[]> {
  const result = await payload.find({
    collection: 'monobank-jars',
    depth: 0,
    limit: 200,
    pagination: false,
    sort: 'clientId',
  })

  return result.docs
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function enforceMonobankSyncCooldown(): Promise<void> {
  const now = Date.now()

  try {
    const raw = await fs.readFile(MONOBANK_SYNC_STATE_FILE, 'utf8')
    const parsed = JSON.parse(raw) as { lastAttemptAt?: string }
    const lastAttemptAt = parsed.lastAttemptAt ? new Date(parsed.lastAttemptAt).getTime() : Number.NaN

    if (!Number.isFinite(lastAttemptAt)) {
      return
    }

    const elapsed = now - lastAttemptAt

    if (elapsed < MONOBANK_SYNC_COOLDOWN_MS) {
      throw new MonobankSyncCooldownError(MONOBANK_SYNC_COOLDOWN_MS - elapsed)
    }
  } catch (error) {
    if (error instanceof MonobankSyncCooldownError) throw error

    const nodeError = error as NodeJS.ErrnoException
    if (nodeError.code === 'ENOENT') return
  }

  await fs.writeFile(MONOBANK_SYNC_STATE_FILE, JSON.stringify({ lastAttemptAt: new Date(now).toISOString() }))
}

async function acquireMonobankSyncLock(): Promise<void> {
  const now = Date.now()

  try {
    const handle = await fs.open(MONOBANK_SYNC_LOCK_FILE, 'wx')
    await handle.writeFile(JSON.stringify({ pid: process.pid, startedAt: new Date(now).toISOString() }))
    await handle.close()
    return
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException
    if (nodeError.code !== 'EEXIST') throw error
  }

  try {
    const raw = await fs.readFile(MONOBANK_SYNC_LOCK_FILE, 'utf8')
    const parsed = JSON.parse(raw) as { startedAt?: string }
    const startedAt = parsed.startedAt ? new Date(parsed.startedAt).getTime() : Number.NaN

    if (Number.isFinite(startedAt) && now - startedAt < MONOBANK_SYNC_LOCK_TTL_MS) {
      throw new MonobankSyncAlreadyRunningError()
    }
  } catch (error) {
    if (error instanceof MonobankSyncAlreadyRunningError) throw error
  }

  await fs.rm(MONOBANK_SYNC_LOCK_FILE, { force: true })

  try {
    const handle = await fs.open(MONOBANK_SYNC_LOCK_FILE, 'wx')
    await handle.writeFile(JSON.stringify({ pid: process.pid, startedAt: new Date(now).toISOString() }))
    await handle.close()
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException
    if (nodeError.code === 'EEXIST') {
      throw new MonobankSyncAlreadyRunningError()
    }
    throw error
  }
}

async function releaseMonobankSyncLock(): Promise<void> {
  await fs.rm(MONOBANK_SYNC_LOCK_FILE, { force: true })
}

async function upsertJarError(
  payload: Payload,
  existingId: string | null,
  data: {
    jarUrl: string
    clientId: string
    extJarId?: string | null
    lastFetchStatus: 'error'
    lastError: string
    lastFetchedAt: string
    lastResolveStatus?: 'error' | 'success' | 'pending'
    lastResolvedAt?: string
    lastResolveError?: string
  },
) {
  if (existingId) {
    await payload.update({
      collection: 'monobank-jars',
      id: existingId,
      data,
    })
    return
  }

  await payload.create({
    collection: 'monobank-jars',
    data: {
      ...data,
      extJarId: data.extJarId || undefined,
      amountMinor: 0,
      goalMinor: 0,
      displayAmount: 0,
      displayGoal: 0,
      progressPercent: 0,
      lastResolveStatus: data.lastResolveStatus || 'pending',
    },
  })
}

async function upsertJarSuccess(
  payload: Payload,
  existingId: string | null,
  jarUrl: string,
  clientId: string,
  extJarId: string,
) {
  const jar = await fetchMonobankJarById(extJarId)
  if (!jar) {
    throw new Error('Jar not found')
  }

  const data = {
    jarUrl,
    clientId,
    extJarId: jar.extJarId,
    title: jar.title,
    description: jar.description,
    amountMinor: jar.amountMinor,
    goalMinor: jar.goalMinor,
    displayAmount: jar.displayAmount,
    displayGoal: jar.displayGoal,
    progressPercent: jar.progressPercent,
    lastFetchedAt: new Date().toISOString(),
    lastResolvedAt: new Date().toISOString(),
    lastFetchStatus: 'success' as const,
    lastResolveStatus: 'success' as const,
    lastError: '',
    lastResolveError: '',
  }

  if (existingId) {
    await payload.update({
      collection: 'monobank-jars',
      id: existingId,
      data,
    })
    return
  }

  await payload.create({
    collection: 'monobank-jars',
    data,
  })
}

async function syncJarSnapshot(
  payload: Payload,
  existingId: string | null,
  jarUrl: string,
  clientId: string,
  existingExtJarId?: string | null,
) {
  let extJarId = existingExtJarId?.trim()

  if (!extJarId) {
    payload.logger.info(`Resolving Monobank extJarId for ${formatJarForLog(jarUrl, clientId)}`)
    extJarId = await resolveMonobankExtJarId(clientId)
    await sleep(500)
  }

  try {
    await upsertJarSuccess(payload, existingId, jarUrl, clientId, extJarId)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown sync error'
    const shouldReresolve = Boolean(existingExtJarId) && /invalid alias|404|not found/i.test(message)

    if (!shouldReresolve) throw error

    payload.logger.warn(
      `Monobank extJarId appears stale, re-resolving for ${formatJarForLog(jarUrl, clientId, existingExtJarId)}: ${message}`,
    )
    const refreshedExtJarId = await resolveMonobankExtJarId(clientId)
    await sleep(500)
    await upsertJarSuccess(payload, existingId, jarUrl, clientId, refreshedExtJarId)
  }
}

function revalidateActiveProjectPages() {
  revalidatePath('/projects/active')
  revalidatePath('/projects/active/details')
  revalidatePath('/projects/active/donate')
  revalidatePath('/ua/projects/active')
  revalidatePath('/ua/projects/active/details')
  revalidatePath('/ua/projects/active/donate')
  revalidatePath('/en/projects/active')
  revalidatePath('/en/projects/active/details')
  revalidatePath('/en/projects/active/donate')
  revalidateTag('global_active-projects_uk')
  revalidateTag('global_active-projects_en')
}

export async function syncMonobankJarSnapshots(): Promise<SyncResult> {
  await acquireMonobankSyncLock()

  try {
    await enforceMonobankSyncCooldown()

    const payload = await getPayload({ config: configPromise })
    const configuredJars = await getConfiguredJars(payload)

    payload.logger.info(`Starting Monobank sync for ${configuredJars.length} jar(s)`)

    const result: SyncResult = {
      total: configuredJars.length,
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [],
    }

    for (const [index, configuredJar] of configuredJars.entries()) {
      const jarUrl = configuredJar.jarUrl?.trim()
      const clientId = parseMonobankClientId(jarUrl)

      if (!jarUrl || !clientId) {
        payload.logger.warn(`Skipping Monobank sync for invalid jar URL: ${jarUrl}`)
        result.skipped += 1
        result.errors.push({ jarUrl, error: 'Invalid jar URL' })
        continue
      }

      try {
        payload.logger.info(
          `Syncing Monobank jar ${index + 1}/${configuredJars.length}: ${formatJarForLog(jarUrl, clientId, configuredJar.extJarId)}`,
        )
        await syncJarSnapshot(payload, configuredJar.id, jarUrl, clientId, configuredJar.extJarId)
        payload.logger.info(`Monobank jar sync succeeded: ${formatJarForLog(jarUrl, clientId)}`)
        result.success += 1
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown sync error'
        const resolveLikelyFailed =
          message.includes('extJarId') || message.includes('resolver') || message.includes('invalid alias')

        payload.logger.error(
          `Monobank jar sync failed for ${formatJarForLog(jarUrl, clientId, configuredJar.extJarId)}: ${message}`,
        )

        await upsertJarError(payload, configuredJar.id, {
          jarUrl,
          clientId,
          extJarId: configuredJar.extJarId,
          lastFetchStatus: 'error',
          lastError: message,
          lastFetchedAt: new Date().toISOString(),
          lastResolveStatus: resolveLikelyFailed ? 'error' : configuredJar.lastResolveStatus || 'pending',
          lastResolvedAt: resolveLikelyFailed ? new Date().toISOString() : configuredJar.lastResolvedAt || undefined,
          lastResolveError: resolveLikelyFailed ? message : configuredJar.lastResolveError || '',
        })
        result.failed += 1
        result.errors.push({ jarUrl, error: message })
      }

      if (index < configuredJars.length - 1) {
        payload.logger.info(
          `Waiting ${Math.round(MONOBANK_SYNC_INTERVAL_MS / 1000)}s before next Monobank jar sync`,
        )
        await sleep(MONOBANK_SYNC_INTERVAL_MS)
      }
    }

    revalidateActiveProjectPages()
    payload.logger.info(
      `Completed Monobank sync: total=${result.total} success=${result.success} failed=${result.failed} skipped=${result.skipped}`,
    )
    return result
  } finally {
    await releaseMonobankSyncLock()
  }
}
