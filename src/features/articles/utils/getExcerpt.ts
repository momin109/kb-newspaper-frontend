/**
 * The backend's Article model has no `excerpt` field — this derives a
 * short plain-text preview from `content` (which may contain HTML) by
 * stripping tags and truncating. TODO: switch to a real `excerpt` field
 * once/if it's added to the backend model.
 */
export function getExcerpt(content: string, maxLength = 120): string {
  const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (plainText.length <= maxLength) return plainText
  return plainText.slice(0, maxLength).trimEnd() + '…'
}
