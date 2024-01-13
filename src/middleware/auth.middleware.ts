// export const authMiddleware = async ({ jwt, set }, next) => {
//   try {
//     // Verify the JWT
//     await jwt.verify();

import Elysia from "elysia";
import { useJwt } from "./jwt";

//     // If the JWT is valid, call the next middleware
//     await next();
//   } catch (error) {
//     // If the JWT is not valid, send a 401 Unauthorized response
//     set.status = 401;
//     return { error: "Unauthorized" };
//   }
// };

export const isAuthenticated = (app: Elysia) =>
  app
  .use(useJwt)
  .derive(async ({ request, jwt }) => {
    const tokenPrefix = "Bearer ";
    const bearerToken = request.headers.get("Authorization");
    if (!bearerToken || !bearerToken.startsWith(tokenPrefix))
      throw { code: 400, message: "Invalid token" };
    const token = bearerToken.slice(tokenPrefix.length);
    const auth = await jwt.verify(token);
    if (!auth) throw { code: 401, message: "Unauthorized" };
    // if (!auth) throw { code: 401, message: "Unauthorized" };
      return { auth };
    // return { bearerToken };
    // const auth = headers['Authorization'];

    // return {
    //   bearer: auth?.startsWith("Bearer ") ? auth.slice("Bearer ".length) : null,
    // }
  });
