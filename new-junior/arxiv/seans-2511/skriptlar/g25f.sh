#!/bin/bash
# 26.11 01:3x — g25e ning DAVOMI (26.11 00:34 da noutbuk zaryadi tugab o'chdi — «sim tasodif» o'rtasida). g25e da o'tgani: javon-qirq 0, qa25 13/13,
# 017 solo/tovush, 018–023 toliq/solo/tovush yashil (021 toliq/solo — sinov xatosi `$`→`$$`, tuzatilgan nusxa 30/30 · 33/33), simulyatorlar katak…jon yashil.
# Bu yerda — qolgani: simulyatorlar tasodif…karta27 · matn · setka Chrome + WebKit · oltin sol 1–14. Natija: g25f-natija.txt
cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
L=new-junior/arxiv/seans-2511/skriptlar/g25f-natija.txt; : > $L
log() { echo "$@" | tee -a $L; }
log "== BOSHLANDI $(date +%H:%M)"
log "== SIMULYATOR $(date +%H:%M)"
for s in tasodif xato klon xakaton kosmik2 raketa chek17 karta27; do f=new-junior/sinov/dvigatel/$s.mjs; [ -f $f ] || continue; log "-- sim $s"; $N timeout 1800 node $f 2>&1 | grep -E "✗|NATIJA|jami|toza|^[0-9]+ / [0-9]+$|Error" | tail -4 | cut -c1-220 | tee -a $L; done
log "== MATN $(date +%H:%M)"
for d in $(ls new-junior/darslar); do log "-- matn $d"; $N timeout 600 node new-junior/sinov/dvigatel/matn.mjs $d 2>&1 | grep -E "TOPILMADI|manbadagi gaplar" | head -6 | cut -c1-200 | tee -a $L; done
log "== SETKA $(date +%H:%M)"
for d in $(ls new-junior/darslar); do log "-- setka $d"; $N timeout 600 node new-junior/sinov/dvigatel/setka.mjs $d 2>&1 | grep -E "toza|cqw|chiqdi|qatlam|sig|yopdi|qator|cho|rror" | head -4 | cut -c1-200 | tee -a $L; $N timeout 600 node new-junior/sinov/dvigatel/setka.mjs $d --webkit 2>&1 | grep -v "Skipping" | tail -3 | cut -c1-200 | tee -a $L; done
log "== OLTIN SOL 1–14 $(date +%H:%M) (farq kutiladi: ▶, C-blok, javon .sigmas, TUGADI_YOZUV, tug-xira — har birini ko'rib, keyin «yoz»)"
for d in $(ls new-junior/darslar | head -14); do log "-- oltin $d $(date +%H:%M)"; $N timeout 1800 node new-junior/sinov/dvigatel/oltin.mjs sol $d 2>&1 | grep -E "BIR XIL|✗|rror|namuna yo" | head -60 | cut -c1-200 | tee -a $L; done
log "TAMOM $(date +%H:%M)"
