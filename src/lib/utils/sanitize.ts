import sanitize from 'sanitize-html';

/**
 * Configuration for HTML sanitization
 * Allows common WordPress content tags while removing potentially dangerous elements
 */
const SANITIZE_CONFIG: sanitize.IOptions = {
  allowedTags: [
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
  allowedAttributes: {
    'a': ['href', 'title', 'target', 'rel'],
    'img': ['src', 'srcset', 'sizes', 'alt', 'width', 'height', 'loading', 'decoding', 'fetchpriority'],
    'source': ['src', 'srcset', 'sizes', 'type', 'media'],
    'video': ['src', 'controls', 'autoplay', 'loop', 'muted', 'preload', 'poster', 'width', 'height'],
    'audio': ['src', 'controls', 'autoplay', 'loop', 'muted', 'preload'],
    'iframe': ['src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder', 'title'],
    'th': ['colspan', 'rowspan', 'scope'],
    'td': ['colspan', 'rowspan'],
    '*': ['class', 'id', 'style', 'aria-hidden', 'aria-label', 'aria-describedby', 'aria-expanded', 'role', 'data-*'],
  },
  allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'player.vimeo.com', 'open.spotify.com'],
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export function sanitizeHTML(html: string | null | undefined): string {
  if (!html) return '';
  return sanitize(html, SANITIZE_CONFIG);
}

/**
 * Decodes HTML entities in WordPress text fields (titles, excerpts, etc.)
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

/**
 * Sanitizes HTML excerpt with stricter rules
 */
export function sanitizeExcerpt(excerpt: string | null | undefined): string {
  if (!excerpt) return '';

  return sanitize(excerpt, {
    allowedTags: ['p', 'br', 'strong', 'em', 'a'],
    allowedAttributes: { 'a': ['href'] },
  });
}
