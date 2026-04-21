import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db, pictureLesson } from "@package/drizzle";
import { publicProcedure, router } from "../trpc.js";
import { title } from "node:process";

export const pictureLessonRouter = router({
  list: publicProcedure.query(async () => {
    const rows = await db
      .select()
      .from(pictureLesson)
      .orderBy(desc(pictureLesson.createdAt));
    return rows;
  }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        description: z.string().optional(),
        status: z.enum(["draft", "published"]).default("draft"),
        content: z.json().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [row] = await db
        .insert(pictureLesson)
        .values({
          title: input.title,
          description: input.description,
          status: input.status,
          content: input.content,
        })
        .returning();

      return row;
    }),

  toggle: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).max(255),
        description: z.string().optional(),
        status: z.enum(["draft", "published"]).default("draft"),
        content: z.json().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [row] = await db
        .update(pictureLesson)
        .set({
          title: input.title,
          description: input.description,
          status: input.status,
          content: input.content,
          updatedAt: new Date(),
        })
        .where(eq(pictureLesson.id, input.id))
        .returning();

      return row;
    }),

  remove: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(pictureLesson).where(eq(pictureLesson.id, input.id));
    }),
});
