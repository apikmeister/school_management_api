import { drizzle } from 'drizzle-orm/mysql2'
import { Kyselify } from "drizzle-orm/kysely";
import { Kysely, MysqlDialect } from 'kysely';
import mysql from 'mysql2/promise'
import { SchoolMembersTable, UserTable } from './schema/user.schema';
import { createPool } from 'mysql2';
import { DisciplineRecordTable } from './schema/discipline.schema';
import { ClassSubjectTable, SubjectTable } from './schema/subject.schema';
import { GradeTable } from './schema/grade.schema';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { SchoolTable } from './schema/school.schema';
import { ClassTable, StudentClassTable } from './schema/class.schema';

const poolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: "student_management",
  port: parseInt(process.env.DB_PORT!),
  connectionLimit: 10,
});

export const drzldb = drizzle(poolConnection);
// migrate(drzldb, { migrationsFolder: "./src/db/migrations" });

interface Database {
    user: Kyselify<typeof UserTable>
    school: Kyselify<typeof SchoolTable>
    school_members: Kyselify<typeof SchoolMembersTable>
    discipline_record: Kyselify<typeof DisciplineRecordTable>
    subject: Kyselify<typeof SubjectTable>
    class: Kyselify<typeof ClassTable>
    class_subject: Kyselify<typeof ClassSubjectTable>
    student_class: Kyselify<typeof StudentClassTable>
    grade: Kyselify<typeof GradeTable>
    // student_subject: Kyselify<typeof StudentSubjectTable>
}

export const db = new Kysely<Database>({
  dialect: new MysqlDialect({
    pool: createPool({   //TODO: FIXME:
      database: "student_management",
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: parseInt(process.env.DB_PORT!),
      connectionLimit: 10,
    }),
  }),
});