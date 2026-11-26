#!/bin/bash
# 26.11 02:5x — g25f dan keyin (3 tuzatish: oltin.mjs shrift-yo'nalishi yopilgan sahifada yiqilmaydi · qobiq.css Q02 qoplamasi varaqqa qo'yilmaydi ·
# 019 P3 ustunlari .85fr .9fr 1.45fr). Hamma demo + LMS 02:52 da qayta yig'ilgan. Bittadan. Natija: g25g-natija.txt
cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
L=new-junior/arxiv/seans-2511/skriptlar/g25g-natija.txt; : > $L
log() { echo "$@" | tee -a $L; }
log "== BOSHLANDI $(date +%H:%M)"
log "-- qa25"; $N timeout 900 node new-junior/sinov/dvigatel/qa25.mjs 2>&1 | grep -E "✗|NATIJA" | cut -c1-220 | tee -a $L
log "-- qutiden 019 $(date +%H:%M)"; $N timeout 1800 node new-junior/sinov/dvigatel/qutiden.mjs 019 2>&1 | tail -6 | cut -c1-220 | tee -a $L
for t in toliq-dars solo; do log "-- 019 $t $(date +%H:%M)"; $N timeout 1500 node new-junior/sinov/demo/019-$t.mjs 2>&1 | grep -E "✗|NATIJA|Error" | tail -4 | cut -c1-220 | tee -a $L; done
log "== OLTIN SOL 1–14 $(date +%H:%M)"
for d in $(ls new-junior/darslar | head -14); do log "-- oltin sol $d $(date +%H:%M)"; $N timeout 1800 node new-junior/sinov/dvigatel/oltin.mjs sol $d 2>&1 | grep -vE "^(KARTA|  [0-9]+:)" | tail -40 | cut -c1-220 | tee -a $L; done
log "== OLTIN 15–23: yoz, keyin darhol sol (barqarorlik) $(date +%H:%M)"
for d in $(ls new-junior/darslar | tail -n +15); do
  log "-- oltin yoz $d $(date +%H:%M)"; $N timeout 1800 node new-junior/sinov/dvigatel/oltin.mjs yoz $d 2>&1 | tail -4 | cut -c1-220 | tee -a $L
  log "-- oltin sol $d $(date +%H:%M)"; $N timeout 1800 node new-junior/sinov/dvigatel/oltin.mjs sol $d 2>&1 | tail -30 | cut -c1-220 | tee -a $L
done
log "TAMOM $(date +%H:%M)"
