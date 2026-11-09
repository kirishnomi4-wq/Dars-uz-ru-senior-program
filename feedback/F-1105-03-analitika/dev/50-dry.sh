#!/usr/bin/env bash
# F-1105-03 / 16 §5 — 50 ta manual_review xabar: prod'dan OLISH (GET) + SINOV rejimida qayta yig'ish (dry: true).
# Hech narsa o'zgarmaydi: bazaga yozilmaydi, School API'ga yuborilmaydi. Ekranga faqat yig'ma sonlar, ism yo'q.
set -uo pipefail
SP=/tmp/claude-1000/-home-kali-Desktop-internetLesson/5771fc95-86e5-4346-9eed-844bdda0c66d/scratchpad/prod
mkdir -p "$SP/ev"
ENVF=/home/kali/Desktop/internetLesson/server/.env.deploy.prod
PASS=$(grep -E '^ADMIN_PASSWORD=' "$ENVF" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//')
U=$(grep -E '^ADMIN_USER=' "$ENVF" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//'); U=${U:-dars-admin}
B=https://dars-api.coddycamp.uz/admin/api
auth() { curl -sS --fail-with-body -u "$U:$PASS" "$@"; }

echo "== $(date '+%H:%M:%S') =="
curl -sS https://dars-api.coddycamp.uz/api/v1/health -o "$SP/health.json"
python3 -I -c 'import json,sys;h=json.load(open(sys.argv[1]));print("health:",h.get("version"),h.get("checks"))' "$SP/health.json"

auth "$B/results?status=manual_review" -o "$SP/manual.json" || { echo "manual_review ro'yxati olinmadi"; exit 1; }
python3 -I -c 'import json,sys;[print(r["event_id"]) for r in json.load(open(sys.argv[1]))]' "$SP/manual.json" > "$SP/manual_ids.txt"
n=0
while read -r id; do
  [ -n "$id" ] || continue
  auth "$B/results/$id" -o "$SP/ev/$id.json" || echo "olinmadi: $id"
  n=$((n+1))
done < "$SP/manual_ids.txt"
echo "manual_review hodisalar olindi: $n"

python3 -I -c 'import json,sys;ids=[l.strip() for l in open(sys.argv[1]) if l.strip()];print(json.dumps({"event_ids":ids,"dry":True,"include_payload":True}))' "$SP/manual_ids.txt" > "$SP/rebuild_req.json"
auth -H 'content-type: application/json' -X POST "$B/results/rebuild" --data @"$SP/rebuild_req.json" -o "$SP/dry.json" || { echo "rebuild dry xato — javob:"; head -c 600 "$SP/dry.json"; echo; exit 1; }
python3 -I - "$SP/dry.json" <<'PY'
import json, sys, collections
d = json.load(open(sys.argv[1]))
print("dry:", d.get("dry"), "| totals:", d.get("totals"))
print("actions:", dict(collections.Counter(r.get("action") for r in d.get("results", []))))
errs = [(r.get("event_id"), r.get("error")) for r in d.get("results", []) if r.get("action") == "error"]
print("errors:", errs[:10])
PY
echo "Tayyor → $SP/ev/ va $SP/dry.json"
