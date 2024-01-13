import { ctx } from "context";
import { Grade } from "db/schema/grade.schema";
import Elysia from "elysia";
import { isAuthenticated } from "middleware/auth.middleware";

export const resultController = new Elysia({ prefix: "/result" })
  .use(ctx)
  // .get("/ic/:icNo", async ({ params, db }) => {
  //   try {
  //     const { icNo } = params;
  //     const result = await db
  //       .selectFrom("grade")
  //       .innerJoin("student_class as sc", "sc.student_id", "grade.studentID")
  //       // .innerJoin("class as c", "c.class_id", "sc.class_id")
  //       .innerJoin("school_members as sm", "sm.user_id", "grade.studentID")
  //       .innerJoin("subject as s", "s.subjectID", "grade.subjectID")
  //       .select([
  //         //   "sm.first_name",
  //         // "sm.last_name",
  //         // "c.class_name",
  //         "grade.gradeID",
  //         "s.subjectID",
  //         "s.subject_name",
  //         "grade.grade_level",
  //         "grade.term",
  //       ])
  //       .where("sm.ic_no", "=", icNo)
  //       .execute();

  //     const student = await db
  //       .selectFrom("school_members")
  //       .innerJoin(
  //         "student_class as sc",
  //         "sc.student_id",
  //         "school_members.user_id"
  //       )
  //       .innerJoin("class as c", "c.class_id", "sc.class_id")
  //       .select(["first_name", "last_name", "c.class_name", "c.class_id"])
  //       .where("ic_no", "=", icNo)
  //       .executeTakeFirst();
  //     return { student, result };
  //   } catch (error) {
  //     return { error };
  //   }
  // })
  

  // VIEW RESULT BY ID
  .use(isAuthenticated)
  .get("/:studentID", async ({ params, db }) => {
    try {
      const { studentID } = params;
      const result = await db
        .selectFrom("grade")
        .innerJoin("student_class as sc", "sc.student_id", "grade.studentID")
        // .innerJoin("class as c", "c.class_id", "sc.class_id")
        // .innerJoin("school_members as sm", "sm.user_id", "grade.studentID")
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
        .where("grade.studentID", "=", studentID)
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
        .where("user_id", "=", studentID)
        .executeTakeFirst();
      return { student, result };
    } catch (error) {
      return { error };
    }
  })

  //VIEW RESULT BY STUDENTID TERM
  .get("/:studentID/:term", async ({ params, db }) => {
    try {
      const { studentID, term } = params;
      const result = await db
        .selectFrom("grade")
        .innerJoin("student_class as sc", "sc.student_id", "grade.studentID")
        .innerJoin("subject as s", "s.subjectID", "grade.subjectID")
        .select([
          "s.subject_name",
          "grade.grade_level",
          // "grade.term",
          "grade.subjectID",
        ])
        .where("grade.studentID", "=", studentID)
        .where("grade.term", "=", term)
        .execute();
      console.log(result);
      return { result };
    } catch (error) {
      return { error }
    }
  })

  // VIEW RESULT BY SUBJECT ID
  .get("/subject/:subjectID", async ({ params, db }) => {
    try {
      const { subjectID } = params;
      const result = await db
        .selectFrom("grade")
        .innerJoin("student_class as sc", "sc.student_id", "grade.studentID")
        // .innerJoin("class as c", "c.class_id", "sc.class_id")
        .innerJoin("school_members as sm", "sm.user_id", "grade.studentID")
        // .innerJoin("subject as s", "s.subjectID", "grade.subjectID")
        .select([
          "sm.first_name",
          "sm.last_name",
          // "c.class_name",
          // "s.subject_name",
          "grade.grade_level",
          "grade.term",
        ])
        .where("grade.subjectID", "=", subjectID)
        .execute();
      return { result };
    } catch (error) {
      return { error };
    }
  })

  // VIEW RESULT BY CLASS ID
  .get("/class/:classID", async ({ params, db }) => {
    try {
      const { classID } = params;
      const result = await db
        .selectFrom("grade")
        .innerJoin("student_class as sc", "sc.student_id", "grade.studentID")
        .innerJoin("class as c", "c.class_id", "sc.class_id")
        .innerJoin("school_members as sm", "sm.user_id", "grade.studentID")
        .innerJoin("subject as s", "s.subjectID", "grade.subjectID")
        .select([
          "sm.first_name",
          "sm.last_name",
          "c.class_name",
          "s.subject_name",
          "grade.grade_level",
          "grade.term",
        ])
        .where("c.class_id", "=", parseInt(classID))
        .execute();
      return { result };
    } catch (error) {
      return { error };
    }
  })

  // ADD RESULT
  .post("/", async ({ body, db }) => {
    try {
      const { studentID, subjectID, gradeLevel, term } = body as Grade;
      if (!studentID || !subjectID || !gradeLevel || !term) {
        return {
          code: 400,
          message: "Bad Request",
        };
      }
      const addResult = await db
        .insertInto("grade")
        .values({
          studentID,
          subjectID,
          grade_level: gradeLevel,
          term,
        })
        .executeTakeFirst();
      return { message: 'Result added succesfully' };
    } catch (error) {
      return { error };
    }
  })

  // UPDATE RESULT
  .put("/:gradeID", async ({ body, params, db }) => {
    try {
      const { gradeID } = params;
      const { gradeLevel } = body as Grade;
      if (!gradeLevel) {
        return {
          code: 400,
          message: "Bad Request",
        };
      }
      const updateResult = await db
        .updateTable("grade")
        .set({ grade_level: gradeLevel })
        .where("gradeID", "=", parseInt(gradeID))
        .execute();
      return { message: 'Result updated succesfully!' };
    } catch (error) {
      return { error };
    }
  })

  // DELETE RESULT
  .delete("/:gradeID", async ({ params, db }) => {
    try {
      const { gradeID } = params;
      if (!gradeID) {
        return {
          code: 400,
          message: "Bad Request",
        };
      }
      const deleteResult = await db
        .deleteFrom("grade")
        .where("gradeID", "=", parseInt(gradeID))
        .execute();
      return { deleteResult };
    } catch (error) {
      return { error };
    }
  });
