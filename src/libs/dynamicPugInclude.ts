import { renderFile } from "pug";

// path is relative to src
export const dynamicInclude = (relativePathToPug: string, options = {}) => {
  return renderFile(`${import.meta.dir}/../${relativePathToPug}`, options); //render the pug file
};
