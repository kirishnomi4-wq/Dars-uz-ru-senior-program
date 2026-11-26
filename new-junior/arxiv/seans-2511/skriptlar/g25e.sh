#!/bin/bash
# 26.11 — g25d ning DAVOMI (25.11 20:40 da noutbuk o'chirilishi uchun to'xtatildi). g25d da o'tgani: qa25 13/13, javon-qirq (eski — 4 topilma,
# keyin tuzatildi), qutiden 0, ustma 0, 001–016 toliq/solo/tovush hammasi yashil, 017 toliq 45/45. Bu yerda — qolgani. Natija: g25e-natija.txt
# Oldin: lokal server (5340) yoniq va demolar yig'ilgan bo'lishi kerak (HOLAT.md «YANGI SEANS SHU YERDAN»).
cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
L=new-junior/arxiv/seans-2511/skriptlar/g25e-natija.txt; : > $L
log() { echo "$@" | tee -a $L; }
H="001 002 003 004 005 006 007 008 009 010 011 012 013 014 015 016 017 018 019 020 021 022 023"
log "== BOSHLANDI $(date +%H:%M)"
log "-- javon-qirq (kuchaytirilgan: qirqilish + ustma-ust + toshish) $(date +%H:%M)"; $N timeout 7200 node new-junior/sinov/dvigatel/javon-qirq.mjs $H 2>&1 | grep -E "TOPILMA|✗" | head -30 | cut -c1-200 | tee -a $L
log "-- qa25"; $N timeout 900 node new-junior/sinov/dvigatel/qa25.mjs 2>&1 | grep -E "✗|NATIJA" | cut -c1-220 | tee -a $L
log "== DARSLAR $(date +%H:%M)"
log "-- 017 solo"; $N timeout 1500 node new-junior/sinov/demo/017-solo.mjs 2>&1 | grep -E "✗|NATIJA|Error" | tail -4 | cut -c1-220 | tee -a $L
log "-- 017 tovush"; $N timeout 1500 node new-junior/sinov/demo/017-tovush.mjs 2>&1 | grep -E "✗|NATIJA|Error" | tail -4 | cut -c1-220 | tee -a $L
for n in 018 019 020 021 022 023; do for t in toliq-dars solo tovush; do f=new-junior/sinov/demo/$n-$t.mjs; [ -f $f ] && { log "-- $n $t $(date +%H:%M)"; $N timeout 1500 node $f 2>&1 | grep -E "✗|NATIJA|Error" | tail -4 | cut -c1-220 | tee -a $L; }; done; done
log "== SIMULYATOR $(date +%H:%M)"
for s in katak maydon hodisa takror amaliyot kostyum shart labirint labirint2 ozgaruvchi jon tasodif xato klon xakaton kosmik2 raketa chek17 karta27; do f=new-junior/sinov/dvigatel/$s.mjs; [ -f $f ] || continue; log "-- sim $s"; $N timeout 1800 node $f 2>&1 | grep -E "✗|NATIJA|jami|toza|^[0-9]+ / [0-9]+$|Error" | tail -4 | cut -c1-220 | tee -a $L; done
log "== MATN $(date +%H:%M)"
for d in $(ls new-junior/darslar); do log "-- matn $d"; $N timeout 600 node new-junior/sinov/dvigatel/matn.mjs $d 2>&1 | grep -E "TOPILMADI|manbadagi gaplar" | head -6 | cut -c1-200 | tee -a $L; done
log "== SETKA $(date +%H:%M)"
for d in $(ls new-junior/darslar); do log "-- setka $d"; $N timeout 600 node new-junior/sinov/dvigatel/setka.mjs $d 2>&1 | grep -E "toza|cqw|chiqdi|qatlam|sig|yopdi|qator|cho|rror" | head -4 | cut -c1-200 | tee -a $L; $N timeout 600 node new-junior/sinov/dvigatel/setka.mjs $d --webkit 2>&1 | grep -v "Skipping" | tail -3 | cut -c1-200 | tee -a $L; done
log "== OLTIN SOL 1–14 $(date +%H:%M) (farq kutiladi: ▶, C-blok, javon .sigmas, TUGADI_YOZUV, tug-xira — har birini ko'rib, keyin «yoz»)"
for d in $(ls new-junior/darslar | head -14); do log "-- oltin $d $(date +%H:%M)"; $N timeout 1800 node new-junior/sinov/dvigatel/oltin.mjs sol $d 2>&1 | grep -E "BIR XIL|✗|rror|namuna yo" | head -60 | cut -c1-200 | tee -a $L; done
log "TAMOM $(date +%H:%M)"
