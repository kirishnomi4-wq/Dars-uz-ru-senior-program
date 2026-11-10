#!/usr/bin/env bash
# Jest-1 v2 (F-1104-01): test to'plami buzilishni ushlaydimi — kodni ataylab buzib, qizil testlar sanaladi.
# ISHLATISH: bash jest1v2-mutatsiya.sh <nom>=<loyiha-papkasi> ...  → jadval stdout ga
# Har buzish alohida qo'llanadi va git checkout bilan qaytariladi (faqat texts.ts / keyboards.ts).
set -u
CLEAN=(env -i HOME="$HOME" PATH="$PATH" TERM=dumb NO_COLOR=1 FORCE_COLOR=0)
T=src/api/telegram
declare -a NOM=(
  "B1 som: ru-RU → en-US (120,000)"
  "B2 savat qatori: buyurtma narxi o'rniga hozirgi narx"
  "B3 orderKeyboard: CANCELLED da ham tugma"
  "B4 catalogKeyboard: oxirgi sahifada ham ▶"
  "B5 STATUS_UZ.NEW matni o'zgardi"
)
buz(){ case $1 in
  1) sed -i "s/toLocaleString('ru-RU')/toLocaleString('en-US')/" $T/texts.ts ;;
  2) sed -i 's/som((i.price ?? i.product.price) \* i.qty)/som(i.product.price * i.qty)/' $T/texts.ts ;;
  3) sed -i "s/  if (o.status === 'DELIVERED' || o.status === 'CANCELLED') return undefined;/  if (o.status === 'DELIVERED') return undefined;/" $T/keyboards.ts ;;
  4) sed -i "s/  if (page < pages - 1)/  if (page <= pages - 1)/" $T/keyboards.ts ;;
  5) sed -i "s/NEW: '🆕 Yangi',/NEW: '🆕 Yangi buyurtma',/" $T/texts.ts ;;
esac; }
sanoq(){ "${CLEAN[@]}" npx jest --silent 2>&1 | grep -E '^Tests:' | head -1; }
for arg in "$@"; do
  n=${arg%%=*}; d=${arg#*=}; cd "$d" || continue
  echo "## $n ($d)"; echo "buzilmagan: $(sanoq)"
  for i in 1 2 3 4 5; do
    buz $i
    if git diff --quiet -- $T/texts.ts $T/keyboards.ts; then echo "${NOM[$((i-1))]}: (sed tegmadi — kod boshqacha)"; continue; fi
    echo "${NOM[$((i-1))]}: $(sanoq)"
    git checkout -q -- $T/texts.ts $T/keyboards.ts
  done; echo
done
