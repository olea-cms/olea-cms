import { OpenAPIV3_1 } from "openapi-types";
import HttpStatusCode from "../common/statusCodes";
import { mapValues } from "remeda";

export const describeHtmlResponse = (
  description: string,
  opts: { body?: string; headers?: any } = {
    body: "",
    headers: {},
  },
): OpenAPIV3_1.ResponseObject | any => ({
  description,
  content: {
    "text/plain": {
      schema: {
        type: "string",
      },
      example: {
        headers: opts?.headers ?? {},
        body: opts?.body,
      },
    },
  },
});

export const generateDetail = (
  description: string,
  responses: {
    [key in HttpStatusCode]?: {
      description: string;
      headers?: Record<string, string>;
      body?: string;
    };
  },
) => ({
  description,
  responses: mapValues(responses, ({ description, headers, body }) =>
    describeHtmlResponse(description, { headers, body }),
  ),
});
