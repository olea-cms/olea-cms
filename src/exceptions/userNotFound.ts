import { pug } from "../utils";

export const UserNotFoundException = () =>
  pug`p.text-error.pt-4 User not found.`;
