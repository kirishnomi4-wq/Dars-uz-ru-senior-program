cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
for d in 017-kosmik-oyin-1 018-kosmik-oyin-2 019-bloklar-ortidagi-kod; do $N node new-junior/dvigatel/yig.mjs $d | tail -1; done
for t in sinov/demo/019-solo.mjs sinov/demo/019-toliq-dars.mjs sinov/demo/019-tovush.mjs; do echo "== $t $(date +%H:%M)"; timeout 2400 $N node new-junior/$t 2>&1 | grep -E "✗|NATIJA|Error|XATO" | cut -c1-260; done
echo "== setka 19"; timeout 400 $N node new-junior/sinov/dvigatel/setka.mjs 019-bloklar-ortidagi-kod 2>&1 | grep -v "^ *✓" | tail -8 | cut -c1-220
echo "== setka wk 19"; timeout 400 $N node new-junior/sinov/dvigatel/setka.mjs 019-bloklar-ortidagi-kod --webkit 2>&1 | grep -v Skipping | tail -6 | cut -c1-220
echo "== matn 19"; $N node new-junior/sinov/dvigatel/matn.mjs 019-bloklar-ortidagi-kod 2>&1 | head -3
echo "== til 19"; (cd new-junior/.. && npm run lint:til new-junior/darslar/019-bloklar-ortidagi-kod 2>&1 | tail -2 | cut -c1-120)
echo "== regressiya 17, 18 (umumiy dvigatel o'zgardi)"
for t in sinov/dvigatel/raketa.mjs sinov/demo/017-solo.mjs sinov/dvigatel/kosmik2.mjs sinov/demo/018-solo.mjs sinov/demo/018-toliq-dars.mjs; do echo "== $t $(date +%H:%M)"; timeout 2400 $N node new-junior/$t 2>&1 | grep -E "✗|NATIJA|Error|XATO" | cut -c1-260; done
for d in 017-kosmik-oyin-1 018-kosmik-oyin-2; do echo "== setka $d"; timeout 400 $N node new-junior/sinov/dvigatel/setka.mjs $d 2>&1 | grep -v "^ *✓" | tail -4 | cut -c1-200; done
echo "TAMOM $(date +%H:%M)"
