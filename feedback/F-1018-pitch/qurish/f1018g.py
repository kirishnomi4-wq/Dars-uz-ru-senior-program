# F-1018-07 · m9-16 PmPrototypePitchLesson (LMS 11-Modul 16-dars) 16 → 11 (222-qonun). Zaxiradan quradi: python3 f1018g.py
import re, sys
R = '/home/kali/Desktop/internetLesson'
SRC = f'{R}/arxiv/F-1018-07-oldin/PmPrototypePitchLesson.jsx'
DST = f'{R}/src/9-Modull/PmPrototypePitchLesson.jsx'
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

rep("lessonId: 'pm-m9d16-v1'", "lessonId: 'pm-m9d16-v2'")
rep("// 16 ekran · PM 2-tur (artefakt — to'rt bo'lakli 3 daqiqalik pitch va juftlikdagi repetitsiyasi) · ballik testlar 3, 5, 7, 12 (✔ D · B · C · A) · keys K19 iPhone",
    "// 11 ekran (v2 · F-1018-07 · 222-qonun) · PM 2-tur (artefakt — to'rt bo'lakli 3 daqiqalik pitch, juftlikdagi repetitsiyasi + 1 daqiqalik 2-raund, ilova tekshiruvi) · ballik test bitta — yakuniy (✔ A).\n// Olindi: s3/s5/s7 oraliq testlar, s6 iPhone keysi, s9 Neon SQL, kartochkalar. Qo'shildi: s11 4-qadam «Qayta ayting (1 daqiqa)», ScreenIlova «Ilovangizda kamchilik bormi?» (222.7). Yakuniy MD: feedback/F-1018-pitch/YAKUNIY-05-m9-16.md", 'header')

a = s.index('const SCREEN_META = ['); b = s.index('const TOTAL_SCREENS')
s = s[:a] + """const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },          // 0 · QKirish
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },            // 1 · QReja
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 2 · QTushuncha: to'rt bo'lak
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 3 · QTushuncha: muammo va dalil
  { id: 's8',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 4 · QTushuncha: jonli demo
  { id: 's10', type: 'practice',    template: 'custom',   scored: false, scope: null },            // 5 · QMustaqil: pitch yozish (ustaxona)
  { id: 's12', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },         // 6 · yakuniy savol
  { id: 's11', type: 'practice',    template: 'custom',   scored: false, scope: null },            // 7 · QMustaqil: juftlikda pitch (Ayting · Baholang · Tuzating · Qayta ayting)
  { id: 'silova', type: 'practice', template: 'custom',   scored: false, scope: null },            // 8 · QMustaqil: ilovangizda kamchilik bormi? (222.7)
  { id: 'podium', type: 'stats',    template: 'custom',   scored: false, scope: null },            // 9 · podium
  { id: 's15', type: 'summary',     template: 'custom',   scored: false, scope: null }             // 10 · QYakun
];
const SCREEN_INTENTS = [
  "hook: zal 3 daqiqada nimani ko'rmoqchi (telefon, taymer, zal)", "reja: to'rt bo'lak qatorlari yoziladi, taymer 3:00 gacha yetadi", "to'rt bo'lak: Mentor pitchi yig'iladi, taymer bo'linadi, jonli demo",
  "muammo va dalil: sanoq va harakat belgisi jadvaldan bo'lakka", "jonli demo: kutish yozuvi, asosiy harakat, sinovdagi tuzatish", "mustaqil: pitch to'rt bo'lakka yoziladi",
  'yakuniy savol: son va unga nima kirgani', "juftlik: 3 daqiqa taymer, baholash varag'i, bo'lak tuzatish, 1 daqiqada qayta aytish (2-raund)", "ilova: manzil, Render eslatmasi, 3 tekshiruv (ochildi · asosiy harakat · sinovdagi tuzatish)", 'podium', 'yakun'
];
""" + s[b:]
rep("const INLINE_KEYS = { s3: 3, s5: 1, s7: 2, s12: 0, bolaklar: -1, dalil: -1, demo: -1, neon: -1, practice: -1, juftlik: -1 };",
    "const INLINE_KEYS = { s12: 0, bolaklar: -1, dalil: -1, demo: -1, practice: -1, juftlik: -1 };")
# RECAPS: faqat 12 → 6
a = s.index('const RECAPS = {'); b = s.index('\n};', a) + 3
m = re.search(r"\n  12: \{.*?\n  \] \},?", s[a:b], re.S)
if not m: print('❌ RECAPS 12'); sys.exit(1)
rc = m.group(0).replace('\n  12: {', '\n  6: {').rstrip(',')
rc = rc.replace("{ uz: 'Shartsiz SQL hamma qatorni sanaydi.', ru: 'SQL без условия считает все строки.' }", "{ uz: \"Database'dagi son hamma yozuvni sanaydi.\", ru: 'Число из Database считает все записи.' }")
s = s[:a] + 'const RECAPS = {' + rc + '\n};' + s[b:]
a = s.index('const Q_LABELS = {'); b = s.index('\n};', a) + 3
s = s[:a] + """const Q_LABELS = {
  6: { uz: 'Songa nima kirgan', ru: 'Что входит в число' }
};""" + s[b:]

# --- kesishlar
cut("// ===== SCREEN 3 — 1-SAVOL", "// ===== SCREEN 4 — MUAMMO VA DALIL", "s3 test")
cut("// ===== SCREEN 5 — 2-SAVOL", "// ===== SCREEN 6 — IPHONE", "s5 test")
cut("// ===== SCREEN 6 — IPHONE", "// ===== SCREEN 8 — JONLI DEMO", "s6 iPhone + s7 test")
cut("// ===== SCREEN 9 — KOD YOZISH", "// ===== SCREEN 10 — PITCH YOZISH", "s9 Neon")
cut("// 🃏 KARTOCHKALAR", "// ===== UYGA VAZIFA — PM HwCard", "kartochkalar")
if s.count('useSanoq(') == 0:
    a = s.index('const useSanoq = '); b = s.index('\n};', a) + 4; s = s[:a] + s[b:]; print('  useSanoq olindi')

# --- s10: Neon javobi (answers[9]) yo'q — son faqat artefaktdan
rep("  const a9 = answers && answers[9];\n", "")
rep("son: (a9 && a9.qator) || e(['demo', 'son']) }", "son: e(['demo', 'son']) }", 's10 son')

# --- root
rep("""  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });""",
"""  const next = () => setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setScreen(s => Math.max(s - 1, 0));""", 'root nav')
s = re.sub(r"\n  // 🃏 Flashcard[^\n]*", "", s)
rep("const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, ScreenPodium, ScreenFlashcards, SummaryScreen];",
    "const screens = [Screen0, Screen1, Screen2, Screen4, Screen8, Screen10, Screen12, Screen11, ScreenIlova, ScreenPodium, SummaryScreen];")
rep("  const baholandi = !!(answers[11] && answers[11].solved);", "  const baholandi = !!(answers[7] && answers[7].solved); // v2: juftlik ekrani — 7-indeks", 'baholandi')

# --- nishonlar: honestCount (Neon) → secondTake (2-raund, data.nishon orqali)
rep("// ===== 🏅 NISHONLAR (4) — ish qilingan ekranlarda (S-034: tekin bonus yo'q; 2, 4, 8-ekran nishonsiz). 9-ekran — birinchi urinish; 10, 11 — ish bajarilgani (data.nishon) =====",
    "// ===== 🏅 NISHONLAR (4) — ish qilingan ekranlarda (S-034: tekin bonus yo'q; 2, 4, 8-ekran nishonsiz). s10, s11 — ish bajarilgani (data.nishon); secondTake — s11 2-raund taymeri to'xtaganda =====")
rep("""  honestCount: { icon: '🔢', name: 'Honest Count!', desc: { uz: "Database'dan son olib, unga nimalar kirganini aniqladingiz", ru: 'Вы взяли число из Database и выяснили, что в него входит' } },\n""", "")
rep("""  fixedIt: { icon: '🛠️', name: 'Fixed It!', desc: { uz: "Varaqdagi izohdan keyin bo'lakni qayta yozdingiz", ru: 'После замечания в листе вы переписали часть' } }
};""", """  fixedIt: { icon: '🛠️', name: 'Fixed It!', desc: { uz: "Varaqdagi izohdan keyin bo'lakni qayta yozdingiz", ru: 'После замечания в листе вы переписали часть' } },
  secondTake: { icon: '🔁', name: 'Second Take!', desc: { uz: "Tuzatilgan bo'lakni 1 daqiqada qayta aytdingiz", ru: 'Вы ещё раз рассказали исправленную часть за 1 минуту' } }
};""", 'secondTake')
rep("// Ekran id → nishon (birinchi urinish sharti bilan; NishonQatori shu ro'yxatdan): faqat 9-ekran\nconst ACH_TRIGGERS = { s9: 'honestCount' };",
    "// Ekran id → nishon (birinchi urinish sharti bilan): v2 da bunday ekran yo'q — hammasi data.nishon orqali\nconst ACH_TRIGGERS = {};", 'ACH_TRIGGERS')

# --- REJA
rep("""  { t: { uz: "Ilovani telefonda ko'rsatishga tayyorlanasiz", ru: 'Подготовитесь показать приложение на телефоне' }, teg: { uz: 'jonli demo', ru: 'живое демо' } },
  { t: { uz: 'Pitchni sherigingizga aytib, baholatasiz', ru: 'Расскажете питч партнёру и получите оценку' }, teg: { uz: "baholash varag'i", ru: 'лист оценки' } }
];""", """  { t: { uz: 'Pitchni sherigingizga 3 daqiqada aytib, baholatasiz va tuzatib 1 daqiqada qayta aytasiz', ru: 'Расскажете питч партнёру за 3 минуты, получите оценку, исправите и расскажете ещё раз за 1 минуту' }, teg: { uz: 'ikki raund', ru: 'два раунда' } },
  { t: { uz: 'Ilovangizni Demo Day oldidan telefonda tekshirasiz', ru: 'Проверите приложение на телефоне перед Демо-днём' }, teg: { uz: 'ilova', ru: 'приложение' } }
];""", 'REJA')

# --- Screen11: 4-qadam «Qayta ayting (1 daqiqa)» — 2-raund (222.1)
A = s.index("const Screen11 = ("); B = s.index("// ===== SCREEN 12 — YAKUNIY SAVOL", A); blk = s[A:B]
def rb(old, new, label):
    global blk
    if blk.count(old) != 1: print(f'❌ Screen11 {label}: {blk.count(old)}'); sys.exit(1)
    blk = blk.replace(old, new)
rb("  const [done, setDone] = useState(!!st.solved);\n", """  const [done, setDone] = useState(!!st.solved);
  // F-1018-07 (222.1): 4-qadam — tuzatilgan bo'lak sherikka 1 daqiqada aytildi aytiladi (2-raund); saqlangan bo'lsa to'xtagan holda tiklanadi
  const [tm2, setTm2] = useState(st.qayta ?? 0);
  const [yur2, setYur2] = useState(false);
  const [aytildi, setAytildi] = useState(st.qayta != null);
  useEffect(() => { if (!yur2) return undefined; const t = setInterval(() => setTm2(v => v + 1), 1000); return () => clearInterval(t); }, [yur2]);
  const tayyor = isMentor || (done && aytildi);
""", 'state')
rb("  const joriyB = yur ? joriyBolak(vaqt) : -1;\n", """  const boshla2 = () => { setTm2(0); setYur2(true); setAytildi(false); };
  const toxtat2 = () => {
    setYur2(false); setAytildi(true);
    if (isMentor) return;
    pitchSaqla({ qayta: tm2 });
    onAnswer(screen, { stage: 'juftlik', screenIdx: screen, solved: true, correct: true, picked: true, qadam: 2, vaqt, varaq, qayta: tm2, nishon: ['threeMinutes', 'fixedIt', 'secondTake'] });
  };
  const joriyB = yur ? joriyBolak(vaqt) : -1;
""", 'toxtat2')
rb("""  const mentorT = done ? { uz: "Bo'lak tuzatildi: «Davom etish»ni bosing.", ru: 'Часть исправлена: нажмите «Продолжить».' }""",
   """  const mentorT = done && aytildi ? { uz: 'Ikkinchi marta aytildi: «Davom etish»ni bosing.', ru: 'Рассказано второй раз: нажмите «Продолжить».' }
    : done ? (juft ? { uz: "Bo'lak tuzatildi: endi uni sherigingizga 1 daqiqada qayta ayting.", ru: 'Часть исправлена: теперь расскажите её партнёру ещё раз за 1 минуту.' } : { uz: "Bo'lak tuzatildi: endi uni ovoz chiqarib 1 daqiqada qayta ayting.", ru: 'Часть исправлена: теперь расскажите её вслух ещё раз за 1 минуту.' })""", 'mentorT')
rb("""<NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Bitta bo'lakni tuzating", ru: 'Исправьте одну часть' })} onClick={onNext} />""",
   """<NavNext optionalLive disabled={!tayyor} label={tayyor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : done ? tr({ uz: 'Qayta ayting (1 daqiqa)', ru: 'Скажите ещё раз (1 минута)' }) : tr({ uz: "Bitta bo'lakni tuzating", ru: 'Исправьте одну часть' })} onClick={onNext} />""", 'NavNext')
rb("""              {done && <QXulosa>{tr({ uz: "Varaq to'ldi va bitta bo'lak tuzatildi. Qolgan ✗ bo'laklar — uyga vazifada.", ru: 'Лист заполнен, и одна часть исправлена. Остальные части с ✗ — в домашнем задании.' })}</QXulosa>}""",
"""              {done && !aytildi && <QXulosa>{tr({ uz: "Varaq to'ldi va bitta bo'lak tuzatildi. Qolgan ✗ bo'laklar — uyga vazifada.", ru: 'Лист заполнен, и одна часть исправлена. Остальные части с ✗ — в домашнем задании.' })}</QXulosa>}
              {done && !isMentor && <div className="pt-s11-qayta">
                <QIzoh>{juft
                  ? tr({ uz: "2-raund: tuzatilgan bo'lakni sherigingizga 1 daqiqada qayta ayting — endi zal savoliga javob bo'ldimi?", ru: 'Раунд 2: расскажите исправленную часть партнёру ещё раз за 1 минуту — теперь это ответ на вопрос зала?' })
                  : tr({ uz: "2-raund: tuzatilgan bo'lakni ovoz chiqarib 1 daqiqada qayta ayting — endi zal savoliga javob bo'ldimi?", ru: 'Раунд 2: расскажите исправленную часть вслух ещё раз за 1 минуту — теперь это ответ на вопрос зала?' })}</QIzoh>
                <div className="pt-tmr">
                  <b className={cxx('pt-tmr-s', yur2 && 'yur', tm2 > 60 && 'oshdi')}>{mss(tm2)}</b>
                  {yur2 && <span className="pt-tmr-h fade-step">{tr({ uz: 'Hozir siz gapirasiz', ru: 'Сейчас говорите вы' })}</span>}
                  <span className="pt-tmr-t">
                    {!yur2 && aytildi && <QTugma ikkinchi onClick={boshla2}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</QTugma>}
                    {!yur2 && !aytildi && <QTugma className="pt-halqa" onClick={boshla2}>{tr({ uz: '1 daqiqani boshlash', ru: 'Запустить 1 минуту' })}</QTugma>}
                    {yur2 && <QTugma className="pt-halqa" onClick={toxtat2}>{tr({ uz: "To'xtatish", ru: 'Остановить' })}</QTugma>}
                  </span>
                </div>
                {aytildi && <QXulosa>{tr({ uz: "Tuzatilgan bo'lak ikkinchi marta aytildi — pitch sahnaga tayyor. Qolgan ✗ bo'laklar — uyga vazifada.", ru: 'Исправленная часть рассказана второй раз — питч готов к сцене. Остальные части с ✗ — в домашнем задании.' })}</QXulosa>}
              </div>}""", '2-raund blok')
i = blk.index("<MentorNote>{tr({ uz: \"Taymerni sinf bo'ylab bir vaqtda boshlating:"); j = blk.index("</MentorNote>", i)
blk = blk[:i] + """<MentorNote>{tr({ uz: "Taymerni sinf bo'ylab bir vaqtda boshlating: avval hamma A, keyin hamma B (2 × 3 daqiqa + varaq ≈ 10 daqiqa). Bo'lak tuzatilgach — 2-raund: har o'quvchi tuzatilgan bo'lakni sherigiga 1 daqiqada aytildi aytadi (2 × 1 daqiqa); sinfga bitta savol: endi zal savoliga javob bo'ldimi? «Davom etish» shu raunddan keyin ochiladi.", ru: 'Запускайте таймер одновременно по классу: сначала все A, потом все B (2 × 3 минуты + лист ≈ 10 минут). Когда часть исправлена — раунд 2: каждый ученик рассказывает исправленную часть партнёру ещё раз за 1 минуту (2 × 1 минута); один вопрос классу: теперь это ответ на вопрос зала? «Продолжить» открывается после этого раунда.' })}""" + blk[j:]
s = s[:A] + blk + s[B:]

# --- ScreenIlova — «Ilovangizda kamchilik bormi?» (222.7; m1-12 ScreenSayt andozasi, QMustaqil uslubida)
ILOVA = r"""// ===== SCREEN ILOVA — ILOVANGIZDA KAMCHILIK BORMI? (222.7 · F-1018-07: juftlikdan keyin, arenadan oldin; ballsiz; manzil o'quvchi qo'li bilan — oldingi darslar saqlamagan) =====
const ILOVA_CHECKS = [
  { k: 'ochildi', t: { uz: 'Ilova telefonda ochildi — birinchi ekran chiqdi', ru: 'Приложение открылось на телефоне — появился первый экран' } },
  { k: 'harakat', t: { uz: "Jonli demo bo'lagidagi asosiy harakat ishlaydi", ru: 'Главное действие из части «Живое демо» работает' } },
  { k: 'tuzatish', t: { uz: "Sinovdan keyin tuzatgan joyingiz ko'rinadi", ru: 'Видно то, что вы исправили после теста' } }
];
const ILOVA_PROMPT = { uz: "Mana ilovamning kodi: {kod}. Telefonda ochganda muammo: {kamchilik}. Faqat o'zgartiriladigan qatorlarni ko'rsat, sababini bir gapda ayt.", ru: 'Вот код моего приложения: {код}. Проблема при открытии на телефоне: {недочёт}. Покажи только строки, которые нужно изменить, и объясни причину одной фразой.' };
const ScreenIlova = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useJonli();
  const st = storedAnswer || {};
  const [trek] = useState(() => { const p = lsGet('pm-m9d8-platforma'); return p && (p.trek === 'web' || p.trek === 'mobil') ? p.trek : null; });
  const [link, setLink] = useState(() => (pitchLs() || {}).ilova || '');
  const [holat, setHolat] = useState(st.ilova || {});   // k → 'ok' | 'bad' | 'fixed'
  const [pOpen, setPOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const doneN = ILOVA_CHECKS.filter(c => holat[c.k] === 'ok' || holat[c.k] === 'fixed').length;
  const done = doneN === ILOVA_CHECKS.length;
  useEffect(() => { if (done && !st.solved && !isMentor) onAnswer(screen, { stage: 'ilova', screenIdx: screen, solved: true, correct: true, picked: true, ilova: holat }); }, [done]); // eslint-disable-line
  const set = (k, v) => setHolat(p => ({ ...p, [k]: v }));
  const saveLink = (v) => { setLink(v); pitchSaqla({ ilova: v.trim() }); };
  const href = link.trim() ? (/^https?:\/\//.test(link.trim()) ? link.trim() : 'https://' + link.trim()) : '';
  const copy = async () => { try { await navigator.clipboard.writeText(tr(ILOVA_PROMPT)); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch (_e) { /* clipboard ruxsati yo'q */ } };
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · ilova', ru: 'Практика · приложение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Tekshiring (${doneN}/3)`, ru: `Проверьте (${doneN}/3)` })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Demo Day'da ochiladigan <A>ilovangizda</A> kamchilik bormi?</>, ru: <>Есть ли недочёты в <A>приложении</A>, которое откроется на Демо-дне?</> })}
        mentor={<Mentor>{tr({ uz: "Sahnada ochiladigan ilova shu. Hozir telefonda oching, uch narsani tekshiring. Kamchilik bo'lsa — VS Code'da to'g'rilang va push qiling. Qiynalsangiz — Gemini'ga so'rov namunasi chapda.", ru: 'Это приложение откроется на сцене. Откройте его сейчас на телефоне и проверьте три вещи. Если есть недочёт — исправьте в VS Code и сделайте push. Если трудно — образец запроса к Gemini слева.' })}</Mentor>}
        qadamlar={<div className="pt-ilova-2">
          <div className="pt-ilova-ch">
            <span className="pt-oldin-h">{tr({ uz: 'Ilovangiz', ru: 'Ваше приложение' })}</span>
            {trek !== 'mobil' && <>
              {href && <a className="pt-ilova-och" href={href} target="_blank" rel="noreferrer">{tr({ uz: 'Ilovani ochish', ru: 'Открыть приложение' })}</a>}
              <input className="pt-inp" value={link} disabled={isMentor} onChange={e => saveLink(e.target.value)} aria-label={tr({ uz: 'Ilovangiz manzili', ru: 'Адрес вашего приложения' })} placeholder={tr({ uz: 'Ilovangiz manzili, masalan: mening-ilovam.onrender.com', ru: 'Адрес приложения, например: moyo-prilozhenie.onrender.com' })} />
            </>}
            <div className="pt-oldin">
              {trek !== 'mobil' && <span>{tr({ uz: "Render'dagi server uxlab qoladi — pitchdan 2–3 daqiqa oldin oching, birinchi ochilish sekin.", ru: 'Сервер на Render засыпает — откройте за 2–3 минуты до питча, первое открытие медленное.' })}</span>}
              {trek !== 'web' && <span>{tr({ uz: <>Mobil trekda: laptopda <code className="qcode">npx expo start</code> ishlab turibdi, ilova telefonda Expo Go'da ochiq.</>, ru: <>В мобильном треке: на ноутбуке работает <code className="qcode">npx expo start</code>, приложение открыто в Expo Go на телефоне.</> })}</span>}
            </div>
            <div className="pt-ilova-g"><QTugma ikkinchi onClick={() => setPOpen(o => !o)}>{pOpen ? tr({ uz: "Gemini'ga so'rov namunasi ▴", ru: 'Образец запроса к Gemini ▴' }) : tr({ uz: "Gemini'ga so'rov namunasi ▾", ru: 'Образец запроса к Gemini ▾' })}</QTugma></div>
            {pOpen && <div className="pt-ilova-pr fade-step">
              <p>{tr(ILOVA_PROMPT)}</p>
              <QTugma ikkinchi onClick={copy}>{copied ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</QTugma>
            </div>}
          </div>
          <div className="pt-ilova-on">
            <span className="pt-oldin-h">{tr({ uz: 'Uch tekshiruv', ru: 'Три проверки' })}</span>
            {ILOVA_CHECKS.map((c, i) => { const v = holat[c.k]; const okk = v === 'ok' || v === 'fixed'; return (
              <div key={c.k} className={cxx('pt-ilova-k', okk && 'ok', v === 'bad' && 'bad')}>
                <p className="pt-ilova-q"><i>{i + 1}</i><span>{tr(c.t)}</span></p>
                {!v && <div className="pt-ilova-b"><QChip disabled={isMentor} onClick={() => set(c.k, 'ok')}>{tr({ uz: '✓ Joyida', ru: '✓ В порядке' })}</QChip><QChip disabled={isMentor} onClick={() => set(c.k, 'bad')}>{tr({ uz: '✗ Kamchilik bor', ru: '✗ Есть недочёт' })}</QChip></div>}
                {v === 'bad' && <div className="pt-ilova-pr fade-step"><p>{tr({ uz: "VS Code'da to'g'rilang, push qiling — Render yangilaydi. Keyin belgilang:", ru: 'Исправьте в VS Code, сделайте push — Render обновит. Потом отметьте:' })}</p><QChip holat="ok" onClick={() => set(c.k, 'fixed')}>{tr({ uz: "✓ To'g'rilandi", ru: '✓ Исправлено' })}</QChip></div>}
                {v === 'ok' && <span className="pt-ilova-ok">{tr({ uz: '✓ Joyida', ru: '✓ В порядке' })}</span>}
                {v === 'fixed' && <span className="pt-ilova-ok">{tr({ uz: "✓ To'g'rilandi", ru: '✓ Исправлено' })}</span>}
              </div>
            ); })}
            {done && <QXulosa>{tr({ uz: 'Ilova sahnaga tayyor: ochiladi, asosiy harakat ishlaydi, tuzatish ko\'rinadi.', ru: 'Приложение готово к сцене: открывается, главное действие работает, исправление видно.' })}</QXulosa>}
          </div>
        </div>}
        forma={null}
      >
        <MentorNote>{tr({ uz: "Har o'quvchi o'z telefonida tekshiradi (≈ 8 daqiqa). Ilova ochilmasa — Render'ni uyg'otish 1–2 daqiqa oladi, kutsin. Kamchilik topilsa darsda tuzatishga vaqt yo'q bo'lsa — uyga vazifaga: Demo Day'gacha push qilinadi.", ru: 'Каждый проверяет на своём телефоне (≈ 8 минут). Если приложение не открылось — пробуждение Render занимает 1–2 минуты, пусть подождёт. Если недочёт найден, а времени на уроке нет — в домашнее задание: push до Демо-дня.' })}</MentorNote>
      </QMustaqil>
    </Stage>
  );
};

"""
rep("// ===== 🏅 NISHONLAR (4)", ILOVA + "// ===== 🏅 NISHONLAR (4)", 'ScreenIlova joyi')

# --- CSS
rep("        .pt-s11-ch, .pt-s11-on { display: flex; flex-direction: column; gap: 10px; min-width: 0; }\n",
    """        .pt-s11-ch, .pt-s11-on { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .pt-s11-qayta { display: flex; flex-direction: column; gap: 10px; padding: 12px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        /* Ilova tekshiruvi (222.7) */
        .pt-ilova-2 { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1.25fr); gap: 16px; align-items: start; }
        .pt-ilova-ch, .pt-ilova-on { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .pt-ilova-och { display: inline-flex; align-items: center; justify-content: center; align-self: flex-start; padding: 10px 18px; border-radius: 12px; background: ${T.accent}; color: #fff; font-weight: 700; text-decoration: none; font-size: 14px; }
        .pt-ilova-pr { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px dashed ${T.line}; font-size: 13px; line-height: 1.45; }
        .pt-ilova-pr p { margin: 0; }
        .pt-ilova-k { display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .pt-ilova-k.ok { border-color: ${T.ok}; background: ${T.okFon}; }
        .pt-ilova-k.bad { border-color: ${T.err}; }
        .pt-ilova-q { display: flex; gap: 10px; align-items: flex-start; margin: 0; font-size: 14px; font-weight: 600; line-height: 1.4; }
        .pt-ilova-q i { flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: ${fon(T.accent, 0.14)}; color: ${T.accent}; font-style: normal; font-size: 12px; font-weight: 700; }
        .pt-ilova-b, .pt-ilova-g { display: flex; flex-wrap: wrap; gap: 8px; }
        .pt-ilova-ok { font-size: 13px; font-weight: 700; color: ${T.ok}; }
        @media (max-width: 760px) { .pt-ilova-2 { grid-template-columns: 1fr; } }
""", 'css ilova')

# --- yakun RECAP: Database qatori → 2-raund + ilova tekshiruvi
rep("""    { uz: "Database'dagi sonni aytganda, unga nimalar kirganini ham aytasiz.", ru: 'Называя число из Database, вы говорите и о том, что в него входит.' }""",
    """    { uz: "Tuzatilgan bo'lakni darhol qayta aytasiz va ilovani Demo Day oldidan telefonda tekshirasiz.", ru: 'Исправленную часть сразу рассказываете ещё раз, а приложение проверяете на телефоне перед Демо-днём.' }""", 'RECAP')

# --- QUIZ_BANK: iPhone ×2 (q5 C, q6 A) → 2-raund va ilova tekshiruvi
def qrep(start, new, label):
    global s
    a = s.find(start)
    if a < 0: print(f'❌ QUIZ {label}'); sys.exit(1)
    n1 = s.find("\n  { q:", a + 1); n2 = s.find("\n];", a + 1); b = min(x for x in (n1, n2) if x >= 0) + 1
    s = s[:a] + new + s[b:]
qrep("  { q: { uz: \"Stiv Jobs iPhone'",
     """  { q: { uz: "Tuzatilgan bo'lakni nima uchun darhol 1 daqiqada qayta aytasiz?", ru: 'Зачем сразу рассказывать исправленную часть ещё раз за 1 минуту?' }, opts: [{ uz: 'Dars vaqti ortib qolgani uchun', ru: 'Потому что осталось время урока' }, { uz: 'Sherik yana tinglashni xohlagani uchun', ru: 'Потому что партнёр хочет послушать ещё' }, { uz: "Zal savoliga javob bo'ldimi, ko'rinadi", ru: 'Видно, стала ли она ответом залу' }, { uz: 'Taymer shunday sozlangani uchun', ru: 'Потому что так настроен таймер' }], correct: 2 },\n""", 'q5')
qrep("  { q: { uz: \"Apple iPhone'",
     """  { q: { uz: 'Ilovangizni Demo Day oldidan tekshirganda nimani ko\\'rasiz?', ru: 'Что проверяете в приложении перед Демо-днём?' }, opts: [{ uz: 'Ochiladi va asosiy harakat ishlaydi', ru: 'Открывается и главное действие работает' }, { uz: 'Kodda nechta fayl borligini', ru: 'Сколько файлов в коде' }, { uz: 'Ranglari sherikka yoqadimi', ru: 'Нравятся ли цвета партнёру' }, { uz: 'Ilova nomi qancha uzunligini', ru: 'Какой длины название приложения' }], correct: 0 },\n""", 'q6')

# --- o'lik CSS (m8-11 andozasi, 2 o'tish)
def dead_classes(src):
    css = src[src.index('<style>{`'):src.index('`}</style>')]
    jsx = src[:src.index('<style>{`')] + src[src.index('`}</style>'):]
    cls = set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", css))
    return {c for c in cls if not re.search(r"['\"` ]" + re.escape(c) + r"['\"` -]|className=\{`[^`]*\b" + re.escape(c) + r"\b|cxx\([^)]*['\"]" + re.escape(c) + r"['\"]", jsx)}
d0 = dead_classes(open(SRC, encoding='utf8').read()); DEAD = dead_classes(s) - d0
ca = s.index('<style>{`'); cb = s.index('`}</style>')
lines = s[ca:cb].split('\n'); out = []; i = 0; removed = 0
while i < len(lines):
    L = lines[i]; st = L.strip(); sel = st.split('{')[0] if '{' in st else ''
    classes = set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", sel)) if re.match(r"^(?:[a-z]+)?\.", sel) else set()
    if classes and classes <= DEAD:
        depth = st.count('{') - st.count('}'); removed += 1; i += 1
        while depth > 0 and i < len(lines): depth += lines[i].count('{') - lines[i].count('}'); removed += 1; i += 1
        continue
    out.append(L); i += 1
css = '\n'.join(out)
out2 = []; audit = []
for L in css.split('\n'):
    st = L.strip(); groups = [g.split('{')[0].strip() for g in re.split(r"\}", st) if '{' in g]
    if groups and st.count('{') == st.count('}') and all(',' not in g and (set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", g)) & DEAD) for g in groups):
        removed += 1; audit.append(st[:90]); continue
    out2.append(L)
css = '\n'.join(out2)
if audit: print("  2-o'tish satrlari:"); [print('    ', a) for a in audit]
for kf in []:  # F-1018-10: keyframes OLIB TASHLANMAYDI — qolipCss (fade-in-up) va jonli-modul darsdan tashqarida nom kutadi
    body = re.sub(r"@keyframes " + re.escape(kf) + r"\b[^{]*\{", "", css)
    if not re.search(r"\b" + re.escape(kf) + r"\b", body):
        m = re.search(r"[ \t]*@keyframes " + re.escape(kf) + r"\s*\{", css); j = m.end(); depth = 1
        while depth > 0: depth += (css[j] == '{') - (css[j] == '}'); j += 1
        if css[j:j+1] == '\n': j += 1
        removed += css[m.start():j].count('\n'); css = css[:m.start()] + css[j:]
css = re.sub(r"\n[ \t]*/\* === 🃏 FLASHCARDS[^\n]*", "", css)
s = s[:ca] + css + s[cb:]
print(f"  o'lik CSS: {len(DEAD)} klass, {removed} qator; qolgan: {sorted(dead_classes(s) - d0)}")
open(DST, 'w', encoding='utf8').write(s)
print('✅ yozildi', DST, s.count('\n') + 1, 'qator')
