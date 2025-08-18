export function extractFirstImageUrl(
  markdown: string | undefined | null
): string | null {
  if (!markdown) return null;
  const match = markdown.match(/!\[[^\]]*]\((.*?)\)/);
  return match ? match[1] : null;
}
