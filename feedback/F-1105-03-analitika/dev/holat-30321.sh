#!/usr/bin/env bash
# Prod dars-api: FAQAT O'QISH. (1) navbat holati — 14:24 dan keyin yangi manual_review bormi; (2) sess_819195 (css-01-v17, 12.10)
# ishtirokchisi 30321: urinish holati, reached_end, finish_reason. Ism chiqmaydi (admin API ism bermaydi).
set -uo pipefail
ENVF=/home/kali/Desktop/internetLesson/server/.env.deploy.prod
PASS=$(grep -E '^ADMIN_PASSWORD=' "$ENVF" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//')
U=$(grep -E '^ADMIN_USER=' "$ENVF" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//'); U=${U:-dars-admin}
B=https://dars-api.coddycamp.uz
OUT=/tmp/claude-1000/-home-kali-Desktop-internetLesson/5771fc95-86e5-4346-9eed-844bdda0c66d/scratchpad/prod
echo "== $(date '+%H:%M:%S') =="
curl -sS "$B/api/v1/health" | python3 -I -c 'import json,sys; h=json.load(sys.stdin); print("health:", h.get("status"), h.get("version"), "migr:", (h.get("checks") or {}).get("migrations"))'
curl -sS -u "$U:$PASS" "$B/admin/api/overview" | python3 -I -c '
import json,sys; o=json.load(sys.stdin)
print("active_sessions:", o.get("active_sessions"))
for k,v in o.items():
    if k!="active_sessions" and any(w in k.lower() for w in ("online","player","queue","navbat","result")): print(f"{k}:", v)
'
echo "-- manual_review: 09.11 14:24 dan keyin yaratilgan/yangilangan bormi"
curl -sS -u "$U:$PASS" "$B/admin/api/results?status=manual_review&limit=200" > "$OUT/mr_now.json"
python3 -I -c '
import json,sys; l=json.load(open(sys.argv[1])); l=l if isinstance(l,list) else (l.get("results") or l.get("items") or [])
print("manual_review jami:", len(l))
new=[e for e in l if (e.get("created_at") or "")>"2026-11-09T09:24" or (e.get("updated_at") or "")>"2026-11-09T09:24"]
for e in new: print("  YANGI/YANGILANGAN:", e.get("event_id"), e.get("created_at"), e.get("updated_at"), e.get("last_http_status"), (e.get("last_error") or "")[:140])
if not new: print("  14:24 (UTC 09:24) dan keyin yangi yo‘q")
' "$OUT/mr_now.json"
echo "-- sess_819195_20261012T103453Z → sessiya → 30321"
curl -sS -u "$U:$PASS" "$B/admin/api/results/sess_819195_20261012T103453Z" > "$OUT/ev_819195_row.json"
SID=$(python3 -I -c 'import json,sys; r=json.load(open(sys.argv[1])); r=r.get("event") or r.get("row") or r; print(r.get("session_id") or "")' "$OUT/ev_819195_row.json")
echo "session_id: ${SID:-TOPILMADI}"
if [ -n "$SID" ]; then
  curl -sS -u "$U:$PASS" "$B/admin/api/sessions/$SID" > "$OUT/sess_819195.json"
  python3 -I -c '
import json,sys; d=json.load(open(sys.argv[1])); s=d.get("session",{})
print("sessiya:", {k:s.get(k) for k in ("pin","mode","lesson_id","lesson_version","status","end_reason","started_at","finished_at","max_screen","cur_screen")})
ps=[p for p in d.get("participants",[]) if p.get("role")=="student"]
print("o‘quvchilar:", len(ps), "| reached_end=true:", sum(1 for p in ps if p.get("reached_end")), "| attempt bor:", sum(1 for p in ps if p.get("attempt_id")))
for p in ps:
    if str(p.get("subject_id"))=="30321":
        print("30321:", {k:p.get(k) for k in ("subject_id","joined_at","attempt_id","attempt_status","finish_reason","reached_end","answers","correct","attempts","achievements")})
print("natija-hodisalar:", [(e.get("event_id"), e.get("status"), e.get("last_http_status")) for e in d.get("results",[])])
' "$OUT/sess_819195.json"
fi
