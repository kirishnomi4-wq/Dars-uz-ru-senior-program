#!/usr/bin/env bash
# server/ papkasini LMS'ning GitLab repo'siga (dars-api-coddy) sinxron qiladi.
#   Ishlatish:  bash scripts/sync-dars-api.sh [staging|main]      (default: staging)
# Qanday: ../dars-api-coddy klonini yangilaydi, server/ ni (sirlarsiz) ustiga ko'chiradi,
# monorepo SHA bilan commit qiladi va tanlangan shoxga push qiladi. Sirlar (.env, .env.deploy) hech qachon ketmaydi.
set -euo pipefail
BRANCH="${1:-staging}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLONE="$ROOT/../dars-api-coddy"
REMOTE="git@gitlab.com:kristinazatyosova-group/dars-api-coddy.git"
SHA="$(git -C "$ROOT" rev-parse --short HEAD)"
[ -d "$CLONE/.git" ] || git clone -q "$REMOTE" "$CLONE"
git -C "$CLONE" fetch -q origin
git -C "$CLONE" checkout -q -B "$BRANCH" "origin/$BRANCH" 2>/dev/null || git -C "$CLONE" checkout -q -B "$BRANCH" origin/main
# eski tarkibni tozalab (git va .env'larga tegmay) yangisini ko'chirish
find "$CLONE" -mindepth 1 -maxdepth 1 ! -name .git ! -name '.env' ! -name '.env.deploy' -exec rm -rf {} +
cp -a "$ROOT/server/." "$CLONE/"
rm -rf "$CLONE/node_modules" "$CLONE/coverage"
# barcha .env* sirlar tashqarida qoladi (faqat ikkita namuna ketadi)
find "$CLONE" -maxdepth 1 -name ".env*" ! -name ".env.example" ! -name ".env.deploy.example" -delete
find "$CLONE" -name '*.log' -not -path '*/.git/*' -delete
if git -C "$CLONE" status --porcelain | grep -q .; then
  git -C "$CLONE" add -A
  git -C "$CLONE" -c user.name="Azizbek Xayrullayev" -c user.email="azizbekyutub24@gmail.com" commit -q -m "sync: server/ @ monorepo $SHA"
  git -C "$CLONE" push -q origin "$BRANCH"
  echo "push qilindi → $BRANCH ($(git -C "$CLONE" rev-parse --short HEAD)), manba monorepo $SHA"
else
  echo "o'zgarish yo'q ($BRANCH allaqachon monorepo $SHA bilan bir xil)"
fi
