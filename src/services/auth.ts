import { Context, Cookie } from "elysia";

import { UsersService } from "../services/users";
import HttpStatusCode from "../common/statusCodes";
import { UserNotFoundException } from "../exceptions/userNotFound";
import { IncorrectPasswordException } from "../exceptions/incorrectPassword";
import { tomorrow } from "../libs/datetime";
import { HtmxContext } from "@gtramontina.com/elysia-htmx";
import { LOCALSTORAGE_AUTH_KEY } from "../common/constants";

export const AuthService = {
  login: async (
    email: string,
    password: string,
    error: Context["error"],
    jwt: {
      sign: any;
      verify: any;
    },
    cookie: Record<string, Cookie<string | undefined>>,
    hx: HtmxContext["hx"],
  ) => {
    const { auth, [LOCALSTORAGE_AUTH_KEY]: expiryCookie } = cookie;
    if (import.meta.env.DEV)
      console.log("logging in from controller", { email, password });
    const matchingUser = await UsersService.getUserByEmail(email, {
      withPwd: true,
    });

    if (!matchingUser)
      return error(
        HttpStatusCode.UNPROCESSABLE_ENTITY_422,
        UserNotFoundException(),
      );

    const passwordIsMatch = await Bun.password.verify(
      password,
      matchingUser.password!,
    );

    if (!passwordIsMatch) {
      return error(
        HttpStatusCode.UNAUTHORIZED_401,
        IncorrectPasswordException(),
      );
    }
    const token = await jwt.sign({
      id: matchingUser.id,
      email: matchingUser.email,
    });

    const expires = import.meta.env.DEV
      ? new Date(new Date().getTime() + 15 * 60000)
      : tomorrow();
    const maxAge = 60 * (import.meta.env.DEV ? 15 : 1440); // 15 mins for dev, 1 day for prod
    console.log({ prod: import.meta.env.PROD });

    auth.set({
      path: "/",
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      // expires,
      maxAge,
    });
    expiryCookie.set({
      path: "/",
      value: expires.getTime(),
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      // expires,
      maxAge,
    });
    hx.redirect("/admin");
  },
};
