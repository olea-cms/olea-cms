import { createId } from "@paralleldrive/cuid2";
import {
  AnySQLiteColumn,
  int,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

/** NO LOGIC SHOULD HAPPEN IN THIS FILE!! ONLY DRIZZLE STUFF AND EXPORTING TYPES. THIS IS BECAUSE DRIZZLE WILL EXECUTE THIS FILE EVERY TIME YOU USE THE CLI **/
export interface UserSettings {
  darkMode?: boolean;
}

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(createId),
  email: text("email").notNull(),
  name: text("name"),
  info: text("info"),
  password: text("password").notNull(),
  settings: text("settings", { mode: "json" })
    .default({
      darkMode: true,
    })
    .$type<UserSettings>(),
  createdAt: int("created_at").notNull().$defaultFn(Date.now),
  updatedAt: int("updated_at").notNull().$defaultFn(Date.now),
});

export const content = sqliteTable("content", {
  id: text("id").primaryKey().$defaultFn(createId),
  versionId: text("version_id")
    .notNull()
    // https://github.com/drizzle-team/drizzle-orm/issues/1807
    .references((): AnySQLiteColumn => contentVersions.id),
  type: text("type").notNull().$type<"page" | "post" | "portfolio">(),
  content: text("content").notNull(),
  createdAt: int("created_at").notNull().$defaultFn(Date.now),
  updatedAt: int("updated_at")
    .notNull()
    .$defaultFn(Date.now)
    .$onUpdateFn(Date.now),
});

export const contentVersions = sqliteTable("content_versions", {
  id: text("id").primaryKey().$defaultFn(createId),
  contentId: text("content_id")
    .notNull()
    .references((): AnySQLiteColumn => content.id),
  versionNumber: int("version_number").notNull(),
  title: text("text").notNull(),
  content: text("content").notNull(),
  createdAt: int("created_at").notNull().$defaultFn(Date.now),
});

export const avgResponseTimes = sqliteTable("avg_response_times", {
  route: text("route").primaryKey().notNull(),
  numRequests: int("num_requests").notNull().default(0),
  avgResponseTime: int("avg_response_time").notNull().default(0),
  updatedAt: int("updated_at").$defaultFn(Date.now).$onUpdateFn(Date.now),
});
