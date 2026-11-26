#!/bin/bash
# 25.11 kech — QA tuzatishlaridan keyingi tekshiruv (bittadan). Natija: g25c-natija.txt
cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
L=new-junior/arxiv/seans-2511/skriptlar/g25c-natija.txt; : > $L
log() { echo "$@" | tee -a $L; }
log "== BOSHLANDI $(date +%H:%M)"
H="001 002 003 004 005 006 007 008 009 010 011 012 013 014 015 016 017 018 019 020 021 022 023"
# 1) javon: har oila, matn qirqilmaydi (F-1125-09)
log "-- javon-qirq"; $N timeout 7200 node new-junior/sinov/dvigatel/javon-qirq.mjs $H 2>&1 | grep -E "TOPILMA|✗" | head -40 | cut -c1-200 | tee -a $L
# 2) kartadan chiqish / hn tashqarisi (F-1125-06, 16, 19) — 1440 px (cqw — en ahamiyatsiz)
log "-- qutiden $(date +%H:%M)"; $N timeout 7200 node new-junior/sinov/dvigatel/qutiden.mjs $H --en 1440 2>&1 | grep -E "TOPILMA|✗" | head -80 | cut -c1-220 | tee -a $L
# 3) tegilgan darslar: to'liq dars, solo
for n in 004 011 017 018 019 021 010 015; do for t in toliq-dars solo; do f=new-junior/sinov/demo/$n-$t.mjs; [ -f $f ] && { log "-- $n $t $(date +%H:%M)"; $N timeout 1500 node $f 2>&1 | grep -E "✗|NATIJA" | tail -4 | cut -c1-220 | tee -a $L; }; done; done
for s in ozgaruvchi kosmik2 raketa; do log "-- sim $s"; $N timeout 1500 node new-junior/sinov/dvigatel/$s.mjs 2>&1 | grep -E "✗|NATIJA|^[0-9]+ / [0-9]+$|toza" | tail -4 | cut -c1-220 | tee -a $L; done
# 4) matn
for d in 004-hodisalar 017-kosmik-oyin-1 018-kosmik-oyin-2 019-bloklar-ortidagi-kod 021-shaxsiy-oyin-1 023-demo-day-1; do log "-- matn $d"; $N timeout 600 node new-junior/sinov/dvigatel/matn.mjs $d 2>&1 | grep -E "TOPILMADI|manbadagi gaplar" | cut -c1-200 | tee -a $L; done
# 5) setka Chrome + WebKit — umumiy uslub o'zgardi (C-blok, javon), hamma dars
for d in $(ls new-junior/darslar); do log "-- setka $d"; $N timeout 600 node new-junior/sinov/dvigatel/setka.mjs $d 2>&1 | grep -E "toza|cqw|chiqdi|qatlam|sig|yopdi|qator|cho|rror" | head -4 | cut -c1-200 | tee -a $L; $N timeout 600 node new-junior/sinov/dvigatel/setka.mjs $d --webkit 2>&1 | grep -v "Skipping" | tail -3 | cut -c1-200 | tee -a $L; done
log "TAMOM $(date +%H:%M)"
