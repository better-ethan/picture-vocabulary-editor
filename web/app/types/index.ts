export interface PictureLesson {
  id: string;
  title: string;
  slug: string;
  description?: string;
  status: "draft" | "published";
  categoryId: number;
  thumbnail: string;
  username: string;
}
