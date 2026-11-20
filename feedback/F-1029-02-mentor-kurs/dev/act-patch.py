# F-1120-02: *-matn.py generatoriga «0.» (act) qo'llovini, <dars>/parts/04-yordam.jsx mkS ga act o'tkazishni qo'shadi
import sys, re
gen, yordam = sys.argv[1], sys.argv[2]
s = open(gen, encoding='utf8').read()
old = '''    sid = f'{n}{"abcde"[int(sm.group(1)) - 1]}'
    segs.append(["abcde"[int(sm.group(1)) - 1], key_html(sid, sm.group(2)), sm.group(3)])'''
new = '''    # F-1120-02 (M52): «0.» — mentor o'zi bosadigan segment (id 'x'), keyingi satr «Bosish: «…»» — chap paneldagi ko'rsatma
    k = int(sm.group(1)); sl = 'x' if k == 0 else "abcde"[k - 1]
    seg = [sl, key_html(f'{n}{sl}', sm.group(2)), sm.group(3)]
    ma = re.match(r'[^\\n]*\\n\\s+Bosish: «(.+?)»\\s*$', body[sm.end():], re.M)
    if ma: seg.append(re.sub(r'\\*\\*(.+?)\\*\\*', r'<b>\\1</b>', code_html(ma.group(1))))
    elif k == 0: sys.exit(f'{n}x: «Bosish: «…»» satri yo\\'q')
    segs.append(seg)'''
if 'Bosish' not in s:
    assert old in s, 'generator naqshi topilmadi'
    assert 'def code_html' in s
    s = s.replace(old, new); open(gen, 'w', encoding='utf8').write(s); print('generator: act qo\'shildi')
y = open(yordam, encoding='utf8').read()
o = "segments: m.seg.map(([id, key, text], i) => sg(id, key, text, extras[i] || {}))"
if o in y:
    y = y.replace(o, "segments: m.seg.map(([id, key, text, act], i) => sg(id, key, text, { ...(act ? { act } : {}), ...(extras[i] || {}) })) /* F-1120-02 (M52): act */")
    open(yordam, 'w', encoding='utf8').write(y); print('mkS: act o\'tkaziladi')
else: print('mkS naqshi yo\'q yoki allaqachon:', 'act' in y)
