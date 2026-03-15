import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import type { Config, MonobankJar } from '@/payload-types'

const MONOBANK_API_BASE = 'https://api.monobank.ua/bank/jar'
const MONOBANK_RESOLVER_API = 'https://send.monobank.ua/api/handler'
const MONOBANK_PC = 'way-to-ukraine-sync'

export type MonobankJarData = {
  title: string
  description: string
  amountMinor: number
  goalMinor: number
  extJarId: string
  displayAmount: number
  displayGoal: number
  progressPercent: number
}

type ActiveProjectsGlobal = Config['globals']['active-projects']
type ActiveProjectItem = NonNullable<ActiveProjectsGlobal['projects']>[number]

export function parseMonobankClientId(input: string | null | undefined): string | null {
  if (!input) return null

  const raw = input.trim()
  if (!raw) return null

  try {
    const url = new URL(raw)
    const clientQuery = url.searchParams.get('clientId')?.trim()
    if (clientQuery) return clientQuery

    const jarQuery = url.searchParams.get('jar')?.trim()
    if (jarQuery) return jarQuery

    const parts = url.pathname.split('/').filter(Boolean)
    const jarIndex = parts.findIndex((part) => part === 'jar')
    if (jarIndex >= 0 && parts[jarIndex + 1]) {
      return parts[jarIndex + 1]
    }
  } catch {
    return raw
  }

  return null
}

function normalizeAmount(amount: unknown): number {
  const value = Number(amount)
  return Number.isFinite(value) ? value / 100 : 0
}

export function normalizeMonobankJarResponse(payload: unknown): MonobankJarData | null {
  if (!payload || typeof payload !== 'object') return null

  const source = payload as Record<string, unknown>
  const title = typeof source.title === 'string' ? source.title : ''
  const description = typeof source.description === 'string' ? source.description : ''
  const extJarId = typeof source.jarId === 'string' ? source.jarId : ''
  const amountMinor = Number(source.amount)
  const goalMinor = Number(source.goal)

  if (!extJarId || !Number.isFinite(amountMinor) || !Number.isFinite(goalMinor)) return null

  const displayAmount = normalizeAmount(amountMinor)
  const displayGoal = normalizeAmount(goalMinor)
  const progressPercent =
    goalMinor > 0 ? Math.max(0, Math.min(100, Number(((amountMinor / goalMinor) * 100).toFixed(2)))) : 0

  return {
    title,
    description,
    amountMinor,
    goalMinor,
    extJarId,
    displayAmount,
    displayGoal,
    progressPercent,
  }
}

export async function resolveMonobankExtJarId(clientId: string): Promise<string> {
  const response = await fetch(MONOBANK_RESOLVER_API, {
    cache: 'no-store',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      c: 'hello',
      clientId,
      Pc: MONOBANK_PC,
    }),
  })

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`
    try {
      const body = (await response.json()) as { errCode?: string; errText?: string }
      if (body?.errCode || body?.errText) {
        message = [body.errCode, body.errText].filter(Boolean).join(' ')
      }
    } catch {
      // ignore body parse errors
    }

    throw new Error(message)
  }

  const payload = (await response.json()) as unknown
  if (!payload || typeof payload !== 'object') {
    throw new Error('Malformed Monobank resolver response')
  }

  const extJarId = (payload as Record<string, unknown>).extJarId
  if (typeof extJarId !== 'string' || !extJarId.trim()) {
    throw new Error('Missing extJarId in Monobank resolver response')
  }

  return extJarId.trim()
}

export async function fetchMonobankJarById(extJarId: string): Promise<MonobankJarData | null> {
  const response = await fetch(`${MONOBANK_API_BASE}/${extJarId}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`
    try {
      const body = (await response.json()) as { errCode?: string; errText?: string }
      if (body?.errCode || body?.errText) {
        message = [body.errCode, body.errText].filter(Boolean).join(' ')
      }
    } catch {
      // ignore body parse errors
    }

    throw new Error(message)
  }

  const payload = (await response.json()) as unknown
  const normalized = normalizeMonobankJarResponse(payload)
  if (!normalized) {
    throw new Error('Malformed Monobank jar response')
  }

  return normalized
}

export function formatMonobankAmount(amount: number, locale: 'uk' | 'en'): string {
  const value = Number.isFinite(amount) ? amount : 0
  const formatted = new Intl.NumberFormat(locale === 'uk' ? 'uk-UA' : 'en-US', {
    maximumFractionDigits: 2,
  }).format(value)

  return `${formatted} ${locale === 'uk' ? 'грн' : 'UAH'}`
}

function buildSnapshotMap(snapshots: MonobankJar[]): Map<string, MonobankJar> {
  return new Map(
    snapshots.flatMap((snapshot) => {
      const keys = [snapshot.jarUrl, snapshot.clientId, snapshot.extJarId].filter(
        (key): key is string => Boolean(key),
      )
      return keys.map((key) => [key, snapshot] as const)
    }),
  )
}

const getCachedSnapshots = unstable_cache(
  async (): Promise<MonobankJar[]> => {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'monobank-jars',
      limit: 200,
      pagination: false,
      sort: 'jarId',
    })

    return result.docs
  },
  ['monobank-jar-snapshots'],
  {
    tags: ['monobank_jar_snapshots'],
  },
)

export async function getMonobankJarSnapshot(url: string | null | undefined): Promise<MonobankJar | null> {
  const clientId = parseMonobankClientId(url)
  if (!clientId && !url) return null

  const snapshotMap = buildSnapshotMap(await getCachedSnapshots())
  const snapshot = snapshotMap.get(url || '') || (clientId ? snapshotMap.get(clientId) || null : null)
  if (!snapshot) return null

  const hasUsableValues = Boolean(snapshot.displayGoal || snapshot.displayAmount || snapshot.progressPercent)
  if (snapshot.lastFetchStatus !== 'success' && !hasUsableValues) {
    return null
  }

  return snapshot
}

export function collectMonobankJarUrls(
  projects: ActiveProjectsGlobal['projects'] | null | undefined,
): string[] {
  const urls = (projects || [])
    .map((project: ActiveProjectItem) => project?.monoJarUrl?.trim())
    .filter((value): value is string => Boolean(value))

  return [...new Set(urls)]
}
