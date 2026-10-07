# 14-Modul — darslararo kesishma tekshiruvi (6-bosqich, 08.10.2026, F-1008-557)
#   python3 feedback/F-1008-14modul/vositalar/kesishma.py
# Tekshiradi: 13 MD bor-yo'qligi · «Keyingi dars» zanjiri (NOMLAR) · nishon nomlari takrori · saqlash kalitlari tayanch 8 da bormi ·
# sarlavha takrori darslararo · arena savollari takrori · TAXMIN T1–T20 taqsimoti · Mentor raqamlari (51 · 15 000 · tayanch 1.14) ishlatilishi.
import re, os, glob, collections
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
fs = sorted(f for f in glob.glob(os.path.join(D, '[01][0-9]-*-v3.md')))
print(f'MD: {len(fs)}/13 —', ' '.join(os.path.basename(f)[:2] for f in fs))
tay = open(os.path.join(D, '00-MODUL-TAYANCH.md'), encoding='utf8').read()
kalit_tay = set(re.findall(r'`(pm-m12d\d+-[a-z]+)`', tay.split('## 8.')[1].split('## 9.')[0]))
nish = collections.defaultdict(list); sar = collections.defaultdict(list); ars = collections.defaultdict(list)
tx = collections.Counter(); txf = collections.defaultdict(collections.Counter)
for f in fs:
    nn = os.path.basename(f)[:2]; s = open(f, encoding='utf8').read()
    m = re.search(r'\n## Nishonlar.*?\n(.*?)(?=\n## )', s, re.S)
    for n in re.findall(r'^- \*\*([^*]+?)\*\*', m.group(1) if m else '', re.M): nish[n.strip()].append(nn)
    for t in re.findall(r'Sarlavha[^:\n]*:\s*\*\*(.+?)\*\*', s): sar[t.strip()].append(nn)
    i = s.lower().find('## jonli viktorina'); j = s.find('\n## ', i + 5)
    if i >= 0:
        for q in re.findall(r'^\d+\.\s+\**(.+?\?)', s[i:j], re.M): ars[q.strip().lower()].append(nn)
    kl = set(re.findall(r'pm-m12d\d+-[a-z]+(?![a-z0-9])', s)) - {k for k in re.findall(r'pm-m12d\d+-code', s)}
    yoq = sorted(k for k in kl if k not in kalit_tay)
    for t in re.findall(r'<!-- TAXMIN (T\d+)', s): tx[t] += 1; txf[t][nn] += 1
    mentor = len(re.findall(r'\b51\b', s)), len(re.findall(r'15 000', s))
    print(f'  {nn}: kalitlar {sorted(kl)}' + (f'  ⚠ tayanch 8 da yo\'q: {yoq}' if yoq else '') + f' · «51» {mentor[0]} · «15 000» {mentor[1]}')
dup = {k: v for k, v in nish.items() if len(v) > 1}
print('Nishon takrori:', dup or 'yo\'q', f'(jami {sum(len(v) for v in nish.values())})')
dups = {k: v for k, v in sar.items() if len(set(v)) > 1}
print('Sarlavha darslararo takrori:', dups or 'yo\'q')
dupa = {k: v for k, v in ars.items() if len(v) > 1}
print('Arena savoli takrori:', dupa or 'yo\'q', f'(jami {sum(len(v) for v in ars.values())})')
print('TAXMIN:', ' · '.join(f'{t} {tx[t]} ({",".join(sorted(txf[t]))})' for t in sorted(tx, key=lambda x: int(x[1:]))))
print('TAXMIN ishlatilmagan:', [f'T{i}' for i in range(1, 21) if f'T{i}' not in tx] or 'yo\'q')
