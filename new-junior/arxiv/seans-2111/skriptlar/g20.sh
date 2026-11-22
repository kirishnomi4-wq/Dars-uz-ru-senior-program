cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
for d in 018-kosmik-oyin-2 019-bloklar-ortidagi-kod 020-takrorlash-va-test; do $N node new-junior/dvigatel/yig.mjs $d | tail -1; done
echo "== kosmik2 $(date +%H:%M)"; timeout 1500 $N node new-junior/sinov/dvigatel/kosmik2.mjs 2>&1 | grep -E "✗|NATIJA|Error" | cut -c1-240
for t in sinov/demo/020-solo.mjs sinov/demo/020-toliq-dars.mjs sinov/demo/020-tovush.mjs; do echo "== $t $(date +%H:%M)"; timeout 2400 $N node new-junior/$t 2>&1 | grep -E "✗|NATIJA|Error|XATO" | cut -c1-260; done
echo "== setka 20"; timeout 400 $N node new-junior/sinov/dvigatel/setka.mjs 020-takrorlash-va-test 2>&1 | grep -v "^ *✓" | tail -10 | cut -c1-220
echo "== setka wk 20"; timeout 400 $N node new-junior/sinov/dvigatel/setka.mjs 020-takrorlash-va-test --webkit 2>&1 | grep -v Skipping | tail -6 | cut -c1-220
echo "== matn 20"; $N node new-junior/sinov/dvigatel/matn.mjs 020-takrorlash-va-test 2>&1 | sed -n '1p;/TOPILMADI/,$p' | cut -c1-200
echo "== til 20"; npm run lint:til new-junior/darslar/020-takrorlash-va-test 2>&1 | tail -3 | cut -c1-140
echo "TAMOM $(date +%H:%M)"
