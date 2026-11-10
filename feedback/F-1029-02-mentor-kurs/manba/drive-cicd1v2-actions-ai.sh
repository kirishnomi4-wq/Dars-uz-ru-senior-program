#!/usr/bin/env bash
# CI/CD-1 v2 — AI yozgan workflow'larni HAQIQIY GitHub Actions'da sinash (F-1104-20). drive-cicd1v2-actions.sh dan keyin, o'sha $W/repo da.
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-cicd1v2-actions-ai.sh
# Manba: scratchpad cicd1-ai1, cicd1-ai2 (.github/workflows/*.yml) → ci-sinov tarmog'iga alohida commit → run → cicd1v2-out/19-ai1.txt, 20-ai2.txt
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/cicd1v2-out"; AI="$ROOT/feedback/F-1029-02-mentor-kurs/manba/cicd1v2-ai"
REPO=Azizbekcrypto/OrderBotNest
W="${S:?S=scratchpad kerak}/cicd1v2-actions"
G(){ GIT_TERMINAL_PROMPT=0 GIT_ASKPASS= git -c credential.helper= -c credential.helper='!f() { echo username=Azizbekcrypto; echo "password=$(gh auth token --user Azizbekcrypto)"; }; f' -c user.name=Azizbekcrypto -c user.email=Azizbekcrypto@users.noreply.github.com "$@"; }
export GH_TOKEN=$(gh auth token --user Azizbekcrypto)
pw(){ local f="$1" note="$2" br sha id i
  br=$(git rev-parse --abbrev-ref HEAD); sha=$(git rev-parse HEAD)
  if ! G push -q -u origin "$br" > "$W/push.log" 2>&1; then { echo "# $note"; echo "PUSH XATO:"; cat "$W/push.log"; } > "$OUT/$f.txt"; echo "[$(date +%T)] PUSH XATO ($f)"; return 1; fi
  id=""; for i in $(seq 1 40); do id=$(gh run list -R "$REPO" --commit "$sha" --json databaseId -q '.[0].databaseId' 2>/dev/null); [ -n "$id" ] && break; sleep 3; done
  if [ -z "$id" ]; then { echo "# $note"; echo "commit $sha ($br) — 120 s ichida run PAYDO BO'LMADI"; } > "$OUT/$f.txt"; printf '%s\t%s\t%s\t%s\t%s\n' "$f" "$br" "${sha:0:7}" "-" "run yo'q" >> "$OUT/runlar.tsv"; echo "[$(date +%T)] $f → run yo'q"; return; fi
  gh run watch "$id" -R "$REPO" -i 5 > /dev/null 2>&1 || true; sleep 2
  local concl url; concl=$(gh run view "$id" -R "$REPO" --json conclusion -q .conclusion); url="https://github.com/$REPO/actions/runs/$id"
  { echo "# $note"; echo "# run $id · branch $br · commit ${sha:0:7} · natija: $concl · yozildi $(date '+%F %T %z')"; echo "# $url"; echo
    for y in .github/workflows/*.yml .github/workflows/*.yaml; do [ -f "$y" ] && { echo "\$ cat $y"; cat "$y"; echo; }; done
    echo "## gh run view"; gh run view "$id" -R "$REPO" 2>&1; echo
    echo "## job → step"; gh api "repos/$REPO/actions/runs/$id/jobs" -q '.jobs[] | "JOB \(.name) · \(.conclusion) · \(.started_at) → \(.completed_at)", (.steps[] | "  \(.number). \(.name) · \(.conclusion) · \(.started_at) → \(.completed_at)")' 2>&1; echo
    echo "## annotatsiyalar"; for j in $(gh api "repos/$REPO/actions/runs/$id/jobs" -q '.jobs[].id' 2>/dev/null); do gh api "repos/$REPO/check-runs/$j/annotations" -q '.[] | "  [\(.annotation_level)] \(.title // ""): \(.message)"' 2>/dev/null; done; echo
    echo "## to'liq log"; gh run view "$id" -R "$REPO" --log 2>&1 | sed -E 's/\x1b\[[0-9;]*m//g'
  } > "$OUT/$f.txt"
  printf '%s\t%s\t%s\t%s\t%s\n' "$f" "$br" "${sha:0:7}" "$concl" "$url" >> "$OUT/runlar.tsv"; echo "[$(date +%T)] $f → $concl  $url"
}
cd "$W/repo"; git checkout -q ci-sinov
for n in ai1 ai2; do
  mkdir -p "$AI/$n"; (cd "$S/cicd1-$n" && git status --short > "$AI/$n/git-status.txt"; git add -A -N . 2>/dev/null; git diff --stat > "$AI/$n/diff-stat.txt"; git diff > "$AI/$n/diff.patch"; git reset -q 2>/dev/null; cp -r .github "$AI/$n/" 2>/dev/null)
  rm -rf .github; cp -r "$S/cicd1-$n/.github" . 2>/dev/null || { echo "$n: .github yo'q"; continue; }
  git add -A; G commit -q -m "sinov: AI yozgan workflow ($n)" || true
  pw "$([ "$n" = ai1 ] && echo 19-ai1 || echo 20-ai2)" "AI ($n) yozgan workflow — oddiy prompt, o'zgartirilmagan"
done
# 21 — AI (ai1) workflow'ida faqat node-version 22 → 24 tuzatilsa (mashinadagi node) — yashilmi?
rm -rf .github; cp -r "$S/cicd1-ai1/.github" .; sed -i 's/node-version: 22/node-version: 24/' .github/workflows/*.yml
git add -A; G commit -q -m "sinov: AI (ai1) workflow, node-version 22 → 24" || true
pw 21-ai1-node24 "AI (ai1) yozgan workflow — faqat node-version 22 → 24 tuzatildi (mashinadagi node)"
git checkout -q main
echo "tayyor"; tail -3 "$OUT/runlar.tsv"
