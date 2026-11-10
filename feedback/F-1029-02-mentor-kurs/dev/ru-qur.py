#!/usr/bin/env python3
"""RU tarjima (M24) — 2-qadam: ru/<dars>-ru.json (+ ru/qism/<dars>-*.json) → src/mentor-kurs/<dars>/parts/09-ru.gen.jsx
Ishlatish (repo ildizidan): python3 feedback/F-1029-02-mentor-kurs/dev/ru-qur.py <dars-papka>
- MDT tarjimasi kalit bo'yicha (ru-ajrat.py kalitlari) → RU_MDT; ekran obyektlari bo'laklarni skanerlab topiladi:
  `const X = mkS(n` · `const X = mkPractice(n` · `const FINAL = MDT[n].final` — har biriga ru(…) (M24: obyektning o'zi almashadi).
- MDT o'zi ham ru(MDT, …): MC/LineCheck/Demak render paytida MDT[n] ni o'qiydi.
- Sahnaga xos tarjima (modul darajasidagi ro'yxatlar, uyga vazifa, eslatma) — ru/<dars>-sahna.js qo'lda yoziladi va IIFE dan oldin qo'shiladi;
  ekran obyektiga qo'shimcha (S1.plan, amaliyot qadamlari) — `var RU_S = { S1: {…} }` (ru() bitta obyektga bir marta).
- Ruscha bo'lmagan kalit — o'zbekcha qoladi (kod variantlari: JOIN, ROLLBACK…). Ovoz matni (text) va «Matn» (show = wr(text)).
Qo'lda tahrirlanmaydi: tarjima ru/ dagi fayllarda o'zgaradi, keyin skript qayta yurgiziladi."""
import json, re, sys, glob
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
d = sys.argv[1]
RU = ROOT / 'feedback/F-1029-02-mentor-kurs/ru'
P = ROOT / f'src/mentor-kurs/{d}/parts'
tr = {}
for f in sorted(glob.glob(str(RU / 'qism' / f'{d}-[0-9]*.json'))): tr.update(json.loads(Path(f).read_text()))
if (RU / f'{d}-ru.json').exists(): tr.update(json.loads((RU / f'{d}-ru.json').read_text()))
uz = json.loads((RU / f'{d}-uz.json').read_text())
extra = [k for k in tr if k not in uz]
if extra: sys.exit(f"o'zbekchada yo'q kalitlar: {extra[:10]}")
src = (P / '03-matn.gen.jsx').read_text()
MDT = json.loads(src[src.index('const MDT = ') + len('const MDT = '):src.rindex(';')])
R = {}
for k, v in tr.items():
  parts = k.split('.'); n = parts[0]; r = R.setdefault(n, {})
  f = parts[1]
  if f in ('kicker', 'eyebrow', 'title', 'q', 'ok', 'okShort', 'hint', 'task', 'demak'): r[f] = v
  elif f == 'seg': r.setdefault('seg', {}).setdefault(parts[2], {})[parts[3]] = v
  elif f == 'opts': r.setdefault('opts', {})[int(parts[2])] = v
  elif f == 'wrong': r.setdefault('wrong', {})[parts[2]] = v
  elif f == 'steps':
    st = r.setdefault('steps', {}).setdefault(int(parts[2]), {})
    if parts[3] == 'cmd': st.setdefault('cmds', {})[int(parts[4])] = v
    else: st[parts[3]] = v
  elif f == 'proof': r.setdefault('proof', {})[parts[2]] = v
  elif f == 'trouble': r.setdefault('trouble', {}).setdefault(int(parts[2]), {})[int(parts[3])] = v
  elif f == 'final':
    q = r.setdefault('final', {}).setdefault(int(parts[2]), {})
    if parts[3] == 'o': q.setdefault('o', {})[int(parts[4])] = v
    else: q[parts[3]] = v
  else: sys.exit(f"noma'lum kalit: {k}")
def arr(dct, n):  # {i: v} → [v|null …] uzunligi n
  return [dct.get(i) for i in range(n)]
OUT = {}
for n, r in R.items():
  m = MDT[n]; o = {}
  for f in ('kicker', 'eyebrow', 'title', 'q', 'ok', 'okShort', 'hint', 'task', 'demak'):
    if f in r: o[f] = r[f]
  if 'seg' in r: o['seg'] = {i: [s.get('key'), s.get('voice')] for i, s in r['seg'].items()}
  if 'opts' in r: o['opts'] = arr(r['opts'], len(m['opts']))
  if 'wrong' in r: o['wrong'] = r['wrong']
  if 'steps' in r:
    o['steps'] = [None if i not in r['steps'] else {**{k: v for k, v in r['steps'][i].items() if k != 'cmds'}, **({'cmds': arr(r['steps'][i]['cmds'], len(m['steps'][i]['cmds']))} if 'cmds' in r['steps'][i] else {})} for i in range(len(m['steps']))]
  if 'proof' in r: o['proof'] = r['proof']
  if 'trouble' in r: o['trouble'] = [None if i not in r['trouble'] else arr(r['trouble'][i], 2) for i in range(len(m['trouble']))]
  if 'final' in r:
    o['final'] = [None if i not in r['final'] else {**{k: v for k, v in r['final'][i].items() if k != 'o'}, **({'o': arr(r['final'][i]['o'], len(m['final'][i]['o']))} if 'o' in r['final'][i] else {})} for i in range(len(m['final']))]
  OUT[n] = o
# bo'laklardan ekran obyektlari
code = '\n'.join(Path(f).read_text() for f in sorted(glob.glob(str(P / '0[4-8]*.jsx'))))
S_OBJ = re.findall(r'^const (\w+) = mkS\((\d+)\b', code, re.M)
P_OBJ = re.findall(r'^const (\w+) = mkPractice\((\d+)\b', code, re.M)
FIN = re.search(r'^const (\w+) = MDT\[(\d+)\]\.final\b', code, re.M)
sahna = RU / f'{d}-sahna.js'
js = [
  "\n// ============================================================",
  f"//  RU — AVTO: feedback/F-1029-02-mentor-kurs/dev/ru-qur.py (manba: ru/{d}-*.json, ru/{d}-sahna.js). M24: UZ bo'laklarga tegilmaydi.",
  "//  Uslub: «Вы», dasturlash atamalari inglizcha; kod va haqiqiy chiqishlar — loyihadagidek. QO'LDA TAHRIRLANMAYDI.",
  "// ============================================================",
  f"const RU_MDT = {json.dumps(OUT, ensure_ascii=False, indent=1)};",
  "// RS(k) — darsga xos ruscha (RU_S.k, ru/<dars>-sahna.js); yo'q bo'lsa null → t() o'zbekchani qoldiradi. wrRu — ovoz → «Matn» (RU_S.SPOKEN, keyin wr).",
  "function RS(k) { return typeof RU_S !== 'undefined' && RU_S[k] != null ? RU_S[k] : null; }",
  "function wrRu(s) { return wr((RS('SPOKEN') || []).reduce((a, [x, y]) => a.split(x).join(y), s)); }",
  "function rsY(key, text) { return { key, text, show: wrRu(text) }; }",
  "// Yakun segmentlari (ru-umumiy.py: sNNSegments → yakRu): umumiy a/z + RU_S.YAK (id bo'yicha)",
  "function yakRu(passed, segs) {",
  "  if (LANG !== 'ru') return segs;",
  "  const Y = { a_pass: rsY('<b>Отлично!</b> Вы хорошо прошли урок — соберём сегодняшний урок одним взглядом', 'Отлично! Вы хорошо прошли урок. Теперь соберём всё, что узнали сегодня, одним взглядом.'), a_fail: rsY('Вы дошли до конца урока — советую <b>пройти тест заново</b>', 'Вы дошли до конца урока. В итоговом тесте нужно было шесть баллов, перед завершением советую пройти тест заново. А сейчас соберём сегодняшний урок одним взглядом.'), z: rsY('Спасибо! Нажмите кнопку <b>«Завершить урок»</b>', 'Спасибо. Нажмите кнопку «Завершить урок», урок будет отмечен как пройденный.'), ...Object.fromEntries(Object.entries(RS('YAK') || {}).map(([k, [key, text]]) => [k, rsY(key, text)])) };",
  "  return segs.map((s) => ({ ...s, ...(Y[s.id === 'a' ? (passed ? 'a_pass' : 'a_fail') : s.id] || {}) }));",
  "}",
  "(function ruMdtQo() {",
  "  const segRu = (n) => { const r = RU_MDT[n] && RU_MDT[n].seg; if (!r) return undefined; const o = {}; Object.keys(r).forEach((id) => { const [key, text] = r[id]; o[id] = { ...(key != null ? { key } : {}), ...(text != null ? { text, show: wrRu(text) } : {}) }; }); return o; };",
  "  const head = (n) => { const r = RU_MDT[n] || {}; const o = {}; ['kicker', 'eyebrow', 'title'].forEach((k) => { if (r[k] != null) o[k] = r[k]; }); const s = segRu(n); if (s) o.segments = s; return o; };",
  "  const mdt = {}; Object.keys(RU_MDT).forEach((n) => { const r = { ...RU_MDT[n] }; if (r.seg) r.seg = MDT[n].seg.map(([id]) => (r.seg[id] ? [null, r.seg[id][0], r.seg[id][1]] : null)); mdt[n] = r; });",
  "  ru(MDT, mdt);",
]
X = lambda name: f"((typeof RU_S !== 'undefined' && RU_S.{name}) || {{}})"
for name, n in S_OBJ: js.append(f"  ru({name}, {{ ...head({n}), ...{X(name)} }});")
for name, n in P_OBJ:
  js.append(f"  ru({name}.S, {{ ...head({n}), ...{X(name + '_S')} }});")
  r = OUT.get(n, {})
  if 'steps' in r: js.append(f"  ru({name}.steps, RU_MDT[{n}].steps);")
  if 'trouble' in r: js.append(f"  ru({name}.trouble, RU_MDT[{n}].trouble);")
  if 'proof' in r: js.append(f"  ru({name}.proof, RU_MDT[{n}].proof);")
if FIN and 'final' in OUT.get(FIN.group(2), {}): js.append(f"  ru({FIN.group(1)}, RU_MDT[{FIN.group(2)}].final);")
js.append("})();")
# sahna qismi IIFE dan OLDIN: unda `var RU_S = { S1: { plan: […] }, … }` (bitta obyektga ru() bir marta — RU_S shu yerda birlashadi)
if sahna.exists(): js.insert(4, '\n// --- sahna (ru/' + sahna.name + ') ---\n' + sahna.read_text().rstrip() + '\n')
(P / '09-ru.gen.jsx').write_text('\n'.join(js) + '\n')
print(f"{d}: RU kalit {len(tr)}/{len(uz)} · ekran {len(OUT)} · S {len(S_OBJ)} · P {len(P_OBJ)} · FINAL {FIN.group(1) if FIN else '-'} · sahna {'bor' if sahna.exists() else 'yoq'} → {d}/parts/09-ru.gen.jsx")
