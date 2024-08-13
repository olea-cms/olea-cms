import { TNewUser } from "../../models/user";
import { Olea } from "../../olea";
import { t } from "elysia";

import { AuthService } from "../../services/auth";
import HttpStatusCode from "../../common/statusCodes";
import { UserNotFoundException } from "../../exceptions/userNotFound";
import { generateDetail } from "../../libs/describeHtmlResponse";
import { IncorrectPasswordException } from "../../exceptions/incorrectPassword";

export default (app: Olea) =>
  app
    .guard({
      body: t.Omit(TNewUser, ["settings"]),
      detail: generateDetail("Login a user", {
        [HttpStatusCode.OK_200]: {
          description: "User logged in",
          headers: {
            "hx-redirect": "/admin",
          },
        },
        [HttpStatusCode.UNPROCESSABLE_ENTITY_422]: {
          description: "User not found",
          body: UserNotFoundException(),
        },
        [HttpStatusCode.UNAUTHORIZED_401]: {
          description: "Incorrect password",
          body: IncorrectPasswordException(),
        },
      }),
    })
    .post(
      "/",
      async ({
        body,
        set,
        jwt,
        //         cookie: { auth, [LOCALSTORAGE_AUTH_KEY]: expiryCookie },
        cookie,
        hx,
        error,
      }) => {
        await AuthService.login(
          body.email,
          body.password,
          error,
          jwt,
          cookie,
          hx,
        );
        set.status = HttpStatusCode.OK_200;
      },
    );
