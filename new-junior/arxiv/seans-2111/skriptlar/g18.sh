cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
for d in 017-kosmik-oyin-1 018-kosmik-oyin-2; do $N node new-junior/dvigatel/yig.mjs $d | tail -1; done
for t in sinov/dvigatel/kosmik2.mjs sinov/demo/018-solo.mjs sinov/demo/018-toliq-dars.mjs sinov/demo/018-tovush.mjs; do echo "== $t $(date +%H:%M)"; timeout 2400 $N node new-junior/$t 2>&1 | grep -E "✗|NATIJA|Error|XATO" | cut -c1-260; done
echo "== setka"; timeout 400 $N node new-junior/sinov/dvigatel/setka.mjs 018-kosmik-oyin-2 2>&1 | grep -v "^ *✓" | tail -12 | cut -c1-220
echo "== setka wk"; timeout 400 $N node new-junior/sinov/dvigatel/setka.mjs 018-kosmik-oyin-2 --webkit 2>&1 | grep -v Skipping | tail -8 | cut -c1-220
echo "== matn"; $N node new-junior/sinov/dvigatel/matn.mjs 018-kosmik-oyin-2 2>&1 | head -5
echo "== 17 regressiya"
for t in sinov/dvigatel/raketa.mjs sinov/demo/017-solo.mjs sinov/demo/017-toliq-dars.mjs sinov/demo/017-tovush.mjs; do echo "== $t $(date +%H:%M)"; timeout 900 $N node new-junior/$t 2>&1 | grep -E "✗|NATIJA|Error|XATO" | cut -c1-260; done
echo "TAMOM $(date +%H:%M)"
