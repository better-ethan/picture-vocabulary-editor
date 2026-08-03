import { router } from "./trpc.js";
import { pictureLessonRouter } from "./router/picture_lesson.js";
import { uploadRouter } from "./router/uploadRouter.js";
import { userRouter } from "./router/user.js";
import { audioRouter } from "./router/audio.js";
import { categoryRouter } from "./router/category.js";
import { blogRouter } from "./router/blog.js";
import { stripeRouter } from "./router/stripe.js";

export const appRouter = router({
  pictureLesson: pictureLessonRouter,
  upload: uploadRouter,
  audio: audioRouter,
  user: userRouter,
  category: categoryRouter,
  blog: blogRouter,
  stripe: stripeRouter,
});

export type AppRouter = typeof appRouter;
