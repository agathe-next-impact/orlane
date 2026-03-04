import { e as env, g as generateCacheKey, c as cache } from './env_BCDX6XaS.mjs';

class WPGraphQLError extends Error {
  constructor(message, query, statusCode, graphqlErrors) {
    super(message);
    this.query = query;
    this.statusCode = statusCode;
    this.graphqlErrors = graphqlErrors;
    this.name = "WPGraphQLError";
    Error.captureStackTrace?.(this, WPGraphQLError);
  }
}
class WPConnectionError extends Error {
  constructor(message, url, originalError) {
    super(message);
    this.url = url;
    this.originalError = originalError;
    this.name = "WPConnectionError";
    Error.captureStackTrace?.(this, WPConnectionError);
  }
}

const WORDPRESS_API_URL = env.WORDPRESS_API_URL;
const CACHE_TTL = 30 * 1e3;
async function fetchGraphQL(query, variables, cacheTTL = CACHE_TTL) {
  const cacheKey = generateCacheKey(query, variables);
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(WORDPRESS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query,
        variables
      })
    });
    if (!response.ok) {
      throw new WPGraphQLError(
        `HTTP error ${response.status}`,
        query,
        response.status
      );
    }
    const json = await response.json();
    if (json.errors) {
      throw new WPGraphQLError(
        "GraphQL query failed",
        query,
        response.status,
        json.errors
      );
    }
    if (!json.data) {
      throw new WPGraphQLError("No data in response", query);
    }
    cache.set(cacheKey, json.data, cacheTTL);
    return json.data;
  } catch (error) {
    if (error instanceof WPGraphQLError) {
      throw error;
    }
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new WPConnectionError(
        "Unable to connect to WordPress GraphQL API",
        WORDPRESS_API_URL,
        error
      );
    }
    throw new WPGraphQLError(
      `Fetch failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      query
    );
  }
}
async function fetchGraphQLWithAuth(query, variables, authToken) {
  const headers = {
    "Content-Type": "application/json"
  };
  if (authToken) {
    headers["Authorization"] = authToken;
  }
  const response = await fetch(WORDPRESS_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables })
  });
  if (!response.ok) {
    throw new WPGraphQLError(
      `HTTP error ${response.status}`,
      query,
      response.status
    );
  }
  const json = await response.json();
  if (json.errors) {
    throw new WPGraphQLError(
      "GraphQL query failed",
      query,
      response.status,
      json.errors
    );
  }
  if (!json.data) {
    throw new WPGraphQLError("No data in response", query);
  }
  return json.data;
}
function getWordPressApiUrl() {
  return WORDPRESS_API_URL;
}

const CONTENT_TYPES_CACHE_KEY = "wp:content-types";
async function testContentTypeExists(pluralName) {
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
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });
    const json = await response.json();
    return !json.errors && json.data && json.data[pluralName] !== void 0;
  } catch {
    return false;
  }
}
async function detectContentTypesViaAPI() {
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
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });
    const json = await response.json();
    if (json.errors || !json.data?.contentTypes?.nodes) {
      return null;
    }
    const nodes = json.data.contentTypes.nodes;
    const types = nodes.filter(
      (type) => type.graphqlSingleName && type.graphqlPluralName && type.graphqlPluralName !== "mediaItems"
    ).map((type) => ({
      name: type.label || type.name,
      graphqlSingleName: type.graphqlSingleName,
      graphqlPluralName: type.graphqlPluralName,
      isPostType: true
    }));
    if (false) ;
    return types;
  } catch (error) {
    return null;
  }
}
async function detectContentTypesManually() {
  const potentialTypes = [
    { name: "Post", graphqlSingleName: "post", graphqlPluralName: "posts" },
    { name: "Page", graphqlSingleName: "page", graphqlPluralName: "pages" },
    { name: "Project", graphqlSingleName: "project", graphqlPluralName: "projects" },
    { name: "Portfolio", graphqlSingleName: "portfolio", graphqlPluralName: "portfolios" },
    { name: "Product", graphqlSingleName: "product", graphqlPluralName: "products" },
    { name: "Event", graphqlSingleName: "event", graphqlPluralName: "events" },
    { name: "Testimonial", graphqlSingleName: "testimonial", graphqlPluralName: "testimonials" },
    { name: "Team Member", graphqlSingleName: "teamMember", graphqlPluralName: "teamMembers" },
    { name: "Service", graphqlSingleName: "service", graphqlPluralName: "services" },
    { name: "Case Study", graphqlSingleName: "case", graphqlPluralName: "cases" },
    { name: "Article", graphqlSingleName: "article", graphqlPluralName: "articles" }
  ];
  const foundTypes = [];
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
async function getAvailableContentTypes() {
  const cached = cache.get(CONTENT_TYPES_CACHE_KEY);
  if (cached) {
    return cached;
  }
  const apiTypes = await detectContentTypesViaAPI();
  if (apiTypes && apiTypes.length > 0) {
    cache.set(CONTENT_TYPES_CACHE_KEY, apiTypes, 2 * 60 * 1e3);
    return apiTypes;
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
    const data = await fetchGraphQL(introspectionQuery, void 0, 0);
    const types = data.__schema.types;
    const rootQueryType = types.find((t) => t.name === "RootQuery");
    if (!rootQueryType || !rootQueryType.fields) {
      if (false) ;
      const manualTypes = await detectContentTypesManually();
      cache.set(CONTENT_TYPES_CACHE_KEY, manualTypes, 2 * 60 * 1e3);
      return manualTypes;
    }
    const contentTypes = [];
    const processedTypes = /* @__PURE__ */ new Set(["post", "page", "mediaItem", "user", "comment", "tag", "category"]);
    for (const field of rootQueryType.fields) {
      const fieldName = field.name;
      if (fieldName.endsWith("s") && !fieldName.startsWith("_") && field.type?.name?.endsWith("Connection") && !processedTypes.has(fieldName.slice(0, -1))) {
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
    const defaultTypes = [
      {
        name: "Post",
        graphqlSingleName: "post",
        graphqlPluralName: "posts",
        isPostType: true
      },
      {
        name: "Page",
        graphqlSingleName: "page",
        graphqlPluralName: "pages",
        isPostType: true
      }
    ];
    for (const defaultType of defaultTypes) {
      if (!contentTypes.some((ct) => ct.graphqlSingleName === defaultType.graphqlSingleName)) {
        contentTypes.push(defaultType);
      }
    }
    cache.set(CONTENT_TYPES_CACHE_KEY, contentTypes, 2 * 60 * 1e3);
    if (false) ;
    return contentTypes;
  } catch (error) {
    const manualTypes = await detectContentTypesManually();
    cache.set(CONTENT_TYPES_CACHE_KEY, manualTypes, 2 * 60 * 1e3);
    return manualTypes;
  }
}

export { fetchGraphQL as a, fetchGraphQLWithAuth as f, getAvailableContentTypes as g };
