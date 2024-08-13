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
  opts = {
    name: null,
    size: 6,
    fill: "currentColor",
    attrs: { class: "" },
    class: null,
  },
) => {
  if (opts.name)
    return renderPugFile(`components/icons/${opts.name}.pug`, {
      size: opts.size ?? 6,
      fill: opts.fill ?? "currentColor",
      attrs: {
        ...opts.attrs,
        class: opts.class ?? opts.attrs?.class,
      },
    });
  else return "NO ICON SPECIFIED";
};

// path relative to src
export const renderPugFile = (path: string, opts = {}) => {
  /**
   * Utility class for rendering pug files with the proper environment/variables
   *
   * @param path - Path to pug file relative to src
   * @param opts - Additional options to pass to the pug renderFile function
   *
   * @returns A rendered html string from the provided pug file
   */
  try {
    return renderFile(`${import.meta.dir}/../${path}`, {
      ...import.meta.env,
      dynamicInclude,
      filters: {
        "hero-icon": heroIconFilter,
      },
      ...opts,
    });
  } catch (err) {
    console.error(`[renderPugFile]: ${err}`);
    return `[renderPugFile]: ${err}`;
  }
};
