import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateShop: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating shop page')
    revalidatePath('/shop')
    revalidatePath('/ua/shop')
    revalidatePath('/en/shop')
    revalidateTag('global_shop_uk')
    revalidateTag('global_shop_en')
  }

  return doc
}
