CREATE TABLE IF NOT EXISTS "goals" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"desired_weekly_franquency" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
