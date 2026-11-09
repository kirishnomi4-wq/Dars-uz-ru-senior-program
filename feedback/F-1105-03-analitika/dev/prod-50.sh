#!/usr/bin/env bash
# manual_review dagi HAMMA hodisani prod admin API'dan olish (faqat GET). Ekranga faqat son chiqadi.
set -euo pipefail
SP="/tmp/claude-1000/-home-kali-Desktop-internetLesson/02d14e69-4954-426c-973b-efc711c68790/scratchpad"
python3 -I -c 'import json,sys; [print(r["event_id"]) for r in json.load(open(sys.argv[1]))]' "$SP/prod/manual.json" > "$SP/prod/manual_ids.txt"
n=0
while read -r id; do
  [ -n "$id" ] || continue
  [ -s "$SP/prod/ev_$id.json" ] || bash "$SP/prod-bitta.sh" "$id" > /dev/null
  n=$((n+1))
done < "$SP/prod/manual_ids.txt"
echo "Olindi: $n ta hodisa → $SP/prod/ev_*.json"
