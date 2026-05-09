import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

export const createContext = ({ req, res }: CreateFastifyContextOptions) => {
  return { req, res };
};

const t = initTRPC.context<typeof createContext>().create({
  errorFormatter({ shape, error }) {
    return {
      code: -1,
      message:
        error.cause instanceof ZodError
          ? error.cause.issues.map((issue) => issue.message).join("")
          : shape.message,
      data: null,
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
