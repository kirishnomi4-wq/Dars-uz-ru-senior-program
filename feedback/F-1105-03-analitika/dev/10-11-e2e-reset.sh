#!/usr/bin/env bash
# mahalliy e2e: bazani tozalash + API qayta ishga tushirish (port PID bo'yicha — pkill o'z satrini o'ldirmasin)
SP=/tmp/claude-1000/-home-kali-Desktop-internetLesson/85fa0ead-ac46-4b82-add2-427bd1037d2b/scratchpad
P=$(ss -ltnp | grep ':3001 ' | grep -o 'pid=[0-9]*' | head -1 | cut -d= -f2); [ -n "$P" ] && kill $P; sleep 1
cd /home/kali/Desktop/internetLesson/server
export DATABASE_URL=postgres://dars:dars@127.0.0.1:5432/dars_test
psql $DATABASE_URL -qAtc "drop schema public cascade; create schema public;" >/dev/null 2>&1
node --env-file=.env src/db/migrate-cli.js >/dev/null 2>&1 && node --env-file=.env tools/seed-catalog.mjs >/dev/null 2>&1
(RESULT_SCHEMA_V2=on node --env-file=.env src/index.js > $SP/api.log 2>&1 &)
for i in $(seq 1 20); do curl -s -m 2 http://127.0.0.1:3001/api/v1/health >/dev/null && break; sleep 0.5; done
ss -ltn | grep -q ':3999 ' || (node tools/fake-school-api.mjs > $SP/fake.log 2>&1 &)
sleep 1; echo "tayyor: api $(ss -ltn | grep -c ':3001 ') fake $(ss -ltn | grep -c ':3999 ') vite $(ss -ltn | grep -c ':5300 ')"
