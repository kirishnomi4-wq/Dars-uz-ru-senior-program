cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
$N node new-junior/dvigatel/yig.mjs 016-klonlar | tail -1
for t in sinov/demo/016-toliq-dars.mjs sinov/demo/016-solo.mjs sinov/dvigatel/klon.mjs sinov/demo/016-tovush.mjs; do echo "== $t"; timeout 400 $N node new-junior/$t 2>&1 | grep -E "✗|NATIJA|Error" | cut -c1-250; done
echo "== setka"; timeout 400 $N node new-junior/sinov/dvigatel/setka.mjs 016-klonlar 2>&1 | tail -4 | cut -c1-200
echo "== setka wk"; timeout 400 $N node new-junior/sinov/dvigatel/setka.mjs 016-klonlar --webkit 2>&1 | grep -v Skipping | tail -3 | cut -c1-200
echo "== matn"; $N node new-junior/sinov/dvigatel/matn.mjs 016-klonlar 2>&1 | head -1
echo TAMOM
