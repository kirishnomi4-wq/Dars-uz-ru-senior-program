#!/bin/bash
# Mentor darslarini bo'laklardan yig'ish (F-1029-02). OUT=<papka> bo'lsa o'sha joyga.
cd /home/kali/Desktop/internetLesson/src/mentor-kurs
O=${OUT:-.}
declare -A M=([pg1]=PgIntroMentorLesson [pg2]=PgCrudMentorLesson [jest1]=JestUnitMentorLesson [jest2]=JestEdgeMentorLesson [cicd1]=CiCdIntroMentorLesson [cicd2]=GithubActionsMentorLesson [tgpg]=TgPgMentorLesson [ws1]=WsBasicsMentorLesson [ws2]=WsReconnectMentorLesson [wh]=WebhookMentorLesson [nest2]=NestRepoMentorLesson)
for d in "${!M[@]}"; do cat parts/01-asos.jsx parts/02-dvigatel.jsx $d/parts/*.jsx > $O/${M[$d]}.jsx; done
cat parts/*.jsx > $O/NestArchMentorLesson.jsx
