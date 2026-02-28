import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateActiveProjects: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating active projects')
    revalidatePath('/projects/active')
    revalidateTag('global_active-projects')
  }

  return doc
}
