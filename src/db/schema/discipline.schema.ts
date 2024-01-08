import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { SchoolMembersTable, UserTable } from "./user.schema";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";

export const DisciplineRecordTable = mysqlTable("discipline_record", {
  recordID: int("recordID").autoincrement().primaryKey(),
  studentId: varchar("student_id", { length: 30 })
    .references(() => SchoolMembersTable.userId, { onDelete: "cascade" })
    .notNull(),
  //   disipline_id: serial("disipline_id").notNull(),
  incidentDate: timestamp("incident_date").notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  merit: varchar("score", { length: 30 }).notNull(),
  //   updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type DisciplineRecord = typeof DisciplineRecordTable.$inferSelect;
export type DisciplineRecordInsert = typeof DisciplineRecordTable.$inferInsert;

export const selectDisciplineRecordSchema = createSelectSchema(
  DisciplineRecordTable
);
export const insertDisciplineRecordSchema = createInsertSchema(
  DisciplineRecordTable
);
