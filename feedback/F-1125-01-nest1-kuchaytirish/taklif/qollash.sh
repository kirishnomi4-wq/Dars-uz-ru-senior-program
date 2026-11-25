#!/bin/bash
# F-1125-01 · 2-ish (T1–T9) + 3-ish (Nest-1 AI bloki) — src'ga qo'llash (foydalanuvchi tasdig'i 25.11).
# Ishlatish (repo ildizidan, 1-ish deploy'i TUGAGANDAN keyin): bash feedback/F-1125-01-nest1-kuchaytirish/taklif/qollash.sh
set -eu
R=$(cd "$(dirname "$0")/../../.." && pwd); cd "$R"
T=feedback/F-1125-01-nest1-kuchaytirish/taklif
D=feedback/F-1029-02-mentor-kurs/dev
git diff --quiet -- src/mentor-kurs || { echo "src/mentor-kurs toza emas — to'xtadim"; exit 1; }
echo "== 2-ish · Nest-1 (UZ)"; python3 $T/patch-2ish-nest1.py
echo "== 2-ish · ruscha (Nest-1 + PG-1 qism)"; python3 $T/patch-2ish-ru.py
echo "== 2-ish · PG-1 MD → matn → ruscha"; python3 $T/patch-2ish-pg1.py; python3 $D/pg1-matn.py; python3 $D/ru-ajrat.py pg1; python3 $D/ru-qur.py pg1
echo "== 3-ish · Nest-1 AI bloki"; python3 $T/patch-3ish-nest1.py
echo "== yig'ish"; bash $D/yig.sh
for f in NestArchMentorLesson PgIntroMentorLesson; do printf '%s: ' $f; npx esbuild src/mentor-kurs/$f.jsx --bundle --external:react --external:@lesson/runtime --loader:.jsx=jsx --outfile=/dev/null 2>&1 | tail -1; done
echo "== MD (Nest-1)"; python3 $D/nest1-md.py > feedback/F-1029-02-mentor-kurs/04-Nest1-mentor-yakuniy.md
git status --short src/mentor-kurs feedback/F-1029-02-mentor-kurs | grep -v "JURNAL\|DAVOM" || true
echo "QO'LLANDI"
