#!/usr/bin/env python3
# ============================================================================
# codemod-dark-dead — dark-lint qizil qiladigan IKKI naqsh (F-0926-06, texnik darslar 1–4c):
#   1) O'LIK qora CSS: dark-lint topgan klass dars JSX'ida ham, umumiy modullarda (src/live, src/compilator)
#      ham ishlatilmaydi — qoida qatorlari olinadi (ekranda hech narsa o'zgarmaydi).
#   2) .mp-demo — «Doskada yozib ko'rsatish» qora tugmasi → accent (159/5).
# Xavfsizlik: klass nomi dinamik yasalsa (`sk-${x}`, 'sk-' + x) yoki umumiy modulda uchrasa — TEGILMAYDI.
#
#   python3 scripts/codemod-dark-dead.py [--write] <fayl...>      (--write bo'lmasa — QURUQ yurish)
# ============================================================================
import re, sys, subprocess, pathlib

W = '--write' in sys.argv
files = [a for a in sys.argv[1:] if not a.startswith('--')]
ROOT = pathlib.Path(__file__).resolve().parent.parent
SHARED = ''.join(p.read_text(encoding='utf-8', errors='replace')
                 for d in ('src/live', 'src/compilator') for p in (ROOT / d).rglob('*.js*'))
ANSI = re.compile(r'\x1b\[[0-9;]*m')
MP_OLD = "background: ${T.ink}; color: ${T.paper};"
MP_NEW = "background: ${T.accent}; color: #fff;"

def flagged(f):
    out = subprocess.run(['node', str(ROOT / 'dark-lint.mjs'), f], capture_output=True, text=True).stdout
    return re.findall(r'●\s+\.([\w-]+)', ANSI.sub('', out))

jami = {'dead': 0, 'mp': 0, 'skip': 0}
for f in files:
    s = pathlib.Path(f).read_text(encoding='utf-8')
    rep = []
    for cls in dict.fromkeys(flagged(f)):
        if cls == 'mp-demo':
            continue
        word = r'(?<![\w-])' + re.escape(cls) + r'(?![\w-])'
        rules = list(re.finditer(r'\n[ \t]*\.' + re.escape(cls) + r'(?![\w-])[^\n]*', s))
        uses = len(re.findall(word, s))
        pre = cls.split('-')[0] + '-'
        dyn = re.search(re.escape(pre) + r"(\$\{|['\"`]\s*\+)", s)
        in_shared = re.search(word, SHARED)
        # qator boshqa selektorni ham o'z ichiga olsa (vergul bilan) — butun qatorni olib bo'lmaydi
        multi = any(',' in m.group(0).split('{')[0] for m in rules)
        if not rules or uses != len(rules) or dyn or in_shared or multi:
            rep.append(f'  ⚠ {cls}: tegilmadi (ishlatiladi={uses - len(rules)} dinamik={bool(dyn)} umumiy={bool(in_shared)} ko\'p-selektor={multi})')
            jami['skip'] += 1
            continue
        for m in reversed(rules):
            s = s[:m.start()] + s[m.end():]
        rep.append(f'  − .{cls} ({len(rules)} qator, o\'lik)')
        jami['dead'] += 1
    m = re.search(r'\n([ \t]*)\.mp-demo \{[^\n]*', s)
    if m and MP_OLD in m.group(0):
        new = m.group(0).replace(MP_OLD, MP_NEW) + ' /* F-0926-06: qora tugma → accent (159/5) */'
        s = s[:m.start()] + new + s[m.end():]
        rep.append('  ✓ .mp-demo → accent')
        jami['mp'] += 1
    if W:
        pathlib.Path(f).write_text(s, encoding='utf-8')
    print(f'{f}\n' + ('\n'.join(rep) if rep else '  (o\'zgarish yo\'q)'))
print(f"\nJAMI o'lik={jami['dead']} mp-demo={jami['mp']} tegilmadi={jami['skip']} · {'yozildi' if W else 'quruq yurish'}")
