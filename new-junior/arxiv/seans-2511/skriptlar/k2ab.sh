#!/bin/bash
# 25.11 — 18-dars kosmik2 regressiyasi: eski (22.11) / hozirgi / qo'shni selektor (:has siz) — bittadan, bir xil sharoitda
cd /home/kali/Desktop/internetLesson

L=new-junior/arxiv/seans-2511/skriptlar/k2ab2-natija.txt; : > $L
for v in k7siz cheksiz; do
  echo "-- $v $(date +%H:%M)" | tee -a $L
  K2_URL=http://localhost:5340/demo-018-$v.html nice -n 19 taskset -c 0-3 timeout 1500 node new-junior/sinov/dvigatel/.kosmik2-url.mjs 2>&1 | grep -E "✗|NATIJA" | tail -5 | cut -c1-220 | tee -a $L
done
echo "TAMOM $(date +%H:%M)" | tee -a $L
