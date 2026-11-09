#!/usr/bin/env bash
# F-1109-01 — prod'da YETKAZILGAN oxirgi hodisalarda tafsilot (questions[]) nechta o'quvchida bor/yo'q. FAQAT GET. Ism yo'q.
set -uo pipefail
SP=/tmp/claude-1000/-home-kali-Desktop-internetLesson/5771fc95-86e5-4346-9eed-844bdda0c66d/scratchpad/prod
mkdir -p "$SP/dl"
ENVF=/home/kali/Desktop/internetLesson/server/.env.deploy.prod
PASS=$(grep -E '^ADMIN_PASSWORD=' "$ENVF" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//')
U=$(grep -E '^ADMIN_USER=' "$ENVF" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//'); U=${U:-dars-admin}
B=https://dars-api.coddycamp.uz/admin/api
auth() { curl -sS --fail-with-body -u "$U:$PASS" "$@"; }
echo "== $(date '+%H:%M:%S') =="
auth "$B/results?status=delivered" -o "$SP/delivered.json" || { echo "ro'yxat olinmadi"; exit 1; }
python3 -I -c 'import json,sys;[print(r["event_id"]) for r in json.load(open(sys.argv[1]))]' "$SP/delivered.json" > "$SP/delivered_ids.txt"
n=0; while read -r id; do [ -n "$id" ] || continue; [ -s "$SP/dl/$id.json" ] || auth "$B/results/$id" -o "$SP/dl/$id.json" || echo "olinmadi: $id"; n=$((n+1)); done < "$SP/delivered_ids.txt"
echo "yetkazilgan hodisa olindi: $n (oxirgi 100)"
python3 -I - "$SP" <<'PY'
import json, sys, os, collections
sp = sys.argv[1]; agg = collections.defaultdict(lambda: collections.Counter()); byLesson = collections.defaultdict(lambda: collections.Counter())
for f in os.listdir(f"{sp}/dl"):
    e = json.load(open(f"{sp}/dl/{f}")); p = e.get("payload") or {}; mode = p.get("mode") or e.get("mode"); lid = p.get("lesson_id")
    for s in p.get("students", []):
        a = agg[mode]; a["students"] += 1
        ans = s.get("answered") or 0; qs = [q for q in (s.get("questions") or []) if q.get("kind") == "test"]
        if ans > 0:
            a["answered>0"] += 1
            if qs: a["tafsilot bor"] += 1
            else: a["tafsilot YO'Q"] += 1; byLesson[lid]["yo'q"] += 1
            if s.get("completed"): a["completed"] += 1; a["completed+tafsilot" if qs else "completed, tafsilot YO'Q"] += 1
        if qs: byLesson[lid]["bor"] += 1
print("davr:", min(e.get("created_at","") for e in (json.load(open(f"{sp}/dl/{f}")) for f in os.listdir(f"{sp}/dl")))[:16], "→", max(e.get("created_at","") for e in (json.load(open(f"{sp}/dl/{f}")) for f in os.listdir(f"{sp}/dl")))[:16])
for m, a in agg.items(): print(m, dict(a))
print("--- dars bo'yicha (tafsilot bor / yo'q, answered>0 ichida), eng ko'p yo'q 12 ta ---")
for lid, c in sorted(byLesson.items(), key=lambda kv: -kv[1]["yo'q"])[:12]: print(f"  {lid}: bor {c['bor']} / yo'q {c['yo\'q']}")
PY
