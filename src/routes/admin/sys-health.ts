import { beforeHandleAuthRoute } from "../../hooks/beforeHandleAuthRoute";
import { Olea } from "../../olea";
import { SysHealthService } from "../../services/sys-health";
import { pug } from "../../utils";

export const WS_ADMIN_SYSHEALTH_AVGRESPONSETIME =
  "/admin/sys-health/avg-response-time";

export default (app: Olea) =>
  app.ws("/avg-response-time", {
    beforeHandle: beforeHandleAuthRoute,
    open: async function (ws) {
      ws.subscribe(WS_ADMIN_SYSHEALTH_AVGRESPONSETIME);
      ws.send(
        pug`.stat-value#avg-response-time ${(await SysHealthService.getAvgResponseTime()).toFixed(2)}ms`,
      );
      ws.send(
        pug`span#min-response-time ${(await SysHealthService.getMinResponseTime()).toFixed(2)}ms`,
      );
      ws.send(
        pug`span#max-response-time ${(await SysHealthService.getMaxResponseTime()).toFixed(2)}ms`,
      );
    },
    message: async function (ws, message) {
      console.log({ ws, message });
    },
  });
