import "@testing-library/jest-dom";
import jsx from "texsaur";
import { afterEach, beforeAll } from "vitest";
import { server } from "./mocks/node";
import "./src/components/AlpineComponent?raw";
import Alpine from "alpinejs";
// import * as htmx from "htmx.org";

(window as any).Alpine = Alpine;
// (window as any).htmx = htmx;

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
  global.jsx = jsx;
});

beforeEach(() => {
  const htmxScriptEl = document.createElement("script");
  htmxScriptEl.src = "https://unpkg.com/htmx.org@2.0.1/dist/htmx.js";
  document.head.appendChild(htmxScriptEl);
});

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());

afterAll(() => {
  server.close();
});
