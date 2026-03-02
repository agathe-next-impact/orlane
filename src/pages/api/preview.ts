import type { APIRoute } from 'astro';
import { fetchGraphQLWithAuth } from '../../lib/wp/fetcher';
import { getAvailableContentTypes } from '../../lib/wp/content-types';
import { env } from '../../lib/env';

/**
 * Resolve the WPGraphQL singular name for a given post type.
 * Built-in types: post → post, page → page.
 * CPTs: look up via content-types registry.
 */
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


const handler: APIRoute = async ({ request, redirect }) => {
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  const id = url.searchParams.get('id');
  const postType = url.searchParams.get('postType');
  // 1. Validate the preview secret
  if (!env.WP_PREVIEW_SECRET || secret !== env.WP_PREVIEW_SECRET) {
    return new Response(
      JSON.stringify({ error: 'Invalid preview secret' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 2. Validate required parameters
  if (!id || !postType) {
    return new Response(
      JSON.stringify({ error: 'Missing required parameters: id and postType' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 3. Check for auth token (needed to read drafts/revisions)
  if (!env.WP_AUTH_TOKEN) {
    return new Response(
      JSON.stringify({
        error: 'WP_AUTH_TOKEN is not configured. Cannot fetch preview content.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // 4. Resolve the GraphQL type name and fetch the canonical slug
    const singleName = await resolveGraphQLSingleName(postType);
    const slugQuery = `
      query PreviewSlug($id: ID!) {
        ${singleName}(id: $id, idType: DATABASE_ID) {
          slug
          uri
        }
      }
    `;

    const data = await fetchGraphQLWithAuth<Record<string, { slug?: string; uri?: string } | null>>(
      slugQuery,
      { id },
      env.WP_AUTH_TOKEN
    );

    const post = data[singleName];

    // Build the canonical path: prefer uri (includes parent hierarchy), fallback to slug, then id
    const rawPath = post?.uri?.replace(/^\/|\/$/g, '') || post?.slug || `preview-${id}`;

    // Encode each path segment individually to handle accented characters while preserving slashes
    const encodedPath = rawPath
      .split('/')
      .map(segment => encodeURIComponent(segment))
      .join('/');

    // 5. Redirect to /{slug}?secret=…&id=…&postType=… where [...slug].astro renders
    const params = new URLSearchParams({
      secret: secret!,
      id: id!,
      postType: postType!,
    });

    return redirect(`/${encodedPath}?${params.toString()}`, 302);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Preview error:', error);
    return new Response(
      JSON.stringify({ error: 'Preview failed', details: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const GET = handler;
export const POST = handler;
