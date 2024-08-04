import { compile } from "pug";

const interpolateString = (
  strings: TemplateStringsArray,
  ...values: string[]
) => {
  let result = "";
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      result += values[i];
    }
  }
  return result;
};

// Compiles pug strings as a tagged template literal function.
export const pug = (template: TemplateStringsArray, ...params: string[]) => {
  return compile(
    interpolateString(template, ...params),
    {},
  )({ ...process.env });
};
