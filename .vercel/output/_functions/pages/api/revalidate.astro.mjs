import { e as env, c as cache } from '../../chunks/env_BCDX6XaS.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  const secret = request.headers.get("x-revalidate-secret");
  if (env.REVALIDATE_SECRET && secret !== env.REVALIDATE_SECRET) {
    return new Response(JSON.stringify({ error: "Invalid secret" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    let body = null;
    try {
      body = await request.json();
    } catch {
    }
    let purged;
    if (body?.post_type || body?.slug) {
      purged = cache.clearByPrefix("gql:");
      cache.delete("wp:content-types");
      purged += 1;
    } else {
      purged = cache.size();
      cache.clear();
    }
    return new Response(
      JSON.stringify({ success: true, purged }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Revalidation failed", details: String(error) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
const GET = async ({ request }) => {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  if (env.REVALIDATE_SECRET && secret !== env.REVALIDATE_SECRET) {
    return new Response(JSON.stringify({ error: "Invalid secret" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const purged = cache.size();
  cache.clear();
  return new Response(
    JSON.stringify({ success: true, purged }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
