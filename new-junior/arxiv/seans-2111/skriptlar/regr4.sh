cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
D=$(ls new-junior/darslar | grep -v 015)
for d in $D 015-xakaton-1; do $N node new-junior/dvigatel/yig.mjs $d | tail -1; done
echo "== LMS"; $N node new-junior/lms/yig.mjs 2>&1 | tail -2
for d in $D; do echo "== OLTIN $d"; $N timeout 1500 node new-junior/sinov/dvigatel/oltin.mjs sol $d 2>&1 | grep -E "BIR XIL|✗|rror" | head -8; done
for d in $D; do echo "== SETKA $d"; $N timeout 600 node new-junior/sinov/dvigatel/setka.mjs $d 2>&1 | grep -E "toza|cqw|chiqdi|qatlam|sig|yopdi|qator|cho" | head -4; $N timeout 600 node new-junior/sinov/dvigatel/setka.mjs $d --webkit 2>&1 | grep -v Skipping | tail -2; done
for t in toliq-dars solo tovush; do echo "== 001 $t"; $N timeout 900 node new-junior/sinov/demo/$t.mjs 2>&1 | grep -E "✗|NATIJA|jami" | tail -3; done
for n in 002 003 004 005 006 007 008 009 010 011 012 013 014; do for t in toliq-dars solo tovush; do f=new-junior/sinov/demo/$n-$t.mjs; [ -f $f ] || continue; echo "== $n $t"; $N timeout 900 node $f 2>&1 | grep -E "✗|NATIJA" | tail -4; done; done
echo "== simulyator"; for s in katak maydon hodisa takror amaliyot kostyum shart labirint labirint2 ozgaruvchi jon tasodif xato; do f=new-junior/sinov/dvigatel/$s.mjs; [ -f $f ] || continue; echo "-- $s"; $N timeout 900 node $f 2>&1 | grep -E "✗|NATIJA|jami|TOZA|toza" | tail -2; done
echo TAMOM
