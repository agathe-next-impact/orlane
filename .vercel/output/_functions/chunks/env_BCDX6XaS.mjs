import { z } from 'zod';

class SimpleCache {
  cache = /* @__PURE__ */ new Map();
  /**
   * Get a value from cache
   * @param key Cache key
   * @returns Cached value or undefined if not found or expired
   */
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      return void 0;
    }
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return void 0;
    }
    return entry.value;
  }
  /**
   * Set a value in cache with TTL
   * @param key Cache key
   * @param value Value to cache
   * @param ttlMs Time to live in milliseconds (default: 5 minutes)
   */
  set(key, value, ttlMs = 5 * 60 * 1e3) {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs
    });
  }
  /**
   * Remove a value from cache
   * @param key Cache key
   */
  delete(key) {
    this.cache.delete(key);
  }
  /**
   * Remove all entries whose key starts with the given prefix
   */
  clearByPrefix(prefix) {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }
  /**
   * Clear all cached values
   */
  clear() {
    this.cache.clear();
  }
  /**
   * Get cache size
   */
  size() {
    return this.cache.size;
  }
  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}
const cache = new SimpleCache();
if (typeof setInterval !== "undefined") {
  setInterval(() => cache.cleanup(), 10 * 60 * 1e3);
}
function generateCacheKey(query, variables) {
  const varsString = variables ? JSON.stringify(variables) : "";
  return `gql:${simpleHash(query + varsString)}`;
}
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": undefined, "SSR": true};
const envSchema = z.object({
  WORDPRESS_API_URL: z.string().url("WORDPRESS_API_URL must be a valid URL"),
  REVALIDATE_SECRET: z.string().min(1).optional(),
  WP_PREVIEW_SECRET: z.string().min(1).optional(),
  WP_AUTH_TOKEN: z.string().min(1).optional()
});
function getEnvVar(key) {
  return Object.assign(__vite_import_meta_env__, { WORDPRESS_API_URL: "https://indigo-heron-756040.hostingersite.com/graphql", REVALIDATE_SECRET: "p7wt0IdkXjKosOhwydoa1xKNck", WP_PREVIEW_SECRET: "b159727cda2cb18a7f5b55113e622bd4b3814d1f5f0827d7", WP_AUTH_TOKEN: "Basic YWdhdGhlQG5leHQtaW1wYWN0LmRpZ2l0YWw6a1BONiAwOWU5IEtJbmsgbVNMSSBTRmlVIGNnZ1o=", _: process.env._ })[key] ?? process.env[key] ?? void 0;
}
function validateEnv() {
  try {
    const result = envSchema.safeParse({
      WORDPRESS_API_URL: getEnvVar("WORDPRESS_API_URL"),
      REVALIDATE_SECRET: getEnvVar("REVALIDATE_SECRET"),
      WP_PREVIEW_SECRET: getEnvVar("WP_PREVIEW_SECRET"),
      WP_AUTH_TOKEN: getEnvVar("WP_AUTH_TOKEN")
    });
    if (!result.success) {
      const errors = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("\n");
      throw new Error(
        `Environment validation failed:
${errors}

Please check your .env file.`
      );
    }
    return result.data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("\n");
      throw new Error(
        `Environment validation failed:
${errors}

Please check your .env file.`
      );
    }
    throw error;
  }
}
const env = validateEnv();

export { cache as c, env as e, generateCacheKey as g };
