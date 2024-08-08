import { pug } from "../utils";

export const IncorrectPasswordException = () =>
  pug`p.text-error.pt-4 Incorrect password.`;
