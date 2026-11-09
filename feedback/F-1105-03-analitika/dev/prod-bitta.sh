#!/usr/bin/env bash
# Bitta hodisani prod admin API'dan olish (faqat GET). Ekranga chiqarmaydi — faylga yozadi.
set -euo pipefail
SP="/tmp/claude-1000/-home-kali-Desktop-internetLesson/02d14e69-4954-426c-973b-efc711c68790/scratchpad"
ENVF="/home/kali/Desktop/internetLesson/server/.env.deploy.prod"
PASS=$(grep -E '^ADMIN_PASSWORD=' "$ENVF" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//')
USER_=$(grep -E '^ADMIN_USER=' "$ENVF" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//'); USER_=${USER_:-dars-admin}
ID="${1:-solo_29085_pm-m3d14-v1_20261031T061309Z}"
curl -sS --fail-with-body -u "$USER_:$PASS" "https://dars-api.coddycamp.uz/admin/api/results/$ID" -o "$SP/prod/ev_$ID.json"
echo "Saqlandi: $SP/prod/ev_$ID.json ($(wc -c < "$SP/prod/ev_$ID.json") bayt)"
