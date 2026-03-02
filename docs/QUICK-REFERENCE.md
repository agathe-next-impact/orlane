# Référence rapide - URLs et Fonctions

## Structure des URLs

### Types natifs WordPress

| Type | Archive | Single | Fichier |
|------|---------|--------|---------|
| Posts (Articles) | `/blog/` | `/blog/[slug]/` | `src/pages/blog/index.astro` et `src/pages/blog/[slug].astro` |
| Pages | `/pages/` | `/pages/[slug]/` | `src/pages/pages/index.astro` et `src/pages/pages/[slug].astro` |

### Custom Post Types (CPT)

| Type | Archive | Single | Fichier |
|------|---------|--------|---------|
| Tous les CPT | `/[cpt-name]/` | `/[cpt-name]/[slug]/` | `src/pages/[contentType]/[slug].astro` |

**Exemples** :
- CPT "Tests" : `/tests/` et `/tests/test/`
- CPT "Projects" : `/projects/` et `/projects/mon-projet/`
- CPT "Portfolio" : `/portfolio/` et `/portfolio/item-name/`

### Pages spéciales

| Page | URL | Description |
|------|-----|-------------|
| Accueil | `/` | Page d'accueil |
| Types de contenu | `/content-types` | Liste tous les CPT détectés |

## Fonctions principales

### Récupérer du contenu

```typescript
import {
  getAllPosts,
  getPostBySlug,
  getAllPages,
  getPageBySlug,
  getAllItemsByType,
  getItemBySlug,
  getAvailableContentTypes
} from './lib/wp';

// Posts
const posts = await getAllPosts();
const post = await getPostBySlug('mon-article');

// Pages
const pages = await getAllPages();
const page = await getPageBySlug('ma-page');

// N'importe quel CPT
const items = await getAllItemsByType('projects');
const item = await getItemBySlug('projects', 'mon-projet');

// Types disponibles
const types = await getAvailableContentTypes();
```

## Champs disponibles par type

### Posts (Articles)

**Garantis** :
- `id`, `title`, `slug`, `content`, `excerpt`, `date`, `modified`, `uri`
- `author` (nom, avatar)
- `categories` (liste)
- `tags` (liste)
- `featuredImage`

**Optionnels** :
- `seo` (si Yoast/Rank Math installé)

### Pages

**Garantis** :
- `id`, `title`, `slug`, `content`, `modified`, `uri`
- `featuredImage`
- `parent` (si page enfant)

**Optionnels** :
- `seo` (si Yoast/Rank Math installé)
- `acfFields` (si ACF installé)
- `acfFields.flexibleContent` (si ACF Flexible Content configuré)

### Custom Post Types

**Garantis** :
- `id`, `title`, `slug`, `date`, `modified`, `uri`

**Peut-être disponible** (dépend de la config du CPT) :
- `content`, `excerpt`, `author`, `featuredImage`, `seo`, `acfFields`

## Composants utiles

### Images optimisées
```astro
import WPImage from '../components/WPImage.astro';

<WPImage
  image={featuredImage}
  class="w-full h-64 object-cover"
  loading="lazy"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### SEO
```astro
import SEO from '../components/SEO.astro';

<Layout>
  <SEO
    title={page.seo?.title || page.title}
    description={page.seo?.metaDesc}
    image={page.seo?.opengraphImage?.sourceUrl}
    type="article"
  />
</Layout>
```

### Card de post
```astro
import PostCard from '../components/PostCard.astro';

{posts.map(post => (
  <PostCard post={post} basePath="/blog" />
))}
```

### Flexible Content
```astro
import FlexibleContent from '../components/flexible/FlexibleContent.astro';

{page.acfFields?.flexibleContent && (
  <FlexibleContent blocks={page.acfFields.flexibleContent} />
)}
```

## Configuration WordPress

### Activer un CPT dans GraphQL

Dans `functions.php` :

```php
register_post_type('mon_cpt', [
    'label' => 'Mon CPT',
    'public' => true,
    'show_in_graphql' => true,           // ← Important
    'graphql_single_name' => 'monItem',   // ← Important
    'graphql_plural_name' => 'mesItems',  // ← Important
    'supports' => ['title', 'editor', 'thumbnail'],
]);
```

### ACF pour GraphQL

Dans les paramètres du Field Group ACF :
- ✅ "Show in GraphQL" = Yes
- ✅ "GraphQL Field Name" = acfFields

## Commandes utiles

```bash
# Développement
npm run dev              # Lance le serveur de dev

# Build
npm run build            # Build de production
npm run preview          # Preview du build

# Tests (si vous avez des CPT)
node test-cpt-detection.mjs        # Test la détection
node test-final-validation.mjs     # Validation complète
```

## Débogage

### Vérifier l'endpoint GraphQL
```bash
curl -X POST https://votre-site.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ posts { nodes { id title } } }"}'
```

### Tester dans WordPress
1. Aller dans **GraphQL > GraphiQL IDE**
2. Tester la requête :
```graphql
query {
  contentTypes {
    nodes {
      name
      graphqlSingleName
      graphqlPluralName
    }
  }
}
```

### Logs
Les erreurs GraphQL sont loggées dans la console :
```
console.error('GraphQL errors:', errors)
```

## Variables d'environnement

**.env**
```env
WORDPRESS_API_URL=https://votre-site.com/graphql
```

## Architecture des fichiers

```
src/
├── lib/
│   └── wp.ts                    # Client GraphQL + fonctions
├── types/
│   └── wp.d.ts                  # Types TypeScript
├── components/
│   ├── PostCard.astro          # Card pour liste
│   ├── SEO.astro               # Meta tags SEO
│   ├── WPImage.astro           # Images optimisées
│   └── flexible/               # Composants ACF
│       ├── FlexibleContent.astro
│       ├── HeroSection.astro
│       ├── ContentBlock.astro
│       └── ImageGallery.astro
└── pages/
    ├── index.astro             # Accueil
    ├── content-types.astro     # Liste des CPT
    ├── blog/
    │   ├── index.astro         # Archive blog
    │   └── [slug].astro        # Single post
    ├── pages/
    │   ├── index.astro         # Archive pages
    │   └── [slug].astro        # Single page
    └── [contentType]/
        ├── index.astro         # Archive CPT
        └── [slug].astro        # Single CPT
```

## Support des plugins

| Plugin | Statut | Champ fourni |
|--------|--------|--------------|
| WPGraphQL | ✅ Requis | - |
| WPGraphQL for ACF | ⚠️ Optionnel | `acfFields` |
| Yoast SEO | ⚠️ Optionnel | `seo` |
| Rank Math | ⚠️ Optionnel | `seo` |
| ACF Pro | ⚠️ Optionnel | `acfFields`, `flexibleContent` |

**Légende** :
- ✅ Requis = Le site ne fonctionne pas sans
- ⚠️ Optionnel = Le site s'adapte automatiquement si absent

## Bonnes pratiques

1. **Toujours utiliser les fonctions de `wp.ts`** plutôt que d'appeler fetchGraphQL directement
2. **Vérifier l'existence des champs optionnels** avec `?.` ou `&&`
3. **Utiliser le composant WPImage** pour toutes les images WordPress
4. **Définir des sizes** appropriés pour les images responsive
5. **Tester avec et sans plugins** optionnels pour vérifier la robustesse

## Résolution de problèmes courants

### "Content type not found"
→ Vérifier que le CPT a `show_in_graphql` = true

### "Cannot query field X"
→ Le plugin fournissant ce champ n'est pas installé (normal, le système s'adapte)

### Images ne s'affichent pas
→ Vérifier les CORS du serveur WordPress

### Page 404 sur un CPT
→ Le CPT n'est pas détecté, vérifier les noms GraphQL

### ACF ne s'affiche pas
→ Installer "WPGraphQL for ACF" plugin
