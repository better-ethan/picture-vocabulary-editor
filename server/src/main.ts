import { router } from "./trpc.js";
import { todoRouter } from "./router/todo.js";
import { pictureLessonRouter } from "./router/picture_lesson.js";
import { uploadRouter } from "./router/uploadRouter.js";

export const appRouter = router({
  todo: todoRouter,
  pictureLesson: pictureLessonRouter,
  upload: uploadRouter,
});

export type AppRouter = typeof appRouter;
