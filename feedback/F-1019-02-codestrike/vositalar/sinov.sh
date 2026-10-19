#!/bin/bash
# Ro'yxatni fayl NUSXALARIGA qo'llab, lint-tell va lint:til ni asl fayl bilan solishtiradi: bash sinov.sh <N>
N=$1; S=$(cd "$(dirname "$0")" && pwd); R=/home/kali/Desktop/internetLesson; T=$S/sinov-m$N
rm -rf $T; mkdir -p $T
python3 -c "
import json,os,shutil
for f in sorted({x["file"] for x in json.load(open("$S/../royxat/fix-m$N.json"))}):
    d='$T/'+f; os.makedirs(os.path.dirname(d),exist_ok=True); shutil.copy2('$R/'+f,d); print(f)" > $T/fayllar.txt
QR=$T node $S/qolla.mjs $N | grep -v "^✓"
yomon=0
while read -r f || [ -n "$f" ]; do
  t0=$(node $R/lint-tell.mjs $R/$f 2>&1 | tail -1 | grep -o "[0-9]* error" | grep -o "[0-9]*"); t1=$(node $R/lint-tell.mjs $T/$f 2>&1 | tail -1 | grep -o "[0-9]* error" | grep -o "[0-9]*")
  l0=$(cd $R && npm run lint:til -- $R/$f 2>&1 | grep -o "error: [0-9]*" | head -1 | grep -o "[0-9]*"); l1=$(cd $R && npm run lint:til -- $T/$f 2>&1 | grep -o "error: [0-9]*" | head -1 | grep -o "[0-9]*")
  if [ "${t1:-0}" -gt "${t0:-0}" ]; then yomon=1; echo "TELL ko'paydi $f ${t0:-0}→${t1:-0}:"; node $R/lint-tell.mjs $T/$f 2>&1 | grep "❌" | sed "s|$T/||"; fi
  if [ "${l1:-0}" -gt "${l0:-0}" ]; then yomon=1; echo "TIL ko'paydi $f ${l0:-0}→${l1:-0}:"; (cd $R && npm run lint:til -- $T/$f 2>&1 | grep "🔴" | tail -n +2 | head -5); fi
done < $T/fayllar.txt
[ $yomon = 0 ] && echo "sinov toza (tell va til ko'paymadi)"
