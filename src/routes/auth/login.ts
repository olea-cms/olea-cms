import HttpStatusCode from "../../common/statusCodes";
import { TNewUser } from "../../models/user";
import { ElysiaApp } from "../../olea";
import { UsersService } from "../../services/users";
import { IncorrectPasswordException } from "../../exceptions/incorrectPassword";
import { UserNotFoundException } from "../../exceptions/userNotFound";
import { tomorrow } from "../../libs/datetime";
import { t } from "elysia";
import { LOCALSTORAGE_AUTH_KEY } from "../../common/constants";

export default (app: ElysiaApp) =>
  app
    .guard({
      body: t.Omit(TNewUser, ["settings"]),
    })
    .post(
      "/",
      async ({
        body,
        set,
        jwt,
        cookie: { auth, [LOCALSTORAGE_AUTH_KEY]: expiryCookie },
        hx,
        error,
      }) => {
        console.log("logging in", { body });
        const matchingUser = await UsersService.getUserByEmail(body.email, {
          withPwd: true,
        });

        if (!matchingUser)
          return error(
            HttpStatusCode.UNPROCESSABLE_ENTITY_422,
            UserNotFoundException(),
          );

        const passwordIsMatch = await Bun.password.verify(
          body.password,
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

        set.status = HttpStatusCode.OK_200;
        hx.redirect("/admin");
      },
    );
