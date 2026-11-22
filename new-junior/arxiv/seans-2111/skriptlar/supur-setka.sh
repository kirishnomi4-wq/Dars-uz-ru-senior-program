cd /home/kali/Desktop/internetLesson
N="nice -n 19 taskset -c 0-3"
for d in $(ls new-junior/darslar); do echo "== SETKA $d $(date +%H:%M)"; timeout 600 $N node new-junior/sinov/dvigatel/setka.mjs $d 2>&1 | grep -v "^ *✓" | grep -E "ekran:|  " | head -8 | cut -c1-200; done
for d in 017-kosmik-oyin-1 018-kosmik-oyin-2; do echo "== WK $d"; timeout 600 $N node new-junior/sinov/dvigatel/setka.mjs $d --webkit 2>&1 | grep -v Skipping | tail -4 | cut -c1-200; done
echo "== matn 017"; $N node new-junior/sinov/dvigatel/matn.mjs 017-kosmik-oyin-1 2>&1 | head -1
echo "== G18"; bash new-junior/arxiv/seans-2111/skriptlar/g18.sh
