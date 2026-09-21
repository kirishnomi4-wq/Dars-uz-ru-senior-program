#!/bin/sh
# ============================================================
#  yuklash-tekshir — yuklash papkasining TO'LIQ qabul-tekshiruvi (2026-09-21, F-0921-24).
#
#  Nima qiladi (har modul uchun):
#    1. Har `.jsx` faylni HAQIQIY brauzerda ochadi — `uz` va `ru` da (scripts/smoke-lms.mjs)
#    2. `ROYXAT.md` dagi md5 fayllarga mos ekanini tekshiradi
#    3. Oxirida: har modulning `lesson_id` lari serverdagi katalogda bor-yo'qligi
#       (`server/data/lesson-catalog.json` — prod bilan bir xil)
#
#  Nega kerak: `smoke-rejim` yig'ma (prod manzilli) fayllarga MOS EMAS — u `file://` dan
#  ochadi, mentor/jonli rejimda CORS to'sadi va SOXTA yiqilish beradi. Yig'malar uchun
#  to'g'ri asbob — `smoke-lms`.
#
#  Ishlatish:  sh scripts/yuklash-tekshir.sh [papka]     (sukut: yuklash-2026-09-21)
#  Natija:     <papka>/TEKSHIRUV.log
# ============================================================
set -e
cd "$(dirname "$0")/.."
OUT_DIR="${1:-yuklash-2026-09-21}"
LOG="$OUT_DIR/TEKSHIRUV.log"
: > "$LOG"
[ -n "$CHROME" ] || CHROME=/usr/bin/google-chrome
export CHROME

echo "== $OUT_DIR — qabul-tekshiruvi · $(date '+%Y-%m-%d %H:%M') ==" >> "$LOG"

for D in "$OUT_DIR"/*-Modul; do
  [ -d "$D" ] || continue
  M=$(basename "$D")
  ok=0; bad=0; m=0; mb=0
  for f in "$D"/*.jsx; do
    for L in uz ru; do
      r=$(node scripts/smoke-lms.mjs --lang $L "$f" 2>&1)
      if echo "$r" | grep -q "Hammasi ishlaydi"; then ok=$((ok+1)); else
        bad=$((bad+1)); echo "FAIL $M $L $(basename "$f")" >> "$LOG"; echo "$r" | tail -4 >> "$LOG"
      fi
    done
    h=$(md5sum "$f" | cut -d' ' -f1)
    if grep -q "$h" "$D/ROYXAT.md"; then m=$((m+1)); else mb=$((mb+1)); echo "MD5-NOMOS $M $(basename "$f")" >> "$LOG"; fi
  done
  echo "$M · brauzer(uz+ru): ok=$ok fail=$bad · md5: mos=$m nomos=$mb" >> "$LOG"
done

echo "" >> "$LOG"
echo "== KATALOG (lesson_id prodda bormi) ==" >> "$LOG"
OUT_DIR="$OUT_DIR" python3 - >> "$LOG" 2>&1 <<'PY'
import json, re, io, glob, os
out = os.environ['OUT_DIR']
c = json.load(io.open('server/data/lesson-catalog.json', encoding='utf-8'))
ids = {l['lesson_id'] for l in c['lessons']}
for d in sorted(glob.glob(os.path.join(out, '*-Modul'))):
    txt = io.open(os.path.join(d, 'ROYXAT.md'), encoding='utf-8').read()
    rows = re.findall(r'\| (\d+\.?) \| ([^|]+) \|[^|]*\|[^|]*\|[^|]*\| `([a-z0-9][a-z0-9-]+)` \|', txt)
    dars = [i for _, t, i in rows if 'Uyga' not in t]
    hw = [i for _, t, i in rows if 'Uyga' in t]
    miss = [i for i in dars if i not in ids]
    print('%-10s dars %2d/%2d katalogda%s · uyga-vazifa %d (katalog shart emas)'
          % (os.path.basename(d), len(dars) - len(miss), len(dars),
             '' if not miss else " — YO'Q: " + ', '.join(miss), len(hw)))
PY
echo "== TUGADI ==" >> "$LOG"
cat "$LOG"
