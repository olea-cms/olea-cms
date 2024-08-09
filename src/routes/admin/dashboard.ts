import { ElysiaApp } from "../../olea";
import { renderPugFile } from "../../libs/renderPug";
import { beforeHandleAuthRoute } from "../../hooks/beforeHandleAuthRoute";

export default (app: ElysiaApp) =>
  app.get(
    "/",
    async () => {
      try {
        return renderPugFile(`pages/admin-dashboard.pug`);
      } catch (error) {
        console.log(error);
      }
    },
    { beforeHandle: beforeHandleAuthRoute },
  );
