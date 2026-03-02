# Headless WordPress + Astro Boilerplate

A modern, production-ready boilerplate for building headless WordPress sites with Astro SSR mode, TypeScript, and WPGraphQL.

## Features

- **Astro SSR Mode**: Server-side rendering for optimal performance and SEO
- **TypeScript**: Full type safety across the entire application
- **WPGraphQL Integration**: Efficient data fetching from WordPress
- **Automatic CPT Detection**: 🆕 Dynamically discovers and displays all WordPress Custom Post Types without manual configuration
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Advanced Custom Fields (ACF)**: Support for flexible content layouts
- **Optimized Images**: Automatic image optimization with responsive srcsets
- **SEO Ready**: Built-in SEO component with Open Graph and Twitter Card support
- **Dynamic Routing**: Automatic routing for posts, pages, and custom post types
- **Flexible Content System**: Modular component system for ACF flexible content fields

## Project Structure

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── flexible/
│   │   │   ├── FlexibleContent.astro    # Main flexible content mapper
│   │   │   ├── HeroSection.astro        # Hero section component
│   │   │   ├── ContentBlock.astro       # Content block component
│   │   │   └── ImageGallery.astro       # Image gallery component
│   │   ├── PostCard.astro               # Blog post card component
│   │   ├── SEO.astro                    # SEO meta tags component
│   │   └── WPImage.astro                # Optimized image component
│   ├── layouts/
│   │   └── Layout.astro                 # Base layout with header/footer
│   ├── lib/
│   │   └── wp.ts                        # WordPress GraphQL client
│   ├── pages/
│   │   ├── blog/
│   │   │   ├── index.astro              # Blog listing page
│   │   │   └── [slug].astro             # Individual blog post
│   │   ├── projects/
│   │   │   ├── index.astro              # Projects listing page
│   │   │   └── [slug].astro             # Individual project
│   │   ├── [slug].astro                 # Dynamic page routing
│   │   └── index.astro                  # Homepage
│   ├── types/
│   │   └── wp.d.ts                      # WordPress TypeScript types
├── .env.example
├── astro.config.mjs
└── tailwind.config.mjs
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A WordPress site with WPGraphQL plugin installed
- (Optional) Advanced Custom Fields Pro plugin for flexible content

### Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd headless-wp-astro
```

2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your WordPress GraphQL endpoint:
```env
WORDPRESS_API_URL=https://your-wordpress-site.com/graphql
```

5. Start the development server:
```bash
npm run dev
```

6. Open http://localhost:4321 in your browser

## WordPress Setup

### Required Plugins

1. **WPGraphQL** (Required)
   - Install from: https://wordpress.org/plugins/wp-graphql/
   - Or via WP-CLI: `wp plugin install wp-graphql --activate`

2. **WPGraphQL for Advanced Custom Fields** (REQUIRED for ACF CPT Detection)
   - Install from: https://github.com/wp-graphql/wp-graphql-acf
   - **⚠️ CRITICAL**: Without this plugin, ACF Custom Post Types will NOT be detected!
   - Requires ACF Pro or ACF Free plugin

3. **Yoast SEO** or **Rank Math** (Optional, for SEO support)
   - WPGraphQL for Yoast SEO: https://github.com/ashhitch/wp-graphql-yoast-seo
   - Or use Rank Math's built-in GraphQL support

### Setting Up WPGraphQL

After installing WPGraphQL:

1. Go to **GraphQL > Settings** in WordPress admin
2. Enable public introspection (optional, for development)
3. Your GraphQL endpoint will be: `https://yourdomain.com/graphql`

### Registering Custom Post Types

To add a custom post type (like "Projects") to WPGraphQL, add this to your theme's `functions.php`:

```php
function register_project_post_type() {
    register_post_type('project', [
        'label' => 'Projects',
        'public' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'project',
        'graphql_plural_name' => 'projects',
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
        'has_archive' => true,
        'rewrite' => ['slug' => 'projects'],
    ]);
}
add_action('init', 'register_project_post_type');
```

### Setting Up ACF Flexible Content

1. Install Advanced Custom Fields Pro
2. Create a new Field Group
3. Add a Flexible Content field named "flexible_content"
4. Add layouts matching the components in `src/components/flexible/`:

#### Hero Section Layout
- Layout Name: `hero_section`
- Fields:
  - `heading` (Text)
  - `subheading` (Text)
  - `cta_text` (Text)
  - `cta_url` (URL)

#### Content Block Layout
- Layout Name: `content_block`
- Fields:
  - `content` (WYSIWYG Editor)
  - `layout` (Select: left, right, center)

#### Image Gallery Layout
- Layout Name: `image_gallery`
- Fields:
  - `images` (Gallery)

5. In Field Group settings:
   - Location: Post Type is equal to "Project" (or "Page")
   - Show in GraphQL: Yes
   - GraphQL Field Name: `flexibleContent`

### ACF Field Group Settings

For any ACF field group to work with this boilerplate:

1. Set "Show in GraphQL" to **Yes**
2. Set a clear "GraphQL Field Name" (e.g., `acfFields`)
3. Make sure individual fields have GraphQL enabled

Example ACF configuration in PHP:

```php
if( function_exists('acf_add_local_field_group') ):

acf_add_local_field_group([
    'key' => 'group_project_fields',
    'title' => 'Project Fields',
    'fields' => [
        [
            'key' => 'field_client_name',
            'label' => 'Client Name',
            'name' => 'client_name',
            'type' => 'text',
            'show_in_graphql' => 1,
        ],
        [
            'key' => 'field_project_url',
            'label' => 'Project URL',
            'name' => 'project_url',
            'type' => 'url',
            'show_in_graphql' => 1,
        ],
        [
            'key' => 'field_flexible_content',
            'label' => 'Flexible Content',
            'name' => 'flexible_content',
            'type' => 'flexible_content',
            'show_in_graphql' => 1,
            'layouts' => [
                // Your layouts here
            ],
        ],
    ],
    'location' => [
        [
            [
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'project',
            ],
        ],
    ],
    'show_in_graphql' => 1,
    'graphql_field_name' => 'acfFields',
]);

endif;
```

## Dynamic Custom Post Type Detection

This boilerplate includes automatic detection of WordPress Custom Post Types! The system uses GraphQL introspection to discover all available content types without manual configuration.

### Key Features

- **Automatic Discovery**: Detects all CPTs registered with WPGraphQL support
- **Dynamic Queries**: Generates appropriate GraphQL queries for any content type
- **Zero Configuration**: No need to manually create routes for new CPTs
- **Type Flexible**: Works with any CPT structure
- **Fallback Detection**: Works even when GraphQL introspection is disabled

### Built-in Pages

- **`/content-types`**: View all detected content types with counts
- **Homepage**: Automatically displays custom post types
- **Dynamic Access**: Use `getAllItemsByType()` and `getItemBySlug()` for any CPT

### Testing Your CPT Detection

Run these scripts to verify your WordPress setup:

```bash
# Test if ACF CPTs are detected
node test-acf-cpt.mjs

# Test specific content type
node add-custom-cpt.mjs projects "Project" project

# Full validation test
node test-final-validation.mjs
```

### Adding ACF Custom Post Types

**IMPORTANT**: For ACF Custom Post Types to be detected, you MUST:

1. Install **WPGraphQL for ACF** plugin
2. In ACF, when creating/editing a Post Type:
   - Enable "Show in GraphQL"
   - Set "GraphQL Single Name" (e.g., `project`)
   - Set "GraphQL Plural Name" (e.g., `projects`)

For detailed instructions, see [ACF-CPT-SETUP.md](./ACF-CPT-SETUP.md).

### Adding Custom CPT Names

If your CPT is not auto-detected, add it manually using the script:

```bash
node add-custom-cpt.mjs yourCptPluralName "Display Name" yourCptSingleName
```

This will:
1. Test if the CPT exists in WordPress
2. Automatically add it to `src/lib/wp.ts`
3. Show you a preview of the data

### Usage Example

```typescript
import { getAllItemsByType, getItemBySlug } from '../lib/wp';

// Get all items of any content type
const portfolios = await getAllItemsByType('portfolios');
const testimonials = await getAllItemsByType('testimonials');

// Get single item by slug
const portfolio = await getItemBySlug('portfolios', 'my-work');
```

### Documentation

For complete documentation on dynamic CPT detection, see [DYNAMIC-CPT.md](./DYNAMIC-CPT.md).

## Customization

### Adding New Flexible Content Components

1. Create a new component in `src/components/flexible/`:
```astro
---
// src/components/flexible/YourComponent.astro
interface Props {
  fieldGroupName: string;
  yourField?: string;
}

const { yourField } = Astro.props;
---

<section class="your-component">
  <!-- Your component markup -->
</section>
```

2. Register it in `FlexibleContent.astro`:
```typescript
const componentMap: Record<string, any> = {
  'Project_Acffields_FlexibleContent_YourComponent': YourComponent,
  // ... other components
};
```

3. Add the corresponding layout in WordPress ACF

### Modifying GraphQL Queries

Edit queries in `src/lib/wp.ts`:

```typescript
export const queries = {
  getPostBySlug: `
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        title
        content
        // Add your custom fields here
      }
    }
  `,
};
```

### Adding Custom Types

Add new types in `src/types/wp.d.ts`:

```typescript
export interface WPCustomType {
  id: string;
  title: string;
  // Your custom fields
}
```

## Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deployment Platforms

This boilerplate can be deployed to any platform that supports Node.js:

- **Vercel**: Zero-config deployment
- **Netlify**: Add build command `npm run build`
- **Railway**: Automatic deployment from Git
- **DigitalOcean App Platform**: Container-based deployment

#### Environment Variables

Make sure to set `WORDPRESS_API_URL` in your deployment platform's environment variables.

## Development

### Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |

### SSR vs SSG

This boilerplate uses SSR (Server-Side Rendering) by default. To switch to SSG (Static Site Generation):

1. Update `astro.config.mjs`:
```javascript
export default defineConfig({
  output: 'static', // Change from 'server' to 'static'
  integrations: [tailwind()]
});
```

2. Add `getStaticPaths` to dynamic routes:
```astro
---
export async function getStaticPaths() {
  const posts = await getAllPosts();
  return posts.map(post => ({
    params: { slug: post.slug },
  }));
}

const { slug } = Astro.params;
---
```

## Troubleshooting

### GraphQL Errors

If you get GraphQL errors:

1. Verify your `WORDPRESS_API_URL` is correct
2. Check WPGraphQL is installed and activated
3. Test your endpoint directly: `https://your-site.com/graphql`
4. Use GraphiQL IDE in WordPress admin: **GraphQL > GraphiQL IDE**

### ACF Fields Not Showing

1. Ensure "Show in GraphQL" is enabled on the field group
2. Check field names match your GraphQL query
3. Verify WPGraphQL for ACF plugin is installed
4. Clear WordPress object cache if using caching plugins

### Image Optimization Issues

If images aren't loading:

1. Check WordPress media URLs are accessible
2. Verify CORS settings on your WordPress server
3. Ensure images exist in WordPress media library

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this boilerplate for any project.

## Resources

- [Astro Documentation](https://docs.astro.build)
- [WPGraphQL Documentation](https://www.wpgraphql.com/docs/introduction)
- [Advanced Custom Fields](https://www.advancedcustomfields.com/resources/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
