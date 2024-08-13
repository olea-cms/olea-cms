import { Elysia } from "elysia";
import staticPlugin from "@elysiajs/static";
import swagger from "@elysiajs/swagger";
import { html } from "@elysiajs/html";
import { htmx } from "@gtramontina.com/elysia-htmx";
import { tailwind } from "@gtramontina.com/elysia-tailwind";
import { opentelemetry } from "@elysiajs/opentelemetry";
import logixlysia from "logixlysia";
import { autoload } from "elysia-autoload";
import jwt from "@elysiajs/jwt";

import { renderFile } from "pug";

import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { renderPugFile } from "./libs/renderPug";
import { db } from "./db";
import { avgResponseTimes } from "./schema";
import { eq } from "drizzle-orm";
import { SysHealthService } from "./services/sys-health";
import { WS_ADMIN_SYSHEALTH_AVGRESPONSETIME } from "./routes/admin/sys-health";
import { pug } from "./utils";

// @ts-expect-error
import.meta.env.PROD = import.meta.env.NODE_ENV === "production";
// @ts-expect-error
import.meta.env.DEV = !import.meta.env.PROD;

export const renderCatastrophic = (env = {}) =>
  renderFile(`${import.meta.dir}/components/catastrophic-error.pug`, env);

const timer = {
  time: 0,
  start() {
    this.time = performance.now();
  },
  end() {
    this.time = performance.now() - this.time;
    console.log(`Process took ${this.time}`);
    return this.time;
  },
};

export const app = new Elysia()
  // .use(
  //   hmr({
  //     prefixToWatch: `${import.meta.dir}/pages`,
  //   }),
  // )
  .use(
    opentelemetry({
      traceExporter: new OTLPTraceExporter(),
      instrumentations: [
        getNodeAutoInstrumentations({
          "@opentelemetry/instrumentation-fs": {
            enabled: false,
          },
        }),
      ],
    }),
  )
  .onError(({ code, error }) => {
    if (import.meta.env.DEV) console.error({ code, error });
  })
  .use(
    swagger({
      documentation: {
        info: {
          title: "Olea Documentation",
          version: "0.0.1",
        },
      },
    }),
  )
  .state("averageResponseTime", -1)
  .use(html())
  .use(htmx())
  .get("/ping", () => "pong")
  .use(
    staticPlugin({
      prefix: "/public",
    }),
  )
  .use(
    logixlysia({
      config: {
        showBanner: true,
        ip: true,
      },
    }),
  )
  .use(
    jwt({
      name: "jwt",
      secret: process.env.OLEA_JWT_SECRET!,
      exp: import.meta.env.DEV ? "15m" : "1d",
    }),
  )
  .decorate("timer", timer)
  .use(
    await autoload({
      schema: ({ path, url }) => {
        const tag = url.split("/").at(0)!;

        return {
          beforeHandle: ({ request, timer }) => {
            console.log(`[autoloaded route]: ${request.url}`);
            timer.start();
          },
          afterResponse: async ({ timer }) => {
            SysHealthService.getAvgResponseTime();
            const responseTime = timer.end();
            const oldStats = await db
              .select()
              .from(avgResponseTimes)
              .where(eq(avgResponseTimes.route, url));
            if (oldStats.length) {
              const responseStats = {
                numRequests: oldStats[0].numRequests + 1,
                avgResponseTime:
                  (oldStats[0].avgResponseTime + responseTime) /
                  (oldStats[0].numRequests + 1),
              };
              await db
                .insert(avgResponseTimes)
                .values({
                  route: url,
                  ...responseStats,
                })
                .onConflictDoUpdate({
                  target: avgResponseTimes.route,
                  set: responseStats,
                });
            } else {
              await db.insert(avgResponseTimes).values({
                route: url,
                numRequests: 1,
                avgResponseTime: responseTime,
              });
            }
            app.server?.publish(
              WS_ADMIN_SYSHEALTH_AVGRESPONSETIME,
              pug`.stat-value#avg-response-time ${(await SysHealthService.getAvgResponseTime()).toFixed(2)}ms`,
            );
            app.server?.publish(
              WS_ADMIN_SYSHEALTH_AVGRESPONSETIME,
              pug`span#min-response-time ${(await SysHealthService.getMinResponseTime()).toFixed(2)}ms`,
            );
            app.server?.publish(
              WS_ADMIN_SYSHEALTH_AVGRESPONSETIME,
              pug`span#max-response-time ${(await SysHealthService.getMaxResponseTime()).toFixed(2)}ms`,
            );
          },
          // detail: {
          //   // description: `Route autoloaded from ${path}`,
          //   tags: [tag],
          // },
        };
      },
    }),
  )
  .use(
    tailwind({
      path: "/public/stylesheet.css",
      source: "./src/styles.css",
      config: "./tailwind.config.js",
      options: {
        minify: false,
        map: true,
        autoprefixer: true,
      },
    }),
  )
  .all("*", async ({ html }) => {
    try {
      return html(renderPugFile("index.pug"));
    } catch (e) {
      console.log(e);
    }
  })
  .listen(3000);

// console.log(
//   `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
// );

export type Olea = typeof app;
