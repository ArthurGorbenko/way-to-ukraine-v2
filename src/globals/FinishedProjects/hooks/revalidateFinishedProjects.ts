import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateFinishedProjects: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating finished projects')
    revalidatePath('/')
    revalidatePath('/ua')
    revalidatePath('/en')
    revalidatePath('/achievements')
    revalidatePath('/ua/achievements')
    revalidatePath('/en/achievements')
    revalidatePath('/projects/finished')
    revalidatePath('/ua/projects/finished')
    revalidatePath('/en/projects/finished')
    revalidateTag('global_homepage_uk')
    revalidateTag('global_homepage_en')
    revalidateTag('global_achievements_uk')
    revalidateTag('global_achievements_en')
    revalidateTag('global_finished-projects_uk')
    revalidateTag('global_finished-projects_en')
  }

  return doc
}
