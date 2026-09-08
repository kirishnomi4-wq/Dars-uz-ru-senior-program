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
# DARVOZA (2026-09-08): Kristina GitLab'da kodni ham tahrirlaydi — bizning oxirgi commitimizdan keyin begona commit bo'lsa,
# avval `pull-dars-api.sh` bilan olinadi (aks holda quyidagi cp uning ishini yo'q qiladi). --force bilan chetlab o'tiladi.
LAST_OURS="$(git -C "$CLONE" log -1 --format=%H --author='Azizbek Xayrullayev' "origin/$BRANCH" 2>/dev/null || true)"
if [ -n "$LAST_OURS" ] && [ "${2:-}" != "--force" ]; then
  FOREIGN="$(git -C "$CLONE" rev-list --count "$LAST_OURS..origin/$BRANCH")"
  if [ "$FOREIGN" != 0 ]; then
    P="$(mktemp)"; git -C "$CLONE" diff "$LAST_OURS" "origin/$BRANCH" > "$P"
    if git -C "$ROOT" apply --directory=server --reverse --check "$P" 2>/dev/null; then
      echo "begona $FOREIGN commit bor, lekin server/ ularni allaqachon o'z ichiga oladi — davom"
    else
      echo "TO'XTADI: origin/$BRANCH da bizdan keyin $FOREIGN begona commit bor va server/ da yo'q — avval: bash scripts/pull-dars-api.sh $BRANCH"
      git -C "$CLONE" log --format='  %h %ad %an %s' --date=short "$LAST_OURS..origin/$BRANCH"; exit 3
    fi
  fi
fi
[ "${2:-}" = "--check" ] && { echo "darvoza OK (faqat tekshiruv, push yo'q)"; exit 0; }
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
