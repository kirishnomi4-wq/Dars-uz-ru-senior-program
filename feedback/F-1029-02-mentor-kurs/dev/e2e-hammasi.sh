#!/bin/bash
# e2e ovozli o'tish — 12 mentor darsi ketma-ket (serverlar: tts :5332, dev :5333). 02.11, F-1029-02.
# ISHLATISH: OUT=<papka> bash dev/e2e-hammasi.sh [W H]   (standart 1280 720; 1920 1080 ham)
# Natija: OUT/natija.tsv (dars · holat · oxirgi ekran · onFinished · xatolar · vaqt), har dars logi OUT/<dars>.log
cd /home/kali/Desktop/internetLesson/feedback/F-1029-02-mentor-kurs
O=${OUT:-/tmp/e2e-mentor}; mkdir -p "$O"; W=${1:-1280}; H=${2:-720}
echo -e "dars\tholat\tlog\tonFinished\txatolar\tvaqt" > "$O/natija.tsv"
for d in pg-02 jest-01 jest-02 cicd-01 cicd-02 tgpg-01 ws1-01 ws2-01 wh-01 nest-02 nest-01 pg-01; do
  t0=$(date +%s)
  out=$(DARS=$d timeout 1500 node dev/e2e-ovozli-otish.mjs $W $H 2>&1); rc=$?
  echo "$out" > "$O/$d.log"
  log=$(echo "$out" | grep -m1 '^\[{' | tr -d '\n')
  fin=$(echo "$out" | grep -m1 '^onFinished:' | sed 's/^onFinished: //')
  err=$(echo "$out" | grep -m1 '^xatolar:' | sed 's/^xatolar: //')
  last=$(echo "$log" | grep -o '"ekran":[0-9]*' | tail -1 | cut -d: -f2)
  qotdi=$(echo "$log" | grep -c QOTDI)
  if [ $rc -eq 0 ] && echo "$fin" | grep -q '"passed":true' && [ "$qotdi" = "0" ] && [ "$err" = "[]" ]; then h=passed; else h="FAIL(rc=$rc)"; fi
  echo -e "$d\t$h\t$last\t$fin\t$err\t$(( $(date +%s) - t0 ))s" >> "$O/natija.tsv"
done
echo TUGADI >> "$O/natija.tsv"
