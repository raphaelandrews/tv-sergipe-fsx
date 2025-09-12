import { pgTable, uuid, text, timestamp, pgEnum, smallint } from "drizzle-orm/pg-core";
import { usersSync as userSyncTable } from "drizzle-orm/neon";
import { createSchemaFactory } from "drizzle-zod";
import { z } from "zod";

const { createInsertSchema, createSelectSchema, createUpdateSchema } =
  createSchemaFactory({ zodInstance: z });

export { userSyncTable };

export const categoryZodEnum = z.enum([
  "Sub 8 Masculino",
  "Sub 10 Masculino",
  "Sub 12 Masculino",
  "Sub 14 Masculino",
  "Sub 16 Masculino",
  "Sub 18 Masculino",
  "Sub 8 Feminino",
  "Sub 10 Feminino",
  "Sub 12 Feminino",
  "Sub 14 Feminino",
  "Sub 16 Feminino",
  "Sub 18 Feminino",
  "Sub 8 Masculino Equipes",
  "Sub 10 Masculino Equipes",
  "Sub 12 Masculino Equipes",
  "Sub 14 Masculino Equipes",
  "Sub 16 Masculino Equipes",
  "Sub 18 Masculino Equipes",
  "Sub 8 Feminino Equipes",
  "Sub 10 Feminino Equipes",
  "Sub 12 Feminino Equipes",
  "Sub 14 Feminino Equipes",
  "Sub 16 Feminino Equipes",
  "Sub 18 Feminino Equipes",
]);

export const placeZodEnum = z.enum([
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
]);

export const categoryEnum = pgEnum("category", [
  "Sub 8 Masculino",
  "Sub 10 Masculino",
  "Sub 12 Masculino",
  "Sub 14 Masculino",
  "Sub 16 Masculino",
  "Sub 18 Masculino",
  "Sub 8 Feminino",
  "Sub 10 Feminino",
  "Sub 12 Feminino",
  "Sub 14 Feminino",
  "Sub 16 Feminino",
  "Sub 18 Feminino",
  "Sub 8 Masculino Equipes",
  "Sub 10 Masculino Equipes",
  "Sub 12 Masculino Equipes",
  "Sub 14 Masculino Equipes",
  "Sub 16 Masculino Equipes",
  "Sub 18 Masculino Equipes",
  "Sub 8 Feminino Equipes",
  "Sub 10 Feminino Equipes",
  "Sub 12 Feminino Equipes",
  "Sub 14 Feminino Equipes",
  "Sub 16 Feminino Equipes",
  "Sub 18 Feminino Equipes",
]);

export const placeEnum = pgEnum("place", [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
]);

export const clubsTable = pgTable("clubs", {
  id: uuid("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userSyncTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const selectClubSchema = createSelectSchema(clubsTable);
export const createClubSchema = createInsertSchema(clubsTable).omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
});
export const updateClubSchema = createUpdateSchema(clubsTable).omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type Club = Omit<
  z.infer<typeof selectClubSchema>,
  "userId" | "createdAt" | "updatedAt"
>;
export type CreateClub = z.infer<typeof createClubSchema>;
export type UpdateClub = z.infer<typeof updateClubSchema>;

export const podiumsTable = pgTable("podiums", {
  id: uuid("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userSyncTable.id, { onDelete: "cascade" }),
  clubId: uuid("clubId")
    .references(() => clubsTable.id, { onDelete: "cascade" }),
  player: text("player"),
  category: categoryEnum("category").notNull(),
  place: placeEnum("place").notNull(),
  points: smallint("points").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const selectPodiumSchema = createSelectSchema(podiumsTable);
export const createPodiumSchema = createInsertSchema(podiumsTable).omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
});
export const updatePodiumSchema = createUpdateSchema(podiumsTable).omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type Podium = Omit<
  z.infer<typeof selectPodiumSchema>,
  "userId" | "createdAt" | "updatedAt"
> & { points: number };
export type CreatePodium = z.infer<typeof createPodiumSchema>;
export type UpdatePodium = z.infer<typeof updatePodiumSchema>;