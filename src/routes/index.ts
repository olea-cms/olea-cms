// routes/index.ts
import type { ElysiaApp } from "../olea";
import { renderPugFile } from "../libs/renderPug";

export default (app: ElysiaApp) =>
  app.all("/", async ({ html }) => {
    try {
      return html(renderPugFile("index.pug"));
    } catch (e) {
      console.log(e);
    }
  });
