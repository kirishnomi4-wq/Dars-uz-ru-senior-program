// Lokal yordamchi: brauzer (go.coddycamp.uz) → JSON saqlash va paket fayllarini berish. Faqat 127.0.0.1.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const ROOT = '/home/kali/Desktop/internetLesson/yuklash-20261029-prod/yakka';
const DUMP = '/home/kali/Desktop/internetLesson/feedback/F-1023-01-learn/crm-yuklash-20261029/dump';
const cors = (res) => { res.setHeader('Access-Control-Allow-Origin', 'https://go.coddycamp.uz'); res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS'); res.setHeader('Access-Control-Allow-Headers','Content-Type'); res.setHeader('Access-Control-Allow-Private-Network','true'); };
http.createServer((req,res)=>{
  cors(res);
  const u = new URL(req.url, 'http://127.0.0.1');
  if (req.method==='OPTIONS') { res.writeHead(204); return res.end(); }
  if (req.method==='POST' && u.pathname==='/save') {
    const name = (u.searchParams.get('name')||'dump').replace(/[^A-Za-z0-9_.-]/g,'_');
    let body=[]; req.on('data',c=>body.push(c)); req.on('end',()=>{ const b=Buffer.concat(body); fs.writeFileSync(path.join(DUMP,name), b); res.writeHead(200,{'Content-Type':'text/plain'}); res.end('ok '+b.length); });
    return;
  }
  if (req.method==='GET' && u.pathname.startsWith('/files/')) {
    const rel = decodeURIComponent(u.pathname.slice(7)); const fp = path.join(ROOT, rel);
    if (!fp.startsWith(ROOT+'/') || !fs.existsSync(fp)) { res.writeHead(404); return res.end('yo\'q'); }
    res.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8','Content-Length':fs.statSync(fp).size}); return fs.createReadStream(fp).pipe(res);
  }
  res.writeHead(404); res.end();
}).listen(5399,'127.0.0.1',()=>console.log('yordamchi 127.0.0.1:5399'));
