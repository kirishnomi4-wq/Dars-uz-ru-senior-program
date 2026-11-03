#!/usr/bin/env bash
# CI/CD-1 mentor darsi — haqiqiy chiqishlar (F-1029-02, 01.11 avtopilot). Natija: manba/cicd1-out/NN-*.txt
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-cicd1.sh
# G'oya: CI mashinasi har push'da TOZA papkada aynan shu buyruqlarni yurgizadi. Biz ularni toza clone'da,
# toza muhitda (env -i — Jest 30 agent muhitini sezadi, jest1-out/README) yurgizamiz. GitHub Actions'ning o'zi bu
# kompyuterda yurgizilmaydi (push kerak — ruxsat so'ralmagan): workflow fayli faqat rasmiy tahlilchi bilan tekshiriladi.
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/cicd1-out"
R="${S:?S=scratchpad kerak}/cicd1-run"
REPO=https://github.com/Azizbekcrypto/IntroNestArxitechture.git
mkdir -p "$OUT"; rm -rf "$R"; mkdir -p "$R"
CLEAN=(env -i HOME="$HOME" PATH="$PATH" TERM=dumb NO_COLOR=1 FORCE_COLOR=0 CI=true)
run(){ echo "\$ $*"; "${CLEAN[@]}" "$@" 2>&1; echo "[chiqish kodi: $?]"; echo; }
cd "$R" && git clone -q "$REPO" nest && cd nest
{ node --version; npm --version; git log -1 --format='%h %ad %s' --date=short; ls -a; date; } > "$OUT/00-versiyalar.txt"

# 01 CI odatda `npm ci` bilan o'rnatadi (setup-node hujjati) — o'quvchi reposida
run npm ci > "$OUT/01-npm-ci.txt"
# 02 `npm install` — ishlaydi
run npm install --no-audit --no-fund > "$OUT/02-npm-install.txt"
# 03 test fayli yo'q reposda `npm test` → No tests found (CI qizil)
run npm test > "$OUT/03-npm-test-bosh.txt"
# 04 build
run npm run build > "$OUT/04-build.txt"
# 05 lint (o'quvchi reposidagi skript --fix bilan) — natija va o'zgargan fayllar
run npm run lint > "$OUT/05-lint.txt"
{ echo '$ git status --short'; git status --short; } >> "$OUT/05-lint.txt"
git checkout -q -- . 2>/dev/null
# 06 lint --fix siz (CI uchun to'g'ri yozuv): npx eslint …
run npx eslint "{src,apps,libs,test}/**/*.ts" > "$OUT/06-lint-fixsiz.txt"
# 07 Jest-1 dagi order testi qo'shilgach — npm test yashil
cat > src/order.ts <<'TS'
export function orderTotal(price: number, quantity: number): number {
  return price * quantity;
}
TS
cat > src/order.spec.ts <<'TS'
import { orderTotal } from './order';

describe('orderTotal', () => {
  it('2 kitob narxini hisoblaydi', () => {
    expect(orderTotal(10000, 2)).toBe(20000);
  });
});
TS
run npm test > "$OUT/07-npm-test-yashil.txt"
# 08 kod buzildi (* → +) — npm test qizil, chiqish kodi 1 (CI shu kod bilan to'xtaydi)
sed -i 's/price \* quantity/price + quantity/' src/order.ts
run npm test > "$OUT/08-npm-test-qizil.txt"
sed -i 's/price + quantity/price * quantity/' src/order.ts
# 09 && zanjiri: birinchi qizil bo'lsa keyingisi yurmaydi (lenta to'xtaydi)
sed -i 's/price \* quantity/price + quantity/' src/order.ts
{ echo '$ npm test && npm run build && echo "UCHIRISH"'; "${CLEAN[@]}" bash -c 'npm test >/dev/null 2>&1 && npm run build && echo UCHIRISH'; echo "[chiqish kodi: $?]"; } > "$OUT/09-zanjir-toxtaydi.txt"
sed -i 's/price + quantity/price * quantity/' src/order.ts
{ echo '$ npm test && npm run build && echo "UCHIRISH"'; "${CLEAN[@]}" bash -c 'npm test >/dev/null 2>&1 && npm run build >/dev/null 2>&1 && echo UCHIRISH'; echo "[chiqish kodi: $?]"; } >> "$OUT/09-zanjir-toxtaydi.txt"

# 10 ci.yml variantlari — GitHub'ning rasmiy tahlilchisi @actions/workflow-parser 0.3.61 (schema bo'yicha; GitHub'da yurgizilmagan)
W="${S}/wf-tekshir"; mkdir -p "$W/yml" "${S}/wfp"
( cd "${S}/wfp" && [ -d node_modules/@actions/workflow-parser ] || { npm init -y >/dev/null; npm install --no-audit --no-fund @actions/workflow-parser@0.3.61 >/dev/null 2>&1; } )
cp "$ROOT/feedback/F-1029-02-mentor-kurs/manba/cicd1-yml/"*.yml "$W/yml/"
cp "$ROOT/feedback/F-1029-02-mentor-kurs/manba/cicd1-yml/tekshir.mjs" "$W/"
sed -i "s#'../wfp/#'${S}/wfp/#" "$W/tekshir.mjs"
( cd "$ROOT" && npx esbuild "$W/tekshir.mjs" --bundle --platform=node --format=cjs --outfile="$W/t.bundle.cjs" --log-level=error )
{ echo '$ node tekshir (@actions/workflow-parser 0.3.61) yml/*.yml'; node "$W/t.bundle.cjs" "$W/yml"; } > "$OUT/10-yml-tahlil.txt" 2>&1
# 11 checkout'siz: GitHub mashinasidagi ish papkasi bo'sh (actions/checkout README) — bo'sh papkada o'sha ikki buyruq
E="$R/bosh-papka"; mkdir -p "$E"; cd "$E"
{ echo '# bo'"'"'sh papka (checkout qadami yo'"'"'q bo'"'"'lsa — GitHub mashinasidagi holat, rasmiy hujjat bo'"'"'yicha)'; echo '$ ls -a'; ls -a; echo; } > "$OUT/11-checkoutsiz-bosh-papka.txt"
run npm install >> "$OUT/11-checkoutsiz-bosh-papka.txt"
run npm test >> "$OUT/11-checkoutsiz-bosh-papka.txt"
cd "$R/nest"
# 12 GitHub hujjatidan (o'qish, gh api): ubuntu-latest tasviri, undagi Node, checkout/setup-node so'nggi relizlari
{ echo "# Manba: github.com/actions/runner-images (gh api, $(date +%F))"
  gh api repos/actions/runner-images/contents/README.md --jq '.content' | base64 -d | grep -i -m2 "ubuntu-latest"
  gh api repos/actions/runner-images/contents/images/ubuntu/Ubuntu2404-Readme.md --jq '.content' | base64 -d | grep -m3 -i "Node.js 2\|^# \|OS Version"
  echo "# Eng so'nggi relizlar (gh api releases/latest):"
  for r in actions/checkout actions/setup-node; do echo "$r $(gh api repos/$r/releases/latest --jq '.tag_name + " " + .published_at')"; done
  echo "# actions/checkout README:"; gh api repos/actions/checkout/contents/README.md --jq '.content' | base64 -d | grep -i -m1 "checks-out"
  echo "# GitHub rasmiy Node.js andozasi (actions/starter-workflows ci/node.js.yml):"; gh api repos/actions/starter-workflows/contents/ci/node.js.yml --jq '.content' | base64 -d | grep -E "uses:|run:"
  echo "# GitHub Actions narxi (github/docs content/billing/concepts/product-billing/github-actions.md):"; gh api repos/github/docs/contents/content/billing/concepts/product-billing/github-actions.md --jq '.content' | base64 -d | grep -E -A2 "hosted runners is free:|^\* \*\*Private repositories:\*\*" | head -6; } > "$OUT/12-github-hujjat.txt" 2>&1
echo "[$(date +%T)] tayyor: $(ls "$OUT" | wc -l) fayl → $OUT"
