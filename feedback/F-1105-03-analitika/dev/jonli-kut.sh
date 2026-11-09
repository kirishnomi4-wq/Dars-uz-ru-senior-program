#!/usr/bin/env bash
# Prod'da jonli sessiya 0 bo'lguncha kutadi (faqat GET overview, har 2 daqiqada bir qator). Ketma-ket 2 marta 0 → «▶ BOSISH MUMKIN» deb chiqadi.
# To'xtatish: Ctrl+C.
ENVF=/home/kali/Desktop/internetLesson/server/.env.deploy.prod
PASS=$(grep -E '^ADMIN_PASSWORD=' "$ENVF" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//')
U=$(grep -E '^ADMIN_USER=' "$ENVF" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//'); U=${U:-dars-admin}
z=0
while true; do
  line=$(curl -sS --max-time 15 -u "$U:$PASS" https://dars-api.coddycamp.uz/admin/api/overview 2>/dev/null | python3 -I -c 'import json,sys; o=json.load(sys.stdin); a=o["active_sessions"]; print(a["live"], "| online", a.get("players_online"), "| manual_review", (o.get("queue") or {}).get("manual_review"))' 2>/dev/null || echo "? | so'rov xato")
  n=${line%% *}
  echo "$(date +%H:%M:%S) jonli=$line"
  if [ "$n" = 0 ]; then z=$((z+1)); else z=0; fi
  [ $z -ge 2 ] && { echo "$(date +%H:%M:%S) ▶ BOSISH MUMKIN (jonli 2 marta ketma-ket 0)"; exit 0; }
  sleep 120
done
