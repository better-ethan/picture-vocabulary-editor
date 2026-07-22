import { fromNodeHeaders } from "better-auth/node";
import z from "zod";
import { auth } from "~/lib/auth.js";
import { publicProcedure, router } from "~/trpc.js";

export const userRouter = router({
  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(ctx.req.headers),
    });

    return session?.user;
  }),
  updateProfile: publicProcedure
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
