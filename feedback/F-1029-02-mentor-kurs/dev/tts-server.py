#!/usr/bin/env python3
"""Lokal TTS-server (faqat dev): GET /tts?text=... → mp3 (edge-tts, Sardor), sha1 bo'yicha kesh.
Platformada bu ishni @lesson/runtime (ElevenLabs) qiladi; bu server lokal ovoz-dvigatel uchun.
Ishga tushirish: python3 dev/tts-server.py 5332
"""
import asyncio, hashlib, json, re, sys, pathlib, urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import edge_tts

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5332
CACHE = pathlib.Path(__file__).resolve().parent.parent / 'korik' / 'tts-cache'; CACHE.mkdir(parents=True, exist_ok=True)
VOICE, RATE = 'uz-UZ-SardorNeural', '-5%'
TAG = re.compile(r'\[[^\]]{1,40}\]')          # [O'zbekcha tallaffuz] [pause] [English pronunciation] [end] ...
SUBS = [('@', ''), ('·', ','), ('→', ''), ('`', ''), ('**', '')]

def clean(text):
    s = TAG.sub(' ', text)
    for a, b in SUBS: s = s.replace(a, b)
    return re.sub(r'\s+', ' ', s).strip()

async def synth(text, path):
    com = edge_tts.Communicate(text, VOICE, rate=RATE)
    with open(path, 'wb') as f:
        async for ch in com.stream():
            if ch['type'] == 'audio': f.write(ch['data'])

class H(BaseHTTPRequestHandler):
    def log_message(self, fmt, *a): sys.stderr.write('[tts] ' + (fmt % a) + '\n')
    def _send(self, code, body, ctype='application/json'):
        self.send_response(code); self.send_header('Content-Type', ctype); self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', str(len(body))); self.end_headers(); self.wfile.write(body)
    def do_GET(self):
        u = urllib.parse.urlparse(self.path)
        if u.path != '/tts': return self._send(404, b'{"error":"/tts?text=..."}')
        q = urllib.parse.parse_qs(u.query); text = (q.get('text') or [''])[0]
        c = clean(text)
        if not c: return self._send(400, b'{"error":"bo\'sh matn"}')
        h = hashlib.sha1((VOICE + RATE + c).encode('utf-8')).hexdigest()
        p = CACHE / (h + '.mp3')
        if not p.exists() or p.stat().st_size < 500:
            try: asyncio.run(synth(c, p))
            except Exception as e:
                if p.exists(): p.unlink()
                return self._send(502, json.dumps({'error': str(e)}).encode())
        data = p.read_bytes()
        self.send_response(200); self.send_header('Content-Type', 'audio/mpeg'); self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache'); self.send_header('Content-Length', str(len(data))); self.end_headers(); self.wfile.write(data)

print(f'TTS dev server: http://127.0.0.1:{PORT}/tts?text=...  kesh: {CACHE}', flush=True)
ThreadingHTTPServer(('127.0.0.1', PORT), H).serve_forever()
