import { c as createComponent, e as createAstro, m as maybeRenderHead, b as addAttribute, a as renderTemplate, r as renderComponent, u as unescapeHTML } from './astro/server_2mt_V2V1.mjs';
import 'piccolore';
import sanitize from 'sanitize-html';
import 'clsx';
/* empty css                          */

const SANITIZE_CONFIG = {
  allowedTags: [
    // Text
    "p",
    "br",
    "span",
    "div",
    "section",
    "article",
    "aside",
    "header",
    "footer",
    "nav",
    "main",
    "a",
    "strong",
    "em",
    "b",
    "i",
    "u",
    "s",
    "strike",
    "mark",
    "small",
    "sub",
    "sup",
    "abbr",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "dl",
    "dt",
    "dd",
    "blockquote",
    "pre",
    "code",
    // Media
    "img",
    "figure",
    "figcaption",
    "picture",
    "source",
    "video",
    "audio",
    "iframe",
    // Table
    "table",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "th",
    "td",
    "caption",
    "colgroup",
    "col",
    // Interactive
    "details",
    "summary",
    "button",
    "hr"
  ],
  allowedAttributes: {
    "a": ["href", "title", "target", "rel"],
    "img": ["src", "srcset", "sizes", "alt", "width", "height", "loading", "decoding", "fetchpriority"],
    "source": ["src", "srcset", "sizes", "type", "media"],
    "video": ["src", "controls", "autoplay", "loop", "muted", "preload", "poster", "width", "height"],
    "audio": ["src", "controls", "autoplay", "loop", "muted", "preload"],
    "iframe": ["src", "width", "height", "allow", "allowfullscreen", "frameborder", "title"],
    "th": ["colspan", "rowspan", "scope"],
    "td": ["colspan", "rowspan"],
    "*": ["class", "id", "style", "aria-hidden", "aria-label", "aria-describedby", "aria-expanded", "role", "data-*"]
  },
  allowedIframeHostnames: ["www.youtube.com", "youtube.com", "player.vimeo.com", "open.spotify.com"]
};
function sanitizeHTML(html) {
  if (!html) return "";
  return sanitize(html, SANITIZE_CONFIG);
}
function decodeWPEntities(text) {
  if (!text) return "";
  return text.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code))).replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16))).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&apos;/g, "'").replace(/&nbsp;/g, " ").replace(/&eacute;/g, "é").replace(/&egrave;/g, "è").replace(/&ecirc;/g, "ê").replace(/&agrave;/g, "à").replace(/&ccedil;/g, "ç").replace(/&ouml;/g, "ö").replace(/&uuml;/g, "ü");
}
function sanitizeExcerpt(excerpt) {
  if (!excerpt) return "";
  return sanitize(excerpt, {
    allowedTags: ["p", "br", "strong", "em", "a"],
    allowedAttributes: { "a": ["href"] }
  });
}

function formatDate(dateString, locale = "en-US") {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

const $$Astro$1 = createAstro();
const $$WPImage = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$WPImage;
  const {
    image,
    class: className = "",
    loading: loadingProp,
    sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
    width,
    height,
    priority = false,
    fetchpriority: fetchpriorityProp,
    alt: altProp,
    context
  } = Astro2.props;
  const loading = priority ? "eager" : loadingProp || "lazy";
  const fetchpriority = priority ? "high" : fetchpriorityProp || (loading === "lazy" ? "low" : "auto");
  if (!image) {
    return null;
  }
  const imgData = "node" in image ? image.node : image;
  const imgWidth = width || imgData.mediaDetails?.width || 800;
  const imgHeight = height || imgData.mediaDetails?.height || 600;
  const baseAlt = decodeWPEntities(altProp || imgData.altText || "");
  const altText = context && baseAlt ? `${baseAlt} - ${context}` : context ? context : baseAlt || "Image";
  function getOptimizedUrl(url, width2) {
    if (!url) return "";
    const urlObj = new URL(url);
    urlObj.searchParams.set("w", width2.toString());
    urlObj.searchParams.set("quality", "80");
    return urlObj.toString();
  }
  const srcset = [320, 640, 768, 1024, 1280, 1536].filter((w) => w <= imgWidth).map((w) => `${getOptimizedUrl(imgData.sourceUrl, w)} ${w}w`).join(", ");
  return renderTemplate`${imgData.sourceUrl && renderTemplate`${maybeRenderHead()}<img${addAttribute(getOptimizedUrl(imgData.sourceUrl, imgWidth), "src")}${addAttribute(srcset, "srcset")}${addAttribute(sizes, "sizes")}${addAttribute(altText, "alt")}${addAttribute(imgWidth, "width")}${addAttribute(imgHeight, "height")}${addAttribute(loading, "loading")}${addAttribute(fetchpriority, "fetchpriority")}${addAttribute(className, "class")} decoding="async">`}`;
}, "C:/DEV/orlane/src/components/WPImage.astro", void 0);

const $$Astro = createAstro();
const $$PostCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PostCard;
  const { post, basePath = "/blog" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article class="post-card bg-creme rounded-lg border border-beige overflow-hidden hover:shadow-md transition-shadow" data-astro-cid-iyiqi2so> ${post.featuredImage && renderTemplate`<a${addAttribute(`${basePath}/${post.slug}`, "href")} class="block" data-astro-cid-iyiqi2so> ${renderComponent($$result, "WPImage", $$WPImage, { "image": post.featuredImage, "class": "w-full h-64 object-cover", "loading": "lazy", "sizes": "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw", "context": `Featured image for ${decodeWPEntities(post.title)}`, "data-astro-cid-iyiqi2so": true })} </a>`} <div class="p-6" data-astro-cid-iyiqi2so> ${post.categories?.nodes && post.categories.nodes.length > 0 && renderTemplate`<div class="flex flex-wrap gap-2 mb-3" data-astro-cid-iyiqi2so> ${post.categories.nodes.slice(0, 2).map((category) => renderTemplate`<span class="text-xs bg-beige text-taupe px-3 py-1 rounded-full" data-astro-cid-iyiqi2so> ${decodeWPEntities(category.name)} </span>`)} </div>`} <h2 class="text-2xl font-bold mb-3" data-astro-cid-iyiqi2so> <a${addAttribute(`${basePath}/${post.slug}`, "href")} class="hover:text-sauge transition-colors" data-astro-cid-iyiqi2so> ${decodeWPEntities(post.title)} </a> </h2> ${post.excerpt && renderTemplate`<div class="text-taupe/70 mb-4 line-clamp-3" data-astro-cid-iyiqi2so>${unescapeHTML(sanitizeExcerpt(post.excerpt))}</div>`} <div class="flex items-center gap-4 text-sm text-taupe/60" data-astro-cid-iyiqi2so> ${post.date && renderTemplate`<div class="flex items-center gap-1" data-astro-cid-iyiqi2so> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-iyiqi2so> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-astro-cid-iyiqi2so></path> </svg> <time${addAttribute(post.date, "datetime")} data-astro-cid-iyiqi2so>${formatDate(post.date)}</time> </div>`} ${post.author && renderTemplate`<div class="flex items-center gap-1" data-astro-cid-iyiqi2so> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-iyiqi2so> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" data-astro-cid-iyiqi2so></path> </svg> <span data-astro-cid-iyiqi2so>${decodeWPEntities(post.author.node.name)}</span> </div>`} </div> </div> </article> `;
}, "C:/DEV/orlane/src/components/PostCard.astro", void 0);

export { $$PostCard as $, $$WPImage as a, decodeWPEntities as d, formatDate as f, sanitizeHTML as s };
