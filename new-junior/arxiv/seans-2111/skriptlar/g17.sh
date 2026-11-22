cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
$N node new-junior/dvigatel/yig.mjs 017-kosmik-oyin-1 | tail -1
for t in sinov/dvigatel/raketa.mjs sinov/demo/017-solo.mjs sinov/demo/017-toliq-dars.mjs sinov/demo/017-tovush.mjs; do echo "== $t"; timeout 600 $N node new-junior/$t 2>&1 | grep -E "✗|NATIJA|Error|xatosi" | cut -c1-260; done
echo "== setka"; timeout 400 $N node new-junior/sinov/dvigatel/setka.mjs 017-kosmik-oyin-1 2>&1 | tail -6 | cut -c1-220
echo "== setka wk"; timeout 400 $N node new-junior/sinov/dvigatel/setka.mjs 017-kosmik-oyin-1 --webkit 2>&1 | grep -v Skipping | tail -4 | cut -c1-220
echo "== matn"; $N node new-junior/sinov/dvigatel/matn.mjs 017-kosmik-oyin-1 2>&1 | head -1
echo TAMOM
