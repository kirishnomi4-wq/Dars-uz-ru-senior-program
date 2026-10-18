// ===== F-1015-351: 21 → 8 ekran. Sikl: ko'rsat → fikr yig'ish (haqiqiy sinfdosh) → saralash (doska) → upgrade (Gemini) =====
const PromptBlok = ({ matn }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => { try { await navigator.clipboard.writeText(matn); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — ustoz ko'rsatadi */ } };
  return (
    <div className="am-karta fade-up delay-2">
      <div className="am-prompt-h"><p className="flow-label">{tr({ uz: 'Prompt', ru: 'Промпт' })}</p><button type="button" className="am-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Promptni nusxalash', ru: 'Скопировать промпт' })}</button></div>
      <pre className="am-masalan">{matn}</pre>
    </div>
  );
};
const QadamTugma = ({ b }) => {
  const [ochiq, setOchiq] = useState(false);
  return (
    <div className={`am-karta am-qt ${ochiq ? 'on' : ''}`}>
      <button type="button" className="am-qt-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>
        <span>{tr({ uz: 'Qadamlar', ru: 'Шаги' })} · {b.length}</span><span className="am-qt-ic" aria-hidden="true">▾</span>
      </button>
      {ochiq && <ol className="am-qadam am-ochil">{b.map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr(x))}</span></li>)}</ol>}
    </div>
  );
};
const TAYYOR = [
  { uz: "O'tgan darsdagi AvtoStoyanka ishlab tursin: `node server.js` (:3000) va `npm run dev` (:5173).", ru: 'Пусть AvtoStoyanka с прошлого урока работает: `node server.js` (:3000) и `npm run dev` (:5173).' },
  { uz: "Yoningizdagi sinfdosh bilan juft bo'ling — bir-biringizning panelini sinaysiz.", ru: 'Объединитесь в пару с соседом — будете проверять панели друг друга.' },
  { uz: "Boshqa oynada gemini.google.com'ni oching.", ru: 'В другом окне откройте gemini.google.com.' }
];
const TayyorTugma = () => {
  const [ochiq, setOchiq] = useState(false);
  const [korgan, setKorgan] = useState(false);
  return (
    <div className="fade-up delay-1"><div className={`am-tayyor am-tt ${ochiq ? 'on' : ''} ${korgan ? '' : 'am-tt-nafas'}`}>
      <button type="button" className="am-tt-btn" aria-expanded={ochiq} onClick={() => { setOchiq(o => !o); setKorgan(true); }}>
        <span className="am-tayyor-h">{tr({ uz: 'Avval tayyorlaning', ru: 'Сначала подготовьтесь' })} · {tr({ uz: `${TAYYOR.length} qadam`, ru: `${TAYYOR.length} шага` })}</span>
        <span className="am-qt-ic" aria-hidden="true">▾</span>
      </button>
      {ochiq && <div className="am-tt-ich am-ochil">
        <ol className="am-tayyor-l">{TAYYOR.map((x, i) => <li key={i}><span className="am-tayyor-n">{i + 1}</span><span>{fmtCode(tr(x))}</span></li>)}</ol>
        <p className="am-tayyor-s">{tr({ uz: "Tayyor bo'lsa — «Boshlaymiz».", ru: 'Готово — «Начинаем».' })}</p>
      </div>}
    </div></div>
  );
};
// Kod oynasi: oxirgi amal (setGames…) va ro'yxatning hozirgi holati
const KodOyna = ({ oxirgi, qatorlar }) => (
  <div className="rj-oyna">
    <div className="rj-bar"><span className="bb-dots"><i /><i /><i /></span><span className="rj-fayl">avto-stoyanka · {tr({ uz: 'oxirgi amal', ru: 'последнее действие' })}</span></div>
    <div className="rj-body">
      <div className="sk-izoh">// {tr({ uz: 'oxirgi amal', ru: 'последнее действие' })}</div>
      <div key={oxirgi} className="rj-li sk-nur">{oxirgi || '—'}</div>
      <div className="sk-izoh">// {tr({ uz: 'hozir', ru: 'сейчас' })}</div>
      {qatorlar.map((q, i) => <div key={i} className="rj-li">{q}</div>)}
    </div>
  </div>
);
const FIKR_KEY = 'ccStoyankaFikr';
const fikrOqi = () => { try { const v = JSON.parse(localStorage.getItem(FIKR_KEY) || 'null'); return Array.isArray(v) && v.length === 3 ? v.map(x => ({ t: String((x && x.t) || ''), aniq: x && x.aniq === true ? true : x && x.aniq === false ? false : null })) : null; } catch { return null; } };
const fikrYoz = (v) => { try { localStorage.setItem(FIKR_KEY, JSON.stringify(v)); } catch { /* saqlab bo'lmadi */ } };
const SIKL = [{ uz: "Ko'rsat", ru: 'Покажи' }, { uz: 'Fikr ol', ru: 'Получи отзыв' }, { uz: 'Sarala', ru: 'Отбери' }, { uz: 'Yaxshila', ru: 'Улучши' }, { uz: 'Qayta sina', ru: 'Проверь снова' }];
const BLOK3 = [
  { t: { uz: "Fikr yig'ish", ru: 'Сбор отзывов' }, tag: { uz: 'sinfdosh', ru: 'одноклассник' } },
  { t: { uz: 'Saralash: foyda va mehnat', ru: 'Отбор: польза и усилия' }, tag: { uz: "o'zingiz", ru: 'сами' } },
  { t: { uz: 'Upgrade', ru: 'Апгрейд' }, tag: 'Gemini' }
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.4vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Ko'rsating, fikr oling, <span className="italic" style={{ color: T.accent }}>yaxshilang</span>.</>, ru: <>Покажите, получите отзыв, <span className="italic" style={{ color: T.accent }}>улучшите</span>.</> })}</h2></div>
      <Mentor>{tr({ uz: <>Biz o'z ishimizga juda yaqinmiz — kamchilikni ko'pincha boshqa odam topadi. Bugun panelingizni <b style={{ color: T.ink }}>haqiqiy sinfdoshingizga</b> beradi, uning fikrini yozasiz, eng muhimini tanlaysiz va Gemini bilan yaxshilaysiz.</>, ru: <>Мы слишком близко к своей работе — недочёт часто находит другой человек. Сегодня отдадите панель <b style={{ color: T.ink }}>настоящему однокласснику</b>, запишете его отзыв, выберете главное и улучшите с Gemini.</> })}</Mentor>
      <TayyorTugma />
      <Split>
        <Col>
          <p className="flow-label">{tr({ uz: 'Dars oxirida · yangilangan panel', ru: 'К концу урока · обновлённая панель' })}</p>
          <GuardPanel spots={mkSpots()} tushum={30000} dash />
        </Col>
        <Col>
          <p className="flow-label am-yorliq-joy" aria-hidden="true">{tr({ uz: 'Dars oxirida · yangilangan panel', ru: 'К концу урока · обновлённая панель' })}</p>
          <div className="am-karta am-reja-k fade-up delay-1">
            <p className="flow-label">{tr({ uz: 'Yaxshilash sikli', ru: 'Цикл улучшения' })}</p>
            <div className="bk-zanjir">{SIKL.map((z, i) => <React.Fragment key={i}><code className="qcode">{tr(z)}</code>{i < SIKL.length - 1 && <span aria-hidden="true">→</span>}</React.Fragment>)}</div>
            <hr className="am-chiziq" />
            <p className="flow-label">{tr({ uz: `Bugungi ${BLOK3.length} blok`, ru: `${BLOK3.length} блока сегодня` })}</p>
            <ol className="am-blok-qator">{BLOK3.map((b, i) => <li key={i}><span className="am-blok-n">{String(i + 1).padStart(2, '0')}</span><b>{tr(b.t)}</b><span className="am-blok-teg">{tr(b.tag)}</span></li>)}</ol>
          </div>
        </Col>
      </Split>
    </div>
  </Stage>
);

// ===== a1 — haqiqiy sinfdoshdan fikr yig'ish: 3 fikr, har biri «aniq» yoki «umumiy» =====
const SAVOL = [
  { uz: 'Qayerda qiynaldingiz yoki adashdingiz?', ru: 'Где Вы запутались или застряли?' },
  { uz: "Nima yetishmadi — nimani ko'rmoqchi edingiz?", ru: 'Чего не хватило — что хотели увидеть?' },
  { uz: 'Qaysi tugma yoki yozuv tushunarsiz?', ru: 'Какая кнопка или надпись непонятна?' }
];
const ScreenFikr = ({ screen, onNext, onPrev }) => {
  const [rows, setRows] = useState(() => fikrOqi() || [{ t: '', aniq: null }, { t: '', aniq: null }, { t: '', aniq: null }]);
  useEffect(() => { fikrYoz(rows); }, [rows]);
  const set = (i, patch) => setRows(r => r.map((x, k) => (k === i ? { ...x, ...patch } : x)));
  const aniqlar = rows.filter(x => x.t.trim() && x.aniq === true).length;
  const umumiy = rows.filter(x => x.t.trim() && x.aniq === false).length;
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 1 · sinfdosh bilan', ru: 'Практика 1 · с одноклассником' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sinfdoshingizdan <span className="italic" style={{ color: T.accent }}>fikr</span> yig'ing.</>, ru: <>Соберите <span className="italic" style={{ color: T.accent }}>отзыв</span> одноклассника.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Panelingizni sinfdoshingizga bering — 2 daqiqa qorovul bo'lib ishlatsin, siz jim kuzating. Keyin uchta savol bering va javobini yozing. «Zo'r ekan» — yoqimli, lekin <b style={{ color: T.ink }}>aniq fikr</b> nima qilishni aytadi.</>, ru: <>Отдайте панель однокласснику — пусть 2 минуты поработает охранником, а Вы молча наблюдайте. Потом задайте три вопроса и запишите ответ. «Классно» — приятно, но <b style={{ color: T.ink }}>точный отзыв</b> говорит, что делать.</> })}</Mentor>
        <Split>
          <Col>
            <div className="am-karta">
              <p className="flow-label">{tr({ uz: '3 ta savol', ru: '3 вопроса' })}</p>
              <ol className="am-qadam">{SAVOL.map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{tr(x)}</span></li>)}</ol>
            </div>
            <div className="am-karta">
              <p className="flow-label">{tr({ uz: 'Aniq yoki umumiy?', ru: 'Точный или общий?' })}</p>
              <ul className="cr-jadval">
                <li><b>✓</b><span>{tr({ uz: "«Chiqarganda so'ramadi — adashib bosdim»", ru: '«При выезде не спросило — нажал по ошибке»' })}</span></li>
                <li><b>✗</b><span>{tr({ uz: "«Zo'r ekan», «Yomon»", ru: '«Классно», «Плохо»' })}</span></li>
              </ul>
            </div>
          </Col>
          <Col>
            {rows.map((r, i) => (
              <div key={i} className="am-karta">
                <label className="am-maydon"><span>{tr({ uz: `${i + 1}-fikr`, ru: `Отзыв ${i + 1}` })}</span><input className="am-input" value={r.t} onChange={e => set(i, { t: e.target.value })} placeholder={tr({ uz: 'Sinfdosh nima dedi?', ru: 'Что сказал одноклассник?' })} /></label>
                {r.t.trim() && <div className="am-chips"><button type="button" className={`am-chip ${r.aniq === true ? 'on' : ''}`} aria-pressed={r.aniq === true} onClick={() => set(i, { aniq: true })}>{tr({ uz: '✓ Aniq', ru: '✓ Точный' })}</button><button type="button" className={`am-chip ${r.aniq === false ? 'on' : ''}`} aria-pressed={r.aniq === false} onClick={() => set(i, { aniq: false })}>{tr({ uz: '✗ Umumiy', ru: '✗ Общий' })}</button></div>}
                {r.aniq === false && <p className="am-satr">{tr({ uz: "Qayta so'rang: «Nima qilsa yaxshi bo'ladi?» — javobni shu yerga yozing.", ru: 'Переспросите: «Что сделать, чтобы стало лучше?» — запишите ответ сюда.' })}</p>}
              </div>
            ))}
            {(aniqlar > 0 || umumiy > 0) && <p className="ql-xabar info" role="status">{tr({ uz: `Aniq fikrlar: ${aniqlar} — ular keyingi qadamlarda promptga qo'shiladi.`, ru: `Точных отзывов: ${aniqlar} — они попадут в промпт на следующих шагах.` })}</p>}
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== a3 — Gemini: upgrade (tasdiq, dashboard, narx sozlamasi) + sinfdosh fikrlari promptda =====
const a3Prompt = (fikrlar) => tr({
  uz: `AvtoStoyanka panelimni (React, avto-stoyanka) sinfdoshlar fikri bo'yicha yaxshila. Faqat shu o'zgarishlarni qil, qolganiga tegma:\n1. Chiqarishdan oldin confirm("Rostdan chiqarilsinmi?") — «Bekor qilish» bosilsa hech narsa o'zgarmasin.\n2. Tepada dashboard: bo'sh joylar, band joylar va bugungi tushum — yirik raqamlar bilan.\n3. Narx sozlamasi: qorovul narxni o'zgartira olsin. Serverga (avto-stoyanka-server) sozlamalar jadvali (narx INTEGER) va GET/PUT /api/narx qo'sh; chiqishda tolov shu narxdan olinsin.${fikrlar.length ? `\nSinfdoshlarim yana shuni aytdi:\n${fikrlar.map(f => `- ${f}`).join('\n')}` : ''}\nHar o'zgarishga qisqa izoh yoz. O'zgargan fayllarni to'liq qaytar.\nMana kodim:\n{panel fayllari va server.js kodini shu yerga qo'ying}`,
  ru: `Улучши мою панель AvtoStoyanka (React, avto-stoyanka) по отзывам одноклассников. Делай только эти изменения, остальное не трогай:\n1. Перед выпуском — confirm("Точно выпустить?"); при «Отмена» ничего не меняется.\n2. Вверху дашборд: свободные места, занятые места и выручка за сегодня — крупными цифрами.\n3. Настройка цены: охранник может менять цену. Добавь на сервер (avto-stoyanka-server) таблицу sozlamalar (narx INTEGER) и GET/PUT /api/narx; оплата при выезде берётся из этой цены.${fikrlar.length ? `\nОдноклассники ещё сказали:\n${fikrlar.map(f => `- ${f}`).join('\n')}` : ''}\nК каждому изменению — короткий комментарий. Измененные файлы верни целиком.\nВот мой код:\n{вставьте сюда код файлов панели и server.js}`
});
const UPG = [
  { id: 'tasdiq', t: { uz: 'Tasdiq', ru: 'Подтверждение' } },
  { id: 'dash', t: { uz: 'Dashboard', ru: 'Дашборд' } },
  { id: 'narx', t: { uz: 'Narx sozlamasi', ru: 'Настройка цены' } }
];
const A3_QADAM = [
  { uz: "Chapda upgrade'larni yoqib, panelni sinab ko'ring.", ru: 'Слева включите апгрейды и проверьте панель.' },
  { uz: "«Promptni nusxalash» — unda sinfdoshingizning aniq fikrlari ham bor → gemini.google.com, oxiriga kodni qo'shing.", ru: '«Скопировать промпт» — в нём есть и точные отзывы одноклассника → gemini.google.com, в конце добавьте код.' },
  { uz: "Fayllarni almashtiring, serverni qayta ishga tushiring (`node server.js`), `Ctrl+S`.", ru: 'Замените файлы, перезапустите сервер (`node server.js`), `Ctrl+S`.' },
  { uz: "Panelni o'sha sinfdoshga qayta bering — endi qulaymi? Bu — siklning oxirgi qadami.", ru: 'Снова дайте панель тому же однокласснику — теперь удобно? Это последний шаг цикла.' }
];
const ScreenUpgrade = ({ screen, onNext, onPrev }) => {
  const fikrlar = useMemo(() => (fikrOqi() || []).filter(x => x.t.trim() && x.aniq === true).map(x => x.t.trim()), []);
  const [on, setOn] = useState(() => new Set(['tasdiq', 'dash']));
  const [spots, setSpots] = useState(() => mkSpots());
  const [tushum, setTushum] = useState(20000);
  const [narx, setNarx] = useState(10000);
  const [sorov, setSorov] = useState(null);
  const [oxirgi, setOxirgi] = useState('');
  const almash = (id) => setOn(o => { const n = new Set(o); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const chiqar = (x) => { setSpots(a => a.map(z => (z.id === x.id ? { ...z, bandmi: false, mashina: null } : z))); setTushum(t => t + narx); setSorov(null); setOxirgi(`PUT /api/chiqish/${x.id}  // tolov = ${narx}`); };
  const bos = (x) => {
    if (!x.bandmi) { setSpots(a => a.map(z => (z.id === x.id ? { ...z, bandmi: true, mashina: '01A777AA' } : z))); setOxirgi(`POST /api/kirish  // joy_id = ${x.id}`); return; }
    if (on.has('tasdiq')) { setSorov(x); setOxirgi('confirm("Rostdan chiqarilsinmi?")'); } else chiqar(x);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 3 · Gemini', ru: 'Практика 3 · Gemini' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Panelni <span className="italic" style={{ color: T.accent }}>yaxshilang</span>.</>, ru: <><span className="italic" style={{ color: T.accent }}>Улучшите</span> панель.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Saralashdan keyin uchta upgrade qoldi: <b style={{ color: T.ink }}>chiqishda tasdiq, dashboard va narx sozlamasi</b>. Ularni yoqib-o'chirib, farqni ko'ring. Prompt sinfdoshingizning aniq fikrlarini ham o'z ichiga oladi.</>, ru: <>После отбора остались три апгрейда: <b style={{ color: T.ink }}>подтверждение при выезде, дашборд и настройка цены</b>. Включайте и выключайте их, смотрите разницу. Промпт включает и точные отзывы одноклассника.</> })}</Mentor>
        <Split>
          <Col>
            <div className="am-chips">{UPG.map(u => <button key={u.id} type="button" className={`am-chip ${on.has(u.id) ? 'on' : ''}`} aria-pressed={on.has(u.id)} onClick={() => almash(u.id)}>{on.has(u.id) ? '✓ ' : '+ '}{tr(u.t)}</button>)}</div>
            <GuardPanel spots={spots} onSpotClick={bos} tushum={tushum} dash={on.has('dash')} />
            {sorov && <div className="am-karta fs-forma am-ochil"><p className="am-satr" style={{ flex: 1 }}>{tr({ uz: `Rostdan chiqarilsinmi? ${sorov.raqam} · ${sorov.mashina}`, ru: `Точно выпустить? ${sorov.raqam} · ${sorov.mashina}` })}</p><button type="button" className="am-nusxa" onClick={() => { setSorov(null); setOxirgi('// bekor qilindi — hech narsa o\'zgarmadi'); }}>{tr({ uz: 'Bekor qilish', ru: 'Отмена' })}</button><button type="button" className="am-saqla" onClick={() => chiqar(sorov)}>OK</button></div>}
            {on.has('narx') && <div className="am-karta fs-forma"><label className="am-maydon"><span>{tr({ uz: "Narx, so'm", ru: 'Цена, сум' })}</span><input className="am-input" value={narx} inputMode="numeric" onChange={e => { const v = parseInt(e.target.value.replace(/\D/g, ''), 10) || 0; setNarx(v); setOxirgi(`PUT /api/narx  // narx = ${v}`); }} /></label></div>}
            <KodOyna oxirgi={oxirgi} qatorlar={[<span key="t" className="sk-izoh">{`// tushum = ${tushum}`}</span>]} />
          </Col>
          <Col>
            <PromptBlok matn={a3Prompt(fikrlar)} />
            {!fikrlar.length && <p className="am-satr">{tr({ uz: "1-amaliyotda «aniq» deb belgilangan fikrlar promptga shu yerda qo'shiladi.", ru: 'Отзывы, отмеченные «точными» в 1-й практике, добавятся в промпт здесь.' })}</p>}
            <QadamTugma b={A3_QADAM} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};
