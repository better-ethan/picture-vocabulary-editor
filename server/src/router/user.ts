import { db, user } from "@package/drizzle";
import { fromNodeHeaders } from "better-auth/node";
import { eq } from "drizzle-orm";
import z from "zod";
import { auth } from "~/lib/auth.js";
import { loggedInProcedure, publicProcedure, router } from "~/trpc.js";

export const userRouter = router({
  getCurrentUser: loggedInProcedure.query(async ({ ctx }) => {
    return {
      id: ctx.user.id as string,
      name: ctx.user.name as string,
      email: ctx.user.email as string,
      description: ctx.user.description as string | null,
    };
  }),
  getUserById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const [userRow] = await db
        .select()
        .from(user)
        .where(eq(user.id, input.id))
        .limit(1);

      if (!userRow) {
        return null;
      }

      return {
        id: userRow.id,
        name: userRow.name,
        email: userRow.email,
        description: userRow.description,
      };
    }),
  updateProfile: loggedInProcedure
    .input(
      z.object({
        name: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await auth.api.updateUser({
        body: input,
        headers: fromNodeHeaders(ctx.req.headers),
      });

      return { success: true };
    }),
});
