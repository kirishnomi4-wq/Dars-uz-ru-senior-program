#!/bin/bash
# 25.11 kech — QA fidbeki + Q02–Q17 dan keyingi YAKUNIY tekshiruv (17:48 yig'masi; bittadan). Natija: g25d-natija.txt
cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
L=new-junior/arxiv/seans-2511/skriptlar/g25d-natija.txt; : > $L
S=/tmp/claude-1000/-home-kali-Desktop-internetLesson/cc587e42-9e3a-4efc-844b-c3f138f61416/scratchpad
mkdir -p $S/g25d
log() { echo "$@" | tee -a $L; }
H="001 002 003 004 005 006 007 008 009 010 011 012 013 014 015 016 017 018 019 020 021 022 023"
log "== BOSHLANDI $(date +%H:%M)"
log "-- qa25"; $N timeout 900 node new-junior/sinov/dvigatel/qa25.mjs --surat $S/g25d 2>&1 | grep -E "✗|NATIJA" | cut -c1-220 | tee -a $L
log "-- javon-qirq $(date +%H:%M)"; $N timeout 7200 node new-junior/sinov/dvigatel/javon-qirq.mjs $H 2>&1 | grep -E "TOPILMA|✗" | head -30 | cut -c1-200 | tee -a $L
log "-- qutiden $(date +%H:%M)"; $N timeout 7200 node new-junior/sinov/dvigatel/qutiden.mjs $H --en 1440 --surat $S/g25d 2>&1 | grep -E "TOPILMA|✗" | head -60 | cut -c1-220 | tee -a $L
log "-- ustma $(date +%H:%M)"; $N timeout 7200 node $S/bosh/ustma.mjs $H --surat $S/g25d 2>&1 | grep -E "TOPILMA|✗" | head -40 | cut -c1-220 | tee -a $L
log "== DARSLAR $(date +%H:%M)"
for t in toliq-dars solo tovush; do log "-- 001 $t"; $N timeout 1500 node new-junior/sinov/demo/$t.mjs 2>&1 | grep -E "✗|NATIJA|jami|Error" | tail -4 | cut -c1-220 | tee -a $L; done
for n in 002 003 004 005 006 007 008 009 010 011 012 013 014 015 016 017 018 019 020 021 022 023; do for t in toliq-dars solo tovush; do f=new-junior/sinov/demo/$n-$t.mjs; [ -f $f ] && { log "-- $n $t $(date +%H:%M)"; $N timeout 1500 node $f 2>&1 | grep -E "✗|NATIJA|Error" | tail -4 | cut -c1-220 | tee -a $L; }; done; done
log "== SIMULYATOR $(date +%H:%M)"
for s in katak maydon hodisa takror amaliyot kostyum shart labirint labirint2 ozgaruvchi jon tasodif xato klon xakaton kosmik2 raketa chek17; do f=new-junior/sinov/dvigatel/$s.mjs; [ -f $f ] || continue; log "-- sim $s"; $N timeout 1800 node $f 2>&1 | grep -E "✗|NATIJA|jami|toza|^[0-9]+ / [0-9]+$|Error" | tail -4 | cut -c1-220 | tee -a $L; done
log "== MATN $(date +%H:%M)"
for d in $(ls new-junior/darslar); do log "-- matn $d"; $N timeout 600 node new-junior/sinov/dvigatel/matn.mjs $d 2>&1 | grep -E "TOPILMADI|manbadagi gaplar" | head -6 | cut -c1-200 | tee -a $L; done
log "== SETKA $(date +%H:%M)"
for d in $(ls new-junior/darslar); do log "-- setka $d"; $N timeout 600 node new-junior/sinov/dvigatel/setka.mjs $d 2>&1 | grep -E "toza|cqw|chiqdi|qatlam|sig|yopdi|qator|cho|rror" | head -4 | cut -c1-200 | tee -a $L; $N timeout 600 node new-junior/sinov/dvigatel/setka.mjs $d --webkit 2>&1 | grep -v "Skipping" | tail -3 | cut -c1-200 | tee -a $L; done
log "== OLTIN 1–14 $(date +%H:%M)"
for d in $(ls new-junior/darslar | head -14); do log "-- oltin $d $(date +%H:%M)"; $N timeout 1800 node new-junior/sinov/dvigatel/oltin.mjs sol $d 2>&1 | grep -E "BIR XIL|✗|rror|namuna yo" | head -60 | cut -c1-200 | tee -a $L; done
log "TAMOM $(date +%H:%M)"
