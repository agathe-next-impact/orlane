import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_2mt_V2V1.mjs';
import 'piccolore';
import { a as getItemsCountByType, $ as $$Layout } from '../chunks/Layout_C_i7LX9C.mjs';
import '../chunks/content-types_pFgWyyhj.mjs';
import '../chunks/env_BCDX6XaS.mjs';
import { g as getCustomPostTypes, a as getCPTArchiveUrl } from '../chunks/cpt_CRwQCxEI.mjs';
/* empty css                                         */
export { renderers } from '../renderers.mjs';

const $$ContentTypes = createComponent(async ($$result, $$props, $$slots) => {
  const contentTypes = await getCustomPostTypes();
  let contentCounts = {};
  try {
    const countPromises = contentTypes.map(async (type) => {
      try {
        const count = await getItemsCountByType(type.graphqlPluralName);
        return { key: type.graphqlSingleName, count };
      } catch {
        return { key: type.graphqlSingleName, count: 0 };
      }
    });
    const counts = await Promise.all(countPromises);
    counts.forEach(({ key, count }) => {
      contentCounts[key] = count;
    });
  } catch (error) {
    console.error("Error fetching content types:", error);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Content Types", "description": "Browse all available content types from WordPress", "data-astro-cid-xa3wtfvf": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="content-types-page" data-astro-cid-xa3wtfvf> <div class="page-header bg-gradient-to-br from-beige to-creme py-16" data-astro-cid-xa3wtfvf> <div class="container mx-auto px-4" data-astro-cid-xa3wtfvf> <h1 class="text-5xl font-bold text-center mb-4 text-taupe" data-astro-cid-xa3wtfvf>Content Types</h1> <p class="text-xl text-center text-taupe/70 max-w-2xl mx-auto" data-astro-cid-xa3wtfvf>
Explore all available content types from your WordPress site
</p> </div> </div> <div class="container mx-auto px-4 py-16" data-astro-cid-xa3wtfvf> ${contentTypes.length > 0 ? renderTemplate`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-astro-cid-xa3wtfvf> ${contentTypes.map((type) => renderTemplate`<a${addAttribute(getCPTArchiveUrl(type), "href")} class="content-type-card bg-creme rounded-lg border border-beige p-6 hover:shadow-md transition-shadow" data-astro-cid-xa3wtfvf> <div class="flex items-start justify-between mb-4" data-astro-cid-xa3wtfvf> <h2 class="text-2xl font-bold text-taupe" data-astro-cid-xa3wtfvf>${type.name}</h2> <span class="bg-beige text-taupe px-3 py-1 rounded-full text-sm font-semibold" data-astro-cid-xa3wtfvf> ${contentCounts[type.graphqlSingleName] || 0} </span> </div> <div class="text-sm text-taupe/70 space-y-1" data-astro-cid-xa3wtfvf> <p data-astro-cid-xa3wtfvf><span class="font-semibold" data-astro-cid-xa3wtfvf>Single:</span> ${type.graphqlSingleName}</p> <p data-astro-cid-xa3wtfvf><span class="font-semibold" data-astro-cid-xa3wtfvf>Plural:</span> ${type.graphqlPluralName}</p> </div> <div class="mt-4 text-sauge font-semibold flex items-center gap-2" data-astro-cid-xa3wtfvf>
View All
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-xa3wtfvf> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-astro-cid-xa3wtfvf></path> </svg> </div> </a>`)} </div>` : renderTemplate`<div class="text-center py-16" data-astro-cid-xa3wtfvf> <p class="text-xl text-taupe/70 mb-4" data-astro-cid-xa3wtfvf>
No content types found. Check your WordPress connection.
</p> </div>`} </div> </div> ` })} `;
}, "C:/DEV/orlane/src/pages/content-types.astro", void 0);

const $$file = "C:/DEV/orlane/src/pages/content-types.astro";
const $$url = "/content-types";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ContentTypes,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
