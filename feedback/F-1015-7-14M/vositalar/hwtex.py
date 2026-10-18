# F-1015-123 S1 (A): texnik 7–8-M (+ m9-08/09) uy vazifasi → P-025 karta: «Uyda nima qilasiz?» + KIM UCHUN/NECHTA/MUDDAT + raqam-doirali qadam
# + «Keyingi dars» karta ichida (ink2). Maydon qiymatlari — HOMEWORK matnidan (yangi talab yo'q). python3 hwtex.py [--yoz] [--faqat <kalit>]
import re, sys
yoz = '--yoz' in sys.argv
faqat = sys.argv[sys.argv.index('--faqat') + 1] if '--faqat' in sys.argv else ''
KF = dict(l.split() for l in open('/tmp/claude-1000/-home-kali-Desktop-internetLesson/82485f6d-16ed-42e1-bfdb-84a1b561cb6f/scratchpad/kf.txt'))
KIM = {'bot': ("o'z botingiz", 'ваш бот'), 'loy': ("o'z loyihangiz", 'ваш проект'), 'mvp': ("o'z MVP'ingiz", 'ваш MVP'), 'mah': ("o'z mahsulotingiz", 'ваш продукт'),
       'amb': ('amaliyotdagi bot', 'бот из практики'), 'mdk': ("mini-do'kon ilovasi", 'приложение мини-магазина'), 'mob': ('mobil ilovangiz', 'ваше мобильное приложение')}
# kalit: (kim, nechta uz, nechta ru, t-funksiya)
D = {
 'm5-01': ('bot', "3 g'oya", '3 идеи', None), 'm5-03': ('amb', '3 hodisa, 1 buyruq', '3 события, 1 команда', None),
 'm5-04': ('bot', '2 mijoz uchun kod', 'код для 2 клиентов', None), 'm5-06': ('bot', '1 system prompt, 5 xabar', '1 system prompt, 5 сообщений', None),
 'm5-10': ('bot', '1 maqsad, 3–4 asbob', '1 цель, 3–4 инструмента', None), 'm6-01': ('loy', "1 chizma, 1 so'rov yo'li", '1 схема, 1 путь запроса', None),
 'm6-03': ('loy', '1 qaror', '1 решение', None), 'm6-04': ('loy', '1 vazifa', '1 задача', None), 'm6-05': ('loy', '1 SKILL.md', '1 SKILL.md', None),
 'm6-07': ('loy', '1 Skill, 2–3 sinov', '1 Skill, 2–3 проверки', None), 'm6-08': ('loy', "1 to'liq oqim", '1 полный поток', None),
 'm6-09': ('mdk', '1 ekran', '1 экран', None), 'm6-10': ('mob', '1 chizma', '1 схема', None), 'm6-11': ('mob', '1 ilova', '1 приложение', None),
 'm6-13': ('loy', '1 backend', '1 backend', None), 'm7-04': ('mvp', '2 prompt', '2 промпта', 'fmtCode'), 'm7-05': ('loy', '3 element', '3 элемента', None),
 'm9-08': ('mah', '3 funksiya', '3 функции', None), 'm9-09': ('mah', '1 prototip', '1 прототип', 'tx'),
}
CSS = ("        .hwk { display: flex; flex-direction: column; gap: 12px; }"
       " .hwk-karta { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 8px; }"
       " .hwk-q { display: flex; flex-direction: column; gap: 3px; padding: 9px 11px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; }"
       " .hwk-k { font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2}; }"
       " .hwk-v { font-size: 13.5px; font-weight: 700; line-height: 1.35; color: ${T.ink}; }"
       " ol.hwk-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }"
       " .hwk-qadam li { display: flex; gap: 10px; align-items: flex-start; font-size: 14px; line-height: 1.5; color: ${T.ink}; }"
       " .hwk-qadam li i { flex: 0 0 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-style: normal; font-weight: 800; font-size: 12px; line-height: 1; color: ${T.accent}; background: ${T.accentSoft}; }"
       " p.hwk-keyingi { margin: 0; font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; } p.hwk-keyingi b { color: ${T.ink}; }")

def karta(kalit, ind):
    kim, nu, nr, _ = D[kalit]; ku, kr = KIM[kim]
    q = lambda s: '"' + s + '"' if "'" in s else "'" + s + "'"
    return (f"{ind}const HW_KARTA = [ // F-1015-123: P-025 maydonlari — qiymatlar shu topshiriq matnidan\n"
            f"{ind}  {{ k: {{ uz: 'Kim uchun', ru: 'Для кого' }}, v: {{ uz: {q(ku)}, ru: {q(kr)} }} }},\n"
            f"{ind}  {{ k: {{ uz: 'Nechta', ru: 'Сколько' }}, v: {{ uz: {q(nu)}, ru: {q(nr)} }} }},\n"
            f"{ind}  {{ k: {{ uz: 'Muddat', ru: 'Срок' }}, v: {{ uz: 'keyingi darsgacha', ru: 'до следующего урока' }} }}\n"
            f"{ind}];\n")

def kartajsx(kalit, lbl, keyingi):
    tf = D[kalit][3]; t = f'{tf}(tr(h.t))' if tf == 'fmtCode' else (f'{tf}(h.t)' if tf else 'tr(h.t)')
    return (f'<div className="card hwk fade-up d4">{lbl}'
            '<div className="hwk-karta">{HW_KARTA.map((r, i) => <div key={i} className="hwk-q"><span className="hwk-k">{tr(r.k)}</span><span className="hwk-v">{tr(r.v)}</span></div>)}</div>'
            '<ol className="hwk-qadam">{HOMEWORK.map((h, i) => <li key={i}><i>{i + 1}</i><span><b>{tr(h.b)}</b> {' + t + '}</span></li>)}</ol>'
            + (f'<p className="hwk-keyingi">{keyingi}</p>' if keyingi else '') + '</div>')

LBL_O = "<div className=\"card-lbl\" style={{ color: T.accent }}>{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>"
LBL_Q = "<div className=\"card-lbl acc\">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>"
for kalit in D:
    if faqat and faqat != kalit: continue
    f = KF[kalit]; s = open(f, encoding='utf-8').read(); L = s.split('\n'); xato = []
    hw = [i for i, l in enumerate(L) if re.search(r'const HOMEWORK = \[', l)]
    if len(hw) != 1: print('!!', kalit, 'HOMEWORK', len(hw)); continue
    own = [i for i, l in enumerate(L) if '{hwOpen && <div className="card hw fade-up d4">' in l]
    if own:
        i = own[0]; l = L[i]
        m = re.search(r'<p className="hw-note">(\{.*\})</p></div>\}\s*$', l)
        if not m: print('!!', kalit, 'hw-note'); continue
        key = re.sub(r'(🚀|📱|🎓) ', '', m.group(1))
        pre = l[:l.index('{hwOpen && ')]
        L[i] = pre + '{hwOpen && ' + kartajsx(kalit, LBL_O, key) + '}'
        css = [j for j, x in enumerate(L) if re.match(r'\s*\.hw ul \{', x)]
    else:
        u = [i for i, l in enumerate(L) if re.search(r'^\s*uyga=\{HOMEWORK\.map', l)]
        k = [i for i, l in enumerate(L) if re.search(r'^\s*keyingi=\{', l)]
        if len(u) != 1 or len(k) != 1: print('!!', kalit, 'uyga/keyingi', len(u), len(k)); continue
        ind = re.match(r'\s*', L[u[0]]).group(0)
        kl = L[k[0]].strip()
        if kalit in ('m9-08', 'm9-09'):  # keyingi= da maydon matni edi; asl «Keyingi dars» — QYakun bolasi <p …-keyingi>
            ch = [i for i, l in enumerate(L) if re.search(r'<p className="(pc|ep)-keyingi fade-up"', l)]
            if len(ch) != 1: print('!!', kalit, 'child'); continue
            mm = re.search(r'<p className="(?:pc|ep)-keyingi fade-up"[^>]*>(\{.*\})</p>\s*$', L[ch[0]])
            key = mm.group(1); L[ch[0]] = None
            nish = [i for i, l in enumerate(L) if l is not None and i > u[0] and l.rstrip().endswith('))}>') and 'nishonlar=' in l]
            if len(nish) != 1: print('!!', kalit, 'nishonlar>'); continue
            L[nish[0]] = L[nish[0]].rstrip()[:-1] + '\n' + ind[:-2] + '/>'
            clo = [i for i, l in enumerate(L) if l is not None and l.strip() == '</QYakun>']
            if len(clo) != 1: print('!!', kalit, '</QYakun>'); continue
            L[clo[0]] = None
        else:
            key = kl[len('keyingi='):]
            key = key[1:-1]  # {tr(...)} → tr(...)
            key = '{' + key + '}'
        L[u[0]] = ind + 'uyga={' + kartajsx(kalit, LBL_Q, key) + '}'
        L[k[0]] = None
        css = [j for j, x in enumerate(L) if x is not None and re.match(r'\s*\.qz-cta \{', x)][:1]
    if not css: print('!!', kalit, 'css-langar'); continue
    L.insert(css[0] + 1, CSS)
    ind = re.match(r'\s*', L[hw[0]]).group(0)
    L[hw[0]] = karta(kalit, ind) + L[hw[0]]
    yangi = '\n'.join(x for x in L if x is not None)
    print(kalit, f, 'own' if own else 'qyakun', '· keyingi:', key[:70])
    if yoz: open(f, 'w', encoding='utf-8').write(yangi)
