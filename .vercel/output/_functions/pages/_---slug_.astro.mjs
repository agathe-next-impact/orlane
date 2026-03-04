import { c as createComponent, e as createAstro, m as maybeRenderHead, b as addAttribute, a as renderTemplate, r as renderComponent, u as unescapeHTML } from '../chunks/astro/server_2mt_V2V1.mjs';
import 'piccolore';
import { b as getPageBySlug, c as getPostBySlug, $ as $$Layout } from '../chunks/Layout_C_i7LX9C.mjs';
import { d as decodeWPEntities, $ as $$PostCard, a as $$WPImage, s as sanitizeHTML, f as formatDate } from '../chunks/PostCard_eOGhWQ8e.mjs';
import { f as fetchGraphQLWithAuth, g as getAvailableContentTypes } from '../chunks/content-types_pFgWyyhj.mjs';
import { e as env } from '../chunks/env_BCDX6XaS.mjs';
import { b as getCPTSingle, c as getCPTArchive, g as getCustomPostTypes, a as getCPTArchiveUrl } from '../chunks/cpt_CRwQCxEI.mjs';
export { renderers } from '../renderers.mjs';

async function resolveContent(slugParts) {
  const slug = slugParts[slugParts.length - 1];
  const fullPath = slugParts.join("/");
  if (slugParts.length > 1) {
    const typeSlug = slugParts[0];
    const itemSlug = slugParts.slice(1).join("/");
    const cptResult = await getCPTSingle(typeSlug, itemSlug);
    if (cptResult) {
      return { type: "cpt-single", contentType: cptResult.type, data: cptResult.item };
    }
    const page2 = await tryPage(fullPath);
    if (page2) return page2;
    return null;
  }
  const archive = await getCPTArchive(slug);
  if (archive) {
    return { type: "cpt-archive", contentType: archive.type, data: archive.items };
  }
  const page = await tryPage(slug);
  if (page) return page;
  const post = await tryPost(slug);
  if (post) return post;
  const cptItem = await tryCPTItem(slug);
  if (cptItem) return cptItem;
  return null;
}
async function tryPage(slug) {
  try {
    const page = await getPageBySlug(slug);
    if (page) return { type: "page", data: page };
  } catch {
  }
  return null;
}
async function tryPost(slug) {
  try {
    const post = await getPostBySlug(slug);
    if (post) return { type: "post", data: post };
  } catch {
  }
  return null;
}
async function tryCPTItem(slug) {
  const types = await getCustomPostTypes();
  const results = await Promise.all(
    types.map(async (ct) => {
      const result = await getCPTSingle(ct.graphqlPluralName, slug);
      if (result) {
        return { type: "cpt-single", contentType: result.type, data: result.item };
      }
      return null;
    })
  );
  return results.find((r) => r !== null) || null;
}
async function resolvePreviewContent(secret, id, postType) {
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
        ${singleName !== "page" ? `
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
        ` : ""}
      }
    }
  `;
  const data = await fetchGraphQLWithAuth(
    query,
    { id },
    env.WP_AUTH_TOKEN
  );
  const item = data[singleName];
  if (!item) return null;
  if (postType === "page") {
    return { type: "page", data: item };
  }
  if (postType === "post") {
    return { type: "post", data: item };
  }
  const types = await getAvailableContentTypes();
  const ct = types.find(
    (t) => t.graphqlSingleName.toLowerCase() === singleName.toLowerCase()
  );
  if (ct) {
    return { type: "cpt-single", contentType: ct, data: item };
  }
  return { type: "post", data: item };
}
async function resolveGraphQLSingleName(postType) {
  const builtIn = { post: "post", page: "page" };
  if (builtIn[postType]) return builtIn[postType];
  const types = await getAvailableContentTypes();
  const match = types.find(
    (t) => t.name.toLowerCase() === postType.toLowerCase() || t.graphqlSingleName.toLowerCase() === postType.toLowerCase()
  );
  return match?.graphqlSingleName || postType;
}

const $$Astro = createAstro();
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { slug } = Astro2.params;
  const url = new URL(Astro2.request.url);
  const secret = url.searchParams.get("secret");
  const previewId = url.searchParams.get("id");
  const postType = url.searchParams.get("postType");
  let resolved;
  let isPreview = false;
  if (secret && previewId && postType) {
    resolved = await resolvePreviewContent(secret, previewId, postType);
    if (resolved) {
      isPreview = true;
    }
  }
  if (!resolved) {
    if (!slug) {
      return Astro2.redirect("/404");
    }
    const slugParts = slug.split("/").filter(Boolean);
    resolved = await resolveContent(slugParts);
  }
  if (!resolved) {
    return Astro2.redirect("/404");
  }
  return renderTemplate`${isPreview && renderTemplate`${maybeRenderHead()}<div style="position:sticky;top:0;z-index:9999;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:10px 20px;display:flex;align-items:center;justify-content:space-between;font-size:14px;box-shadow:0 2px 10px rgba(0,0,0,0.15);"><div><strong>Mode Preview</strong><span style="display:inline-block;padding:2px 8px;border-radius:4px;background:rgba(255,255,255,0.2);font-size:12px;margin-left:8px;">${postType}</span></div><a${addAttribute(`/${slug || ""}`, "href")} style="color:white;text-decoration:underline;opacity:0.9;">Voir la version publiée &rarr;</a></div>`}${resolved.type === "cpt-archive" && renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": resolved.contentType.name, "description": `Browse all ${resolved.contentType.name.toLowerCase()}` }, { "default": async ($$result2) => renderTemplate`<div class="archive-page"><div class="page-header bg-gradient-to-br from-beige to-creme py-16"><div class="container mx-auto px-4"><h1 class="text-5xl font-bold text-center mb-4 text-taupe">${resolved.contentType.name}</h1><p class="text-xl text-center text-taupe/70 max-w-2xl mx-auto">
Explore all ${resolved.contentType.name.toLowerCase()}</p></div></div><div class="container mx-auto px-4 py-16">${resolved.data.length > 0 ? renderTemplate`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">${resolved.data.map((item) => renderTemplate`${renderComponent($$result2, "PostCard", $$PostCard, { "post": item, "basePath": getCPTArchiveUrl(resolved.contentType) })}`)}</div>` : renderTemplate`<div class="text-center py-16"><p class="text-xl text-taupe/70">No ${resolved.contentType.name.toLowerCase()} found.</p></div>`}</div></div>` })}`}${resolved.type === "page" && renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": decodeWPEntities(resolved.data.title), "description": `Page: ${decodeWPEntities(resolved.data.title)}` }, { "default": async ($$result2) => renderTemplate`<article class="page"><div class="page-header bg-gradient-to-br from-beige to-creme py-16"><div class="container mx-auto px-4"><h1 class="text-5xl font-bold text-center max-w-4xl mx-auto mb-6 text-taupe">${decodeWPEntities(resolved.data.title)}</h1></div></div>${resolved.data.featuredImage && renderTemplate`<div class="container mx-auto px-4 py-8"><div class="max-w-4xl mx-auto">${renderComponent($$result2, "WPImage", $$WPImage, { "image": resolved.data.featuredImage, "class": "rounded-lg shadow-xl", "priority": true, "context": `Featured image for page: ${decodeWPEntities(resolved.data.title)}` })}</div></div>`}${resolved.data.content && renderTemplate`<div class="container mx-auto px-4 py-16"><div class="prose prose-lg max-w-4xl mx-auto"><div>${unescapeHTML(sanitizeHTML(resolved.data.content))}</div></div></div>`}</article>` })}`}${resolved.type === "post" && renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": decodeWPEntities(resolved.data.title), "seo": resolved.data.seo, "type": "article" }, { "default": async ($$result2) => renderTemplate`<article class="blog-post"><div class="post-header bg-gradient-to-br from-beige to-creme py-16"><div class="container mx-auto px-4"><div class="max-w-4xl mx-auto">${resolved.data.categories?.nodes && resolved.data.categories.nodes.length > 0 && renderTemplate`<div class="flex flex-wrap gap-2 mb-4">${resolved.data.categories.nodes.slice(0, 3).map((category) => renderTemplate`<span class="text-sm bg-beige text-taupe px-3 py-1 rounded-full">${decodeWPEntities(category.name)}</span>`)}</div>`}<h1 class="text-5xl font-bold mb-6 text-taupe">${decodeWPEntities(resolved.data.title)}</h1><div class="flex flex-wrap items-center gap-6 text-taupe/70">${resolved.data.author && renderTemplate`<div class="flex items-center gap-2">${resolved.data.author.node.avatar?.url && renderTemplate`<img${addAttribute(resolved.data.author.node.avatar.url, "src")}${addAttribute(decodeWPEntities(resolved.data.author.node.name), "alt")} class="w-10 h-10 rounded-full">`}<span>${decodeWPEntities(resolved.data.author.node.name)}</span></div>`}${resolved.data.date && renderTemplate`<time${addAttribute(resolved.data.date, "datetime")}>${formatDate(resolved.data.date)}</time>`}</div></div></div></div>${resolved.data.featuredImage && renderTemplate`<div class="container mx-auto px-4 -mt-8 mb-12"><div class="max-w-5xl mx-auto">${renderComponent($$result2, "WPImage", $$WPImage, { "image": resolved.data.featuredImage, "class": "w-full rounded-lg shadow-2xl", "priority": true, "sizes": "(max-width: 1280px) 100vw, 1280px", "context": `Featured image for article: ${decodeWPEntities(resolved.data.title)}` })}</div></div>`}<div class="container mx-auto px-4 py-8"><div class="max-w-4xl mx-auto">${resolved.data.content && renderTemplate`<div class="prose prose-lg max-w-none mb-12"><div>${unescapeHTML(sanitizeHTML(resolved.data.content))}</div></div>`}${resolved.data.tags?.nodes && resolved.data.tags.nodes.length > 0 && renderTemplate`<div class="border-t pt-8 mt-12"><div class="flex flex-wrap gap-2">${resolved.data.tags.nodes.map((tag) => renderTemplate`<span class="text-sm bg-beige text-taupe px-3 py-1 rounded-full">${decodeWPEntities(tag.name)}</span>`)}</div></div>`}</div></div></article>` })}`}${resolved.type === "cpt-single" && renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": decodeWPEntities(resolved.data.title), "seo": resolved.data.seo, "type": "article" }, { "default": async ($$result2) => renderTemplate`<article class="single-post"><div class="post-header bg-gradient-to-br from-beige to-creme py-16"><div class="container mx-auto px-4"><div class="max-w-4xl mx-auto"><div class="mb-4"><a${addAttribute(getCPTArchiveUrl(resolved.contentType), "href")} class="text-sm text-sauge hover:text-taupe inline-flex items-center gap-1 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
Back to ${resolved.contentType.name}</a></div><h1 class="text-5xl font-bold mb-6 text-taupe">${decodeWPEntities(resolved.data.title)}</h1><div class="flex flex-wrap items-center gap-6 text-taupe/70">${resolved.data.author && renderTemplate`<div class="flex items-center gap-2">${resolved.data.author.node.avatar?.url && renderTemplate`<img${addAttribute(resolved.data.author.node.avatar.url, "src")}${addAttribute(decodeWPEntities(resolved.data.author.node.name), "alt")} class="w-10 h-10 rounded-full">`}<span>${decodeWPEntities(resolved.data.author.node.name)}</span></div>`}${resolved.data.date && renderTemplate`<time${addAttribute(resolved.data.date, "datetime")}>${formatDate(resolved.data.date)}</time>`}</div></div></div></div>${resolved.data.featuredImage && renderTemplate`<div class="container mx-auto px-4 -mt-8 mb-12"><div class="max-w-5xl mx-auto">${renderComponent($$result2, "WPImage", $$WPImage, { "image": resolved.data.featuredImage, "class": "w-full rounded-lg shadow-2xl", "priority": true, "sizes": "(max-width: 1280px) 100vw, 1280px", "context": `Featured image for ${decodeWPEntities(resolved.data.title)}` })}</div></div>`}<div class="container mx-auto px-4 py-8"><div class="max-w-4xl mx-auto">${resolved.data.content ? renderTemplate`<div class="prose prose-lg max-w-none mb-12"><div>${unescapeHTML(sanitizeHTML(resolved.data.content))}</div></div>` : renderTemplate`<div class="text-center py-8"><p class="text-taupe/60">No content available</p></div>`}</div></div></article>` })}`}`;
}, "C:/DEV/orlane/src/pages/[...slug].astro", void 0);

const $$file = "C:/DEV/orlane/src/pages/[...slug].astro";
const $$url = "/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
