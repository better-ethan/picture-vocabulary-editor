import { todoRouter } from "./router/todo.js";
import { router } from "./trpc.js";

export const appRouter = router({
  todo: todoRouter,
});

export type AppRouter = typeof appRouter;
