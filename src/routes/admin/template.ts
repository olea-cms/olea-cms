import { ElysiaApp } from "../../olea";
import { renderPugFile } from "../../libs/renderPug";

export default (app: ElysiaApp) =>
  app.get("/", async ({ cookie: { auth } }) => {
    if (auth) {
      try {
        return renderPugFile(`pages/admin.pug`);
      } catch (error) {
        console.log(error);
      }
    }
  });
