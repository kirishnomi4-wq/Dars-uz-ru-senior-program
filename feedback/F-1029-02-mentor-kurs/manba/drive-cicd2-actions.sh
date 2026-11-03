#!/usr/bin/env bash
# CI/CD-2 (GitHub Actions) mentor darsi — HAQIQIY GitHub Actions run'lari (F-1029-02, 01.11.2026).
# Ruxsat: foydalanuvchi 01.11 10:55 — faqat YANGI sinov repo kirishnomi4-wq/mentor-ci-sinov (private). Boshqa repoga push YO'Q.
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-cicd2-actions.sh <qism>
#   qism: mashq | nest | yaml | matrix | cache | secret
# Natija: manba/cicd2-out/NN-*.txt (har run: holat, job/step ro'yxati API'dan, to'liq log) + cicd2-out/runlar.tsv (run linklari)
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/cicd2-out"
REPO=kirishnomi4-wq/mentor-ci-sinov
W="${S:?S=scratchpad kerak}/cicd2-actions"
mkdir -p "$OUT" "$W"
G(){ git -c credential.username=kirishnomi4-wq -c user.name=mentor-sinov -c user.email=mentor-sinov@users.noreply.github.com "$@"; }

# push → shu commit uchun run paydo bo'lishini kutish → tugashini kutish → yozib olish
# $1 = chiqish fayli (NN-nom), $2 = izoh (nima sinaldi)
pw(){
  local f="$1" note="$2" br sha id i
  br=$(git rev-parse --abbrev-ref HEAD); sha=$(git rev-parse HEAD)
  if ! G push -q -u origin "$br" > "$W/push.log" 2>&1; then echo "[$(date +%T)] PUSH XATO ($f):"; cat "$W/push.log"; fi
  id=""
  for i in $(seq 1 40); do
    id=$(gh run list -R "$REPO" --commit "$sha" --json databaseId -q '.[0].databaseId' 2>/dev/null)
    [ -n "$id" ] && break; sleep 3
  done
  if [ -z "$id" ]; then
    { echo "# $note"; echo "commit $sha ($br) — 120 s ichida run PAYDO BO'LMADI"; } > "$OUT/$f.txt"
    printf '%s\t%s\t%s\t%s\t%s\n' "$f" "$br" "${sha:0:7}" "-" "run yo'q" >> "$OUT/runlar.tsv"; return
  fi
  gh run watch "$id" -R "$REPO" -i 5 > /dev/null 2>&1 || true
  sleep 2
  local concl url
  concl=$(gh run view "$id" -R "$REPO" --json conclusion -q .conclusion)
  url="https://github.com/$REPO/actions/runs/$id"
  {
    echo "# $note"
    echo "# run $id · branch $br · commit ${sha:0:7} · natija: $concl · yozildi $(date '+%F %T %z')"
    echo "# $url"
    echo
    echo '$ cat .github/workflows/*.yml'; cat .github/workflows/*.yml 2>/dev/null; echo
    echo "## gh run view"; gh run view "$id" -R "$REPO" 2>&1; echo
    echo "## job → step (API: actions/runs/$id/jobs)"
    gh api "repos/$REPO/actions/runs/$id/jobs" -q '.jobs[] | "JOB \(.name) · \(.conclusion) · \(.started_at) → \(.completed_at) · runner: \(.runner_name // "-") · \(.labels|join(","))", (.steps[] | "  \(.number). \(.name) · \(.status)/\(.conclusion) · \(.started_at) → \(.completed_at)")' 2>&1
    echo
    echo "## annotatsiyalar (check-runs)"
    for j in $(gh api "repos/$REPO/actions/runs/$id/jobs" -q '.jobs[].id' 2>/dev/null); do
      gh api "repos/$REPO/check-runs/$j/annotations" -q '.[] | "  [\(.annotation_level)] \(.title // ""): \(.message)"' 2>/dev/null
    done
    echo
    echo "## to'liq log (gh run view --log)"
    gh run view "$id" -R "$REPO" --log 2>&1 | sed -E 's/\x1b\[[0-9;]*m//g'
  } > "$OUT/$f.txt"
  printf '%s\t%s\t%s\t%s\t%s\n' "$f" "$br" "${sha:0:7}" "$concl" "$url" >> "$OUT/runlar.tsv"
  echo "[$(date +%T)] $f → $concl  $url"
}
cm(){ git add -A; G commit -q -m "$1"; }
yml(){ mkdir -p .github/workflows; cat > .github/workflows/ci.yml; }

start_branch(){ # $1 = branch (orphan, toza)
  cd "$W/repo"; git checkout -q --orphan "$1" 2>/dev/null || { git checkout -q --detach 2>/dev/null; git branch -q -D "$1"; git checkout -q --orphan "$1"; }; git rm -rq --cached . 2>/dev/null; find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
}

if [ ! -d "$W/repo/.git" ]; then
  mkdir -p "$W/repo"; cd "$W/repo"; git init -q; git remote add origin "https://github.com/$REPO.git"
fi
cd "$W/repo"
{ node --version; npm --version; gh --version | head -1; git --version; date; } > "$OUT/09-versiyalar-actions.txt"

case "${1:?qism kerak}" in
# ─────────────────────────────────────────────────────────────
mashq) # o'quvchi m4c-03 «Repongiz yo'qmi?» — ci-mashq namunasi (package.json + ci.yml), lock fayl YO'Q
  start_branch mashq
  printf '# ci-mashq\n' > README.md
  printf '{\n  "name": "ci-mashq",\n  "version": "1.0.0",\n  "scripts": { "test": "echo ok && exit 0" }\n}\n' > package.json
  # 10: o'quvchi amaliyotidagi topshiriq aynan: on: push · runs-on · checkout@v4 · setup-node@v4 · npm install · npm test
  yml <<'Y'
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install
      - run: npm test
Y
  cm "ci: yo'l xaritasi (o'quvchi amaliyoti, @v4)"; pw 10-mashq-v4-yashil "ci-mashq + o'quvchi m4c-03 amaliyotidagi ci.yml (checkout@v4, setup-node@v4, npm install, npm test)"
  # 11: GitHub'ning tayyor Node andozasidagi kabi npm ci — lock fayl yo'q
  sed -i 's/run: npm install/run: npm ci/' .github/workflows/ci.yml
  cm "ci: npm ci (andozadagidek)"; pw 11-mashq-npm-ci-lock-yoq "ci-mashq: npm install o'rniga npm ci (GitHub Node andozasi), package-lock.json yo'q"
  sed -i 's/run: npm ci/run: npm install/' .github/workflows/ci.yml
  # 12: uyga vazifadagi «testni ataylab buzing» — namunada test doim exit 0; buzish uchun skript exit 1
  sed -i 's/echo ok \&\& exit 0/echo xato \&\& exit 1/' package.json
  cm "sinov: test ataylab buzildi"; pw 12-mashq-test-qizil "ci-mashq: \"test\": \"echo xato && exit 1\""
  sed -i 's/echo xato \&\& exit 1/echo ok \&\& exit 0/' package.json
  # 13: checkout'siz (m4c-01 amaliyotidagi ci.yml kabi)
  yml <<'Y'
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-node@v4
      - run: npm install
      - run: npm test
Y
  cm "ci: checkout'siz"; pw 13-mashq-checkoutsiz "ci-mashq: actions/checkout qadami yo'q"
  # 14: test qadami yo'q (o'quvchi s18 holati: SKANER tashlab ketilgan) — run qanday rangda?
  yml <<'Y'
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install
Y
  cm "ci: test qadamisiz"; pw 14-mashq-testsiz "ci-mashq: npm test qadami yo'q (o'quvchi s18: SKANER tashlab ketilgan)"
  # 15: tartib xato — test install'dan oldin (namunada dependency yo'q)
  yml <<'Y'
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
      - run: npm install
      - run: npm test
Y
  cm "ci: v7, node 22"; pw 15-mashq-v7-yashil "ci-mashq: checkout@v7, setup-node@v7 (node-version: 22) — tavsiya"
  # 16–17: o'quvchi s17 «Yo'l xaritasini yozing» dagi begona qatorlar — haqiqiy Actions'da nima bo'ladi
  yml <<'Y'
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
      - run: npm install
      - run: print('test')
      - run: npm test
Y
  cm "ci: print('test') qatori"; pw 16-mashq-print-test "ci-mashq: steps ichida run: print('test') (o'quvchi s17 begona qatori)"
  yml <<'Y'
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
      - run: npm install
      - run: git push
      - run: npm test
Y
  cm "ci: git push qatori"; pw 17-mashq-git-push "ci-mashq: steps ichida run: git push (o'quvchi s17 begona qatori)"
  ;;
# ─────────────────────────────────────────────────────────────
nest) # o'quvchi reposi IntroNestArxitechture (45071ac) + Jest-1 order testi, CI/CD-1 tavsiya ci.yml (main tarmog'i, ketma-ket)
  start_branch main
  rm -rf "$W/nest-src"; git clone -q https://github.com/Azizbekcrypto/IntroNestArxitechture.git "$W/nest-src"
  git -C "$W/nest-src" checkout -q 45071ac
  ( cd "$W/nest-src" && git archive HEAD ) | tar -x -C .
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
  yml <<'Y'
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
      - run: npm install
      - run: npm test
      - run: npm run build
Y
  cm "ci: lenta (CI/CD-1 tavsiya)"; pw 20-nest-yashil "o'quvchi reposi + order testi + CI/CD-1 tavsiya ci.yml (v7, Node 22, install, test, build)"
  sed -i 's/price \* quantity/price + quantity/' src/order.ts
  cm "sinov: buzildi"; pw 21-nest-test-qizil "o'quvchi reposi: order.ts price * quantity → price + quantity"
  sed -i 's/price + quantity/price * quantity/' src/order.ts
  cm "tuzatildi"; pw 22-nest-tuzatildi-yashil "o'quvchi reposi: tuzatildi (price * quantity)"
  sed -i 's/run: npm install/run: npm ci/' .github/workflows/ci.yml
  cm "ci: npm ci"; pw 23-nest-npm-ci "o'quvchi reposi: npm install o'rniga npm ci (lock eskirgan)"
  # 24: tartib xato — npm test install'dan oldin
  yml <<'Y'
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
      - run: npm test
      - run: npm install
      - run: npm run build
Y
  cm "ci: tartib xato"; pw 24-nest-tartib-xato "o'quvchi reposi: npm test npm install'dan OLDIN"
  # 25: o'quvchi darsidagi @v4 — o'quvchi reposida
  yml <<'Y'
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install
      - run: npm test
      - run: npm run build
Y
  cm "ci: v4 (o'quvchi darsidagi)"; pw 25-nest-v4 "o'quvchi reposi: checkout@v4 + setup-node@v4 (node-version'siz) — o'quvchi m4c-03 dagi"
  # 26: tavsiyaga qaytish (main oxiri yashil bo'lsin)
  yml <<'Y'
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
      - run: npm install
      - run: npm test
      - run: npm run build
Y
  cm "ci: tavsiya"; pw 26-nest-tavsiya-yashil "o'quvchi reposi: tavsiya ci.yml qaytarildi"
  ;;
# ─────────────────────────────────────────────────────────────
yaml) # YAML xatolari GitHub'da: run boshlanadimi, Actions nima deydi
  start_branch yaml
  printf '{\n  "name": "ci-mashq",\n  "version": "1.0.0",\n  "scripts": { "test": "echo ok && exit 0" }\n}\n' > package.json
  yml <<'Y'
name: CI
on: once
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - run: npm test
Y
  cm "yaml: on once"; pw 30-yaml-on-once "ci.yml: on: once (o'quvchi darsidagi noto'g'ri variant)"
  yml <<'Y'
name: CI
on: push
jobs:
  test:
    steps:
      - uses: actions/checkout@v7
      - run: npm test
Y
  cm "yaml: runs-on yoq"; pw 31-yaml-runs-on-yoq "ci.yml: runs-on qatori yo'q"
  yml <<'Y'
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
    - run: npm test
Y
  cm "yaml: surilish"; pw 32-yaml-surilish "ci.yml: - run: npm test noto'g'ri surilgan (2 bo'sh joy chapga)"
  yml <<'Y'
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - run: echo "Natija: ok"
Y
  cm "yaml: echo ichida ikki nuqta"; pw 34-yaml-echo-ikki-nuqta "ci.yml: run: echo \"Natija: ok\" — qo'shtirnoqsiz qatorda «: »"
  yml <<'Y'
name: CI
on: push
jobs:
  test:
    runs-on: my-laptop
    steps:
      - uses: actions/checkout@v7
      - run: npm test
Y
  cm "yaml: runs-on my-laptop"; G push -q -u origin yaml 2>&1 | grep -v '^remote:' || true
  # my-laptop: run «kutadi» (bunday runner yo'q) — 3 daqiqa kuzatib, holatini yozamiz va bekor qilamiz
  sha=$(git rev-parse HEAD); id=""
  for i in $(seq 1 40); do id=$(gh run list -R "$REPO" --commit "$sha" --json databaseId -q '.[0].databaseId'); [ -n "$id" ] && break; sleep 3; done
  { echo "# ci.yml: runs-on: my-laptop (o'quvchi darsidagi noto'g'ri variant) — bunday runner yo'q"; echo "# run $id · commit ${sha:0:7}"; echo "# https://github.com/$REPO/actions/runs/$id"; echo
    cat .github/workflows/ci.yml; echo
    for t in 20 60 180; do sleep $(( t - ${prev:-0} )); prev=$t; echo "## ${t} s dan keyin: $(gh run view "$id" -R "$REPO" --json status,conclusion -q '"status=\(.status) conclusion=\(.conclusion)"')"; done
    echo; gh run view "$id" -R "$REPO" 2>&1
    gh api "repos/$REPO/actions/runs/$id/jobs" -q '.jobs[] | "JOB \(.name) · status=\(.status) · labels=\(.labels|join(","))"'
    echo; echo "## bekor qilindi: gh run cancel"; gh run cancel "$id" -R "$REPO" 2>&1; sleep 8
    gh run view "$id" -R "$REPO" --json status,conclusion -q '"status=\(.status) conclusion=\(.conclusion)"'
  } > "$OUT/33-yaml-runs-on-my-laptop.txt"
  printf '%s\t%s\t%s\t%s\t%s\n' 33-yaml-runs-on-my-laptop yaml "${sha:0:7}" "queued→cancelled" "https://github.com/$REPO/actions/runs/$id" >> "$OUT/runlar.tsv"
  echo "[$(date +%T)] 33 → my-laptop yozildi"
  ;;
# ─────────────────────────────────────────────────────────────
matrix) # o'quvchi s13: matrix node: [18, 20, 22] — setup-node'ga ulanmagan bo'lsa nima bo'ladi
  start_branch matrix
  printf '{\n  "name": "ci-mashq",\n  "version": "1.0.0",\n  "scripts": { "test": "node --version && echo ok" }\n}\n' > package.json
  yml <<'Y'
name: CI
on: push
jobs:
  test:
    strategy:
      matrix:
        node: [18, 20, 22]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
      - run: npm test
Y
  cm "matrix: o'quvchi darsidagidek"; pw 40-matrix-ulanmagan "matrix node: [18, 20, 22] — o'quvchi s13 dagidek; setup-node'da node-version yo'q"
  yml <<'Y'
name: CI
on: push
jobs:
  test:
    strategy:
      matrix:
        node: [18, 20, 22]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: ${{ matrix.node }}
      - run: npm test
Y
  cm "matrix: node-version ulandi"; pw 41-matrix-ulangan "matrix: node-version: \${{ matrix.node }}"
  ;;
# ─────────────────────────────────────────────────────────────
cache) # o'quvchi s14: actions/cache@v4 + path: node_modules (key yo'q) · setup-node cache: npm bilan o'lchov — o'quvchi reposida
  start_branch cache
  ( cd "$W/nest-src" && git archive HEAD ) | tar -x -C .
  yml <<'Y'
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
      - uses: actions/cache@v4
        with:
          path: node_modules
      - run: npm install
      - run: npm run build
Y
  cm "cache: o'quvchi darsidagidek"; pw 50-cache-keysiz "o'quvchi s14: actions/cache@v4, path: node_modules, key YO'Q"
  yml <<'Y'
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
      - run: npm install
      - run: npm run build
Y
  cm "cache: cache'siz o'lchov"; pw 51-cache-yoq "o'quvchi reposi: cache'siz — npm install vaqti"
  yml <<'Y'
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm
      - run: npm install
      - run: npm run build
Y
  cm "cache: setup-node cache npm (1)"; pw 52-cache-npm-birinchi "setup-node cache: npm — 1-run (kesh hali yo'q)"
  date > .cache-sinov; cm "cache: 2-run"; pw 53-cache-npm-ikkinchi "setup-node cache: npm — 2-run (kesh bor)"
  ;;
# ─────────────────────────────────────────────────────────────
secret) # o'quvchi s16: secrets — logda ko'rinadimi
  start_branch secret
  printf 'sk_test_mentor_sinov_7f3a' | gh secret set API_KEY -R "$REPO"
  echo "# gh secret set API_KEY (qiymat: soxta sinov qiymati sk_test_mentor_sinov_7f3a)" > "$OUT/60-secret-qoyildi.txt"
  gh secret list -R "$REPO" >> "$OUT/60-secret-qoyildi.txt" 2>&1
  yml <<'Y'
name: CI
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Kalit: ${{ secrets.API_KEY }}"
      - env:
          API_KEY: ${{ secrets.API_KEY }}
        run: |
          echo "Uzunligi: ${#API_KEY}"
          echo "Bo'lib yozilsa: ${API_KEY:0:7} ${API_KEY:7}"
      - run: |
          echo "Yo'q secret: [${{ secrets.YOQ_KALIT }}]"
Y
  cm "secret: logda"; pw 61-secret-logda "secrets.API_KEY logga chiqarilsa; bo'laklab chiqarilsa; yo'q secret"
  ;;
# ─────────────────────────────────────────────────────────────
papka) # CI/CD-1 C11: «Actions bo'sh» — papka nomi xato (.github/workflow, s harfisiz) → run paydo bo'ladimi
  start_branch papka
  printf '{\n  "name": "ci-mashq",\n  "version": "1.0.0",\n  "scripts": { "test": "echo ok && exit 0" }\n}\n' > package.json
  mkdir -p .github/workflow
  printf 'name: CI\non: push\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v7\n      - run: npm test\n' > .github/workflow/ci.yml
  cm "papka: .github/workflow (s yo'q)"; G push -q -u origin papka > "$W/push.log" 2>&1 || cat "$W/push.log"
  sha=$(git rev-parse HEAD); sleep 90
  { echo "# CI/CD-1 C11: ci.yml noto'g'ri papkada — .github/workflow/ci.yml (workflows emas)"; echo "# commit ${sha:0:7} · branch papka · tekshirildi $(date '+%F %T %z') (push'dan 90 s keyin)"; echo
    echo '$ find .github -type f'; find .github -type f; echo
    echo "## gh run list --commit ${sha:0:7}"; gh run list -R "$REPO" --commit "$sha" 2>&1; echo "(soni: $(gh run list -R "$REPO" --commit "$sha" --json databaseId -q 'length'))"
    echo; echo "## gh workflow list"; gh workflow list -R "$REPO" 2>&1
  } > "$OUT/18-papka-nomi-xato.txt"
  printf '%s\t%s\t%s\t%s\t%s\n' 18-papka-nomi-xato papka "${sha:0:7}" "run yo'q" "-" >> "$OUT/runlar.tsv"
  echo "[$(date +%T)] 18 → papka yozildi"
  ;;
*) echo "noma'lum qism: $1"; exit 2;;
esac
