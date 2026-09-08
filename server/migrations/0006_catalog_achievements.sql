-- 0006_catalog_achievements — darsdagi yutuq-ta'riflari katalogda (natija-detallari: achievements[].name/title,
-- TZ_LESSON_RESULT_DETAILS_RU §4). Manba: scripts/gen-lesson-catalog.mjs (darsning ACHIEVEMENTS bloki) → seed:catalog.
-- id — kichik harf (klient camelCase yuboradi, progress-service kichik harfga keltiradi; achievement_events cheki [a-z0-9_-]).
alter table lesson_catalog add column achievements jsonb not null default '[]'::jsonb;
