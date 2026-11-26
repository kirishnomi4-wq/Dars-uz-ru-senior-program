#!/bin/bash
# 25.11 — K1–K8 tuzatishlaridan keyingi navbat (bittadan, nice + taskset). Ildizdan: bash new-junior/arxiv/seans-2511/skriptlar/g25.sh [kutiladigan_pid]
cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
L=new-junior/arxiv/seans-2511/skriptlar/g25-natija.txt
if [ -n "$1" ]; then while kill -0 "$1" 2>/dev/null; do sleep 5; done; fi
: > $L
log() { echo "$@" | tee -a $L; }
sinov() { log "-- $1 $(date +%H:%M)"; $N timeout ${3:-1500} node $2 2>&1 | grep -E "✗|NATIJA|jami|Error|toza|BIR XIL|TOPILMADI|manbadagi gaplar|kombinatsiya|^[✓~] dushman" | tail -${4:-6} | cut -c1-260 | tee -a $L; }
log "== BOSHLANDI $(date +%H:%M)"
# 1) K1 — 17-dars ro'yxati (birlik sinovi + surat)
sinov "chek17" "new-junior/sinov/dvigatel/chek17.mjs --surat new-junior/arxiv/seans-2511/skriptlar/chek17-B5.png" 600 12
# 2) K4 — 27 kombinatsiya
sinov "karta27" "new-junior/sinov/dvigatel/karta27.mjs 3" 5400 30
# 3) tegilgan darslar: to'liq dars, solo, tovush (17, 18, 23, 15 — birinchi; keyin 12, 19–22, 13, 14, 16)
for n in 017 018 023 015 012 019 020 021 022 013 014 016; do
  for t in toliq-dars solo tovush; do f=new-junior/sinov/demo/$n-$t.mjs; [ -f $f ] && sinov "$n $t" $f 1500 4; done
done
# 4) simulyatorlar (kosmik.js, blockly.js o'zgardi)
for s in raketa kosmik2 xakaton klon tasodif xato; do f=new-junior/sinov/dvigatel/$s.mjs; [ -f $f ] && sinov "sim $s" $f 1500 3; done
# 5) setka (Chrome va WebKit) — joylashuvi o'zgargan darslar
for d in 012-ozgaruvchi-jon-vaqt 015-xakaton-1 017-kosmik-oyin-1 018-kosmik-oyin-2 020-takrorlash-va-test 021-shaxsiy-oyin-1 022-shaxsiy-oyin-2 023-demo-day-1; do
  log "-- setka $d"; $N timeout 600 node new-junior/sinov/dvigatel/setka.mjs $d 2>&1 | grep -E "toza|cqw|chiqdi|qatlam|sig|yopdi|qator|cho|rror" | head -4 | cut -c1-220 | tee -a $L
  $N timeout 600 node new-junior/sinov/dvigatel/setka.mjs $d --webkit 2>&1 | grep -v "Skipping\|labirintli" | head -4 | cut -c1-220 | tee -a $L
done
# 6) matn — matni o'zgargan darslar
for d in 017-kosmik-oyin-1 018-kosmik-oyin-2 023-demo-day-1; do log "-- matn $d"; $N timeout 600 node new-junior/sinov/dvigatel/matn.mjs $d 2>&1 | grep -E "TOPILMADI|manbadagi gaplar" | cut -c1-220 | tee -a $L; done
# 7) oltin sol 1–14 (kutilgan: solo ▶ uchburchagi; 12 B5 kapsula; 005/013/014 — oldingi kutilgan farqlar)
for d in $(ls new-junior/darslar | head -14); do log "-- oltin $d $(date +%H:%M)"; $N timeout 1800 node new-junior/sinov/dvigatel/oltin.mjs sol $d 2>&1 | grep -E "BIR XIL|✗|rror|namuna yo" | head -30 | cut -c1-200 | tee -a $L; done
log "TAMOM $(date +%H:%M)"
