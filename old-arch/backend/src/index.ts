import { Elysia } from "elysia";
import staticPlugin from "@elysiajs/static";
import swagger from "@elysiajs/swagger";
import { html } from "@elysiajs/html";
import { tailwind } from "@gtramontina.com/elysia-tailwind";
import { opentelemetry } from "@elysiajs/opentelemetry";
import logixlysia from "logixlysia";
import { autoroutes } from "elysia-autoroutes";

// import { authController } from "./controllers/auth";
// import { componentController } from "./components";

import { renderFile } from "pug";

import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";

const app = new Elysia()
  .use(
    opentelemetry({
      spanProcessors: [
        new BatchSpanProcessor(
          new OTLPTraceExporter({
            url: "https://api.honeycomb.io",
            headers: {
              "x-honeycomb-team": import.meta.env.OTEL_HONEYCOMB_API_KEY,
            },
          }),
        ),
      ],
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
    swagger({
      path: "/v1/swagger",
    }),
  )
  .use(html())
  .get("/ping", () => "pong")
  .use(
    staticPlugin({
      prefix: "/public",
    }),
  )
  .use(autoroutes({ routesDir: "./routes" }))
  // .use(authController)
  // .use(componentController)
  .all("/*", ({ html }) => {
    try {
      return html(
        renderFile(`${import.meta.dir}/pages/index.pug`, { ...process.env }),
      );
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
