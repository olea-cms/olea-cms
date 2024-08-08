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
import { renderPug, renderPugFile } from "./libs/renderPug";

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
  .onError(({ code, error }) => {
    if (import.meta.env.DEV) console.error({ code, error });
  })
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
  .use(
    await autoload({
      schema: ({ path, url }) => {
        const tag = url.split("/").at(1)!;

        return {
          beforeHandle: ({ request }) => {
            console.log(`[autoloaded route]: ${request.url}`);
          },
          detail: {
            description: `Route autoloaded from ${path}`,
            tags: [tag],
          },
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
  .use(
    swagger({
      path: "/v1/swagger",
    }),
  )
  .listen(3000);

// console.log(
//   `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
// );

export type ElysiaApp = typeof app;
