#!/usr/bin/env bash
# Jest-2 v2 (F-1104-19): test to'plami buzilishni ushlaydimi — kod 5 joyda ataylab buziladi, qizargan testlar sanaladi.
# ISHLATISH: bash jest2v2-mutatsiya.sh <nom>=<loyiha-papkasi> ...  → jadval stdout ga (0 = buzilish sezilmadi)
# B1 regex — phone.ts bo'lsa unda, bo'lmasa telegram.service.ts da (AI to'plamlari qoidani ajratmagan).
set -u
CLEAN=(env -i HOME="$HOME" PATH="$PATH" TERM=dumb NO_COLOR=1 FORCE_COLOR=0)
T=src/api/telegram; O=src/api/order
NOM=("B1 regex: 9–13 → 8–13 raqam (8 ta raqam o'tadi)" "B2 place: stock < qty → stock <= qty" "B3 place: UPDATE ombor tekshiruvidan OLDIN" "B4 xabar: «Telefon raqami yo'q» → «Raqam yo'q»" "B5 place: bo'sh savat tekshiruvi olib tashlandi")
buz(){ python3 - "$1" "$T" "$O" <<'PY'
import sys, pathlib
n, T, O = sys.argv[1], sys.argv[2], sys.argv[3]
def edit(p, a, b):
  f = pathlib.Path(p); t = f.read_text(); assert a in t, (p, a[:40]); f.write_text(t.replace(a, b, 1))
if n == '1':
  p = T + '/phone.ts' if pathlib.Path(T + '/phone.ts').exists() else T + '/telegram.service.ts'
  edit(p, r'/^\+?\d{9,13}$/', r'/^\+?\d{8,13}$/')
elif n == '2':
  edit(O + '/order.service.ts', '        if (p.stock < c.qty) {', '        if (p.stock <= c.qty) {')
elif n == '3':
  blk = "        if (p.stock < c.qty) {\n          throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);\n        }\n"
  end = "          p.id,\n        ]);\n"
  edit(O + '/order.service.ts', blk, ''); edit(O + '/order.service.ts', end, end + blk)
elif n == '4':
  edit(O + '/order.service.ts', 'throw new Error("Telefon raqami yo\'q")', 'throw new Error("Raqam yo\'q")')
elif n == '5':
  edit(O + '/order.service.ts', '    if (cart.length === 0) throw new Error("Savat bo\'sh");\n', '')
PY
}
sanoq(){ out=$("${CLEAN[@]}" npx jest --silent 2>&1); line=$(echo "$out" | grep -E '^Tests:' | head -1); if [ -z "$line" ]; then echo "NATIJA YO'Q (jarayon quladi)"; else echo "$line"; fi; }
for arg in "$@"; do
  n=${arg%%=*}; d=${arg#*=}; cd "$d" || continue
  git reset -q 2>/dev/null   # intent-to-add (git add -N) bo'lsa — checkout yangi fayllarni bo'shatmasin (04.11 tutildi)
  echo "## $n ($d)"; echo "buzilmagan: $(sanoq)"
  [ -f $T/phone.ts ] && cp $T/phone.ts "$d/.phone.bak"   # phone.ts yangi (untracked) — git checkout uni qaytarmaydi (04.11 tutildi: B2–B5 +1 edi)
  for i in 1 2 3 4 5; do
    buz $i || { echo "${NOM[$((i-1))]}: (buzib bo'lmadi)"; git checkout -q -- $T $O; [ -f "$d/.phone.bak" ] && cp "$d/.phone.bak" $T/phone.ts; continue; }
    echo "${NOM[$((i-1))]}: $(sanoq)"
    git checkout -q -- $T $O; [ -f "$d/.phone.bak" ] && cp "$d/.phone.bak" $T/phone.ts
  done; echo
done
