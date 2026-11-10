#!/usr/bin/env python3
"""RU tarjima (M24) — 1-qadam: darsning MDT matnini (03-matn.gen.jsx) kalit bo'yicha tekis ro'yxatga ajratadi.
Ishlatish (repo ildizidan): python3 feedback/F-1029-02-mentor-kurs/dev/ru-ajrat.py <dars-papka>   (masalan ws1)
Chiqadi: feedback/F-1029-02-mentor-kurs/ru/<dars>-uz.json — { kalit: o'zbekcha }; tarjima <dars>-ru.json ga xuddi shu kalitlar bilan yoziladi.
Kalitlar: <ekran>.kicker|eyebrow|title|q|ok|okShort|hint|task|demak · <ekran>.seg.<id>.key|voice · <ekran>.opts.<i> · <ekran>.wrong.<i> ·
          <ekran>.steps.<i>.t|exp · <ekran>.steps.<i>.cmd.<j> (faqat o'zbekcha so'z bo'lsa) · <ekran>.proof.label|placeholder|wrong ·
          <ekran>.trouble.<i>.0|1 · <ekran>.final.<i>.q|e · <ekran>.final.<i>.o.<j>"""
import json, re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
d = sys.argv[1]
src = (ROOT / f'src/mentor-kurs/{d}/parts/03-matn.gen.jsx').read_text()
MDT = json.loads(src[src.index('const MDT = ') + len('const MDT = '):src.rindex(';')])
UZ = re.compile(r"[a-zA-Z]'|o'|g'|\b(va|uchun|bilan|emas|yo'q|bor|qiladi|kerak|nima|qanday|keyin|oldin|bu|shu|ham)\b", re.I)
# 05.11 (F-1105-01): cmds ichidagi gap «faqat/yoki/satr/ekran»… so'zlari bilan ham ushlanadi — avval tushib qolgan edi
UZ2 = re.compile(r"\b(faqat|yoki|satr\w*|\d+-satr\w*|\w*ekran\w*|qator\w*|belgi\w*|probel\w*|buyurtma\w*|telefon\w*|raqam\w*|ning|hozir|har|mijoz\w*|xato\w*|tekshir\w*|ochiq|yangi|bitta|ikkita|oching|yozing|bosing|qiling|kuting|tozalang|yuboring|nusxa\w*|ichida|qayta|yoqing|uzing|tiklang|buzing|yurgizing|soni|holat\w*|dars\w*|tugma\w*|panel\w*|siz\w*|oldida|zanjir\w*|logi|eski|ostiga|qadam\w*|qizil|nomi|terminal\w*|ishlab|ikkala|birinchi|oxirgi|yagona|parol|\w+(?:da|dagi|ga|ni|dan)(?=\s|:|$))\b", re.I)
out = {}
def put(k, v):
  if isinstance(v, str) and v.strip(): out[k] = v
for n, sc in MDT.items():
  for f in ('kicker', 'eyebrow', 'title', 'q', 'ok', 'okShort', 'hint', 'task', 'demak'):
    put(f'{n}.{f}', sc.get(f))
  for s in sc.get('seg', []):
    put(f'{n}.seg.{s[0]}.key', s[1]); put(f'{n}.seg.{s[0]}.voice', s[2])
  for i, o in enumerate(sc.get('opts', [])): put(f'{n}.opts.{i}', o)
  for i, w in (sc.get('wrong') or {}).items(): put(f'{n}.wrong.{i}', w)
  for i, st in enumerate(sc.get('steps', [])):
    put(f'{n}.steps.{i}.t', st['t']); put(f'{n}.steps.{i}.exp', st['exp'])
    for j, c in enumerate(st.get('cmds', [])):
      if UZ.search(c) or UZ2.search(c): put(f'{n}.steps.{i}.cmd.{j}', c)
  pr = sc.get('proof')
  if pr:
    for f in ('label', 'placeholder', 'wrong'): put(f'{n}.proof.{f}', pr.get(f))
  for i, tr in enumerate(sc.get('trouble', [])):
    put(f'{n}.trouble.{i}.0', tr[0]); put(f'{n}.trouble.{i}.1', tr[1])
  for i, q in enumerate(sc.get('final', [])):
    put(f'{n}.final.{i}.q', q['q']); put(f'{n}.final.{i}.e', q['e'])
    for j, o in enumerate(q['o']): put(f'{n}.final.{i}.o.{j}', o)
D = ROOT / 'feedback/F-1029-02-mentor-kurs/ru'; D.mkdir(exist_ok=True)
(D / f'{d}-uz.json').write_text(json.dumps(out, ensure_ascii=False, indent=1))
print(f'{d}: {len(out)} kalit · so\'z {sum(len(v.split()) for v in out.values())} → ru/{d}-uz.json')
