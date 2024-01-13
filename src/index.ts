import { api } from "controllers";
import { authController } from "controllers/auth";
import { db } from "db";
import { Elysia } from "elysia";
import { useJwt } from "middleware/jwt";

const PORT = process.env.PORT || 3000;
export const app = new Elysia();
app
  .get("/", () => "Hello Elysia")
  .decorate("db", db)
  .get("/result/:icNo", async ({ params, db, set }) => {
    try {
      const { icNo } = params;
      const result = await db
        .selectFrom("grade")
        .innerJoin("student_class as sc", "sc.student_id", "grade.studentID")
        // .innerJoin("class as c", "c.class_id", "sc.class_id")
        .innerJoin("school_members as sm", "sm.user_id", "grade.studentID")
        .innerJoin("subject as s", "s.subjectID", "grade.subjectID")
        .select([
          //   "sm.first_name",
          // "sm.last_name",
          // "c.class_name",
          "grade.gradeID",
          "s.subjectID",
          "s.subject_name",
          "grade.grade_level",
          "grade.term",
        ])
        .where("sm.ic_no", "=", icNo)
        .execute();

      const student = await db
        .selectFrom("school_members")
        .innerJoin(
          "student_class as sc",
          "sc.student_id",
          "school_members.user_id"
        )
        .innerJoin("class as c", "c.class_id", "sc.class_id")
        .select(["first_name", "last_name", "c.class_name", "c.class_id"])
        .where("ic_no", "=", icNo)
        .executeTakeFirst();

        if (!student || !result) {
          set.status = 404
          return {message: "There is no records found!"}
        }
      return { student, result };
    } catch (error) {
      return { error };
    }
  })
  .use(api)
  
  .listen(PORT, () => {
    console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
  });
// .use(useJwt)
// .get("/", () => "Hello Elysia")
// .group('/api', (app: Elysia) =>
//   app.use(authController)).listen(PORT, () => {
//     `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`;
//   })
// const app = new Elysia().get("/", () => "Hello Elysia").listen(3000);

