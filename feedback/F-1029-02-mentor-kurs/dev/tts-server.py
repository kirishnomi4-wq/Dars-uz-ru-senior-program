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
VOICE_RU, RATE_RU = 'ru-RU-DmitryNeural', '+0%'   # F-1030-38: matn [Русское произношение] bilan boshlansa
VOICE_RU_ZAXIRA = 'ru-RU-SvetlanaNeural'          # F-1105: Dmitry bitta gapni ham bermasa
TAG = re.compile(r'\[[^\]]{1,40}\]')          # [O'zbekcha tallaffuz] [pause] [English pronunciation] [end] ...
SUBS = [('@', ''), ('·', ','), ('→', ''), ('`', ''), ('**', '')]

def clean(text):
    s = TAG.sub(' ', text)
    for a, b in SUBS: s = s.replace(a, b)
    return re.sub(r'\s+', ' ', s).strip()

async def _audio(text, voice, rate, timeout=40):
    async def run():
        b = bytearray()
        async for ch in edge_tts.Communicate(text, voice, rate=rate).stream():
            if ch['type'] == 'audio': b.extend(ch['data'])
        return bytes(b)
    try: return await asyncio.wait_for(run(), timeout)
    except Exception as e: sys.stderr.write(f'[tts] {voice}: {type(e).__name__} — {text[:60]}\n'); return b''

def _variants(s):
    yield s
    if s[:1].isupper(): yield s[0].lower() + s[1:]
    yield '— ' + s
    yield '… ' + s

async def synth(text, path, voice=VOICE, rate=RATE):
    data = await _audio(text, voice, rate)
    if len(data) < 500 and voice == VOICE_RU:
        # F-1105: DmitryNeural ba'zi iboralarda NoAudioReceived beradi (masalan «В списке …» bosh harf bilan) —
        # gaplarga bo'lib, har gapni shakl-variantlar bilan; oxirgi chora — Svetlana (logda belgi)
        parts = []
        for sent in [x for x in re.split(r'(?<=[.!?:;])\s+', text) if x.strip()]:
            got = b''
            for v in _variants(sent):
                got = await _audio(v, voice, rate)
                if len(got) >= 500: break
            if len(got) < 500:
                got = await _audio(sent, VOICE_RU_ZAXIRA, rate)
                sys.stderr.write(f'[tts] RU ZAXIRA Svetlana: {sent[:80]}\n')
            if len(got) < 500: raise RuntimeError('ovoz yo\'q: ' + sent[:80])
            parts.append(got)
        data = b''.join(parts)
    if len(data) < 500: raise RuntimeError('No audio was received')
    with open(path, 'wb') as f: f.write(data)

class H(BaseHTTPRequestHandler):
    def log_message(self, fmt, *a): sys.stderr.write('[tts] ' + (fmt % a) + '\n')
    def _send(self, code, body, ctype='application/json'):
        self.send_response(code); self.send_header('Content-Type', ctype); self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', str(len(body))); self.end_headers(); self.wfile.write(body)
    def do_GET(self):
        u = urllib.parse.urlparse(self.path)
        if u.path != '/tts': return self._send(404, b'{"error":"/tts?text=..."}')
        q = urllib.parse.parse_qs(u.query); text = (q.get('text') or [''])[0]
        is_ru = text.lstrip().startswith('[Русское произношение]')
        voice, rate = (VOICE_RU, RATE_RU) if is_ru else (VOICE, RATE)
        c = clean(text)
        if not c: return self._send(400, b'{"error":"bo\'sh matn"}')
        h = hashlib.sha1((voice + rate + c).encode('utf-8')).hexdigest()
        p = CACHE / (h + '.mp3')
        if not p.exists() or p.stat().st_size < 500:
            # F-1109-01 (M49): o'zbekcha ovoz «backslash»ni harfma-harf o'qiydi — aytilishi bo'yicha yozamiz (xesh o'zgarmaydi)
            say = c if is_ru else re.sub(r'\bbackslash\b', 'bekslesh', c, flags=re.I)
            try: asyncio.run(synth(say, p, voice, rate))
            except Exception as e:
                if p.exists(): p.unlink()
                return self._send(502, json.dumps({'error': str(e)}).encode())
        data = p.read_bytes()
        self.send_response(200); self.send_header('Content-Type', 'audio/mpeg'); self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache'); self.send_header('Content-Length', str(len(data))); self.end_headers(); self.wfile.write(data)

print(f'TTS dev server: http://127.0.0.1:{PORT}/tts?text=...  kesh: {CACHE}', flush=True)
ThreadingHTTPServer(('127.0.0.1', PORT), H).serve_forever()
