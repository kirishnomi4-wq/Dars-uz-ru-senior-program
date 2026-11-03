#!/usr/bin/env python3
# Qurilgan dars → suratli ko'rik sahifasi. Matn MD'dan (build.parse), suratlar manifest.json dan (shots-seg.mjs chiqishi).
# ISHLATISH: python3 build-surat.py <MD> <template-surat.html> <manifest.json> <out.html>
import json, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import parse

md_path, tpl_path, man_path, out_path = sys.argv[1:5]
screens, pas = parse(md_path)
man = json.load(open(man_path, encoding='utf-8'))
for s in screens:
    s['shots'] = man.get(str(s['n']), [])
# 01.11: bosqich nomlari va sarlavha shu darsning MD'sidan (oldin shablonda Nest-2 qattiq yozilgan edi)
import re
_md = open(md_path, encoding='utf-8').read()
_full = {}; _stage = {}
for _n, _typ, _b in re.findall(r'^\| (\d+) \| [^|]+ \| `?(\w+)`? \| ([^|]*?) \|', _md, re.M):
    _n = int(_n); _b = _b.strip()
    if re.match(r'^\d+ · ', _b): _full[_b.split(' ·')[0]] = _b; _stage[_n] = _b
    elif re.match(r'^\d+$', _b): _stage[_n] = _full.get(_b, _b + '-bosqich')
    else: _stage[_n] = 'Sinov va yakun' if _typ in ('Screen27', 'Screen28') else 'Kirish'
for s in screens:
    if s['n'] in _stage: s['stage'] = _stage[s['n']]
_h1 = re.search(r'^# Mentor kursi · (.+?) «(.+?)»', _md, re.M)
_short, _name = (_h1.group(1), _h1.group(2)) if _h1 else ('Dars', '')
_hajm = re.search(r'^\| Hajm \| (.+?) \|$', _md, re.M)
_hajm = re.sub(r'[*`]', '', _hajm.group(1)) if _hajm else ''
DARS = os.environ.get('DARS', '')
data = {'screens': screens, 'pasport': pas, 'source': md_path}
js = json.dumps(data, ensure_ascii=False).replace('</', '<\\/')
tpl = open(tpl_path, encoding='utf-8').read()
assert '/*DATA*/null' in tpl
import html as _h
tpl = tpl.replace("<title>Nest-2 dars ko'rigi</title>", f"<title>{_h.escape(_short)} dars ko'rigi</title>").replace("<h1>Nest-2 dars ko'rigi</h1>", f"<h1>{_h.escape(_short)} dars ko'rigi</h1>")
tpl = re.sub(r'<p class="lead">.*?</p>', lambda m: f'<p class="lead">Mentor kursi: <b>«{_h.escape(_name)}»</b> — qurilgan dars. {_h.escape(_hajm)}.</p>', tpl, count=1, flags=re.S)
if DARS: tpl = tpl.replace('?dars=nest-02', '?dars=' + DARS)
open(out_path, 'w', encoding='utf-8').write(tpl.replace('/*DATA*/null', js))
print('ekranlar:', len(screens), '| suratlar:', sum(len(s['shots']) for s in screens), '| bayt:', len(tpl) + len(js))
for s in screens:
    if s['type'] == 'Lesson' and len(s['shots']) < len(s['segs']):
        print(f"  ogoh: {s['n']}-ekran — surat {len(s['shots'])}, segment {len(s['segs'])}")
