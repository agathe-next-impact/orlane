import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // Normalize double slashes (e.g. //api/preview → /api/preview)
  const url = new URL(context.request.url);
  const cleaned = url.pathname.replace(/\/{2,}/g, '/');
  if (cleaned !== url.pathname) {
    return context.redirect(cleaned + url.search, 301);
  }

  const response = await next();

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('text/html')) {
    // Force browser to always revalidate HTML pages with the server.
    // The Astro in-memory cache (30s TTL) handles server-side caching;
    // this header ensures the browser never serves stale HTML silently.
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }

  return response;
});
