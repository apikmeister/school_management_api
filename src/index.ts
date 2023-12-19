import { api } from "controllers";
import { authController } from "controllers/auth";
import { Elysia } from "elysia";
import { useJwt } from "middleware/jwt";

const PORT = process.env.PORT || 3000;
export const app = new Elysia();
app
  .get("/", () => "Hello Elysia")
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

