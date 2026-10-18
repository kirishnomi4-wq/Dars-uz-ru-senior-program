import re, sys, os, shutil, difflib
S = os.path.dirname(os.path.abspath(__file__))
DRY = '--dry' in sys.argv
Y3B = {'MvpIteration','MvpFirstScreen','MvpComplete','FoundationDay','FeatureOne','FeatureTwo','FeatureThree','LiveNotifyDay','PaymentDay','RetentionDay','DemoPrep','ReferralDay','StabilizeDay','WinBackDay','PolishDay','VideoPortfolio'}
Y4 = {'PmMonetization','PmMoneyTalk','PaymentWebhook','PmPayCheck','PmUnitEconomics','PaymentDay','WinBackDay','ReferralDay','StabilizeDay'}
PM = {'PmLesson19','PmLesson20','PmLesson21','PmLesson22','PmLesson23','PmLesson24','PmLesson25','PmMetrics'}
G3 = {'BotAiProject','BotFullProject','BotFeedbackIteration'}
MARK = "✎ F-1015-112 (15.10): Yakun 207-qonunga keltirildi — tartib CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Nishonlar · (Erta tugatdingizmi) · (Keyingi dars); «Bugungi asosiy fikr» yo'q; tugma «Yakunlash ✓»."

def kind(line):
    s = line.strip()
    if not line.startswith('- '): return None
    if re.match(r'- \**(Nishonlar|Nishonlaringiz)', s): return 'nishon'
    if 'Erta tugatdingizmi' in s or 'AI bilan davom' in s: return 'erta'
    if re.match(r'- \**Keyingi( dars|:)', s): return 'keyingi'
    return None

def blocks(sec):
    """bo'limni [(kind, [qatorlar])] bloklarga ajratadi (bullet + ichki qatorlar)."""
    out = []; cur = None
    for l in sec:
        if l.startswith('- ') or not (l.startswith('  ') or l.startswith('|')) or cur is None:
            cur = [kind(l), [l]]; out.append(cur)
        else:
            cur[1].append(l)
    return out

report = []
for row in open(os.path.join(S, 'mdmap.txt')):
    code, md = row.strip().split(' -> ')
    name = re.search(r'/(\w+)\.jsx$', code).group(1).replace('Lesson', '') if 'PmLesson' not in code else re.search(r'(PmLesson\d+)', code).group(1)
    T = open(md, encoding='utf8').read().split('\n'); O = list(T)
    ys = [i for i, t in enumerate(T) if re.match(r'^##\s+\d+\s*·\s*(Dars yakuni|Yakun)', t)]
    assert ys, md
    y = ys[-1]; e = next((j for j in range(y + 1, len(T)) if T[j].startswith('## ')), len(T))
    sec = T[y + 1:e]
    bl = blocks(sec)
    # A: asosiy fikr bullet-bloklari (yo'qligini aytmaydiganlari)
    bl = [b for b in bl if not re.match(r'- \**(Bugungi asosiy fikr|Asosiy fikr)', b[1][0])]
    # D: tartib
    keys = None
    if name in Y3B or name in G3 or name in PM: keys = ['nishon', 'erta', 'keyingi']
    elif name in Y4: keys = ['nishon', 'erta']
    if keys:
        idx = [i for i, b in enumerate(bl) if b[0] in keys]
        if len(idx) > 1:
            first = idx[0]; sel = [bl[i] for i in idx]
            rest = [b for i, b in enumerate(bl) if i not in idx]
            sel.sort(key=lambda b: keys.index(b[0]))
            pos = sum(1 for i in range(first) if i not in idx)
            bl = rest[:pos] + sel + rest[pos:]
    sec = [l for b in bl for l in b[1]]
    out = []
    for l in sec:
        if re.match(r'\s*- Tugmalar:', l):
            l = re.sub(r'Yakunlash(?! ✓| →)', 'Yakunlash ✓', l)
        if l.lstrip().startswith('- Tartib:'):
            pre, body = l.split('Tartib:', 1)
            tail = ''
            m = re.search(r'\.\s', body)
            if m: body, tail = body[:m.start()], body[m.start():]
            toks = [t.strip() for t in body.split('·')]
            toks = [t for t in toks if t and not re.search(r'asosiy fikr', t, re.I)]
            if keys:
                k = lambda t: 'nishon' if re.match(r'Nishon', t) else 'erta' if re.search(r'Erta|AI bilan', t) else 'keyingi' if re.match(r'Keyingi', t) else None
                ix = [i for i, t in enumerate(toks) if k(t) in keys]
                if len(ix) > 1:
                    sel = sorted([toks[i] for i in ix], key=lambda t: keys.index(k(t)))
                    for j, i in enumerate(ix): toks[i] = sel[j]
            l = pre + 'Tartib: ' + ' · '.join(toks) + tail
        l = l.replace('CODE STRIKE ostida, mentor rejimida yo\'q', 'Nishonlardan keyin, mentor rejimida yo\'q')
        out.append(l)
    # marker
    while out and out[-1].strip() in ('', '---'): tailblank = True; break
    ins = len(out)
    while ins > 0 and out[ins - 1].strip() in ('', '---'): ins -= 1
    if not any('F-1015-112' in l for l in out): out.insert(ins, MARK)
    T = T[:y + 1] + out + T[e:]
    # G: KOD qatorlari (9-M)
    T = [t.replace(', «Bugungi asosiy fikr» `small`', '').replace('`QYakun`: sarlavha, asosiy fikr, 4 band', '`QYakun`: sarlavha, 4 band')
          .replace("- 16-ekran: «Bugungi asosiy fikr» yashil kartada CODE STRIKE ustida (QYakun da alohida joy yo'q).", "- 16-ekran: «Bugungi asosiy fikr» yo'q (207-qonun, F-1015-112).") for t in T]
    if T != O:
        d = list(difflib.unified_diff(O, T, md, md, n=0, lineterm=''))
        report.append('\n'.join(d))
        if not DRY:
            b = 'arxiv/F-1015-112-oldin/' + md
            if not os.path.exists(b): os.makedirs(os.path.dirname(b), exist_ok=True); shutil.copy2(md, b)
            open(md, 'w', encoding='utf8').write('\n'.join(T))
open(os.path.join(S, 'mdfix.diff'), 'w', encoding='utf8').write('\n\n'.join(report))
print('ozgaradigan MD:', len(report))
