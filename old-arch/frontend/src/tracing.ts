// tracing.js
import { HoneycombWebSDK } from "@honeycombio/opentelemetry-web";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";

const sdk = new HoneycombWebSDK({
  apiKey: import.meta.env.OLEA_HC_API_KEY,
  serviceName: "olea-fe",
  instrumentations: [getWebAutoInstrumentations()], // add automatic instrumentation
});
sdk.start();
