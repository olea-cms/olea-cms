import Elysia from "elysia";
import { render, renderFile } from "pug";

export const componentController = new Elysia({ prefix: "/components" }).get(
  "/navbar",
  async () =>
    renderFile(`${import.meta.dir}/../components/navbar.pug`, {
      ...process.env,
    }),
);
