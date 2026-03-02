/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly WORDPRESS_API_URL: string;
  readonly REVALIDATE_SECRET?: string;
  readonly WP_PREVIEW_SECRET?: string;
  readonly WP_AUTH_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
