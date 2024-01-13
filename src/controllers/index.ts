import Elysia from "elysia";
import { authController } from "./auth";
import { disciplineController } from "./discipline";
import { userController } from "./user";
import { schoolController } from "./school.controller";
import { resultController } from "./result.controller";
import { subjectController } from "./subject.controller";
// import { tasksController } from "./tasksController";

export const api = new Elysia({
  prefix: "/api",
})
  .use(authController)
  .use(disciplineController)
  .use(userController)
  .use(schoolController)
  .use(resultController)
  .use(subjectController);
