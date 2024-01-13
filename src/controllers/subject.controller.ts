import { ctx } from "context";
import { ClassSubject, Subject } from "db/schema/subject.schema";
import Elysia from "elysia";
import { isAuthenticated } from "middleware/auth.middleware";

export const subjectController = new Elysia({ prefix: "/subject" })
  .use(ctx)
  .use(isAuthenticated)
  // CREATE SUBJECT
  // .post("/create", async ({ body, set, db }) => {
  //   try {
  //     const { subjectID, subjectName, schoolId } = body as Subject;
  //     if (body == null) {
  //       return {
  //         code: 400,
  //         message: "Bad Request",
  //       };
  //     }
  //     const insertSubject = await db
  //       .insertInto("subject")
  //       .values({
  //         subjectID,
  //         subject_name: subjectName,
  //         school_id: schoolId,
  //       })
  //       .executeTakeFirst();
  //     return { insertSubject };
  //   } catch (error) {
  //     return { error };
  //   }
  // })

  // READ SUBJECT
  .get("/", async ({ jwt, db }) => {
    try {
      const subjects = await db.selectFrom("subject").selectAll().execute();
      return { subjects };
    } catch (error) {
      return { error };
    }
  })

  // UPDATE SUBJECT
  .patch("/:subjectID", async ({ body, params, db }) => {
    try {
      const { subjectID } = params;
      const { subjectName } = body as Subject;
      const updateSubject = await db
        .updateTable("subject")
        .set({
          subject_name: subjectName,
        })
        .where("subjectID", "=", subjectID)
        .executeTakeFirst();
      return { updateSubject };
    } catch (error) {
      return { error };
    }
  })

  // DELETE SUBJECT
  .delete("/:subjectID", async ({ params, db }) => {
    try {
      const { subjectID } = params;
      const deleteSubject = await db
        .deleteFrom("subject")
        .where("subjectID", "=", subjectID)
        .executeTakeFirst();
      return { deleteSubject };
    } catch (error) {
      return { error };
    }
  })

  // REGISTER SUBJECT FOR CLASS
  .post("/addSubject", async ({ body, db }) => {
    try {
      const { classID, subjectID } = body as ClassSubject;
      if (!classID || !subjectID) {
        return {
          code: 400,
          message: "Bad Request",
        };
      }
      const registerSubject = await db
        .insertInto("class_subject")
        .values({
          // studentID,
          classID,
          subjectID,
        })
        .executeTakeFirst();
      return { registerSubject };
    } catch (error) {
      return { error };
    }
  })

  // GET SUBJECT BY STUDENT ID
  .get("/subjects/:classID", async ({ params, db }) => {
    try {
      const { classID } = params;
      const subject = await db
        .selectFrom("class_subject")
        .selectAll()
        .where("classID", "=", parseInt(classID))
        .execute();
        console.log(subject);
      return { subject };
    } catch (error) {
      return { error };
    }
  })

  // GET CLASS BY SCHOOLID
  .get('/class/:schoolId', async ({ params, db }) => {
    try {
      const { schoolId } = params
      const schoolClass = await db
      .selectFrom("class")
      .selectAll()
      .where("school_id", '=', schoolId)
      .execute();
      return schoolClass;
    } catch (error) {
      return {error}
    }
  })
