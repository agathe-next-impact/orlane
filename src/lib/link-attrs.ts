/**
 * Returns HTML attributes for a link based on its target.
 * Adds rel="noopener noreferrer" when target is "_blank".
 * Usage in Astro templates: <a href={url} {...linkAttrs(target)}>
 */
export function linkAttrs(target?: string | null): Record<string, string> {
  if (!target) return {};
  return target === '_blank'
    ? { target, rel: 'noopener noreferrer' }
    : { target };
}
