#!/usr/bin/env bash
# 12 dars sahna toshishi (04.11). ISHLATISH: [DARSLAR="a b"] [OLCHAM="1280x720 1920x1080"] [TAG=olchov6] [P=4] bash dev/olchov-hammasi.sh
cd "$(dirname "$0")"
O=sahna-natija-2026-11-04; mkdir -p $O; TAG=${TAG:-olchov6}
JOBS=$(for d in ${DARSLAR:-tgpg-01 pg-02 pg-01 jest-01 jest-02 cicd-01 cicd-02 ws1-01 ws2-01 wh-01 nest-01 nest-02}; do for s in ${OLCHAM:-1280x720}; do echo "$d $s"; done; done)
export O TAG
echo "$JOBS" | xargs -P ${P:-4} -L 1 bash -c 'DARS=$0 timeout 1800 node sahna-olchov.mjs $1 > $O/$TAG-$0-$1.tsv 2>/dev/null; echo "$0 $1 → $(awk -F"\t" "\$3+0>0" $O/$TAG-$0-$1.tsv | wc -l) ekran · $(date +%H:%M)"'
