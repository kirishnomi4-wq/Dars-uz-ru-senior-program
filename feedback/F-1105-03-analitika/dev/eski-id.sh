#!/usr/bin/env bash
# LMS_REESTR.json dagi 172 dars fayli uchun LESSON_META.lessonId tarixi git'dan → eski-id.csv (lesson_id_hozir,eski_id,commit,sana)
set -uo pipefail
SP=$(dirname "$0")
cd /home/kali/Desktop/internetLesson
node -e 'const r=require("./LMS_REESTR.json"); for (const [id,d] of Object.entries(r.darslar)) console.log(id+"\t"+d.src);' > "$SP/fayllar.tsv"
: > "$SP/eski-id-raw.csv"
while IFS=$'\t' read -r id src; do
  git log --follow --format='%h %ad' --date=short -G"lessonId: '" -- "$src" 2>/dev/null | while read -r h d; do
    old=$(git show "$h:$src" 2>/dev/null | grep -o "lessonId: '[^']*'" | head -1 | sed "s/lessonId: '//; s/'//")
    [ -n "$old" ] && echo "$id,$old,$h,$d" >> "$SP/eski-id-raw.csv"
  done
done < "$SP/fayllar.tsv"
awk -F, '$1!=$2 && !seen[$1","$2]++' "$SP/eski-id-raw.csv" > "$SP/eski-id.csv"
echo "fayllar: $(wc -l < "$SP/fayllar.tsv") · tarixiy juftliklar: $(wc -l < "$SP/eski-id.csv")"
cat "$SP/eski-id.csv"
