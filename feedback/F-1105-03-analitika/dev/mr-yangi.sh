#!/usr/bin/env bash
# Prod dars-api: FAQAT O'QISH. manual_review ro'yxati (oxirgi 100, updated_at bo'yicha) — 09.11 14:24 (UTC 09:24) dan keyingilar.
set -uo pipefail
ENVF=/home/kali/Desktop/internetLesson/server/.env.deploy.prod
PASS=$(grep -E '^ADMIN_PASSWORD=' "$ENVF" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//')
U=$(grep -E '^ADMIN_USER=' "$ENVF" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//'); U=${U:-dars-admin}
B=https://dars-api.coddycamp.uz
OUT=/tmp/claude-1000/-home-kali-Desktop-internetLesson/5771fc95-86e5-4346-9eed-844bdda0c66d/scratchpad/prod
echo "== $(date '+%H:%M:%S') =="
curl -sS -u "$U:$PASS" "$B/admin/api/results?status=manual_review" > "$OUT/mr_now.json"
python3 -I -c '
import json,sys; l=json.load(open(sys.argv[1]))
if not isinstance(l,list): print("JAVOB RO‘YXAT EMAS:", str(l)[:300]); sys.exit(0)
print("manual_review (oxirgi 100):", len(l))
new=[e for e in l if (e.get("created_at") or "")>"2026-11-09T09:24"]
print("09.11 09:24Z dan keyin YARATILGAN:", len(new))
for e in sorted(new, key=lambda e: e.get("created_at") or ""):
    print(" ", e.get("created_at","")[:19], e.get("mode"), e.get("lesson_id"), "stud", e.get("students_count"), "http", e.get("last_http_status"), "|", (e.get("last_error") or "")[:160])
upd=[e for e in l if (e.get("created_at") or "")<="2026-11-09T09:24" and (e.get("updated_at") or "")>"2026-11-09T09:24"]
print("eski, lekin 09:24Z dan keyin yangilangan:", len(upd))
' "$OUT/mr_now.json"
