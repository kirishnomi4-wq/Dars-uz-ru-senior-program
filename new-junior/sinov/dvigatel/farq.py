# Oltin namuna bilan solishtirish (oltin.mjs sol chaqiradi): har holatning surati (piksel), ekran matni, HTML va Blockly bloklari.
#   python3 -I new-junior/sinov/dvigatel/farq.py <asos papka> <yangi papka>
# Natija: har farqli holat nomi va nima farq qilgani; suratdagi farq — <yangi>/_farq/<nom>.png (farqli piksellar qizil).
# Chiqish kodi: 0 — hammasi bir xil, 1 — farq bor.
import json, sys, os
from PIL import Image, ImageChops

asos, yangi = sys.argv[1], sys.argv[2]
A = json.load(open(os.path.join(asos, 'holat.json')))
B = json.load(open(os.path.join(yangi, 'holat.json')))
farqlar, bir_xil = [], 0
os.makedirs(os.path.join(yangi, '_farq'), exist_ok=True)
for nom in sorted(set(A) | set(B)):
    if nom not in A: farqlar.append((nom, 'namunada yo‘q (yangi holat)')); continue
    if nom not in B: farqlar.append((nom, 'yangi suratlarda yo‘q')); continue
    sabab = []
    a, b = A[nom], B[nom]
    if a['id'] != b['id']: sabab.append('ekran %s → %s' % (a['id'], b['id']))
    if a['matn'] != b['matn']: sabab.append('matn')
    if a['bloklar'] != b['bloklar']: sabab.append('bloklar %s → %s' % (a['bloklar'], b['bloklar']))
    if a['html'] != b['html']: sabab.append('html (%d → %d belgi)' % (a['uzun'], b['uzun']))
    ia = Image.open(os.path.join(asos, nom + '.png')).convert('RGB')
    ib = Image.open(os.path.join(yangi, nom + '.png')).convert('RGB')
    if ia.size != ib.size:
        sabab.append('surat o‘lchami %s → %s' % (ia.size, ib.size))
    else:
        d = ImageChops.difference(ia, ib)
        bbox = d.getbbox()
        if bbox:
            # birorta kanali farq qilgan piksel (convert('L') 1 darajali ko'k farqni yo'qotadi — shuning uchun kanallarning eng kattasi)
            r, g_, b_ = d.split()
            m = ImageChops.lighter(ImageChops.lighter(r, g_), b_).point(lambda v: 255 if v else 0)
            n = m.histogram()[255]
            sabab.append('surat: %d piksel (eng katta farq %d/255), joyi %s' % (n, max(x[1] for x in d.getextrema()), bbox))
            ko = ib.copy(); ko.paste((255, 0, 0), mask=m); ko.save(os.path.join(yangi, '_farq', nom + '.png'))
    if sabab: farqlar.append((nom, '; '.join(sabab)))
    else: bir_xil += 1
print('BIR XIL: %d / %d' % (bir_xil, len(set(A) | set(B))))
for nom, s in farqlar: print('✗ %s — %s' % (nom, s))
if not farqlar: print('FARQ YO‘Q — 0 piksel, matn va HTML bir xil')
sys.exit(1 if farqlar else 0)
