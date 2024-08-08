import { pug } from "../utils";

export const UserAlreadyExistsException = () =>
  pug`p.text-error.pt-4 Email already in use. Try resetting your password.`;
