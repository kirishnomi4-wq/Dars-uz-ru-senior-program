# royxat-v4 (11.11): konveyer-v4 uchun ro'yxat — YANGI paket csv'si (fayl nomi, md5) + yuklash-xarita.json (CRM bo'limi, qatorlar, eski fayl).
# Ishlatish: python3 -I royxat-v4.py <paket>/yuklangan.csv  → royxat-v4.json (shu papkada)
# Tekshiradi: 172 dars ikkala manbada bor · CRM qator raqamlari (crm_uz/crm_ru) ikki manbada bir xil · paketda fayl bor va md5 mos.
import csv, hashlib, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
csv_yol = os.path.abspath(sys.argv[1])
paket = os.path.join(os.path.dirname(csv_yol), 'yakka')
xarita = {d['lesson_id']: d for d in json.load(open(os.path.join(HERE, '..', 'yuklash-xarita.json')))}
qatorlar = list(csv.DictReader(open(csv_yol)))
xato = []
out = []
for c in qatorlar:
    x = xarita.get(c['lesson_id'])
    if not x: xato.append(c['lesson_id'] + ': xaritada yo\'q'); continue
    if str(x['uz']['qid']) != c['crm_uz'] or str(x['ru']['qid']) != c['crm_ru']:
        xato.append(c['lesson_id'] + f": qator farq xarita {x['uz']['qid']}/{x['ru']['qid']} ≠ csv {c['crm_uz']}/{c['crm_ru']}")
    if x['uz']['sid'] != x['ru']['sid']: xato.append(c['lesson_id'] + ': uz/ru bo\'limi farq')
    fp = os.path.join(paket, c['fayl'])
    if not os.path.exists(fp): xato.append(c['lesson_id'] + ': paketda fayl yo\'q ' + c['fayl']); continue
    if hashlib.md5(open(fp, 'rb').read()).hexdigest() != c['md5']: xato.append(c['lesson_id'] + ': md5 farq')
    out.append({'m': int(c['modul']), 'sid': x['uz']['sid'], 'uz': x['uz']['qid'], 'ru': x['ru']['qid'], 'rel': c['fayl'],
                'fn': os.path.basename(c['fayl']), 'eski': os.path.basename(x['eski']), 'lid': c['lesson_id'], 'md5': c['md5']})
yoq = set(xarita) - {c['lesson_id'] for c in qatorlar}
if yoq: xato.append('csv\'da yo\'q: ' + ', '.join(sorted(yoq)))
out.sort(key=lambda d: (d['m'], d['fn']))
if xato:
    print('XATO:\n  ' + '\n  '.join(xato)); sys.exit(1)
json.dump(out, open(os.path.join(HERE, 'royxat-v4.json'), 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(f'royxat-v4.json: {len(out)} dars · modullar', dict(sorted(Counter(d["m"] for d in out).items())))
