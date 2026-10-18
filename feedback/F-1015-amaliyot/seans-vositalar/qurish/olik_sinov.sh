#!/bin/bash
# olik_sinov.sh <jsx> <F-ID> <sinov-kalit mNNN>  — tozalashdan keyingi to'liq sinov
set -u
F=$1; FID=$2; M=$3; R=/home/kali/Desktop/internetLesson; S=$R/feedback/F-1015-amaliyot/seans-vositalar/sinov
OUT=/tmp/claude-1000/-home-kali-Desktop-internetLesson/ddfde5ee-88dd-4646-8bcc-c3f8e4e358d4/scratchpad/$FID; mkdir -p $OUT
cd $R
L=$(npm run lint:jsx 2>&1 | grep -cE "🔴"); echo "lint 🔴: $L"
G=$(npm run gates -- $F 2>&1 | grep -cE '^❌'); GB=$(npm run gates -- arxiv/$FID-oldin/$(basename $F) 2>&1 | grep -cE '^❌'); echo "gates ❌: $G / zaxira $GB"
echo "tekshir: $(node $S/tekshir-$M.mjs $OUT 2>&1 | tail -1)"; echo "ru: $(node $S/ru-$M.mjs $OUT 2>&1 | tail -1 | cut -c1-50)"
N=$(python3 -c "import re;s=open('$F').read();print(len(re.search(r'const screens = \[([^\]]*)\]',s).group(1).split(',')))")
IDX=$(seq -s, 0 $((N-1)))
node $S/ekran-surat.mjs $R/$F $OUT $M $IDX 2>&1 | grep -c "xato 0" | xargs -I{} echo "surat xato 0: {}/$N"
