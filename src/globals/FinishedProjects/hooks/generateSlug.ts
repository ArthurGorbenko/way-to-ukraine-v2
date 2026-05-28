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

export const generateSlug: FieldHook = ({ data, value }) => {
  // Only auto-generate if slug is empty
  if (value) return value

  const unit = (data as any)?.unit || ''
  const vehicle = (data as any)?.vehicle || ''

  if (!unit && !vehicle) return value

  const raw = `${unit} ${vehicle}`.trim()
  const slug = transliterate(raw)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')

  return slug || undefined
}
