import { chromium } from 'playwright-core';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root='/home/kali/Desktop/internetLesson/dist-m5';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.mp3':'audio/mpeg','.woff2':'font/woff2','.jpg':'image/jpeg'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]); if(p==='/')p='/index.html'; const f=path.join(root,p); if(!fs.existsSync(f)){r.writeHead(404);return r.end();} r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'}); fs.createReadStream(f).pipe(r);}).listen(5391);
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});
for (const lang of ['uz','ru']) {
  for (const i of [1,2,3,4,5,6,7,8,9,10,11,14]){
    const k='m5-'+String(i).padStart(2,'0');
    const ctx=await b.newContext({viewport:{width:1280,height:820}}); const pg=await ctx.newPage(); const errs=[];
    pg.on('pageerror',e=>errs.push(String(e.message).slice(0,100)));
    await pg.addInitScript(l=>{localStorage.setItem('cc_lang',l)},lang);
    await pg.goto('https://coddycamp-5modul.vercel.app/#/'+k,{waitUntil:'domcontentloaded',timeout:40000});
    let ok=true; try{await pg.waitForSelector('.lesson-root',{timeout:30000})}catch{ok=false}
    const h=ok? (await pg.locator('.lesson-root h1, .lesson-root h2').first().innerText().catch(()=>'')) : '';
    console.log(lang,k,ok?'ochildi':'OCHILMADI',errs.length?'XATO '+errs.join('|'):'', (h||'').slice(0,50).replace(/\n/g,' '));
    await ctx.close();
  }
}
await b.close(); srv.close();
