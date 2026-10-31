#!/usr/bin/env python3
# Nest-1 yakuniy MD — KODDAN avtomatik (F-1031-14). Kod = manba-haqiqat; MD shu skript bilan qayta yasaladi.
# ISHLATISH (repo ildizidan): python3 feedback/F-1029-02-mentor-kurs/dev/nest1-md.py > feedback/F-1029-02-mentor-kurs/04-Nest1-mentor-yakuniy.md
# Faqat o'zbekcha (etalon); ruscha parts/08-ru.jsx da. Ma'lumot obyektlari node orqali (esbuild bundle) o'qiladi,
# ekran ichidagi tekshiruv propslari (MCRetry/LineCheck) manba matnidan t() ning birinchi argumenti sifatida olinadi.
import json, os, re, subprocess, sys, tempfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
PARTS = os.path.join(ROOT, 'src/mentor-kurs/parts')
files = sorted(f for f in os.listdir(PARTS) if f.endswith('.jsx') and not f.startswith('08-'))
src = ''.join(open(os.path.join(PARTS, f), encoding='utf-8').read() for f in files)
screen_src = ''.join(open(os.path.join(PARTS, f), encoding='utf-8').read() for f in files if f[:2] in ('03', '04', '05', '06', '07'))

SCREENS = re.search(r'const SCREENS = \[(.*?)\];', src).group(1).replace(' ', '').split(',')
names = list(dict.fromkeys(re.findall(r'^const ([A-Z][A-Za-z0-9_]*) = ', screen_src, re.M)))

# --- ma'lumot obyektlari: bundle + node ---
tmp = tempfile.mkdtemp()
entry = os.path.join(tmp, 'e.jsx')
body = src.replace('export default function NestArchMentorLesson', 'function NestArchMentorLesson')
open(entry, 'w', encoding='utf-8').write(body + '\nexport const __D = {' + ', '.join(names) + '};\n')
out = os.path.join(ROOT, '_nest1_md_tmp.mjs')
subprocess.run(['npx', 'esbuild', entry, '--bundle', '--format=esm', '--platform=node', '--jsx=automatic', '--external:react',
                '--alias:@lesson/runtime=./src/mentor-kurs/dev/lesson-runtime.jsx', '--outfile=' + out, '--log-level=error'], cwd=ROOT, check=True)
dump = os.path.join(tmp, 'd.mjs')
open(dump, 'w').write("""const { __D } = await import(%s);
const strip = (x) => Array.isArray(x) ? x.map(strip) : (x && typeof x === 'object' && !x.$$typeof) ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, strip(v)])) : (x && x.$$typeof ? null : x);
const o = {}; for (const [k, v] of Object.entries(__D)) if (typeof v !== 'function') o[k] = strip(v);
process.stdout.write(JSON.stringify(o));""" % json.dumps(out))
D = json.loads(subprocess.run(['node', dump], cwd=ROOT, capture_output=True, text=True, check=True).stdout)
os.remove(out)

# --- yordamchilar ---
def md_inline(h):
    h = h or ''
    h = re.sub(r'<code>(.*?)</code>', r'`\1`', h)
    h = re.sub(r'</?b>', '**', h)
    h = re.sub(r'<[^>]+>', '', h)
    return h.replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&')

def fn_body(name):
    m = re.search(r'^function %s\(p\)[^\n]*\n' % re.escape(name), screen_src, re.M)
    if not m:
        m = re.search(r'^function %s\(p\).*$' % re.escape(name), screen_src, re.M)
        return m.group(0) if m else ''
    end = re.search(r'^(?:function |const |// =+)', screen_src[m.end():], re.M)
    return screen_src[m.start(): m.end() + (end.start() if end else len(screen_src))]

def t_arg(body, prop):
    m = re.search(prop + r'=\{t\((["\'])((?:\\.|(?!\1).)*)\1', body, re.S)
    return m.group(2).replace("\\'", "'").replace('\\"', '"') if m else None

def t_list(body, prop):
    m = re.search(prop + r'=\{t\(\[(.*?)\],', body, re.S)
    if not m: return []
    return [x[1].replace("\\'", "'") for x in re.findall(r'(["\'])((?:\\.|(?!\1).)*)\1', m.group(1))]

def t_obj(body, prop):
    m = re.search(prop + r'=\{t\(\{(.*?)\},', body, re.S)
    if not m: return {}
    return {int(k): v.replace("\\'", "'") for k, _, v in re.findall(r'(\d+):\s*(["\'])((?:\\.|(?!\2).)*)\2', m.group(1))}

def segs_md(S):
    out = []
    for i, s in enumerate(S.get('segments', []), 1):
        out.append('%d. **%s**' % (i, md_inline(s.get('key', '')).replace('**', '')))
        out.append('   Ovoz: «%s»' % s.get('text', ''))
        if s.get('ask'):
            a = s['ask']; out.append('   O\'ylab ko\'ring: %s — %s (to\'g\'ri: %s)' % (a.get('q', ''), ' / '.join(a.get('opts', [])), (a.get('opts') or ['?'])[a.get('answer', 0)] if a.get('opts') else '?'))
    return out

TYPE = {'Lesson': 'Lesson', 'Practice': 'Practice', 'MCRetry': 'MCRetry', 'LineCheck': 'LineCheck'}
L = []
L.append('# Nest-1 mentor darsi — yakuniy MD (koddan)')
L.append('')
L.append('> **Manba-haqiqat — kod** (`src/mentor-kurs/parts/03–07`, ruscha `08-ru.jsx`). Bu fayl `dev/nest1-md.py` bilan avtomatik chiqarilgan — qo\'lda tahrirlamang; kod o\'zgarsa skriptni qayta yurgizing.')
L.append('> Dars: «%s» · ID `%s` · %d ekran · UZ + RU · platforma fayli `tayyor/NestArchMentorLesson.oz.jsx`.' % (
    re.search(r"lessonTitle: '([^']+)'", src).group(1), re.search(r"const LESSON_ID = '([^']+)'", src).group(1), len(SCREENS)))
L.append('')
for n, name in enumerate(SCREENS, 1):
    body = fn_body(name)
    kind = next((k for k in TYPE if '<' + k in body), 'Maxsus')
    Sname = (re.search(r'\bS=\{(\w+)\}', body) or [None, None])[1]
    S = D.get(Sname) or {}
    title = S.get('title') or t_arg(body, 'title') or {'Screen27': "O'z-sinov — 8 savol", 'Screen28': 'Yakun: xulosa, uyga vazifa, eslatma'}.get(name, name)
    L.append('---')
    L.append('')
    L.append('## %d · %s  ← `%s` (`%s`)' % (n, md_inline(title), kind, name))
    head = []
    if S.get('kicker'): head.append('Kicker: `%s`' % S['kicker'])
    if S.get('eyebrow'): head.append('Eyebrow: %s' % S['eyebrow'])
    if head: L.append('- ' + ' · '.join(head))
    if S.get('plan'): L.append('- Reja: ' + ' · '.join(S['plan']))
    if kind in ('Lesson', 'Practice'):
        L += segs_md(S)
    if kind == 'Practice':
        for prop in ('steps', 'trouble', 'proof'):
            v = (re.search(prop + r'=\{(\w+)\}', body) or [None, None])[1]
            if prop == 'steps' and v in D:
                L.append('- Qadamlar:')
                for i, st in enumerate(D[v], 1):
                    L.append('  %d. **%s** — %s%s' % (i, st.get('t', ''), ' · '.join('`%s`' % c for c in st.get('cmds', [])) + (' → ' if st.get('cmds') else ''), 'kutilgan: ' + st.get('exp', '')))
            if prop == 'trouble' and v in D:
                L.append('- «Boshqacha chiqdimi?» jadvali:')
                for a, c in D[v]: L.append('  - `%s` → %s' % (a, c))
            if prop == 'proof' and v in D:
                L.append('- Isbot: %s (placeholder: «%s»)' % (D[v].get('label', ''), D[v].get('placeholder', '')))
        if 'code=' in body: L.append('- «Kodni ochish»: namuna kodlar (`code`), Explorer — `tree` (butun loyiha, faqat amaliyot fayllari bosiladi)')
    if kind in ('MCRetry', 'LineCheck'):
        q = t_arg(body, 'q'); task = t_arg(body, 'task')
        if task: L.append('- Shart: ' + md_inline(task))
        if q: L.append('- Ovoz (savol): «%s»' % q)
        if kind == 'MCRetry':
            opts = t_list(body, 'opts'); c = re.search(r'correct=\{(\d+)\}', body)
            ci = int(c.group(1)) if c else -1
            for i, o in enumerate(opts): L.append('  %s) %s%s' % ('ABCD'[i], o, '  ✔' if i == ci else ''))
            for k, v in sorted(t_obj(body, 'wrong').items()): L.append('  - %s noto\'g\'ri: %s' % ('ABCD'[k], v))
        else:
            tg = re.search(r'target=\{(\[?[\d, ]+\]?)\}', body)
            L.append('- To\'g\'ri satr (0 dan): %s' % (tg.group(1) if tg else '?'))
            h = t_arg(body, 'hint')
            if h: L.append('- Yo\'llanma (noto\'g\'ri bosilsa): ' + h)
        ok = t_arg(body, 'ok'); oks = t_arg(body, 'okShort')
        if ok: L.append('- To\'g\'ri javobdan keyin (ovoz): «%s»' % ok)
        if oks: L.append('- Ekranda: ' + oks)
    if name == 'Screen27' and 'FINAL' in D:
        L.append('- O\'z-sinov: %d savol, bitta urinish, 6+ — o\'zlashtirildi; noto\'g\'ri savoldan ko\'rsatilgan ekranga qaytiladi.' % len(D['FINAL']))
        for i, f in enumerate(D['FINAL'], 1):
            L.append('  %d. %s' % (i, f.get('q', '')))
            for j, o in enumerate(f.get('o', [])): L.append('     %s) %s%s' % ('ABCD'[j], o, '  ✔' if j == f.get('c') else ''))
            L.append('     Izoh: %s · ekran %s' % (f.get('e', ''), f.get('s', '?')))
    if name == 'Screen28':
        seg_src = re.search(r'const s28Segments = \(passed\) => s28Ru\(passed, \[(.*?)\n\]\);', screen_src, re.S)
        if seg_src:
            for i, m in enumerate(re.finditer(r"\{ id: '(\w+)', key: (\"|')((?:\\.|(?!\2).)*)\2, text: (\"|')((?:\\.|(?!\4).)*)\4", seg_src.group(1)), 1):
                L.append('%d. [%s] **%s**' % (i, m.group(1), md_inline(m.group(3).replace("\\'", "'")).replace('**', '')))
                L.append('   Ovoz: «%s»' % m.group(5).replace("\\'", "'"))
        if 'HOMEWORK' in D:
            L.append('- Uyga vazifa:')
            for i, h in enumerate(D['HOMEWORK'], 1): L.append('  %d. %s%s' % (i, h.get('t', ''), (' — ' + ' · '.join('`%s`' % c for c in h.get('c', []) if c)) if h.get('c') else ''))
        if 'CHEATSHEET' in D:
            L.append('- Eslatma (.md, yuklab olinadi):')
            L.append('')
            L.append('```markdown')
            L.append(D['CHEATSHEET'])
            L.append('```')
    L.append('')
sys.stdout.write('\n'.join(L) + '\n')
