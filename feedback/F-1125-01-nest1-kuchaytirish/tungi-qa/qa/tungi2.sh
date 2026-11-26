#!/usr/bin/env bash
# Tungi jonli QA (26.11, F-1125-01): 12 mentor darsi jonli saytda — 1) ekran-sweep (sahifa xatosi, Davom) UZ/RU,
# 2) sahna-olchov (toshish) UZ/RU 1280x720, 3) e2e ovozli to'liq o'tish UZ 1280x720 (onFinished passed).
# Ketma-ket, nice (CPU qizimasin). Natija: $Q/natija/*.tsv, umumiy jurnal $Q/${LOGN:-tungi.log}
Q=/tmp/claude-1000/-home-kali-Desktop-internetLesson/398d641b-649e-4707-951d-f0a2d2727331/scratchpad/qa
DEV=/home/kali/Desktop/internetLesson/feedback/F-1029-02-mentor-kurs/dev
export BASE=${BASE:-https://coddycamp-mentor-kurs.vercel.app}
N=$Q/natija; mkdir -p $N
DARSLAR=${DARSLAR:-"nest-01 nest-02 pg-01 pg-02 jest-01 jest-02 cicd-01 cicd-02 tgpg-01 ws1-01 ws2-01 wh-01"}
BOSQICH=${BOSQICH:-"sweep olchov e2e"}
log() { echo "$(date +%H:%M:%S) $*" | tee -a $Q/${LOGN:-tungi.log}; }
log "BOSHLANDI · $BASE · $BOSQICH"
for B in $BOSQICH; do
  for L in ${TILLAR:-uz ru}; do
    [ "$B" = e2e ] && [ "$L" = ru ] && [ -z "$E2E_RU" ] && continue
    for d in $DARSLAR; do
      case $B in
        sweep) DARS="$d&lang=$L" timeout 1500 nice -n 19 taskset -c 0-3 node $Q/ekran-sweep.mjs 1280x720 > $N/sweep-$L-$d.tsv 2>&1
               log "sweep $L $d · $(tail -n 1 $N/sweep-$L-$d.tsv)";;
        olchov) TIL=$L DARS=$d timeout 1800 nice -n 19 taskset -c 0-3 node $DEV/sahna-olchov.mjs 1280x720 > $N/olchov-$L-$d.tsv 2>&1
               log "olchov $L $d · toshgan ekran: $(awk -F'\t' '$3+0>0' $N/olchov-$L-$d.tsv | wc -l)";;
        e2e)   t0=$(date +%s); DARS=$d timeout 1800 nice -n 19 taskset -c 0-3 node $Q/e2e-ovozli-otish.mjs 1280 720 $L > $N/e2e-$L-$d.log 2>&1
               log "e2e $L $d · $(( $(date +%s) - t0 ))s · $(grep -m1 '^onFinished:' $N/e2e-$L-$d.log | cut -c1-160) · qotdi: $(grep -c QOTDI $N/e2e-$L-$d.log) · $(grep -m1 '^xatolar:' $N/e2e-$L-$d.log | cut -c1-200)";;
      esac
    done
  done
done
log "TUGADI"
