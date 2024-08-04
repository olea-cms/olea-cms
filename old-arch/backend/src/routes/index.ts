// routes/index.ts
import { renderFile } from "pug";
import type { ElysiaApp } from "..";

export default (app: ElysiaApp) =>
  app.all("*", ({ html }) => {
    try {
      return html(
        renderFile(`${import.meta.dir}/pages/index.pug`, { ...process.env }),
      );
    } catch (e) {
      console.log(e);
    }
  });
