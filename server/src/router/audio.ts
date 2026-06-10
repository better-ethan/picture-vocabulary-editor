import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "~/lib/s3.js";
import { text2Speech } from "~/lib/polly.js";

export const audioRouter = router({
  getUploadUrl: publicProcedure
    .input(
      z.object({
        text: z.string().min(1).max(255),
      })
    )
    .mutation(async ({ input }) => {
      const key = `uploads/audios/${Date.now()}-${input.text}`;

      const bytes = await text2Speech({ text: input.text });

      const command = new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_BUCKET_NAME!,
        Key: key,
        Body: bytes,
        ContentType: "audio/mpeg",
      });

      await s3.send(command);

      return {
        url: `${process.env.VITE_CLOUDFLARE_PUBLIC_URL}/${key}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ url: z.string().min(1).max(255) }))
    .mutation(async ({ input }) => {}),

  list: publicProcedure.query(async () => {}),
});
