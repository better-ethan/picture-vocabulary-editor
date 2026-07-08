import { z } from "zod";
import { eq, isNull } from "drizzle-orm";
import { publicProcedure, router } from "../trpc.js";

import { db, category } from "@package/drizzle";

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
});
