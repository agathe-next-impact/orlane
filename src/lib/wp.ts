export { fetchGraphQL, fetchGraphQLWithAuth } from './wp/fetcher';
export type { GraphQLResponse, GraphQLVariables } from './wp/fetcher';

export { getAvailableContentTypes } from './wp/content-types';
export type { ContentType } from './wp/content-types';

export {
  getAllItemsByType,
  getItemBySlug,
  getAllPosts,
  getPostBySlug,
  getAllPages,
  getPageBySlug,
  getAllProjects,
  getProjectBySlug,
  getAllCustomPostTypeItems,
  getCustomPostTypeItemBySlug,
  getItemsCountByType,
  getAvailableMenus,
  getMenuByLocation,
  getFooterMenus,
} from './wp/queries';

export {
  getCustomPostTypes,
  getCPTArchive,
  getCPTSingle,
  getCPTArchiveUrl,
} from './wp/cpt';

export { resolveContent } from './wp/resolver';
export type { ResolvedContent } from './wp/resolver';
