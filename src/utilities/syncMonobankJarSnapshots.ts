import configPromise from '@payload-config'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getPayload } from 'payload'

import { collectMonobankJarUrls, fetchMonobankJarById, parseMonobankJarId } from '@/utilities/monobankJarSnapshot'
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
      const jarId = parseMonobankJarId(url)
      if (!jarId) continue
      if (!uniqueUrls.has(jarId)) uniqueUrls.set(jarId, url)
    }
  }

  return [...uniqueUrls.values()]
}

async function upsertJarError(payload: Payload, jarUrl: string, jarId: string, error: string) {
  const existing = await payload.find({
    collection: 'monobank-jars',
    where: {
      jarId: {
        equals: jarId,
      },
    },
    limit: 1,
    pagination: false,
  })

  const data = {
    jarUrl,
    jarId,
    lastFetchStatus: 'error' as const,
    lastError: error,
    lastFetchedAt: new Date().toISOString(),
  }

  if (existing.docs[0]) {
    await payload.update({
      collection: 'monobank-jars',
      id: existing.docs[0].id,
      data,
    })
    return
  }

  await payload.create({
    collection: 'monobank-jars',
    data: {
      ...data,
      amountMinor: 0,
      goalMinor: 0,
      displayAmount: 0,
      displayGoal: 0,
      progressPercent: 0,
    },
  })
}

async function upsertJarSuccess(payload: Payload, jarUrl: string, jarId: string) {
  const jar = await fetchMonobankJarById(jarId)
  if (!jar) {
    throw new Error('Jar not found')
  }

  const existing = await payload.find({
    collection: 'monobank-jars',
    where: {
      jarId: {
        equals: jarId,
      },
    },
    limit: 1,
    pagination: false,
  })

  const data = {
    jarUrl,
    jarId: jar.jarId,
    title: jar.title,
    description: jar.description,
    amountMinor: jar.amountMinor,
    goalMinor: jar.goalMinor,
    displayAmount: jar.displayAmount,
    displayGoal: jar.displayGoal,
    progressPercent: jar.progressPercent,
    lastFetchedAt: new Date().toISOString(),
    lastFetchStatus: 'success' as const,
    lastError: '',
  }

  if (existing.docs[0]) {
    await payload.update({
      collection: 'monobank-jars',
      id: existing.docs[0].id,
      data,
    })
    return
  }

  await payload.create({
    collection: 'monobank-jars',
    data,
  })
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
    const jarId = parseMonobankJarId(jarUrl)

    if (!jarId) {
      result.skipped += 1
      result.errors.push({ jarUrl, error: 'Invalid jar URL' })
      continue
    }

    try {
      await upsertJarSuccess(payload, jarUrl, jarId)
      result.success += 1
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown sync error'
      await upsertJarError(payload, jarUrl, jarId, message)
      result.failed += 1
      result.errors.push({ jarUrl, error: message })
    }
  }

  revalidateActiveProjectPages()
  return result
}
