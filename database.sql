BEGIN;

-- =============================================
-- TABLES
-- =============================================

CREATE TABLE "public"."cl_config" (
	"id" text NOT NULL,
	"value" text,
	"type" text,
	"dtupdated" timestamp DEFAULT timezone('utc'::text, now()),
	PRIMARY KEY ("id")
);


-- =============================================
-- DATA
-- =============================================

INSERT INTO "public"."cl_config" ("id", "value", "type") VALUES
	('allow_tms', 'false', 'boolean'),
	('cdn', '//cdn.componentator.com', 'string'),
	('name', 'Pluginable', 'string'),
	('salt', SUBSTRING(MD5(RANDOM()::text), 0, 13), 'string');

COMMIT;