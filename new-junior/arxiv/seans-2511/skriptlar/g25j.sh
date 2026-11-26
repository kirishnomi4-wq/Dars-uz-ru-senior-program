#!/bin/bash
# 26.11 — g25e da natija qatori filtrdan o'tmagan 7 simulyator (katak…shart: «N / M — HAMMASI TO‘G‘RI» formati) — aniq natija uchun qayta. Bittadan.
cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
L=new-junior/arxiv/seans-2511/skriptlar/g25j-natija.txt; : > $L
echo "== BOSHLANDI $(date +%H:%M)" | tee -a $L
for s in katak maydon hodisa takror amaliyot kostyum shart; do echo "-- sim $s $(date +%H:%M)" | tee -a $L; $N timeout 1800 node new-junior/sinov/dvigatel/$s.mjs 2>&1 | grep -E "✗|[0-9]+ / [0-9]+ —|Error" | tail -4 | cut -c1-200 | tee -a $L; done
# 006/007 stsenariysiga kutish qo'shildi (ko'rinmas ikkinchi sanoq belgisi) — ikki martadan sol, farq 0 shart
for k in 1 2; do for d in 006-amaliyot 007-kostyum-tovush; do echo "-- oltin sol $d ($k) $(date +%H:%M)" | tee -a $L; $N timeout 1800 node new-junior/sinov/dvigatel/oltin.mjs sol $d 2>&1 | grep -E "BIR XIL|FARQ YO|✗|rror" | head -6 | cut -c1-200 | tee -a $L; done; done
# oltin.mjs ol() endi .oyin-bos (420 ms lik tugma aks-sadosi) ni olib tashlaydi — namunasida bo'lgan 009, 011, 012 yangi vosita bilan sol
# (015 — g25i ning o'zida). Farq faqat u-03-P2S / y-03 bo'lishi kerak; ko'rilgach namuna yangilanadi va qayta sol (g25k).
for d in 009-labirint-oyini-1 011-ozgaruvchi-ball 012-ozgaruvchi-jon-vaqt; do echo "-- oltin sol $d (oyin-bos) $(date +%H:%M)" | tee -a $L; $N timeout 1800 node new-junior/sinov/dvigatel/oltin.mjs sol $d 2>&1 | grep -E "BIR XIL|FARQ YO|✗|rror" | head -8 | cut -c1-200 | tee -a $L; done
echo "TAMOM $(date +%H:%M)" | tee -a $L
