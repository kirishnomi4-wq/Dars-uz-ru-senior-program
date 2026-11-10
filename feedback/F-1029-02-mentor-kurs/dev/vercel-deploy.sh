#!/usr/bin/env bash
# Mentor kursi ko'rik saytini qayta deploy qilish (04.11; tartib — memory mentor-kurs-vercel). Ruxsat: foydalanuvchi 04.11 «har dars tayyor bo'lgach Vercel».
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/dev/vercel-deploy.sh
# Oldin: ovoz keshi to'ldirilgan bo'lsin — $S/ovoz-sayt-deploy/tts (dev/ovoz-matnlar.mjs + dev/ovoz-statik.py).
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd); cd "$ROOT"
S="${S:?S=scratchpad kerak}"; D="$S/coddycamp-mentor-kurs"
VITE_TTS_STATIC=1 npx vite build --config vite.mentor-kurs.config.js --outDir "$D" --emptyOutDir 2>&1 | grep -vE "^\s*$" | tail -4
[ -f "$D/mentor-kurs.html" ] || { echo "BUILD XATO: mentor-kurs.html yo'q"; exit 1; }
cp "$D/mentor-kurs.html" "$D/index.html"
mkdir -p "$D/tts"; cp -n "$S/ovoz-sayt-deploy/tts/"*.mp3 "$D/tts/" 2>/dev/null; echo "tts: $(ls "$D/tts" | wc -l) mp3"
mkdir -p "$D/.vercel"; printf '{"projectId":"prj_r9Xc18Y2m54lIeUBlMUA4ZnwCggP","orgId":"team_eMjzRKSHuQyrsksyNlH1aIJJ"}' > "$D/.vercel/project.json"
npx vercel deploy --prod --yes --cwd "$D" 2>&1 | grep -vE "^\s*$" | tail -6
echo "== tekshiruv"; sleep 5
for u in "https://coddycamp-mentor-kurs.vercel.app/" "https://coddycamp-mentor-kurs.vercel.app/?dars=cicd-01"; do printf '%s → %s\n' "$u" "$(curl -s -o /dev/null -w '%{http_code}' "$u")"; done
npx vercel ls --cwd "$D" 2>&1 | grep -vE "^\s*$" | sed -n 1,4p
