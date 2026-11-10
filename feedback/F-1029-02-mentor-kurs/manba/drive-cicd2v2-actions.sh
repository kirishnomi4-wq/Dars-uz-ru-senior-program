#!/usr/bin/env bash
# CI/CD-2 v2 — HAQIQIY GitHub Actions run'lari OrderBotNest'da (F-1104-21, 04.11): matrix (22/24, fail-fast), services: postgres + secrets bilan npm run smoke,
# secret nomi xato, secret maskasi, pull request tekshiruvi (PR → merge → main), README badge. Ruxsat: foydalanuvchi 04.11 «har dars teglari push» + workflow scope.
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-cicd2v2-actions.sh
# Sinov run'lari — `ci-sinov` tarmog'ida (davomidan, force push YO'Q); yakunda `lenta-smoke` tarmog'i → PR → merge → main = `cicd2-done`.
# Natija: manba/cicd2v2-out/NN-*.txt (run holati, job/step API'dan, annotatsiyalar, to'liq log) + cicd2v2-out/runlar.tsv + runlar-api.tsv
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/cicd2v2-out"; Y="$ROOT/feedback/F-1029-02-mentor-kurs/manba/cicd2v2-yml"
REPO=Azizbekcrypto/OrderBotNest; SRC=/home/kali/Desktop/order-bot
W="${S:?S=scratchpad kerak}/cicd2v2-actions"; mkdir -p "$OUT" "$W"
G(){ GIT_TERMINAL_PROMPT=0 GIT_ASKPASS= git -c credential.helper= -c credential.helper='!f() { echo username=Azizbekcrypto; echo "password=$(gh auth token --user Azizbekcrypto)"; }; f' -c user.name=Azizbekcrypto -c user.email=Azizbekcrypto@users.noreply.github.com "$@"; }
export GH_TOKEN=$(gh auth token --user Azizbekcrypto)

# run'ni yozib olish: $1 fayl nomi · $2 izoh · $3 run id · $4 tarmoq · $5 sha
rec(){ local f="$1" note="$2" id="$3" br="$4" sha="$5" concl url
  gh run watch "$id" -R "$REPO" -i 5 > /dev/null 2>&1 || true; sleep 2
  concl=$(gh run view "$id" -R "$REPO" --json conclusion -q .conclusion); url="https://github.com/$REPO/actions/runs/$id"
  { echo "# $note"; echo "# run $id · branch $br · commit ${sha:0:7} · natija: $concl · yozildi $(date '+%F %T %z')"; echo "# $url"; echo
    for y in .github/workflows/*.yml; do [ -f "$y" ] && { echo "\$ cat $y"; cat "$y"; echo; }; done
    echo "## gh run view"; gh run view "$id" -R "$REPO" 2>&1; echo
    echo "## job → step (API: actions/runs/$id/jobs)"
    gh api "repos/$REPO/actions/runs/$id/jobs" -q '.jobs[] | "JOB \(.name) · \(.conclusion) · \(.started_at) → \(.completed_at) · runner: \(.runner_name // "-") · \(.labels|join(","))", (.steps[] | "  \(.number). \(.name) · \(.conclusion) · \(.started_at) → \(.completed_at)")' 2>&1; echo
    echo "## annotatsiyalar (check-runs)"
    for j in $(gh api "repos/$REPO/actions/runs/$id/jobs" -q '.jobs[].id' 2>/dev/null); do gh api "repos/$REPO/check-runs/$j/annotations" -q '.[] | "  [\(.annotation_level)] \(.title // ""): \(.message)"' 2>/dev/null; done; echo
    echo "## to'liq log (gh run view --log)"; gh run view "$id" -R "$REPO" --log 2>&1 | sed -E 's/\x1b\[[0-9;]*m//g'
  } > "$OUT/$f.txt"
  gh api "repos/$REPO/actions/runs/$id" -q '[.id,.run_number,.display_title,.created_at,.updated_at,.run_started_at,.head_branch,.conclusion,.event]|@tsv' >> "$OUT/runlar-api.tsv"
  printf '%s\t%s\t%s\t%s\t%s\n' "$f" "$br" "${sha:0:7}" "$concl" "$url" >> "$OUT/runlar.tsv"; echo "[$(date +%T)] $f → $concl  $url"
}
# push → run (hodisa bo'yicha) paydo bo'lishini kutish → rec. $1 fayl · $2 izoh · $3 hodisa (push|pull_request)
pw(){ local f="$1" note="$2" ev="${3:-push}" br sha id i
  br=$(git rev-parse --abbrev-ref HEAD); sha=$(git rev-parse HEAD)
  if [ "$ev" = push ]; then
    if ! G push -q -u origin "$br" > "$W/push.log" 2>&1; then echo "[$(date +%T)] PUSH XATO ($f):"; cat "$W/push.log"; { echo "# $note"; echo "PUSH XATO:"; cat "$W/push.log"; } > "$OUT/$f.txt"; return 1; fi
  fi
  id=""; for i in $(seq 1 40); do id=$(gh run list -R "$REPO" --commit "$sha" --event "$ev" --workflow CI --json databaseId -q '.[0].databaseId' 2>/dev/null); [ -n "$id" ] && break; sleep 3; done
  if [ -z "$id" ]; then { echo "# $note"; echo "commit $sha ($br, $ev) — 120 s ichida run PAYDO BO'LMADI"; } > "$OUT/$f.txt"; printf '%s\t%s\t%s\t%s\t%s\n' "$f" "$br" "${sha:0:7}" "-" "run yo'q" >> "$OUT/runlar.tsv"; echo "[$(date +%T)] $f → run yo'q"; return; fi
  rec "$f" "$note" "$id" "$br" "$sha"
}
cm(){ git add -A; G commit -q -m "$1"; }
yml(){ mkdir -p .github/workflows; cp "$Y/$1" .github/workflows/ci.yml; }

rm -rf "$W/repo"; git clone -q "$SRC" "$W/repo"; cd "$W/repo"; git remote set-url origin "https://github.com/$REPO.git"
{ node --version; npm --version; gh --version | head -1; date; gh api /user -q .login; } > "$OUT/09-versiyalar-actions.txt"
[ "${PHASE:-rest}" = matrix ] && { : > "$OUT/runlar.tsv"; : > "$OUT/runlar-api.tsv"; }; true

# ---- ci-sinov: davomidan, cicd1-done holatiga qaytariladi ----
G fetch -q origin ci-sinov && git checkout -q -B ci-sinov FETCH_HEAD || git checkout -q -B ci-sinov cicd1-done
git checkout -q cicd1-done -- src package.json package-lock.json .github; rm -f .github/workflows/test.yml; git add -A; G commit -q -m "sinov: cicd1-done holatiga qaytarildi (test.yml olib tashlandi — har push ikki run berardi)" || true

# PHASE=matrix — 30, 31. PHASE=rest (odatiy) — 32, 33, (34 secret bo'lsa), PR 35–37. PHASE=secret — faqat 34 (foydalanuvchi secret yaratgach).
# Secret'ni skript YOZMAYDI (avto-rejim «Secret-Store Writes» rad etdi, 04.11) — foydalanuvchi bir marta:
#   GH_TOKEN=$(gh auth token --user Azizbekcrypto) gh secret set DATABASE_URL -R Azizbekcrypto/OrderBotNest -b 'postgresql://postgres:postgres@localhost:5432/shop'
PHASE="${PHASE:-rest}"
if [ "$PHASE" = matrix ]; then
  yml 1-matrix.yml; cm "sinov: matrix node 22/24 (fail-fast odatiy)"
  pw 30-matrix-fail-fast "matrix [22, 24]: 22 npm ci'da qizil (lock), 24 — fail-fast bekor qiladimi?"
  yml 2-matrix-fail-fast-false.yml; cm "sinov: matrix node 22/24, fail-fast: false"
  pw 31-matrix-ikkalasi "matrix [22, 24], fail-fast: false — 22 qizil, 24 yashil, ikkalasi oxirigacha"
  cat "$OUT/runlar.tsv"; exit 0
fi
HAS_SECRET=0; gh secret list -R "$REPO" 2>/dev/null | grep -q '^DATABASE_URL' && HAS_SECRET=1
{ echo '$ gh secret list -R Azizbekcrypto/OrderBotNest'; gh secret list -R "$REPO" 2>&1; echo; echo "# bor=$HAS_SECRET · qiymat (foydalanuvchi yaratsa): postgresql://postgres:postgres@localhost:5432/shop"; } > "$OUT/00-secret.txt"

if [ "$PHASE" = secret ]; then
  yml 5-secret-echo.yml; cm "sinov: secret echo — maska"
  pw 34-secret-echo "echo secret → *** maska; wc -c uzunlik; yo'q secret — bo'sh"
  git checkout -q main; cat "$OUT/runlar.tsv"; exit 0
fi
yml 3-smoke-services.yml; cm "sinov: smoke job — services: postgres:18, DATABASE_URL env (konteyner)"
pw 32-smoke-services "test → smoke (needs: test): Postgres xizmati, DATABASE_URL env, npm run smoke lentada"

yml 4-smoke-secret-xato.yml; cm "sinov: secrets.DATABSE_URL — nomi xato (secret bo'lmasa ham bo'sh)"
pw 33-smoke-secret-xato "secrets.DATABSE_URL (harf tushib qolgan) — DATABASE_URL bo'sh, smoke nima deydi"

if [ "$HAS_SECRET" = 1 ]; then yml 5-secret-echo.yml; cm "sinov: secret echo — maska"; pw 34-secret-echo "echo secret → *** maska; wc -c uzunlik; yo'q secret — bo'sh"; else echo "34: secret yo'q — keyin PHASE=secret"; fi

# ---- PR oqimi: main → lenta-smoke → PR → merge → main ----
git checkout -q main; git checkout -q -B lenta-smoke
yml 3-smoke-services.yml
if ! grep -q "actions/workflows/ci.yml/badge.svg" README.md; then
  printf '%s\n\n%s' "[![CI](https://github.com/$REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/$REPO/actions/workflows/ci.yml)" "$(cat README.md)" > README.md
fi
cm "ci: smoke job (services: postgres:18, DATABASE_URL secret) va README badge

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
pw 35-pr-tarmoq "lenta-smoke tarmog'iga push — push hodisasi run'i"
PR_URL=$(gh pr create -R "$REPO" --base main --head lenta-smoke --title "ci: smoke job (PostgreSQL xizmati) va README badge" --body "Lentaga ikkinchi job: \`smoke\` — \`services: postgres:18\`, \`DATABASE_URL\` secret'dan, \`npm run smoke\`. README'da lenta nishoni (badge). CI/CD-2 mentor darsi uchun (F-1104-21)." 2>&1 | tail -1)
echo "PR: $PR_URL"; PR_N=${PR_URL##*/}
pw 36-pr-checks "pull_request hodisasi run'i — PR sahifasidagi tekshiruv" pull_request
{ echo "\$ gh pr view $PR_N"; gh pr view "$PR_N" -R "$REPO" 2>&1; echo; echo "\$ gh pr checks $PR_N"; gh pr checks "$PR_N" -R "$REPO" 2>&1; echo
  echo "## API: pulls/$PR_N"; gh api "repos/$REPO/pulls/$PR_N" -q '{number, state, title, mergeable, mergeable_state, head: .head.ref, base: .base.ref, html_url}' 2>&1; } > "$OUT/36b-pr-holat.txt"
gh pr merge "$PR_N" -R "$REPO" --merge --subject "Merge pull request #$PR_N from Azizbekcrypto/lenta-smoke" 2>&1 | tail -2
sleep 3; G fetch -q origin main; git checkout -q main; git merge -q --ff-only origin/main; MSHA=$(git rev-parse HEAD)
id=""; for i in $(seq 1 40); do id=$(gh run list -R "$REPO" --commit "$MSHA" --event push --json databaseId -q '.[0].databaseId' 2>/dev/null); [ -n "$id" ] && break; sleep 3; done
[ -n "$id" ] && rec 37-main-merge "main: PR merge commit — test + smoke yashil (cicd2-done)" "$id" main "$MSHA" || echo "37: main run yo'q"
git tag -f cicd2-start cicd1-done; git tag -f cicd2-done "$MSHA"
G push -q origin cicd2-start cicd2-done 2>&1 | tail -1
cd "$SRC" && git fetch -q "$W/repo" main:refs/remotes/sinov/main && git merge -q --ff-only sinov/main && git fetch -q --force "$W/repo" --tags && git log --oneline -1 && git tag | tr '\n' ' '; echo
echo "tayyor: $OUT/runlar.tsv"; cat "$OUT/runlar.tsv"
