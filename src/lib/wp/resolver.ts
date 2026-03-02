import { getPageBySlug, getPostBySlug } from './queries';
import { getCustomPostTypes, getCPTArchive, getCPTSingle } from './cpt';
import { getAvailableContentTypes } from './content-types';
import { fetchGraphQLWithAuth } from './fetcher';
import { env } from '../env';
import type { ContentType } from './content-types';
import type { WPPage, WPPost, WPPostPreview } from '../../types/wp';

export type ResolvedContent =
  | { type: 'page'; data: WPPage }
  | { type: 'post'; data: WPPost }
  | { type: 'cpt-archive'; contentType: ContentType; data: WPPostPreview[] }
  | { type: 'cpt-single'; contentType: ContentType; data: WPPost };

/**
 * Resolves a URL slug (or slug segments) to the matching WordPress content.
 *
 * Priority:
 * 1. CPT archive (slug matches a CPT plural name, e.g. "projects")
 * 2. WordPress page
 * 3. WordPress post
 * 4. CPT single item (tries all registered CPTs)
 */
export async function resolveContent(slugParts: string[]): Promise<ResolvedContent | null> {
  const slug = slugParts[slugParts.length - 1];
  const fullPath = slugParts.join('/');

  // Multi-segment path: try as CPT item first (e.g. "projects/mon-projet")
  if (slugParts.length > 1) {
    const typeSlug = slugParts[0];
    const itemSlug = slugParts.slice(1).join('/');
    const cptResult = await getCPTSingle(typeSlug, itemSlug);
    if (cptResult) {
      return { type: 'cpt-single', contentType: cptResult.type, data: cptResult.item };
    }

    // Try as hierarchical page (e.g. "parent/child")
    const page = await tryPage(fullPath);
    if (page) return page;

    return null;
  }

  // Single-segment path: try in priority order

  // 1. CPT archive?
  const archive = await getCPTArchive(slug);
  if (archive) {
    return { type: 'cpt-archive', contentType: archive.type, data: archive.items };
  }

  // 2. Page?
  const page = await tryPage(slug);
  if (page) return page;

  // 3. Post?
  const post = await tryPost(slug);
  if (post) return post;

  // 4. CPT single item? (try all CPTs in parallel)
  const cptItem = await tryCPTItem(slug);
  if (cptItem) return cptItem;

  return null;
}

async function tryPage(slug: string): Promise<ResolvedContent | null> {
  try {
    const page = await getPageBySlug(slug) as WPPage | null;
    if (page) return { type: 'page', data: page };
  } catch { /* not found */ }
  return null;
}

async function tryPost(slug: string): Promise<ResolvedContent | null> {
  try {
    const post = await getPostBySlug(slug) as WPPost | null;
    if (post) return { type: 'post', data: post };
  } catch { /* not found */ }
  return null;
}

async function tryCPTItem(slug: string): Promise<ResolvedContent | null> {
  const types = await getCustomPostTypes();

  const results = await Promise.all(
    types.map(async (ct) => {
      const result = await getCPTSingle(ct.graphqlPluralName, slug);
      if (result) {
        return { type: 'cpt-single' as const, contentType: result.type, data: result.item };
      }
      return null;
    })
  );

  return results.find(r => r !== null) || null;
}

/**
 * Resolve preview content by database ID and post type.
 * Validates the shared secret, then fetches the draft/revision via
 * authenticated GraphQL with `asPreview: true`.
 */
export async function resolvePreviewContent(
  secret: string,
  id: string,
  postType: string
): Promise<ResolvedContent | null> {
  if (!env.WP_PREVIEW_SECRET || secret !== env.WP_PREVIEW_SECRET) {
    return null;
  }
  if (!env.WP_AUTH_TOKEN) {
    return null;
  }

  const singleName = await resolveGraphQLSingleName(postType);

  const query = `
    query PreviewContent($id: ID!) {
      ${singleName}(id: $id, idType: DATABASE_ID, asPreview: true) {
        id
        title
        content
        slug
        date
        modified
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails { width height }
          }
        }
        ${singleName !== 'page' ? `
        excerpt
        author {
          node {
            name
            avatar { url }
          }
        }
        categories {
          nodes { name slug }
        }
        tags {
          nodes { name slug }
        }
        ` : ''}
      }
    }
  `;

  const data = await fetchGraphQLWithAuth<Record<string, unknown>>(
    query,
    { id },
    env.WP_AUTH_TOKEN
  );

  const item = data[singleName];
  if (!item) return null;

  if (postType === 'page') {
    return { type: 'page', data: item as WPPage };
  }

  if (postType === 'post') {
    return { type: 'post', data: item as WPPost };
  }

  // CPT
  const types = await getAvailableContentTypes();
  const ct = types.find(
    t => t.graphqlSingleName.toLowerCase() === singleName.toLowerCase()
  );
  if (ct) {
    return { type: 'cpt-single', contentType: ct, data: item as WPPost };
  }

  return { type: 'post', data: item as WPPost };
}

async function resolveGraphQLSingleName(postType: string): Promise<string> {
  const builtIn: Record<string, string> = { post: 'post', page: 'page' };
  if (builtIn[postType]) return builtIn[postType];

  const types = await getAvailableContentTypes();
  const match = types.find(
    t =>
      t.name.toLowerCase() === postType.toLowerCase() ||
      t.graphqlSingleName.toLowerCase() === postType.toLowerCase()
  );
  return match?.graphqlSingleName || postType;
}
