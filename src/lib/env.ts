import { z } from 'zod';

const envSchema = z.object({
  WORDPRESS_API_URL: z.string().url('WORDPRESS_API_URL must be a valid URL'),
  REVALIDATE_SECRET: z.string().min(1).optional(),
  WP_PREVIEW_SECRET: z.string().min(1).optional(),
  WP_AUTH_TOKEN: z.string().min(1).optional(),
});

function getEnvVar(key: string): string | undefined {
  return import.meta.env[key] ?? process.env[key] ?? undefined;
}

function validateEnv() {
  try {
    const result = envSchema.safeParse({
      WORDPRESS_API_URL: getEnvVar('WORDPRESS_API_URL'),
      REVALIDATE_SECRET: getEnvVar('REVALIDATE_SECRET'),
      WP_PREVIEW_SECRET: getEnvVar('WP_PREVIEW_SECRET'),
      WP_AUTH_TOKEN: getEnvVar('WP_AUTH_TOKEN'),
    });

    if (!result.success) {
      const errors = result.error.issues
        .map(issue => `${issue.path.join('.')}: ${issue.message}`)
        .join('\n');

      throw new Error(
        `Environment validation failed:\n${errors}\n\nPlease check your .env file.`
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues
        .map(issue => `${issue.path.join('.')}: ${issue.message}`)
        .join('\n');

      throw new Error(
        `Environment validation failed:\n${errors}\n\nPlease check your .env file.`
      );
    }
    throw error;
  }
}

export const env = validateEnv();
