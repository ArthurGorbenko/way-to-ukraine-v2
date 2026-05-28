import type { FieldHook } from 'payload'

const translitMap: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g',
  'д': 'd', 'е': 'e', 'є': 'ye', 'ж': 'zh', 'з': 'z',
  'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k',
  'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p',
  'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f',
  'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
  'ь': '', 'ю': 'yu', 'я': 'ya',
}

function transliterate(text: string): string {
  return text.toLowerCase().split('')
    .map((ch) => translitMap[ch] || ch)
    .join('')
}

function extractLocalized(value: any): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  const v = Object.values(value).find((v) => typeof v === 'string' && v)
  return (v as string) || ''
}

export const generateSlug: FieldHook = ({ data, value }) => {
  if (value) return value

  const title = extractLocalized((data as any)?.cardTitle)

  if (!title) return value

  const slug = transliterate(title)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')

  return slug || undefined
}
