import { createId } from "@paralleldrive/cuid2";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(createId),
  email: text("email").notNull(),
  name: text("name"),
  info: text("info"),
  password: text("password").notNull(),
  settings: text("settings", { mode: "json" }).default(JSON.stringify({})),
});
