import { beforeHandleAuthRoute } from "../../../hooks/beforeHandleAuthRoute";
import { renderPugFile } from "../../../libs/renderPug";
import { Olea } from "../../../olea";
import { SysHealthService } from "../../../services/sys-health";

export default (app: Olea) =>
  app
    .guard({
      beforeHandle: [beforeHandleAuthRoute],
    })
    .get("/", async () => {
      return renderPugFile("components/admin/dashboard/sys-health-card.pug", {
        INIT_TIME: await SysHealthService.getInitTime(),
        INIT_TIME_FORMATTED: await SysHealthService.getFormattedInitTime(),
      });
    });
