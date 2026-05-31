import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateActiveProjects: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating active projects')
    revalidatePath('/')
    revalidatePath('/ua')
    revalidatePath('/en')
    revalidatePath('/achievements')
    revalidatePath('/ua/achievements')
    revalidatePath('/en/achievements')
    revalidatePath('/projects/active')
    revalidatePath('/projects/active/details')
    revalidatePath('/projects/active/donate')
    revalidatePath('/ua/projects/active')
    revalidatePath('/ua/projects/active/details')
    revalidatePath('/ua/projects/active/donate')
    revalidatePath('/en/projects/active')
    revalidatePath('/en/projects/active/details')
    revalidatePath('/en/projects/active/donate')
    revalidateTag('global_homepage_uk')
    revalidateTag('global_homepage_en')
    revalidateTag('global_achievements_uk')
    revalidateTag('global_achievements_en')
    revalidateTag('global_active-projects_uk')
    revalidateTag('global_active-projects_en')
  }

  return doc
}
