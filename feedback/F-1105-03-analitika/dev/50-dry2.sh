#!/usr/bin/env bash
# F-1105-03 / 20-hisobot — 50 ta manual_review xabar: prod'dan OLISH (GET) + SINOV rejimida qayta yig'ish (dry: true, F-1109-03 qoidalari)
# + jonli hodisalar uchun sessiya ishtirokchilari (reached_end, finish_reason — completed dalili). Hech narsa o'zgarmaydi. Ism yo'q.
set -uo pipefail
SP=/tmp/claude-1000/-home-kali-Desktop-internetLesson/5771fc95-86e5-4346-9eed-844bdda0c66d/scratchpad/prod
mkdir -p "$SP/ev" "$SP/sess"
ENVF=/home/kali/Desktop/internetLesson/server/.env.deploy.prod
PASS=$(grep -E '^ADMIN_PASSWORD=' "$ENVF" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//')
U=$(grep -E '^ADMIN_USER=' "$ENVF" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//'); U=${U:-dars-admin}
B=https://dars-api.coddycamp.uz/admin/api
auth() { curl -sS --fail-with-body -u "$U:$PASS" "$@"; }

echo "== $(date '+%H:%M:%S') =="
curl -sS https://dars-api.coddycamp.uz/api/v1/health -o "$SP/health.json"
python3 -I -c 'import json,sys;h=json.load(open(sys.argv[1]));print("health:",h.get("version"),"migr:",(h.get("checks") or {}).get("migrations"))' "$SP/health.json"
auth "$B/overview" | python3 -I -c 'import json,sys; o=json.load(sys.stdin); print("active:", o.get("active_sessions"), "| queue:", o.get("queue"))'

auth "$B/results?status=manual_review" -o "$SP/manual.json" || { echo "manual_review ro'yxati olinmadi"; exit 1; }
python3 -I -c 'import json,sys;[print(r["event_id"]) for r in json.load(open(sys.argv[1]))]' "$SP/manual.json" > "$SP/manual_ids.txt"
n=0; live=0
while read -r id; do
  [ -n "$id" ] || continue
  auth "$B/results/$id" -o "$SP/ev/$id.json" || { echo "olinmadi: $id"; continue; }
  n=$((n+1))
  sid=$(python3 -I -c 'import json,sys; r=json.load(open(sys.argv[1])); print(r.get("session_id") or "")' "$SP/ev/$id.json")
  if [ -n "$sid" ] && [ "$sid" != "None" ]; then
    auth "$B/sessions/$sid" -o "$SP/sess/$id.json" && live=$((live+1)) || echo "sessiya olinmadi: $id"
  fi
done < "$SP/manual_ids.txt"
echo "manual_review hodisalar olindi: $n · jonli sessiya tafsiloti: $live"

python3 -I -c 'import json,sys;ids=[l.strip() for l in open(sys.argv[1]) if l.strip()];print(json.dumps({"event_ids":ids,"dry":True,"include_payload":True}))' "$SP/manual_ids.txt" > "$SP/rebuild_req.json"
auth -H 'content-type: application/json' -X POST "$B/results/rebuild" --data @"$SP/rebuild_req.json" -o "$SP/dry2.json" || { echo "rebuild dry xato — javob:"; head -c 600 "$SP/dry2.json"; echo; exit 1; }
python3 -I - "$SP/dry2.json" <<'PY'
import json, sys, collections
d = json.load(open(sys.argv[1]))
print("dry:", d.get("dry"), "| totals:", d.get("totals"))
print("actions:", dict(collections.Counter(r.get("action") for r in d.get("results", []))))
tot = [(r.get("event_id"), r.get("total_before"), r.get("total_after")) for r in d.get("results", []) if r.get("total_before") != r.get("total_after")]
print("total o'zgargan hodisalar:", len(tot), tot[:8])
exb = sum(len(r.get("excluded_by") or []) for r in d.get("results", []))
print("excluded_by yozuvlari:", exb, "| namunа:", next((r.get("excluded_by")[0] for r in d.get("results", []) if r.get("excluded_by")), None))
errs = [(r.get("event_id"), r.get("error")) for r in d.get("results", []) if r.get("action") == "error"]
print("errors:", errs[:10])
PY
echo "Tayyor → $SP/ev/ · $SP/sess/ · $SP/dry2.json"
