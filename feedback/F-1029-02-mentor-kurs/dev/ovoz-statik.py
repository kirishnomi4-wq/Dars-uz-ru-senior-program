#!/usr/bin/env python3
"""Vercel ko'rik sayti uchun statik ovoz (03.11): matnlar JSON (dev/ovoz-matnlar.mjs) → har matnning mp3 i <sayt>/tts/<sha1>.mp3.
Keshda yo'q bo'lsa — lokal TTS-server (:5332) orqali yaratiladi (edge-tts). Kesh nomi dev/tts-server.py bilan AYNAN bir xil.
ISHLATISH: python3 dev/ovoz-statik.py <matnlar.json> <sayt-papka>
"""
import hashlib, json, pathlib, re, shutil, sys, urllib.parse, urllib.request
TAG = re.compile(r'\[[^\]]{1,40}\]')
SUBS = [('@', ''), ('·', ','), ('→', ''), ('`', ''), ('**', '')]
def clean(t):
    s = TAG.sub(' ', t)
    for a, b in SUBS: s = s.replace(a, b)
    return re.sub(r'\s+', ' ', s).strip()
def key(t):
    ru = t.lstrip().startswith('[Русское произношение]')
    return hashlib.sha1((('ru-RU-DmitryNeural+0%' if ru else 'uz-UZ-SardorNeural-5%') + clean(t)).encode('utf-8')).hexdigest()
CACHE = pathlib.Path(__file__).resolve().parent.parent / 'korik' / 'tts-cache'
src, site = sys.argv[1], pathlib.Path(sys.argv[2])
out = site / 'tts'; out.mkdir(parents=True, exist_ok=True)
texts = {t for v in json.load(open(src, encoding='utf-8')).values() for t in v if t and clean(t)}
made = copied = fail = 0
for t in sorted(texts):
    h = key(t); p = CACHE / (h + '.mp3')
    if not p.exists() or p.stat().st_size < 500:
        try:
            urllib.request.urlopen('http://127.0.0.1:5332/tts?text=' + urllib.parse.quote(t), timeout=120).read(); made += 1
        except Exception as e:
            fail += 1; print('XATO:', t[:60], e); continue
    shutil.copy2(p, out / (h + '.mp3')); copied += 1
print(f'matn {len(texts)} · yangi yaratildi {made} · nusxalandi {copied} · xato {fail}')
