#!/usr/bin/env python3
"""audit-v4 (11.11): brauzerdan MUSTAQIL md5 tekshiruvi — yangi paket (royxat-v4.json) uchun.
Kirish: dump/audit-jsx-v4.json (sahifa yig'adi: [{qid, sid, lid, file, status, lang, jsx}]) — har CRM faylini shelldan yuklab olib,
royxat-v4.json dagi md5 bilan solishtiradi; nom (fn), status Active va til (uz/ru qatori) ham tekshiriladi.
--csv bilan: uz+ru ikkalasi to'liq ✓ bo'lgan darslar uchun <paket>/yuklangan.csv da `yuklandi` = bugungi sana (bo'sh bo'lsa).
Natija: dump/audit-v4-natija.json + qisqa hisobot. Ishlatish: python3 -I audit-v4.py [--csv]"""
import csv, datetime, hashlib, json, os, sys, urllib.request

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/'
PAKET = '/home/kali/Desktop/internetLesson/yuklash-20261111-prod/'
royxat = json.load(open(K + 'konveyer/royxat-v4.json'))
rows = json.load(open(K + 'dump/audit-jsx-v4.json'))
by_q = {}
for L in royxat:
    by_q[str(L['uz'])] = (L, 'uz'); by_q[str(L['ru'])] = (L, 'ru')

nat, kesh = {}, {}
for r in rows:
    q = str(r['qid'])
    if q not in by_q: nat[q] = {'xato': "royxatda yo'q"}; continue
    L, t = by_q[q]
    o = {'lid': L['lid'], 'til': t, 'file': r.get('file'), 'status': r.get('status'), 'lang': r.get('lang'),
         'nom_ok': r.get('file') == L['fn'], 'til_ok': r.get('lang') == t, 'status_ok': r.get('status') == 'Active'}
    url = r.get('jsx')
    if url:
        if url not in kesh:
            try:
                with urllib.request.urlopen(url, timeout=90) as resp:
                    kesh[url] = hashlib.md5(resp.read()).hexdigest()
            except Exception as e:
                kesh[url] = 'xato: ' + str(e)[:80]
        o['md5'] = kesh[url]
    else:
        o['md5'] = None
    o['md5_ok'] = o['md5'] == L['md5']
    o['ok'] = o['md5_ok'] and o['nom_ok'] and o['til_ok'] and o['status_ok']
    nat[q] = o

json.dump(nat, open(K + 'dump/audit-v4-natija.json', 'w'), ensure_ascii=False, indent=1)
ok_dars = [L['lid'] for L in royxat if all(nat.get(str(L[t]), {}).get('ok') for t in ('uz', 'ru'))]
yomon = {q: o for q, o in nat.items() if not o.get('ok')}
yoq = [q for q in by_q if q not in nat]
print(f"qator: {len(nat)} tekshirildi · to'liq ✓ {len(nat) - len(yomon)} · muammoli {len(yomon)} · yig'mada yo'q {len(yoq)}")
print(f"dars: to'liq ✓ {len(ok_dars)}/{len(royxat)} · yuklab olingan noyob fayl {len(kesh)}")
for q, o in list(yomon.items())[:20]:
    print('  ', q, json.dumps(o, ensure_ascii=False)[:300])

if '--csv' in sys.argv:
    if yomon or yoq or len(ok_dars) != len(royxat):
        print('csv BELGILANMADI — avval muammolarni hal qiling'); sys.exit(1)
    p = PAKET + 'yuklangan.csv'
    with open(p, newline='', encoding='utf-8') as f:
        rd = list(csv.DictReader(f)); cols = list(rd[0].keys())
    bugun = datetime.date.today().isoformat(); n = 0
    for r in rd:
        if r['lesson_id'] in ok_dars and not r['yuklandi']:
            r['yuklandi'] = bugun; n += 1
    with open(p, 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=cols, lineterminator='\n'); w.writeheader(); w.writerows(rd)
    print(f"yuklangan.csv: {n} dars belgilandi ({bugun}); jami belgilangan {sum(1 for r in rd if r['yuklandi'])}/{len(rd)}")
