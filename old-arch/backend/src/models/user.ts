import { db } from "../db";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-typebox";
import { users } from "../schema";

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const createUser = createInsertSchema(users);

export const getAllUsers = (): User[] => db.select().from(users).all();

export const getUserById = (id: string) =>
  db
    .select({
      id: users.id,
      email: users.email,
      username: users.username,
    })
    .from(users)
    .where(eq(users.id, id));
