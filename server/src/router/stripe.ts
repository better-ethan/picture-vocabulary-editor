import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";
import { stripe } from "../lib/stripe.js";
import { auth } from "~/lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import type Stripe from "stripe";
import { db, subscription } from "@package/drizzle";
import { eq } from "drizzle-orm";

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
  retrieveCheckoutSession: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input, ctx }) => {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(ctx.req.headers),
      });

      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("Unauthorized");
      }

      const checkoutSession = await stripe.checkout.sessions.retrieve(
        input.sessionId,
        {
          expand: ["line_items.data.price.product", "subscription"],
        }
      );

      if (!checkoutSession) {
        throw new Error("Invalid session ID");
      }

      const lineItem = checkoutSession.line_items?.data[0];
      const product = lineItem?.price?.product as Stripe.Product;
      const interval = lineItem?.price?.recurring?.interval;
      const amount = checkoutSession.amount_total;

      return {
        plan: product?.name,
        interval,
        amount,
        paymentStatus: checkoutSession.payment_status,
      };
    }),
  createPortalSession: publicProcedure
    .input(
      z.object({
        returnUrl: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const portalSession = await auth.api.createBillingPortal({
        headers: fromNodeHeaders(ctx.req.headers),
        body: {
          returnUrl: input.returnUrl,
        },
      });

      return {
        portalUrl: portalSession.url,
      };
    }),
  getSubscriptionStatus: publicProcedure.query(async ({ ctx }) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(ctx.req.headers),
    });

    const userId = session?.user?.id;
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const subscriptionRecord = await db
      .select()
      .from(subscription)
      .where(eq(subscription.referenceId, userId))
      .limit(1);

    return subscriptionRecord.length > 0 ? subscriptionRecord[0] : null;
  }),
});
