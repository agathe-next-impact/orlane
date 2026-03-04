import { c as createComponent, e as createAstro, b as addAttribute, a as renderTemplate, m as maybeRenderHead, r as renderComponent, f as renderHead, g as renderSlot } from './astro/server_2mt_V2V1.mjs';
import 'piccolore';
import 'clsx';
import { a as fetchGraphQL, g as getAvailableContentTypes } from './content-types_pFgWyyhj.mjs';
import { e as env } from './env_BCDX6XaS.mjs';
/* empty css                          */
import { $ as $$Image } from './_astro_assets_DHK91Qu6.mjs';

const $$Astro$1 = createAstro();
const $$SEO = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SEO;
  const { title, description, image, seo, type = "website" } = Astro2.props;
  const siteUrl = Astro2.url.origin;
  const cleanUrl = new URL(Astro2.url.href);
  const isPreview = cleanUrl.searchParams.has("secret") && cleanUrl.searchParams.has("id");
  cleanUrl.searchParams.delete("secret");
  cleanUrl.searchParams.delete("id");
  cleanUrl.searchParams.delete("postType");
  const canonicalUrl = cleanUrl.href;
  const metaTitle = seo?.title || title || "Headless WordPress Site";
  const metaDescription = seo?.metaDesc || description || "A modern headless WordPress site built with Astro";
  const metaImage = seo?.opengraphImage?.sourceUrl || image || `${siteUrl}/og-image.jpg`;
  return renderTemplate`<title>${metaTitle}</title><meta name="description"${addAttribute(metaDescription, "content")}>${isPreview && renderTemplate`<meta name="robots" content="noindex, nofollow">`}<meta property="og:type"${addAttribute(type, "content")}><meta property="og:url"${addAttribute(canonicalUrl, "content")}><meta property="og:title"${addAttribute(metaTitle, "content")}><meta property="og:description"${addAttribute(metaDescription, "content")}><meta property="og:image"${addAttribute(metaImage, "content")}><meta name="twitter:card" content="summary_large_image"><meta name="twitter:url"${addAttribute(canonicalUrl, "content")}><meta name="twitter:title"${addAttribute(metaTitle, "content")}><meta name="twitter:description"${addAttribute(metaDescription, "content")}><meta name="twitter:image"${addAttribute(metaImage, "content")}><link rel="canonical"${addAttribute(canonicalUrl, "href")}>`;
}, "C:/DEV/orlane/src/components/SEO.astro", void 0);

function buildGenericListQuery(pluralName, includeExtendedFields = false) {
  const baseFields = `
    id
    title
    slug
    date
    modified
    uri
  `;
  let extendedFields = "";
  if (includeExtendedFields) {
    if (pluralName.toLowerCase() === "pages") {
      extendedFields = `
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
      `;
    } else {
      extendedFields = `
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
      `;
    }
  }
  return `
    query GetAll${pluralName.charAt(0).toUpperCase() + pluralName.slice(1)}($first: Int = 100) {
      ${pluralName}(first: $first, where: {status: PUBLISH}) {
        nodes {
          ${baseFields}
          ${extendedFields}
        }
      }
    }
  `;
}
function buildGenericSingleQuery(singleName, includeExtendedFields = false) {
  const baseFields = `
    id
    title
    slug
    date
    modified
    uri
  `;
  let contentFields = "";
  if (includeExtendedFields) {
    if (singleName.toLowerCase() === "page") {
      contentFields = `
        content
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
      `;
    } else {
      contentFields = `
        content
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
      `;
    }
  }
  return `
    query Get${singleName.charAt(0).toUpperCase() + singleName.slice(1)}BySlug($slug: ID!) {
      ${singleName}(id: $slug, idType: SLUG) {
        ${baseFields}
        ${contentFields}
      }
    }
  `;
}
async function getAllItemsByType(contentType) {
  const types = await getAvailableContentTypes();
  const typeConfig = types.find(
    (t) => t.graphqlPluralName.toLowerCase() === contentType.toLowerCase() || t.graphqlSingleName.toLowerCase() === contentType.toLowerCase() || t.name.toLowerCase() === contentType.toLowerCase()
  );
  if (!typeConfig) {
    throw new Error(`Content type ${contentType} not found`);
  }
  const isNativeType = ["posts", "pages"].includes(typeConfig.graphqlPluralName.toLowerCase());
  try {
    const query = buildGenericListQuery(typeConfig.graphqlPluralName, isNativeType);
    const data = await fetchGraphQL(query);
    return data[typeConfig.graphqlPluralName]?.nodes || [];
  } catch (error) {
    if (isNativeType) {
      throw error;
    }
    const query = buildGenericListQuery(typeConfig.graphqlPluralName, false);
    const data = await fetchGraphQL(query);
    return data[typeConfig.graphqlPluralName]?.nodes || [];
  }
}
async function getItemBySlug(contentType, slug) {
  const types = await getAvailableContentTypes();
  const typeConfig = types.find(
    (t) => t.graphqlPluralName.toLowerCase() === contentType.toLowerCase() || t.graphqlSingleName.toLowerCase() === contentType.toLowerCase() || t.name.toLowerCase() === contentType.toLowerCase()
  );
  if (!typeConfig) {
    throw new Error(`Content type ${contentType} not found`);
  }
  const isNativeType = ["posts", "pages"].includes(typeConfig.graphqlPluralName.toLowerCase());
  try {
    const query = buildGenericSingleQuery(typeConfig.graphqlSingleName, isNativeType);
    const data = await fetchGraphQL(query, { slug });
    return data[typeConfig.graphqlSingleName] || null;
  } catch (error) {
    if (isNativeType) {
      throw error;
    }
    const query = buildGenericSingleQuery(typeConfig.graphqlSingleName, false);
    const data = await fetchGraphQL(query, { slug });
    return data[typeConfig.graphqlSingleName] || null;
  }
}
async function getAllPosts() {
  return getAllItemsByType("posts");
}
async function getPostBySlug(slug) {
  const baseQuery = `
    id
    title
    content
    slug
    excerpt
    date
    modified
    uri
    featuredImage {
      node {
        sourceUrl
        altText
        mediaDetails {
          width
          height
        }
      }
    }
    author {
      node {
        name
        avatar {
          url
        }
      }
    }
    categories {
      nodes {
        name
        slug
      }
    }
    tags {
      nodes {
        name
        slug
      }
    }
  `;
  const queryWithSEO = `
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        ${baseQuery}
        seo {
          title
          metaDesc
          opengraphImage {
            sourceUrl
          }
        }
      }
    }
  `;
  const queryWithoutSEO = `
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        ${baseQuery}
      }
    }
  `;
  try {
    const data = await fetchGraphQL(queryWithSEO, { slug });
    return data.post;
  } catch (error) {
    const data = await fetchGraphQL(queryWithoutSEO, { slug });
    return data.post;
  }
}
async function getPageBySlug(slug) {
  const query = `
    query GetPageBySlug($slug: ID!) {
      page(id: $slug, idType: URI) {
        id
        title
        content
        slug
        date
        modified
        uri
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
      }
    }
  `;
  const data = await fetchGraphQL(query, { slug });
  return data.page;
}
async function getAvailableMenus() {
  const query = `
    query GetMenus {
      menus {
        nodes {
          id
          name
          slug
          locations
        }
      }
    }
  `;
  try {
    const data = await fetchGraphQL(query);
    return data.menus?.nodes || [];
  } catch (error) {
    return [];
  }
}
function buildMenuItemsQuery(useLocation) {
  const whereParam = useLocation ? "(where: { location: $id }, first: 100)" : "(where: { id: $id }, first: 100)";
  const varType = useLocation ? "MenuLocationEnum!" : "ID!";
  return `
    query GetMenuItems($id: ${varType}) {
      menuItems${whereParam} {
        nodes {
          id
          label
          url
          path
          parentId
          order
          childItems {
            nodes {
              id
              label
              url
              path
              parentId
              order
            }
          }
        }
      }
    }
  `;
}
async function fetchMenuItems(location) {
  const query = buildMenuItemsQuery(true);
  const data = await fetchGraphQL(query, {
    id: location.toUpperCase()
  });
  const allItems = data.menuItems?.nodes || [];
  return allItems.filter((item) => !item.parentId);
}
async function getMenuByLocation(location) {
  try {
    if (location) ;
    const menus = await getAvailableMenus();
    if (menus.length === 0) {
      return [];
    }
    const primaryMenu = menus.find(
      (m) => m.locations.some((loc) => loc.toUpperCase().includes("PRIMARY"))
    );
    if (primaryMenu && primaryMenu.locations.length > 0) {
      return await fetchMenuItems(primaryMenu.locations[0]);
    }
    const menuWithLocation = menus.find((m) => m.locations.length > 0);
    if (menuWithLocation) {
      return await fetchMenuItems(menuWithLocation.locations[0]);
    }
    const query = buildMenuItemsQuery(false);
    const data = await fetchGraphQL(query, {
      id: menus[0].id
    });
    const allItems = data.menuItems?.nodes || [];
    return allItems.filter((item) => !item.parentId);
  } catch (error) {
    return [];
  }
}
async function getItemsCountByType(contentType) {
  try {
    const types = await getAvailableContentTypes();
    const typeConfig = types.find(
      (t) => t.graphqlPluralName.toLowerCase() === contentType.toLowerCase() || t.graphqlSingleName.toLowerCase() === contentType.toLowerCase() || t.name.toLowerCase() === contentType.toLowerCase()
    );
    if (!typeConfig) {
      return 0;
    }
    const query = `
      query GetCount {
        ${typeConfig.graphqlPluralName}(first: 1, where: {status: PUBLISH}) {
          pageInfo {
            total
          }
        }
      }
    `;
    const data = await fetchGraphQL(query);
    return data[typeConfig.graphqlPluralName]?.pageInfo?.total || 0;
  } catch {
    try {
      const items = await getAllItemsByType(contentType);
      return items.length;
    } catch {
      return 0;
    }
  }
}

const $$Navigation = createComponent(async ($$result, $$props, $$slots) => {
  const menuItems = await getMenuByLocation();
  function toRelativePath(item) {
    if (item.path) return item.path;
    try {
      const url = new URL(item.url);
      return url.pathname;
    } catch {
      return item.url;
    }
  }
  const hasMenu = menuItems.length > 0;
  const fallbackItems = [
    { label: "Home", path: "/" },
    { label: "Blog", path: "/blog" },
    { label: "Projects", path: "/projects" },
    { label: "Content Types", path: "/content-types" }
  ];
  return renderTemplate`${maybeRenderHead()}<ul class="flex items-center gap-6"> ${hasMenu ? menuItems.map((item) => renderTemplate`<li class="relative group"> <a${addAttribute(toRelativePath(item), "href")} class="hover:text-sauge transition-colors"> ${item.label} </a> ${item.childItems && item.childItems.nodes.length > 0 && renderTemplate`<ul class="absolute left-0 top-full mt-1 min-w-48 bg-creme border border-beige shadow-lg rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"> ${item.childItems.nodes.map((child) => renderTemplate`<li> <a${addAttribute(toRelativePath(child), "href")} class="block px-4 py-2 text-sm text-taupe hover:bg-beige hover:text-taupe transition-colors"> ${child.label} </a> </li>`)} </ul>`} </li>`) : fallbackItems.map((item) => renderTemplate`<li> <a${addAttribute(item.path, "href")} class="hover:text-sauge transition-colors"> ${item.label} </a> </li>`)} </ul>`;
}, "C:/DEV/orlane/src/components/Navigation.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title, description, seo, type = "website" } = Astro2.props;
  const wpBaseUrl = env.WORDPRESS_API_URL.replace(/\/graphql$/, "");
  const wpBlockCssUrl = `${wpBaseUrl}/wp-includes/css/dist/block-library/style.min.css`;
  return renderTemplate`<html lang="fr"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet"><link rel="stylesheet"${addAttribute(wpBlockCssUrl, "href")}>${renderComponent($$result, "SEO", $$SEO, { "title": title, "description": description, "seo": seo, "type": type })}${renderHead()}</head> <body class="min-h-screen bg-creme text-taupe"> <header class="bg-beige border-b border-beige sticky top-0 z-50"> <nav class="container mx-auto px-4 py-4"> <div class="flex items-center justify-between"> <a href="/" class="text-2xl font-bold text-taupe hover:text-sauge transition-colors"> ${renderComponent($$result, "Image", $$Image, { "src": "/logo-orlane-transparent.png", "alt": "Orlane Logo", "width": 32, "height": 32, "class": "inline-block mr-2" })} </a> ${renderComponent($$result, "Navigation", $$Navigation, {})} </div> </nav> </header> <main> ${renderSlot($$result, $$slots["default"])} </main> <footer class="bg-taupe text-creme py-12 mt-20"> <div class="container mx-auto px-4"> <div class="text-center"> <p class="text-creme/70">
Powered by <a href="https://astro.build" class="text-sauge hover:text-beige transition-colors">Astro</a>
and <a href="https://wordpress.org" class="text-sauge hover:text-beige transition-colors">WordPress</a> </p> </div> </div> </footer> </body></html>`;
}, "C:/DEV/orlane/src/layouts/Layout.astro", void 0);

export { $$Layout as $, getItemsCountByType as a, getPageBySlug as b, getPostBySlug as c, getItemBySlug as d, getAllItemsByType as e, getAllPosts as g };
