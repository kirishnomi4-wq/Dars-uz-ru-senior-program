# F-1015-147 (A): «Natijalar» halqasi ostida hisob qoidasi — faqat birinchi urinishda to'g'ri javob sanaladi. python3 ring147.py fayl...
import re, sys, shutil, os
B = '/home/kali/Desktop/internetLesson/arxiv/F-1015-147-oldin/'
IZ = "<p className=\"ring-iz\">{tr({ uz: \"Testlarda birinchi urinishda topilgan to'g'ri javoblar\", ru: 'Верные ответы в тестах с первой попытки' })}</p>"
CSS = ".ring-iz { margin: 0; font-size: 13px; line-height: 1.4; color: ${T.ink2}; text-align: center; } /* F-1015-147: hisob qoidasi */\n"
for p in sys.argv[1:]:
    s = open(p, encoding='utf-8').read()
    if 'ring-iz' in s: print('bor', p); continue
    if not os.path.exists(B + os.path.basename(p)): shutil.copy(p, B + os.path.basename(p))
    a1 = '<div className="pod-card-ring"><ScoreRing correct={selfCorrect} total={totalQ} /></div>'
    a2 = '<ScoreRing correct={selfCorrect} total={totalQ} />'
    if a1 in s: assert s.count(a1) == 1; s = s.replace(a1, a1 + IZ)
    else: assert s.count(a2) == 1, p; s = s.replace(a2, a2 + IZ)
    m = re.search(r'(?m)^([ \t]*)\.zoom-btn \{[^\n]*\n', s)
    if not m: m = re.search(r'(?m)^([ \t]*)\.ring-center \{[^\n]*\n', s)
    s = s[:m.end()] + m.group(1) + CSS + s[m.end():]
    open(p, 'w', encoding='utf-8').write(s)
print('tayyor')
