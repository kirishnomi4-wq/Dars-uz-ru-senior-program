# F-1015-124 (T1 A) + 131: telefon ramkasi m7-08 (dm-tel) uslubiga — chekka 7px, burchak 30px, ichki element (ekran yoki ilova paneli)
# tepasida 22px joy va pill-kesik (56×11, 8px, tepadan 7px), ichki burchak 23px. Mazmun maydoni kichraymaydi: ramkaning HAR height
# qoidasiga +22 va chekka farqi (2·(7−p)) qo'shiladi (131: misol kesilmasin). Faqat CSS; JSX tegilmaydi.
# python3 telram.py [--yoz] [--faqat kalit]
import re, sys
yoz = '--yoz' in sys.argv; faqat = sys.argv[sys.argv.index('--faqat') + 1] if '--faqat' in sys.argv else ''
KF = dict(l.split() for l in open('/tmp/claude-1000/-home-kali-Desktop-internetLesson/82485f6d-16ed-42e1-bfdb-84a1b561cb6f/scratchpad/kf.txt'))
T = [('m11-03', 'pw-telefon', 'pw-tel-ekran'), ('m11-04', 'pz-tel', 'pz-tel-ekran'), ('m11-05', 'pd-telefon', 'pd-tel-ekran'), ('m11-07', 'st-tel', 'st-tel-ekran'),
     ('m11-08', 'wb-telefon', 'wb-tel-ekran'), ('m11-10', 'rf-telefon', 'rf-tel-ekran'), ('m11-12', 'sb-telefon', 'sb-tel-ekran'), ('m12-01', 'ip-tel', 'ip-tel-ekran'),
     ('m12-02', 'sp-tel', 'sp-tel-ekran'), ('m12-07', 'dt-tel', 'dt-tel-ekran'), ('m12-08', 'fp-tel', 'fp-tel-ekran'), ('m12-10', 'fr-tel', 'fr-tel-ekran'),
     ('m12-12', 'nx-tel', 'nx-tel-ekran'), ('m12-13', 'cs-tel', 'cs-tel-ekran'),
     ('m9-06', 'rm-tel', 'rm-tel-bar'), ('m9-15', 'oo-tel', 'oo-tel-bar'), ('m10-12', 'gp-tel', 'gp-tel-bar'), ('m10-12', 'gp-uz-tel', 'gp-uz-bar'),
     ('m11-01', 'bs-tel', 'bs-tel-bar'), ('m11-02', 'ms-tel', 'ms-tel-bar'), ('m11-02', 'ms-tg', 'ms-tg-bar'), ('m12-06', 'dp-tel', 'dp-tel-bar')]
DEK = r'\{((?:\$\{[^}]*\}|[^{}])*)\}'
def dek_ol(d):
    out = []
    for p in re.split(r';(?![^{]*\})', d):
        p = p.strip()
        if p: k, _, v = p.partition(':'); out.append([k.strip(), v.strip()])
    return out
def dek_yoz(kv): return ' ' + '; '.join(f'{k}: {v}' for k, v in kv) + '; '
def ol(kv, k): return next((e[1] for e in kv if e[0] == k), None)
def qoy(kv, k, v):
    for e in kv:
        if e[0] == k: e[1] = v; return
    kv.append([k, v])
def pad_top(kv):
    p = ol(kv, 'padding-top')
    if p is not None: return float(re.match(r'[\d.]+', p).group(0))
    p = ol(kv, 'padding')
    if p is None: return 0.0
    return float(re.match(r'[\d.]+', p.split()[0]).group(0))
def pad_all(kv):
    p = ol(kv, 'padding'); return float(re.match(r'[\d.]+', p.split()[0]).group(0)) if p else None
for k, fr, ich in T:
    if faqat and faqat != k: continue
    f = KF[k]; s = open(f, encoding='utf-8').read(); x = []
    # selektorning OXIRGI qismida klass bo'lgan bitta qatorli qoidalar
    oxirgi = lambda sel, c: any(re.search(r'\.' + re.escape(c) + r'(?![\w-])[^\s>+~]*$', part.strip()) for part in sel.split(','))
    asosiy_fr = re.search(r'(?m)^[ \t]*\.' + re.escape(fr) + r' ' + DEK, s)
    asosiy_ich = re.search(r'(?m)^[ \t]*\.' + re.escape(ich) + r' ' + DEK, s)
    if not asosiy_fr or not asosiy_ich: print('!!', k, fr, ich, 'asosiy qoida yo\'q'); continue
    kvf = dek_ol(asosiy_fr.group(1)); p0 = pad_all(kvf) or 7.0; bg = ol(kvf, 'background') or '${T.ink}'
    dh = 22 + 2 * (7 - p0)
    # 1) ramka qoidalari: height (+dh), asosiy qoidada padding 7 va burchak 30
    def fr_sub(m):
        sel, d = m.group(2), m.group(3)
        if not oxirgi(sel, fr): return m.group(0)
        kv = dek_ol(d); h = ol(kv, 'height')
        if h and re.fullmatch(r'[\d.]+px', h): qoy(kv, 'height', f'{float(h[:-2]) + dh:g}px'); x.append(f'h {h}→+{dh:g}')
        if m.start() == asosiy_fr.start():
            qoy(kv, 'padding', '7px'); qoy(kv, 'border-radius', '30px')
            w = ol(kv, 'width')
            if w and re.fullmatch(r'[\d.]+px', w) and p0 != 7: qoy(kv, 'width', f'{float(w[:-2]) + 2 * (7 - p0):g}px'); x.append(f'w {w}→{2 * (7 - p0):+g}')
        return m.group(1) + sel + '{' + dek_yoz(kv) + '}'
    s = re.sub(r'(^|\}[ \t]*|\{[ \t]*)([^{}\n;]*\.' + re.escape(fr) + r'(?![\w-])[^{}\n;]*)' + DEK, fr_sub, s, flags=re.M)
    # 2) ichki element: tepada +22px, position relative, burchak 23px (panelda faqat tepa burchaklar)
    asosiy_ich = re.search(r'(?m)^[ \t]*\.' + re.escape(ich) + r' ' + DEK, s)
    kv = dek_ol(asosiy_ich.group(1)); pt = pad_top(kv)
    if ol(kv, 'padding') and ol(kv, 'padding-top') is None:
        v = ol(kv, 'padding').split(); v = v + [v[0]] * (1 - len(v) + 0) if len(v) == 1 else v
        qoy(kv, 'padding-top', f'{pt + 22:g}px')
    else: qoy(kv, 'padding-top', f'{pt + 22:g}px')
    if (ol(kv, 'position') or 'static') == 'static': qoy(kv, 'position', 'relative')
    qoy(kv, 'border-radius', '23px' if ich.endswith('ekran') else '23px 23px 0 0')
    yangi = asosiy_ich.group(0)[:asosiy_ich.group(0).index('{')] + '{' + dek_yoz(kv) + '}'
    s = s[:asosiy_ich.start()] + yangi + s[asosiy_ich.end():]
    # 3) pill-kesik (::before band bo'lsa ::after)
    pe = '::after' if re.search(r'\.' + re.escape(ich) + r'[\w.-]*::before', s) else '::before'
    if re.search(r'\.' + re.escape(ich) + r'[\w.-]*' + pe, s): print('!!', k, ich, 'psevdo band'); continue
    pill = (f"\n        .{ich}{pe} {{ content: ''; position: absolute; top: 7px; left: 50%; margin-left: -28px; width: 56px; height: 11px; border-radius: 8px; background: {bg}; z-index: 2; pointer-events: none; }}"
            f" /* F-1015-124: telefon kesigi (m7-08 namunasi) */")
    i = s.find('\n', s.find(yangi)); s = s[:i] + pill + s[i:]
    print(k, fr, ich, f'p{p0:g} dh{dh:g} pt{pt:g}→{pt + 22:g}', pe, ' '.join(x))
    if yoz: open(f, 'w', encoding='utf-8').write(s)
