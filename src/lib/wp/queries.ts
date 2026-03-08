import { fetchGraphQL } from './fetcher';
import { getAvailableContentTypes } from './content-types';
import type { WPMenu, WPMenuItem, WPThemeSettings } from '../../types/wp';
import { flexibleContentFragment, flexibleContentFragmentProject } from './acf-fragments';
import { env } from '../env';

function buildGenericListQuery(pluralName: string, includeExtendedFields: boolean = false): string {
  const baseFields = `
    id
    title
    slug
    date
    modified
    uri
  `;

  let extendedFields = '';

  if (includeExtendedFields) {
    if (pluralName.toLowerCase() === 'pages') {
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

function buildGenericSingleQuery(singleName: string, includeExtendedFields: boolean = false, includeACF: boolean = false): string {
  const baseFields = `
    id
    title
    slug
    date
    modified
    uri
  `;

  let contentFields = '';

  if (includeExtendedFields) {
    if (singleName.toLowerCase() === 'page') {
      // Note: 'content' field removed — editor disabled for pages (using ACF flexible content)
      contentFields = `
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

  // Pick the right ACF fragment based on post type
  let acfBlock = '';
  if (includeACF) {
    const isPage = singleName.toLowerCase() === 'page';
    const fragment = isPage ? flexibleContentFragment : flexibleContentFragmentProject;
    acfBlock = `
      acfFields {
        ${fragment}
      }
    `;
  }

  return `
    query Get${singleName.charAt(0).toUpperCase() + singleName.slice(1)}BySlug($slug: ID!) {
      ${singleName}(id: $slug, idType: SLUG) {
        ${baseFields}
        ${contentFields}
        ${acfBlock}
      }
    }
  `;
}

export async function getAllItemsByType(contentType: string): Promise<unknown[]> {
  const types = await getAvailableContentTypes();
  const typeConfig = types.find(
    t => t.graphqlPluralName.toLowerCase() === contentType.toLowerCase() ||
         t.graphqlSingleName.toLowerCase() === contentType.toLowerCase() ||
         t.name.toLowerCase() === contentType.toLowerCase()
  );

  if (!typeConfig) {
    throw new Error(`Content type ${contentType} not found`);
  }

  const isNativeType = ['posts', 'pages'].includes(typeConfig.graphqlPluralName.toLowerCase());

  try {
    const query = buildGenericListQuery(typeConfig.graphqlPluralName, isNativeType);
    const data = await fetchGraphQL<Record<string, { nodes: unknown[] }>>(query);
    return data[typeConfig.graphqlPluralName]?.nodes || [];
  } catch (error) {
    if (isNativeType) {
      throw error;
    }

    if (import.meta.env.DEV) {
      console.log(`Retrying ${contentType} without extended fields...`);
    }
    const query = buildGenericListQuery(typeConfig.graphqlPluralName, false);
    const data = await fetchGraphQL<Record<string, { nodes: unknown[] }>>(query);
    return data[typeConfig.graphqlPluralName]?.nodes || [];
  }
}

export async function getItemBySlug(contentType: string, slug: string): Promise<unknown | null> {
  const types = await getAvailableContentTypes();
  const typeConfig = types.find(
    t => t.graphqlPluralName.toLowerCase() === contentType.toLowerCase() ||
         t.graphqlSingleName.toLowerCase() === contentType.toLowerCase() ||
         t.name.toLowerCase() === contentType.toLowerCase()
  );

  if (!typeConfig) {
    throw new Error(`Content type ${contentType} not found`);
  }

  const isNativeType = ['posts', 'pages'].includes(typeConfig.graphqlPluralName.toLowerCase());

  // Try with extended fields + ACF first, then without ACF, then minimal
  try {
    const query = buildGenericSingleQuery(typeConfig.graphqlSingleName, isNativeType, true);
    const data = await fetchGraphQL<Record<string, unknown>>(query, { slug });
    return data[typeConfig.graphqlSingleName] || null;
  } catch {
    try {
      if (import.meta.env.DEV) {
        console.log(`Retrying ${contentType} without ACF fields...`);
      }
      const query = buildGenericSingleQuery(typeConfig.graphqlSingleName, isNativeType, false);
      const data = await fetchGraphQL<Record<string, unknown>>(query, { slug });
      return data[typeConfig.graphqlSingleName] || null;
    } catch {
      if (isNativeType) {
        throw new Error(`Failed to fetch ${contentType} by slug: ${slug}`);
      }
      if (import.meta.env.DEV) {
        console.log(`Retrying ${contentType} without extended fields...`);
      }
      const query = buildGenericSingleQuery(typeConfig.graphqlSingleName, false, false);
      const data = await fetchGraphQL<Record<string, unknown>>(query, { slug });
      return data[typeConfig.graphqlSingleName] || null;
    }
  }
}

export async function getAllPosts() {
  return getAllItemsByType('posts');
}

export async function getPostBySlug(slug: string) {
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
    const data = await fetchGraphQL<{ post: unknown }>(queryWithSEO, { slug });
    return data.post;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.log('Retrying post without SEO field...');
    }
    const data = await fetchGraphQL<{ post: unknown }>(queryWithoutSEO, { slug });
    return data.post;
  }
}

export async function getAllPages() {
  return getAllItemsByType('pages');
}

export async function getPageBySlug(slug: string) {
  // WPGraphQL URI type expects a path with leading slash (e.g. "/about" or "/parent/child")
  const uri = slug.startsWith('/') ? slug : `/${slug}`;

  const queryWithACF = `
    query GetPageBySlug($slug: ID!) {
      page(id: $slug, idType: URI) {
        id
        title
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
        acfFields {
          ${flexibleContentFragment}
        }
      }
    }
  `;

  const queryWithoutACF = `
    query GetPageBySlug($slug: ID!) {
      page(id: $slug, idType: URI) {
        id
        title
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

  try {
    const data = await fetchGraphQL<{ page: unknown }>(queryWithACF, { slug: uri });
    return data.page;
  } catch {
    if (import.meta.env.DEV) {
      console.log('Retrying page without ACF fields...');
    }
    const data = await fetchGraphQL<{ page: unknown }>(queryWithoutACF, { slug: uri });
    return data.page;
  }
}

export async function getAllProjects() {
  return getAllItemsByType('projects');
}

export async function getProjectBySlug(slug: string) {
  return getItemBySlug('projects', slug);
}

export async function getAllCustomPostTypeItems(postTypeName: string) {
  return getAllItemsByType(postTypeName);
}

export async function getCustomPostTypeItemBySlug(postTypeName: string, slug: string) {
  return getItemBySlug(postTypeName, slug);
}

export async function getAvailableMenus(): Promise<WPMenu[]> {
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
    const data = await fetchGraphQL<{ menus: { nodes: WPMenu[] } }>(query);
    return data.menus?.nodes || [];
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Failed to fetch available menus:', error);
    }
    return [];
  }
}

const MENU_ITEM_FIELDS = `
  id
  label
  url
  path
  parentId
  order
  childItems(first: 50) {
    nodes {
      id
      label
      url
      path
      parentId
      order
      childItems(first: 20) {
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
`;

function buildMenuItemsQuery(useLocation: boolean): string {
  const whereParam = useLocation
    ? '(where: { location: $id, parentDatabaseId: 0 }, first: 50)'
    : '(where: { id: $id, parentDatabaseId: 0 }, first: 50)';
  const varType = useLocation ? 'MenuLocationEnum!' : 'ID!';

  return `
    query GetMenuItems($id: ${varType}) {
      menuItems${whereParam} {
        nodes {
          ${MENU_ITEM_FIELDS}
        }
      }
    }
  `;
}

async function fetchMenuItems(location: string): Promise<WPMenuItem[]> {
  const query = buildMenuItemsQuery(true);
  const data = await fetchGraphQL<{ menuItems: { nodes: WPMenuItem[] } }>(query, {
    id: location.toUpperCase(),
  });
  return data.menuItems?.nodes || [];
}

/**
 * Fetch primary menu items from WordPress.
 * Tries in order: given location → PRIMARY location → first assigned location → first menu by ID.
 * Uses a single optimised query that fetches only root items (parentDatabaseId: 0)
 * with up to 2 levels of childItems.
 */
export async function getMenuByLocation(location?: string): Promise<WPMenuItem[]> {
  try {
    // If a specific location is provided, use it directly
    if (location) {
      return await fetchMenuItems(location);
    }

    // Auto-detect: fetch all menus and find the primary one
    const menus = await getAvailableMenus();

    if (menus.length === 0) {
      return [];
    }

    // Priority: menu with PRIMARY location > first menu with any location > first menu
    const primaryMenu = menus.find(m =>
      m.locations.some(loc => loc.toUpperCase().includes('PRIMARY'))
    );

    if (primaryMenu && primaryMenu.locations.length > 0) {
      return await fetchMenuItems(primaryMenu.locations[0]);
    }

    const menuWithLocation = menus.find(m => m.locations.length > 0);

    if (menuWithLocation) {
      return await fetchMenuItems(menuWithLocation.locations[0]);
    }

    // Last resort: fetch menu items by menu database ID
    const query = buildMenuItemsQuery(false);
    const data = await fetchGraphQL<{ menuItems: { nodes: WPMenuItem[] } }>(query, {
      id: menus[0].id,
    });
    return data.menuItems?.nodes || [];
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Failed to fetch menu:', error);
    }
    return [];
  }
}

export interface WPSiteSettings {
  title: string;
  description: string;
  url: string;
  siteIconUrl: string | null;
}

export async function getSiteSettings(): Promise<WPSiteSettings> {
  const query = `
    query GetSiteSettings {
      generalSettings {
        title
        description
        url
      }
    }
  `;

  const defaults: WPSiteSettings = {
    title: 'Orlane P.',
    description: '',
    url: '',
    siteIconUrl: null,
  };

  try {
    const data = await fetchGraphQL<{
      generalSettings: { title: string; description: string; url: string };
    }>(query);

    const settings = data.generalSettings;

    // Fetch the site icon URL from the WP REST API root (exposes site_icon_url)
    const wpBaseUrl = env.WORDPRESS_API_URL.replace(/\/graphql$/, '');
    let siteIconUrl: string | null = null;
    try {
      const res = await fetch(wpBaseUrl.replace(/\/$/, '') + '/wp-json/');
      if (res.ok) {
        const json = await res.json();
        if (json.site_icon_url) {
          siteIconUrl = json.site_icon_url;
        }
      }
    } catch {
      // Ignore – favicon will fall back to null
    }

    return {
      title: settings.title || defaults.title,
      description: settings.description || defaults.description,
      url: settings.url || defaults.url,
      siteIconUrl,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Failed to fetch site settings:', error);
    }
    return defaults;
  }
}

// ── Theme Settings (ACF Options Page) ────────────────────────────────────
export async function getThemeSettings(): Promise<WPThemeSettings> {
  const query = `
    query GetThemeSettings {
      rGlagesDuThMe {
        themeSettings {
          logo {
            node {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
          }
          logoFooter {
            node {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
          }
          colorBeige
          colorCreme
          colorTaupe
          colorSauge
          colorMousse
          fontBody
          fontHeading
          socialFacebook
          socialInstagram
          socialLinkedin
          socialTiktok
          socialYoutube
          footerText
        }
      }
    }
  `;

  const defaults: WPThemeSettings = {
    logo: null,
    logoFooter: null,
    colorBeige: null,
    colorCreme: null,
    colorTaupe: null,
    colorSauge: null,
    colorMousse: null,
    fontBody: null,
    fontHeading: null,
    socialFacebook: null,
    socialInstagram: null,
    socialLinkedin: null,
    socialTiktok: null,
    socialYoutube: null,
    footerText: null,
  };

  try {
    const data = await fetchGraphQL<{
      rGlagesDuThMe: { themeSettings: Record<string, unknown> };
    }>(query, undefined, 0);

    const raw = data.rGlagesDuThMe?.themeSettings;
    if (!raw) return defaults;

    // Normalize image fields (WPGraphQL wraps in { node: ... })
    const normalizeImage = (img: unknown) => {
      if (!img) return null;
      if (typeof img === 'object' && img !== null && 'node' in img) {
        return (img as { node: unknown }).node as WPThemeSettings['logo'];
      }
      return img as WPThemeSettings['logo'];
    };

    return {
      logo: normalizeImage(raw.logo),
      logoFooter: normalizeImage(raw.logoFooter),
      colorBeige: (raw.colorBeige as string) || null,
      colorCreme: (raw.colorCreme as string) || null,
      colorTaupe: (raw.colorTaupe as string) || null,
      colorSauge: (raw.colorSauge as string) || null,
      colorMousse: (raw.colorMousse as string) || null,
      fontBody: (raw.fontBody as string) || null,
      fontHeading: (raw.fontHeading as string) || null,
      socialFacebook: (raw.socialFacebook as string) || null,
      socialInstagram: (raw.socialInstagram as string) || null,
      socialLinkedin: (raw.socialLinkedin as string) || null,
      socialTiktok: (raw.socialTiktok as string) || null,
      socialYoutube: (raw.socialYoutube as string) || null,
      footerText: (raw.footerText as string) || null,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Failed to fetch theme settings:', error);
    }
    return defaults;
  }
}

export async function getItemsCountByType(contentType: string): Promise<number> {
  try {
    const types = await getAvailableContentTypes();
    const typeConfig = types.find(
      t => t.graphqlPluralName.toLowerCase() === contentType.toLowerCase() ||
           t.graphqlSingleName.toLowerCase() === contentType.toLowerCase() ||
           t.name.toLowerCase() === contentType.toLowerCase()
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

    interface CountData {
      pageInfo?: {
        total?: number;
      };
    }

    const data = await fetchGraphQL<Record<string, CountData>>(query);
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
