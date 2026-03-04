import 'piccolore';
import { p as decodeKey } from './chunks/astro/server_2mt_V2V1.mjs';
import 'clsx';
import './chunks/astro-designed-error-pages_C0l2hvQe.mjs';
import 'es-module-lexer';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_0q7QVOSo.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/DEV/orlane/","cacheDir":"file:///C:/DEV/orlane/node_modules/.astro/","outDir":"file:///C:/DEV/orlane/dist/","srcDir":"file:///C:/DEV/orlane/src/","publicDir":"file:///C:/DEV/orlane/public/","buildClientDir":"file:///C:/DEV/orlane/dist/client/","buildServerDir":"file:///C:/DEV/orlane/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.B9umQdoZ.css"}],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/preview","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/preview\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"preview","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/preview.ts","pathname":"/api/preview","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/revalidate","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/revalidate\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"revalidate","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/revalidate.ts","pathname":"/api/revalidate","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.B9umQdoZ.css"},{"type":"inline","content":".line-clamp-3[data-astro-cid-iyiqi2so]{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}\n"}],"routeData":{"route":"/blog","isIndex":true,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/index.astro","pathname":"/blog","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"inline","content":".content-type-card[data-astro-cid-xa3wtfvf]{border:2px solid transparent}.content-type-card[data-astro-cid-xa3wtfvf]:hover{border-color:#a8bfa3}\n"},{"type":"external","src":"/_astro/_slug_.B9umQdoZ.css"}],"routeData":{"route":"/content-types","isIndex":false,"type":"page","pattern":"^\\/content-types\\/?$","segments":[[{"content":"content-types","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/content-types.astro","pathname":"/content-types","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.B9umQdoZ.css"},{"type":"inline","content":".line-clamp-3[data-astro-cid-iyiqi2so]{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.B9umQdoZ.css"},{"type":"inline","content":".line-clamp-3[data-astro-cid-iyiqi2so]{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}\n"}],"routeData":{"route":"/[...slug]","isIndex":false,"type":"page","pattern":"^(?:\\/(.*?))?\\/?$","segments":[[{"content":"...slug","dynamic":true,"spread":true}]],"params":["...slug"],"component":"src/pages/[...slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/DEV/orlane/src/pages/404.astro",{"propagation":"none","containsHead":true}],["C:/DEV/orlane/src/pages/[...slug].astro",{"propagation":"none","containsHead":true}],["C:/DEV/orlane/src/pages/blog/index.astro",{"propagation":"none","containsHead":true}],["C:/DEV/orlane/src/pages/content-types.astro",{"propagation":"none","containsHead":true}],["C:/DEV/orlane/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/api/preview@_@ts":"pages/api/preview.astro.mjs","\u0000@astro-page:src/pages/api/revalidate@_@ts":"pages/api/revalidate.astro.mjs","\u0000@astro-page:src/pages/blog/index@_@astro":"pages/blog.astro.mjs","\u0000@astro-page:src/pages/content-types@_@astro":"pages/content-types.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:src/pages/[...slug]@_@astro":"pages/_---slug_.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_CZKcrlaY.mjs","C:/DEV/orlane/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BKnKzsuh.mjs","C:/DEV/orlane/src/components/AnimatedHeartSVG.astro?astro&type=script&index=0&lang.ts":"_astro/AnimatedHeartSVG.astro_astro_type_script_index_0_lang.Cobib3jc.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/DEV/orlane/src/components/AnimatedHeartSVG.astro?astro&type=script&index=0&lang.ts","(function(){const h=document.getElementById(\"skeleton-path\"),e=document.getElementById(\"pen-tip\");if(!h)return;const o=h;if(window.matchMedia(\"(prefers-reduced-motion: reduce)\").matches)return;const s=o.getTotalLength();o.style.strokeDasharray=String(s),o.style.strokeDashoffset=String(-s),e&&(e.style.display=\"\");const u=[[0,0],[1,1]];function y(n){return n<.5?2*n*n:1-Math.pow(-2*n+2,2)/2}function g(n){for(let t=0;t<u.length-1;t++){const[a,r]=u[t],[i,c]=u[t+1];if(n<=c){const f=(n-r)/(c-r),p=a===i?f:y(f);return a+p*(i-a)}}return 1}function l(n,t){return Math.sin(n*23.4+t*7.1)*.75+Math.sin(n*11.7+t*13.3)*.45+Math.sin(n*47.1+t*3.7)*.3}const d=3e3,A=performance.now();function m(n){const t=Math.min((n-A)/d,1),r=g(t)*s;if(o.style.strokeDashoffset=String(r-s),e)if(t<.99){const i=o.getPointAtLength(Math.min(s-r+1,s)),c=l(t*6,1),f=l(t*6,2);e.setAttribute(\"cx\",String(i.x+c)),e.setAttribute(\"cy\",String(i.y+f));const p=t>.96?(.99-t)/.03:1;e.style.opacity=String(.85*p)}else e.style.display=\"none\";t<1&&requestAnimationFrame(m)}requestAnimationFrame(m)})();"]],"assets":["/_astro/_slug_.B9umQdoZ.css","/dessin-enfant-2.jpg","/dessin-enfant-3.jpg","/dessin-enfant-4.jpg","/dessin-enfant-5.jpg","/dessin-enfant.jpg","/favicon.svg","/illustration-coeur.svg","/logo-orlane-transparent.png","/logo-orlane-transparent.svg","/photo-enfant.jpg","/photo-orlane.jpg"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"M2r9guUVd2/76OjAbHtKppP9C6uMLipSC+MasMyY49w="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
