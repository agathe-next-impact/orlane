import DOMPurify from 'isomorphic-dompurify';

/**
 * Configuration for HTML sanitization
 * Allows common WordPress content tags while removing potentially dangerous elements
 */
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    // Text
    'p', 'br', 'span', 'div', 'section', 'article', 'aside', 'header', 'footer', 'nav', 'main',
    'a', 'strong', 'em', 'b', 'i', 'u', 's', 'strike', 'mark', 'small', 'sub', 'sup', 'abbr',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    'blockquote', 'pre', 'code',
    // Media
    'img', 'figure', 'figcaption', 'picture', 'source',
    'video', 'audio', 'iframe',
    // Table
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
    // Interactive
    'details', 'summary', 'button',
    'hr',
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'target', 'rel',
    'src', 'srcset', 'sizes', 'alt', 'width', 'height', 'loading', 'decoding', 'fetchpriority',
    'class', 'id', 'style',
    'aria-hidden', 'aria-label', 'aria-describedby', 'aria-expanded', 'role',
    'type', 'media',
    // Video/audio/iframe
    'controls', 'autoplay', 'loop', 'muted', 'preload', 'poster',
    'allow', 'allowfullscreen', 'frameborder',
    // Table
    'colspan', 'rowspan', 'scope',
  ],
  ALLOW_DATA_ATTR: true,
  ALLOW_UNKNOWN_PROTOCOLS: false,
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 *
 * @param html - Raw HTML string from WordPress
 * @returns Sanitized HTML safe for rendering
 */
export function sanitizeHTML(html: string | null | undefined): string {
  if (!html) return '';

  return DOMPurify.sanitize(html, SANITIZE_CONFIG);
}

/**
 * Sanitizes HTML excerpt with stricter rules
 * Removes all formatting except basic text styling
 *
 * @param excerpt - Raw excerpt HTML from WordPress
 * @returns Sanitized excerpt with minimal formatting
 */
/**
 * Decodes HTML entities in WordPress text fields (titles, excerpts, etc.)
 * WordPress RENDERED format may return entities like &#8217; &amp; &eacute;
 * that would be double-encoded by Astro's auto-escaping.
 */
export function decodeWPEntities(text: string | null | undefined): string {
  if (!text) return '';

  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, '\u00A0')
    .replace(/&eacute;/g, 'é')
    .replace(/&egrave;/g, 'è')
    .replace(/&ecirc;/g, 'ê')
    .replace(/&agrave;/g, 'à')
    .replace(/&ccedil;/g, 'ç')
    .replace(/&ouml;/g, 'ö')
    .replace(/&uuml;/g, 'ü');
}

export function sanitizeExcerpt(excerpt: string | null | undefined): string {
  if (!excerpt) return '';

  return DOMPurify.sanitize(excerpt, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a'],
    ALLOWED_ATTR: ['href'],
  });
}
