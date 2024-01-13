import { int, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { SchoolMembersTable, UserTable } from "./user.schema";
import { SchoolTable } from "./school.schema";
import { ClassTable } from "./class.schema";

export const SubjectTable = mysqlTable("subject", {
  subjectID: varchar("subjectID", { length: 30 }).primaryKey(),
  subjectName: varchar("subject_name", { length: 30 }).notNull(),
  // schoolId: varchar("school_id", { length: 30 }).references(() => SchoolTable.schoolId, {onDelete: "cascade"}).notNull(), //TODO: NOT BE IN
  //   updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type Subject = typeof SubjectTable.$inferSelect;
export type SubjectInsert = typeof SubjectTable.$inferInsert;

export const selectSubjectSchema = createSelectSchema(SubjectTable);
export const insertSubjectSchema = createInsertSchema(SubjectTable);

export const ClassSubjectTable = mysqlTable("class_subject", {
  id: int("id").autoincrement().primaryKey(),
  classID: int("classID")
    .references(() => ClassTable.classId, { onDelete: "cascade" })
    .notNull(),
  subjectID: varchar("subjectID", { length: 30 })
    .references(() => SubjectTable.subjectID, { onDelete: "cascade" })
    .notNull(),
});

export type ClassSubject = typeof ClassSubjectTable.$inferSelect;
export type ClassSubjectInsert = typeof ClassSubjectTable.$inferInsert;

export const selectClassSubjectSchema = createSelectSchema(ClassSubjectTable);
export const insertClassSubjectSchema = createInsertSchema(ClassSubjectTable);

// export const StudentSubjectTable = mysqlTable("student_subject", {
//   studentID: int("studentID")
//     .references(() => UserTable.id, { onDelete: "cascade" })
//     .notNull(),
//   subjectID: int("subjectID")
//     .references(() => SubjectTable.subjectID, { onDelete: "cascade" })
//     .notNull(),
// });

// export type StudentSubject = typeof StudentSubjectTable.$inferSelect;
// export type StudentSubjectInsert = typeof StudentSubjectTable.$inferInsert;

// export const selectStudentSubjectSchema =
//   createSelectSchema(StudentSubjectTable);
// export const insertStudentSubjectSchema =
//   createInsertSchema(StudentSubjectTable);
