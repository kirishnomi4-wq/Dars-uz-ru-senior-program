#!/bin/bash
# 26.11 — QA sayti (Vercel) va lokal new-junior/dist ni bayt-bayt solishtirish: qa.html + demo.html + demo-002…023 (24 fayl).
# Ishlatish: bash bayt-solish.sh [manzil]   (standart: https://coddycamp-junior-dars1.vercel.app)
U=${1:-https://coddycamp-junior-dars1.vercel.app}; D=/home/kali/Desktop/internetLesson/new-junior/dist
T=$(mktemp -d); ok=0; n=0
for f in qa.html demo.html $(cd $D && ls demo-0*.html); do
  n=$((n+1)); curl -sS -f -o $T/$f "$U/$f?t=$(date +%s)" || { echo "✗ $f — yuklab bo'lmadi"; continue; }
  if cmp -s $T/$f $D/$f; then ok=$((ok+1)); else echo "✗ $f — farq ($(stat -c %s $T/$f) / $(stat -c %s $D/$f) bayt)"; fi
done
rm -rf $T; echo "BAYT-BAYT: $ok / $n"
