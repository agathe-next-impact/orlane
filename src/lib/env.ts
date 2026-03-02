import { z } from 'zod';

const envSchema = z.object({
  WORDPRESS_API_URL: z.string().url('WORDPRESS_API_URL must be a valid URL'),
});

function validateEnv() {
  try {
    const result = envSchema.safeParse({
      WORDPRESS_API_URL: import.meta.env.WORDPRESS_API_URL,
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
