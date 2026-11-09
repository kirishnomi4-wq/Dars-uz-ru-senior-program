#!/usr/bin/env bash
# Prod'da jonli sessiya 0 bo'lguncha kutadi (faqat GET overview). Ketma-ket 2 marta 0 → chiqadi.
ENVF=/home/kali/Desktop/internetLesson/server/.env.deploy.prod
PASS=$(grep -E '^ADMIN_PASSWORD=' "$ENVF" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//')
U=$(grep -E '^ADMIN_USER=' "$ENVF" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//'); U=${U:-dars-admin}
z=0
while true; do
  n=$(curl -sS -u "$U:$PASS" https://dars-api.coddycamp.uz/admin/api/overview 2>/dev/null | python3 -I -c 'import json,sys; print(json.load(sys.stdin)["active_sessions"]["live"])' 2>/dev/null || echo "?")
  if [ "$n" = 0 ]; then z=$((z+1)); else z=0; fi
  [ $z -ge 2 ] && { echo "$(date +%H:%M) jonli=0"; exit 0; }
  sleep 120
done
