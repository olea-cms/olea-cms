import "@testing-library/jest-dom/vitest";
// import "jest-location-mock";
import jsx from "texsaur";
import { afterAll, afterEach, beforeAll, beforeEach } from "vitest";
import { server } from "./mocks/node";
// import "./tests/mockServiceWorker";
import "./src/components/AlpineComponent?raw";
// import PineconeRouter from "pinecone-router";
import Alpine from "alpinejs";
// @ts-ignore-error
import htmx from "htmx.org";

(window as any).Alpine = Alpine;
// (window as any).Alpine.plugin(PineconeRouter);
(window as any).htmx = htmx;
// window.htmx.logAll();
// window.htmx.process(document.documentElement);

// Start server before all tests
beforeAll(() => {
  // for routing
  document.body.setAttribute("x-data", "");
  server.listen({ onUnhandledRequest: "error" });
  (global as any).jsx = jsx;
  const htmxScriptEl = document.createElement("script");
  htmxScriptEl.src = "https://unpkg.com/htmx.org@2.0.1/dist/htmx.js";
  document.head.appendChild(htmxScriptEl);
});

beforeEach(() => {});

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());

afterAll(() => {
  server.close();
});
