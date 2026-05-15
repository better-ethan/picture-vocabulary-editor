import { router } from "./trpc.js";
import { pictureLessonRouter } from "./router/picture_lesson.js";
import { uploadRouter } from "./router/uploadRouter.js";
import { userRouter } from "./router/user.js";

export const appRouter = router({
  pictureLesson: pictureLessonRouter,
  upload: uploadRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
