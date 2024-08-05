import { ElysiaApp } from "../..";
import { UsersService } from "../../services/users";

export default (app: ElysiaApp) =>
  app.get("/", async () => await UsersService.getAllUsers());
