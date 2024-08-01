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

// Compiles pug strings as a tagged template literal function.
export const pug = (template: TemplateStringsArray, ...params: string[]) => {
  const el = document.createElement("div");
  el.innerHTML = compile(
    template.join("") + params.join(""),
    {},
  )({ ...import.meta.env });
  //   console.log("yo", el.firstChild.tagName, el.innerHTML);
  return el.firstChild! as HTMLElement;
};

export const htmxReprocess = () =>
  window.htmx.process(document.documentElement);
