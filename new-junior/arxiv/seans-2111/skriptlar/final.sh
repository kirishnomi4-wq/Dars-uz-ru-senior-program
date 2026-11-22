cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
D=$(ls new-junior/darslar)
echo "== BUILD $(date +%H:%M)"
for d in $D; do $N node new-junior/dvigatel/yig.mjs $d | tail -1; done
echo "== LMS"; $N node new-junior/lms/yig.mjs 2>&1 | tail -2
echo "== SIMULYATOR $(date +%H:%M)"
for s in katak maydon hodisa takror amaliyot kostyum shart labirint labirint2 ozgaruvchi jon tasodif xato klon xakaton kosmik2 raketa; do f=new-junior/sinov/dvigatel/$s.mjs; [ -f $f ] || continue; echo "-- $s"; $N timeout 1500 node $f 2>&1 | grep -E "✗|NATIJA|jami|Error|toza" | tail -3 | cut -c1-200; done
echo "== 001 $(date +%H:%M)"
for t in toliq-dars solo tovush; do echo "-- 001 $t"; $N timeout 1500 node new-junior/sinov/demo/$t.mjs 2>&1 | grep -E "✗|NATIJA|jami|Error" | tail -3 | cut -c1-200; done
for n in 002 003 004 005 006 007 008 009 010 011 012 013 014 015 016 017 018 019 020 021 022 023; do for t in toliq-dars solo tovush; do f=new-junior/sinov/demo/$n-$t.mjs; [ -f $f ] || continue; echo "-- $n $t $(date +%H:%M)"; $N timeout 1500 node $f 2>&1 | grep -E "✗|NATIJA|Error" | tail -4 | cut -c1-200; done; done
echo "== SETKA $(date +%H:%M)"
for d in $D; do echo "-- setka $d"; $N timeout 600 node new-junior/sinov/dvigatel/setka.mjs $d 2>&1 | grep -E "toza|cqw|chiqdi|qatlam|sig|yopdi|qator|cho" | head -4 | cut -c1-200; $N timeout 600 node new-junior/sinov/dvigatel/setka.mjs $d --webkit 2>&1 | grep -v "Skipping\|labirintli" | head -4 | cut -c1-200; done
echo "== MATN $(date +%H:%M)"
for d in $D; do echo "-- matn $d"; $N timeout 600 node new-junior/sinov/dvigatel/matn.mjs $d 2>&1 | grep -E "TOPILMADI|manbadagi gaplar" | cut -c1-200; done
echo "== OLTIN $(date +%H:%M)"
for d in $D; do echo "-- oltin $d"; $N timeout 1800 node new-junior/sinov/dvigatel/oltin.mjs sol $d 2>&1 | grep -E "BIR XIL|✗|rror|namuna yo" | head -6 | cut -c1-200; done
echo "TAMOM $(date +%H:%M)"
