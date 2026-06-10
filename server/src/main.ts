import { router } from "./trpc.js";
import { pictureLessonRouter } from "./router/picture_lesson.js";
import { uploadRouter } from "./router/uploadRouter.js";
import { userRouter } from "./router/user.js";
import { audioRouter } from "./router/audio.js";

export const appRouter = router({
  pictureLesson: pictureLessonRouter,
  upload: uploadRouter,
  audio: audioRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
