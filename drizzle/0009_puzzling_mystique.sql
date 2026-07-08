ALTER TABLE "picture_lesson" ADD COLUMN "category_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_slug_unique" UNIQUE("slug");