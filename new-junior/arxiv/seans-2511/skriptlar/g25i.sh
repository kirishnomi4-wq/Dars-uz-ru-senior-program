#!/bin/bash
# 26.11 — YAKUNIY regressiya (QA deploy oldidan). Hamma demo + LMS yig'iladi (qobiq.css C-blok rangi hammasiga), C-blokli 4 dars setkasi,
# keyin namunasi bor HAMMA dars (1–23) oltin sol — har birida FARQ YO'Q bo'lishi shart. Bittadan. Natija: g25i-natija.txt
cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
L=new-junior/arxiv/seans-2511/skriptlar/g25i-natija.txt; : > $L
log() { echo "$@" | tee -a $L; }
log "== BOSHLANDI $(date +%H:%M)"
for d in $(ls new-junior/darslar); do $N node new-junior/dvigatel/yig.mjs $d 2>&1 | tail -1 | cut -c1-120 | tee -a $L; done
$N node new-junior/lms/yig.mjs 2>&1 | tail -2 | cut -c1-200 | tee -a $L
log "== SETKA (C-blokli darslar) $(date +%H:%M)"
for d in 008-shart 009-labirint-oyini-1 010-labirint-oyini-2 014-xatoni-topish; do log "-- setka $d"; $N timeout 600 node new-junior/sinov/dvigatel/setka.mjs $d 2>&1 | grep -E "toza|cqw|chiqdi|qatlam|sig|yopdi|qator|cho|rror" | head -4 | cut -c1-200 | tee -a $L; $N timeout 600 node new-junior/sinov/dvigatel/setka.mjs $d --webkit 2>&1 | grep -v "Skipping" | tail -2 | cut -c1-200 | tee -a $L; done
log "== OLTIN SOL 1–23 (hammasi) $(date +%H:%M)"
for d in $(ls new-junior/darslar); do log "-- oltin sol $d $(date +%H:%M)"; $N timeout 1800 node new-junior/sinov/dvigatel/oltin.mjs sol $d 2>&1 | grep -E "BIR XIL|FARQ YO|✗|rror|KONSOL" | head -12 | cut -c1-220 | tee -a $L; done
log "TAMOM $(date +%H:%M)"
