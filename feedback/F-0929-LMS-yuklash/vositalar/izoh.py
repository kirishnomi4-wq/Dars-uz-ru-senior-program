#!/usr/bin/env python3
# izoh — test izohlari va recap-kartalari matnini qisqartirish vositasi (30.09, S8=A S9=A S10=B).
#   python3 izoh.py extract <dars.jsx> <out.json>   — izohlarni savol/variant konteksti bilan JSON'ga chiqaradi
#   python3 izoh.py apply   <dars.jsx> <in.json>    — uz_new/ru_new ni faylga qo'yadi (eski matn aynan mos kelsa)
#   python3 izoh.py lint    <dars.jsx>…             — qoida: uzunlik, maqtov/«Yo'q» boshlanishi, javobni aytish, bitta gap
#   python3 izoh.py show    <dars.jsx>              — ixcham ko'rinish (agent uchun): id · savol · variantlar(✓) · eski uz/ru
#   python3 izoh.py put     <dars.jsx> <new.json>   — {id: {"uz": "...", "ru": "..."}} ni to'g'ridan qo'yadi (extract shart emas)
# Faylga faqat apply yozadi; faqat uz/ru satrlari almashadi (kalit, correctIdx, kod — tegilmaydi).
import json, re, sys

LIM = {'correct': (60, 75), 'wrong': (60, 75), 'recap': (90, 110)}
PRAISE = re.compile(r"^\s*(to.g.ri|aynan|barakalla|zo.r|ofarin|aniq topdingiz|juda yaxshi|qoyil|верно|правильно|точно|молодец|отлично|да,)", re.I)
NEGSTART = re.compile(r"^\s*(yo.q|xato|noto.g.ri|нет|неверно|неправильно|ошибка)\b", re.I)

def skip_str(s, i):
    q = s[i]; i += 1
    while i < len(s):
        if s[i] == '\\': i += 2; continue
        if s[i] == q: return i + 1
        i += 1
    return i

def brace(s, i):
    """s[i] == '{' yoki '[' — mos yopilishgacha (satr/komment ichidagini hisobga olmay)."""
    op = s[i]; cl = '}' if op == '{' else ']'; d = 0; k = i
    while k < len(s):
        c = s[k]
        if c in '"\'`': k = skip_str(s, k); continue
        if s.startswith('/*', k): k = s.index('*/', k) + 2; continue
        if s.startswith('//', k): k = s.index('\n', k); continue          # izohdagi apostrof satr emas
        if s.startswith('<>', k): k = s.index('</>', k) + 3; continue     # JSX-fragment matnidagi apostrof ham
        if c in '{[': d += 1
        elif c in '}]':
            d -= 1
            if d == 0: return k + 1
        k += 1
    return len(s)

def literal(s, i):
    """i — qiymat boshi (bo'shliqdan keyin). (start, end, tur) — faqat ICHKI matn chegarasi."""
    while s[i] in ' \t\n': i += 1
    c = s[i]
    if c in '"\'`':
        e = skip_str(s, i); return (i + 1, e - 1, c)
    if s.startswith('<>', i):
        e = s.index('</>', i); return (i + 2, e, 'jsx')
    return None

def field(s, a, b, name):
    m = re.compile(r'\b' + name + r'\s*:\s*').search(s, a, b)
    if not m: return None
    return literal(s, m.end())

def vis(t):
    t = re.sub(r'</?(b|i|em|strong|span|code|br)\b[^>]*>', '', t); t = t.replace('`', '')
    t = re.sub(r"\{'(.*?)'\}", r'\1', t)                               # JSX {'…'} o'rami ekranda ko'rinmaydi
    t = re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m.group(1), 16)), t)
    return t.replace("\\'", "'").replace('\\"', '"').strip()

def norm(t): return re.sub(r"[^\wʻ' ]", '', vis(t).lower().replace('"', '')).strip()

def options_ctx(s, pos):
    pre = s[max(0, pos - 6000):pos]; base = max(0, pos - 6000)
    q = None
    for m in re.finditer(r'questionText=\{\{\s*uz:\s*', pre): q = m
    qt = ''
    if q:
        L = literal(s, base + q.end()); qt = vis(s[L[0]:L[1]]) if L else ''
    o = pre.rfind('options={[')
    opts = []
    if o >= 0:
        oa = base + o + len('options={'); ob = brace(s, oa); blk = s[oa + 1:ob - 1]
        k = 0
        while k < len(blk):
            c = blk[k]
            if c == '{':
                e = brace(blk, k); L = field(blk, k, e, 'uz'); opts.append(vis(blk[L[0]:L[1]]) if L else '?'); k = e; continue
            if c in '"\'`':
                e = skip_str(blk, k); opts.append(vis(blk[k + 1:e - 1])); k = e; continue
            k += 1
    ci = re.findall(r'correctIdx=\{(\d+)\}', s[max(0, pos - 6000):pos + 3000])
    near = None
    if ci:
        # eng yaqin correctIdx
        best = None
        for m in re.finditer(r'correctIdx=\{(\d+)\}', s[max(0, pos - 6000):pos + 3000]):
            d = abs(max(0, pos - 6000) + m.start() - pos)
            if best is None or d < best[0]: best = (d, int(m.group(1)))
        near = best[1]
    return qt, opts, near

def extract(s):
    items = []
    def add(kind, n, uzL, ruL, ctx):
        it = dict(id=f'{kind}:{n}', kind=kind, line=s.count('\n', 0, uzL[0]) + 1, **ctx,
                  uz_old=s[uzL[0]:uzL[1]], ru_old=s[ruL[0]:ruL[1]] if ruL else None,
                  uz_new='', ru_new='')
        it['_uz'] = uzL; it['_ru'] = ruL; items.append(it)
    n = 0
    for m in re.finditer(r'explainCorrect=\{', s):
        a = m.end() - 1; b = brace(s, a)
        uz = field(s, a, b, 'uz'); ru = field(s, a, b, 'ru')
        if not uz: continue
        qt, opts, ci = options_ctx(s, m.start())
        add('correct', n, uz, ru, dict(q=qt, opts=opts, correct=ci)); n += 1
    n = 0
    for m in re.finditer(r'explainWrong=\{', s):
        a = m.end() - 1; b = brace(s, a)
        qt, opts, ci = options_ctx(s, m.start())
        inner = a + 1
        for km in re.finditer(r'(\d+|default)\s*:\s*(?:tr\()?\{', s[inner:b - 1]):
            oa = inner + km.end() - 1; ob = brace(s, oa)
            uz = field(s, oa, ob, 'uz'); ru = field(s, oa, ob, 'ru')
            if not uz: continue
            key = km.group(1)
            picked = opts[int(key)] if key.isdigit() and int(key) < len(opts) else None
            add('wrong', n, uz, ru, dict(q=qt, opts=opts, correct=ci, key=key, picked=picked)); n += 1
    m = re.search(r'const RECAPS\s*=\s*\{', s)
    if m:
        a = m.end() - 1; b = brace(s, a); n = 0
        for bm in re.finditer(r'\bbody\s*:\s*\{', s[a:b]):
            oa = a + bm.end() - 1; ob = brace(s, oa)
            uz = field(s, oa, ob, 'uz'); ru = field(s, oa, ob, 'ru')
            if not uz: continue
            pre = s[a:oa]
            h = list(re.finditer(r'\bh\s*:\s*\{\s*uz:\s*', pre)); t = list(re.finditer(r'\btitle\s*:\s*\{\s*uz:\s*', pre))
            hL = literal(s, a + h[-1].end()) if h else None; tL = literal(s, a + t[-1].end()) if t else None
            add('recap', n, uz, ru, dict(title=vis(s[tL[0]:tL[1]]) if tL else '', h=vis(s[hL[0]:hL[1]]) if hL else ''))
            n += 1
    return items

def esc(t, q):
    if q == 'jsx':
        return t
    t = t.replace('\\', '\\\\') if False else t
    if q == '`': return t.replace('`', '\\`').replace('${', '\\${')
    return t.replace(q, '\\' + q)

def cmd_extract(f, out):
    s = open(f, encoding='utf8').read()
    items = extract(s)
    for it in items: it.pop('_uz'); it.pop('_ru')
    json.dump(items, open(out, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    from collections import Counter
    print(f'{f}: {len(items)} ta', dict(Counter(i["kind"] for i in items)))

def cmd_apply(f, jf):
    s = open(f, encoding='utf8').read()
    cur = {i['id']: i for i in extract(s)}
    want = json.load(open(jf, encoding='utf8'))
    reps = []; miss = []
    for w in want:
        c = cur.get(w['id'])
        if not c or c['uz_old'] != w['uz_old'] or (c['ru_old'] or None) != (w.get('ru_old') or None):
            miss.append(w['id']); continue
        for lang in ('uz', 'ru'):
            new = (w.get(lang + '_new') or '').strip()
            L = c['_' + lang]
            if not new or not L: continue
            raw = esc(new.replace("\\'", "'").replace('\\"', '"'), L[2]) if L[2] != 'jsx' else new
            if raw != s[L[0]:L[1]]: reps.append((L[0], L[1], raw))
    for a, b, r in sorted(reps, reverse=True): s = s[:a] + r + s[b:]
    open(f, 'w', encoding='utf8').write(s)
    print(f'{f}: {len(reps)} satr almashdi' + (f' · MOS KELMADI: {miss}' if miss else ''))
    return 1 if miss else 0

def cmd_show(f):
    s = open(f, encoding='utf8').read()
    for it in extract(s):
        u = vis(it['uz_old']); r = vis(it['ru_old'] or '')
        if it['kind'] == 'recap':
            print(f"[{it['id']}] L{it['line']} RECAP «{it['title']}» / karta «{it['h']}»\n   uz({len(u)}): {u}\n   ru({len(r)}): {r}")
        else:
            o = ' | '.join(('✓' if i == it['correct'] else '') + f"{chr(65+i)}) {x}" for i, x in enumerate(it['opts']))
            pk = f" · TANLANGAN: {it.get('key')}" if it['kind'] == 'wrong' else ''
            print(f"[{it['id']}] L{it['line']} {it['kind'].upper()}{pk}\n   savol: {it['q']}\n   variantlar: {o}\n   uz({len(u)}): {u}\n   ru({len(r)}): {r}")

def cmd_diff(f):
    """Zaxira (arxiv/izoh-qisqa-oldin-2026-09-30) bilan joriy fayl: har id — savol, variantlar, ESKI uz → YANGI uz / ru."""
    old = {i['id']: i for i in extract(open('arxiv/izoh-qisqa-oldin-2026-09-30/' + f, encoding='utf8').read())}
    for it in extract(open(f, encoding='utf8').read()):
        o = old.get(it['id']) or {}
        head = f"[{it['id']}] L{it['line']}"
        if it['kind'] == 'recap':
            head += f" RECAP «{it['title']}» / karta «{it['h']}»"
        else:
            head += ' ' + it['kind'].upper() + (f" · TANLANGAN: {it.get('key')}" if it['kind'] == 'wrong' else '')
            head += f"\n   savol: {it['q']}\n   variantlar: " + ' | '.join(('✓' if i == it['correct'] else '') + f"{chr(65+i)}) {x}" for i, x in enumerate(it['opts']))
        print(head)
        print(f"   ESKI uz: {vis(o.get('uz_old', ''))}\n   YANGI uz: {vis(it['uz_old'])}\n   YANGI ru: {vis(it['ru_old'] or '')}")

def cmd_put(f, nf):
    s = open(f, encoding='utf8').read()
    new = json.load(open(nf, encoding='utf8'))
    items = extract(s); cur = {i['id']: i for i in items}
    unk = [k for k in new if k not in cur]
    reps = []
    for k, v in new.items():
        c = cur.get(k)
        if not c: continue
        for lang in ('uz', 'ru'):
            t = (v.get(lang) or '').strip(); L = c['_' + lang]
            if not t or not L: continue
            raw = t if L[2] == 'jsx' else esc(t.replace("\\'", "'").replace('\\"', '"'), L[2])
            if raw != s[L[0]:L[1]]: reps.append((L[0], L[1], raw))
    for a, b, r in sorted(reps, reverse=True): s = s[:a] + r + s[b:]
    open(f, 'w', encoding='utf8').write(s)
    left = [i['id'] for i in items if i['id'] not in new]
    print(f'{f}: {len(reps)} satr almashdi · yangi matn berilmagan: {len(left)}' + (f' · NOMA\'LUM id: {unk}' if unk else ''))
    return 1 if unk else 0

def sentences(t):
    t = vis(t)
    return len([x for x in re.split(r'(?<=[.!?])\s+(?=[A-ZА-ЯЁ«"`O\'ʻ0-9])', t) if x.strip()])

def cmd_lint(files):
    bad = 0
    for f in files:
        s = open(f, encoding='utf8').read(); items = extract(s); errs = []
        for it in items:
            lu, lr = LIM[it['kind']]
            for lang, lim in (('uz', lu), ('ru', lr)):
                t = it.get(lang + '_old')
                if t is None: continue
                v = vis(t)
                if len(v) > lim: errs.append(f"{it['id']} {lang} uzun {len(v)}>{lim}: {v[:70]}")
                if sentences(t) > (1 if it['kind'] == 'recap' else 2): errs.append(f"{it['id']} {lang} {sentences(t)} gap: {v[:70]}")
                if it['kind'] == 'correct' and PRAISE.search(v): errs.append(f"{it['id']} {lang} maqtov bilan boshlanadi: {v[:40]}")
                if it['kind'] == 'wrong' and NEGSTART.search(v): errs.append(f"{it['id']} {lang} «Yo'q/Xato» bilan boshlanadi: {v[:40]}")
                if it['kind'] == 'correct' and not v: errs.append(f"{it['id']} {lang} bo'sh")
            if it['kind'] == 'wrong' and it.get('correct') is not None and it['correct'] < len(it['opts']):
                c = norm(it['opts'][it['correct']])
                if len(c) >= 8 and c in norm(it['uz_old']): errs.append(f"{it['id']} uz to'g'ri javobni aytadi: {vis(it['uz_old'])[:60]}")
        bad += len(errs)
        print(f"{'✓' if not errs else '✗'} {f}: {len(items)} izoh · {len(errs)} topilma")
        for e in errs[:400]: print('   ', e)
    return 1 if bad else 0

if __name__ == '__main__':
    c = sys.argv[1]
    if c == 'extract': cmd_extract(sys.argv[2], sys.argv[3])
    elif c == 'apply': sys.exit(cmd_apply(sys.argv[2], sys.argv[3]))
    elif c == 'lint': sys.exit(cmd_lint(sys.argv[2:]))
    elif c == 'show': cmd_show(sys.argv[2])
    elif c == 'diff': cmd_diff(sys.argv[2])
    elif c == 'put': sys.exit(cmd_put(sys.argv[2], sys.argv[3]))
