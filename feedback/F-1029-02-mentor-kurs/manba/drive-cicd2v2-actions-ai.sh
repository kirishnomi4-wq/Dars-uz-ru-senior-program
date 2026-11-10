#!/usr/bin/env bash
# CI/CD-2 v2 — AI yozgan workflow'larni (smoke + PostgreSQL) HAQIQIY GitHub Actions'da sinash (F-1104-21). drive-cicd2v2-actions.sh dan keyin, o'sha $W/repo da.
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-cicd2v2-actions-ai.sh
# Manba: manba/cicd2v2-ai/ai1, ai2 (.github/workflows/ci.yml — scratchpad nusxalaridan ko'chirilgan) → ci-sinov tarmog'iga alohida commit → run → cicd2v2-out/40-ai1.txt, 41-ai2.txt
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/cicd2v2-out"; AI="$ROOT/feedback/F-1029-02-mentor-kurs/manba/cicd2v2-ai"
REPO=Azizbekcrypto/OrderBotNest
W="${S:?S=scratchpad kerak}/cicd2v2-actions"
G(){ GIT_TERMINAL_PROMPT=0 GIT_ASKPASS= git -c credential.helper= -c credential.helper='!f() { echo username=Azizbekcrypto; echo "password=$(gh auth token --user Azizbekcrypto)"; }; f' -c user.name=Azizbekcrypto -c user.email=Azizbekcrypto@users.noreply.github.com "$@"; }
export GH_TOKEN=$(gh auth token --user Azizbekcrypto)
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
pw(){ local f="$1" note="$2" br sha id i
  br=$(git rev-parse --abbrev-ref HEAD); sha=$(git rev-parse HEAD)
  if ! G push -q -u origin "$br" > "$W/push.log" 2>&1; then { echo "# $note"; echo "PUSH XATO:"; cat "$W/push.log"; } > "$OUT/$f.txt"; echo "[$(date +%T)] PUSH XATO ($f)"; return 1; fi
  id=""; for i in $(seq 1 40); do id=$(gh run list -R "$REPO" --commit "$sha" --event push --json databaseId -q '.[0].databaseId' 2>/dev/null); [ -n "$id" ] && break; sleep 3; done
  if [ -z "$id" ]; then { echo "# $note"; echo "commit $sha ($br) — 120 s ichida run PAYDO BO'LMADI"; } > "$OUT/$f.txt"; echo "[$(date +%T)] $f → run yo'q"; return; fi
  rec "$f" "$note" "$id" "$br" "$sha"
}
cd "$W/repo"; G fetch -q origin ci-sinov; git checkout -q -B ci-sinov FETCH_HEAD
for n in ai1 ai2; do
  rm -rf .github; cp -r "$AI/$n/.github" . || { echo "$n: .github yo'q"; continue; }
  git add -A; G commit -q -m "sinov: AI yozgan workflow — smoke + PostgreSQL xizmati ($n)" || true
  pw "$([ "$n" = ai1 ] && echo 40-ai1 || echo 41-ai2)" "AI ($n) yozgan workflow — oddiy prompt, o'zgartirilmagan: services: postgres, env DATABASE_URL (secret'siz), smoke build'dan keyin"
done
git checkout -q main
echo "tayyor"; tail -2 "$OUT/runlar.tsv"
