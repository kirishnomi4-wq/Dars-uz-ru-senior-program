// Konveyer uchun lokal server (11.11): GET /kv/<nom> → konveyer/ papkasidan (ro'yxat, skript, PAUZA bayrog'i). Faqat 127.0.0.1, faqat o'qish.
// To'xtatish: konveyer/PAUZA faylini yarating — konveyer keyingi darsdan oldin to'xtaydi.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const ROOT = '/home/kali/Desktop/internetLesson/feedback/F-1105-03-analitika/crm-yuklash-20261110/konveyer';
http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://go.coddycamp.uz');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  const u = new URL(req.url, 'http://127.0.0.1');
  if (req.method === 'GET' && u.pathname.startsWith('/kv/')) {
    const name = u.pathname.slice(4).replace(/[^A-Za-z0-9_.-]/g, '_');
    const fp = path.join(ROOT, name);
    if (!fs.existsSync(fp)) { res.writeHead(404); return res.end('yo\'q'); }
    res.writeHead(200, {'Content-Type': name.endsWith('.json') ? 'application/json' : 'text/javascript; charset=utf-8'});
    return fs.createReadStream(fp).pipe(res);
  }
  res.writeHead(404); res.end();
}).listen(5398, '127.0.0.1', () => console.log('konveyer 127.0.0.1:5398'));
