import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateHomepage: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating homepage')
    revalidatePath('/')
    revalidatePath('/ua')
    revalidatePath('/en')
    revalidateTag('global_homepage_uk')
    revalidateTag('global_homepage_en')
  }

  return doc
}
