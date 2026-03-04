import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_2mt_V2V1.mjs';
import 'piccolore';
import { g as getAllPosts, $ as $$Layout } from '../chunks/Layout_C_i7LX9C.mjs';
import { $ as $$PostCard } from '../chunks/PostCard_eOGhWQ8e.mjs';
import '../chunks/content-types_pFgWyyhj.mjs';
import '../chunks/env_BCDX6XaS.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  let posts = [];
  try {
    posts = await getAllPosts();
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Blog", "description": "Read our latest blog posts and articles" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="blog-index"> <div class="page-header bg-gradient-to-br from-beige to-creme py-16"> <div class="container mx-auto px-4"> <h1 class="text-5xl font-bold text-center mb-4 text-taupe">Blog</h1> <p class="text-xl text-center text-taupe/70 max-w-2xl mx-auto">
Explore our latest articles and insights
</p> </div> </div> <div class="container mx-auto px-4 py-16"> ${posts.length > 0 ? renderTemplate`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> ${posts.map((post) => renderTemplate`${renderComponent($$result2, "PostCard", $$PostCard, { "post": post })}`)} </div>` : renderTemplate`<div class="text-center py-16"> <p class="text-xl text-taupe/70">No posts found. Check your WordPress connection.</p> </div>`} </div> </div> ` })}`;
}, "C:/DEV/orlane/src/pages/blog/index.astro", void 0);

const $$file = "C:/DEV/orlane/src/pages/blog/index.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
