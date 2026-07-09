import { z } from "zod";
import { eq, and, isNull } from "drizzle-orm";
import { publicProcedure, router } from "../trpc.js";

import { db, category, pictureLesson } from "@package/drizzle";

export const categoryRouter = router({
  list: publicProcedure.query(async () => {
    const result = await db
      .select({
        id: category.id,
        name: category.name,
        slug: category.slug,
      })
      .from(category)
      .orderBy(category.sortOrder)
      .where(isNull(category.deletedAt));

    return result;
  }),
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const categoryRecord = await db
        .select({
          id: category.id,
          name: category.name,
          slug: category.slug,
        })
        .from(category)
        .where(and(eq(category.slug, input.slug), isNull(category.deletedAt)))
        .limit(1);

      if (categoryRecord.length === 0) {
        return null;
      }

      return categoryRecord[0];
    }),
});
