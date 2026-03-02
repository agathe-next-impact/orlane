/**
 * Custom error classes for WordPress GraphQL operations
 */

/**
 * Base error for all WordPress GraphQL related errors
 */
export class WPGraphQLError extends Error {
  constructor(
    message: string,
    public query: string,
    public statusCode?: number,
    public graphqlErrors?: unknown[]
  ) {
    super(message);
    this.name = 'WPGraphQLError';
    Error.captureStackTrace?.(this, WPGraphQLError);
  }
}

/**
 * Error thrown when content is not found
 */
export class WPContentNotFoundError extends Error {
  constructor(
    public contentType: string,
    public slug?: string
  ) {
    super(`${contentType} not found${slug ? `: ${slug}` : ''}`);
    this.name = 'WPContentNotFoundError';
    Error.captureStackTrace?.(this, WPContentNotFoundError);
  }
}

/**
 * Error thrown when content type detection fails
 */
export class WPContentTypeDetectionError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'WPContentTypeDetectionError';
    Error.captureStackTrace?.(this, WPContentTypeDetectionError);
  }
}

/**
 * Error thrown when the WordPress API is unreachable
 */
export class WPConnectionError extends Error {
  constructor(
    message: string,
    public url: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'WPConnectionError';
    Error.captureStackTrace?.(this, WPConnectionError);
  }
}
