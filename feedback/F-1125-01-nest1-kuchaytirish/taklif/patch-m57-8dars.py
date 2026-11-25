#!/usr/bin/env python3
"""F-1125-01 · M57 supurish (qolgan 8 mentor darsi) — 25.11 kech, foydalanuvchi: «avtopilotda ishla» (tavsiya A).
2a · Telegraf+PG yakuni, «O'quvchi so'rasa» kartasi: «restart va ikki marta bosish (11, 15-ekran)» → 14-ekran
     (ikki marta tez bosish — 14-ekran; 15-ekran — telefon kutish restartdan o'tadi, xato emas). MD'dan beri shunday.
2b · Sinfga tayyorgarlik: o'quvchi darsining kod oynasi ovozda ichki id (s9, noldan) bilan aytilgan, o'quvchi darsi esa
     ekranda birdan sanaydi (10 / 20): WS-1 9→10 (+ «ikkinchi, to'rtinchi, beshinchi» → 3, 5, 6) · WS-2 8→9
     (+ 2, 4, 6 → 3, 5, 7) · Webhook 7→8. MD + RU (qism JSON va txt) + yozuv lug'ati (04-yordam DIGITS).
Ishlatish (repo ildizidan): python3 feedback/F-1125-01-nest1-kuchaytirish/taklif/patch-m57-8dars.py
Har almashtirish aynan 1 marta topilishi shart — aks holda hech narsa yozilmaydi.
RU: qism/*.txt eskirgan (JSON F-1120-02 da to'g'ridan tahrirlangan) — ru-txt.py YURGIZILMAYDI, ikkalasi qatorma-qator."""
from pathlib import Path
R = Path(__file__).resolve().parents[3]
F = 'feedback/F-1029-02-mentor-kurs/'
P = []  # (fayl, satr-filtri yoki None, eski, yangi)
# --- 2a · Telegraf+PG ---
P += [('src/mentor-kurs/tgpg/parts/07-s25-s28.jsx', None, 'restart va ikki marta bosish (11, 15-ekran)', 'restart va ikki marta bosish (11, 14-ekran)'),
      (F + 'ru/tgpg-sahna.js', None, 'перезапуск и двойное нажатие (экраны 11, 15)', 'перезапуск и двойное нажатие (экраны 11, 14)'),
      (F + '17-TgPg-mentor-v2.md', None, 'restart va ikki marta bosish (11, 15-ekran)', 'restart va ikki marta bosish (11, 14-ekran)')]
# --- 2b · WebSocket-1 (o'quvchi m10-02: s9 kod oynasi = 10 / 20; s2, s4, s5 = 3, 5, 6) ---
P += [(F + '19-WS1-mentor-v2.md', None, "og'ir joy — 9-ekran kod oynasi", "og'ir joy — 10-ekran kod oynasi"),
      (F + '19-WS1-mentor-v2.md', None, "Og'ir joy to'qqizinchi ekrandagi kod oynasi", "Og'ir joy o'ninchi ekrandagi kod oynasi"),
      (F + '19-WS1-mentor-v2.md', None, "Ikkinchi, to'rtinchi, beshinchi ekranlarga", "Uchinchi, beshinchi, oltinchi ekranlarga"),
      ('src/mentor-kurs/ws1/parts/04-yordam.jsx', None, '''["to'qqizinchi ekran", '9-ekran'], ["oltinchi ekran", '6-ekran']''',
       '''["Uchinchi, beshinchi, oltinchi ekranlarga", '3, 5, 6-ekranlarga'], ["o'ninchi ekran", '10-ekran'], ["oltinchi ekran", '6-ekran']'''),
      (F + 'ru/qism/ws1-2.json', '"21.seg.c.key"', 'на 9-м экране', 'на 10-м экране'),
      (F + 'ru/qism/ws1-2.json', '"21.seg.c.voice"', 'на девятом экране', 'на десятом экране'),
      (F + 'ru/qism/ws1-2.json', '"21.seg.c.voice"', 'На второй, четвёртый и пятый экраны', 'На третий, пятый и шестой экраны'),
      (F + 'ru/qism/ws1-2.txt', '21.seg.c.key =', 'на 9-м экране', 'на 10-м экране'),
      (F + 'ru/qism/ws1-2.txt', '21.seg.c.voice =', 'на девятом экране', 'на десятом экране'),
      (F + 'ru/qism/ws1-2.txt', '21.seg.c.voice =', 'На второй, четвёртый и пятый экраны', 'На третий, пятый и шестой экраны')]
# --- 2b · WebSocket-2 (o'quvchi m10-05: s8 = 9 / 19; s2, s4, s6 = 3, 5, 7) ---
P += [(F + '21-WS2-mentor-v2.md', None, "og'ir joy — 8-ekran kod oynasi", "og'ir joy — 9-ekran kod oynasi"),
      (F + '21-WS2-mentor-v2.md', None, "Og'ir joy sakkizinchi ekrandagi kod oynasi", "Og'ir joy to'qqizinchi ekrandagi kod oynasi"),
      (F + '21-WS2-mentor-v2.md', None, "Ikkinchi, to'rtinchi, oltinchi ekranlarga", "Uchinchi, beshinchi, yettinchi ekranlarga"),
      ('src/mentor-kurs/ws2/parts/04-yordam.jsx', None, '''["sakkizinchi ekran", '8-ekran'], ["to'rtinchi ekran", '4-ekran']''',
       '''["Uchinchi, beshinchi, yettinchi ekranlarga", '3, 5, 7-ekranlarga'], ["to'qqizinchi ekran", '9-ekran'], ["to'rtinchi ekran", '4-ekran']'''),
      (F + 'ru/qism/ws2-2.json', '"20.seg.c.key"', 'на 8-м экране', 'на 9-м экране'),
      (F + 'ru/qism/ws2-2.json', '"20.seg.c.voice"', 'на восьмом экране', 'на девятом экране'),
      (F + 'ru/qism/ws2-2.json', '"20.seg.c.voice"', 'На второй, четвёртый и шестой экраны', 'На третий, пятый и седьмой экраны'),
      (F + 'ru/qism/ws2-2.txt', '20.seg.c.key =', 'на 8-м экране', 'на 9-м экране'),
      (F + 'ru/qism/ws2-2.txt', '20.seg.c.voice =', 'на восьмом экране', 'на девятом экране'),
      (F + 'ru/qism/ws2-2.txt', '20.seg.c.voice =', 'На второй, четвёртый и шестой экраны', 'На третий, пятый и седьмой экраны')]
# --- 2b · Webhook (o'quvchi m11-03: s7 = 8 / 20) ---
P += [(F + '23-WH-mentor-v2.md', None, "og'ir joy — 7-ekran kod oynasi", "og'ir joy — 8-ekran kod oynasi"),
      (F + '23-WH-mentor-v2.md', None, "Og'ir joy yettinchi ekrandagi kod oynasi", "Og'ir joy sakkizinchi ekrandagi kod oynasi"),
      ('src/mentor-kurs/wh/parts/04-yordam.jsx', None, '''["yettinchi ekran", '7-ekran']''', '''["sakkizinchi ekran", '8-ekran']'''),
      (F + 'ru/qism/wh-2.json', '"21.seg.c.key"', 'на 7-м экране', 'на 8-м экране'),
      (F + 'ru/qism/wh-2.json', '"21.seg.c.voice"', 'на седьмом экране', 'на восьмом экране'),
      (F + 'ru/qism/wh-2.txt', '21.seg.c.key =', 'на 7-м экране', 'на 8-м экране'),
      (F + 'ru/qism/wh-2.txt', '21.seg.c.voice =', 'на седьмом экране', 'на восьмом экране')]

buf = {}
for f, filt, old, new in P:
  s = buf.setdefault(f, (R / f).read_text())
  if filt is None:
    if s.count(old) != 1: raise SystemExit(f'{f}: «{old}» {s.count(old)} marta (1 kutilgan)')
    buf[f] = s.replace(old, new)
  else:
    lines = s.split('\n'); hit = [i for i, l in enumerate(lines) if filt in l]
    if len(hit) != 1 or lines[hit[0]].count(old) != 1: raise SystemExit(f'{f} [{filt}]: «{old}» topilmadi yoki bir necha')
    lines[hit[0]] = lines[hit[0]].replace(old, new); buf[f] = '\n'.join(lines)
for f, s in buf.items(): (R / f).write_text(s)
print(f'{len(P)} almashtirish, {len(buf)} fayl')
