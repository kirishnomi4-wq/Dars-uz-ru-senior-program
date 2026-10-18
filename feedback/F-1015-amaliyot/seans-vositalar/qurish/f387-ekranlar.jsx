// ===== F-1015-387 (17.10, foydalanuvchi «maqul qil»): a3 ikkiga — maydonlar va 3 holat · qo'shish formasi. Har birida bitta ish =====
const Tekshir = ({ b }) => (
  <div className="am-karta">
    <p className="flow-label">{tr({ uz: 'Tekshiring', ru: 'Проверьте' })}</p>
    <ul className="am-band">{b.map((x, i) => <li key={i}>{fmtCode(tr(x))}</li>)}</ul>
  </div>
);
// ----- a3 · Maydonlar va holatlar -----
const a3Prompt = () => tr({
  uz: `AvtoIjara saytimni (React, avto-ijara) server ma'lumotiga moslashtir. Server ${API} mashinalarni { id, nom, narx, yil } ko'rinishida qaytaradi (cars.json'dagi name/price emas).\n1. Kartochkalar va mashina sahifasi shu maydonlarni ko'rsatsin: nom, narx (so'm/kun), yil.\n2. Uch holat: yuklanayotganda «Yuklanmoqda...», server javob bermasa «Ma'lumotni yuklab bo'lmadi», aks holda ro'yxat.\nHar bo'limga qisqa izoh yoz. O'zgargan fayllarni to'liq qaytar.\nMana kodim:\n{Home.jsx va mashina sahifasi kodini shu yerga qo'ying}`,
  ru: `Подстрой мой сайт AvtoIjara (React, avto-ijara) под данные сервера. Сервер ${API} возвращает машины в виде { id, nom, narx, yil } (не name/price, как в cars.json).\n1. Карточки и страница машины показывают эти поля: nom, narx (сум/день), yil.\n2. Три состояния: во время загрузки «Загрузка...», если сервер не отвечает — «Не удалось загрузить данные», иначе — список.\nК каждому разделу — короткий комментарий. Изменённые файлы верни целиком.\nВот мой код:\n{вставьте сюда код Home.jsx и страницы машины}`
});
const A3_QADAM = [
  { uz: "Chapda holatlarni almashtiring — kod oynasida qaysi qator ishlashini ko'ring.", ru: 'Слева переключайте состояния — в окне кода видно, какая строка срабатывает.' },
  { uz: "«Promptni nusxalash» → gemini.google.com, oxiriga `Home.jsx` va mashina sahifasi kodini qo'shing.", ru: '«Скопировать промпт» → gemini.google.com, в конце добавьте код `Home.jsx` и страницы машины.' },
  { uz: "Javobdagi fayllarni almashtiring, `Ctrl+S`.", ru: 'Замените файлы на файлы из ответа, `Ctrl+S`.' },
  { uz: "«Tekshiring» ro'yxatini o'ting.", ru: 'Пройдите список «Проверьте».' }
];
const A3_TEKSHIR = [
  { uz: "Kartochkalarda nom, narx va yil ko'rinadimi (undefined emas)?", ru: 'На карточках видны nom, narx и yil (не undefined)?' },
  { uz: "Serverni to'xtatib (Ctrl+C) saytni yangilang — «yuklab bo'lmadi» chiqadimi?", ru: 'Остановите сервер (Ctrl+C) и обновите сайт — появляется «не удалось загрузить»?' }
];
const HOLAT_KOD = { loading: 'setYuklanmoqda(true);', error: 'setXato("Ma\'lumotni yuklab bo\'lmadi");', data: 'setCars(data);' };
const ScreenHolat = ({ screen, onNext, onPrev }) => {
  const [holat, setHolatS] = useState('data');
  const [oxirgi, setOxirgi] = useState(`fetch('${API}')`);
  const [nur, setNur] = useState(0);
  const setHolat = (k) => { setHolatS(k); setOxirgi(HOLAT_KOD[k]); setNur(n => n + 1); };
  const c = CARS_DB[0];
  return (
    <Stage mentorYigil eyebrow={tr({ uz: 'Amaliyot 3 · Gemini', ru: 'Практика 3 · Gemini' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Maydonlar va <span className="italic" style={{ color: T.accent }}>holatlar</span>.</>, ru: <>Поля и <span className="italic" style={{ color: T.accent }}>состояния</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Ulandi — lekin server mashinani <span className="mono">nom, narx, yil</span> deb qaytaradi, sayt esa <span className="mono">name, price</span> ni kutadi: kartochkalarda «undefined» chiqadi. Gemini maydonlarni moslaydi va uch holatni qo'shadi.</>, ru: <>Подключено — но сервер отдаёт машину как <span className="mono">nom, narx, yil</span>, а сайт ждёт <span className="mono">name, price</span>: на карточках появится «undefined». Gemini согласует поля и добавит три состояния.</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "Natija · holatni tanlang", ru: 'Результат · выберите состояние' })}</p>
            <div className="am-chips">{[['loading', { uz: 'Yuklanmoqda', ru: 'Загрузка' }], ['error', { uz: 'Xato', ru: 'Ошибка' }], ['data', { uz: 'Tayyor', ru: 'Готово' }]].map(([k, t]) => <button key={k} type="button" className={`am-chip ${holat === k ? 'on' : ''}`} aria-pressed={holat === k} onClick={() => setHolat(k)}>{tr(t)}</button>)}</div>
            <AvtoSite cars={CARS_DB} state={holat} cols={2} />
            <Tekshir b={A3_TEKSHIR} />
          </Col>
          <Col>
            <PromptKarta matn={a3Prompt()} />
            <QadamTugma b={A3_QADAM} />
            <KodOyna oxirgi={oxirgi} nur={nur} qatorlar={[<span key="c">cars[0] = {`{ nom: "${c.nom}", narx: ${c.narx}, yil: ${c.yil} }`};</span>, <span key="n" className="sk-izoh">// cars.length = {holat === 'data' ? CARS_DB.length : 0}</span>]} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};
// ----- a4 · Qo'shish formasi (POST) -----
const a4Prompt = () => tr({
  uz: `AvtoIjara saytimga qo'shish formasini qo'sh (kodim pastda):\nBosh sahifada forma: nom, narx, yil. «Qo'shish» bosilganda POST ${API} ga JSON yuborsin (Content-Type: application/json), keyin ro'yxatni qayta fetch qilsin.\nHar bo'limga qisqa izoh yoz. O'zgargan faylni to'liq qaytar.\nMana kodim:\n{Home.jsx kodini shu yerga qo'ying}`,
  ru: `Добавь в мой сайт AvtoIjara форму добавления (код ниже):\nНа главной — форма: nom, narx, yil. По нажатию «Добавить» отправляет JSON на POST ${API} (Content-Type: application/json), потом заново делает fetch списка.\nК каждому разделу — короткий комментарий. Изменённый файл верни целиком.\nВот мой код:\n{вставьте сюда код Home.jsx}`
});
const A4_QADAM = [
  { uz: "Chapda forma bilan mashina qo'shing — kod oynasida POST so'rovini ko'ring.", ru: 'Слева добавьте машину формой — в окне кода видно POST-запрос.' },
  { uz: "«Promptni nusxalash» → gemini.google.com, oxiriga `Home.jsx` kodini qo'shing.", ru: '«Скопировать промпт» → gemini.google.com, в конце добавьте код `Home.jsx`.' },
  { uz: "Javobdagi faylni almashtiring, `Ctrl+S`.", ru: 'Замените файл на файл из ответа, `Ctrl+S`.' },
  { uz: "«Tekshiring» ro'yxatini o'ting.", ru: 'Пройдите список «Проверьте».' }
];
const A4_TEKSHIR = [
  { uz: "Forma bilan qo'shilgan mashina F5 dan keyin ham turibdimi?", ru: 'Машина, добавленная формой, остаётся после F5?' },
  { uz: "psql'da `SELECT * FROM cars;` — yangi qator bormi?", ru: 'В psql `SELECT * FROM cars;` — новая строка есть?' }
];
const ScreenForma = ({ screen, onNext, onPrev }) => {
  const [rows, setRows] = useState(CARS_DB);
  const [nom, setNom] = useState('');
  const [narx, setNarx] = useState('');
  const [oxirgi, setOxirgi] = useState(`fetch('${API}')`);
  const [nur, setNur] = useState(0);
  const [yangi, setYangi] = useState(null);
  const ok = nom.trim() && /^\d+$/.test(narx.trim());
  const qosh = () => { if (!ok) return; const id = Math.max(...rows.map(r => r.id)) + 1; const c = { ...TRACKER, id, nom: nom.trim(), narx: Number(narx.trim()), yil: 2024 }; setRows(r => [...r, c]); setYangi(id); setOxirgi(`fetch('${API}', { method: 'POST', body: JSON.stringify({ nom: "${c.nom}", narx: ${c.narx}, yil: ${c.yil} }) })`); setNur(n => n + 1); setNom(''); setNarx(''); };
  return (
    <Stage mentorYigil eyebrow={tr({ uz: 'Amaliyot 4 · Gemini', ru: 'Практика 4 · Gemini' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Saytdan turib <span className="italic" style={{ color: T.accent }}>qo'shish</span>.</>, ru: <><span className="italic" style={{ color: T.accent }}>Добавление</span> прямо с сайта.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Forma mashinani <span className="mono">POST</span> bilan serverga yuboradi, server bazaga yozadi, sayt esa ro'yxatni qayta oladi — yangi mashina darrov chiqadi.</>, ru: <>Форма отправляет машину на сервер через <span className="mono">POST</span>, сервер записывает в базу, а сайт заново получает список — новая машина появляется сразу.</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "Natija · mashina qo'shing", ru: 'Результат · добавьте машину' })}</p>
            <AvtoSite cars={rows} newId={yangi} cols={2} />
            <div className="am-karta fs-forma">
              <label className="am-maydon"><span>nom</span><input className="am-input" value={nom} onChange={e => setNom(e.target.value)} placeholder="Chevrolet Tracker" /></label>
              <label className="am-maydon"><span>narx</span><input className="am-input" value={narx} onChange={e => setNarx(e.target.value)} placeholder="450000" inputMode="numeric" /></label>
              <button type="button" className="am-saqla" disabled={!ok} onClick={qosh}>{tr({ uz: "Qo'shish", ru: 'Добавить' })}</button>
            </div>
            <Tekshir b={A4_TEKSHIR} />
          </Col>
          <Col>
            <PromptKarta matn={a4Prompt()} />
            <QadamTugma b={A4_QADAM} />
            <KodOyna oxirgi={oxirgi} nur={nur} qatorlar={[<span key="n" className="sk-izoh">// cars.length = {rows.length}</span>]} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};
