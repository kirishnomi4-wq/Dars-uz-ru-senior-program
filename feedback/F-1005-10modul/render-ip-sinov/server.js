// Render'da o'yinchi IP manzili qayerda turishini ko'rsatadi (QAROR 10M-58, 8-q3). Bog'liqliksiz, faqat Node.
import http from 'node:http';

const PORT = process.env.PORT || 3000;
const ro = (v) => (Array.isArray(v) ? v.join(', ') : v ?? null);

http.createServer((req, res) => {
  const xff = ro(req.headers['x-forwarded-for']);
  const zanjir = [req.socket.remoteAddress, ...(xff ? xff.split(',').map((s) => s.trim()).reverse() : [])];
  // Express «trust proxy = N» qoidasi: o'ngdan N ta proksi ishonchli — keyingi manzil mijoz
  const trust = (n) => zanjir[Math.min(n, zanjir.length - 1)];
  const natija = {
    socket: req.socket.remoteAddress,
    'x-forwarded-for': xff,
    'cf-connecting-ip': ro(req.headers['cf-connecting-ip']),
    'true-client-ip': ro(req.headers['true-client-ip']),
    'x-real-ip': ro(req.headers['x-real-ip']),
    'trust proxy = 1': trust(1),
    'trust proxy = 2': trust(2),
    'trust proxy = true (eng chapdagi)': zanjir[zanjir.length - 1],
    'tanlangan usul (CF-Connecting-IP ?? req.ip)': ro(req.headers['cf-connecting-ip']) ?? req.socket.remoteAddress,
  };
  res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(natija, null, 2));
}).listen(PORT, () => console.log('ip-sinov tayyor, port', PORT));
