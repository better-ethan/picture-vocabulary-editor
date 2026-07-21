import { desc, eq, and, inArray, isNull } from "drizzle-orm";
import { z } from "zod";
import { category, db, pictureLesson, user } from "@package/drizzle";
import { publicProcedure, router } from "../trpc.js";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";

export const pictureLessonRouter = router({
  list: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        status: z.enum(["draft", "published"]).optional(),
        categoryId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const rows = await db
        .select()
        .from(pictureLesson)
        .where(
          and(
            isNull(pictureLesson.deletedAt),
            input.status !== undefined
              ? eq(pictureLesson.status, input.status)
              : undefined,
            input.userId !== undefined
              ? eq(pictureLesson.userId, input.userId)
              : undefined,
            input.categoryId !== undefined
              ? eq(pictureLesson.categoryId, input.categoryId)
              : undefined
          )
        )
        .orderBy(desc(pictureLesson.createdAt));

      const userIds = [
        ...new Set(rows.map((row) => row.userId).filter(Boolean)),
      ];
      const userRows = await db
        .select()
        .from(user)
        .where(inArray(user.id, userIds));

      const userMap = Object.fromEntries(
        userRows.map((user) => [user.id, user.name])
      );
      return rows.map((row) => ({
        ...row,
        username: userMap[row.userId] || "Anonymous",
      }));
    }),

  create: publicProcedure
    .input(
      z.object({
        id: z.string().length(16),
        title: z.string().min(1).max(255),
        slug: z.string().min(1).max(255),
        description: z.string().optional(),
        status: z.enum(["draft", "published"]).default("draft"),
        categoryId: z.number(),
        thumbnail: z.string().max(255),
        preview: z.string().max(255),
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
          id: input.id,
          userId,
          title: input.title,
          slug: input.slug,
          description: input.description,
          status: input.status,
          categoryId: input.categoryId,
          thumbnail: input.thumbnail,
          preview: input.preview,
          content: input.content,
        })
        .returning();

      return row;
    }),

  toggle: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(255),
        slug: z.string().min(1).max(255),
        description: z.string().optional(),
        status: z.enum(["draft", "published"]).default("draft"),
        categoryId: z.number(),
        thumbnail: z.string().max(255),
        preview: z.string().max(255),
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
          categoryId: input.categoryId,
          thumbnail: input.thumbnail,
          preview: input.preview,
          content: input.content,
          updatedAt: new Date(),
        })
        .where(eq(pictureLesson.id, input.id))
        .returning();

      return row;
    }),

  remove: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .update(pictureLesson)
        .set({
          deletedAt: new Date(),
        })
        .where(eq(pictureLesson.id, input.id));
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [row] = await db
        .select()
        .from(pictureLesson)
        .where(
          and(isNull(pictureLesson.deletedAt), eq(pictureLesson.id, input.id))
        );

      return row;
    }),

  getByIdAndSlug: publicProcedure
    .input(z.object({ id: z.string(), slug: z.string() }))
    .query(async ({ input }) => {
      const [row] = await db
        .select()
        .from(pictureLesson)
        .where(
          and(
            isNull(pictureLesson.deletedAt),
            eq(pictureLesson.id, input.id),
            eq(pictureLesson.slug, input.slug)
          )
        );

      if (!row) {
        return null;
      }

      const [userRow] = await db
        .select()
        .from(user)
        .where(eq(user.id, row.userId));

      const [categoryRow] = await db
        .select({
          id: category.id,
          name: category.name,
          slug: category.slug,
        })
        .from(category)
        .where(eq(category.id, row.categoryId));

      return {
        ...row,
        username: userRow ? userRow.name : "Anonymous",
        currentCateory: categoryRow || null,
      };
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
            isNull(pictureLesson.deletedAt),
            input.status ? eq(pictureLesson.status, input.status) : undefined
          )
        )
        .orderBy(desc(pictureLesson.createdAt));

      return rows;
    }),

  preview: publicProcedure
    .input(z.object({ id: z.string(), slug: z.string() }))
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
            isNull(pictureLesson.deletedAt),
            eq(pictureLesson.id, input.id),
            eq(pictureLesson.slug, input.slug),
            eq(pictureLesson.userId, userId)
          )
        );

      return row;
    }),
});
