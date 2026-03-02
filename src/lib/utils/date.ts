/**
 * Date formatting utilities
 */

/**
 * Formats a date string to a readable format
 * @param dateString ISO date string
 * @param locale Locale for formatting (default: 'en-US')
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string,
  locale: string = 'en-US'
): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats a date string to a short format
 * @param dateString ISO date string
 * @param locale Locale for formatting (default: 'en-US')
 * @returns Short formatted date string
 */
export function formatDateShort(
  dateString: string,
  locale: string = 'en-US'
): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Gets a relative time string (e.g., "2 days ago")
 * @param dateString ISO date string
 * @returns Relative time string
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}
