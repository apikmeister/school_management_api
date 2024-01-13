import jwt from "@elysiajs/jwt";
import { ctx } from "context";
// import { db } from "db";
import {
  User,
  insertUserSchema,
  selectUserSchema,
} from "db/schema/user.schema";
import Elysia, { t } from "elysia";
import { Password } from "utils/password";

// export const authController = (app: Elysia) => {
//   app.group("/auth", (app) =>
export const authController = new Elysia({ prefix: "/auth" })
  .use(ctx)
  // app.
  // .get("/user", async ({ set }) => {
  //     try {
  //         const users = await db.selectFrom("user").selectAll().execute();
  //         return { users };
  //     } catch (error) {

  //         return { error };
  //     }
  // })
  //   .get(
  //     "/user",
  //     async () => {
  //       const users = await db.selectFrom("user").selectAll().execute();
  //       console.log(users);
  //       return users;
  //     },
  //     {
  //       response: t.Array(selectUserSchema),
  //     }
  //   )
  //   .get(
  //     "/user",
  //     async () => {
  //       const users = await db.selectFrom("user").selectAll().execute();
  //       console.log(users);
  //       return  users;
  //       //   set.status = 200;
  //     },
  //     {
  //       response: t.Array(
  //         t.Object({
  //           id: t.Number(),
  //           username: t.String(),
  //           password: t.String(),
  //         })
  //       ),
  //     }
  //   )
  .post("/login", async ({ body, set, jwt, db }) => {
    try {
      const { username, password } = body as User;
      if (!username || !password) {
        set.status = 400;
        return {
          code: 400,
          message: "Username and password are required",
        };
      }

      // const currentUser = await db
      //   .selectFrom("user")
      //   .select(["username", "password"])
      //   // .selectAll()
      //   .where("username", "=", username)
      //   .limit(1)
      //   .executeTakeFirst();

      // if (!currentUser) throw inva

      // const invalidUsernameOrPassword = {
      //   // code: 400,
      //   message: "Invalid username or password",
      // };
      const user = await db
        .selectFrom("user")
        .select(["id", "username", "password", "school_id"])
        .where("username", "=", username)
        .limit(1)
        .execute();
      // if (!user) throw invalidUsernameOrPassword;
      // const passwordMatch = await Password.compare(password, user[0].password);
      const passwordMatch = password === user[0].password;
      // set.status = 400;
      if (!passwordMatch || !user) {
        set.status = 400;
        return {
          code: 400,
          message: "Invalid username or password",
        };
        // throw invalidUsernameOrPassword;
      }

      const token = await jwt.sign({ id: user[0].id });
      set.status = 200;
      return {
        code: 200,
        message: "Login success",
        token,
        schoolId: user[0].school_id,
      };
    } catch (error) {
      // set.status = error?.code;
      set.status = 500;
      return {
        code: 500,
        error: error,
      };
      // if (error instanceof Error) {
      //   // Now TypeScript knows that `error` is an instance of `Error`
      //   // console.error(error.message);
      //   return {
      //     code: 500,
      //     error: error.message
      //   };
      // } else {
      //   // Handle any other types of errors, or rethrow
      //   throw {
      //     code: 500,
      //     error: error
      //   };
      // }
    }
  })

  .post("/validate", async ({ body, request, set, jwt, db }) => {
    try {
      const tokenPrefix = "Bearer ";
      const bearerToken = request.headers.get("Authorization");
      if (!bearerToken || !bearerToken.startsWith(tokenPrefix)) {
        set.status = 400;
        throw { code: 400, message: "Invalid token" };
      }
      const token = bearerToken.slice(tokenPrefix.length);
      const auth = await jwt.verify(token);
      if (!auth) {
        set.status = 401;
        throw { code: 401, message: "Unauthorized" };
      }
      const user = await db
        .selectFrom("user")
        .select(["id", "username"])
        .where("id", "=", auth.id as number)
        .limit(1)
        .executeTakeFirst();
        set.status = 200;
      return { user };
      // const { token } = body as { token: string };
      // if (!token) throw { code: 400, message: "Token is required" };
      // const auth = await jwt.verify(token);
      // if (!auth) throw { code: 401, message: "Unauthorized" };
      // const user = await db
      //   .selectFrom("user")
      //   .select(["id", "username"])
      //   .where("id", "=", auth.id)
      //   .limit(1)
      //   .executeTakeFirst();
      // if (!user) throw { code: 401, message: "Unauthorized" };
      // return { user };
    } catch (error) {
      // set.status = error?.code;
      return { error: error };
    }
  });

//   .get("/user/:username", async ({ set, params, jwt }) => {
//     try {
//       // const { id } = params;
//       const { username } = params;
//       const user = await db
//         .selectFrom("user")
//         .selectAll()
//         .where("username", "=", username)
//         .limit(1)
//         .execute();
//       if (!user) throw { code: 400, message: "User not found" };
//       const auth = await jwt.verify();
//       if (!auth) throw { code: 401, message: "Unauthorized" };
//       return { user };
//     } catch (error: any) {
//       // set.status = error?.code;
//       return { error: error.message };
//     }
//   });
