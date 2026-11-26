#!/bin/bash
# 25.11 — g25 dan keyingi tekshiruvlar (bittadan). Ildizdan: bash new-junior/arxiv/seans-2511/skriptlar/g25b.sh [kutiladigan_pid]
cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
L=new-junior/arxiv/seans-2511/skriptlar/g25b-natija.txt
S=/tmp/claude-1000/-home-kali-Desktop-internetLesson/cc587e42-9e3a-4efc-844b-c3f138f61416/scratchpad/bosh
if [ -n "$1" ]; then while kill -0 "$1" 2>/dev/null; do sleep 5; done; fi
: > $L
log() { echo "$@" | tee -a $L; }
log "== BOSHLANDI $(date +%H:%M)"
# 1) Safari (WebKit) setkasi — natija qatori to'liq (g25 filtri «labirintli» qatorini tashlab yuborgan edi)
for d in 012-ozgaruvchi-jon-vaqt 017-kosmik-oyin-1 018-kosmik-oyin-2 020-takrorlash-va-test 021-shaxsiy-oyin-1 022-shaxsiy-oyin-2 023-demo-day-1; do
  log "-- webkit $d"; $N timeout 600 node new-junior/sinov/dvigatel/setka.mjs $d --webkit 2>&1 | grep -v "Skipping" | tail -4 | cut -c1-220 | tee -a $L
done
# 2) kosmik2 — ikki marta, yolg'iz
for i in 1 2; do log "-- kosmik2 #$i $(date +%H:%M)"; $N timeout 1500 node new-junior/sinov/dvigatel/kosmik2.mjs 2>&1 | grep -E "✗|NATIJA" | tail -4 | cut -c1-260 | tee -a $L; done
# 3) tasodif, xato — yakuniy qatorlar
for s in tasodif xato; do log "-- sim $s"; $N timeout 1500 node new-junior/sinov/dvigatel/$s.mjs 2>&1 | grep -E "✗|^[0-9]+ / [0-9]+$" | tail -6 | cut -c1-220 | tee -a $L; done
# 4) 15-dars: javon/dastur ustuni o'zgardi — ustma (olma yo'li), to'liq dars, solo
log "-- ustma 015 (olma)"; $N timeout 900 node $S/ustma.mjs 015 --surat $S/ustma 2>&1 | grep -v "^    at " | tail -4 | cut -c1-220 | tee -a $L
for t in toliq-dars solo; do log "-- 015 $t"; $N timeout 1500 node new-junior/sinov/demo/015-$t.mjs 2>&1 | grep -E "✗|NATIJA" | tail -4 | cut -c1-220 | tee -a $L; done
# 5) matn 021 (manba «Tekshirilmagan joylar» yangilandi)
log "-- matn 021"; $N timeout 600 node new-junior/sinov/dvigatel/matn.mjs 021-shaxsiy-oyin-1 2>&1 | grep -E "TOPILMADI|manbadagi gaplar" | cut -c1-220 | tee -a $L
log "TAMOM $(date +%H:%M)"
