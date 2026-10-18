#!/bin/bash
# oldin.sh <kalit> <fayl.jsx> <F-ID-papka> — hamma ekran surati + 2 varaq (scratchpad)
K=$1; F=$2; D=$3; S=${S:-/tmp/claude-1000/-home-kali-Desktop-internetLesson/f7d9cb56-a8ed-4113-8127-bb24c945f534/scratchpad}
cd /home/kali/Desktop/internetLesson
LID=$(grep -o "lessonId: '[^']*'" $F | head -1 | cut -d"'" -f2)
TOT=$(python3 -c "
import re;s=open('$F',encoding='utf-8').read();i=s.index('const SCREEN_META');j=s.index('];',i);print(len(re.findall(r\"\{ id: '\",s[i:j])))")
echo "$K $LID $TOT"
mkdir -p feedback/F-1015-7-14M/suratlar/$D
LIST=$(seq -s, 0 $((TOT-4)))
node feedback/F-1015-7-14M/vositalar/scr.mjs feedback/F-1015-7-14M/suratlar/$D $K $LID $TOT $LIST | grep -v " ok $"
cd feedback/F-1015-7-14M/suratlar/$D
N=$((TOT-3)); H=$(( (N+1)/2 ))
A=""; B=""; for i in $(seq 0 $((N-1))); do if [ $i -lt $H ]; then A="$A $K-s$i.jpg"; else B="$B $K-s$i.jpg"; fi; done
python3 ../../vositalar/varaq.py $S/v-$K-a.jpg 2 $A; python3 ../../vositalar/varaq.py $S/v-$K-b.jpg 2 $B
