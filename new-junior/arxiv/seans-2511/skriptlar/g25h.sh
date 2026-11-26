#!/bin/bash
# 26.11 — g25g dan keyin. (1) C-blok rangi (qobiq.css .c-blok[data-yon]) bilan 04:06 da yig'ilgan 008/009/010/014 — eski namuna bilan sol
# (kutiladi: 1–14 ko'rigidagi turlar + statik if C-blokining yoni/tubi). (2) 016 — URUG qo'shildi: yoz + darhol sol (farq 0 shart). Bittadan.
cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
L=new-junior/arxiv/seans-2511/skriptlar/g25h-natija.txt; : > $L
log() { echo "$@" | tee -a $L; }
log "== BOSHLANDI $(date +%H:%M)"
for d in 008-shart 009-labirint-oyini-1 010-labirint-oyini-2 014-xatoni-topish; do log "-- oltin sol $d $(date +%H:%M)"; $N timeout 1800 node new-junior/sinov/dvigatel/oltin.mjs sol $d 2>&1 | grep -E "BIR XIL|FARQ YO|rror|KONSOL" | cut -c1-220 | tee -a $L; done
log "-- oltin yoz 016-klonlar $(date +%H:%M)"; $N timeout 1800 node new-junior/sinov/dvigatel/oltin.mjs yoz 016-klonlar 2>&1 | tail -3 | cut -c1-220 | tee -a $L
log "-- oltin sol 016-klonlar $(date +%H:%M)"; $N timeout 1800 node new-junior/sinov/dvigatel/oltin.mjs sol 016-klonlar 2>&1 | tail -12 | cut -c1-220 | tee -a $L
for d in 017-kosmik-oyin-1; do
  log "-- oltin yoz $d (uchyapti → uchdi) $(date +%H:%M)"; $N timeout 1800 node new-junior/sinov/dvigatel/oltin.mjs yoz $d 2>&1 | tail -3 | cut -c1-220 | tee -a $L
  log "-- oltin sol $d $(date +%H:%M)"; $N timeout 1800 node new-junior/sinov/dvigatel/oltin.mjs sol $d 2>&1 | tail -12 | cut -c1-220 | tee -a $L
done
log "TAMOM $(date +%H:%M)"
