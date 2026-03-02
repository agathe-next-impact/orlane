import DOMPurify from 'isomorphic-dompurify';

/**
 * Configuration for HTML sanitization
 * Allows common WordPress content tags while removing potentially dangerous elements
 */
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'span', 'div',
    'a', 'strong', 'em', 'b', 'i', 'u', 's', 'strike',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'img', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'hr',
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'target', 'rel',
    'src', 'alt', 'width', 'height',
    'class', 'id',
  ],
  ALLOW_DATA_ATTR: false,
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
export function sanitizeExcerpt(excerpt: string | null | undefined): string {
  if (!excerpt) return '';

  return DOMPurify.sanitize(excerpt, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a'],
    ALLOWED_ATTR: ['href'],
  });
}
