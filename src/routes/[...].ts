import type { Olea } from "../olea";
import { renderPugFile } from "../libs/renderPug";

export default (app: Olea) =>
  app.all("*", async ({ html }) => {
    try {
      return html(renderPugFile("index.pug"));
    } catch (e) {
      console.log(e);
    }
  });
