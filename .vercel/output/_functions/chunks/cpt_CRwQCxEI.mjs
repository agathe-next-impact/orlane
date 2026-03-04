import { g as getAvailableContentTypes } from './content-types_pFgWyyhj.mjs';
import { d as getItemBySlug, e as getAllItemsByType } from './Layout_C_i7LX9C.mjs';

const EXCLUDED_TYPES = ["post", "page", "mediaitem"];
async function getCustomPostTypes() {
  const allTypes = await getAvailableContentTypes();
  return allTypes.filter(
    (t) => !EXCLUDED_TYPES.includes(t.graphqlSingleName.toLowerCase())
  );
}
async function resolveContentType(slug) {
  const types = await getCustomPostTypes();
  return types.find(
    (t) => t.graphqlPluralName.toLowerCase() === slug.toLowerCase()
  ) || null;
}
async function getCPTArchive(slug) {
  const type = await resolveContentType(slug);
  if (!type) return null;
  try {
    const items = await getAllItemsByType(type.graphqlPluralName);
    return { type, items };
  } catch (error) {
    return { type, items: [] };
  }
}
async function getCPTSingle(typeSlug, itemSlug) {
  const type = await resolveContentType(typeSlug);
  if (!type) return null;
  try {
    const item = await getItemBySlug(type.graphqlPluralName, itemSlug);
    if (!item) return null;
    return { type, item };
  } catch (error) {
    return null;
  }
}
function getCPTArchiveUrl(type) {
  return `/${type.graphqlPluralName}`;
}

export { getCPTArchiveUrl as a, getCPTSingle as b, getCPTArchive as c, getCustomPostTypes as g };
