import { render, renderFile } from "pug";
import { dynamicInclude } from "./dynamicPugInclude";

export const renderPug = (pugString: string, opts = {}) => {
  return render(pugString, {
    ...import.meta.env,
    dynamicInclude,
    ...opts,
  });
};

const heroIconFilter = (
  _childrenText: string,
  opts = { name: null, size: 6, fill: "currentColor", attrs: {} },
) => {
  if (opts.name)
    return renderPugFile(`components/icons/${opts.name}.pug`, {
      size: opts.size ?? 6,
      fill: opts.fill ?? "currentColor",
      attrs: opts.attrs ?? {},
    });
  else return "NO ICON SPECIFIED";
};

// path relative to src
export const renderPugFile = (path: string, opts = {}) => {
  return renderFile(`${import.meta.dir}/../${path}`, {
    ...import.meta.env,
    dynamicInclude,
    filters: {
      "hero-icon": heroIconFilter,
    },
    ...opts,
  });
};
