import { cache, generateCacheKey } from '../cache';
import { WPGraphQLError, WPConnectionError } from '../errors';
import { env } from '../env';

const WORDPRESS_API_URL = env.WORDPRESS_API_URL;

export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

export interface GraphQLVariables {
  [key: string]: string | number | boolean | null | undefined;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchGraphQL<T>(
  query: string,
  variables?: GraphQLVariables,
  cacheTTL: number = CACHE_TTL
): Promise<T> {
  const cacheKey = generateCacheKey(query, variables);
  const cached = cache.get<T>(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(WORDPRESS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new WPGraphQLError(
        `HTTP error ${response.status}`,
        query,
        response.status
      );
    }

    const json: GraphQLResponse<T> = await response.json();

    if (json.errors) {
      throw new WPGraphQLError(
        'GraphQL query failed',
        query,
        response.status,
        json.errors
      );
    }

    if (!json.data) {
      throw new WPGraphQLError('No data in response', query);
    }

    cache.set(cacheKey, json.data, cacheTTL);
    return json.data;
  } catch (error) {
    if (error instanceof WPGraphQLError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new WPConnectionError(
        'Unable to connect to WordPress GraphQL API',
        WORDPRESS_API_URL,
        error
      );
    }

    throw new WPGraphQLError(
      `Fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      query
    );
  }
}

export function getWordPressApiUrl(): string {
  return WORDPRESS_API_URL;
}
