#!/usr/bin/env bash
# CI/CD-2 (GitHub Actions) mentor darsi — LOKAL tayyorgarlik chiqishlari (F-1029-02, 01.11 avtopilot). Natija: manba/cicd2-out/NN-*.txt
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-cicd2.sh
# DIQQAT: GitHub Actions'ning o'zi bu yerda yurgizilmaydi (push kerak — ruxsat so'ralmagan). Bu skript faqat lokal qismini beradi:
# o'quvchi m4c-03 dagi «brauzerda repo» namunasi (package.json), npm ci / npm install farqi, ci.yml variantlari tahlilchida.
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/cicd2-out"
R="${S:?S=scratchpad kerak}/cicd2-run"
mkdir -p "$OUT"; rm -rf "$R"; mkdir -p "$R/ci-mashq"
CLEAN=(env -i HOME="$HOME" PATH="$PATH" TERM=dumb NO_COLOR=1 FORCE_COLOR=0 CI=true)
run(){ echo "\$ $*"; "${CLEAN[@]}" "$@" 2>&1; echo "[chiqish kodi: $?]"; echo; }
{ node --version; npm --version; date; } > "$OUT/00-versiyalar.txt"
cd "$R/ci-mashq"
# o'quvchi m4c-03 «Repongiz yo'qmi?» — brauzerda yaratiladigan package.json (GA_PKG), lock fayl yo'q
printf '{\n  "name": "ci-mashq",\n  "version": "1.0.0",\n  "scripts": { "test": "echo ok && exit 0" }\n}\n' > package.json
{ echo '$ cat package.json'; cat package.json; echo; } > "$OUT/01-ci-mashq-namuna.txt"
# 02 GitHub'ning tayyor Node andozasi npm ci ishlatadi (cicd1-out/12) — lock yo'q repoda
run npm ci > "$OUT/02-npm-ci-lock-yoq.txt"
# 03 npm install + npm test (o'quvchi darsidagi qadamlar)
{ run npm install; run npm test; echo '$ ls'; ls; } > "$OUT/03-npm-install-test.txt"
# 04 «testni ataylab buzing» — bu package.json'da test doim exit 0: buzish uchun skriptni o'zgartirish kerak
sed -i 's/echo ok \&\& exit 0/echo xato \&\& exit 1/' package.json
{ echo '# "test": "echo xato && exit 1" ga o'"'"'zgartirildi'; run npm test; } > "$OUT/04-test-buzildi.txt"
echo "[$(date +%T)] tayyor: $(ls "$OUT" | wc -l) fayl → $OUT"
