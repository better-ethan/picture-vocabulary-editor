import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, user, session, account, verification } from "@package/drizzle";
import { sendMail } from "~/lib/email.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    debugLogs: true,
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendMail({
        from: "thisisethanlee@gmail.com",
        to: user.email,
        subject: "Reset your password",
        html: `<p>You requested a password reset. Click the link below to reset your password:</p>
              <a href="${url}">Reset Password</a>
              <p>If you did not request this, please ignore this email.</p>
              `,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendMail({
        from: "thisisethanlee@gmail.com",
        to: user.email,
        subject: "Verify your email",
        text: `Please verify your email by clicking the following link: ${url}`,
        html: `<p>Please verify your email by clicking the link below:</p>
              <a href="${url}">Verify Email</a>
              `,
      });
    },
    autoSignInAfterVerification: true,
  },
  trustedOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"],
  logger: {
    level: "debug",
  },
});
