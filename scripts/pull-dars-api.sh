#!/usr/bin/env bash
# GitLab (dars-api-coddy) dagi BEGONA commitlarni (Kristina) monorepo server/ ga oladi — sync'dan OLDIN yuritiladi.
#   bash scripts/pull-dars-api.sh [staging|main]      (default: staging)
# Qanday: origin/<shox>da bizning oxirgi sync-commitimizni topadi (muallif Azizbek), undan keyingi diff'ni
# server/ ga `git apply` qiladi (ishchi daraxtga; commit qilmaydi). Sirlarga tegmaydi. Mos kelmasa — patch faylini ko'rsatadi.
set -euo pipefail
BRANCH="${1:-staging}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLONE="$ROOT/../dars-api-coddy"
REMOTE="git@gitlab.com:kristinazatyosova-group/dars-api-coddy.git"
[ -d "$CLONE/.git" ] || git clone -q "$REMOTE" "$CLONE"
git -C "$CLONE" fetch -q origin
BASE="$(git -C "$CLONE" log -1 --format=%H --author='Azizbek Xayrullayev' "origin/$BRANCH")"
[ -n "$BASE" ] || { echo "origin/$BRANCH da bizning sync-commit topilmadi"; exit 1; }
N="$(git -C "$CLONE" rev-list --count "$BASE..origin/$BRANCH")"
if [ "$N" = 0 ]; then echo "begona commit yo'q (origin/$BRANCH = bizning $(git -C "$CLONE" rev-parse --short "$BASE"))"; exit 0; fi
echo "begona commitlar ($N):"; git -C "$CLONE" log --format='  %h %ad %an %s' --date=short "$BASE..origin/$BRANCH"
PATCH="$(mktemp)"; git -C "$CLONE" diff "$BASE" "origin/$BRANCH" > "$PATCH"
if git -C "$ROOT" apply --directory=server --reverse --check "$PATCH" 2>/dev/null; then
  echo "allaqachon qo'llangan — server/ bu commitlarni o'z ichiga oladi (sync qilish mumkin)"; exit 0
fi
if git -C "$ROOT" apply --directory=server --check "$PATCH"; then
  git -C "$ROOT" apply --directory=server "$PATCH"
  echo "server/ ga qo'llandi (ishchi daraxt). Fayllar:"; git -C "$ROOT" diff --stat -- server | tail -20
  echo "Keyin: testlar (cd server && npm test) → commit → sync-dars-api.sh $BRANCH"
else
  echo "MOS KELMADI — patch: $PATCH  (qo'lda ko'ring: git apply --directory=server --3way $PATCH)"; exit 2
fi
