import { db } from "db";
import Elysia from "elysia";
import { useJwt } from "middleware/jwt";

export const ctx = new Elysia({
  name: "@app/ctx",
})
.decorate("db", db)
.use(useJwt)
// .derive(async ({ headers, jwt }) => {
//   const tokenPrefix = "Bearer ";
//   const bearerToken = headers["Authorization"];
//   if (!bearerToken || !bearerToken.startsWith(tokenPrefix))
//     throw { code: 400, message: "Invalid token" };
//   const token = bearerToken.slice(tokenPrefix.length);
//   const auth = await jwt.verify(token);
//   // if (!auth) throw { code: 401, message: "Unauthorized" };
//   return { auth };
//   // const auth = headers['Authorization'];

//   // return {
//   //   bearer: auth?.startsWith("Bearer ") ? auth.slice("Bearer ".length) : null,
//   // }
// });

