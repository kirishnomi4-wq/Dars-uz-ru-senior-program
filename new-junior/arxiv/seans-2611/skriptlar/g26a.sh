#!/bin/bash
# 26.11 — 1-modulni yopish: F-1126-01 (15-dars LMS yutuq sharti, qobiq.js juftQabul) dan keyingi to'liq navbat. Bittadan.
# Talab: lokal stek yoniq (server 3101 junior_sinov, soxta maktab 3998, vite 5340 — kuzatuvsiz). Natija: g26a-natija.txt
cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
L=new-junior/arxiv/seans-2611/skriptlar/g26a-natija.txt; : > $L
log() { echo "$@" | tee -a $L; }
log "== BOSHLANDI $(date +%H:%M) — 23 demo yig'ish"
for d in $(ls new-junior/darslar); do $N node new-junior/dvigatel/yig.mjs $d 2>&1 | tail -1 | cut -c1-120 | tee -a $L; done
log "== OLTIN SOL 1–23 $(date +%H:%M)"
for d in $(ls new-junior/darslar); do log "-- oltin sol $d $(date +%H:%M)"; $N timeout 1800 node new-junior/sinov/dvigatel/oltin.mjs sol $d 2>&1 | grep -E "BIR XIL|FARQ YO|✗|rror|KONSOL" | head -12 | cut -c1-220 | tee -a $L; done
log "== 015 DEMO SINOVLARI $(date +%H:%M)"
for t in toliq-dars solo tovush; do f=new-junior/sinov/demo/015-$t.mjs; [ -f $f ] && { log "-- 015 $t"; $N timeout 1500 node $f 2>&1 | grep -E "✗|NATIJA|Error" | tail -4 | cut -c1-220 | tee -a $L; }; done
log "-- sim xakaton"; $N timeout 1800 node new-junior/sinov/dvigatel/xakaton.mjs 2>&1 | grep -E "✗|NATIJA|jami|toza|^[0-9]+ / [0-9]+$|Error" | tail -4 | cut -c1-220 | tee -a $L
log "-- qa25"; $N timeout 900 node new-junior/sinov/dvigatel/qa25.mjs 2>&1 | grep -E "✗|NATIJA" | cut -c1-220 | tee -a $L
log "== LMS YIG'MA (lokal server) $(date +%H:%M)"
for d in $(ls new-junior/darslar); do JR_API=http://127.0.0.1:3101 $N node new-junior/lms/yig.mjs $d 2>&1 | grep -E "✖|chiqish/" | sed -E 's#.*/chiqish/##' | tee -a $L; done
log "== LMS SINOVLARI $(date +%H:%M)"
log "-- yutuq-shart"; timeout 120 node new-junior/lms/sinov/yutuq-shart.mjs 2>&1 | grep -E "✗|NATIJA" | tee -a $L
log "-- lms-har-dars 1–23"; $N timeout 5400 node new-junior/lms/sinov/lms-har-dars.mjs 2>&1 | grep -E "^✗|^✓|NATIJA|Error" | cut -c1-220 | tee -a $L
for t in lms-toliq lms-solo lms-sinf; do log "-- $t"; $N timeout 900 node new-junior/lms/sinov/$t.mjs 2>&1 | grep -v "^\s*at " | grep -E "^✗|NATIJA|XATO|Error|langar|favicon|404" | head -6 | cut -c1-220 | tee -a $L; done
log "== SERVER SINOVLARI $(date +%H:%M)"
cd server
log "-- unit"; $N npm test 2>&1 | grep -E "^# (tests|pass|fail)|not ok" | head -12 | tee -a ../$L
log "-- integratsion"; TEST_DATABASE_URL=postgres://dars:dars@127.0.0.1:5432/dars_test $N npm run test:int 2>&1 | grep -E "^# (tests|pass|fail)|not ok" | head -12 | tee -a ../$L
cd ..
log "TAMOM $(date +%H:%M)"
