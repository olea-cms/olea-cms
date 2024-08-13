import { Olea } from "../../olea";
import { LOCALSTORAGE_AUTH_KEY } from "../../common/constants";

export default (app: Olea) =>
  app.post(
    "/",
    async ({ cookie: { auth, [LOCALSTORAGE_AUTH_KEY]: expiryCookie }, hx }) => {
      auth.remove();
      expiryCookie.remove();

      hx.redirect("/login");
    },
  );
