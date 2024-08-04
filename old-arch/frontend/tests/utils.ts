// import * as pug_ from "./pug";
// const { compile } = pug_;
import { compile } from "pug";

// Renders the template to the document body and returns it as a string.
export const renderTemplate = (
  rawPugTemplate: string,
  opts = {
    setBody: true,
  },
): string => {
  const compiledPug = compile(
    rawPugTemplate,
    {},
  )({
    ...import.meta.env,
  });

  if (opts.setBody) document.body.innerHTML = compiledPug;

  return compiledPug;
};

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
  const el = document.createElement("div");
  el.innerHTML = compile(
    interpolateString(template, ...params),
    {},
  )({ ...import.meta.env });
  //   console.log("yo", el.firstChild.tagName, el.innerHTML);
  return el.firstChild! as HTMLElement;
};

export const htmxReprocess = () =>
  window.htmx.process(document.documentElement);
