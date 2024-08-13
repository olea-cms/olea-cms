import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../schema";
import { NewUser, User } from "../models/user";
import { omit } from "remeda";

export const UsersService = {
  createUser: async (newUser: NewUser): Promise<User> => {
    const insertRes = await db.insert(users).values(newUser).returning();
    return omit(insertRes.pop()!, ["password"]);
  },
  getAllUsers: async (): Promise<User[]> => await db.select().from(users),
  getUserById: async (id: string): Promise<User> =>
    (
      await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          info: users.info,
          settings: users.settings,
        })
        .from(users)
        .where(eq(users.id, id))
    ).pop(),
  getUserByEmail: async (
    email: string,
    opts = {
      withPwd: false,
    },
  ): Promise<User> =>
    (
      await db
        .select({
          id: users.id,
          email: users.email,
          ...(opts.withPwd ? { password: users.password } : {}),
          name: users.name,
          info: users.info,
          settings: users.settings,
        })
        .from(users)
        .where(eq(users.email, email))
    ).pop(),
  isUserAvailable: async (email: string): Promise<boolean> =>
    !(
      await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
    ).length,
};
