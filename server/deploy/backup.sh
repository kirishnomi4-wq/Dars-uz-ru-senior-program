#!/usr/bin/env bash
# backup.sh — har kecha (cron, root): dars_prod va dars_staging → pg_dump -Fc → /var/backups/dars-api/
# Saqlash: 14 kun lokal. RCLONE_REMOTE berilsa (masalan "spaces:dars-backups") nusxa Spaces'ga ham ketadi.
# Tiklash (mashq §10): createdb dars_restore && pg_restore -d dars_restore --no-owner --role=dars_prod_owner <fayl>
set -euo pipefail
DEST="${DEST:-/var/backups/dars-api}"
KEEP_DAYS="${KEEP_DAYS:-14}"
RCLONE_REMOTE="${RCLONE_REMOTE:-}"
STAMP=$(date +%Y%m%d-%H%M)

mkdir -p "$DEST"; chmod 700 "$DEST"
for DB in dars_prod dars_staging; do
  if ! sudo -u postgres psql -tAc "select 1 from pg_database where datname='$DB'" | grep -q 1; then continue; fi
  OUT="$DEST/$DB-$STAMP.dump"
  sudo -u postgres pg_dump -Fc --no-owner "$DB" > "$OUT.tmp" && mv "$OUT.tmp" "$OUT"
  chmod 600 "$OUT"
  echo "$(date -Is) $DB → $OUT ($(du -h "$OUT" | cut -f1))"
  if [ -n "$RCLONE_REMOTE" ] && command -v rclone >/dev/null; then
    rclone copy --quiet "$OUT" "$RCLONE_REMOTE/$DB/" && echo "  ↑ $RCLONE_REMOTE/$DB/"
  fi
done
find "$DEST" -name '*.dump' -mtime +"$KEEP_DAYS" -delete
# Haftada bir: dump o'qiladimi (yaroqsiz zaxira = zaxira emas)
if [ "$(date +%u)" = 7 ]; then
  LATEST=$(ls -t "$DEST"/dars_prod-*.dump 2>/dev/null | head -1 || true)
  [ -n "$LATEST" ] && sudo -u postgres pg_restore --list "$LATEST" >/dev/null && echo "$(date -Is) tekshiruv OK: $LATEST"
fi
