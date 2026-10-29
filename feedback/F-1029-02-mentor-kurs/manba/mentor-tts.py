#!/usr/bin/env python3
"""MD ssenariy → har «Ovoz» bo'lagi uchun mp3 + so'z-vaqt (edge-tts, Sardor). Natija: korik/data.json + korik/audio/*.mp3
Ishlatish: python3 manba/mentor-tts.py 01-NestArch-mentor-v1.md korik
"""
import asyncio, json, re, subprocess, sys, time, pathlib, datetime
import edge_tts

MD = pathlib.Path(sys.argv[1]); OUT = pathlib.Path(sys.argv[2]); AUD = OUT / 'audio'; AUD.mkdir(parents=True, exist_ok=True)
VOICE, RATE = 'uz-UZ-SardorNeural', '-5%'
lines = MD.read_text(encoding='utf-8').split('\n')

# --- ekranlarga bo'lish
screens, cur = [], None
for ln in lines:
    m = re.match(r'^## (S\d+) · (.+)$', ln)
    if m:
        cur = {'id': m.group(1), 'title': m.group(2).strip(), 'body': []}; screens.append(cur); continue
    if ln.startswith('## ') or ln.startswith('# '):
        cur = None; continue
    if cur is not None: cur['body'].append(ln)

OVOZ = re.compile(r'^- \*\*Ovoz([^*]*)\*\*:?\s*(.*)$')
def parse(body):
    segs, screen_lines, i = [], [], 0
    while i < len(body):
        ln = body[i]; m = OVOZ.match(ln)
        if m:
            label = m.group(1).strip().rstrip(':').strip(); text = [m.group(2).strip()]; i += 1
            while i < len(body) and body[i].startswith('  ') and body[i].strip() and not body[i].lstrip().startswith(('- ', '|', '```', '*(')):
                text.append(body[i].strip()); i += 1
            segs.append({'label': label, 'marked': ' '.join(t for t in text if t)})
            continue
        if re.match(r'^- ≈', ln): i += 1; continue
        screen_lines.append(ln); i += 1
    return segs, '\n'.join(screen_lines).strip()

SUBS = [('@', ''), ('·', ','), ('→', ''), ('`', ''), ('**', '')]
def clean_text(marked):
    toks, markers, words = marked.split(), [], []
    for t in toks:
        mm = re.fullmatch(r'\[\[(.+?)\]\]', t)
        if mm: markers.append({'id': mm.group(1), 'k': len(words)})
        else: words.append(t)
    s = ' '.join(words)
    for a, b in SUBS: s = s.replace(a, b)
    return s, markers

async def tts(text, path):
    for attempt in range(3):
        try:
            com = edge_tts.Communicate(text, VOICE, rate=RATE, boundary='WordBoundary')
            words = []
            with open(path, 'wb') as f:
                async for ch in com.stream():
                    if ch['type'] == 'audio': f.write(ch['data'])
                    elif ch['type'] == 'WordBoundary':
                        words.append({'t': round(ch['offset'] / 1e7, 3), 'd': round(ch['duration'] / 1e7, 3), 'w': ch['text']})
            if path.stat().st_size > 1000: return words
        except Exception as e:
            print('  xato', attempt, e, file=sys.stderr); await asyncio.sleep(2 + attempt * 2)
    return []

def dur(path):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(path)], capture_output=True, text=True)
    try: return float(r.stdout.strip())
    except: return 0.0

async def main():
    data = {'made': datetime.datetime.now().strftime('%d.%m.%Y %H:%M'), 'voice': VOICE, 'screens': []}
    total, nseg = 0.0, 0
    for s in screens:
        segs, screen_md = parse(s['body'])
        out_s = {'id': s['id'], 'title': s['title'], 'screen': screen_md, 'segments': []}
        for gi, g in enumerate(segs):
            clean, markers = clean_text(g['marked'])
            fn = f"{s['id']}-{gi}.mp3"; path = AUD / fn
            words = await tts(clean, path)
            d = dur(path); total += d; nseg += 1
            out_s['segments'].append({'label': g['label'], 'audio': 'audio/' + fn, 'dur': round(d, 2), 'clean': clean, 'marked': g['marked'], 'markers': markers, 'words': words})
            print(f"{s['id']}-{gi} {g['label'] or ''} {d:5.1f}s {len(words)} so'z", flush=True)
            await asyncio.sleep(0.4)
        data['screens'].append(out_s)
    data['total'] = round(total); data['segments'] = nseg
    (OUT / 'data.json').write_text(json.dumps(data, ensure_ascii=False), encoding='utf-8')
    print(f"TAYYOR: {len(screens)} ekran, {nseg} audio, jami {total/60:.1f} daqiqa")

asyncio.run(main())
