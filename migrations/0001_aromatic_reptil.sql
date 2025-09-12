CREATE TYPE "public"."category" AS ENUM('Sub 8 Masculino', 'Sub 10 Masculino', 'Sub 12 Masculino', 'Sub 14 Masculino', 'Sub 16 Masculino', 'Sub 18 Masculino', 'Sub 8 Feminino', 'Sub 10 Feminino', 'Sub 12 Feminino', 'Sub 14 Feminino', 'Sub 16 Feminino', 'Sub 18 Feminino', 'Sub 8 Masculino Equipes', 'Sub 10 Masculino Equipes', 'Sub 12 Masculino Equipes', 'Sub 14 Masculino Equipes', 'Sub 16 Masculino Equipes', 'Sub 18 Masculino Equipes', 'Sub 8 Feminino Equipes', 'Sub 10 Feminino Equipes', 'Sub 12 Feminino Equipes', 'Sub 14 Feminino Equipes', 'Sub 16 Feminino Equipes', 'Sub 18 Feminino Equipes');--> statement-breakpoint
CREATE TYPE "public"."place" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8');--> statement-breakpoint
CREATE TABLE "podiums" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"club_id" uuid NOT NULL,
	"player" text NOT NULL,
	"category" "category" NOT NULL,
	"place" "place" NOT NULL,
	"points" smallint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contacts" RENAME TO "clubs";--> statement-breakpoint
ALTER TABLE "clubs" DROP CONSTRAINT "contacts_user_id_users_sync_id_fk";
--> statement-breakpoint
ALTER TABLE "podiums" ADD CONSTRAINT "podiums_user_id_users_sync_id_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."users_sync"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "podiums" ADD CONSTRAINT "podiums_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_user_id_users_sync_id_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."users_sync"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clubs" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "clubs" DROP COLUMN "tel";--> statement-breakpoint
ALTER TABLE "clubs" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "clubs" DROP COLUMN "company";