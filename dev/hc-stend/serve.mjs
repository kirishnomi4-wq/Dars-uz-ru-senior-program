import { createServer } from 'node:http'; import { readFileSync, existsSync } from 'node:fs'; import { join, dirname } from 'node:path'; import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const MIME = { html:'text/html', js:'text/javascript', css:'text/css', png:'image/png' };
createServer((req,res)=>{ const p = join(here, decodeURIComponent(req.url.split('?')[0].replace(/^\//,''))||'index.html'); const f = existsSync(p)&&!p.endsWith('/')?p:join(here,'index.html'); const ext=f.split('.').pop(); res.writeHead(200,{'content-type':MIME[ext]||'application/octet-stream'}); res.end(readFileSync(f)); }).listen(4517, ()=>console.log('http://127.0.0.1:4517'));
