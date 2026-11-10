#!/usr/bin/env python3
"""Webhook v2 (F-1104-24): ekrandagi kod, terminal chiqishlari, panel holatlari va AI natijalari — manbadan AYNAN (M10/M43).
Ishlatish: python3 feedback/F-1029-02-mentor-kurs/dev/wh-kod.py → src/mentor-kurs/wh/parts/03b-kod.gen.jsx
Manba: /home/kali/Desktop/order-bot (teglar wh-start, wh-done) · manba/whv2-out/*.txt (drive-whv2.sh) · manba/whv2-ai/ (drive-whv2-ai.sh) ·
       manba/wh-out/ (v1, maydon-jamoa m13-dars-03-done — o'quvchi loyihasi).
Xato nusxalar (norawbody, tartib, json) — drive-whv2.sh dagi o'sha almashtirish bilan.
Qo'lda tahrirlanmaydi: loyiha yoki chiqish o'zgarsa — skriptlar, keyin shu fayl qayta yurgiziladi."""
import json, re, subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
OB = Path('/home/kali/Desktop/order-bot')
M = ROOT / 'feedback/F-1029-02-mentor-kurs/manba'
OUTD = M / 'whv2-out'; AI = M / 'whv2-ai'
OUT = ROOT / 'src/mentor-kurs/wh/parts/03b-kod.gen.jsx'
def show(repo, tag, f): return subprocess.check_output(['git', '-C', str(repo), 'show', f'{tag}:{f}'], text=True)
def lines(txt): return [{'t': l, 'n': i} for i, l in enumerate(txt.rstrip('\n').split('\n'), 1)]
out = {}
FILES = {'SIG': 'src/api/payment/signature.ts', 'CTRL': 'src/api/payment/payment.controller.ts', 'SVC': 'src/api/payment/payment.service.ts', 'INPUT': 'src/api/payment/payment-input.ts',
         'MAIN': 'src/main.ts', 'PAY': 'scripts/pay.js', 'ENV': '.env.example', 'CONFIG': 'src/config/index.ts', 'MIG': 'src/infrastructure/migrations/1762300000000-payments.ts', 'CSPEC': 'src/api/payment/payment.controller.spec.ts'}
for k, f in FILES.items():
  out[k] = {'file': f, 'tag': 'wh-done', 'lines': lines(show(OB, 'wh-done', f))}
c = show(OB, 'wh-done', 'src/api/payment/payment.controller.ts')
sig_blk = """    if (
      !isValidSignature(req.rawBody, signature, config.PAYMENT_WEBHOOK_SECRET)
    ) {
      this.log.warn("imzo noto'g'ri — xabar rad etildi");
      throw new UnauthorizedException("imzo noto'g'ri");
    }
"""
rec_blk = """    const p = parsePayment(body);
    const r = await this.payments.record(p);
"""
assert sig_blk + rec_blk in c
out['CTRL_TARTIB'] = {'file': 'src/api/payment/payment.controller.ts', 'tag': 'tartib nusxa', 'lines': lines(c.replace(sig_blk + rec_blk, rec_blk + sig_blk))}
a2 = "      !isValidSignature(req.rawBody, signature, config.PAYMENT_WEBHOOK_SECRET)"
out['CTRL_JSON'] = {'file': 'src/api/payment/payment.controller.ts', 'tag': 'json nusxa', 'lines': lines(c.replace(a2, "      !isValidSignature(\n        Buffer.from(JSON.stringify(body)),\n        signature,\n        config.PAYMENT_WEBHOOK_SECRET,\n      )"))}
mn = show(OB, 'wh-done', 'src/main.ts'); a3 = "  const app = await NestFactory.create(AppModule, { rawBody: true });"; assert a3 in mn
out['MAIN_NORAW'] = {'file': 'src/main.ts', 'tag': 'norawbody nusxa', 'lines': lines(mn.replace(a3, "  const app = await NestFactory.create(AppModule);"))}
rd = show(OB, 'wh-done', 'README.md').split('\n')
ra = rd.index("## To'lov webhook'i"); rb = next(i for i in range(ra + 1, len(rd)) if rd[i].startswith('## '))
out['README'] = {'file': 'README.md', 'tag': 'wh-done', 'lines': [{'t': rd[i], 'n': i + 1} for i in range(ra, rb) if rd[i].strip()]}
def clean(s):
  s = s.replace(chr(0xA0), ' ').replace(chr(0x202F), ' ')
  s = re.sub(r'/tmp/claude-1000/[^\s)\']*?/scratchpad/[a-z0-9-]+/', '…/OrderBotNest/', s)
  return s.rstrip('\n')
OUTS = {}
for f in sorted(OUTD.glob('[01][0-9]*.txt')):
  k = f.stem.split('-')[0]
  if f.stem.startswith('07-xom-tana-'): k = '07' + f.stem.split('-')[-1]   # 07done, 07json
  if f.stem.startswith('09b'): k = '09b'
  OUTS[k] = clean(f.read_text())
for n in ('ai1', 'ai2'): OUTS[n] = clean((AI / n / '01-haqiqiy-baza.txt').read_text())
for k, f in (('mj01', '01-mashq-sahifa'), ('mj02', '02-tugma-tolash'), ('mj05', '05-tugma-imzosiz'), ('mj13', '13-tartib-buzilgan')): OUTS[k] = clean((M / 'wh-out' / f'{f}.txt').read_text())
out['OUT'] = OUTS
# panel suratlari: «HH:MM:SS.mmm SURAT <nom>-<n> (<izoh>) — belgi «X» · ro'yxat: …» + «    [yangi] 2 | Bobur | …» qatorlari
PANEL = []
for key, txt in OUTS.items():
  L = txt.split('\n')
  for i, l in enumerate(L):
    m = re.match(r'(\d\d:\d\d:\d\d)\.\d+ SURAT \S+-(\d+) \((.+?)\) — belgi «(.+?)»', l)
    if not m: continue
    rows = []
    for r in L[i + 1:]:
      if not r.startswith('    '): break
      r = r.strip(); yangi = r.startswith('[yangi] ')
      cells = r.replace('[yangi] ', '').split(' | ')
      rows.append({'yangi': yangi, 'cells': cells} if len(cells) == 8 else {'msg': r})
    PANEL.append({'k': f'{key}-{m.group(2)}', 't': m.group(1), 'note': m.group(3), 'belgi': m.group(4), 'rows': rows})
out['PANEL'] = PANEL
AIR = {}
for n in ('ai1', 'ai2'):
  AIR[n] = {'stat': (AI / n / 'diff-stat.txt').read_text().rstrip('\n').split('\n')[-1].strip()}
out['AI'] = AIR
out['PROMPT1'] = (AI / 'p1-prompt.txt').read_text().rstrip('\n')
for k, v in out.items():
  if '\u00a0' in json.dumps(v, ensure_ascii=False): raise SystemExit(f'{k}: haqiqiy U+00A0 belgi bor')
# Ekrandagi BOSHQA ilovaning (OrderBotNest paneli) localStorage kaliti — preview-keys darvozasi dars kaliti deb o'qimasin (JSON-escape).
J = lambda v: re.sub(r"(Storage\.(?:get|set|remove)Item\()'", lambda m: m.group(1) + '\\u0027', json.dumps(v, ensure_ascii=False, indent=1))
# «≠» — haqiqiy kod va server javobida (summa mos emas); til-lint belgi-formula o'quvchi matni uchun — JSON-escape (ekranda aynan bir xil)
J0 = J
J = lambda v: J0(v).replace('≠', '\\u2260')
parts, refs = [], []
for kk, v in out.items():
  if kk == 'AI':
    for n, d in v.items(): parts.append(f'const KOD_AI_{n.upper()} = {J(d)};')
    refs.append('AI: { ' + ', '.join(f"{n}: KOD_AI_{n.upper()}" for n in v) + ' }')
  elif kk == 'OUT':
    orefs = []
    for ok_, ov in v.items():
      nm = re.sub(r'[^A-Z0-9]+', '_', ok_.upper())
      parts.append(f'const KOD_OUT_{nm} = {J(ov)};'); orefs.append(f"'{ok_}': KOD_OUT_{nm}")
    refs.append('OUT: { ' + ', '.join(orefs) + ' }')
  else:
    parts.append(f'const KOD_{kk} = {J(v)};'); refs.append(f'{kk}: KOD_{kk}')
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text("\n// AVTO: feedback/F-1029-02-mentor-kurs/dev/wh-kod.py — OrderBotNest wh-start/wh-done, maydon-jamoa m13-dars-03 (manba/wh-out), haqiqiy chiqishlar (qo'lda tahrirlanmaydi)\n" + '\n'.join(parts) + '\nconst KOD = { ' + ', '.join(refs) + ' };\n')
print('yozildi:', OUT.relative_to(ROOT), '· fayllar', {k: len(out[k]['lines']) for k in out if isinstance(out[k], dict) and 'lines' in out[k]}, '· OUT', list(OUTS), '· PANEL', [(p['k'], p['belgi'], len(p['rows'])) for p in PANEL])
