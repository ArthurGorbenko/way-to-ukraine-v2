import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateProjectsOverview: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating projects overview page')
    revalidatePath('/projects')
    revalidatePath('/ua/projects')
    revalidatePath('/en/projects')
    revalidateTag('global_projects-overview_uk')
    revalidateTag('global_projects-overview_en')
  }

  return doc
}
