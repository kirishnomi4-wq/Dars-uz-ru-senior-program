#!/usr/bin/env bash
# setup-droplet.sh — YANGI Ubuntu 24.04 dropletni bir marta tayyorlaydi (root sifatida).
#   curl -fsSL https://raw.githubusercontent.com/kirishnomi4-wq/internetLesson/main/server/deploy/setup-droplet.sh -o setup.sh
#   bash setup.sh
# Idempotent: qayta yurgizsa mavjud narsani buzmaydi. Parollarni faqat birinchi marta yaratadi.
# Natija: PostgreSQL 16 (dars_prod, dars_staging; owner+app rollar) · Node 22 · Caddy · systemd unit ·
#         /opt/dars-api/{prod,staging}/repo (sparse: faqat server/) · /etc/dars-api/*.env shablonlar · ufw · fail2ban · backup cron.
set -euo pipefail
[ "$(id -u)" = 0 ] || { echo "root sifatida yurgizing"; exit 1; }

REPO_URL="${REPO_URL:-https://github.com/kirishnomi4-wq/internetLesson.git}"
DOMAIN_PROD="${DOMAIN_PROD:-api.azizbek.site}"
DOMAIN_STAGING="${DOMAIN_STAGING:-staging-api.azizbek.site}"
ADMIN_USER="${ADMIN_USER:-dars}"           # SSH bilan kiradigan odam (sudo)
ADMIN_PUBKEY="${ADMIN_PUBKEY:-}"           # ixtiyoriy: ochiq kalit satri; bo'sh bo'lsa root'niki nusxalanadi

log() { echo -e "\n== $*"; }

log "Paketlar"
export DEBIAN_FRONTEND=noninteractive
apt-get update -q
apt-get upgrade -yq
apt-get install -yq ca-certificates curl gnupg git ufw fail2ban unattended-upgrades chrony jq \
  postgresql-16 postgresql-client-16 debian-keyring debian-archive-keyring apt-transport-https

log "Node 22 LTS (NodeSource)"
if ! command -v node >/dev/null || ! node -v | grep -q '^v22\.'; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -yq nodejs
fi
node -v; npm -v

log "Caddy"
if ! command -v caddy >/dev/null; then
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -q && apt-get install -yq caddy
fi

log "Foydalanuvchilar"
id -u dars-api >/dev/null 2>&1 || useradd --system --home /opt/dars-api --shell /usr/sbin/nologin dars-api
if ! id -u "$ADMIN_USER" >/dev/null 2>&1; then
  useradd -m -s /bin/bash -G sudo "$ADMIN_USER"
  install -d -m 700 -o "$ADMIN_USER" -g "$ADMIN_USER" "/home/$ADMIN_USER/.ssh"
  if [ -n "$ADMIN_PUBKEY" ]; then echo "$ADMIN_PUBKEY" > "/home/$ADMIN_USER/.ssh/authorized_keys"
  elif [ -f /root/.ssh/authorized_keys ]; then cp /root/.ssh/authorized_keys "/home/$ADMIN_USER/.ssh/authorized_keys"; fi
  chmod 600 "/home/$ADMIN_USER/.ssh/authorized_keys"; chown -R "$ADMIN_USER:$ADMIN_USER" "/home/$ADMIN_USER/.ssh"
  echo "$ADMIN_USER ALL=(ALL) NOPASSWD: /opt/dars-api/bin/deploy.sh, /bin/systemctl restart dars-api@*, /bin/systemctl status dars-api@*, /bin/journalctl" > "/etc/sudoers.d/90-$ADMIN_USER"
  chmod 440 "/etc/sudoers.d/90-$ADMIN_USER"
fi

log "SSH qattiqlashtirish (faqat kalit, root parolsiz)"
install -d /etc/ssh/sshd_config.d
cat > /etc/ssh/sshd_config.d/90-dars.conf <<'EOF'
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin prohibit-password
MaxAuthTries 4
EOF
systemctl reload ssh || systemctl reload sshd || true

log "ufw + fail2ban + avto-yangilanish + vaqt"
ufw --force reset >/dev/null
ufw default deny incoming; ufw default allow outgoing
ufw allow OpenSSH; ufw allow 80/tcp; ufw allow 443/tcp
ufw --force enable
cat > /etc/fail2ban/jail.d/dars.local <<'EOF'
[sshd]
enabled = true
maxretry = 5
bantime = 1h
EOF
systemctl enable --now fail2ban
dpkg-reconfigure -f noninteractive unattended-upgrades
systemctl enable --now chrony
mkdir -p /etc/systemd/journald.conf.d
printf '[Journal]\nSystemMaxUse=500M\nMaxRetentionSec=14day\n' > /etc/systemd/journald.conf.d/dars.conf
systemctl restart systemd-journald

log "PostgreSQL: bazalar va rollar (owner = migratsiya, app = faqat DML)"
systemctl enable --now postgresql
install -d -m 750 -o root -g dars-api /etc/dars-api
genpw() { tr -dc 'A-Za-z0-9' </dev/urandom | head -c 32; }
for ENV_NAME in prod staging; do
  DB="dars_$ENV_NAME"; OWNER="dars_${ENV_NAME}_owner"; APP="dars_${ENV_NAME}_app"; ENV_FILE="/etc/dars-api/$ENV_NAME.env"
  if [ -f "$ENV_FILE" ]; then echo "-- $ENV_FILE bor, baza/rollar tegilmaydi"; continue; fi
  OWNER_PW=$(genpw); APP_PW=$(genpw)
  sudo -u postgres psql -v ON_ERROR_STOP=1 -q <<SQL
do \$\$ begin
  if not exists (select 1 from pg_roles where rolname = '$OWNER') then create role $OWNER login password '$OWNER_PW'; end if;
  if not exists (select 1 from pg_roles where rolname = '$APP')   then create role $APP   login password '$APP_PW';   end if;
end \$\$;
select 'create database $DB owner $OWNER' where not exists (select 1 from pg_database where datname = '$DB')\gexec
SQL
  sudo -u postgres psql -v ON_ERROR_STOP=1 -q -d "$DB" <<SQL
revoke all on schema public from public;
grant usage, create on schema public to $OWNER;
grant usage on schema public to $APP;
alter default privileges for role $OWNER in schema public grant select, insert, update, delete on tables to $APP;
alter default privileges for role $OWNER in schema public grant usage, select on sequences to $APP;
alter default privileges for role $OWNER in schema public grant execute on functions to $APP;
SQL
  PORT=$( [ "$ENV_NAME" = prod ] && echo 3001 || echo 3002 )
  DOMAIN=$( [ "$ENV_NAME" = prod ] && echo "$DOMAIN_PROD" || echo "$DOMAIN_STAGING" )
  cat > "$ENV_FILE" <<EOF
# dars-api $ENV_NAME — setup-droplet.sh $(date -I). Sirlarni faqat shu yerda saqlang (root:dars-api 640).
DARS_ENV=$ENV_NAME
HOST=127.0.0.1
PORT=$PORT
LOG_LEVEL=info
TRUST_PROXY=true
DATABASE_URL=postgres://$APP:$APP_PW@127.0.0.1:5432/$DB
MIGRATE_DATABASE_URL=postgres://$OWNER:$OWNER_PW@127.0.0.1:5432/$DB
# TO'LDIRING: vergul bilan, faqat https
CORS_ORIGINS=https://lms.coddycamp.uz
# TO'LDIRING: PIN-yo'lidagi mentor-kod (kamida 6 belgi)
LIVE_MENTOR_CODE=
RATE_LIMIT_PER_MIN=300
RATE_LIMIT_SCALE=1
DB_POOL_MAX=20
STALE_SESSION_MINUTES=30
GIT_SHA=
# ---- LMS-ko'prik: TO'LDIRING (.env.coddycamp.local dan; secret base64:... shaklida)
CODDYCAMP_SCHOOL_API_URL=https://school-api.coddycamp.uz
CODDYCAMP_CONTEXT_API_TOKEN=
CODDYCAMP_RESULTS_API_TOKEN=
CODDYCAMP_LIVE_JWT_SECRET=
CODDYCAMP_LIVE_JWT_ISSUER=coddycamp-lms
CODDYCAMP_LIVE_JWT_AUDIENCE=dars-platform
CODDYCAMP_LIVE_JWT_KEY_ID=v1
CODDYCAMP_LIVE_JWT_MAX_TTL_SECONDS=43200
# Bazadagi sessiya-tokenlar shifri (setup avto-yaratdi — o'zgartirmang, aks holda eski tokenlar o'qilmaydi)
TOKEN_ENC_KEY=$(openssl rand -base64 32)
CONTEXT_CACHE_TTL_SECONDS=300
# ---- Natija-navbat va kuzatuv
RESULTS_WORKER_ENABLED=true
RESULTS_TICK_MS=5000
# TO'LDIRING (ixtiyoriy): Telegram ogohlantirish, ikkalasi birga
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
# TO'LDIRING: admin-sahifa /admin (parol ≥12)
ADMIN_USER=admin
ADMIN_PASSWORD=$(genpw)
# ($DOMAIN → 127.0.0.1:$PORT Caddy orqali)
EOF
  chown root:dars-api "$ENV_FILE"; chmod 640 "$ENV_FILE"
  echo "-- $DB tayyor; env: $ENV_FILE (CORS_ORIGINS va LIVE_MENTOR_CODE ni to'ldiring)"
done

log "Kod: sparse-clone (faqat server/) har muhit uchun alohida"
install -d -o dars-api -g dars-api /opt/dars-api /opt/dars-api/bin /var/log/dars-api /var/backups/dars-api
for ENV_NAME in prod staging; do
  BASE="/opt/dars-api/$ENV_NAME"; REPO="$BASE/repo"
  if [ ! -d "$REPO/.git" ]; then
    install -d -o dars-api -g dars-api "$BASE"
    sudo -u dars-api git clone --quiet --filter=blob:none --sparse "$REPO_URL" "$REPO"
    sudo -u dars-api git -C "$REPO" sparse-checkout set server
  fi
done
install -m 755 /opt/dars-api/prod/repo/server/deploy/deploy.sh /opt/dars-api/bin/deploy.sh
install -m 755 /opt/dars-api/prod/repo/server/deploy/backup.sh /opt/dars-api/bin/backup.sh

log "systemd unit + Caddy"
install -m 644 /opt/dars-api/prod/repo/server/deploy/systemd/dars-api@.service /etc/systemd/system/dars-api@.service
systemctl daemon-reload
systemctl enable dars-api@prod dars-api@staging >/dev/null
install -d /var/log/caddy && chown caddy:caddy /var/log/caddy
sed -e "s/api\.azizbek\.site/$DOMAIN_PROD/; s/staging-api\.azizbek\.site/$DOMAIN_STAGING/" \
  /opt/dars-api/prod/repo/server/deploy/caddy/Caddyfile > /etc/caddy/Caddyfile
caddy validate --config /etc/caddy/Caddyfile
systemctl enable --now caddy && systemctl reload caddy

log "Zaxira: har kecha 03:00 (pg_dump -Fc, 14 kun lokal)"
cat > /etc/cron.d/dars-api-backup <<'EOF'
0 3 * * * root /opt/dars-api/bin/backup.sh >> /var/log/dars-api/backup.log 2>&1
EOF

cat <<EOF

================================================================
TAYYOR. Keyingi qadamlar (qo'lda):
 1. DNS: $DOMAIN_PROD va $DOMAIN_STAGING → $(curl -fsS -4 ifconfig.me 2>/dev/null || echo '<droplet IP>') (A-yozuv). Caddy sertifikatni o'zi oladi.
 2. /etc/dars-api/staging.env va prod.env: CORS_ORIGINS, LIVE_MENTOR_CODE to'ldiring.
 3. Birinchi deploy:  sudo /opt/dars-api/bin/deploy.sh staging main   → https://$DOMAIN_STAGING/api/v1/health
 4. Prod:             sudo /opt/dars-api/bin/deploy.sh prod main
 5. DO panelida haftalik snapshot yoqing; Spaces bo'lsa backup.sh da RCLONE_REMOTE ni to'ldiring.
================================================================
EOF
