#!/usr/bin/env python3
# lms-md5 — LMS'ga yuklangan fayllarni paket bilan md5 orqali solishtiradi (REJA 5.2, 02.10).
#
# Kirish: matn-fayl (yoki stdin) — ichida LMS havolalari bo'lsa bas:
#   preview URL (`...?jsx=https%3A%2F%2Fgo.coddycamp.uz%2Fuploads%2F...%2F<hash>.jsx`),
#   to'g'ridan-to'g'ri `https://go.coddycamp.uz/uploads/.../<hash>.jsx`, yoki yalang'och 32-hex hash.
#   Qator boshida dars nomi bo'lsa (masalan «HTML asoslari => https://...»), jadvalda ko'rsatiladi.
#
# Chiqish: har hash uchun — LMS md5 · paketdagi fayl (md5 mos bo'lsa) · bo'lmasa lessonId bo'yicha
#   qaysi dars ekani va paketdagi o'sha darsning md5 (= eski versiya yuklangan).
#   Oxirida: paketdagi qaysi fayllar LMS'da ko'rinmadi.
#
# Ishlatish:  python3 vositalar/lms-md5.py <havolalar.txt> [paket-papka]   (sukut: yuklash-2026-10-01)
#             LMS_MD5_OUT=<papka> — tortilgan fayllar shu yerga (sukut: scratchpad/lms-md5)
import sys, os, re, io, glob, hashlib, subprocess, urllib.parse

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
src = sys.argv[1] if len(sys.argv) > 1 else '-'
PAKET = os.path.join(ROOT, sys.argv[2] if len(sys.argv) > 2 else 'yuklash-2026-10-01')
OUT = os.environ.get('LMS_MD5_OUT') or os.path.join(ROOT, 'feedback/F-0929-LMS-yuklash/tekshiruv-2026-10-01/lms-md5')
os.makedirs(OUT, exist_ok=True)

# --- paket xaritasi: md5 → fayl, lessonId → (fayl, md5)
by_md5, by_id = {}, {}
for f in sorted(glob.glob(os.path.join(PAKET, '*-Modul', '*.jsx'))):
    data = open(f, 'rb').read()
    h = hashlib.md5(data).hexdigest()
    rel = os.path.relpath(f, PAKET)
    by_md5[h] = rel
    m = re.search(rb'lessonId: *["\']([a-z0-9-]+)["\']', data)
    if m:
        by_id.setdefault(m.group(1).decode(), (rel, h))

# --- kirishdan hash'larni yig'ish (nom bilan)
text = sys.stdin.read() if src == '-' else io.open(src, encoding='utf-8').read()
items = []  # (nom, url)
seen = set()
for line in text.splitlines():
    line = line.strip()
    if not line:
        continue
    dec = urllib.parse.unquote(line)
    for m in re.finditer(r'https?://go\.coddycamp\.uz/uploads/[^\s"\'<>|]+?/([0-9a-f]{32})\.jsx', dec):
        if m.group(1) in seen:
            continue
        seen.add(m.group(1))
        nom = dec[:m.start()].split('=>')[0].strip(' |\t-:') if '=>' in dec[:m.start()] else ''
        items.append((nom, m.group(0), m.group(1)))
    if not re.search(r'[0-9a-f]{32}\.jsx', dec):
        for m in re.finditer(r'\b([0-9a-f]{32})\b', dec):
            if m.group(1) in seen:
                continue
            seen.add(m.group(1))
            items.append((dec[:m.start()].strip(' |\t-:'), f'https://go.coddycamp.uz/uploads/lessons/lesson_runner/{m.group(1)}.jsx', m.group(1)))

if not items:
    print('Kirishda LMS havolasi/hash topilmadi.'); sys.exit(2)

print(f'paket: {os.path.relpath(PAKET, ROOT)} · {len(by_md5)} fayl · LMS havola: {len(items)}\n')
print('| № | Nom (LMS) | LMS md5 | Paket fayli | Holat |')
print('|---|---|---|---|---|')
mos, nomos, noma, found = 0, 0, 0, set()
for i, (nom, url, h) in enumerate(items, 1):
    dst = os.path.join(OUT, h + '.jsx')
    if not os.path.exists(dst):
        r = subprocess.run(['curl', '-s', '-m', '60', '-L', '-o', dst, '-w', '%{http_code}', url], capture_output=True, text=True)
        if r.stdout.strip() != '200':
            if os.path.exists(dst): os.remove(dst)
            print(f'| {i} | {nom} | — | — | ❌ HTTP {r.stdout.strip()} ({url}) |'); nomos += 1; continue
    data = open(dst, 'rb').read()
    lh = hashlib.md5(data).hexdigest()
    if lh in by_md5:
        mos += 1; found.add(by_md5[lh])
        print(f'| {i} | {nom} | `{lh[:8]}…` | `{by_md5[lh]}` | ✅ mos |')
        continue
    m = re.search(rb'lessonId: *["\']([a-z0-9-]+)["\']', data)
    lid = m.group(1).decode() if m else None
    if lid and lid in by_id:
        rel, ph = by_id[lid]; nomos += 1
        print(f'| {i} | {nom} | `{lh[:8]}…` | `{rel}` (paket `{ph[:8]}…`) | ❌ ESKI/BOSHQA versiya — lessonId `{lid}` |')
    else:
        noma += 1
        print(f'| {i} | {nom} | `{lh[:8]}…` | — | ⚠️ paketda yo\'q (lessonId: {lid or "topilmadi"}) |')

print(f'\nJAMI: {len(items)} havola · ✅ mos {mos} · ❌ nomos {nomos} · ⚠️ paketda yo\'q {noma}')
rest = [f for f in sorted(by_md5.values()) if f not in found]
if rest:
    print(f'\nPaketda bor, LMS havolalarida KO\'RINMADI ({len(rest)}):')
    for f in rest:
        print('  -', f)
sys.exit(0 if (nomos == 0 and noma == 0) else 1)
