#!/bin/bash
# F-1015: 7–14-M QA saytlarini qayta deploy (ishchi daraxtdan). Ishlatish: bash deploy-qa.sh [5 6 …] — dist-mN raqamlari (5=7-M … 12=14-M)
cd /home/kali/Desktop/internetLesson || exit 1
S=${S:-/tmp/claude-1000/-home-kali-Desktop-internetLesson/04cee2f0-132d-49a8-84c4-ed4cf2fa5e1c/scratchpad}; mkdir -p "$S"
LOG=$S/deploy.log; : > "$LOG"
declare -A URL=( [5]=coddycamp-7modul [6]=coddycamp-8modul [7]=coddycamp-9modul [8]=coddycamp-10modul [9]=coddycamp-11modul [10]=coddycamp-12modul [11]=coddycamp-13modul [12]=coddycamp-14modul )
NLAR=${*:-5 6 7 8 9 10 11 12}
for N in $NLAR; do
  D=dist-m$N; mkdir -p "$S/vercel-m$N"; cp "$D/.vercel/project.json" "$S/vercel-m$N/project.json" || { echo "m$N project.json yo'q" >> "$LOG"; continue; }
  echo "== m$N build $(date +%H:%M)" >> "$LOG"
  npx vite build --config vite.m$N.config.js --logLevel error >> "$LOG" 2>&1 || { echo "m$N BUILD XATO" >> "$LOG"; continue; }
  cp "$D/modul$N.html" "$D/index.html"
  mkdir -p "$D/.vercel"; cp "$S/vercel-m$N/project.json" "$D/.vercel/project.json"
  rm -f "$D/.env.local" "$D/.gitignore"
  npx vercel deploy --prod --yes --cwd "$D" > "$S/vd-m$N.log" 2>&1; echo "m$N deploy exit $? $(grep -oE 'https://[a-z0-9-]+\.vercel\.app' "$S/vd-m$N.log" | tail -1)" >> "$LOG"
  K=$(awk -v p="m$N-" 'index($1,p)==1 {print $1}' $S/kf.txt | paste -sd,)
  SAYT_URL=https://${URL[$N]}.vercel.app KEYS=$K CHROME=/usr/bin/google-chrome node konveyer/vositalar/sayt-smoke.mjs > "$S/smoke-m$N.log" 2>&1
  echo "m$N smoke: $(tail -2 "$S/smoke-m$N.log" | tr '\n' ' ')" >> "$LOG"
done
echo "TAYYOR $(date +%H:%M)" >> "$LOG"
