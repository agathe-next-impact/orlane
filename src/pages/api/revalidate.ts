import type { APIRoute } from 'astro';
import { cache } from '../../lib/cache';
import { env } from '../../lib/env';

/**
 * Webhook endpoint for WordPress cache invalidation.
 *
 * WordPress calls this endpoint on publish/update/delete to purge
 * the Astro in-memory cache so fresh content is served immediately.
 *
 * Usage from WordPress (WPGraphQL Send Hooks or custom plugin):
 *   POST /api/revalidate
 *   Headers: { "x-revalidate-secret": "<REVALIDATE_SECRET>" }
 *   Body (optional): { "post_type": "post", "slug": "my-post" }
 *
 * Without body: purges the entire cache.
 * With body: purges only GraphQL cache entries (targeted).
 */
export const POST: APIRoute = async ({ request }) => {
  const secret = request.headers.get('x-revalidate-secret');

  if (env.REVALIDATE_SECRET && secret !== env.REVALIDATE_SECRET) {
    return new Response(JSON.stringify({ error: 'Invalid secret' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    let body: { post_type?: string; slug?: string } | null = null;
    try {
      body = await request.json();
    } catch {
      // No body or invalid JSON — will do a full purge
    }

    let purged: number;

    if (body?.post_type || body?.slug) {
      // Targeted purge: clear all GraphQL query cache + content types
      purged = cache.clearByPrefix('gql:');
      cache.delete('wp:content-types');
      purged += 1;
    } else {
      // Full purge
      purged = cache.size();
      cache.clear();
    }

    return new Response(
      JSON.stringify({ success: true, purged }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Revalidation failed', details: String(error) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// Also support GET for easy manual testing
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');

  if (env.REVALIDATE_SECRET && secret !== env.REVALIDATE_SECRET) {
    return new Response(JSON.stringify({ error: 'Invalid secret' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const purged = cache.size();
  cache.clear();

  return new Response(
    JSON.stringify({ success: true, purged }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
