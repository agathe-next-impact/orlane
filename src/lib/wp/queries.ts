import { fetchGraphQL } from './fetcher';
import { getAvailableContentTypes } from './content-types';
import type { WPMenu, WPMenuItem } from '../../types/wp';

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

function buildGenericSingleQuery(singleName: string, includeExtendedFields: boolean = false): string {
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

  try {
    const query = buildGenericSingleQuery(typeConfig.graphqlSingleName, isNativeType);
    const data = await fetchGraphQL<Record<string, unknown>>(query, { slug });
    return data[typeConfig.graphqlSingleName] || null;
  } catch (error) {
    if (isNativeType) {
      throw error;
    }

    if (import.meta.env.DEV) {
      console.log(`Retrying ${contentType} without extended fields...`);
    }
    const query = buildGenericSingleQuery(typeConfig.graphqlSingleName, false);
    const data = await fetchGraphQL<Record<string, unknown>>(query, { slug });
    return data[typeConfig.graphqlSingleName] || null;
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

  const data = await fetchGraphQL<{ page: unknown }>(query, { slug });
  return data.page;
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

function buildMenuItemsQuery(useLocation: boolean): string {
  const whereParam = useLocation
    ? '(where: { location: $id }, first: 100)'
    : '(where: { id: $id }, first: 100)';
  const varType = useLocation ? 'MenuLocationEnum!' : 'ID!';

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

async function fetchMenuItems(location: string): Promise<WPMenuItem[]> {
  const query = buildMenuItemsQuery(true);
  const data = await fetchGraphQL<{ menuItems: { nodes: WPMenuItem[] } }>(query, {
    id: location.toUpperCase(),
  });
  const allItems = data.menuItems?.nodes || [];
  return allItems.filter(item => !item.parentId);
}

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
    const allItems = data.menuItems?.nodes || [];
    return allItems.filter(item => !item.parentId);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Failed to fetch menu:', error);
    }
    return [];
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
