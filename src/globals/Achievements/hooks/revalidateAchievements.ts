import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateAchievements: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating achievements')
    revalidatePath('/achievements')
    revalidatePath('/ua/achievements')
    revalidatePath('/en/achievements')
    revalidateTag('global_achievements_uk')
    revalidateTag('global_achievements_en')
  }

  return doc
}
