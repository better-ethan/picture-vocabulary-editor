import { z } from "zod";
import { eq } from "drizzle-orm";
import { publicProcedure, router } from "../trpc.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "~/lib/s3.js";
import {
  generateHash,
  generateSsmlText,
  text2Speech,
  voiceConfig,
} from "~/lib/polly.js";
import { db, textSpeech } from "@package/drizzle";

export const audioRouter = router({
  getUploadUrl: publicProcedure
    .input(
      z.object({
        text: z.string().min(1).max(255),
      })
    )
    .mutation(async ({ input }) => {
      const hash = generateHash({
        text: generateSsmlText(input.text.trim()),
      });
      const key = `uploads/audios/${hash}.mp3`;

      const result = await db
        .select()
        .from(textSpeech)
        .where(eq(textSpeech.hash, hash));

      if (result.length > 0) {
        return {
          url: result[0].audioUrl,
        };
      }

      const bytes = await text2Speech({ text: input.text });

      const command = new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_BUCKET_NAME!,
        Key: key,
        Body: bytes,
        ContentType: "audio/mpeg",
      });

      await s3.send(command);

      const audioUrl = `${process.env.VITE_CLOUDFLARE_PUBLIC_URL}/${key}`;

      await db.insert(textSpeech).values({
        text: input.text.trim(),
        locale: voiceConfig.locale,
        voice: voiceConfig.voice,
        engine: voiceConfig.engine,
        hash,
        audioUrl,
      });

      return {
        url: audioUrl,
      };
    }),

  create: publicProcedure
    .input(z.object({ url: z.string().min(1).max(255) }))
    .mutation(async ({ input }) => {}),

  list: publicProcedure.query(async () => {}),
});
