cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
$N node new-junior/dvigatel/yig.mjs 015-xakaton-1 | tail -1
for t in sinov/demo/015-toliq-dars.mjs sinov/demo/015-solo.mjs sinov/dvigatel/xakaton.mjs sinov/demo/015-tovush.mjs; do echo "== $t"; timeout 400 $N node new-junior/$t 2>&1 | grep -E "✗|NATIJA|Error" | cut -c1-250; done
echo "== setka"; timeout 400 $N node new-junior/sinov/dvigatel/setka.mjs 015-xakaton-1 2>&1 | tail -4 | cut -c1-200
echo "== setka wk"; timeout 400 $N node new-junior/sinov/dvigatel/setka.mjs 015-xakaton-1 --webkit 2>&1 | grep -v Skipping | tail -3 | cut -c1-200
echo "== matn"; $N node new-junior/sinov/dvigatel/matn.mjs 015-xakaton-1 2>&1 | head -1
echo TAMOM
