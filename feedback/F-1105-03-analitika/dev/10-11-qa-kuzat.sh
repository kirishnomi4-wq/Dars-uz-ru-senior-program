#!/usr/bin/env bash
# QA jonli sinov: staging sessiyalar + v2 hodisalar o'zgarishini qatorma-qator chiqaradi (faqat o'qiydi)
cd /home/kali/Desktop/internetLesson/server
set -a; . ./.env.deploy.staging >/dev/null 2>&1; set +a
A="Authorization: Basic $(printf '%s:%s' "$ADMIN_USER" "$ADMIN_PASSWORD" | base64 -w0)"
B=https://staging-dars-api.coddycamp.uz
prev=""
while true; do
  s=$(curl -s -m 8 -H "$A" "$B/admin/api/sessions?limit=4" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{const a=JSON.parse(d);console.log(a.filter(x=>Date.now()-new Date(x.started_at)>-1&&Date.now()-new Date(x.started_at)<3*3600e3&&x.gid!==990001).map(x=>`SESSIYA ${x.mode} ${x.pin} ${x.lesson_id} gid=${x.gid} ${x.status}${x.end_reason?"/"+x.end_reason:""} ekran ${x.cur_screen}/${x.max_screen} oquvchi ${x.students} javob ${x.answers}`).join("\n"))}catch{}})' 2>/dev/null)
  e=$(curl -s -m 8 -H "$A" "$B/admin/api/results?schema=2" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{const a=JSON.parse(d);console.log(a.filter(x=>Date.now()-new Date(x.created_at)<3*3600e3).map(x=>`HODISA ${x.event_id.slice(0,11)} ${x.event_type} ${x.status} ${x.processing_status||"-"} HTTP ${x.last_http_status??"-"} ${String(x.last_error||"").slice(0,80)}`).join("\n"))}catch{}})' 2>/dev/null)
  cur="$s
$e"
  if [ "$cur" != "$prev" ]; then
    diff <(echo "$prev") <(echo "$cur") | grep '^>' | sed 's/^> //' | grep -v '^$'
    prev="$cur"
  fi
  sleep 8
done
