cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
for d in 017-kosmik-oyin-1 018-kosmik-oyin-2 019-bloklar-ortidagi-kod 020-takrorlash-va-test 021-shaxsiy-oyin-1 022-shaxsiy-oyin-2 023-demo-day-1; do $N node new-junior/dvigatel/yig.mjs $d | tail -1; done
for n in 021 022 023; do for t in solo toliq-dars tovush; do echo "== $n $t $(date +%H:%M)"; timeout 2400 $N node new-junior/sinov/demo/$n-$t.mjs 2>&1 | grep -E "✗|NATIJA|Error|XATO" | cut -c1-260; done; done
for d in 021-shaxsiy-oyin-1 022-shaxsiy-oyin-2 023-demo-day-1; do echo "== setka $d"; timeout 400 $N node new-junior/sinov/dvigatel/setka.mjs $d 2>&1 | grep -v "^ *✓" | tail -10 | cut -c1-220; echo "== setka wk $d"; timeout 400 $N node new-junior/sinov/dvigatel/setka.mjs $d --webkit 2>&1 | grep -v Skipping | tail -5 | cut -c1-220; echo "== matn $d"; $N node new-junior/sinov/dvigatel/matn.mjs $d 2>&1 | sed -n '1p;/TOPILMADI/,$p' | cut -c1-200; echo "== til $d"; npm run lint:til new-junior/darslar/$d 2>&1 | tail -3 | cut -c1-140; done
echo "TAMOM $(date +%H:%M)"
