import { int, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
import { SchoolMembersTable, UserTable } from "./user.schema";
import { SubjectTable } from "./subject.schema";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";

export const GradeTable = mysqlTable("grade", {
  gradeID: int("gradeID").autoincrement().primaryKey(),
  studentID: varchar("studentID", { length: 30 })
    .references(() => SchoolMembersTable.userId, { onDelete: "cascade" })
    .notNull(),
  subjectID: varchar("subjectID", { length: 30 })
    .references(() => SubjectTable.subjectID, { onDelete: "cascade" })
    .notNull(),
  gradeLevel: varchar("grade_level", { length: 30 }).notNull(),
  term: varchar("term", { length: 30 }).notNull(),
});

export type Grade = typeof GradeTable.$inferSelect;
export type GradeInsert = typeof GradeTable.$inferInsert;

export const selectGradeSchema = createSelectSchema(GradeTable);
export const insertGradeSchema = createInsertSchema(GradeTable);
