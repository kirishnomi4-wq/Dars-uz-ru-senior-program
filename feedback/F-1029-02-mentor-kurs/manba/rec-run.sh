#!/usr/bin/env bash
# Bitta GitHub Actions run'ini yozib olish (drive-cicd2v2-actions.sh dagi rec bilan bir xil format). 04.11.
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/rec-run.sh <out-papka> <fayl> <izoh> <run-id> <tarmoq> <sha>
#   masalan: … cicd2v2-out 30-matrix-fail-fast "matrix …" 41844123456 ci-sinov 09fe858
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/$1"; f="$2"; note="$3"; id="$4"; br="$5"; sha="$6"
REPO=Azizbekcrypto/OrderBotNest; W="${S:?S=scratchpad kerak}/cicd2v2-actions/repo"
export GH_TOKEN=$(gh auth token --user Azizbekcrypto)
cd "$W"; git checkout -q "$sha" 2>/dev/null || true
gh run watch "$id" -R "$REPO" -i 5 > /dev/null 2>&1 || true
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
git checkout -q - 2>/dev/null || true
# runlar.tsv / runlar-api.tsv: shu fayl nomi bo'lsa almashtiriladi
grep -v "^$f	" "$OUT/runlar.tsv" > "$OUT/runlar.tmp" 2>/dev/null; mv "$OUT/runlar.tmp" "$OUT/runlar.tsv"
printf '%s\t%s\t%s\t%s\t%s\n' "$f" "$br" "${sha:0:7}" "$concl" "$url" >> "$OUT/runlar.tsv"
gh api "repos/$REPO/actions/runs/$id" -q '[.id,.run_number,.display_title,.created_at,.updated_at,.run_started_at,.head_branch,.conclusion,.event]|@tsv' >> "$OUT/runlar-api.tsv"
echo "[$(date +%T)] $f → $concl  $url"
