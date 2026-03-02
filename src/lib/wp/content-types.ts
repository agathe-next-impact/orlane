import { cache } from '../cache';
import { fetchGraphQL, getWordPressApiUrl } from './fetcher';

export interface ContentType {
  name: string;
  graphqlSingleName: string;
  graphqlPluralName: string;
  isPostType: boolean;
}

interface ContentTypeNode {
  name: string;
  label: string;
  graphqlSingleName: string;
  graphqlPluralName: string;
  hierarchical: boolean;
}

interface IntrospectionType {
  name: string;
  kind: string;
  fields?: IntrospectionField[];
}

interface IntrospectionField {
  name: string;
  type?: {
    name?: string;
  };
}

const CONTENT_TYPES_CACHE_KEY = 'wp:content-types';

async function testContentTypeExists(pluralName: string): Promise<boolean> {
  const query = `
    query TestContentType {
      ${pluralName}(first: 1) {
        nodes {
          id
        }
      }
    }
  `;

  try {
    const response = await fetch(getWordPressApiUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const json = await response.json();
    return !json.errors && json.data && json.data[pluralName] !== undefined;
  } catch {
    return false;
  }
}

async function detectContentTypesViaAPI(): Promise<ContentType[] | null> {
  const query = `
    query GetContentTypes {
      contentTypes {
        nodes {
          name
          label
          graphqlSingleName
          graphqlPluralName
          hierarchical
        }
      }
    }
  `;

  try {
    const response = await fetch(getWordPressApiUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const json = await response.json();

    if (json.errors || !json.data?.contentTypes?.nodes) {
      return null;
    }

    const nodes: ContentTypeNode[] = json.data.contentTypes.nodes;

    const types = nodes
      .filter((type) =>
        type.graphqlSingleName &&
        type.graphqlPluralName &&
        type.graphqlPluralName !== 'mediaItems'
      )
      .map((type) => ({
        name: type.label || type.name,
        graphqlSingleName: type.graphqlSingleName,
        graphqlPluralName: type.graphqlPluralName,
        isPostType: true
      }));

    if (import.meta.env.DEV) {
      console.log(`Auto-detected ${types.length} content types`);
    }
    return types;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Failed to auto-detect content types via API', error);
    }
    return null;
  }
}

async function detectContentTypesManually(): Promise<ContentType[]> {
  if (import.meta.env.DEV) {
    console.log('Using manual content type detection');
  }

  const potentialTypes = [
    { name: 'Post', graphqlSingleName: 'post', graphqlPluralName: 'posts' },
    { name: 'Page', graphqlSingleName: 'page', graphqlPluralName: 'pages' },
    { name: 'Project', graphqlSingleName: 'project', graphqlPluralName: 'projects' },
    { name: 'Portfolio', graphqlSingleName: 'portfolio', graphqlPluralName: 'portfolios' },
    { name: 'Product', graphqlSingleName: 'product', graphqlPluralName: 'products' },
    { name: 'Event', graphqlSingleName: 'event', graphqlPluralName: 'events' },
    { name: 'Testimonial', graphqlSingleName: 'testimonial', graphqlPluralName: 'testimonials' },
    { name: 'Team Member', graphqlSingleName: 'teamMember', graphqlPluralName: 'teamMembers' },
    { name: 'Service', graphqlSingleName: 'service', graphqlPluralName: 'services' },
    { name: 'Case Study', graphqlSingleName: 'case', graphqlPluralName: 'cases' },
    { name: 'Article', graphqlSingleName: 'article', graphqlPluralName: 'articles' },
  ];

  const foundTypes: ContentType[] = [];

  for (const type of potentialTypes) {
    const exists = await testContentTypeExists(type.graphqlPluralName);
    if (exists) {
      foundTypes.push({
        name: type.name,
        graphqlSingleName: type.graphqlSingleName,
        graphqlPluralName: type.graphqlPluralName,
        isPostType: true
      });
    }
  }

  return foundTypes;
}

export async function getAvailableContentTypes(): Promise<ContentType[]> {
  const cached = cache.get<ContentType[]>(CONTENT_TYPES_CACHE_KEY);
  if (cached) {
    return cached;
  }

  if (import.meta.env.DEV) {
    console.log('Detecting content types via WPGraphQL API...');
  }
  const apiTypes = await detectContentTypesViaAPI();
  if (apiTypes && apiTypes.length > 0) {
    cache.set(CONTENT_TYPES_CACHE_KEY, apiTypes, 2 * 60 * 1000);
    return apiTypes;
  }

  if (import.meta.env.DEV) {
    console.log('Attempting GraphQL introspection...');
  }
  const introspectionQuery = `
    query IntrospectionQuery {
      __schema {
        types {
          name
          kind
          fields {
            name
            type {
              name
            }
          }
        }
      }
    }
  `;

  try {
    interface IntrospectionData {
      __schema: {
        types: IntrospectionType[];
      };
    }

    const data = await fetchGraphQL<IntrospectionData>(introspectionQuery, undefined, 0);
    const types = data.__schema.types;

    const rootQueryType = types.find((t) => t.name === 'RootQuery');

    if (!rootQueryType || !rootQueryType.fields) {
      if (import.meta.env.DEV) {
        console.warn('Could not find RootQuery type, using manual detection');
      }
      const manualTypes = await detectContentTypesManually();
      cache.set(CONTENT_TYPES_CACHE_KEY, manualTypes, 2 * 60 * 1000);
      return manualTypes;
    }

    const contentTypes: ContentType[] = [];
    const processedTypes = new Set(['post', 'page', 'mediaItem', 'user', 'comment', 'tag', 'category']);

    for (const field of rootQueryType.fields) {
      const fieldName = field.name;

      if (
        fieldName.endsWith('s') &&
        !fieldName.startsWith('_') &&
        field.type?.name?.endsWith('Connection') &&
        !processedTypes.has(fieldName.slice(0, -1))
      ) {
        const singularName = fieldName.slice(0, -1);
        const capitalizedSingular = singularName.charAt(0).toUpperCase() + singularName.slice(1);

        const singleField = rootQueryType.fields.find((f) => f.name === singularName);
        if (singleField) {
          contentTypes.push({
            name: capitalizedSingular,
            graphqlSingleName: singularName,
            graphqlPluralName: fieldName,
            isPostType: true
          });
          processedTypes.add(singularName);
        }
      }
    }

    const defaultTypes: ContentType[] = [
      {
        name: 'Post',
        graphqlSingleName: 'post',
        graphqlPluralName: 'posts',
        isPostType: true
      },
      {
        name: 'Page',
        graphqlSingleName: 'page',
        graphqlPluralName: 'pages',
        isPostType: true
      }
    ];

    for (const defaultType of defaultTypes) {
      if (!contentTypes.some(ct => ct.graphqlSingleName === defaultType.graphqlSingleName)) {
        contentTypes.push(defaultType);
      }
    }

    cache.set(CONTENT_TYPES_CACHE_KEY, contentTypes, 2 * 60 * 1000);
    if (import.meta.env.DEV) {
      console.log('Detected content types:', contentTypes.map(ct => ct.name).join(', '));
    }

    return contentTypes;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Introspection failed, using manual detection');
    }
    const manualTypes = await detectContentTypesManually();
    cache.set(CONTENT_TYPES_CACHE_KEY, manualTypes, 2 * 60 * 1000);
    return manualTypes;
  }
}
