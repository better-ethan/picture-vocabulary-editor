import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";
import { readdir, readFile } from "node:fs/promises";
import matter from "gray-matter";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const blogDirectory = join(__dirname, "../../../blog");

export const blogRouter = router({
  list: publicProcedure.query(async () => {
    const files = await readdir(blogDirectory);
    const blogs = await Promise.all(
      files.map(async (file) => {
        const filePath = `${blogDirectory}/${file}`;
        const fileData = await readFile(filePath, "utf-8");
        const { data } = matter(fileData);
        const slug = file.replace(/\.md$/, "");
        return { slug, meta: data };
      })
    );
    const publishedBlogs = blogs.filter((blog) => blog.meta.published);
    return publishedBlogs;
  }),
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const filePath = `${blogDirectory}/${input.slug}.md`;
      try {
        const fileData = await readFile(filePath, "utf-8");
        const { data, content } = matter(fileData);

        if (!data.published) return null;

        return { meta: data, content };
      } catch (error) {
        console.log("### Error reading blog file: ", error);
        return null;
      }
    }),
});
