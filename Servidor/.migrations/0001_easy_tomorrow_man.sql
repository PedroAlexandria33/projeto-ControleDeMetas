CREATE TABLE IF NOT EXISTS "metas_cumpridas" (
	"id" text PRIMARY KEY NOT NULL,
	"meta_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "metas_cumpridas" ADD CONSTRAINT "metas_cumpridas_meta_id_goals_id_fk" FOREIGN KEY ("meta_id") REFERENCES "public"."goals"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
