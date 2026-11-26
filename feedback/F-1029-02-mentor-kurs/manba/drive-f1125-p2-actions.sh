#!/usr/bin/env bash
# F-1125-01 (26.11): 2-topshiriq workflow'larini HAQIQIY GitHub Actions'da sinash — CI/CD-1 p2 (ai1, ai2) va CI/CD-2 p2 (ai1, ai2).
# Ruxsat: foydalanuvchi 26.11 «Ha, ci-sinov ga push qil» (faqat OrderBotNest `ci-sinov` sinov tarmog'i; main'ga tegilmaydi).
# Qolip — drive-cicd1v2-actions-ai.sh / drive-cicd2v2-actions-ai.sh (04.11). ci-sinov kodi = cicd1-done (.github'dan tashqari farq 0),
# shuning uchun har sinovda faqat .github almashtiriladi: jest2-done (CI/CD-1 asosi) dan farqi — faqat ci.yml.
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-f1125-p2-actions.sh
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
M="$ROOT/feedback/F-1029-02-mentor-kurs/manba"
REPO=Azizbekcrypto/OrderBotNest
W="${S:?S=scratchpad kerak}/f1125-actions"
G(){ GIT_TERMINAL_PROMPT=0 GIT_ASKPASS= git -c credential.helper= -c credential.helper='!f() { echo username=Azizbekcrypto; echo "password=$(gh auth token --user Azizbekcrypto)"; }; f' -c user.name=Azizbekcrypto -c user.email=azizbekcrypto@users.noreply.github.com "$@"; }
export GH_TOKEN=$(gh auth token --user Azizbekcrypto)
mkdir -p "$W"
[ -d "$W/repo" ] || G clone -q --branch ci-sinov "https://github.com/$REPO.git" "$W/repo"
cd "$W/repo"; G fetch -q origin ci-sinov; git checkout -q ci-sinov; git reset -q --hard origin/ci-sinov
pw(){ local out="$1" note="$2" br sha id i concl url
  br=$(git rev-parse --abbrev-ref HEAD); sha=$(git rev-parse HEAD)
  if ! G push -q origin "$br" > "$W/push.log" 2>&1; then { echo "# $note"; echo "PUSH XATO:"; cat "$W/push.log"; } > "$out"; echo "[$(date +%T)] PUSH XATO ($out)"; return 1; fi
  id=""; for i in $(seq 1 40); do id=$(gh run list -R "$REPO" --commit "$sha" --json databaseId -q '.[0].databaseId' 2>/dev/null); [ -n "$id" ] && break; sleep 3; done
  if [ -z "$id" ]; then { echo "# $note"; echo "commit $sha ($br) — 120 s ichida run PAYDO BO'LMADI"; } > "$out"; echo "[$(date +%T)] run yo'q ($out)"; return 1; fi
  gh run watch "$id" -R "$REPO" -i 5 > /dev/null 2>&1 || true; sleep 2
  concl=$(gh run view "$id" -R "$REPO" --json conclusion -q .conclusion); url="https://github.com/$REPO/actions/runs/$id"
  { echo "# $note"; echo "# run $id · branch $br · commit ${sha:0:7} · natija: $concl · yozildi $(date '+%F %T %z')"; echo "# $url"; echo
    for y in .github/workflows/*.yml .github/workflows/*.yaml; do [ -f "$y" ] && { echo "\$ cat $y"; cat "$y"; echo; }; done
    echo "## gh run view"; gh run view "$id" -R "$REPO" 2>&1; echo
    echo "## job → step"; gh api "repos/$REPO/actions/runs/$id/jobs" -q '.jobs[] | "JOB \(.name) · \(.conclusion) · \(.started_at) → \(.completed_at)", (.steps[] | "  \(.number). \(.name) · \(.conclusion) · \(.started_at) → \(.completed_at)")' 2>&1; echo
    echo "## annotatsiyalar"; for j in $(gh api "repos/$REPO/actions/runs/$id/jobs" -q '.jobs[].id' 2>/dev/null); do gh api "repos/$REPO/check-runs/$j/annotations" -q '.[] | "  [\(.annotation_level)] \(.title // "") \(.message)"' 2>/dev/null; done; echo
    echo "## to'liq log"; gh run view "$id" -R "$REPO" --log 2>&1 | sed -E 's/\x1b\[[0-9;]*m//g'
  } > "$out"
  echo "[$(date +%T)] $(basename "$out") → $concl  $url"
}
sinov(){ local src="$1" out="$2" msg="$3" note="$4"
  # ci-sinov da .github/workflows ichida faqat ci.yml — ustidan yoziladi (o'chirish shart emas)
  [ "$(ls .github/workflows)" = "ci.yml" ] || { echo "kutilmagan workflow fayllari: $(ls .github/workflows)"; exit 1; }
  cp "$src" .github/workflows/ci.yml
  git add -A; G commit -q -m "$msg" || true
  pw "$out" "$note"
}
sinov "$M/cicd1v2-ai/p2/ai1/.github/workflows/ci.yml" "$M/cicd1v2-out/22-ai1-p2.txt" "sinov: CI/CD-1 2-topshiriq (CI tilida) — 1-AI ci.yml" "CI/CD-1 · 1-AI (Opus) · 2-topshiriq «CI tilida» · o'zgartirilmagan"
sinov "$M/cicd1v2-ai/p2/ai2/.github/workflows/ci.yml" "$M/cicd1v2-out/23-ai2-p2.txt" "sinov: CI/CD-1 2-topshiriq (CI tilida) — 2-AI ci.yml" "CI/CD-1 · 2-AI (Haiku) · 2-topshiriq «CI tilida» · o'zgartirilmagan"
sinov "$M/cicd2v2-ai/p2/ai1/.github/workflows/ci.yml" "$M/cicd2v2-out/42-ai1-p2.txt" "sinov: CI/CD-2 2-topshiriq (CI tilida) — 1-AI ci.yml" "CI/CD-2 · 1-AI (Opus) · 2-topshiriq «CI tilida» · o'zgartirilmagan"
sinov "$M/cicd2v2-ai/p2/ai2/.github/workflows/ci.yml" "$M/cicd2v2-out/43-ai2-p2.txt" "sinov: CI/CD-2 2-topshiriq (CI tilida) — 2-AI ci.yml" "CI/CD-2 · 2-AI (Haiku) · 2-topshiriq «CI tilida» · o'zgartirilmagan"
echo "tayyor"
