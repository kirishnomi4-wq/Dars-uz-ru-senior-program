#!/usr/bin/env bash
# Jest-2 v2 — KOD 3–4 (F-1104-19): qo'shimcha haqiqiy chiqishlar, drive-jest2v2.sh dan keyin, o'sha $S/jest2v2-run nusxasida (supertest bor).
# ISHLATISH: S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-jest2v2-kod.sh → jest2v2-out/08b, 14a, 14b
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd); OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/jest2v2-out"; R="${S:?S kerak}/jest2v2-run"; cd "$R"
CLEAN=(env -i HOME="$HOME" PATH="$PATH" TERM=dumb NO_COLOR=1 FORCE_COLOR=0)
run(){ echo "\$ $*"; "${CLEAN[@]}" "$@" 2>&1; echo "[chiqish kodi: $?]"; echo; }
O=src/api/order
# 08b — await bor, xabar noto'g'ri → oddiy FAIL (14-ekran fixedExtra)
sed "s/'Kolonka: omborda faqat 1 ta qoldi'/'Planshet: omborda faqat 9 ta qoldi'/" "$OUT/kod-05-order.service.spec.ts" > $O/order.service.spec.ts
cp $O/order.service.spec.ts "$OUT/kod-08b-order-await-xato.spec.ts"
run npx jest order.service -t "omborda" > "$OUT/08b-await-bor-xabar-xato.txt"
# 14a — providers'da repository token yo'q → Nest can't resolve
grep -v "getRepositoryToken(Order)" "$OUT/kod-05-order.service.spec.ts" | sed "s/import { getRepositoryToken } from '@nestjs\/typeorm';//" > $O/order.service.spec.ts
run npx jest order.service > "$OUT/14a-repository-token-yoq.txt"
# 14b — ombor testida mockResolvedValue yozilmagan → findOne undefined
python3 - "$OUT/kod-05-order.service.spec.ts" "$O/order.service.spec.ts" <<'PY'
import sys; t=open(sys.argv[1]).read()
i=t.index("omborda yetmaydi"); j=t.index("mockResolvedValue(", i); k=t.index(");", j)+2
# satr boshidan (Prettier o'ragan bo'lishi mumkin) to ); gacha — butun bayonot olib tashlanadi
s=t.rfind("\n", 0, j)
assert "manager.findOne" in t[s:k], t[s:k]
t=t[:s]+t[k:]
open(sys.argv[2],'w').write(t)
PY
run npx jest order.service -t "omborda" > "$OUT/14b-mock-yozilmagan.txt"
cp "$OUT/kod-10-order-chegara.spec.ts" $O/order.service.spec.ts
echo "tayyor"
