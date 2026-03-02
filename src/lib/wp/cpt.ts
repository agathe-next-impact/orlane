import { getAvailableContentTypes } from './content-types';
import { getAllItemsByType, getItemBySlug } from './queries';
import type { ContentType } from './content-types';
import type { WPPost, WPPostPreview } from '../../types/wp';

const EXCLUDED_TYPES = ['post', 'page', 'mediaitem'];

/**
 * Returns only custom post types (excludes posts, pages, mediaItems).
 */
export async function getCustomPostTypes(): Promise<ContentType[]> {
  const allTypes = await getAvailableContentTypes();
  return allTypes.filter(
    t => !EXCLUDED_TYPES.includes(t.graphqlSingleName.toLowerCase())
  );
}

/**
 * Resolves a URL slug to its ContentType config.
 * Matches against graphqlPluralName (used as URL slug).
 */
async function resolveContentType(slug: string): Promise<ContentType | null> {
  const types = await getCustomPostTypes();
  return types.find(
    t => t.graphqlPluralName.toLowerCase() === slug.toLowerCase()
  ) || null;
}

/**
 * Fetches archive data for a CPT: its config + all published items.
 * Returns null if the content type doesn't exist.
 */
export async function getCPTArchive(
  slug: string
): Promise<{ type: ContentType; items: WPPostPreview[] } | null> {
  const type = await resolveContentType(slug);
  if (!type) return null;

  try {
    const items = await getAllItemsByType(type.graphqlPluralName) as WPPostPreview[];
    return { type, items };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(`Error fetching CPT archive "${slug}":`, error);
    }
    return { type, items: [] };
  }
}

/**
 * Fetches a single item from a CPT.
 * Returns null if the content type or item doesn't exist.
 */
export async function getCPTSingle(
  typeSlug: string,
  itemSlug: string
): Promise<{ type: ContentType; item: WPPost } | null> {
  const type = await resolveContentType(typeSlug);
  if (!type) return null;

  try {
    const item = await getItemBySlug(type.graphqlPluralName, itemSlug) as WPPost | null;
    if (!item) return null;
    return { type, item };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(`Error fetching CPT single "${typeSlug}/${itemSlug}":`, error);
    }
    return null;
  }
}

/**
 * Returns the frontend archive URL for a content type.
 */
export function getCPTArchiveUrl(type: ContentType): string {
  return `/${type.graphqlPluralName}`;
}
