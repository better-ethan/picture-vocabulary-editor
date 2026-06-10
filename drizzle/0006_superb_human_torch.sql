CREATE TABLE "text_speech" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" varchar(255) NOT NULL,
	"locale" varchar(20) NOT NULL,
	"voice" varchar(20) NOT NULL,
	"engine" varchar(20) NOT NULL,
	"hash" varchar(64) NOT NULL,
	"audio_url" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "text_speech_hash_unique" UNIQUE("hash")
);
--> statement-breakpoint
DROP TABLE "todo" CASCADE;--> statement-breakpoint
ALTER TABLE "picture_lesson" ADD COLUMN "thumbnail" varchar(255) NOT NULL;