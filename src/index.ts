import { Elysia } from "elysia";
import staticPlugin from "@elysiajs/static";
import swagger from "@elysiajs/swagger";
import { html } from "@elysiajs/html";
import { htmx } from "@gtramontina.com/elysia-htmx";
import { tailwind } from "@gtramontina.com/elysia-tailwind";
import { opentelemetry } from "@elysiajs/opentelemetry";
import logixlysia from "logixlysia";
import { autoroutes } from "elysia-autoroutes";
import jwt from "@elysiajs/jwt";

import { renderFile } from "pug";

import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { renderPugFile } from "./libs/renderPug";

import.meta.env.PROD = import.meta.env.NODE_ENV === "production";
import.meta.env.DEV = !import.meta.env.PROD;

export const renderCatastrophic = (env = {}) =>
  renderFile(`${import.meta.dir}/components/catastrophic-error.pug`, env);

export const app = new Elysia()
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
  .use(html())
  .use(htmx())
  .onError((context) => {
    context.hx?.retarget("#catastrophicError");
    if (import.meta.env.DEV) {
      console.log(context.error);
    }
    switch (context.code) {
      case "NOT_FOUND":
        context.set.status = 404;
        // the user should never even see this bc the frontend handles routing
        return renderCatastrophic({
          MSG: "How the hell can you even see this?",
        });
      case "INTERNAL_SERVER_ERROR":
        context.set.status = 500;
        return renderCatastrophic();
      default:
        context.set.status = 500;
        return renderCatastrophic();
    }
  })
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
      exp: "1h",
    }),
  )
  .use(
    swagger({
      path: "/v1/swagger",
    }),
  )
  .use(autoroutes({ routesDir: "./routes" }))
  .all("/*", ({ html }) => {
    try {
      return html(renderPugFile(`index.pug`));
    } catch (e) {
      console.log(e);
    }
  })
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
  .listen(3000);

// console.log(
//   `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
// );

export type ElysiaApp = typeof app;
