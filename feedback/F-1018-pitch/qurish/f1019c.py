# F-1019-03 · m12-01 QA fidbek F-1015-372…377 (7–14-M QA seansidan): bitta karta, chegarasiz qatorlar, bosqich bitta joyda,
# ma'nosiz matn tekshiruvi, 213.22 qaror qadamlari. Zaxiradan quradi: python3 f1019c.py
import re, sys
R = '/home/kali/Desktop/internetLesson'
SRC = f'{R}/arxiv/F-1019-03-oldin/PmInvestorPitchLesson.jsx'
DST = f'{R}/src/12-Modull/PmInvestorPitchLesson.jsx'
s = open(SRC, encoding='utf8').read()
def rep(old, new, label=''):
    global s
    c = s.count(old)
    if c != 1: print(f'❌ {label or old[:70]!r}: topildi {c}'); sys.exit(1)
    s = s.replace(old, new)

# ---------- import: ma'nosiz matn tekshiruvi (qolip, F-1015-377)
rep("QMustaqil, QChip, QXato, QIzoh, QXulosa } from '../qolip/index.jsx';",
    "QMustaqil, QChip, QXato, QIzoh, QXulosa, manoliMatn, MANOSIZ_XATO } from '../qolip/index.jsx';", 'import')

# ---------- SCREEN_INTENTS — v2 ekranlariga (10)
a = s.index('const SCREEN_INTENTS = ['); b = s.index('\n];', a) + 3
s = s[:a] + """const SCREEN_INTENTS = [
  'kirish: besh bo\\'lakli pitch qaysi hakam savoliga javob topolmaydi', 'reja: olti bo\\'lakli qoralama va sherik',
  'olti bo\\'lak: uch qaror — javobsiz savollar, yangi bo\\'laklar, savol-javob', 'uch yangi bo\\'lak: Bozor (son bo\\'yicha qaror) · Jamoa · Keyingi qadam',
  'Mentor qoralamasini tartiblash', 'o\\'z qoralamasi: olti karta, pm-m12d1-pitch', 'sherikka o\\'qing: olti savolga javob bormi',
  'yakuniy test: Keyingi qadam', 'podium', 'yakun: 4 holat'
];""" + s[b:]

# ---------- 4. ma'nosiz matn: «mmm» saqlanmaydi, nishon berilmaydi
rep("""  if (!n) return { x: 'bosh', blok: true };
  if (s.length > 160) return { x: 'uzun', blok: true };""",
    """  if (!n) return { x: 'bosh', blok: true };
  if (!manoliMatn(s)) return { x: 'manosiz', blok: true }; // F-1015-377: «mmm», «asd» — o'qilmaydigan matn
  if (s.length > 160) return { x: 'uzun', blok: true };""", 'tekshir')
rep("""  bosh: { uz: "Bu bo'lakka bitta-ikkita gap yozing.", ru: 'Напишите в эту часть одну-две фразы.' },""",
    """  bosh: { uz: "Bu bo'lakka bitta-ikkita gap yozing.", ru: 'Напишите в эту часть одну-две фразы.' },
  manosiz: MANOSIZ_XATO,""", 'S11_XATO')

# ---------- 213.22: qaror qadami (3 variant, xatosiga sabab, qayta tanlash) + uch bo'lak konteksti
rep("""// --- Bo'lak kartasi: holat — bosh · joriy · yozildi · ok · yangi · oraliq ---""",
"""// --- F-1019-03 (DE 213.22): qaror qadami — savol, 3 variant (biri to'g'ri, qolgani tipik xato), xatosiga bir qatorli sabab, qayta tanlash ---
// ichida — savol ostidagi kontekst (masalan, son kartasi). Har qadam key bilan yangilanadi (tanlovlar tozalanadi).
const Qaror = ({ savol, variantlar, onTogri, ichida }) => {
  const [xato, setXato] = useState([]);
  const [izoh, setIzoh] = useState(null);
  const tanla = (j) => {
    const v = variantlar[j];
    if (v.ok) { setIzoh(null); onTogri(); return; }
    setXato(x => (x.includes(j) ? x : [...x, j])); setIzoh(v.izoh);
  };
  return (
    <div className="ip-qr fade-step">
      <p className="ip-qr-s">{tr(savol)}</p>
      {ichida}
      <div className="ip-qr-v">{variantlar.map((v, j) => <QChip key={j} holat={xato.includes(j) ? 'err' : undefined} disabled={xato.includes(j)} onClick={() => tanla(j)}>{tr(v.t)}</QChip>)}</div>
      {izoh && <QXato key={tr(izoh)}>{tr(izoh)}</QXato>}
    </div>
  );
};
// F-1019-03 (213.13): qadam izohi kartasiz osilmaydi — asosiy kartaning (sahna) ichida, pastda
const SahnaIzoh = ({ t }) => <p className="ip-sahna-iz fade-step">{tr(t)}</p>;
// Uch yangi bo'lak ekrani (ScreenUch) — fokus chiplari yagona bosqich ko'rsatkichi (DE 213.21): Bozor · Jamoa · Keyingi qadam bosiladi, qolgani xira
const UchCtx = createContext(null);
// --- Bo'lak kartasi: holat — bosh · joriy · yozildi · ok · yangi · oraliq ---""", 'Qaror')

# OltiBolakSahna: fokus chiplari ScreenUch ichida bosiladigan bosqich ko'rsatkichi
rep("""const OltiBolakSahna = ({ telefon = false, telSon = 8, investor, bolaklar = [], taymer, yorliq, fokus, ostida, className }) => (
  <div className={cxx('ip-sahna', !telefon && 'tel-yoq', fokus && 'fokusli', className)}>""",
"""const FkChip = ({ b, fokus }) => {
  const uch = useContext(UchCtx);
  if (!uch) return <span className={cxx('ip-fk-chip', b.id === fokus && 'on')}>{b.nom}</span>;
  if (!UCH_ID.includes(b.id)) return <span className="ip-fk-chip xira">{b.nom}</span>;
  const ok = !!uch.qism[b.id]; const on = uch.joriy === b.id;
  return <button type="button" className={cxx('ip-fk-chip', 'bos', on && 'on', ok && !on && 'ok')} disabled={!ok && !on} onClick={() => uch.och(b.id)}>{ok ? <i>✓</i> : null}{b.nom}</button>;
};
const OltiBolakSahna = ({ telefon = false, telSon = 8, investor, bolaklar = [], taymer, yorliq, fokus, ostida, className }) => (
  <div className={cxx('ip-sahna', !telefon && 'tel-yoq', fokus && 'fokusli', className)}>""", 'FkChip')
rep("""          <div className="ip-fk-qator">{bolaklar.map(b => <span key={b.id} className={cxx('ip-fk-chip', b.id === fokus && 'on')}>{b.nom}</span>)}</div>""",
    """          <div className="ip-fk-qator">{bolaklar.map(b => <FkChip key={b.id} b={b} fokus={fokus} />)}</div>""", 'fk-qator')

# ---------- SCREEN 2 — olti bo'lak: telefon olinadi, uch tugma → uch qaror
rep("""const S2_TUGMA = [{ uz: 'Investor savollari', ru: 'Вопросы инвестора' }, { uz: "Yangi bo'laklar", ru: 'Новые части' }, { uz: 'Besh daqiqa va savol-javob', ru: 'Пять минут и вопросы-ответы' }];""",
"""// F-1019-03 (213.22): har qadam — qaror; to'g'ri tanlov pitchni o'zgartiradi
const S2_QAROR = [
  { savol: { uz: "Besh bo'lak investorning qaysi savollariga javob bermaydi?", ru: 'На какие вопросы инвестора пять частей не отвечают?' }, v: [
    { t: { uz: 'Mahsulot nima qiladi? Son qayerdan?', ru: 'Что делает продукт? Откуда число?' }, izoh: { uz: "Bularga Yechim va Raqamlar bo'laklari javob beradi.", ru: 'На них отвечают части «Решение» и «Цифры».' } },
    { ok: true, t: { uz: 'Yana qancha odamga kerak? Kim qilyapti?', ru: 'Скольким ещё нужно? Кто это делает?' } },
    { t: { uz: 'Muammo qayerdan? Endi nima qilasiz?', ru: 'Откуда проблема? Что дальше?' }, izoh: { uz: "Bularga Muammo va Keyingi qadam javob beradi.", ru: 'На них отвечают «Проблема» и «Следующий шаг».' } }
  ] },
  { savol: { uz: "Bu ikki savolga qaysi yangi bo'laklar javob beradi?", ru: 'Какие новые части отвечают на эти два вопроса?' }, v: [
    { ok: true, t: { uz: 'Bozor va Jamoa', ru: 'Рынок и Команда' } },
    { t: { uz: 'Dizayn va Logotip', ru: 'Дизайн и Логотип' }, izoh: { uz: "Ko'rinish odamlar sonini ham, kim qilayotganini ham aytmaydi.", ru: 'Внешний вид не говорит ни о числе людей, ни о том, кто делает.' } },
    { t: { uz: 'Reklama va Narx', ru: 'Реклама и Цена' }, izoh: { uz: "Reklama va narx bu savollarga javob emas: «qancha odam» va «kim» so'ralgan.", ru: 'Реклама и цена — не ответ: спрашивают «сколько людей» и «кто».' } }
  ] },
  { savol: { uz: "Olti bo'lakli pitch 5 daqiqa. Undan keyin nima bo'ladi?", ru: 'Питч из шести частей — 5 минут. Что потом?' }, v: [
    { t: { uz: 'Hakam darhol ball qo\\'yadi', ru: 'Судья сразу ставит балл' }, izoh: { uz: "Ball qo'yishdan oldin investor savol beradi.", ru: 'До оценки инвестор задаёт вопросы.' } },
    { t: { uz: 'Pitch qaytadan aytiladi', ru: 'Питч повторяют заново' }, izoh: { uz: "Pitch bir marta aytiladi — keyin savollar.", ru: 'Питч говорят один раз — потом вопросы.' } },
    { ok: true, t: { uz: 'Savol-javob boshlanadi', ru: 'Начинаются вопросы-ответы' } }
  ] }
];""", 'S2_QAROR')
rep("""  const sahna = <OltiBolakSahna telefon telSon={olti ? 9 : 8} investor={{ savollar, sj: q >= 3 }} bolaklar={bolaklar}""",
    """  const sahna = <OltiBolakSahna investor={{ savollar, sj: q >= 3 }} bolaklar={bolaklar}""", 's2 telefon')
rep("""label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Tugmalarni bosing (${q}/3)`, ru: `Нажмите кнопки (${q}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Investor uchun pitchga <A>nima qo'shiladi?</A></>, ru: <>Что добавляется <A>в питч для инвестора?</A></> })}
        mentor={<Mentor>{tr({ uz: "Tugmalarni birma-bir bosing va pitch qanday o'zgarishiga qarang.", ru: 'Нажимайте кнопки по одной и смотрите, как меняется питч.' })}</Mentor>}""",
    """label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Savollarga javob bering (${q}/3)`, ru: `Ответьте на вопросы (${q}/3)` })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Investor uchun pitchga <A>nima qo'shiladi?</A></>, ru: <>Что добавляется <A>в питч для инвестора?</A></> })}
        mentor={<Mentor>{tr({ uz: "Har savolga javob bering — to'g'ri javobdan keyin pitch o'zgaradi.", ru: 'Ответьте на каждый вопрос — после верного ответа питч меняется.' })}</Mentor>}""", 's2 nav/mentor')
rep("""          <Qadamlar3 nomlar={S2_TUGMA} q={q} faol={!!taxmin} onBos={() => setQ(n => Math.min(3, n + 1))} />
          {q > 0 && <QIzoh key={q}>{tr(S2_IZOH[q - 1])}</QIzoh>}
          {ipucha && IPUCHA(tr({ uz: "Yoqilgan tugmani bosing — pitch qanday o'zgarishini ko'ring.", ru: 'Нажмите активную кнопку — посмотрите, как меняется питч.' }))}""",
    """          <Qaror key={q} savol={S2_QAROR[q].savol} variantlar={S2_QAROR[q].v} onTogri={() => setQ(n => Math.min(3, n + 1))} />
          {ipucha && IPUCHA(tr(IPUCHA_QAROR))}""", 's2 harakat')

rep("""const IPUCHA = (t) => <p className="ip-ipucha fade-step">{t}</p>;""",
    """const IPUCHA = (t) => <p className="ip-ipucha fade-step">{t}</p>;
const IPUCHA_QAROR = { uz: "Variantlardan birini tanlang — xato bo'lsa, sababini o'qib, qayta tanlang.", ru: 'Выберите вариант — если ошиблись, прочитайте причину и выберите снова.' };""", 'ipucha')

# ---------- QISM BOZOR — son bo'yicha qaror; bo'sh uyalar o'rniga to'lgan qatorlar; uchish olinadi
rep("""const S5_IZOH = [""", """// F-1019-03 (213.22): har son uchun qaror — Bozorga yoziladimi
const S5_QAROR = [
  { savol: { uz: 'Bu son Bozorga yoziladimi?', ru: 'Это число пишется в Рынок?' }, v: [
    { ok: true, t: { uz: 'Ha — manbasi bor', ru: 'Да — есть источник' } },
    { t: { uz: "Yo'q — son juda kichik", ru: 'Нет — число слишком маленькое' }, izoh: { uz: "Bozorga bilgan sonimiz yoziladi — kattaligi shart emas.", ru: 'В Рынок пишут известное нам число — размер не важен.' } },
    { t: { uz: "Yo'q — guruh ilova emas", ru: 'Нет — группа не приложение' }, izoh: { uz: "Bozor — mahsulotga muhtoj odamlar; guruhdagi o'yinchilar shular.", ru: 'Рынок — люди, которым нужен продукт; игроки группы — это они.' } }
  ] },
  { savol: { uz: '60 kishi yozildi. 6 tashkilotchi qanday yoziladi?', ru: 'Записали 60 человек. Как записать 6 организаторов?' }, v: [
    { t: { uz: "60 ga qo'shiladi — 66 kishi", ru: 'Прибавить к 60 — 66 человек' }, izoh: { uz: "60 va 6 qo'shilmaydi: biri guruhdagi odamlar, biri ilovadagi tashkilotchilar.", ru: '60 и 6 не складываются: одно — люди в группе, другое — организаторы в приложении.' } },
    { ok: true, t: { uz: 'Alohida yoziladi — ilovada', ru: 'Пишется отдельно — в приложении' } },
    { t: { uz: 'Yozilmaydi — ular sotuvchi', ru: 'Не пишется — они продавцы' }, izoh: { uz: "Tashkilotchilar ham mahsulotdan foydalanadi — ular ilovada sanalgan.", ru: 'Организаторы тоже пользуются продуктом — их посчитали в приложении.' } }
  ] },
  { savol: { uz: "Boshqa mahallalar sonini bilmaymiz. Nima yoziladi?", ru: 'Число по другим махаллям не знаем. Что пишем?' }, v: [
    { t: { uz: 'Taxminan 1000 kishi', ru: 'Примерно 1000 человек' }, izoh: { uz: "Manbasi yo'q son Bozorga yozilmaydi.", ru: 'Число без источника в Рынок не пишут.' } },
    { t: { uz: 'Hech narsa yozilmaydi', ru: 'Ничего не пишем' }, izoh: { uz: "Hakam baribir so'raydi — tekshirilmaganini aytish halol.", ru: 'Судья всё равно спросит — честно сказать, что не проверено.' } },
    { ok: true, t: { uz: 'Hali tekshirilmagan', ru: 'Ещё не проверено' } }
  ] }
];
const S5_IZOH = [""", 'S5_QAROR')
a = s.index("const QismBozor = ({ storedAnswer, onAnswer, onSig }) => {"); b = s.index("// ===== QISM 2 JAMOA")
s = s[:a] + """const QismBozor = ({ storedAnswer, onAnswer, onSig }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(storedAnswer ? 3 : 0);
  const done = n >= 3;
  const tugadi = useTugadi(done, 1100, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done, n);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer({ correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const matn = n === 0 ? null : <>
    <span key="g1" className={cxx(n === 1 && 'ip-yangi-q')}>{tr(BOZOR_SON[0].gap)}</span>
    {n >= 2 && <span key="g2" className={cxx(n === 2 && 'ip-yangi-q')}>{tr(BOZOR_SON[1].gap)}</span>}
    {n >= 3 && <> <span key="g3" className="ip-yangi-q">{tr(BOZOR_SON[2].gap)}</span></>}
  </>;
  // F-1019-03: bo'sh «1 2 3» uyalari yo'q (DE 159) — qaror qabul qilingan son qator bo'lib paydo bo'ladi
  const qatorlar = n > 0 && <div className="ip-bz">
    {BOZOR_SON.slice(0, n).map((s, i) => (
      <div key={s.id} className={cxx('ip-bz-q', s.manba ? 'ok' : 'yoq', i === n - 1 && !storedAnswer && 'yangi')}>
        <b>{tr(s.son)}</b><span className="ip-bz-kim">{tr(s.kim)}</span>
        <em>{s.manba ? <>{tr({ uz: 'manba:', ru: 'источник:' })} {tr(s.manba)}</> : tr({ uz: 'hali tekshirilmagan', ru: 'ещё не проверено' })}</em>
        <i>{s.manba ? '✓' : '?'}</i>
      </div>
    ))}
  </div>;
  const sahna = <OltiBolakSahna fokus="bozor" investor={{ savollar: [{ matn: tr(HAKAM_SAVOL.bozor), ok: n >= 3 }] }}
    bolaklar={fokusOlti('bozor', { nom: tr(BOLAK_NOM.bozor), matn, holat: n >= 3 ? 'ok' : 'joriy', qosh: qatorlar })} ostida={!done && n > 0 && <SahnaIzoh key={'i' + n} t={S5_IZOH[n - 1]} />} />;
  const tx = S5_TAXMIN.find(t => t.k === taxmin);
  useEffect(() => { if (onSig) onSig(); }, [n]); // eslint-disable-line — ota-ekran mobilda pastga suradi
  const sonK = !done && <div className="ip-son"><b>{tr(BOZOR_SON[n].son)}</b><span>{tr(BOZOR_SON[n].kim)}</span>
    <small>{tr({ uz: 'manba:', ru: 'источник:' })} {BOZOR_SON[n].manba ? tr(BOZOR_SON[n].manba) : tr({ uz: "yo'q", ru: 'нет' })}</small></div>;
  return (
    <div className="ip-teskari">
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Bozor bo'lagiga <A>qaysi sonlar yoziladi?</A></>, ru: <>Какие числа <A>пишутся в часть «Рынок»?</A></> })}
        mentor={<Mentor>{tr({ uz: "Har son uchun hal qiling: u Bozor bo'lagiga yoziladimi?", ru: 'Для каждого числа решите: пишется ли оно в часть «Рынок»?' })}</Mentor>}
        bashorat={!done && ixchamBashorat(taxmin, <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: 'Mentor misolida Bozorga qaysi sonlar yoziladi?', ru: 'Какие числа в примере Ментора пишутся в Рынок?' })} variantlar={S5_TAXMIN.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={taxmin} onTanla={setTaxmin} />)}
        harakat={!taxmin ? null : !done && <div className="ip-harakat">
          <Qaror key={n} savol={S5_QAROR[n].savol} variantlar={S5_QAROR[n].v} ichida={sonK} onTogri={() => setN(x => Math.min(3, x + 1))} />
          {ipucha && IPUCHA(tr(IPUCHA_QAROR))}
        </div>}
        vizual={!taxmin ? null : sahna}
        xulosa={done && <XulosaQ taxmin={tx && <TaxminQ togri={taxmin === 'ikki'} aslida={tr({ uz: 'ilova va guruhdagi sonlar', ru: 'числа из приложения и группы' })} />}
          matn={tr({ uz: "Bu misolda Bozorda faqat manbasi bor sonlar turadi, qolgani — «hali tekshirilmagan».", ru: 'В этом примере в Рынке только числа с источником, остальное — «ещё не проверено».' })}
          izoh={tr(S5_IZOH[2])} />}
      />
    </div>
  );
};

""" + s[b:]

# ---------- QISM JAMOA — uch qaror
rep("""const S7_TUGMA = [{ uz: 'Kim nima qildi', ru: 'Кто что сделал' }, { uz: 'Agent', ru: 'Агент' }, { uz: "Sinab ko'rganlar", ru: 'Кто пробовал' }];""",
"""// F-1019-03 (213.22): uch qaror — kim nima qildi · agent kim · sinab ko'rganlar kim
const S7_QAROR = [
  { savol: { uz: 'Mentor mahsulotda nima qildi?', ru: 'Что Ментор сделал в продукте?' }, v: [
    { t: { uz: 'Faqat dizaynni chizdi', ru: 'Только нарисовал дизайн' }, izoh: { uz: "Mentor g'oyani topdi, mahsulotni o'ylab, kodni yozdi.", ru: 'Ментор нашёл идею, продумал продукт и написал код.' } },
    { t: { uz: 'Hech narsa — agent qildi', ru: 'Ничего — сделал агент' }, izoh: { uz: "Talabni Mentor yozdi va natijani o'zi tekshirdi.", ru: 'Требование написал Ментор и сам проверил результат.' } },
    { ok: true, t: { uz: "G'oya, mahsulot va kod", ru: 'Идея, продукт и код' } }
  ] },
  { savol: { uz: 'Agent Jamoa bo\\'lagida kim?', ru: 'Кто агент в части «Команда»?' }, v: [
    { ok: true, t: { uz: "Dastur, a'zo emas", ru: 'Инструмент, не член' } },
    { t: { uz: 'Ikkinchi dasturchi', ru: 'Второй программист' }, izoh: { uz: "Agent — dastur: u talab bo'yicha ishlaydi, jamoa a'zosi emas.", ru: 'Агент — инструмент: работает по требованию, не член команды.' } },
    { t: { uz: 'Jamoa rahbari', ru: 'Руководитель команды' }, izoh: { uz: "Qarorni Mentor qiladi — agent faqat bajaradi.", ru: 'Решения принимает Ментор — агент только выполняет.' } }
  ] },
  { savol: { uz: "6 tashkilotchi ilovani sinab ko'rdi. Ular kim?", ru: '6 организаторов попробовали приложение. Кто они?' }, v: [
    { t: { uz: "Jamoa a'zolari", ru: 'Члены команды' }, izoh: { uz: "Ular ilovani ishlatdi, qurmadi — a'zo emas.", ru: 'Они пользовались приложением, а не строили его.' } },
    { ok: true, t: { uz: "Sinab ko'rganlar", ru: 'Те, кто пробовал' } },
    { t: { uz: 'Investorlar', ru: 'Инвесторы' }, izoh: { uz: "Ular pul tikmagan — ilovani sinab ko'rgan.", ru: 'Они не вкладывали деньги — они пробовали приложение.' } }
  ] }
];""", 'S7_QAROR')
rep("""        mentor={<Mentor>{tr({ uz: "Tugmalarni birma-bir bosing va Jamoa bo'lagi qanday yozilishini ko'ring.", ru: 'Нажимайте кнопки по одной и смотрите, как пишется часть «Команда».' })}</Mentor>}""",
    """        mentor={<Mentor>{tr({ uz: "Har savolga javob bering — Jamoa bo'lagi shunga qarab yoziladi.", ru: 'Ответьте на каждый вопрос — по ответам пишется часть «Команда».' })}</Mentor>}""", 'jamoa mentor')
rep("""          <Qadamlar3 nomlar={S7_TUGMA} q={q} faol={!!taxmin} onBos={() => setQ(x => Math.min(3, x + 1))} />
          {q > 0 && S7_IZOH[q - 1] && <QIzoh key={q}>{tr(S7_IZOH[q - 1])}</QIzoh>}
          {ipucha && IPUCHA(tr({ uz: "Yoqilgan tugmani bosing — Jamoa bo'lagiga nima yozilishini ko'ring.", ru: 'Нажмите активную кнопку — посмотрите, что пишется в часть «Команда».' }))}""",
    """          <Qaror key={q} savol={S7_QAROR[q].savol} variantlar={S7_QAROR[q].v} onTogri={() => setQ(x => Math.min(3, x + 1))} />
          {ipucha && IPUCHA(tr(IPUCHA_QAROR))}""", 'jamoa harakat')

# ---------- QISM KEYINGI QADAM — uch qaror
rep("""const S9_TUGMA = [{ uz: 'Maqsad 50', ru: 'Цель 50' }, { uz: 'Keyingi ish', ru: 'Следующее дело' }, { uz: "Aniq so'rov", ru: 'Точная просьба' }];""",
"""// F-1019-03 (213.22): uch qaror — maqsadga yetildi · keyingi ish · hakamdan so'rov (pul va va'da — tipik xato)
const S9_QAROR = [
  { savol: { uz: "Foydalanuvchilar 51 ga yetdi. «Maqsad 50» nima bo'ladi?", ru: 'Пользователей стало 51. Что с «целью 50»?' }, v: [
    { t: { uz: "O'zgarmaydi, shunday qoladi", ru: 'Не меняется, остаётся' }, izoh: { uz: "Maqsadga yetildi — endi keyingi qadam kerak.", ru: 'Цель достигнута — теперь нужен следующий шаг.' } },
    { t: { uz: "100 ga ko'paytiriladi", ru: 'Увеличивается до 100' }, izoh: { uz: "Kattaroq son emas — keyingi aniq ish kerak.", ru: 'Нужно не большее число, а следующее конкретное дело.' } },
    { ok: true, t: { uz: 'Bajarildi — yangisi kerak', ru: 'Выполнена — нужна новая' } }
  ] },
  { savol: { uz: 'Mentorning keyingi ishi qaysi?', ru: 'Какое следующее дело у Ментора?' }, v: [
    { ok: true, t: { uz: '3 tashkilotchi bilan sinash', ru: 'Проверить с 3 организаторами' } },
    { t: { uz: 'Hamma mahallaga chiqish', ru: 'Выйти во все махалли' }, izoh: { uz: "Bu va'da — keyingi haftada aynan nima qilinadi?", ru: 'Это обещание — что именно сделают на следующей неделе?' } },
    { t: { uz: 'Yangi ilova boshlash', ru: 'Начать новое приложение' }, izoh: { uz: "Keyingi qadam shu mahsulotni davom ettiradi.", ru: 'Следующий шаг продолжает этот же продукт.' } }
  ] },
  { savol: { uz: "Pitch oxirida hakamdan nima so'raysiz?", ru: 'О чём попросите судью в конце питча?' }, v: [
    { t: { uz: 'Investitsiya summasini', ru: 'Сумму инвестиций' }, izoh: { uz: "Bu kursda pul so'ralmaydi — bitta aniq so'rov aytiladi.", ru: 'На этом курсе деньги не просят — называют одну точную просьбу.' } },
    { ok: true, t: { uz: 'Maydon egalari bilan tanishuv', ru: 'Знакомство с владельцами площадок' } },
    { t: { uz: 'Tez orada hamma ishlatishini', ru: 'Чтобы скоро пользовались все' }, izoh: { uz: "Bu va'da, so'rov emas — hakam nima qila oladi?", ru: 'Это обещание, а не просьба — что может сделать судья?' } }
  ] }
];""", 'S9_QAROR')
rep("""        mentor={<Mentor>{tr({ uz: "Tugmalarni birma-bir bosing va Keyingi qadam bo'lagi qanday o'zgarishini ko'ring.", ru: 'Нажимайте кнопки по одной и смотрите, как меняется часть «Следующий шаг».' })}</Mentor>}""",
    """        mentor={<Mentor>{tr({ uz: "Har savolga javob bering — Keyingi qadam bo'lagi shunga qarab o'zgaradi.", ru: 'Ответьте на каждый вопрос — по ответам меняется часть «Следующий шаг».' })}</Mentor>}""", 'keyingi mentor')
rep("""          <Qadamlar3 nomlar={S9_TUGMA} q={q} faol={!!taxmin} onBos={() => setQ(x => Math.min(3, x + 1))} />
          {q > 0 && S9_IZOH[q - 1] && <QIzoh key={q}>{tr(S9_IZOH[q - 1])}</QIzoh>}
          {ipucha && IPUCHA(tr({ uz: "Yoqilgan tugmani bosing — Keyingi qadam qanday o'zgarishini ko'ring.", ru: 'Нажмите активную кнопку — посмотрите, как меняется Следующий шаг.' }))}""",
    """          <Qaror key={q} savol={S9_QAROR[q].savol} variantlar={S9_QAROR[q].v} onTogri={() => setQ(x => Math.min(3, x + 1))} />
          {ipucha && IPUCHA(tr(IPUCHA_QAROR))}""", 'keyingi harakat')

# Screen2 / Jamoa / Keyingi sahnalari — izoh kartaning ichida
rep("""  const sahna = <OltiBolakSahna investor={{ savollar, sj: q >= 3 }} bolaklar={bolaklar}""",
    """  const sahna = <OltiBolakSahna investor={{ savollar, sj: q >= 3 }} bolaklar={bolaklar} ostida={!done && q > 0 && <SahnaIzoh key={'i' + q} t={S2_IZOH[q - 1]} />}""", 's2 izoh')
rep("""    bolaklar={fokusOlti('jamoa', { nom: tr(BOLAK_NOM.jamoa), matn, holat: q >= 3 ? 'ok' : 'joriy', qosh: panel })} ostida={sinab} />;""",
    """    bolaklar={fokusOlti('jamoa', { nom: tr(BOLAK_NOM.jamoa), matn, holat: q >= 3 ? 'ok' : 'joriy', qosh: panel })} ostida={<>{sinab}{!done && q > 0 && S7_IZOH[q - 1] && <SahnaIzoh key={'i' + q} t={S7_IZOH[q - 1]} />}</>} />;""", 'jamoa izoh')
rep("""    bolaklar={fokusOlti('keyingi', { nom: tr(BOLAK_NOM.keyingi), matn: eski, holat: q >= 3 ? 'ok' : 'joriy', qosh: panel })} />;""",
    """    bolaklar={fokusOlti('keyingi', { nom: tr(BOLAK_NOM.keyingi), matn: eski, holat: q >= 3 ? 'ok' : 'joriy', qosh: panel })} ostida={!done && q > 0 && S9_IZOH[q - 1] && <SahnaIzoh key={'i' + q} t={S9_IZOH[q - 1]} />} />;""", 'keyingi izoh')
# Qoralama maydonidagi bo'lak raqami — tepadagi chip raqamining takrori (213.21)
rep("""        <i className="ip-maydon-n">{BOLAK_ID.indexOf(joriy) + 1}</i>\n""", "", 'maydon-n')
rep("textarea.ip-inp { display: block; width: 100%; resize: vertical; min-height: 92px;", "textarea.ip-inp { display: block; width: 100%; resize: vertical; min-height: 92px;", 'inp tekshir')
s = s.replace('padding: 11px 14px 26px 44px;', 'padding: 11px 14px 26px 14px;', 1)  # F-1019-03: maydon raqami olindi — chap chekinish oddiy
# Qadamlar3 endi ishlatilmaydi
a = s.index("// Bosqich tugmalari (ixcham, bir qatorda; joriysi accent halqada, bosilgani ✓)"); b = s.index("const IPUCHA = (t) =>")
s = s[:a] + s[b:]

# ---------- ScreenUch: tepadagi chip-qator olinadi — fokus chiplari yagona ko'rsatkich (213.21); nav sonsiz
rep("""label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : navKeyingi ? `${tr({ uz: "Keyingi bo'lak:", ru: 'Следующая часть:' })} ${tr(BOLAK_NOM[keyingiQism])}` : tr({ uz: `Uch bo'lakni ko'ring (${n}/3)`, ru: `Посмотрите три части (${n}/3)` })}""",
    """label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : navKeyingi ? `${tr({ uz: "Keyingi bo'lak:", ru: 'Следующая часть:' })} ${tr(BOLAK_NOM[keyingiQism])}` : tr({ uz: 'Savollarga javob bering', ru: 'Ответьте на вопросы' })}""", 'uch nav')
rep("""      <div className="ip-uch">
        <div className="ip-strip ip-uch-strip">
          {UCH_ID.map((id, i) => <QChip key={id} holat={joriy === id ? 'on' : qism[id] ? 'ok' : undefined} className="ip-tab" disabled={!qism[id] && joriy !== id} onClick={() => och(id)}><i>{qism[id] ? '✓' : i + 1}</i>{tr(BOLAK_NOM[id])}</QChip>)}
        </div>
        <Qism key={joriy} storedAnswer={qism[joriy]} onAnswer={(d) => setQism(q => ({ ...q, [joriy]: d }))} onSig={() => setSig(x => x + 1)} />
      </div>""",
    """      <UchCtx.Provider value={{ qism, joriy, och }}>
        <div className="ip-uch">
          <Qism key={joriy} storedAnswer={qism[joriy]} onAnswer={(d) => setQism(q => ({ ...q, [joriy]: d }))} onSig={() => setSig(x => x + 1)} />
        </div>
      </UchCtx.Provider>""", 'uch strip')
rep("""  const n = UCH_ID.filter(id => qism[id]).length;
  const done = n === UCH_ID.length;""", """  const done = UCH_ID.every(id => qism[id]);""", 'uch n')

# ---------- Screen11 qoralama: pastki tugmada son yo'q (stepper bor — 213.21)
rep("""tr({ uz: `Olti bo'lakni yozing (${n}/6)`, ru: `Напишите шесть частей (${n}/6)` })""",
    """tr({ uz: "Olti bo'lakni yozing", ru: 'Напишите шесть частей' })""", 's11 nav')

# ---------- CSS: bitta karta (sahna), ichki qatorlar chegarasiz (213.3); Reja chap — bitta karta; qaror qadami
rep("""        .ip-sahna { display: grid; grid-template-columns: 170px minmax(0,1fr); gap: 24px; align-items: start; }""",
    """        .ip-sahna { display: grid; grid-template-columns: 170px minmax(0,1fr); gap: 24px; align-items: start; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 16px; padding: 14px; } /* F-1019-03: sahna — bitta chegarali karta */""", 'css sahna')
rep("""        .ip-ivr { display: flex; align-items: center; gap: 12px; padding: 8px 14px; border-radius: 16px; background: ${T.paper}; border: 2px solid ${T.accent}; box-shadow: 0 12px 28px -16px ${fon(T.accent, 0.6)};""",
    """        .ip-ivr { display: flex; align-items: center; gap: 12px; padding: 0 0 10px; border-radius: 0; background: transparent; border: none; border-bottom: 1px solid ${T.line}; box-shadow: none;""", 'css ivr')
rep("""        .ip-fk-chip { font-size: 12.5px; font-weight: 800; color: ${T.ink2}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 8px; padding: 3px 11px; white-space: nowrap; }
        .ip-fk-chip.on { color: ${T.accent}; border-color: ${T.accent}; background: ${T.accentSoft}; }""",
    """        .ip-fk-chip { font-family: inherit; font-size: 12.5px; font-weight: 800; color: ${T.ink2}; background: ${T.bg}; border: none; border-radius: 8px; padding: 4px 11px; white-space: nowrap; }
        .ip-fk-chip.on { color: ${T.accent}; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .ip-fk-chip.xira { opacity: .45; }
        .ip-fk-chip.bos { cursor: pointer; }
        .ip-fk-chip.bos:disabled { cursor: default; opacity: .45; }
        .ip-fk-chip.ok { color: ${T.ok}; background: ${T.okFon}; }
        .ip-fk-chip i { font-style: normal; margin-right: 5px; }""", 'css fk')
rep("""        .ip-bolak { background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 11px;""",
    """        .ip-bolak { background: ${T.bg}; border: 1.5px solid transparent; border-radius: 11px;""", 'css bolak')
rep("""        .ip-bolak.bosh { border-style: solid; background: transparent; }""",
    """        .ip-bolak.bosh { background: transparent; box-shadow: inset 0 0 0 1px ${T.line}; }""", 'css bolak bosh')
rep("""        .ip-bolak.joriy { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.12)}; }
        .ip-bolak.ok { border-color: ${T.ok}; background: ${T.okFon}; }
        .ip-bolak.yangi { border-color: ${T.accent}; animation: ip-sirg .55s ease-out both; }""",
    """        .ip-bolak.joriy { background: ${fon(T.accent, 0.08)}; }
        .ip-bolak.ok { background: ${T.okFon}; }
        .ip-bolak.yangi { background: ${fon(T.accent, 0.1)}; animation: ip-sirg .55s ease-out both; }""", 'css bolak holat')
rep("""        .ip-bz-q.ok { border-style: solid; border-color: ${T.ok}; background: ${T.okFon}; }""",
    """        .ip-bz-q.ok { background: ${T.paper}; }""", 'css bz ok')
rep("""        .ip-bz-q.yoq { border-style: solid; border-color: ${T.ink2}; background: ${T.paper}; }""",
    """        .ip-bz-q.yoq { background: ${T.paper}; }""", 'css bz yoq')
rep("""        .ip-reja { display: flex; flex-direction: column; gap: 12px; }""",
    """        .ip-reja { display: flex; flex-direction: column; gap: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 16px; padding: 14px; } /* F-1019-03: bitta karta */""", 'css reja')
rep("""        .ip-skelet-b { padding: 7px 12px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper};""",
    """        .ip-skelet-b { padding: 6px 12px; border-radius: 9px; border: none; background: ${T.bg};""", 'css skelet')
rep("""        .ip-son { position: relative; text-align: left;""", """        .ip-qr { display: flex; flex-direction: column; gap: 10px; width: 100%; }
        .ip-qr-s { margin: 0; font-size: 15px; font-weight: 800; line-height: 1.4; color: ${T.ink}; }
        .ip-qr-v { display: flex; flex-wrap: wrap; gap: 8px; }
        .ip-qr .ip-son { cursor: default; border: none; box-shadow: none; background: ${T.bg}; }
        .ip-sahna-iz { margin: 0; padding-top: 8px; border-top: 1px solid ${T.line}; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        .ip-son { position: relative; text-align: left;""", 'css qaror')

# ---------- o'lik CSS (keyframes olib tashlanmaydi — F-1018-10)
def dead_classes(src):
    css = src[src.index('<style>{`'):src.index('`}</style>')]
    jsx = src[:src.index('<style>{`')] + src[src.index('`}</style>'):]
    cls = set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", css))
    return {c for c in cls if not re.search(r"['\"` ]" + re.escape(c) + r"['\"` -]|className=\{`[^`]*\b" + re.escape(c) + r"\b|cxx?\([^)]*['\"]" + re.escape(c) + r"['\"]", jsx)}
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
s = s[:ca] + '\n'.join(out) + s[cb:]
# 2-o'tish: birikma selektorli qoldiqlar (ip-son endi faqat ko'rsatish kartasi — cur/jo/tushdi/silk/disabled yo'q)
for pat in [r"\n[ \t]*\.ip-qadamlar \.q-chip[^\n]*", r"\n[ \t]*\.ip-son\.(jo|cur|tushdi|silk)\b[^\n]*", r"\n[ \t]*\.ip-son:disabled[^\n]*", r"\n[ \t]*\.ip-uchar\.yoq[^\n]*"]:
    s, c = re.subn(pat, '', s); removed += c
s = s.replace(", .ip-qadamlar .q-chip,", ",")
print(f"  o'lik CSS: {len(DEAD)} klass {sorted(DEAD)}, {removed} qator; qolgan: {sorted(dead_classes(s) - d0)}")
open(DST, 'w', encoding='utf8').write(s)
print('✅ yozildi', DST, s.count('\n') + 1, 'qator')
