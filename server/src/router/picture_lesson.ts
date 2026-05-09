import { desc, eq, and } from "drizzle-orm";
import { z } from "zod";
import { db, pictureLesson } from "@package/drizzle";
import { publicProcedure, router } from "../trpc.js";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";

export const pictureLessonRouter = router({
  list: publicProcedure
    .input(
      z.object({
        userId: z.number().optional(),
        status: z.enum(["draft", "published"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const rows = await db
        .select()
        .from(pictureLesson)
        .where(
          and(
            input.status !== undefined
              ? eq(pictureLesson.status, input.status)
              : undefined,
            input.userId !== undefined
              ? eq(pictureLesson.userId, input.userId)
              : undefined
          )
        )
        .orderBy(desc(pictureLesson.createdAt));
      return rows;
    }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        slug: z.string().min(1).max(255),
        description: z.string().optional(),
        status: z.enum(["draft", "published"]).default("draft"),
        content: z.json().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(ctx.req.headers),
      });

      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("Unauthorized");
      }

      const [row] = await db
        .insert(pictureLesson)
        .values({
          userId,
          title: input.title,
          slug: input.slug,
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
        slug: z.string().min(1).max(255),
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
          slug: input.slug,
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

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const [row] = await db
        .select()
        .from(pictureLesson)
        .where(eq(pictureLesson.id, input.id));

      return row;
    }),

  getByIdAndSlug: publicProcedure
    .input(z.object({ id: z.number(), slug: z.string() }))
    .query(async ({ input }) => {
      const [row] = await db
        .select()
        .from(pictureLesson)
        .where(
          and(
            eq(pictureLesson.id, input.id),
            eq(pictureLesson.slug, input.slug)
          )
        );
      return row;
    }),

  authored: publicProcedure
    .input(z.object({ status: z.enum(["draft", "published"]).optional() }))
    .query(async ({ input, ctx }) => {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(ctx.req.headers),
      });

      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("Unauthorized");
      }

      const rows = await db
        .select()
        .from(pictureLesson)
        .where(
          and(
            eq(pictureLesson.userId, userId),
            input.status ? eq(pictureLesson.status, input.status) : undefined
          )
        )
        .orderBy(desc(pictureLesson.createdAt));

      return rows;
    }),

  preview: publicProcedure
    .input(z.object({ id: z.number(), slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(ctx.req.headers),
      });

      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("Unauthorized");
      }

      const [row] = await db
        .select()
        .from(pictureLesson)
        .where(
          and(
            eq(pictureLesson.id, input.id),
            eq(pictureLesson.slug, input.slug),
            eq(pictureLesson.userId, userId)
          )
        );

      return row;
    }),
});
