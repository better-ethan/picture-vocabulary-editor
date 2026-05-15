import { fromNodeHeaders } from "better-auth/node";
import { auth } from "~/lib/auth.js";
import { publicProcedure, router } from "~/trpc.js";

export const userRouter = router({
  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(ctx.req.headers),
    });

    return session?.user;
  }),
});
