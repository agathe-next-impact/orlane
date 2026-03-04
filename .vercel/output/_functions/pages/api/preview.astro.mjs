import { f as fetchGraphQLWithAuth, g as getAvailableContentTypes } from '../../chunks/content-types_pFgWyyhj.mjs';
import { e as env } from '../../chunks/env_BCDX6XaS.mjs';
export { renderers } from '../../renderers.mjs';

async function resolveGraphQLSingleName(postType) {
  const builtIn = { post: "post", page: "page" };
  if (builtIn[postType]) return builtIn[postType];
  const types = await getAvailableContentTypes();
  const match = types.find(
    (t) => t.name.toLowerCase() === postType.toLowerCase() || t.graphqlSingleName.toLowerCase() === postType.toLowerCase()
  );
  return match?.graphqlSingleName || postType;
}
const handler = async ({ request, redirect }) => {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  const id = url.searchParams.get("id");
  const postType = url.searchParams.get("postType");
  if (!env.WP_PREVIEW_SECRET || secret !== env.WP_PREVIEW_SECRET) {
    return new Response(
      JSON.stringify({ error: "Invalid preview secret" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  if (!id || !postType) {
    return new Response(
      JSON.stringify({ error: "Missing required parameters: id and postType" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  if (!env.WP_AUTH_TOKEN) {
    return new Response(
      JSON.stringify({
        error: "WP_AUTH_TOKEN is not configured. Cannot fetch preview content."
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    const singleName = await resolveGraphQLSingleName(postType);
    const slugQuery = `
      query PreviewSlug($id: ID!) {
        ${singleName}(id: $id, idType: DATABASE_ID) {
          slug
          uri
        }
      }
    `;
    const data = await fetchGraphQLWithAuth(
      slugQuery,
      { id },
      env.WP_AUTH_TOKEN
    );
    const post = data[singleName];
    const rawPath = post?.uri?.replace(/^\/|\/$/g, "") || post?.slug || `preview-${id}`;
    const encodedPath = rawPath.split("/").map((segment) => encodeURIComponent(segment)).join("/");
    const params = new URLSearchParams({
      secret,
      id,
      postType
    });
    return redirect(`/${encodedPath}?${params.toString()}`, 302);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Preview error:", error);
    return new Response(
      JSON.stringify({ error: "Preview failed", details: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const GET = handler;
const POST = handler;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
