import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_2mt_V2V1.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_C_i7LX9C.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Page introuvable" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-32 text-center"> <h1 class="text-6xl font-bold text-taupe mb-6">404</h1> <p class="text-xl text-taupe/70 mb-8">Cette page n'existe pas ou a été déplacée.</p> <a href="/" class="inline-block bg-sauge text-white px-6 py-3 rounded-lg hover:bg-taupe transition-colors">
Retour à l'accueil
</a> </div> ` })}`;
}, "C:/DEV/orlane/src/pages/404.astro", void 0);

const $$file = "C:/DEV/orlane/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
