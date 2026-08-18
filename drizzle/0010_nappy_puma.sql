CREATE TABLE "subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"plan" text NOT NULL,
	"reference_id" text NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"status" text NOT NULL,
	"period_start" timestamp (6) with time zone,
	"period_end" timestamp (6) with time zone,
	"cancel_at_period_end" boolean,
	"cancel_at" timestamp (6) with time zone,
	"canceled_at" timestamp (6) with time zone,
	"ended_at" timestamp (6) with time zone,
	"seats" integer,
	"trial_start" timestamp (6) with time zone,
	"trial_end" timestamp (6) with time zone,
	"billing_interval" text,
	"stripe_schedule_id" text
);
--> statement-breakpoint
ALTER TABLE "picture_lesson" ALTER COLUMN "id" SET DATA TYPE varchar(16);--> statement-breakpoint
ALTER TABLE "picture_lesson" ADD COLUMN "preview" varchar(255);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "stripe_customer_id" text;