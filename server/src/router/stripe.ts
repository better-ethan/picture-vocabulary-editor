import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";
import { stripe } from "../lib/stripe.js";
import { auth } from "~/lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export const stripeRouter = router({
  createCheckoutSession: publicProcedure
    .input(
      z.object({
        plan: z.string(),
        interval: z.enum(["monthly", "annual"]),
        success_url: z.string(),
        cancel_url: z.string(),
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

      const frontendDomain =
        process.env.VITE_FRONTEND_BASE_URL ?? "http://localhost:3000";

      const stripeSession = await auth.api.upgradeSubscription({
        headers: fromNodeHeaders(ctx.req.headers),
        body: {
          plan: input.plan,
          annual: input.interval === "annual",
          successUrl: `${frontendDomain}${input.success_url}?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${frontendDomain}${input.cancel_url}`,
          disableRedirect: true,
        },
      });

      return {
        checkoutUrl: stripeSession.url,
      };
    }),
});
