import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "~/lib/s3.js";
import { db, uploadImage } from "@package/drizzle";
import { desc } from "drizzle-orm";

export const uploadRouter = router({
  getUploadUrl: publicProcedure
    .input(
      z.object({
        fileName: z.string().min(1).max(255),
        fileType: z.string().min(1).max(255),
      })
    )
    .mutation(async ({ input }) => {
      const key = `uploads/images/${Date.now()}-${input.fileName}`;
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

  create: publicProcedure
    .input(z.object({ url: z.string().min(1).max(255) }))
    .mutation(async ({ input }) => {
      const [row] = await db
        .insert(uploadImage)
        .values({ url: input.url })
        .returning();

      return row;
    }),

  list: publicProcedure.query(async () => {
    const rows = await db
      .select()
      .from(uploadImage)
      .orderBy(desc(uploadImage.createdAt));
    return rows;
  }),
});
