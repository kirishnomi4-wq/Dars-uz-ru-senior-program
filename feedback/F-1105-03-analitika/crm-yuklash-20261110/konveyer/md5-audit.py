#!/usr/bin/env python3
"""Mustaqil md5 tekshiruvi: dump/audit-jsx.json (sahifa yig'adi: [{qid, sid, file, status, jsx}]) dagi har CRM faylini
shelldan yuklab olib, yuklash-xarita.json dagi md5_yangi bilan solishtiradi. --csv bilan: uz+ru ikkalasi Active va md5 ✓
bo'lgan darslar uchun yuklash-20261110-prod/yuklangan.csv da `yuklandi` = bugungi sana (bo'sh bo'lsa).
Natija: dump/audit-natija.json + qisqa hisobot stdout'ga."""
import csv, datetime, hashlib, json, sys, urllib.request

B = '/home/kali/Desktop/internetLesson/'
K = B + 'feedback/F-1105-03-analitika/crm-yuklash-20261110/'
xarita = json.load(open(K + 'yuklash-xarita.json'))
rows = json.load(open(K + 'dump/audit-jsx.json'))
by_q = {}
for x in xarita:
    for t in ('uz', 'ru'):
        by_q[str(x[t]['qid'])] = (x, t)

nat, kesh = {}, {}
for r in rows:
    q = str(r['qid']); x, t = by_q[q]
    fn = x['yangi'].split('/')[-1]
    o = {'lid': x['lesson_id'], 'til': t, 'file': r.get('file'), 'status': r.get('status'), 'nom_ok': r.get('file') == fn}
    url = r.get('jsx')
    if url:
        if url not in kesh:
            try:
                with urllib.request.urlopen(url, timeout=60) as resp:
                    kesh[url] = hashlib.md5(resp.read()).hexdigest()
            except Exception as e:
                kesh[url] = 'xato: ' + str(e)[:80]
        o['md5'] = kesh[url]; o['md5_ok'] = kesh[url] == x['md5_yangi']
    else:
        o['md5_ok'] = False; o['md5'] = None
    nat[q] = o

json.dump(nat, open(K + 'dump/audit-natija.json', 'w'), ensure_ascii=False, indent=1)
ok_dars = []
for x in xarita:
    a, b = nat.get(str(x['uz']['qid'])), nat.get(str(x['ru']['qid']))
    if a and b and all(o['md5_ok'] and o['nom_ok'] and o['status'] == 'Active' for o in (a, b)):
        ok_dars.append(x['lesson_id'])
yomon = {q: o for q, o in nat.items() if not (o['md5_ok'] and o['nom_ok'] and o['status'] == 'Active')}
print(f"tekshirildi {len(nat)} qator · to'liq ✓ dars {len(ok_dars)} · muammoli qator {len(yomon)}")
for q, o in list(yomon.items())[:20]:
    print('  ', q, o['lid'], o['til'], o['file'], o['status'], 'md5', 'ok' if o['md5_ok'] else o['md5'])

if '--csv' in sys.argv:
    p = B + 'yuklash-20261110-prod/yuklangan.csv'
    with open(p, newline='', encoding='utf-8') as f:
        rd = list(csv.DictReader(f)); cols = list(rd[0].keys())
    bugun = datetime.date.today().isoformat(); n = 0
    for r in rd:
        if r['lesson_id'] in ok_dars and not r['yuklandi']:
            r['yuklandi'] = bugun; n += 1
    with open(p, 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=cols); w.writeheader(); w.writerows(rd)
    print(f"yuklangan.csv: {n} dars belgilandi ({bugun}); jami belgilangan {sum(1 for r in rd if r['yuklandi'])}/{len(rd)}")
