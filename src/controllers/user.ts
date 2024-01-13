import { ctx } from "context";
import { db } from "db";
import { StudentClass } from "db/schema/class.schema";
import { SchoolMembers, User } from "db/schema/user.schema";
import { parse } from "dotenv";
import Elysia from "elysia";
import { isAuthenticated } from "middleware/auth.middleware";

export const userController = new Elysia({ prefix: "/user" })
  .use(ctx)
  .use(isAuthenticated)

  // CREATE STUDENT
  .post(
    "/student/create",
    async ({ body, set }) => {
      try {
        const { icNo, firstName, lastName, address, schoolId, gender } =
          body as SchoolMembers;
        if (body == null) {
          return {
            code: 400,
            message: "Bad Request",
          };
        }
        console.log(body);
        const lastUser = await db
          .selectFrom("school_members")
          .select(["user_id"])
          .where("user_id", "like", "S%")
          .orderBy("user_id", "desc")
          .limit(1)
          .executeTakeFirst();

        let nextId = 1;
        //FIXME: ID not incrementing properly
        if (lastUser) {
          const lastIdNumber = parseInt(lastUser.user_id.slice(1));
          nextId = lastIdNumber + 1;
        }

        // Format the nextId with leading zeros
        const nextIdStr = nextId.toString().padStart(4, "0");
        // const uniqueId = `S${String(studentCounter).padStart(4, '0')}`;
        // studentCounter++;
        // const user = await db.insertInto("user").values({ username, password }).execute();
        const insertStudent = await db
          .insertInto("school_members")
          .values({
            user_id: "S" + nextIdStr,
            ic_no: icNo,
            first_name: firstName,
            last_name: lastName,
            address,
            gender,
            school_id: schoolId,
            role: "student",
            hire_date: new Date(Date.now()).toISOString().split('T')[0],
          })
          .executeTakeFirst();
        console.log(insertStudent);
        return { message: "Student created successfully" };
      } catch (error) {
        return { error };
      }
    },
    {
      type: "application/x-www-form-urlencoded",
    }
  )

  // READ STUDENT BY SCHOOLID
  .get("/student/:schoolId", async ({ params, request, query, set }) => {
    try {
      const { schoolId } = params;
      const page = parseInt(query.page || "1") || 1; // Use query parameters to get the page number
      const rowsPerPage = parseInt(query.rowsPerPage || "10") || 10; // Use query parameters to get the number of rows per page

      if (!schoolId) {
        return {
          code: 400,
          message: "Bad Request",
        };
      }

      const totalStudents = await db
        .selectFrom("school_members")
        .innerJoin("school", "school.school_id", "school_members.school_id")
        // .innerJoin(
        .leftJoin(
          "student_class",
          "school_members.user_id",
          "student_class.student_id"
        )
        // .innerJoin("class", "student_class.class_id", "class.class_id")
        .leftJoin("class", "student_class.class_id", "class.class_id")
        .select(["user_id", "first_name", "last_name", "gender", "class_name"])
        .where("role", "=", "Student")
        // .where("class.school_id", "=", parseInt(schoolId))
        // .where("class.school_id", "=", schoolId)
        .where("school.school_id", "=", schoolId)
        .execute();

      const totalRows = totalStudents.length;
      const totalPages = Math.ceil(totalRows / rowsPerPage);

      const students = await db
        .selectFrom("school_members")
        .innerJoin("school", "school.school_id", "school_members.school_id")
        // .innerJoin(
        .leftJoin(
          "student_class",
          "school_members.user_id",
          "student_class.student_id"
        )
        // .innerJoin("class", "student_class.class_id", "class.class_id")
        .leftJoin("class", "student_class.class_id", "class.class_id")
        .select(["user_id", "first_name", "last_name", "gender", "class_name"])
        .where("role", "=", "Student")
        // .where("class.school_id", "=", parseInt(schoolId))
        // .where("class.school_id", "=", schoolId)
        .where("school.school_id", "=", schoolId)
        .limit(rowsPerPage)
        .offset((page - 1) * rowsPerPage)
        .execute();
      return { students, totalPages };
    } catch (error) {
      return { error };
    }
  })

  // READ STUDENT BY SCHOOLID WITHOUT PAGINATION
  .get("/student/wo/:schoolId", async ({ params, request, query, set }) => {
    try {
      const { schoolId } = params;
      // const page = parseInt(query.page || "1") || 1; // Use query parameters to get the page number
      // const rowsPerPage = parseInt(query.rowsPerPage || "10") || 10; // Use query parameters to get the number of rows per page

      if (!schoolId) {
        return {
          code: 400,
          message: "Bad Request",
        };
      }

      // const totalStudents = await db
      //   .selectFrom("school_members")
      //   .innerJoin("school", "school.school_id", "school_members.school_id")
      //   // .innerJoin(
      //   .leftJoin(
      //     "student_class",
      //     "school_members.user_id",
      //     "student_class.student_id"
      //   )
      //   // .innerJoin("class", "student_class.class_id", "class.class_id")
      //   .leftJoin("class", "student_class.class_id", "class.class_id")
      //   .select(["user_id", "first_name", "last_name", "gender", "class_name"])
      //   .where("role", "=", "student")
      //   // .where("class.school_id", "=", parseInt(schoolId))
      //   // .where("class.school_id", "=", schoolId)
      //   .where("school.school_id", "=", schoolId)
      //   .execute();

      // const totalRows = totalStudents.length;
      // const totalPages = Math.ceil(totalRows / rowsPerPage);

      const students = await db
        .selectFrom("school_members")
        .innerJoin("school", "school.school_id", "school_members.school_id")
        // .innerJoin(
        .leftJoin(
          "student_class",
          "school_members.user_id",
          "student_class.student_id"
        )
        // .innerJoin("class", "student_class.class_id", "class.class_id")
        .leftJoin("class", "student_class.class_id", "class.class_id")
        .select(["user_id", "first_name", "last_name", "gender", "class_name"])
        .where("role", "=", "Student")
        // .where("class.school_id", "=", parseInt(schoolId))
        // .where("class.school_id", "=", schoolId)
        .where("school.school_id", "=", schoolId)
        // .limit(rowsPerPage)
        // .offset((page - 1) * rowsPerPage)
        .execute();
      return { students };
    } catch (error) {
      return { error };
    }
  })

  //CREATE TEACHER
  .post(
    "/teacher/create",
    async ({ body, set }) => {
      try {
        const { icNo, firstName, lastName, address, schoolId, gender } =
          body as SchoolMembers;
        if (body == null) {
          return {
            code: 400,
            message: "Bad Request",
          };
        }

        const lastUser = await db
          .selectFrom("school_members")
          .select(["user_id"])
          .where("user_id", "like", "T%")
          .orderBy("user_id", "desc")
          .limit(1)
          .executeTakeFirst();

        let nextId = 1;
        if (lastUser) {
          const lastIdNumber = parseInt(lastUser.user_id.slice(1));
          nextId = lastIdNumber + 1;
        }

        // Format the nextId with leading zeros
        const nextIdStr = nextId.toString().padStart(4, "0");
        // const user = await db.insertInto("user").values({ username, password }).execute();
        // const insertTeacher =
        await db
          .insertInto("school_members")
          .values({
            user_id: "T" + nextIdStr,
            ic_no: icNo,
            first_name: firstName,
            last_name: lastName,
            address,
            gender,
            school_id: schoolId,
            role: "teacher",
            hire_date: new Date(Date.now()).toISOString().split('T')[0],
          })
          .executeTakeFirst();
        return { message: "Teacher created successfully" };
      } catch (error) {
        return { error };
      }
    },
    {
      type: "application/x-www-form-urlencoded",
    }
  )

  // READ TEACHER BY SCHOOLID
  .get("/teacher/:schoolId", async ({ params, set }) => {
    try {
      const { schoolId } = params;
      if (!schoolId) {
        return {
          code: 400,
          message: "Bad Request",
        };
      }
      const teachers = await db
        .selectFrom("school_members")
        .select(["user_id", "first_name", "last_name", "gender"])
        .where("role", "=", "Teacher")
        // .where("school_id", "=", parseInt(schoolId))
        .where("school_id", "=", schoolId)
        .execute();
      return { teachers };
    } catch (error) {
      return { error };
    }
  })

  // READ ALL USER
  .get("/", async ({ set }) => {
    try {
      const users = await db.selectFrom("school_members").selectAll().execute();
      return { users };
    } catch (error) {
      return { error };
    }
  })

  //READ MEMBERS BY ID
  .get("/:memberId", async ({ params }) => {
    try {
      const { memberId } = params;
      if (!memberId) {
        return {
          code: 400,
          message: "Bad Request",
        };
      }
      const member = await db
        .selectFrom("school_members")
        .selectAll()
        .where("user_id", "=", memberId)
        .execute();
      return { member };
    } catch (error) {
      return { error };
    }
  })

  //DELETE MEMBERS BY ID
  .delete("/:memberId", async ({ params }) => {
    try {
      const { memberId } = params;
      if (!memberId) {
        return {
          code: 400,
          message: "Bad Request",
        };
      }
      const member = await db
        .deleteFrom("school_members")
        .where("user_id", "=", memberId)
        .executeTakeFirst();
      // return { member };
      return { message: "Members deleted successfully" };
    } catch (error) {
      return { error };
    }
  })

  //UPDATE MEMBERS BY ID
  .patch("/:memberId", async ({ params, body }) => {
    try {
      const { memberId } = params;
      const { firstName, lastName, address, schoolId, gender } =
        body as SchoolMembers;
        const { classId } = body as StudentClass

      if (!memberId) {
        return {
          code: 400,
          message: "Bad Request",
        };
      }
      if (memberId.startsWith('S')) {
      const insertClass = await db
      .insertInto("student_class")
      .values({
        class_id: classId,
        student_id: memberId,
      })
      .execute();
      const member = await db
        .updateTable("school_members")
        .set({
          first_name: firstName,
          last_name: lastName,
          address: address,
          gender: gender,
          updated_at: new Date(),
        })
        .where("user_id", "=", memberId)
        .executeTakeFirst();
      } else {
        const member = await db
        .updateTable("school_members")
        .set({
          first_name: firstName,
          last_name: lastName,
          address: address,
          gender: gender,
          updated_at: new Date(),
        })
        .where("user_id", "=", memberId)
        .executeTakeFirst();
      }
      return { message: "Members updated successfully" };
    } catch (error) {
      return { error };
    }
  });

// READ USER BY ID
// .get("/:username", async ({ params, set }) => {
//     try {
//     const { username } = params;
//     if (!username) {
//       return {
//         code: 400,
//         message: "Bad Request",
//       };
//     }
//     const user = await db
//         .selectFrom("user")
//         .select(["id", "username", "password"])
//         .where("username", "==", username)
//         .limit(1)
//         .executeTakeFirst();
//     return { user };
//     } catch (error) {
//     return { error };
//     }
// })

// READ ALL USER BY ROLE
// .get("/:role", async ({ params, set }) => {
//   try {
//     const { role } = params as User;
//     if (!role) {
//       return {
//         code: 400,
//         message: "Bad Request",
//       };
//     }
//     const user = await db
//       .selectFrom("user")
//       .select(["id", "username", "password"])
//       .where("role", "==", role)
//       .execute();
//     return { user };
//   } catch (error) {
//     return { error };
//   }
// })

// UPDATE USER BY ID
// .put("/:id", async ({ params, body, set }) => {
//   try {
//     const { id } = params;
//     const { username, password } = body as User;
//     if (!username || !password) {
//       return {
//         code: 400,
//         message: "Bad Request",
//       };
//     }
//     const user = await db
//       .updateTable("user")
//       .set({ username, password })
//       .where("id", "=", parseInt(id))
//       .executeTakeFirst();
//     return { user };
//   } catch (error) {
//     return { error };
//   }
// })

// // DELETE USER BY ID
// .delete("/:id", async ({ params, set }) => {
//   try {
//     const { id } = params;
//     if (!id) {
//       return {
//         code: 400,
//         message: "Bad Request",
//       };
//     }
//     const user = await db
//       .deleteFrom("user")
//       .where("id", "=", parseInt(id))
//       .executeTakeFirst();
//     return { user };
//   } catch (error) {
//     return { error };
//   }
// });
