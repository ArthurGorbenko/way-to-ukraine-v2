import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateAbout: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating about page')
    revalidatePath('/about')
    revalidatePath('/ua/about')
    revalidatePath('/en/about')
    revalidateTag('global_about_uk')
    revalidateTag('global_about_en')
  }

  return doc
}
