import { ElysiaApp } from "../..";
import { renderPugFile } from "../../libs/renderPug";

export default (app: ElysiaApp) =>
  app.get("/template", async () => {
    try {
      return renderPugFile(`pages/admin.pug`);
    } catch (error) {
      console.log(error);
    }
  });
