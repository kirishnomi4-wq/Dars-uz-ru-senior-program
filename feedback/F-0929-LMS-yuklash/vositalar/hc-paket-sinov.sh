#!/bin/sh
# Paketdagi HAR BIR kompilyatorli fayl ichidagi kompilyatorni to'liq avto-sinovdan o'tkazadi (01.10, F-1001-91).
# Fayl nusxasiga `export { HtmlCompiler_default as __HC }` qo'shiladi, hc-avto-sinov.mjs HC_SRC bilan shu nusxani ochadi.
#   sh hc-paket-sinov.sh <paket-papka> [chiqish-papka]
PK=${1:-yuklash-2026-10-01}; OUT=${2:-/tmp/lms-tekshir/paket-hc}; ROOT=/home/kali/Desktop/internetLesson
mkdir -p "$OUT"; cd "$ROOT" || exit 1
grep -la 'HtmlCompiler_default' "$PK"/*/*.jsx | while read f; do
  n=$(basename "$f" .jsx); m=$(basename "$(dirname "$f")")
  d="$OUT/$m-$n"; mkdir -p "$d"
  cp "$f" "$d/$n.jsx"; printf '\nexport { HtmlCompiler_default as __HC };\n' >> "$d/$n.jsx"
  echo "$d $n"
done | xargs -P 3 -n 2 sh -c 'HC_SRC="$0/$1.jsx" LMS_OUT="$0" node '"$ROOT"'/feedback/F-0929-LMS-yuklash/vositalar/hc-avto-sinov.mjs > "$0/natija.txt" 2>&1; printf "%s %s\n" "$1" "$(grep -a "AVTO-HOLATLAR\|pageerror" "$0/natija.txt" | tr "\n" " ")"'
echo TUGADI
