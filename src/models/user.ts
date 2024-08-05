import { createInsertSchema } from "drizzle-typebox";
import { users } from "../schema";

import type { SetOptional } from "type-fest";

export const TNewUser = createInsertSchema(users);

export type User = SetOptional<typeof users.$inferSelect, "password">;
export type NewUser = typeof users.$inferInsert;
