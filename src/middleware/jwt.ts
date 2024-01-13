import jwt from "@elysiajs/jwt";
import Elysia from "elysia";

export const useJwt = (app: Elysia) =>
  app.use(
    jwt({
      name: "jwt",
      secret: process.env.SECRET!,
      exp: process.env.EXPIRED!,
    })
  );
