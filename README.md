# Headless WordPress + Astro

Frontend headless pour WordPress utilisant Astro SSR, WPGraphQL et TypeScript.

## Stack technique

- **Astro 5** en mode SSR (Node.js standalone)
- **WPGraphQL** pour la communication avec WordPress
- **TypeScript** avec validation Zod des variables d'environnement
- **Tailwind CSS** pour le styling
- **Cache in-memory** avec TTL et invalidation par webhook

## Structure du projet

```
src/
├── components/
│   ├── Navigation.astro           # Menu dynamique (auto-detection WordPress)
│   ├── PostCard.astro             # Carte d'article
│   ├── SEO.astro                  # Meta tags SEO / Open Graph
│   ├── WPImage.astro              # Image WordPress optimisee
│   └── flexible/                  # Composants ACF Flexible Content
│       ├── FlexibleContent.astro
│       ├── HeroSection.astro
│       ├── ContentBlock.astro
│       └── ImageGallery.astro
├── layouts/
│   └── Layout.astro               # Layout principal (header, footer, nav)
├── lib/
│   ├── cache.ts                   # Cache in-memory avec TTL
│   ├── env.ts                     # Validation Zod des variables d'env
│   ├── errors.ts                  # Classes d'erreur personnalisees
│   ├── wp.ts                      # Barrel exports
│   ├── wp/
│   │   ├── fetcher.ts             # Client GraphQL (standard + authentifie)
│   │   ├── content-types.ts       # Detection automatique des CPT
│   │   ├── queries.ts             # Requetes GraphQL (posts, pages, menus)
│   │   ├── cpt.ts                 # Module CPT haut niveau
│   │   └── resolver.ts            # Resolution de contenu par slug
│   └── utils/
│       ├── date.ts                # Formatage de dates
│       └── sanitize.ts            # Sanitisation HTML
├── pages/
│   ├── index.astro                # Page d'accueil
│   ├── [...slug].astro            # Route catch-all (pages, posts, CPT)
│   ├── blog/
│   │   └── index.astro            # Archive du blog
│   ├── content-types.astro        # Liste de tous les CPT detectes
│   └── api/
│       ├── revalidate.ts          # Webhook d'invalidation du cache
│       └── preview.ts             # Preview des brouillons WordPress
├── styles/
│   └── prose.css                  # Styles pour le contenu WordPress
└── types/
    └── wp.d.ts                    # Interfaces TypeScript WordPress

wp-plugins/
└── astro-headless-preview/
    └── astro-headless-preview.php  # Plugin WP : preview + revalidation
```

## Installation

### Pre-requis

- Node.js 18+
- WordPress avec [WPGraphQL](https://wordpress.org/plugins/wp-graphql/) active

### Demarrage

```bash
npm install
cp .env.example .env.local
# Editer .env.local avec vos valeurs
npm run dev
```

### Variables d'environnement

```env
# Requis
WORDPRESS_API_URL=https://votre-site.com/graphql

# Invalidation du cache (optionnel)
REVALIDATE_SECRET=un-secret-aleatoire

# Preview des brouillons (optionnel)
WP_PREVIEW_SECRET=votre-secret-preview
WP_AUTH_TOKEN=Basic dXNlcjphcHBfcGFzc3dvcmQ=
```

## Routage

Toutes les URLs sont des slugs directs apres le domaine, comme dans WordPress :

| URL | Contenu |
|-----|---------|
| `/` | Page d'accueil |
| `/blog` | Archive des articles |
| `/a-propos` | Page WordPress "A propos" |
| `/mon-article` | Article WordPress |
| `/projects` | Archive du CPT "Projects" |
| `/projects/mon-projet` | Item du CPT "Projects" |
| `/content-types` | Liste des types de contenu detectes |

Le fichier `[...slug].astro` resout automatiquement chaque slug vers le bon type de contenu via le module `resolver.ts`. Ordre de priorite :

1. Archive CPT (le slug correspond au pluralName d'un CPT)
2. Page WordPress
3. Article WordPress
4. Item CPT (recherche dans tous les CPT enregistres)

## Modules principaux

### Menu dynamique

Le composant `Navigation.astro` detecte automatiquement le menu WordPress a utiliser :

1. Menu assigne a l'emplacement `PRIMARY`
2. Premier menu avec un emplacement assigne
3. Premier menu par ID

Sous-menus supportes. Fallback sur des liens codes en dur si aucun menu n'est trouve.

### Detection des CPT

Le module `content-types.ts` detecte automatiquement tous les Custom Post Types enregistres dans WPGraphQL, via 3 strategies en cascade :

1. **API** : requete `contentTypes` de WPGraphQL
2. **Introspection** : analyse du schema GraphQL
3. **Manuel** : test d'une liste de noms courants

Les CPT detectes sont disponibles via :

```typescript
import { getCustomPostTypes, getCPTArchive, getCPTSingle } from './lib/wp';

const types = await getCustomPostTypes();           // Liste des CPT (exclut posts/pages)
const archive = await getCPTArchive('projects');     // Config + items d'un CPT
const item = await getCPTSingle('projects', 'slug'); // Item unique d'un CPT
```

### Cache et invalidation

Le cache in-memory a deux niveaux de TTL :
- **30 secondes** pour les requetes GraphQL
- **2 minutes** pour la detection des types de contenu

L'endpoint `/api/revalidate` permet a WordPress de purger le cache instantanement :

```
POST /api/revalidate
Headers: { "x-revalidate-secret": "votre-secret" }
Body:    { "post_type": "post", "slug": "mon-article" }
```

Sans body, le cache est entierement purge.

### Preview des brouillons

Le systeme de preview permet de visualiser les brouillons/revisions WordPress directement dans le frontend Astro.

**Cote WordPress** : installer le plugin `wp-plugins/astro-headless-preview/` qui :
- Remplace le bouton "Preview" par un lien vers le frontend Astro
- Envoie un webhook de revalidation a chaque publication (`save_post`) et mise a jour de menu (`wp_update_nav_menu`)
- Propose une page de configuration (Reglages > Astro Preview)

**Cote Astro** : l'endpoint `/api/preview` :
- Valide le secret partage
- Fait une requete GraphQL authentifiee (`WP_AUTH_TOKEN`) avec `asPreview: true`
- Rend une page HTML autonome avec banniere de preview

**Configuration du token** : dans WordPress, creer un Application Password (Utilisateurs > Profil > Mots de passe d'application), puis encoder en base64 :

```
WP_AUTH_TOKEN=Basic base64(username:application_password)
```

## Plugins WordPress requis/optionnels

| Plugin | Statut | Fonction |
|--------|--------|----------|
| WPGraphQL | Requis | API GraphQL |
| WPGraphQL for ACF | Optionnel | Expose les champs ACF dans GraphQL |
| Yoast SEO / Rank Math | Optionnel | Champs `seo` dans les requetes |
| ACF Pro | Optionnel | Flexible Content, champs avances |
| Astro Headless Preview | Optionnel | Preview + revalidation (inclus dans `wp-plugins/`) |

Le site s'adapte automatiquement a la presence ou absence de chaque plugin optionnel.

## Enregistrer un CPT dans WPGraphQL

```php
register_post_type('project', [
    'label' => 'Projects',
    'public' => true,
    'show_in_graphql' => true,
    'graphql_single_name' => 'project',
    'graphql_plural_name' => 'projects',
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
]);
```

## Commandes

| Commande | Action |
|----------|--------|
| `npm run dev` | Serveur de developpement (`localhost:4321`) |
| `npm run build` | Build de production dans `./dist/` |
| `npm run preview` | Preview du build de production |

## Deploiement

Le projet utilise l'adapter `@astrojs/node` en mode standalone. Compatible avec toute plateforme supportant Node.js (Vercel, Railway, DigitalOcean, VPS).

Variables d'environnement a configurer sur la plateforme :
- `WORDPRESS_API_URL` (requis)
- `REVALIDATE_SECRET` (si invalidation active)
- `WP_PREVIEW_SECRET` et `WP_AUTH_TOKEN` (si preview active)

## Depannage

**Le contenu ne se met pas a jour** : verifier que `REVALIDATE_SECRET` est configure des deux cotes (WordPress plugin + `.env.local`). Tester manuellement : `GET /api/revalidate?secret=votre-secret`.

**Les menus ne s'affichent pas** : verifier que WPGraphQL expose les menus (natif depuis v1.0). Tester dans GraphiQL : `{ menus { nodes { name locations } } }`.

**Les CPT ne sont pas detectes** : verifier que `show_in_graphql` est `true` dans l'enregistrement du CPT. Si ACF est utilise, installer WPGraphQL for ACF.

**La preview ne fonctionne pas** : verifier que `WP_AUTH_TOKEN` est correct et que l'Application Password est active. Tester : `GET /api/preview?secret=xxx&id=1&postType=post`.
