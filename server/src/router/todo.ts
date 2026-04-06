import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db, todo } from "@package/drizzle";
import { publicProcedure, router } from "../trpc.js";

export const todoRouter = router({
  list: publicProcedure.query(async () => {
    const rows = await db.select().from(todo).orderBy(desc(todo.createdAt));
    return rows;
  }),

  create: publicProcedure
    .input(z.object({ title: z.string().min(1).max(255) }))
    .mutation(async ({ input }) => {
      const [row] = await db
        .insert(todo)
        .values({ title: input.title })
        .returning();

      return row;
    }),

  toggle: publicProcedure
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    .mutation(async ({ input }) => {
      const [row] = await db
        .update(todo)
        .set({ completed: input.completed })
        .where(eq(todo.id, input.id))
        .returning();

      return row;
    }),

  remove: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(todo).where(eq(todo.id, input.id));
    }),
});
