import { password } from "bun";
import {
  int,
  mysqlEnum,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { SchoolTable } from "./school.schema";

// export const UserTable = mysqlTable("user", {
//   id: int("id").autoincrement().primaryKey(),
//   username: varchar("username", { length: 30 }).notNull().unique(),
//   password: varchar("password", { length: 30 }).notNull(),
//   firstName: varchar("first_name", { length: 30 }).notNull(),
//   lastName: varchar("last_name", { length: 30 }).notNull(),
//   gender: mysqlEnum("gender", ["male", "female"]).notNull(),
//   address: varchar("address", { length: 30 }).notNull(),
//   //   role: varchar("role", { length: 30 }).notNull(),
//   role: mysqlEnum("role", ["admin", "student", "teacher"]).notNull(),
//   updated_at: timestamp("updated_at").defaultNow().notNull(),
//   last_login: timestamp("last_login").defaultNow().notNull(),
// });

export const UserTable = mysqlTable("user", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 30 }).notNull().unique(),
  password: varchar("password", { length: 30 }).notNull(),
  schoolId: varchar("school_id", { length: 30 })
    .references(() => SchoolTable.schoolId, { onDelete: "cascade" })
    .notNull(),
  last_login: timestamp("last_login").defaultNow().notNull(),
});

export type User = typeof UserTable.$inferSelect;
export type UserInsert = typeof UserTable.$inferInsert;

export const selectUserSchema = createSelectSchema(UserTable);
export const insertUserSchema = createInsertSchema(UserTable);

export const SchoolMembersTable = mysqlTable("school_members", {
  userId: varchar("user_id", { length: 30 }).notNull().primaryKey().unique(),
  schoolId: varchar("school_id", { length: 30 })
    .references(() => SchoolTable.schoolId, { onDelete: "cascade" })
    .notNull(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  gender: mysqlEnum("gender", ["male", "female"]).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["student", "teacher"]).notNull(),
  grade: varchar("grade", { length: 10 }),
  hireDate: timestamp("hire_date").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type SchoolMembers = typeof SchoolMembersTable.$inferSelect;
export type SchoolMembersInsert = typeof SchoolMembersTable.$inferInsert;

export const selectSchoolMembersSchema = createSelectSchema(SchoolMembersTable);
export const insertSchoolMembersSchema = createInsertSchema(SchoolMembersTable);

// export const SchoolTable = mysqlTable("school", {
//   schoolId: serial("school_id").primaryKey(),
//   schoolName: varchar("school_name", { length: 150 }).notNull(),
//   address: varchar("address", { length: 150 }).notNull(),
//   phone: varchar("phone", { length: 15 }).notNull(),
// })

// export type School = typeof SchoolTable.$inferSelect;
// export type SchoolInsert = typeof SchoolTable.$inferInsert;

// export const selectSchoolSchema = createSelectSchema(SchoolTable);
// export const insertSchoolSchema = createInsertSchema(SchoolTable);
