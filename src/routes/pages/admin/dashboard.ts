import { Olea } from "../../../olea";
import { renderPugFile } from "../../../libs/renderPug";
import { beforeHandleAuthRoute } from "../../../hooks/beforeHandleAuthRoute";
import { SysHealthService } from "../../../services/sys-health";

export default (app: Olea) =>
  app
    .guard({
      beforeHandle: [beforeHandleAuthRoute],
    })
    .get("/", async () => {
      try {
        return renderPugFile(`pages/admin-dashboard.pug`, {
          INIT_TIME: await SysHealthService.getInitTime(),
          INIT_TIME_FORMATTED: await SysHealthService.getFormattedInitTime(),
        });
      } catch (error) {
        console.log(error);
      }
    });
