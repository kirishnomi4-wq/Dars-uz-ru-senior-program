#!/usr/bin/env bash
# F-1109-02 — 09.11 14:24 dan keyin 422 bo'lgan YANGI hodisalar (50 talik tarixiy ro'yxatga kirmaydi).
#   bash yangi-19.sh        → SINOV (dry: true): hech narsa o'zgarmaydi, faqat yig'ma
#   bash yangi-19.sh real   → HAQIQIY (dry: false): qayta yig'iladi va School API'ga yuboriladi (event_id o'sha, suffix yo'q)
set -uo pipefail
MODE=${1:-dry}
SP=/tmp/claude-1000/-home-kali-Desktop-internetLesson/5771fc95-86e5-4346-9eed-844bdda0c66d/scratchpad/prod
ENVF=/home/kali/Desktop/internetLesson/server/.env.deploy.prod
PASS=$(grep -E '^ADMIN_PASSWORD=' "$ENVF" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//')
U=$(grep -E '^ADMIN_USER=' "$ENVF" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//'); U=${U:-dars-admin}
B=https://dars-api.coddycamp.uz
auth() { curl -sS --fail-with-body -u "$U:$PASS" "$@"; }
echo "== $(date '+%H:%M:%S') · rejim: $MODE =="
curl -sS "$B/api/v1/health" | python3 -I -c 'import json,sys; h=json.load(sys.stdin); print("prod:", h.get("version"), "migr:", (h.get("checks") or {}).get("migrations"))'
auth "$B/admin/api/overview" | python3 -I -c 'import json,sys; o=json.load(sys.stdin); print("active:", o.get("active_sessions"), "| queue:", o.get("queue"))'
auth "$B/admin/api/results?status=manual_review" -o "$SP/mr_now.json" || { echo "ro'yxat olinmadi"; exit 1; }
python3 -I -c '
import json,sys; l=json.load(open(sys.argv[1]))
ids=[e["event_id"] for e in l if (e.get("created_at") or "")>"2026-11-09T09:24"]
open(sys.argv[2],"w").write("\n".join(ids)+"\n")
print("09.11 09:24Z dan keyingi manual_review:", len(ids), "| jonli:", sum(1 for i in ids if i.startswith("sess_")), "| uyda:", sum(1 for i in ids if i.startswith("solo_")))
' "$SP/mr_now.json" "$SP/yangi_ids.txt"
[ -s "$SP/yangi_ids.txt" ] || { echo "yangi hodisa yo'q"; exit 0; }
DRY=true; [ "$MODE" = "real" ] && DRY=false
python3 -I -c 'import json,sys;ids=[l.strip() for l in open(sys.argv[1]) if l.strip()];print(json.dumps({"event_ids":ids,"dry":sys.argv[2]=="true","include_payload":False}))' "$SP/yangi_ids.txt" "$DRY" > "$SP/yangi_req.json"
auth -H 'content-type: application/json' -X POST "$B/admin/api/results/rebuild" --data @"$SP/yangi_req.json" -o "$SP/yangi_$MODE.json" || { echo "rebuild xato — javob:"; head -c 600 "$SP/yangi_$MODE.json"; echo; exit 1; }
python3 -I - "$SP/yangi_$MODE.json" <<'PY'
import json, sys, collections
d = json.load(open(sys.argv[1]))
print("dry:", d.get("dry"), "| totals:", d.get("totals"))
print("actions:", dict(collections.Counter(r.get("action") for r in d.get("results", []))))
for r in d.get("results", []):
    dd = r.get("details_dropped") or ""
    print(" ", r.get("event_id")[:52].ljust(52), r.get("action"), "| stud", r.get("students_before"), "→", r.get("students_after"),
          "| chiqarilgan", len(r.get("excluded") or []), "| correct o'zg.", len(r.get("correct_changes") or []),
          "| tafsilot tushdi:", (str(dd.count("answered≠")) + " o'quvchi") if dd else "yo'q", "|", r.get("error") or "")
PY
if [ "$MODE" = "real" ]; then
  echo "-- 20 soniyadan keyin navbat holati:"; sleep 20
  auth "$B/admin/api/overview" | python3 -I -c 'import json,sys; o=json.load(sys.stdin); print("queue:", o.get("queue"))'
fi
echo "Tayyor → $SP/yangi_$MODE.json"
