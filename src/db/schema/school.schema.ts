import { int, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";

export const SchoolTable = mysqlTable("school", {
  schoolId: varchar("school_id", { length: 30 }).primaryKey(),
  schoolName: varchar("school_name", { length: 150 }).notNull(),
  address: varchar("address", { length: 150 }).notNull(),
  phone: varchar("phone", { length: 15 }).notNull(),
});

export type School = typeof SchoolTable.$inferSelect;
export type SchoolInsert = typeof SchoolTable.$inferInsert;

export const selectSchoolSchema = createSelectSchema(SchoolTable);
export const insertSchoolSchema = createInsertSchema(SchoolTable);
