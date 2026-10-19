#!/bin/bash
cd /home/kali/Desktop/internetLesson; O=feedback/F-1019-10-link-menu/gates.txt; : > $O
while read f || [ -n "$f" ]; do r=$(npm run gates -- "$f" 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | grep -E 'darvoza (toza|yiqildi)' | tail -1); echo "$f | $r" >> $O; done < feedback/F-1019-10-link-menu/fayllar.txt
echo TAYYOR >> $O
