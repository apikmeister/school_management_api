import { ctx } from "context";
import { School } from "db/schema/school.schema";
import Elysia from "elysia";
import { isAuthenticated } from "middleware/auth.middleware";

export const schoolController = new Elysia({ prefix: "/school"})
.use(ctx)
.use(isAuthenticated)

// CREATE SCHOOL
.post("/create", async ({ body, set, db }) => {
  try {
    const { schoolId, schoolName, address, phone } = body as School;
    if (body == null) {
      return {
        code: 400,
        message: "Bad Request",
      };
    }
    await db
      .insertInto("school")
      .values({
        school_id: schoolId,
        school_name: schoolName,
        address: address,
        phone: phone,
        // school_address: schoolAddress,
      })
      .executeTakeFirst();
    return { message: "School created successfully" };
  } catch (error) {
    return { error };
  }
})

// VIEW SCHOOLS BY ID
.get("/:schoolId", async ({ params, db }) => {
  try {
    const { schoolId } = params;
    const school = await db
      .selectFrom("school")
      .select(["school_id", "school_name", "address", "phone"])
      .where("school_id", "=", schoolId)
      .executeTakeFirst();
    return { school };
  } catch (error) {
    return { error };
  }
})