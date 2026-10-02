#!/usr/bin/env python3
# faqat-izoh — dars faylida izoh/recap MATNIDAN boshqa hech narsa o'zgarmaganini isbotlaydi (30.09).
# Zaxira (arxiv/izoh-qisqa-oldin-2026-09-30) → codemod-izoh (vaqtinchalik nusxada) → izoh matnlari niqoblanadi;
# joriy fayl ham niqoblanadi; ikkalasi bayt-ma-bayt teng bo'lishi shart (kalitlar, variantlar, correctIdx, kod).
#   python3 faqat-izoh.py <src/…/Dars.jsx>…
import os, re, shutil, subprocess, sys, tempfile
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE); import izoh
ARX = 'arxiv/izoh-qisqa-oldin-2026-09-30'

def mask(s):
    spans = []
    for it in izoh.extract(s):
        for L in (it['_uz'], it['_ru']):
            if L: spans.append((L[0], L[1]))
    for a, b in sorted(spans, reverse=True): s = s[:a] + '§' + s[b:]
    return s, len(spans)

bad = 0
for f in sys.argv[1:]:
    tmp = tempfile.mkdtemp(); t = os.path.join(tmp, os.path.basename(f))
    shutil.copy(os.path.join(ARX, f), t)
    subprocess.run(['python3', os.path.join(HERE, 'codemod-izoh.py'), t], capture_output=True)
    base = open(t, encoding='utf8').read()
    # ReactRouterPractice: codemod'dan keyin qo'lda bitta mentor-yorliq (Eslatma —) o'zgargan
    base = base.replace("uz: 'Qayta tushuntirish —', ru: 'Повторное объяснение —'", "uz: 'Eslatma —', ru: 'Напоминание —'")
    cur = open(f, encoding='utf8').read()
    mb, nb = mask(base); mc, nc = mask(cur)
    ok = mb == mc
    if not ok:
        bad += 1
        import difflib
        d = [l for l in difflib.unified_diff(mb.splitlines(), mc.splitlines(), lineterm='', n=0) if l[:1] in '+-' and l[:3] not in ('+++', '---')]
        print(f'✗ {f}: izohdan tashqari farq {len(d)} qator'); [print('   ', l[:160]) for l in d[:6]]
    else:
        print(f'✓ {f}: faqat izoh matni ({nc} satr-joy)')
    shutil.rmtree(tmp)
sys.exit(1 if bad else 0)
