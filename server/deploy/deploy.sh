#!/usr/bin/env bash
# deploy.sh — SERVERDA yuradi (root yoki sudo). Bitta muhitni yangi git-ref'ga ko'taradi.
#   sudo /opt/dars-api/bin/deploy.sh staging main
#   sudo /opt/dars-api/bin/deploy.sh prod  v0.3.0
# Qadamlar: fetch → checkout → npm ci → migrate (env-fayl bilan) → restart → health. Har qadam xato bo'lsa to'xtaydi.
# Oldingi commit /opt/dars-api/<env>/PREV da; qaytish: deploy.sh <env> $(cat /opt/dars-api/<env>/PREV)
# Eslatma: migratsiya orqaga qaytmaydi — DDL o'zgarishlar orqaga mos yoziladi (ustun o'chirish alohida relizda).
set -euo pipefail

ENV_NAME="${1:-}"; REF="${2:-main}"
case "$ENV_NAME" in prod|staging) ;; *) echo "foydalanish: deploy.sh <prod|staging> [git-ref]"; exit 2;; esac

BASE="/opt/dars-api/$ENV_NAME"
REPO="$BASE/repo"
ENV_FILE="/etc/dars-api/$ENV_NAME.env"
SERVICE="dars-api@$ENV_NAME"
PORT=$( [ "$ENV_NAME" = prod ] && echo 3001 || echo 3002 )
LOG="/var/log/dars-api/deploy-$ENV_NAME.log"

mkdir -p "$(dirname "$LOG")"
exec > >(tee -a "$LOG") 2>&1
echo "== $(date -Is) deploy $ENV_NAME ref=$REF by ${SUDO_USER:-$USER}"

[ -f "$ENV_FILE" ] || { echo "env-fayl yo'q: $ENV_FILE"; exit 1; }
[ -d "$REPO/.git" ] || { echo "repo yo'q: $REPO (setup-droplet.sh yurgizilganmi?)"; exit 1; }

cd "$REPO"
PREV_SHA=$(git rev-parse HEAD)
echo "$PREV_SHA" > "$BASE/PREV"

git fetch --quiet origin
git checkout --quiet --detach "$(git rev-parse "origin/$REF" 2>/dev/null || git rev-parse "$REF")"
NEW_SHA=$(git rev-parse --short HEAD)
echo "-- kod: $PREV_SHA -> $NEW_SHA"

cd "$REPO/server"
# Kod fayllari dars-api foydalanuvchisiga o'qiladigan bo'lsin (ProtectSystem=strict — yozish kerak emas)
chown -R dars-api:dars-api "$REPO"
sudo -u dars-api npm ci --omit=dev --no-audit --no-fund --loglevel=error
echo "-- bog'liqliklar o'rnatildi"

# GIT_SHA env-faylga (health'da ko'rinadi). Fayl root:dars-api 640 bo'lib qoladi.
if grep -q '^GIT_SHA=' "$ENV_FILE"; then sed -i "s/^GIT_SHA=.*/GIT_SHA=$NEW_SHA/" "$ENV_FILE"; else echo "GIT_SHA=$NEW_SHA" >> "$ENV_FILE"; fi

# Migratsiya — dars-api foydalanuvchisi, env-fayl bilan (MIGRATE_DATABASE_URL = owner roli)
set -a; . "$ENV_FILE"; set +a
sudo -u dars-api --preserve-env=DARS_ENV,DATABASE_URL,MIGRATE_DATABASE_URL,HOST,PORT,LOG_LEVEL,CORS_ORIGINS,LIVE_MENTOR_CODE,TRUST_PROXY,GIT_SHA,RATE_LIMIT_PER_MIN,DB_POOL_MAX \
  node src/db/migrate-cli.js
echo "-- migratsiya tayyor"

systemctl restart "$SERVICE"
echo "-- $SERVICE qayta ishga tushirildi, health kutilmoqda"

for i in $(seq 1 20); do
  sleep 1
  if out=$(curl -fsS "http://127.0.0.1:$PORT/api/v1/health" 2>/dev/null); then
    echo "-- health OK: $out"
    echo "== $(date -Is) MUVAFFAQIYAT $ENV_NAME $NEW_SHA"
    exit 0
  fi
done

echo "!! health javob bermadi. So'nggi loglar:"
journalctl -u "$SERVICE" -n 40 --no-pager || true
echo "!! qaytish: sudo $0 $ENV_NAME $PREV_SHA"
exit 1
