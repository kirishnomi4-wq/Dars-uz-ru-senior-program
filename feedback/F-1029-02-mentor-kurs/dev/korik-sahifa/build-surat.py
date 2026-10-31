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
data = {'screens': screens, 'pasport': pas, 'source': md_path}
js = json.dumps(data, ensure_ascii=False).replace('</', '<\\/')
tpl = open(tpl_path, encoding='utf-8').read()
assert '/*DATA*/null' in tpl
open(out_path, 'w', encoding='utf-8').write(tpl.replace('/*DATA*/null', js))
print('ekranlar:', len(screens), '| suratlar:', sum(len(s['shots']) for s in screens), '| bayt:', len(tpl) + len(js))
for s in screens:
    if s['type'] == 'Lesson' and len(s['shots']) < len(s['segs']):
        print(f"  ogoh: {s['n']}-ekran — surat {len(s['shots'])}, segment {len(s['segs'])}")
