ALTER TABLE "podiums" DROP CONSTRAINT "podiums_club_id_clubs_id_fk";
--> statement-breakpoint
ALTER TABLE "podiums" ALTER COLUMN "player" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "podiums" ADD CONSTRAINT "podiums_clubId_clubs_id_fk" FOREIGN KEY ("clubId") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;