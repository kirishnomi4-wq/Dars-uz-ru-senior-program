#!/bin/bash
# 26.11 — .oyin-bos olib tashlangach yangilangan namunalar (006, 007 — sanoq belgisi; 009, 011, 012, 015 — oyin-bos) — barqarorlik: sol, farq 0 shart. Bittadan.
cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
L=new-junior/arxiv/seans-2511/skriptlar/g25k-natija.txt; : > $L
echo "== BOSHLANDI $(date +%H:%M)" | tee -a $L
for d in 006-amaliyot 007-kostyum-tovush 009-labirint-oyini-1 011-ozgaruvchi-ball 012-ozgaruvchi-jon-vaqt 015-xakaton-1; do echo "-- oltin sol $d $(date +%H:%M)" | tee -a $L; $N timeout 1800 node new-junior/sinov/dvigatel/oltin.mjs sol $d 2>&1 | grep -E "BIR XIL|FARQ YO|✗|rror" | head -6 | cut -c1-200 | tee -a $L; done
echo "TAMOM $(date +%H:%M)" | tee -a $L
