CREATE TABLE "picture_lesson" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"content" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
