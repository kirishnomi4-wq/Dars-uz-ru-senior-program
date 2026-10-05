#!/bin/bash
# final-check — darslar bo'yicha yakuniy tekshiruv (5-Modul F-1001-80 dan umumlashtirildi, 04.10 konveyer):
#   gates (12 darvoza) · ball kalitlari HEAD bilan · ru-gate (RU bazasi bilan, bo'lsa) · uz/ru ekran-smoke (pageerror)
# Ishlatish:
#   S=<scratchpad> LIST="01:6-Modull/ArchPatternsLesson 02:6-Modull/PmLesson22" bash konveyer/vositalar/final-check.sh
#   ru-baza: $S/<NN>-ru/base.jsx (RU tarjimadan OLDINGI uz-etalon, konveyer 6-RU.md 1-qadam)
cd "$(dirname "$0")/../.." || exit 1
S=${S:?scratchpad yo\'lini bering: S=<scratchpad> LIST="NN:papka/Fayl ..." bash konveyer/vositalar/final-check.sh}
LIST=${LIST:?darslar ro\'yxati: LIST="01:6-Modull/ArchPatternsLesson ..."}
V=konveyer/vositalar
for p in $LIST; do
  n=${p%%:*}; r0=${p##*:}; b=${r0##*/}; f=src/$r0.jsx
  g=$(npm run -s gates -- $f 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | grep -oE '[0-9]+/[0-9]+ darvoza[^.]*' | tail -1)
  kh=$(git show HEAD:$f 2>/dev/null | grep -oE "(correct|correctIdx)[:=] *\{?[0-9]|INLINE_KEYS *= *\{[^}]*\}" | tr -d ' ' | md5sum | cut -c1-8)
  kw=$(grep -oE "(correct|correctIdx)[:=] *\{?[0-9]|INLINE_KEYS *= *\{[^}]*\}" $f | tr -d ' ' | md5sum | cut -c1-8)
  [ "$kh" = "$kw" ] && k="kalit=HEAD" || k="KALIT-FARQ($kh/$kw)"
  if [ -f $S/$n-ru/base.jsx ]; then r=$(node tools/ru-gate.mjs $S/$n-ru/base.jsx $f 2>&1 | grep -oE 'TENG|FARQ' | head -1); else r="ru-baza-yo'q"; fi
  eu=$(SHOT_WAIT=600 node $V/shots.mjs $f $S/final/$n-uz 2>&1 | grep -vc "xato: yo'q")
  er=$(SHOT_LANG=ru SHOT_WAIT=1200 node $V/shots.mjs $f $S/final/$n-ru 2>&1 | grep -vc "xato: yo'q")
  printf "%s %-28s %-24s %-14s ru-gate=%-6s smoke-xato uz=%s ru=%s\n" $n $b "$g" "$k" "$r" "$eu" "$er"
done
npm run -s lint:jsx 2>&1 | tail -1
