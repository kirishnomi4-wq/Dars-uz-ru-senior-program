#!/bin/bash
# fayllar ro'yxati bo'yicha gates + tell/emoji soni zaxira bilan solishtiriladi
cd /home/kali/Desktop/internetLesson
while read f; do
  r=$(npm run gates -- "$f" 2>&1 | grep -E "darvoza" | tail -1 | sed 's/\x1b\[[0-9;]*m//g')
  t0=$(node lint-tell.mjs "arxiv/F-1019-02-oldin/$f" 2>&1 | tail -1 | grep -o "[0-9]* error"); t1=$(node lint-tell.mjs "$f" 2>&1 | tail -1 | grep -o "[0-9]* error")
  e0=$(node lint-emoji.mjs "arxiv/F-1019-02-oldin/$f" 2>&1 | tail -1 | grep -o "[0-9]* error"); e1=$(node lint-emoji.mjs "$f" 2>&1 | tail -1 | grep -o "[0-9]* error")
  echo "$f | $r | tell $t0→$t1 | emoji $e0→$e1"
done < "$1"
