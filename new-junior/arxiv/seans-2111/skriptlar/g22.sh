cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
for d in 017-kosmik-oyin-1 018-kosmik-oyin-2 019-bloklar-ortidagi-kod 020-takrorlash-va-test 021-shaxsiy-oyin-1 022-shaxsiy-oyin-2 023-demo-day-1; do $N node new-junior/dvigatel/yig.mjs $d | tail -1; done
echo "== kosmik2 $(date +%H:%M)"; timeout 2400 $N node new-junior/sinov/dvigatel/kosmik2.mjs 2>&1 | grep -E "✗|NATIJA|Error|XATO|/ 44" | cut -c1-260
for n in 020 021 022 023; do for t in solo toliq-dars tovush; do echo "== $n $t $(date +%H:%M)"; timeout 2400 $N node new-junior/sinov/demo/$n-$t.mjs 2>&1 | grep -E "✗|NATIJA|Error|XATO" | cut -c1-260; done; done
echo "TAMOM $(date +%H:%M)"
