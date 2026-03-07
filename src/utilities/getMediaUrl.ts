import { getClientSideURL } from '@/utilities/getURL'

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  const appendCacheTag = (inputUrl: string): string => {
    if (!cacheTag) return inputUrl
    const separator = inputUrl.includes('?') ? '&' : '?'
    return `${inputUrl}${separator}${cacheTag}`
  }

  // Check if URL already has http/https protocol
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return appendCacheTag(url)
  }

  // Same-origin media should stay relative so Next can optimize it without relying on env-derived hosts.
  if (url.startsWith('/')) {
    return appendCacheTag(url)
  }

  // Otherwise prepend client-side URL
  const baseUrl = getClientSideURL()
  return appendCacheTag(`${baseUrl}${url}`)
}
