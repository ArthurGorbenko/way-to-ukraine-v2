import type { Config } from '@/payload-types'

import { formatMonobankAmount, getMonobankJarSnapshot } from './monobankJarSnapshot'

type ActiveProject = NonNullable<Config['globals']['active-projects']['projects']>[number]
type FinishedProject = NonNullable<Config['globals']['finished-projects']['cards']>[number]
type MonobankJarReference = ActiveProject['monobankJar']
type ProjectWithMonobankJar = { monobankJar?: MonobankJarReference | null }

export type FundraisingTotals = {
  displayAmount: number
}

export async function calculateFundraisingTotals(
  activeProjects: ActiveProject[] = [],
  finishedProjects: FinishedProject[] = [],
): Promise<FundraisingTotals> {
  const projects = [...activeProjects, ...finishedProjects] as unknown as ProjectWithMonobankJar[]
  const snapshots = await Promise.all(projects.map((project) => getMonobankJarSnapshot(project?.monobankJar)))

  return {
    displayAmount: snapshots.reduce((sum, snapshot) => sum + (snapshot?.displayAmount || 0), 0),
  }
}

export function formatFoundationRaisedAmount(amount: number, locale: 'uk' | 'en'): string {
  const formatted = formatMonobankAmount(amount, locale)
  return locale === 'uk' ? formatted.replace(/ грн$/, ' гривень') : formatted
}
