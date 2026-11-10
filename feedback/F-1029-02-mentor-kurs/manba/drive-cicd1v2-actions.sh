#!/usr/bin/env bash
# CI/CD-1 v2 — HAQIQIY GitHub Actions run'lari OrderBotNest'da (F-1104-20, 04.11). Ruxsat: foydalanuvchi 04.11 «har dars teglari push» + workflow scope (gh auth refresh).
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-cicd1v2-actions.sh
# 04.11 18:00: node-version 22 → 24 (runner npm 10 lock faylni o'qiy olmadi — 10a, 03d); main/ci-sinov qayta yozildi (force).
# Qizil run'lar — `ci-sinov` tarmog'ida (main toza qoladi); yakunda main ← ci.yml (1-tavsiya) = `cicd1-done` → yashil run.
# Natija: manba/cicd1v2-out/1N-*.txt (run holati, job/step API'dan, annotatsiyalar, to'liq log) + cicd1v2-out/runlar.tsv
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/cicd1v2-out"; Y="$ROOT/feedback/F-1029-02-mentor-kurs/manba/cicd1v2-yml"
REPO=Azizbekcrypto/OrderBotNest; SRC=/home/kali/Desktop/order-bot
W="${S:?S=scratchpad kerak}/cicd1v2-actions"; mkdir -p "$OUT" "$W"
G(){ GIT_TERMINAL_PROMPT=0 GIT_ASKPASS= git -c credential.helper= -c credential.helper='!f() { echo username=Azizbekcrypto; echo "password=$(gh auth token --user Azizbekcrypto)"; }; f' -c user.name=Azizbekcrypto -c user.email=Azizbekcrypto@users.noreply.github.com "$@"; }
export GH_TOKEN=$(gh auth token --user Azizbekcrypto)

pw(){ # push → run paydo bo'lishini kutish → tugashini kutish → yozib olish. $1 = fayl nomi, $2 = izoh
  local f="$1" note="$2" br sha id i
  br=$(git rev-parse --abbrev-ref HEAD); sha=$(git rev-parse HEAD)
  if ! G push -q -u origin "$br" > "$W/push.log" 2>&1; then echo "[$(date +%T)] PUSH XATO ($f):"; cat "$W/push.log"; { echo "# $note"; echo "PUSH XATO:"; cat "$W/push.log"; } > "$OUT/$f.txt"; return 1; fi
  id=""
  for i in $(seq 1 40); do id=$(gh run list -R "$REPO" --commit "$sha" --json databaseId -q '.[0].databaseId' 2>/dev/null); [ -n "$id" ] && break; sleep 3; done
  if [ -z "$id" ]; then { echo "# $note"; echo "commit $sha ($br) — 120 s ichida run PAYDO BO'LMADI"; } > "$OUT/$f.txt"; printf '%s\t%s\t%s\t%s\t%s\n' "$f" "$br" "${sha:0:7}" "-" "run yo'q" >> "$OUT/runlar.tsv"; echo "[$(date +%T)] $f → run yo'q"; return; fi
  gh run watch "$id" -R "$REPO" -i 5 > /dev/null 2>&1 || true
  sleep 2
  local concl url; concl=$(gh run view "$id" -R "$REPO" --json conclusion -q .conclusion); url="https://github.com/$REPO/actions/runs/$id"
  {
    echo "# $note"; echo "# run $id · branch $br · commit ${sha:0:7} · natija: $concl · yozildi $(date '+%F %T %z')"; echo "# $url"; echo
    echo '$ cat .github/workflows/ci.yml'; cat .github/workflows/ci.yml 2>/dev/null; echo
    echo "## gh run view"; gh run view "$id" -R "$REPO" 2>&1; echo
    echo "## job → step (API: actions/runs/$id/jobs)"
    gh api "repos/$REPO/actions/runs/$id/jobs" -q '.jobs[] | "JOB \(.name) · \(.conclusion) · \(.started_at) → \(.completed_at) · runner: \(.runner_name // "-") · \(.labels|join(","))", (.steps[] | "  \(.number). \(.name) · \(.conclusion) · \(.started_at) → \(.completed_at)")' 2>&1; echo
    echo "## annotatsiyalar (check-runs)"
    for j in $(gh api "repos/$REPO/actions/runs/$id/jobs" -q '.jobs[].id' 2>/dev/null); do gh api "repos/$REPO/check-runs/$j/annotations" -q '.[] | "  [\(.annotation_level)] \(.title // ""): \(.message)"' 2>/dev/null; done; echo
    echo "## to'liq log (gh run view --log)"; gh run view "$id" -R "$REPO" --log 2>&1 | sed -E 's/\x1b\[[0-9;]*m//g'
  } > "$OUT/$f.txt"
  printf '%s\t%s\t%s\t%s\t%s\n' "$f" "$br" "${sha:0:7}" "$concl" "$url" >> "$OUT/runlar.tsv"
  echo "[$(date +%T)] $f → $concl  $url"
}
cm(){ git add -A; G commit -q -m "$1"; }
yml(){ mkdir -p .github/workflows; cp "$Y/$1" .github/workflows/ci.yml; }

rm -rf "$W/repo"; git clone -q "$SRC" "$W/repo"; cd "$W/repo"; git remote set-url origin "https://github.com/$REPO.git"
{ node --version; npm --version; gh --version | head -1; date; gh api /user -q .login; } > "$OUT/09-versiyalar-actions.txt"
: > "$OUT/runlar.tsv"

# ---- ci-sinov tarmog'i (jest2-done dan) ----
# 04.11 18:10: force push yo'q — ci-sinov GitHub'dagi davomidan (eski run'lar 10–17 node 22 bilan qizil edi); src/package.json jest2-done holatiga qaytariladi
G fetch -q origin ci-sinov && git checkout -q -B ci-sinov FETCH_HEAD || git checkout -q -B ci-sinov jest2-done
git checkout -q jest2-done -- src package.json package-lock.json; git add -A; G commit -q -m "sinov: src/package.json jest2-done holatiga qaytarildi" || true
yml 1-tavsiya.yml; cm "ci: lenta — npm ci · tsc · test · build"
pw 10-yashil "Tavsiya ci.yml (checkout · setup-node 24 cache npm · npm ci · tsc · test · build) — toza kodda"

sed -i 's/        if (p.stock < c.qty) {/        if (p.stock <= c.qty) {/' src/api/order/order.service.ts; cm "sinov: chegara buzildi (< → <=)"
pw 11-test-qizil "Test qizil — lenta npm test qadamida to'xtaydi, build yurmaydi"
git checkout -q jest2-done -- src  # HEAD emas (HEAD'da buzuq kod commit qilingan) — 18:10 tuzatish

yml 2-checkout-yoq.yml; cm "sinov: checkout qadami yo'q"
pw 12-checkout-yoq "actions/checkout yo'q — mashinada repo yo'q, npm ci nima deydi"

yml 1-tavsiya.yml; sed -i 's/"telegraf": "^4.16.3"/"telegraf": "4.16.0"/' package.json; cm "sinov: package.json lock bilan sinxron emas"
pw 13-npm-ci-lock "package.json telegraf 4.16.0, lock 4.16.3 — npm ci «in sync» xatosi lentada"
git checkout -q jest2-done -- package.json

yml 6-tsc-yoq.yml; sed -i "s/  const telegram_id = String(from.id);/  const telegram_id = from.id;/" src/api/user/user.service.ts; cm "sinov: tsc qadami yo'q + tur xatosi"
pw 14-tsc-yoq-yashil "tsc qadamisiz lenta: tur xatosi bor, lekin test yashil — lenta YASHIL (yolg'on)"
yml 1-tavsiya.yml; cm "sinov: tsc qadami bor + tur xatosi"
pw 15-tsc-bor-qizil "tsc qadami bilan o'sha kod — lenta tsc da QIZIL"
git checkout -q jest2-done -- src

yml 3-runs-on-yoq.yml; cm "sinov: runs-on yo'q"
pw 16-runs-on-yoq "runs-on yo'q — GitHub workflow faylini o'qiy olmaydi (parse xatosi)"

yml 4-surilish-xato.yml; cm "sinov: YAML surilish xatosi"
pw 17-surilish-xato "YAML surilish xatosi — parse xatosi"

# ---- main: cicd1-done = ci.yml (tavsiya) ----
git checkout -q main; git tag -f cicd1-start jest2-done
# 04.11 18:05: main'da 5bd3a38 (node 22) allaqachon bor — tarix qayta yozilmaydi, ustiga tuzatish-commit, teg oldinga suriladi
yml 1-tavsiya.yml; cm "cicd1-done: node-version 24 — runner'dagi npm 10 lock faylni o'qiy olmadi (Missing: webpack@5.112.2), mashinadagi node bilan bir xil

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
git tag -f cicd1-done
pw 18-main-yashil "main: cicd1-done — tavsiya ci.yml (node 24), yashil"
G push -q origin cicd1-start 2>&1 | tail -1
if ! G push -q origin cicd1-done 2>"$W/tag.log"; then echo "TEG cicd1-done GitHub'da eski commit'da (5bd3a38) — force kerak. Foydalanuvchi: cd /home/kali/Desktop/order-bot && git push -f origin cicd1-done"; tail -1 "$W/tag.log"; fi
# lokal repoga ham: main va teglar
cd "$SRC" && git fetch -q "$W/repo" main:refs/remotes/sinov/main && git merge -q --ff-only sinov/main && git fetch -q --force "$W/repo" --tags && git log --oneline -1 && git tag | tr '\n' ' '; echo
echo "tayyor: $OUT/runlar.tsv"; cat "$OUT/runlar.tsv"
