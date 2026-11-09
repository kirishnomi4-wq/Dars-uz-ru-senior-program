#!/usr/bin/env bash
# F-1105-03 / F-1106-01 — prod dars-api'dan FAQAT O'QISH (GET). Hech narsa o'zgartirmaydi. Ism chiqmaydi.
# Natijalar: scratchpad/prod/*.json ; ekranga faqat yig'ma sonlar.
set -euo pipefail
SP="/tmp/claude-1000/-home-kali-Desktop-internetLesson/02d14e69-4954-426c-973b-efc711c68790/scratchpad"
OUT="$SP/prod"; mkdir -p "$OUT"
ENVF="/home/kali/Desktop/internetLesson/server/.env.deploy.prod"
PASS=$(grep -E '^ADMIN_PASSWORD=' "$ENVF" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//')
USER_=$(grep -E '^ADMIN_USER=' "$ENVF" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//')
USER_=${USER_:-dars-admin}
B="https://dars-api.coddycamp.uz/admin/api"
get() { curl -sS --fail-with-body -u "$USER_:$PASS" "$B/$1" -o "$OUT/$2"; }

curl -sS https://dars-api.coddycamp.uz/api/v1/health -o "$OUT/health.json"
get overview overview.json
get "results?status=manual_review" manual.json
get "results?status=retry_wait" retry.json
get "results?status=pending" pending.json
get results recent.json
get "sessions?status=ended&limit=200" sessions.json

# crm_id: oxirgi 40 ta tugagan live sessiyaning ishtirokchilari
python3 -I - "$OUT" <<'PY'
import json, sys, os
out = sys.argv[1]
S = json.load(open(f"{out}/sessions.json"))
live = [s for s in S if s["mode"] == "live"][:40]
open(f"{out}/sess_ids.txt", "w").write("\n".join(s["id"] for s in live))
PY
: > "$OUT/participants.jsonl"
while read -r sid; do
  [ -n "$sid" ] || continue
  curl -sS --fail-with-body -u "$USER_:$PASS" "$B/sessions/$sid" >> "$OUT/participants.jsonl"; echo >> "$OUT/participants.jsonl"
done < "$OUT/sess_ids.txt"

python3 -I - "$OUT" <<'PY'
import json, sys
from datetime import datetime
out = sys.argv[1]
L = lambda f: json.load(open(f"{out}/{f}"))
h = L("health.json"); o = L("overview.json")
print("versiya:", h.get("version"), "| result_details:", h.get("features", {}).get("result_details"), "| uptime_s:", h.get("uptime_s"))
print("navbat:", o.get("queue"))
m = L("manual.json")
print("manual_review:", len(m), "| eng yangisi:", max((r["updated_at"] for r in m), default="-"))
print("retry_wait:", len(L("retry.json")), "| pending:", len(L("pending.json")))
rec = L("recent.json")
codes = {}
for r in rec: codes[(r["status"], r["last_http_status"])] = codes.get((r["status"], r["last_http_status"]), 0) + 1
print("oxirgi 100 xabar:", codes, "| davr:", min(r["created_at"] for r in rec), "→", max(r["created_at"] for r in rec))
S = L("sessions.json")
print("sessiyalar (tugagan, 200 gacha):", len(S), "| davr:", min(s["started_at"] for s in S), "→", max(s["started_at"] for s in S))
er = {}
for s in S: er[(s["mode"], s["end_reason"])] = er.get((s["mode"], s["end_reason"]), 0) + 1
print("yopilish sababi:", er)
dur = []
for s in S:
    if s["mode"] == "live" and s.get("finished_at"):
        a = datetime.fromisoformat(s["started_at"].replace("Z", "+00:00")); b = datetime.fromisoformat(s["finished_at"].replace("Z", "+00:00"))
        dur.append(round((b - a).total_seconds() / 3600, 2))
dur.sort()
if dur: print("live davomiylik (soat): median", dur[len(dur)//2], "| eng uzun 5:", dur[-5:], "| 2 soatdan uzun:", sum(d > 2 for d in dur), "/", len(dur))
tot = filled = 0
for line in open(f"{out}/participants.jsonl"):
    line = line.strip()
    if not line: continue
    d = json.loads(line)
    for p in d.get("participants", []):
        if p["role"] != "student": continue
        tot += 1; filled += p.get("crm_id") is not None
print(f"crm_id (oxirgi 40 live sessiya o'quvchilari): {filled}/{tot} to'ldirilgan")
PY
echo "Tayyor: $OUT"
