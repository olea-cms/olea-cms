import { compile } from "pug";
import ENV from "./test.env.json";

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
    ENV,
  });

  if (opts.setBody) document.body.innerHTML = compiledPug;

  return compiledPug;
};

// Compiles pug strings as a tagged template literal function.
export const pug = (template: TemplateStringsArray, ...params: string[]) => {
  const el = document.createElement("div");
  el.innerHTML = compile(template.join("") + params.join(""), {})({ ENV });
  //   console.log("yo", el.firstChild.tagName, el.innerHTML);
  return el.firstChild! as any as HTMLElement;
};
