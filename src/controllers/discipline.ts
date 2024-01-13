// import Elysia from "elysia";

import { ctx } from "context";
// import { db } from "db";
import {
  DisciplineRecord,
  DisciplineRecordInsert,
} from "db/schema/discipline.schema";
import Elysia from "elysia";
import { isAuthenticated } from "middleware/auth.middleware";

export const disciplineController = new Elysia({ prefix: "/discipline" })
  .use(ctx)
  // .guard({
  //   beforeHandle({ jwt }) {
  //     jwt.verify();
  //   }
  //   // const tokenPrefix = "Bearer ";
  //   //   const bearerToken = request.headers.get("Authorization");
  //   //   if (!bearerToken || !bearerToken.startsWith(tokenPrefix))
  //   //     throw { code: 400, message: "Invalid token" };
  //   //   const token = bearerToken.slice(tokenPrefix.length);
  //   //   const auth = await jwt.verify(token);
  //   //   if (!auth) throw { code: 401, message: "Unauthorized" };
  // })

  // CREATE DISCIPLINE RECORD
  //   .post("/create", async ({ body, set }) => {
  //     try {
  //       const { user_id, description } = body as DisciplineRecordInsert;

  //       if (!user_id || !description) {
  //         return {
  //           code: 400,
  //           message: "Bad Request",
  //         };
  //       }
  //       const discipline = await db
  //         .insertInto("discipline_record")
  //         .values({ user_id, description })
  //         .executeTakeFirst();
  //       return { discipline };
  //     } catch (error) {
  //       return { error };
  //     }
  //   })

  // READ DISCIPLINE RECORD
  .use(isAuthenticated)
  .get("/", async ({ jwt, db }) => {
    try {
      // if (!auth) throw { code: 401, message: "Unauthorized" };
      const disciplines = await db
        .selectFrom("discipline_record")
        .innerJoin(
          "school_members as sm",
          "sm.user_id",
          "discipline_record.student_id"
        )
        .select([
          "sm.user_id",
          "sm.first_name",
          "sm.last_name",
          "discipline_record.description",
          "discipline_record.incident_date",
        ])
        // .selectAll()
        .execute();
      return { disciplines };
    } catch (error) {
      return { error };
    }
  })

  // READ DISCIPLINE RECORD BY STUDENT ID
  .get("/:studentID", async ({ jwt, params, db }) => {
    try {
      const { studentID } = params;
      // const discipline = await db
      //   .selectFrom("discipline_record")
      //   .innerJoin("user", "user.id", "discipline_record.user_id")
      //   .select([
      //     "user.id",
      //     "user.first_name",
      //     "user.last_name",
      //     "discipline_record.description",
      //   ])
      //   .where("discipline_record.user_id", "=", parseInt(studentID))
      //   .execute();
      const student = await db
        .selectFrom("school_members")
        .innerJoin(
          "student_class as sc",
          "sc.student_id",
          "school_members.user_id"
        )
        .innerJoin("class as c", "c.class_id", "sc.class_id")
        .select(["first_name", "last_name", "gender", "c.class_name"])
        .where("user_id", "=", studentID)
        .executeTakeFirst();
      const discipline = await db
        .selectFrom("discipline_record")
        .innerJoin(
          "school_members as sm",
          "sm.user_id",
          "discipline_record.student_id"
        )
        .leftJoin("student_class as sc", "sc.student_id", "sm.user_id")
        .leftJoin("class as c", "c.class_id", "sc.class_id")
        .select([
          "discipline_record.recordID",
          "discipline_record.description",
          "discipline_record.incident_date",
          "discipline_record.score",
        ])
        .where("discipline_record.student_id", "=", studentID)
        .execute();
      return { student, discipline };
    } catch (error) {
      return { error };
    }
  })

  // READ DISCIPLINE RECORD BY recordId
  .get("record/:recordId", async ({ params, db }) => {
    try {
      const { recordId } = params;
      const record = await db
        .selectFrom("discipline_record")
        .selectAll()
        .where("recordID", "=", parseInt(recordId))
        .executeTakeFirst();
      return record;
    } catch (error) {
      return { error };
    }
  })

  // CREATE DISCIPLINE RECORD BY STUDENTID
  .post("/:studentID", async ({ jwt, params, db, body }) => {
    try {
      const { studentID } = params;
      const { incidentDate, description, merit } = body as DisciplineRecord;
      if (!incidentDate || !description || !merit) {
        return {
          code: 400,
          message: "Bad Request",
        };
      }
      const insertRecord = await db
        .insertInto("discipline_record")
        .values({
          description,
          incident_date: incidentDate,
          score: merit,
          student_id: studentID,
        })
        .executeTakeFirst();
        console.log(insertRecord);
      return { message: "Discipline record added succesfully" };
    } catch (error) {
      return { error };
    }
  })

  // UPDATE DISCIPLINE RECORD BY ID
  .patch("/edit/:recordID", async ({ body, params, set, db }) => {
    try {
      const { recordID } = params;
      const { incidentDate, description, merit } = body as DisciplineRecord;
      if (!description) {
        return {
          code: 400,
          message: "Bad Request",
        };
      }
      const discipline = await db
        .updateTable("discipline_record")
        .set({
          incident_date: incidentDate,
          score: merit,
          description,
        })
        .where("recordID", "=", parseInt(recordID))
        .execute();
      return { message: 'Disciple record edited succesfully' };
    } catch (error) {
      return { error };
    }
  })

  // DELETE DISCIPLINE RECORD BY ID
  .delete("/:recordID", async ({ params, set, db }) => {
    try {
      const { recordID } = params;
      if (!recordID) {
        return {
          code: 400,
          message: "Bad Request",
        };
      }
      const discipline = await db
        .deleteFrom("discipline_record")
        .where("recordID", "=", parseInt(recordID))
        .execute();
      return { discipline };
    } catch (error) {
      return { error };
    }
  });

//   .post("/discipline/:id", async ({ body, set, jwt }) => {
//     try {
//       const { name, description } = body as disc;
//       if (!name || !description) {
//         return {
//           code: 400,
//           message: "Bad Request",
//         };
//       }
//       const discipline = await db
//         .insertInto("discipline")
//         .values({ name, description })
//         .execute();
//       return { discipline };
//     } catch (error) {
//       return { error };
//     }
//   });
