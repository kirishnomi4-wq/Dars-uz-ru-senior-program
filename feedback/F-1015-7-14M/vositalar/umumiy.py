# F-1015-116: 208/0 ning takrorlanuvchi naqshlari uchun umumiy tahrir.
# python3 umumiy.py <fayl.jsx> [teg] [nuq]
#  teg — QReja teg-chiplari (qadamlar={REJA.map(r => ({ t: tr(r.t), teg: ... }))})
#  nuq — voqea nuqtalar qatori (<div className="XX-nuq…"><span className="XX-nuq-l">{yorliq}</span>…) + bashorat yorlig'i umumiy + yorliq const + yetim CSS
import sys, re
p = sys.argv[1]; ops = set(sys.argv[2:])
s = open(p, encoding='utf-8').read(); log = []
if 'teg' in ops:
    n0 = s.count('teg: tr(r.teg)') + s.count('teg: r.teg')
    s = s.replace('qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}', 'qadamlar={REJA.map(r => ({ t: tr(r.t) }))}')
    s = s.replace('qadamlar={REJA.map(r => ({ t: tr(r.t), teg: r.teg }))}', 'qadamlar={REJA.map(r => ({ t: tr(r.t) }))}')
    s, ng = re.subn(r"qadamlar=\{([A-Z_0-9]+)\.map\((\w+) => \(\{ t: tr\(\2\.t\), teg: (?:tr\()?\2\.teg\)?(?: \}| )\)\)\}", lambda m: f"qadamlar={{{m.group(1)}.map({m.group(2)} => ({{ t: tr({m.group(2)}.t) }}))}}", s)
    log.append(f'teg: {n0 - (s.count("teg: tr(r.teg)") + s.count("teg: r.teg")) + ng}')
if 'nuq' in ops:
    m = re.search(r'\n(\s*)<div className="([a-z]+)-(nuq|nuqtalar)"><span className="\2-nuq-l">\{yorliq\}</span>[^\n]*\n', s)
    if not m: sys.exit('nuq qatori topilmadi')
    pre = m.group(2); cls = f'{pre}-{m.group(3)}'
    s = s[:m.start()+1] + s[m.end():]
    c = s.count('<QBashorat yorliq={yorliq}') + s.count('<Bashorat yorliq={yorliq} ')
    s = s.replace('<Bashorat yorliq={yorliq} ', '<Bashorat ')
    s = s.replace('<QBashorat yorliq={yorliq}', '<QBashorat yorliq={tr({ uz: "Avval o\'zingiz belgilab ko\'ring", ru: \'Сначала отметьте сами\' })}')
    s, nv = re.subn(r"t: (tanlov|taxmin|tanlangan|tx) === (x|v)\.k \? `\$\{\2\.k === [a-zA-Z.]+ \? '✓' : '✗'\} \$\{tr\(\2\.t\)\}` : tr\(\2\.t\)", lambda mm: f"t: tr({mm.group(2)}.t)", s)
    if s.count('{yorliq}') == 0:
        s, ny = re.subn(r'\n\s*const yorliq = [^\n]*;\n', '\n', s, count=1)
    else: ny = 0
    L = s.split('\n'); n0 = len(L)
    L = [l for l in L if not re.match(r'^\s*\.(%s|%s-nuq-l)[ .:{]' % (re.escape(cls), re.escape(pre)), l)]
    s = '\n'.join(L)
    log.append(f'nuq: {cls} · bashorat-yorliq {c} · ✓/✗ {nv} · yorliq-const {ny} · CSS {n0-len(L)} · qolgan {{yorliq}} {s.count("{yorliq}")}')
open(p, 'w', encoding='utf-8').write(s); print(' | '.join(log))
