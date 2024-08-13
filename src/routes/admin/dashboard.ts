import { Olea } from "../../olea";
import { renderPugFile } from "../../libs/renderPug";
import { beforeHandleAuthRoute } from "../../hooks/beforeHandleAuthRoute";

export default (app: Olea) =>
  app
    .guard({
      beforeHandle: [beforeHandleAuthRoute],
    })
    .get("/", async () => {
      try {
        return renderPugFile(`pages/admin-dashboard.pug`);
      } catch (error) {
        console.log(error);
      }
    });
