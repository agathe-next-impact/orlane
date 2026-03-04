import { d as defineMiddleware, s as sequence } from './chunks/index_D2MTo3vy.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_C0l2hvQe.mjs';
import 'piccolore';
import './chunks/astro/server_2mt_V2V1.mjs';
import 'clsx';

const onRequest$1 = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const cleaned = url.pathname.replace(/\/{2,}/g, "/");
  if (cleaned !== url.pathname) {
    return context.redirect(cleaned + url.search, 301);
  }
  const response = await next();
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
  }
  return response;
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
