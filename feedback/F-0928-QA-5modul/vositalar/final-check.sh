#!/bin/bash
# 5-Modul 1–8 yakuniy tekshiruv (F-1001-80): gates · kalitlar HEAD bilan · ru-gate (RU bazasi bilan) · uz/ru smoke (pageerror)
cd /home/kali/Desktop/internetLesson
S=${S:?scratchpad yo'lini bering: S=<scratchpad> bash final-check.sh}
LIST=${LIST:-"01:5-Modull/BotIntroLesson 02:5-Modull/PmLesson19 03:5-Modull/BotApiButtonsLesson 04:5-Modull/BotStatefulMemoryLesson 05:5-Modull/BotAiProjectLesson 06:5-Modull/BotAiBrainLesson 07:5-Modull/BotFullProjectLesson 08:5-Modull/PmLesson20 09:5-Modull/BotFeedbackIterationLesson 10:5-Modull/BotAiAgentLesson 11:pm/PmMetricsLesson 12:5-Modull/PmLesson21"}
for p in $LIST; do
  n=${p%%:*}; r0=${p##*:}; b=${r0##*/}; f=src/$r0.jsx
  g=$(npm run gates -- $f 2>&1 | grep -oE '[0-9]/9 darvoza[^.]*' | head -1)
  kh=$(git show HEAD:$f | grep -oE "(correct|correctIdx)[:=] *\{?[0-9]|INLINE_KEYS *= *\{[^}]*\}" | tr -d ' ' | md5sum | cut -c1-8)
  kw=$(grep -oE "(correct|correctIdx)[:=] *\{?[0-9]|INLINE_KEYS *= *\{[^}]*\}" $f | tr -d ' ' | md5sum | cut -c1-8)
  [ "$kh" = "$kw" ] && k="kalit=HEAD" || k="KALIT-FARQ($kh/$kw)"
  if [ -f $S/$n-ru/base.jsx ]; then r=$(node tools/ru-gate.mjs $S/$n-ru/base.jsx $f $( [ "$n" = 11 ] && echo --unwrap=ou ) 2>&1 | grep -oE 'TENG|FARQ' | head -1); else r="ru-baza-yo'q"; fi
  eu=$(SHOT_WAIT=600 node $S/shots.mjs $f $S/final/$n-uz 2>&1 | grep -vc "xato: yo'q")
  er=$(SHOT_LANG=ru SHOT_WAIT=1200 node $S/shots.mjs $f $S/final/$n-ru 2>&1 | grep -vc "xato: yo'q")
  printf "%s %-28s %-22s %-14s ru-gate=%-6s smoke-xato uz=%s ru=%s\n" $n $b "$g" "$k" "$r" "$eu" "$er"
done
npm run lint:jsx 2>&1 | tail -1
