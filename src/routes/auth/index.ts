import { ElysiaApp } from "../..";
import { t } from "elysia";
import { TNewUser } from "../../models/user";
import { UsersService } from "../../services/users";
import { pug } from "../../utils";
import { AuthenticationError } from "../../exceptions/AuthenticationError";
import { AuthorizationError } from "../../exceptions/AuthorizationError";
import { InvariantError } from "../../exceptions/InvariantError";
import { pcRedirect } from "../../libs/pineconeRedirect";

export default (app: ElysiaApp) =>
  app.guard({ body: t.Omit(TNewUser, ["settings"]) }, (guarded) =>
    guarded
      .error({
        AuthenticationError,
        AuthorizationError,
        InvariantError,
      })
      .onError(({ code, error, set, hx }) => {
        if (import.meta.env.DEV) console.error(error.message);
        switch (code) {
          case "AuthenticationError":
            hx?.retarget("#serverMsg");
            set.status = error.httpCode;
            return error.message;
        }
      })
      .post(
        "/register",
        async ({ body, set, jwt, cookie: { auth }, error, hx }) => {
          console.log({ body, jwt });
          const isAvailable = await UsersService.isUserAvailable(body.email);

          console.log({ isAvailable });

          if (!isAvailable) {
            hx.retarget("#serverMsg");
            return error(
              422,
              pug`p.text-error.pt-4 Email already in use. Try resetting your password.`,
            );
          }

          const pwdHash = await Bun.password.hash(body.password, {
            algorithm: "argon2id",
          });

          try {
            const user = await UsersService.createUser({
              ...body,
              password: pwdHash,
            });
            const token = await jwt.sign({ id: user.id, email: user.email });

            auth.set({
              value: token,
              // httpOnly: true,
              secure: true,
              sameSite: "strict",
              maxAge: 60 * (import.meta.env.DEV ? 15 : 1440), // 15 mins for dev, 1 day for prod
              path: "/",
            });

            hx.retarget("#serverMsg");
            // set.headers["Set-Cookie"] =
            //   `jwt=${token}; HttpOnly; Secure; Path=/; SameSite=Strict`;
            set.status = 201;
            return pug`
div
  p.text-success.pt-4 User ${user.email} created successfully
  // keep redirects/navigation stuff client side
  ${pcRedirect("/admin")}
  script isAuthed = true;`;
          } catch (e) {
            hx.retarget("#serverMsg");
            return pug`p.text-error.pt-4 Error creating user. Please contact your instance administrator or try again later.`;
          }
        },
      )
      .post("/login", async ({ body, set, jwt, cookie: { auth }, hx }) => {
        const matchingUser = await UsersService.getUserByEmail(body.email, {
          withPwd: true,
        });

        if (!matchingUser)
          throw new AuthenticationError(
            422,
            pug`p.text-error.pt-4 User not found.`,
          );

        try {
          const passwordIsMatch = await Bun.password.verify(
            body.password,
            matchingUser.password!,
          );

          if (!passwordIsMatch) {
            throw new AuthenticationError(
              401,
              pug`p.text-error.pt-4 Incorrect password.`,
            );
          }
          const token = await jwt.sign({
            id: matchingUser.id,
            email: matchingUser.email,
          });

          console.log({ prod: import.meta.env.PROD });

          auth.set({
            value: token,
            // httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * (import.meta.env.DEV ? 15 : 1440), // 15 mins for dev, 1 day for prod
            path: "/",
          });

          hx.retarget("#serverMsg");
          // set.headers["Set-Cookie"] =
          //   `jwt=${token}; HttpOnly; Secure; Path=/; SameSite=Strict`;
          set.status = 200;
          return pug`
div
  p.text-success.pt-4 Logged in as ${matchingUser.email}
  ${pcRedirect("/admin")}
  script isAuthed = true;
        `;
        } catch (err) {
          throw new AuthenticationError(
            520,
            pug`p.text-error.pt-4 Encountered unkown error. Please contact your instance administrator or try again later.`,
          );
        }
      }),
  );
