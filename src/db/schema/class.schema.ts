import { int, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
import { SchoolTable } from "./school.schema";
import { SchoolMembersTable } from "./user.schema";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";

export const ClassTable = mysqlTable("class", {
  classId: int("class_id").autoincrement().primaryKey(),
  className: varchar("class_name", { length: 150 }).notNull(),
  schoolId: varchar("school_id", {length: 30})
    .references(() => SchoolTable.schoolId, { onDelete: "cascade" })
    .notNull(),
  classTeacherId: varchar("class_teacher_id", { length: 30 })
    .references(() => SchoolMembersTable.userId, { onDelete: "cascade" })
    .notNull(),
  // grade: varchar("grade", { length: 10 }).notNull(),
  //   updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type Class = typeof ClassTable.$inferSelect;
export type ClassInsert = typeof ClassTable.$inferInsert;

export const selectClassSchema = createSelectSchema(ClassTable);
export const insertClassSchema = createInsertSchema(ClassTable);

export const StudentClassTable = mysqlTable("student_class", {
  id: int("id").autoincrement().primaryKey(),
  studentId: varchar("student_id", { length: 30 })
    .references(() => SchoolMembersTable.userId, { onDelete: "cascade" })
    .notNull(),
  classId: int("class_id")
    .references(() => ClassTable.classId, { onDelete: "cascade" })
    .notNull(),
});

export type StudentClass = typeof StudentClassTable.$inferSelect;
export type StudentClassInsert = typeof StudentClassTable.$inferInsert;

export const selectStudentClassSchema = createSelectSchema(StudentClassTable);
export const insertStudentClassSchema = createInsertSchema(StudentClassTable);