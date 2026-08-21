import { z } from "zod";
import { loggedInProcedure, router } from "../trpc.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../lib/s3.js";
import { db, uploadImage, user } from "@package/drizzle";
import { desc } from "drizzle-orm";

export const uploadRouter = router({
  getUploadUrl: loggedInProcedure
    .input(
      z.object({
        fileName: z.string().min(1).max(255),
        fileType: z.string().min(1).max(255),
        source: z.string().min(1).max(20).optional(),
      })
    )
    .mutation(async ({ input }) => {
      let key = `uploads/images/${Date.now()}-${input.fileName}`;
      if (input.source === "pixabay") {
        key = `uploads/pixabay/${Date.now()}-${input.fileName}`;
      } else if (input.source === "thumbnail") {
        key = `uploads/thumbnail/${input.fileName}`;
      } else if (input.source === "preview") {
        key = `uploads/preview/${input.fileName}`;
      } else if (input.source === "audio") {
        key = `uploads/audios/${input.fileName}`;
      }

      const command = new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_BUCKET_NAME!,
        Key: key,
        ContentType: input.fileType,
      });

      const url = await getSignedUrl(s3, command, { expiresIn: 60 * 3 });

      return {
        url,
        key,
      };
    }),

  create: loggedInProcedure
    .input(z.object({ url: z.string().min(1).max(255) }))
    .mutation(async ({ input }) => {
      const [row] = await db
        .insert(uploadImage)
        .values({ url: input.url })
        .returning();

      return row;
    }),

  list: loggedInProcedure.query(async () => {
    const rows = await db
      .select()
      .from(uploadImage)
      .orderBy(desc(uploadImage.createdAt));
    return rows;
  }),
});
