import { http, HttpResponse, passthrough } from "msw";
import { pug } from "../tests/utils";

export const handlers = [
  http.get("https://unpkg.com/htmx.org@2.0.1/dist/htmx.js", () =>
    passthrough(),
  ),
  http.get("https://unpkg.com/alpinejs", () => passthrough()),
  http.get("https://unpkg.com/alpinejs@3.14.1", () => passthrough()),
  http.get("https://unpkg.com/alpinejs@3.14.1/dist/cdn.min.js", () =>
    passthrough(),
  ),
  http.get("/api/data", () => {
    const html = pug`
#results(hx-swap-oob="true")
  h1 Server rendered pug`;
    return new HttpResponse(html.outerHTML, {
      headers: { "Content-Type": "text/html" },
    });
  }),
  http.get("/api/blog/categories", () => {
    const html = pug`
ul.p-2#blog-categories
  li #[a Cooking]
  li #[a Biking]`;
    return new HttpResponse(html.outerHTML, {
      headers: { "Content-Type": "text/html" },
    });
  }),
];
