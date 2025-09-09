CREATE TYPE "public"."day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"durationInMinutes" integer NOT NULL,
	"clerkUserId" text NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createAt" timestamp DEFAULT now() NOT NULL,
	"updateAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schedulesAvailabilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scheduleId" uuid NOT NULL,
	"startTime" text NOT NULL,
	"endTime" text NOT NULL,
	"dayOfWeek" "day" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"timezone" text NOT NULL,
	"clerkUserId" text NOT NULL,
	"createAt" timestamp DEFAULT now() NOT NULL,
	"updateAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "schedules_clerkUserId_unique" UNIQUE("clerkUserId")
);
--> statement-breakpoint
ALTER TABLE "schedulesAvailabilities" ADD CONSTRAINT "schedulesAvailabilities_scheduleId_schedules_id_fk" FOREIGN KEY ("scheduleId") REFERENCES "public"."schedules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "clerkUserIdIndex" ON "events" USING btree ("clerkUserId");--> statement-breakpoint
CREATE INDEX "scheduleIdIndex" ON "schedulesAvailabilities" USING btree ("scheduleId");