import { trpc } from "@/util";
import type { CanvasContent } from "@/components/vocabulary-edit";

/**
 * download images from pixabay and re-upload to our R2, then replace the src in content
 * @param content raw content with pixabay image src
 * @returns updated content with new image src
 */
export async function reuploadPixabayImages(
  content: CanvasContent
): Promise<CanvasContent> {
  const uploadResults = await Promise.allSettled(
    content.images.map(async (image) => {
      if (!image.src.includes("pixabay.com")) {
        return { id: image.id, src: image.src };
      }

      const response = await fetch(image.src);
      const arrayBuffer = await response.arrayBuffer();
      const contentType = response.headers.get("content-type") ?? "image/jpeg";

      const urlPath = new URL(image.src).pathname;
      const fileName = urlPath.split("/").pop() ?? `${Date.now()}`;

      const { url: uploadUrl, key } = await trpc.upload.getUploadUrl.mutate({
        fileName,
        fileType: contentType,
        source: "pixabay",
      });

      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: arrayBuffer,
      });

      const r2PublicUrl = `${process.env.CLOUDFLARE_PUBLIC_URL}/${key}`;
      return { id: image.id, src: r2PublicUrl };
    })
  );

  const srcMap = new Map<string, string>();
  for (const result of uploadResults) {
    if (result.status === "fulfilled") {
      srcMap.set(result.value.id, result.value.src);
    } else {
      console.error("Failed to upload image:", result.reason);
    }
  }

  return {
    ...content,
    images: content.images.map((image) => ({
      ...image,
      src: srcMap.get(image.id) ?? image.src,
    })),
  };
}
