import configPromise from '@payload-config'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getPayload } from 'payload'

import {
  collectMonobankJarUrls,
  fetchMonobankJarById,
  parseMonobankClientId,
  resolveMonobankExtJarId,
} from '@/utilities/monobankJarSnapshot'
import type { Payload } from 'payload'

type SyncResult = {
  total: number
  success: number
  failed: number
  skipped: number
  errors: { jarUrl: string; error: string }[]
}

async function getConfiguredJarUrls(payload: Payload): Promise<string[]> {
  const locales: Array<'uk' | 'en'> = ['uk', 'en']
  const uniqueUrls = new Map<string, string>()

  for (const locale of locales) {
    const activeProjects = await payload.findGlobal({
      slug: 'active-projects',
      locale: locale as unknown as 'all',
      depth: 0,
    })

    for (const url of collectMonobankJarUrls(activeProjects.projects)) {
      const clientId = parseMonobankClientId(url)
      if (!clientId) continue
      if (!uniqueUrls.has(clientId)) uniqueUrls.set(clientId, url)
    }
  }

  return [...uniqueUrls.values()]
}

async function findExistingSnapshot(payload: Payload, clientId: string, jarUrl: string) {
  const existing = await payload.find({
    collection: 'monobank-jars',
    where: {
      or: [{ clientId: { equals: clientId } }, { jarUrl: { equals: jarUrl } }],
    },
    limit: 1,
    pagination: false,
  })

  return existing.docs[0] || null
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
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
    extJarId = await resolveMonobankExtJarId(clientId)
    await sleep(500)
  }

  try {
    await upsertJarSuccess(payload, existingId, jarUrl, clientId, extJarId)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown sync error'
    const shouldReresolve = Boolean(existingExtJarId) && /invalid alias|404|not found/i.test(message)

    if (!shouldReresolve) throw error

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
  revalidateTag('monobank_jar_snapshots')
}

export async function syncMonobankJarSnapshots(): Promise<SyncResult> {
  const payload = await getPayload({ config: configPromise })
  const jarUrls = await getConfiguredJarUrls(payload)

  const result: SyncResult = {
    total: jarUrls.length,
    success: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  }

  for (const jarUrl of jarUrls) {
    const clientId = parseMonobankClientId(jarUrl)

    if (!clientId) {
      result.skipped += 1
      result.errors.push({ jarUrl, error: 'Invalid jar URL' })
      continue
    }

    try {
      const existing = await findExistingSnapshot(payload, clientId, jarUrl)
      await syncJarSnapshot(payload, existing?.id || null, jarUrl, clientId, existing?.extJarId)
      result.success += 1
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown sync error'
      const existing = await findExistingSnapshot(payload, clientId, jarUrl)
      const resolveLikelyFailed =
        message.includes('extJarId') || message.includes('resolver') || message.includes('invalid alias')

      await upsertJarError(payload, existing?.id || null, {
        jarUrl,
        clientId,
        extJarId: existing?.extJarId,
        lastFetchStatus: 'error',
        lastError: message,
        lastFetchedAt: new Date().toISOString(),
        lastResolveStatus: resolveLikelyFailed ? 'error' : existing?.lastResolveStatus || 'pending',
        lastResolvedAt: resolveLikelyFailed ? new Date().toISOString() : existing?.lastResolvedAt || undefined,
        lastResolveError: resolveLikelyFailed ? message : existing?.lastResolveError || '',
      })
      result.failed += 1
      result.errors.push({ jarUrl, error: message })
    }

    await sleep(500)
  }

  revalidateActiveProjectPages()
  return result
}
