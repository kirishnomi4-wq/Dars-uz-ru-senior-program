#!/bin/zsh
cd /home/kali/Desktop/internetLesson
S=/tmp/claude-1000/-home-kali-Desktop-internetLesson/bd769a87-b745-4b6b-9161-4df0dc658f85/scratchpad
: > $S/inet/zanjir.txt
for d in 013 012 011; do timeout 900 nice -n 19 taskset -c 0-3 node $S/inet/$d-toliq-dars.mjs > $S/inet/r-$d.txt 2>&1; echo "$d $? $(grep NATIJA $S/inet/r-$d.txt)" >> $S/inet/zanjir.txt; done
echo TUGADI >> $S/inet/zanjir.txt
