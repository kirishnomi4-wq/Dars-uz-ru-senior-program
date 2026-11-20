#!/bin/bash
# Mentor darslarini bo'laklardan yig'ish (F-1029-02). OUT=<papka> bo'lsa o'sha joyga.
cd /home/kali/Desktop/internetLesson/src/mentor-kurs
O=${OUT:-.}
declare -A M=([pg1]=PgIntroMentorLesson [pg2]=PgCrudMentorLesson [jest1]=JestUnitMentorLesson [jest2]=JestEdgeMentorLesson [cicd1]=CiCdIntroMentorLesson [cicd2]=GithubActionsMentorLesson [tgpg]=TgPgMentorLesson [ws1]=WsBasicsMentorLesson [ws2]=WsReconnectMentorLesson [wh]=WebhookMentorLesson [nest2]=NestRepoMentorLesson)
# F-1120-02: parts/02b-rasm.jsx (dars rasmi, umumiy) — hammaga; parts/02c-nest.jsx (Nest mashinasi) — Nest darslariga
# parts/02d-pg.jsx (blog bazasi rasmi) — PostgreSQL darslariga; parts/02e-bot.jsx («Buyurtma boti» xaritasi) — OrderBot ipidagi 8 darsga
for d in "${!M[@]}"; do NEST=""; [ "$d" = nest2 ] && NEST=parts/02c-nest.jsx; case "$d" in pg1|pg2) NEST=parts/02d-pg.jsx;; tgpg|jest1|jest2|cicd1|cicd2|ws1|ws2|wh) NEST=parts/02e-bot.jsx;; esac; cat parts/01-asos.jsx parts/02-dvigatel.jsx parts/02b-rasm.jsx $NEST $d/parts/*.jsx > $O/${M[$d]}.jsx; done
# Nest-1 = parts/ dagi hammasi, PostgreSQL va Buyurtma boti rasmlaridan tashqari
cat $(ls parts/*.jsx | grep -v '02d-pg\|02e-bot') > $O/NestArchMentorLesson.jsx
