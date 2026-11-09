#!/usr/bin/env bash
# Prod dars-api: FAQAT O'QISH. Hozir jonli sessiya / onlayn o'yinchi bormi + server versiyasi. Ism chiqmaydi.
set -uo pipefail
ENVF=/home/kali/Desktop/internetLesson/server/.env.deploy.prod
PASS=$(grep -E '^ADMIN_PASSWORD=' "$ENVF" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//')
U=$(grep -E '^ADMIN_USER=' "$ENVF" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//'); U=${U:-dars-admin}
echo "== $(date '+%H:%M:%S') =="
curl -sS https://dars-api.coddycamp.uz/api/v1/health | python3 -I -c 'import json,sys; h=json.load(sys.stdin); print("health:", {k:h.get(k) for k in ("status","version","migrations") if k in h})'
curl -sS -u "$U:$PASS" https://dars-api.coddycamp.uz/admin/api/overview | python3 -I -c '
import json,sys; o=json.load(sys.stdin)
print("active_sessions:", o.get("active_sessions"))
for k,v in o.items():
    if k!="active_sessions" and any(w in k.lower() for w in ("online","player","live","queue","navbat","result")): print(f"{k}:", v)
'
