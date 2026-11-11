#!/usr/bin/env python3
"""Konveyer kuzatuvchisi: dump/konveyer-holat.json ni har 60 s o'qiydi, faqat muhim hodisani chiqaradi.
Hodisalar: modul tugadi · pauza/tugadi · nosoz qator · 12 daqiqa yangilanmadi (sahifa uxlagan/yopilgan bo'lishi mumkin).
Chiqish: holat pauza/tugadi bo'lsa yoki --muddat soniyadan keyin."""
import json, os, sys, time

F = '/home/kali/Desktop/internetLesson/feedback/F-1105-03-analitika/crm-yuklash-20261110/dump/konveyer-holat.json'
muddat = int(sys.argv[1]) if len(sys.argv) > 1 else 1700
t0 = time.time()
tugagan = set(sys.argv[2].split(',')) if len(sys.argv) > 2 and sys.argv[2] else set()
eski_jim = False
while time.time() - t0 < muddat:
    try:
        d = json.load(open(F))
        yosh = time.time() - os.path.getmtime(F)
    except Exception as e:
        print('holat fayli o\'qilmadi:', e, flush=True); time.sleep(60); continue
    for m, o in sorted(d.get('modullar', {}).items(), key=lambda x: int(x[0])):
        if m in tugagan: continue
        if o['kutyapti'] == 0 and o['nosoz'] == 0 and o['active'] + o['otkazildi'] == o['jami']:
            tugagan.add(m)
            print(f"MODUL {m} TUGADI: {o['active']}/{o['jami']} dars Active · konveyer {d['i']+1}/{d['n']} · {d['vaqt'][11:19]}Z", flush=True)
    if d.get('nosoz'):
        print('NOSOZ:', json.dumps(d['nosoz'], ensure_ascii=False)[:600], flush=True)
    if d.get('holat') in ('pauza', 'tugadi', "to'xtadi"):
        print(f"KONVEYER {d['holat'].upper()}: {d.get('pauza')} · {d['i']+1}/{d['n']} · {d['vaqt'][11:19]}Z", flush=True)
        sys.exit(0)
    if yosh > 720 and not eski_jim:
        eski_jim = True
        print(f"JIM: holat {int(yosh/60)} daqiqadan beri yangilanmadi (joriy: {d.get('joriy')}) — tab uxlagan bo'lishi mumkin", flush=True)
    elif yosh <= 720:
        eski_jim = False
    time.sleep(60)
print('TUGAGANLAR=' + ','.join(sorted(tugagan, key=int)), flush=True)
