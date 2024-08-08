import HttpStatusCode from "../../common/statusCodes";
import { TNewUser } from "../../models/user";
import { ElysiaApp } from "../../olea";
import { UsersService } from "../../services/users";
import { tomorrow } from "../../libs/datetime";
import { t } from "elysia";
import { UserAlreadyExistsException } from "../../exceptions/userAlreadyExists";
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
        error,
        hx,
      }) => {
        console.log({ body, jwt });
        const isAvailable = await UsersService.isUserAvailable(body.email);

        console.log({ isAvailable });

        if (!isAvailable) {
          hx.retarget("#serverMsg");
          return error(
            HttpStatusCode.UNPROCESSABLE_ENTITY_422,
            UserAlreadyExistsException(),
          );
        }

        const pwdHash = await Bun.password.hash(body.password, {
          algorithm: "argon2id",
        });

        const user = await UsersService.createUser({
          ...body,
          password: pwdHash,
        });
        const token = await jwt.sign({
          id: user.id,
          email: user.email,
        });
        const expires = import.meta.env.DEV
          ? new Date(new Date().getTime() + 15 * 60000)
          : tomorrow();
        const maxAge = 60 * (import.meta.env.DEV ? 15 : 1440); // 15 mins for dev, 1 day for prod
        auth.set({
          value: token,
          httpOnly: true,
          // expires,
          secure: true,
          sameSite: "strict",
          maxAge,
          path: "/",
        });
        expiryCookie.set({
          value: expires.getTime(),
          httpOnly: false,
          // expires,
          maxAge,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        set.status = HttpStatusCode.CREATED_201;
        hx.redirect("/admin");
      },
    );
