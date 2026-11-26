#!/bin/bash
# 26.11 18:1x — g26a qo'shimchasi: 001 oltin farqi yolg'iz, server sinovlari (g26a da natija yo'li xato edi), lms-har-dars (g26a da internet uzilgan edi)
cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
L=/home/kali/Desktop/internetLesson/new-junior/arxiv/seans-2611/skriptlar/g26b-natija.txt; : > $L
log() { echo "$@" | tee -a $L; }
log "== 001 OLTIN YOLG'IZ $(date +%H:%M)"
$N timeout 1800 node new-junior/sinov/dvigatel/oltin.mjs sol 001-tanishuv 2>&1 | grep -E "BIR XIL|FARQ YO|✗|rror|KONSOL" | head -12 | cut -c1-260 | tee -a $L
log "== SERVER SINOVLARI $(date +%H:%M)"
cd server
log "-- unit"; $N npm test 2>&1 | grep -E "^# (tests|pass|fail)|not ok|^ℹ (tests|pass|fail)|✖" | head -12 | tee -a $L
log "-- integratsion"; TEST_DATABASE_URL=postgres://dars:dars@127.0.0.1:5432/dars_test $N npm run test:int 2>&1 | grep -E "^# (tests|pass|fail)|not ok|^ℹ (tests|pass|fail)|✖" | head -12 | tee -a $L
cd ..
log "== LMS HAR DARS 1–23 $(date +%H:%M)"
$N timeout 5400 node new-junior/lms/sinov/lms-har-dars.mjs 2>&1 | grep -E "^✗|^✓ [0-9]{3}-[a-z0-9-]+ — |NATIJA|Error" | cut -c1-260 | tee -a $L
log "TAMOM $(date +%H:%M)"
