import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

const sqlite = new Database("olea.db");
export const db = drizzle(sqlite, {
  logger: process.env.NODE_ENV?.includes("dev"),
});
