// ===== F-1015-347: 20 → 9 ekran. Yetkaz: bo'laklash (AI'siz) → aniq prompt (Gemini) → AI xatosi → o'z saytingiz (Gemini) =====
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
  { uz: "Terminalda: `npm create vite@latest yetkaz` (React, JavaScript), keyin `cd yetkaz`, `npm install`, `npm run dev`.", ru: 'В терминале: `npm create vite@latest yetkaz` (React, JavaScript), потом `cd yetkaz`, `npm install`, `npm run dev`.' },
  { uz: "Papkani VS Code'da oching — `src` ichida `components` papkasini yarating.", ru: 'Откройте папку в VS Code — внутри `src` создайте папку `components`.' },
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
const BLOK3 = [
  { t: { uz: "Bo'laklash", ru: 'Декомпозиция' }, tag: { uz: "o'zingiz", ru: 'сами' } },
  { t: { uz: 'Yetkaz — aniq prompt', ru: 'Yetkaz — точный промпт' }, tag: 'Gemini' },
  { t: { uz: 'AI xatosini tuzatish', ru: 'Исправление ошибки AI' }, tag: { uz: 'siz', ru: 'Вы' } },
  { t: { uz: "O'z saytingiz", ru: 'Ваш сайт' }, tag: { uz: 'siz + Gemini', ru: 'Вы + Gemini' } }
];
const YO_L = [
  { uz: "Sahifalar", ru: 'Страницы' }, { uz: "Bo'limlar — komponentlar", ru: 'Секции — компоненты' }, { uz: "Takrorlanuvchi karta", ru: 'Повторяющаяся карточка' }, { uz: 'Aniq prompt', ru: 'Точный промпт' }
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.4vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Istalgan sayt — <span className="italic" style={{ color: T.accent }}>bir xil yo'l</span> bilan.</>, ru: <>Любой сайт — <span className="italic" style={{ color: T.accent }}>одним путём</span>.</> })}</h2></div>
      <Mentor>{tr({ uz: <>Bu — modulning oxirgi darsi. Avval «Yetkaz» saytida yo'lni o'rganasiz: <b style={{ color: T.ink }}>bo'laklash → aniq prompt → tekshirish</b>. Keyin xuddi shu yo'l bilan o'z saytingizni boshlaysiz.</>, ru: <>Это последний урок модуля. Сначала на сайте «Yetkaz» осваиваете путь: <b style={{ color: T.ink }}>декомпозиция → точный промпт → проверка</b>. Потом тем же путём начинаете свой сайт.</> })}</Mentor>
      <TayyorTugma />
      <Split>
        <Col>
          <p className="flow-label">{tr({ uz: 'Namuna · Yetkaz', ru: 'Образец · Yetkaz' })}</p>
          <Win title="Yetkaz — localhost:5173"><HomePreview /></Win>
        </Col>
        <Col>
          <p className="flow-label am-yorliq-joy" aria-hidden="true">{tr({ uz: 'Namuna · Yetkaz', ru: 'Образец · Yetkaz' })}</p>
          <div className="am-karta am-reja-k fade-up delay-1">
            <p className="flow-label">{tr({ uz: "Yo'l — 4 qadam", ru: 'Путь — 4 шага' })}</p>
            <ol className="am-blok-qator">{YO_L.map((x, i) => <li key={i}><span className="am-blok-n">{i + 1}</span><b>{tr(x)}</b></li>)}</ol>
            <hr className="am-chiziq" />
            <p className="flow-label">{tr({ uz: `Bugungi ${BLOK3.length} blok`, ru: `${BLOK3.length} блока сегодня` })}</p>
            <ol className="am-blok-qator">{BLOK3.map((b, i) => <li key={i}><span className="am-blok-n">{String(i + 1).padStart(2, '0')}</span><b>{tr(b.t)}</b><span className="am-blok-teg">{tr(b.tag)}</span></li>)}</ol>
          </div>
        </Col>
      </Split>
    </div>
  </Stage>
);

// ===== a2 — Gemini: Yetkaz bosh sahifasi uchun aniq prompt (aniqlik o'lchagichi + jonli natija) =====
const ANIQ = [
  { id: 'bolim', t: { uz: "① Qaysi bo'limlar", ru: '① Какие секции' } },
  { id: 'mazmun', t: { uz: "② Har bo'lim nima ko'rsatadi", ru: '② Что показывает каждая секция' } },
  { id: 'malumot', t: { uz: "③ Ma'lumot va uslub", ru: '③ Данные и стиль' } }
];
const yetkazPrompt = (on) => {
  const uz = ["Vite + React loyiham (yetkaz) uchun ovqat yetkazib berish saytining Bosh sahifasini qur."];
  const ru = ['Сделай главную страницу сайта доставки еды для моего проекта Vite + React (yetkaz).'];
  if (on.has('bolim')) { uz.push("Bo'limlar: Navbar, Hero, Kategoriyalar, Taomlar grid, Footer — har biri alohida komponent (src/components)."); ru.push('Секции: Navbar, Hero, Категории, сетка блюд, Footer — каждая отдельным компонентом (src/components).'); }
  if (on.has('mazmun')) { uz.push("Har bo'lim: Navbar — logo va «Savat»; Hero — sarlavha va «Buyurtma berish» tugmasi; Kategoriyalar — 5 ta tugma; Taomlar grid — har taom TaomCard: emoji, nom, narx va «Savatga» tugmasi; Footer — manzil va telefon."); ru.push('Каждая секция: Navbar — логотип и «Корзина»; Hero — заголовок и кнопка «Заказать»; Категории — 5 кнопок; сетка блюд — каждое блюдо в TaomCard: эмодзи, название, цена и кнопка «В корзину»; Footer — адрес и телефон.'); }
  if (on.has('malumot')) { uz.push("Ma'lumot: taomlar App.jsx da massiv ({ id, nom, narx, emoji }), grid ularni map bilan TaomCard'ga props orqali chizsin. Uslub: oq fon, to'q sariq tugmalar, grid kompyuterda 4 ustun, telefonda 2 ustun."); ru.push('Данные: блюда — массив в App.jsx ({ id, nom, narx, emoji }), сетка рисует их через map, передавая в TaomCard через props. Стиль: белый фон, оранжевые кнопки, сетка — 4 колонки на компьютере, 2 на телефоне.'); }
  uz.push("Har faylni to'liq yoz."); ru.push('Каждый файл напиши целиком.');
  return tr({ uz: uz.join('\n'), ru: ru.join('\n') });
};
const A2_QADAM = [
  { uz: "Uchala aniqlikni qo'shing — o'lchagich 100% bo'lsin.", ru: 'Добавьте все три уточнения — шкала должна стать 100%.' },
  { uz: "«Promptni nusxalash» → gemini.google.com'ga yuboring.", ru: '«Скопировать промпт» → отправьте в gemini.google.com.' },
  { uz: "Javobdagi komponentlarni `src/components` ga, `App.jsx` ni `src` ga qo'ying, `Ctrl+S`.", ru: 'Компоненты из ответа положите в `src/components`, `App.jsx` — в `src`, `Ctrl+S`.' },
  { uz: "Brauzerda: 5 bo'lim bormi? Har TaomCard'da narx bormi?", ru: 'В браузере: есть 5 секций? В каждой TaomCard есть цена?' }
];
const ScreenYetkaz = ({ screen, onNext, onPrev }) => {
  const [on, setOn] = useState(() => new Set());
  const almash = (id) => setOn(o => { const n = new Set(o); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const foiz = Math.round((on.size / ANIQ.length) * 100);
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 2 · Gemini', ru: 'Практика 2 · Gemini' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Yetkaz uchun <span className="italic" style={{ color: T.accent }}>aniq prompt</span> yozing.</>, ru: <>Напишите <span className="italic" style={{ color: T.accent }}>точный промпт</span> для Yetkaz.</> })}</h2></div>
        <Mentor>{tr({ uz: <>«Bosh sahifani qur» — juda kam: AI o'zicha taxmin qiladi. Promptga uch narsani qo'shing va natija qanday aniqlashishini kuzating: <b style={{ color: T.ink }}>bo'limlar, har bo'lim mazmuni, ma'lumot va uslub</b>.</>, ru: <>«Сделай главную» — слишком мало: AI будет угадывать. Добавьте в промпт три вещи и смотрите, как уточняется результат: <b style={{ color: T.ink }}>секции, содержание каждой, данные и стиль</b>.</> })}</Mentor>
        <Split>
          <Col>
            <div className="am-chips">{ANIQ.map(a => <button key={a.id} type="button" className={`am-chip ${on.has(a.id) ? 'on' : ''}`} aria-pressed={on.has(a.id)} onClick={() => almash(a.id)}>{on.has(a.id) ? '✓ ' : '+ '}{tr(a.t)}</button>)}</div>
            <div className="yk-olchov"><span>{tr({ uz: 'Prompt aniqligi', ru: 'Точность промпта' })}</span><div className="yk-bar" role="progressbar" aria-valuenow={foiz} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${foiz}%` }} /></div><b>{foiz}%</b></div>
            <Win title="Yetkaz — localhost:5173">
              {!on.has('bolim') ? <div className="yk-taxmin">{tr({ uz: "Bo'limlar aytilmagan — AI o'zicha taxmin qiladi", ru: 'Секции не названы — AI угадывает сам' })}</div>
                : <HomePreview outline={!on.has('malumot')} hidePrice={!on.has('mazmun')} />}
            </Win>
          </Col>
          <Col>
            <PromptBlok matn={yetkazPrompt(on)} />
            {on.size < ANIQ.length && <p className="ql-xabar info" role="status">{tr({ uz: `Yana ${ANIQ.length - on.size} ta aniqlik qo'shing — AI kamroq taxmin qiladi.`, ru: `Добавьте ещё ${ANIQ.length - on.size} уточнения — AI будет меньше угадывать.` })}</p>}
            <QadamTugma b={A2_QADAM} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== a4 — o'z saytingiz: g'oya → bo'laklash → birinchi aniq prompt (Gemini) =====
const OZ_IDEAS = [
  { id: 'retsept', nom: { uz: 'Retseptlar', ru: 'Рецепты' }, papka: 'retseptlar', card: 'RetseptCard', grid: { uz: 'retseptlar', ru: 'рецептов' }, maydon: { uz: 'rasm (emoji), nomi va tayyorlash vaqti', ru: 'картинка (эмодзи), название и время приготовления' }, sahifa: { uz: 'Bosh · retsept · sevimlilar', ru: 'Главная · рецепт · избранное' } },
  { id: 'oyin', nom: { uz: "O'yinlar", ru: 'Игры' }, papka: 'oyinlar', card: 'OyinCard', grid: { uz: "o'yinlar", ru: 'игр' }, maydon: { uz: 'rasm (emoji), nomi, janri va reytingi', ru: 'картинка (эмодзи), название, жанр и рейтинг' }, sahifa: { uz: "Bosh · o'yin · top ro'yxat", ru: 'Главная · игра · топ-список' } },
  { id: 'kitob', nom: { uz: 'Kutubxona', ru: 'Библиотека' }, papka: 'kutubxona', card: 'KitobCard', grid: { uz: 'kitoblar', ru: 'книг' }, maydon: { uz: 'muqova (emoji), nomi va muallifi', ru: 'обложка (эмодзи), название и автор' }, sahifa: { uz: "Bosh · kitob · o'qiganlarim", ru: 'Главная · книга · прочитанное' } },
  { id: 'sport', nom: { uz: 'Sport klub', ru: 'Спортклуб' }, papka: 'sport-klub', card: 'MashgulotCard', grid: { uz: "mashg'ulotlar", ru: 'тренировок' }, maydon: { uz: "nomi, kuni va murabbiyi", ru: 'название, день и тренер' }, sahifa: { uz: "Bosh · mashg'ulot · a'zolik", ru: 'Главная · тренировка · членство' } }
];
const ozPrompt = (g) => tr({
  uz: `Vite + React loyiham (${g.papka}) uchun «${tr(g.nom)}» saytining Bosh sahifasini qur.\nBo'limlar: Navbar, Hero, ${tr(g.grid)} grid, Footer — har biri alohida komponent (src/components).\nHar bo'lim: Navbar — logo va menyu; Hero — sarlavha va bitta tugma; grid — har element ${g.card}: ${tr(g.maydon)}; Footer — aloqa ma'lumoti.\nMa'lumot: elementlar App.jsx da massiv, grid ularni map bilan ${g.card}'ga props orqali chizsin. Kamida 4 ta element yoz.\nHar faylni to'liq yoz.`,
  ru: `Сделай главную страницу сайта «${tr(g.nom)}» для моего проекта Vite + React (${g.papka}).\nСекции: Navbar, Hero, сетка ${tr(g.grid)}, Footer — каждая отдельным компонентом (src/components).\nКаждая секция: Navbar — логотип и меню; Hero — заголовок и одна кнопка; сетка — каждый элемент в ${g.card}: ${tr(g.maydon)}; Footer — контакты.\nДанные: элементы — массив в App.jsx, сетка рисует их через map, передавая в ${g.card} через props. Напиши минимум 4 элемента.\nКаждый файл напиши целиком.`
});
// F-1015-352 (foydalanuvchi): «O'z g'oyam» — o'quvchi sayt nomi va kartada nima turishini o'zi yozadi
const papkaNomi = (t) => t.toLowerCase().replace(/[\u02BB\u02BC'`\u2018\u2019]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30) || 'mening-saytim';
const ozGoya = (nom, maydon) => ({ id: 'oz', nom: { uz: nom.trim() || "Mening saytim", ru: nom.trim() || 'Мой сайт' }, papka: papkaNomi(nom), card: 'ElementCard', grid: { uz: 'elementlar', ru: 'элементов' }, maydon: { uz: maydon.trim() || "{kartada nima turadi}", ru: maydon.trim() || '{что на карточке}' }, sahifa: { uz: 'Bosh · tafsilot · sevimlilar', ru: 'Главная · детали · избранное' } });
const ScreenOzSayt = ({ screen, onNext, onPrev }) => {
  const [tanlov, setTanlov] = useState(null);
  const [ozNom, setOzNom] = useState('');
  const [ozMaydon, setOzMaydon] = useState('');
  const g = tanlov === 'oz' ? ozGoya(ozNom, ozMaydon) : (OZ_IDEAS.find(x => x.id === tanlov) || null);
  const setG = (x) => setTanlov(x.id);
  return (
    <Stage eyebrow={tr({ uz: "Amaliyot 4 · o'z saytingiz", ru: 'Практика 4 · свой сайт' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Endi <span className="italic" style={{ color: T.accent }}>o'z saytingizni</span> boshlang.</>, ru: <>Теперь начните <span className="italic" style={{ color: T.accent }}>свой сайт</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>G'oyani tanlang — u xuddi «Yetkaz» kabi bo'laklanadi va birinchi aniq prompt tayyor bo'ladi. Yo'l o'sha: <b style={{ color: T.ink }}>sahifalar → bo'limlar → takrorlanuvchi karta → prompt</b>.</>, ru: <>Выберите идею — она разобьётся так же, как «Yetkaz», и первый точный промпт будет готов. Путь тот же: <b style={{ color: T.ink }}>страницы → секции → повторяющаяся карточка → промпт</b>.</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "G'oyani tanlang", ru: 'Выберите идею' })}</p>
            <div className="am-chips">{OZ_IDEAS.map(x => <button key={x.id} type="button" className={`am-chip ${g && g.id === x.id ? 'on' : ''}`} aria-pressed={!!(g && g.id === x.id)} onClick={() => setG(x)}>{tr(x.nom)}</button>)}<button type="button" className={`am-chip ${tanlov === 'oz' ? 'on' : ''}`} aria-pressed={tanlov === 'oz'} onClick={() => setTanlov('oz')}>{tr({ uz: "+ O'z g'oyam", ru: '+ Своя идея' })}</button></div>
            {tanlov === 'oz' && <div className="am-karta am-ochil">
              <label className="am-maydon"><span>{tr({ uz: 'Sayt nomi', ru: 'Название сайта' })}</span><input className="am-input" value={ozNom} onChange={e => setOzNom(e.target.value)} placeholder={tr({ uz: 'masalan: Futbol jamoam', ru: 'например: Моя футбольная команда' })} /></label>
              <label className="am-maydon"><span>{tr({ uz: 'Har kartada nima turadi?', ru: 'Что на каждой карточке?' })}</span><input className="am-input" value={ozMaydon} onChange={e => setOzMaydon(e.target.value)} placeholder={tr({ uz: "masalan: o'yinchi rasmi, ismi va raqami", ru: 'например: фото игрока, имя и номер' })} /></label>
            </div>}
            {g && <div className="am-karta am-ochil">
              <p className="flow-label">{tr({ uz: `«${tr(g.nom)}» bo'laklari`, ru: `Блоки «${tr(g.nom)}»` })}</p>
              <ul className="cr-jadval">
                <li><b>1</b><span>{tr({ uz: 'Sahifalar', ru: 'Страницы' })}: {tr(g.sahifa)}</span></li>
                <li><b>2</b><span>{tr({ uz: "Bo'limlar", ru: 'Секции' })}: Navbar · Hero · {tr({ uz: 'grid', ru: 'сетка' })} · Footer</span></li>
                <li><b>3</b><span>{tr({ uz: 'Takrorlanuvchi karta', ru: 'Повторяющаяся карточка' })}: <code className="qcode">{`<${g.card} />`}</code></span></li>
              </ul>
            </div>}
            {g && <div className="am-karta">
              <p className="flow-label">{tr({ uz: "VS Code'da", ru: 'В VS Code' })}</p>
              <ol className="am-qadam">{[
                { uz: `Terminalda: \`npm create vite@latest ${g.papka}\`, keyin \`npm install\` va \`npm run dev\`.`, ru: `В терминале: \`npm create vite@latest ${g.papka}\`, потом \`npm install\` и \`npm run dev\`.` },
                { uz: "Promptni Gemini'ga yuboring, fayllarni joylang, `Ctrl+S`.", ru: 'Отправьте промпт в Gemini, разложите файлы, `Ctrl+S`.' },
                { uz: "Natijani tekshiring: biror narsa yetishmasa — aniqlashtiruvchi prompt (3-amaliyotdagidek).", ru: 'Проверьте результат: если чего-то не хватает — уточняющий промпт (как в 3-й практике).' }
              ].map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr(x))}</span></li>)}</ol>
            </div>}
          </Col>
          <Col>
            {g ? <PromptBlok matn={ozPrompt(g)} /> : <p className="small" style={{ margin: 0, opacity: 0.6, textAlign: 'center', padding: '24px 0' }}>{tr({ uz: "(g'oya hali tanlanmadi)", ru: '(идея пока не выбрана)' })}</p>}
          </Col>
        </Split>
      </div>
    </Stage>
  );
};
