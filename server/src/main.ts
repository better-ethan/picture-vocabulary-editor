import { router } from "./trpc.js";
import { todoRouter } from "./router/todo.js";
import { pictureLessonRouter } from "./router/picture_lesson.js";

export const appRouter = router({
  todo: todoRouter,
  pictureLesson: pictureLessonRouter,
});

export type AppRouter = typeof appRouter;
