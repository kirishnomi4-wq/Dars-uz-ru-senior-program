# F-1018-03 · m2-13 PmLesson6 «Sistemani qanday pitch qilish» 18 → 11 ekran (222-qonun). Zaxiradan quradi: python3 f1018c.py
import re, sys
R = '/home/kali/Desktop/internetLesson'
SRC = f'{R}/arxiv/F-1018-03-oldin/PmLesson6.jsx'
DST = f'{R}/src/2-Modull/PmLesson6.jsx'
s = open(SRC, encoding='utf8').read()

def rep(old, new, label=''):
    global s
    c = s.count(old)
    if c != 1: print(f'❌ {label or old[:70]!r}: topildi {c}'); sys.exit(1)
    s = s.replace(old, new)
def cut(a_m, b_m, label):
    global s
    a = s.find(a_m); b = s.find(b_m, a + 1)
    if a < 0 or b <= a: print(f'❌ cut {label}: {a} {b}'); sys.exit(1)
    out = s[a:b]; s = s[:a] + s[b:]; print(f'  kesildi {label}: {out.count(chr(10))} qator'); return out

# 1. meta
rep("lessonId: 'pm-m2d13-v1'", "lessonId: 'pm-m2d13-v2'")
rep("// M2-D13 (PmLesson6) — SISTEMANI QANDAY PITCH QILISH — 2-TUR PM dars",
    "// M2-D13 (PmLesson6) — SISTEMANI QANDAY PITCH QILISH — 2-TUR PM dars · v2 (F-1018-03, 222-qonun: 18 → 11 ekran — pitch o'z do'koni haqida, 2 marta aytiladi, test bitta, sayt tekshiruvi)")
a = s.index('const SCREEN_META = ['); b = s.index('const TOTAL_SCREENS')
s = s[:a] + """const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },   // so'z-elagi
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },   // uch qatlam o'xshatishi
  { id: 's4',  type: 'practice',    template: 'custom',   scored: false, scope: null },   // pitch matni (5 bo'lak, o'z do'koni)
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' }, // «tushunmadim» — nimani tekshirasiz?
  { id: 's6',  type: 'rule',        template: 'custom',   scored: false, scope: null },   // repetitsiya 1: bitta gap, ovoz chiqarib
  { id: 's7',  type: 'recap',       template: 'custom',   scored: false, scope: null },   // repetitsiya 2: sherikka yoddan, sherik hukmi
  { id: 's8',  type: 'practice',    template: 'custom',   scored: false, scope: null },   // Demo Day saytida kamchilik bormi? (F-1018-02)
  { id: 's9',  type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
""" + s[b:]
rep("const ACH_TRIGGERS = { s2: 'jargon', s9: 'plain', s10: 'ear', s11: 'speaker' };",
    "const ACH_TRIGGERS = { s2: 'jargon', s4: 'plain', s7: 'ear', s8: 'site' };")
# nishonlar: ear → sherikka aytdi · speaker (koding) → site
m = re.search(r"  ear:     \{ icon: '👂', name: 'Good Ear!',      desc: \{ uz: \"[^\"]*\", ru: \"[^\"]*\" \} \},\n", s)
if not m: print('❌ ear'); sys.exit(1)
s = s.replace(m.group(0), "  ear:     { icon: '👂', name: 'Good Ear!',      desc: { uz: \"Pitchni sherigingizga yoddan aytdingiz\", ru: \"Вы рассказали питч напарнику наизусть\" } },\n")
m = re.search(r"  speaker: \{ icon: '🌯', name: 'System Speaker!', desc: \{ uz: \"[^\"]*\", ru: \"[^\"]*\" \} \},?\n", s)
if not m: print('❌ speaker'); sys.exit(1)
s = s.replace(m.group(0), "  site:    { icon: '🌐', name: 'Site Checked!',  desc: { uz: \"Demo Day saytingizni uch tekshiruvdan o'tkazdingiz\", ru: \"Вы провели три проверки своего сайта к Демо-дню\" } }\n")
# RECAPS: faqat 14 → 5
a = s.index('const RECAPS = {'); b = s.index('\n};', a) + 3
m = re.search(r"\n  14: \{.*?\n  \},?", s[a:b], re.S)
if not m: print('❌ RECAPS 14'); sys.exit(1)
s = s[:a] + 'const RECAPS = {' + m.group(0).replace('\n  14: {', '\n  5: {').rstrip(',') + '\n};' + s[b:]
rep("""const Q_LABELS = { 3: "1 — Kasbiy so'z", 6: "2 — Birinchi gap", 8: "3 — O'xshatish", 14: "4 — «Tushunmadim»" };""",
    """const Q_LABELS = { 5: "«Tushunmadim»" };""")
rep("const INLINE_KEYS = { s3: 1, s6: 2, s8: 1, s14: 0, ustaxona: -1, kursi: -1, koding: -1 };",
    "const INLINE_KEYS = { s5: 0, ustaxona: -1 };")

# 2. Screen1 — reja: tartib
rep("""shunday qisqa taqdimotga <b style={{ color: T.ink }}>pitch</b> deyiladi.</>, ru: <>""",
    """shunday qisqa taqdimotga <b style={{ color: T.ink }}>pitch</b> deyiladi. Bugun uni o'z do'koningiz haqida yozasiz, ikki marta ovoz chiqarib aytasiz — avval o'zingiz, keyin sherigingizga — va Demo Day saytingizni tekshirasiz.</>, ru: <>""")
i = s.index("va Demo Day saytingizni tekshirasiz.</>, ru: <>"); j = s.index("</b>.</>", i)
s = s[:j] + "</b>. Сегодня вы напишете его о своём магазине, дважды произнесёте вслух — сначала сами, потом напарнику — и проверите свой сайт к Демо-дню.</>" + s[j + len("</b>.</>"):]

# 3. Screen9 (pitch matni) — o'z do'koni (ccDokon) eslatmasi
rep("""        <MentorWatchLine live={live} />
        <div className="wk-steps fade-up">""", """        <MentorWatchLine live={live} />
        {(() => { const dk = readLS('ccDokon'); return dk && dk.nom ? (
          <p className="wk-src fade-up">{tr({ uz: 'Demo Day do\\'koningiz:', ru: 'Ваш магазин к Демо-дню:' })} <b>{dk.nom}</b>{dk.havola ? <span className="mono"> · {dk.havola}</span> : null} — {tr({ uz: 'pitch shu do\\'kon haqida.', ru: 'питч — об этом магазине.' })}</p>
        ) : null; })()}
        <div className="wk-steps fade-up">""")

# 4. kesishlar
cut("// ===== SCREEN 3 — TEST-1 =====", "// ===== SCREEN 7 — 🌯", "s3+s4+s5+s6")
cut("// ===== SCREEN 8 — TEST-3 =====", "// ===== SCREEN 9 — USTAXONA", "s8")
cut("// ===== SCREEN 10 — TINGLOVCHI KURSISI =====", "// ===== SCREEN 12 — BITTA GAP", "s10+s11 koding")
cut("// ===== 🃏 FLASHCARDS =====", "// ===== SCREEN 19 — SUMMARY =====", "flashcards")
if s.count('HW_STEPS') == 1:  # faqat ta'rif qolgan bo'lsa — olinadi
    a = s.index("// ===== SCREEN 15 — UYGA VAZIFA (shartnoma) =====\nconst HW_STEPS = ["); b = s.index("\n];\n", a) + 4
    s = s[:a] + s[b:]; print('  HW_STEPS olindi')
rep("import HtmlCompiler, { checks as C } from '../compilator/HtmlCompiler.jsx';\n", "")
m = re.search(r"const KODING_KEY = 'pm-m2d13-code';[^\n]*\n", s); s = s.replace(m.group(0), '') if m else s
a = max(s.find("function AchRule("), s.find("const AchRule = ")); 
if a >= 0:
    pre = s.rfind("\n\n", 0, a) + 2; b = s.index("\nfunction AchCelebrate(", a) + 1
    print(f'  AchRule olindi: {s[pre:b].count(chr(10))} qator'); s = s[:pre] + s[b:]

# 5. Sayt ekrani (F-1018-02) — Screen13 dan keyin
new_sayt = """// ===== SCREEN 8 — AMALIYOT: DEMO DAY SAYTIDA KAMCHILIK BORMI? (F-1018-02 / 222-qonun 7-band; do'kon: ccDokon) =====
const SAYT_CHECKS = [
  { k: 'katalog', t: { uz: "Katalog ochiladi, narxlar so'mda ko'rinadi", ru: 'Каталог открывается, цены видны в сумах' } },
  { k: 'savat',   t: { uz: "«Savatga» ishlaydi, jami to'g'ri hisoblanadi", ru: '«В корзину» работает, итог считается верно' } },
  { k: 'telefon', t: { uz: 'Telefonda ochganda sahifa sig\\'adi', ru: 'На телефоне страница помещается' } }
];
const SAYT_PROMPT = { uz: "Mana index.html, style.css va script.js kodim: {kod}. Muammo: {kamchilik}. Faqat o'zgartiriladigan qatorlarni ko'rsat, sababini bir gapda ayt.", ru: 'Вот мой код index.html, style.css и script.js: {код}. Проблема: {недочёт}. Покажи только строки, которые нужно изменить, и объясни причину одной фразой.' };
const ScreenSayt = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [dk, setDk] = useState(() => readLS('ccDokon') || {});
  const link = dk.havola || '';
  const [st, setSt] = useState(() => (storedAnswer && storedAnswer.sayt) || {});   // k → 'ok' | 'bad' | 'fixed'
  const [pOpen, setPOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const doneN = SAYT_CHECKS.filter(c => st[c.k] === 'ok' || st[c.k] === 'fixed').length;
  const done = doneN === SAYT_CHECKS.length;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, sayt: st }); }, [done]); // eslint-disable-line
  const set = (k, v) => setSt(p => ({ ...p, [k]: v }));
  const saveLink = (v) => { const n = { ...dk, havola: v.trim() }; setDk(n); writeLS('ccDokon', n); };
  const href = link ? (/^https?:\\/\\//.test(link) ? link : 'https://' + link) : '';
  const copy = async () => { try { await navigator.clipboard.writeText(tr(SAYT_PROMPT)); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch (_e) { /* clipboard ruxsati yo'q */ } };
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · sayt', ru: 'Практика · сайт' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Tekshiring (${doneN}/3)`, ru: `Проверьте (${doneN}/3)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,1.8vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Demo Day <span className="italic" style={{ color: T.accent }}>do'koningizda</span> kamchilik bormi?</>, ru: <>Есть ли недочёты в вашем <span className="italic" style={{ color: T.accent }}>магазине</span> к Демо-дню?</> })}</h2></div>
        <Mentor>{tr({ uz: "Demo Day'da ochiladigan sayt shu. Hozir oching, uch narsani tekshiring. Kamchilik bo'lsa VS Code da to'g'rilang va push qiling — Netlify o'zi yangilaydi. Qiynalsangiz — Gemini'ga so'rov namunasi chapda.", ru: 'Это сайт, который откроется на Демо-дне. Откройте его сейчас и проверьте три вещи. Нашли недочёт — исправьте в VS Code и сделайте push, Netlify обновит сам. Трудно — слева образец запроса к Gemini.' })}</Mentor>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Do\\'koningiz', ru: 'Ваш магазин' })}{dk.nom ? <> · <b>{dk.nom}</b></> : null}</p>
            {href && <a className="btn st-och fade-up" href={href} target="_blank" rel="noreferrer">{tr({ uz: 'Saytni ochish ↗', ru: 'Открыть сайт ↗' })}</a>}
            <input className="st-inp mono" value={link} onChange={e => saveLink(e.target.value)} aria-label={tr({ uz: 'Saytingiz manzili', ru: 'Адрес вашего сайта' })} placeholder={tr({ uz: 'Saytingiz manzili, masalan: mening-dokonim.netlify.app', ru: 'Адрес сайта, например: moy-magazin.netlify.app' })} />
            <button className="st-tip-btn" onClick={() => setPOpen(o => !o)}>{pOpen ? tr({ uz: "Gemini'ga so'rov namunasi ▴", ru: 'Образец запроса к Gemini ▴' }) : tr({ uz: "Gemini'ga so'rov namunasi ▾", ru: 'Образец запроса к Gemini ▾' })}</button>
            {pOpen && (
              <div className="st-tip fade-step">
                <p className="mono" style={{ fontSize: 'clamp(12px,1.5vw,13.5px)', margin: 0 }}>{tr(SAYT_PROMPT)}</p>
                <button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={copy}>{copied ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button>
              </div>
            )}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Uch tekshiruv', ru: 'Три проверки' })}</p>
            {SAYT_CHECKS.map((c, i) => { const v = st[c.k]; const okk = v === 'ok' || v === 'fixed'; return (
              <div key={c.k} className={`st-card ${okk ? 'ok' : ''}`}>
                <p className="st-q"><span className="st-n">{i + 1}</span>{tr(c.t)}</p>
                {!v && <div className="st-btns"><button className="btn-soft" onClick={() => set(c.k, 'ok')}>{tr({ uz: '✓ Joyida', ru: '✓ В порядке' })}</button><button className="btn-soft st-bad" onClick={() => set(c.k, 'bad')}>{tr({ uz: '✗ Kamchilik bor', ru: '✗ Есть недочёт' })}</button></div>}
                {v === 'bad' && <div className="st-tip fade-step"><p style={{ margin: 0 }}>{tr({ uz: "VS Code da to'g'rilang, push qiling — Netlify yangilaydi. Keyin belgilang:", ru: 'Исправьте в VS Code, сделайте push — Netlify обновит. Потом отметьте:' })}</p><button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => set(c.k, 'fixed')}>{tr({ uz: "✓ To'g'riladim", ru: '✓ Исправлено' })}</button></div>}
                {v === 'ok' && <p className="st-ok">{tr({ uz: '✓ Joyida', ru: '✓ В порядке' })}</p>}
                {v === 'fixed' && <p className="st-ok">{tr({ uz: "✓ To'g'rilandi", ru: '✓ Исправлено' })}</p>}
              </div>
            ); })}
          </Col>
        </div>
      </div>
    </Stage>
  );
};

"""
k = s.index("// ===== SCREEN 14 — TEST-4 (final) =====")
s = s[:k] + new_sayt + s[k:]
# CSS — .frame-success dan keyin
i = s.index(".frame-success {"); j = s.index("\n", i) + 1
s = s[:j] + """        .st-card { background: ${T.paper}; border-radius: 14px; padding: 13px 15px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 6px 18px -10px rgba(${T.shadowBase},0.18); }
        .st-card.ok { box-shadow: inset 0 0 0 1.5px ${T.success}; }
        .st-q { margin: 0; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(14px,1.8vw,16px); color: ${T.ink}; display: flex; align-items: center; gap: 8px; }
        .st-n { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: ${T.accent}; color: #fff; font-family: 'Manrope'; font-weight: 800; font-size: 12px; flex-shrink: 0; }
        .st-btns { display: flex; flex-wrap: wrap; gap: 8px; }
        .st-bad { color: ${T.accent}; }
        .st-ok { margin: 0; color: ${T.success}; font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; }
        .st-tip { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border-radius: 12px; background: ${T.bg}; font-size: clamp(13px,1.6vw,14.5px); line-height: 1.45; color: ${T.ink}; }
        .st-tip-btn { align-self: flex-start; border: none; background: none; padding: 0; color: ${T.accent}; font-family: 'Manrope'; font-weight: 700; font-size: 13px; cursor: pointer; }
        .st-och { align-self: flex-start; text-decoration: none; display: inline-flex; }
        .st-inp { width: 100%; padding: 10px 12px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; font-size: 13.5px; }
""" + s[j:]

# 6. root
rep("""  // 🃏 Flashcard ekrani jonli darsda (mentor boshqaruvida) o'quvchida ko'rsatilmaydi — o'tkazib yuboriladi
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });""",
"""  const next = () => setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setScreen(s => Math.max(s - 1, 0));""")
m = re.search(r"  // ⚠️ TARTIB SCREEN_META bilan AYNAN bir xil \(s0…s19\)\n  const screens = \[[^\]]*\];", s)
if not m: print('❌ screens'); sys.exit(1)
s = s.replace(m.group(0), "  // ⚠️ TARTIB SCREEN_META bilan AYNAN bir xil (s0…s10)\n  const screens = [Screen0, Screen1, Screen2, Screen7, Screen9, Screen14, Screen12, Screen13, ScreenSayt, ScreenPodium, ScreenSummary];")

# 7. QUIZ_BANK: Airbnb 2 savol → repetitsiya/sayt (keys ekrani olindi)
for start, new in [
  ("  { q: { uz: 'Airbnb birinchi slaydda", "  { q: { uz: 'Sherigingiz «Yarim tushundim» dedi. Nima qilasiz?', ru: 'Напарник сказал «понял наполовину». Что вы сделаете?' }, opts: [{ uz: 'Balandroq va sekinroq gapiraman', ru: 'Скажу громче и медленнее' }, { uz: 'Tushunarsiz bo\\'lakni soddalashtirib aytaman', ru: 'Упрощу непонятную часть и скажу снова' }, { uz: 'Boshqa sherik topib, qaytadan aytaman', ru: 'Найду другого напарника и скажу заново' }, { uz: 'Pitchni ikki barobar uzaytiraman', ru: 'Удлиню питч в два раза' }], correct: 1 },\n"),
  ("  { q: { uz: 'Airbnb slaydlarining har birida", "  { q: { uz: 'Demo Day\\'dan oldin saytni nega telefonda ham ochib ko\\'rasiz?', ru: 'Зачем перед Демо-днём открыть сайт и на телефоне?' }, opts: [{ uz: 'Zaldagi odam saytni telefonda ochadi', ru: 'Человек в зале откроет сайт на телефоне' }, { uz: 'Telefonda sayt tezroq ochiladi', ru: 'На телефоне сайт открывается быстрее' }, { uz: 'Netlify sozlamasi shuni talab qiladi', ru: 'Так требует настройка Netlify' }, { uz: 'Kompyuterda saytni ochib bo\\'lmaydi', ru: 'На компьютере сайт открыть нельзя' }], correct: 0 },\n"),
]:
    a = s.index(start); n1 = s.find("\n  { q:", a + 1); n2 = s.find("\n];", a + 1)
    b = min(x for x in (n1, n2) if x >= 0) + 1   # butun yozuv (ko'p qatorli bo'lsa ham)
    s = s[:a] + new + s[b:]

# 8. o'lik CSS (zaxirada ishlatilgan, endi JSX'da yo'q)
def dead_classes(src):
    css = src[src.index('<style>{`'):src.index('`}</style>')]
    jsx = src[:src.index('<style>{`')] + src[src.index('`}</style>'):]
    cls = set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", css))
    return {c for c in cls if not re.search(r"['\"` ]" + re.escape(c) + r"['\"` -]|className=\{`[^`]*\b" + re.escape(c) + r"\b", jsx)}
d0 = dead_classes(open(SRC, encoding='utf8').read()); DEAD = dead_classes(s) - d0
ca = s.index('<style>{`'); cb = s.index('`}</style>')
lines = s[ca:cb].split('\n'); out = []; i = 0; removed = 0
while i < len(lines):
    L = lines[i]; st = L.strip(); sel = st.split('{')[0] if '{' in st else ''
    classes = set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", sel)) if sel.startswith('.') else set()
    if classes and classes <= DEAD:
        depth = st.count('{') - st.count('}'); removed += 1; i += 1
        while depth > 0 and i < len(lines): depth += lines[i].count('{') - lines[i].count('}'); removed += 1; i += 1
        continue
    out.append(L); i += 1
css = '\n'.join(out)
for kf in []:  # F-1018-10: keyframes OLIB TASHLANMAYDI — qolipCss (fade-in-up) va jonli-modul darsdan tashqarida nom kutadi
    body = re.sub(r"@keyframes " + re.escape(kf) + r"\b[^{]*\{", "", css)
    if not re.search(r"\b" + re.escape(kf) + r"\b", body):
        m = re.search(r"[ \t]*@keyframes " + re.escape(kf) + r"\s*\{", css); j = m.end(); depth = 1
        while depth > 0: depth += (css[j] == '{') - (css[j] == '}'); j += 1
        if css[j:j+1] == '\n': j += 1
        removed += css[m.start():j].count('\n'); css = css[:m.start()] + css[j:]
s = s[:ca] + css + s[cb:]
print(f"  o'lik CSS: {len(DEAD)} klass, {removed} qator; qolgan: {sorted(dead_classes(s) - d0)}")
open(DST, 'w', encoding='utf8').write(s)
print('✅ yozildi', DST, s.count('\n') + 1, 'qator')
