import { Elysia, t } from "elysia";

import { createUser } from "../models/user";

export const authController = new Elysia({ prefix: "/auth" })
  .post("/sign-in", async () => {
    return {
      message: "Signed in.",
    };
  })
  .post(
    "/register",
    async ({ body }) => {
      console.log({ body });
      return "sign up";
    },
    {
      body: t.Optional(t.Omit(createUser, ["id"])),
      response: t.String(),
    },
  )
  .post("/refresh", async (c) => {
    return {
      message: "Access token generated successfully.",
    };
  })
  .post("/logout", async (c) => {
    return {
      message: "Logged out.",
    };
  })
  .get("/me", (c) => {
    return {
      message: "Fetch current user.",
    };
  });
