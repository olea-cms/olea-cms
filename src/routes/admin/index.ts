import { ElysiaApp } from "../..";
import { renderFile } from "pug";

export default (app: ElysiaApp) =>
  app.get("/template", async () => {
    try {
      return renderFile(
        `${import.meta.dir}/../../pages/admin.pug`,
        process.env,
      );
    } catch (error) {
      console.log(error);
    }
  });
