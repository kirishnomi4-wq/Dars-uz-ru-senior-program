#!/bin/bash
# F-1019-08: 213.23a supurish — 11 pitch darsining har ekrani (podium/yakundan tashqari), uz 1280
cd /home/kali/Desktop/internetLesson
T=feedback/F-1019-07-pitch-qaror/sinov; O=${O:-feedback/F-1019-08-qa379-389/supur.txt}; : > $O
for f in src/1-Modull/PmLesson3.jsx src/2-Modull/PmLesson6.jsx src/7-Modull/PmUserStoryPitchLesson.jsx src/8-Modull/PmPitchRehearsalLesson.jsx src/9-Modull/PmPrototypePitchLesson.jsx src/10-Modull/PmPitchReviewLesson.jsx src/10-Modull/PmGrowthPitchLesson.jsx src/12-Modull/PmInvestorPitchLesson.jsx src/12-Modull/PmStoryPitchLesson.jsx src/12-Modull/PmPitchTrainingLesson.jsx src/12-Modull/PmFinalPitchLesson.jsx; do
  N=$(python3 -c "import re,sys;s=open('$f').read();m=re.search(r'const SCREEN_META = \[([\s\S]*?)\n\];',s);print(len(re.findall(r'\{\s*id:',m.group(1))))")
  for ((i=0; i<N-2; i++)); do timeout 150 node $T/qaror.mjs $f $i uz 1280 2>&1 | grep -E "^==|BO'SH|pageerror: [1-9]|!!" >> $O; done
done
echo TAYYOR >> $O
