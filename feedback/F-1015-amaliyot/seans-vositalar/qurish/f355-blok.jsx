// ===== F-1015-355: 20 → 7 ekran. KitobShop qizil testi: o'yin (eski s9) → Copilot Chat «Agent» bilan haqiqiy tuzatish (testni o'zgartirish tuzog'i + aniqlashtiruvchi so'rov) =====
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
  { uz: "«Loyiha kuni — to'liq lentani qurish» darsidagi `ci.yml` KitobShop'da bor: GitHub → Actions yashil.", ru: '`ci.yml` из урока «Проектный день — построение полного конвейера» есть в KitobShop: GitHub → Actions зелёный.' },
  { uz: "VS Code'da KitobShop'ni oching: terminalda `npm test` yashil o'tadimi?", ru: 'Откройте KitobShop в VS Code: `npm test` в терминале проходит зелёным?' },
  { uz: "Copilot Chat'ni oching (`Ctrl+Alt+I`) va chat ostidagi ro'yxatdan «Agent» rejimini tanlang.", ru: 'Откройте Copilot Chat (`Ctrl+Alt+I`) и в списке под чатом выберите режим «Agent».' }
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
const KodNusxa = ({ yorliq, kod }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => { try { await navigator.clipboard.writeText(kod); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — ustoz ko'rsatadi */ } };
  return (
    <div className="am-karta">
      <div className="am-prompt-h"><p className="flow-label">{tr(yorliq)}</p><button type="button" className="am-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></div>
      <pre className="am-masalan">{kod}</pre>
    </div>
  );
};
const BLOK2 = [
  { t: { uz: "Jurnal → so'rov → tekshirish", ru: 'Журнал → запрос → проверка' }, tag: { uz: "o'zingiz", ru: 'сами' } },
  { t: { uz: 'KitobShop qizil testini tuzatish', ru: 'Починить красный тест KitobShop' }, tag: 'Copilot Chat' }
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.4vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Copilot'ga ishonamizmi — yoki <span className="italic" style={{ color: T.accent }}>tekshirib ishonamizmi</span>?</>, ru: <>Верим Copilot — или <span className="italic" style={{ color: T.accent }}>верим, но проверяем</span>?</> })}</h2></div>
      <Mentor>{tr({ uz: <>O'tgan darsda KitobShop'ga lenta uladingiz. Bugun u qizil yonsa nima qilishni o'rganasiz: jurnalni o'qiysiz, <b style={{ color: T.ink }}>Copilot Chat</b>'dan aniq so'raysiz va javobini jurnal bilan tekshirasiz. Copilot tez, lekin har doim to'g'ri emas — oxirgi qaror sizda.</>, ru: <>На прошлом уроке Вы подключили ленту к KitobShop. Сегодня учитесь, что делать, если она покраснела: читаете журнал, точно спрашиваете <b style={{ color: T.ink }}>Copilot Chat</b> и сверяете его ответ с журналом. Copilot быстрый, но не всегда прав — последнее решение за Вами.</> })}</Mentor>
      <TayyorTugma />
      <Split>
        <Col>
          <div className="vis-card">
            <p className="flow-label">{tr({ uz: 'Dars oxirida · KitobShop lentasi yashil', ru: 'К концу урока · лента KitobShop зелёная' })}</p>
            <Belt statuses={ALL_PASS} />
          </div>
        </Col>
        <Col>
          <div className="am-karta am-reja-k fade-up delay-1">
            <p className="flow-label">{tr({ uz: `Bugungi ${BLOK2.length} blok`, ru: `${BLOK2.length} блока сегодня` })}</p>
            <ol className="am-blok-qator">{BLOK2.map((b, i) => <li key={i}><span className="am-blok-n">{String(i + 1).padStart(2, '0')}</span><b>{tr(b.t)}</b><span className="am-blok-teg">{tr(b.tag)}</span></li>)}</ol>
          </div>
        </Col>
      </Split>
    </div>
  </Stage>
);

// ===== a2 — KitobShop: qizil test → Copilot Chat «Agent» → testni o'zgartirish tuzog'i → aniqlashtiruvchi so'rov → order.ts tuzatildi → yashil =====
const CP_JURNAL = [
  { t: '✓ npm ci · 14s', tone: 'ok' },
  { t: '✗ npm test', tone: 'bad' },
  { t: '  FAIL  order.spec.ts', tone: 'bad' },
  { t: { uz: '  ● orderTotal › 2 kitob narxini hisoblaydi', ru: '  ● orderTotal › считает цену 2 книг' }, tone: 'bad' },
  { t: '    Expected: 20000', tone: 'bad' },
  { t: '    Received: 10002', tone: 'bad' },
  { t: '    at order.spec.ts:6', tone: 'bad' },
  { t: { uz: "— npm run lint · o'tkazib yuborildi", ru: '— npm run lint · пропущено' }, tone: 'skip' }
];
const CP_PROMPT1 = {
  uz: "GitHub Actions'da KitobShop testi yiqildi. Jurnal:\nFAIL  order.spec.ts\n● orderTotal › 2 kitob narxini hisoblaydi\nExpected: 20000\nReceived: 10002\nat order.spec.ts:6\nSababini top va tuzat.",
  ru: 'В GitHub Actions упал тест KitobShop. Журнал:\nFAIL  order.spec.ts\n● orderTotal › считает цену 2 книг\nExpected: 20000\nReceived: 10002\nat order.spec.ts:6\nНайди причину и исправь.'
};
const CP_PROMPT2 = {
  uz: "Testni o'zgartirma — test to'g'ri: 10 000 so'mlik 2 ta kitob = 20 000.\nXato order.ts dagi orderTotal funksiyasida.\nFaqat order.ts ni tuzat.",
  ru: 'Не меняй тест — тест верный: 2 книги по 10 000 сумов = 20 000.\nОшибка в функции orderTotal в order.ts.\nИсправь только order.ts.'
};
const CP_TEKSHIRUV = [
  { uz: "O'zgarish `order.ts` da — `order.spec.ts` ga tegilmagan", ru: 'Изменение в `order.ts` — `order.spec.ts` не тронут' },
  { uz: 'Javob jurnaldagi Expected va Received farqini tushuntiradi', ru: 'Ответ объясняет разницу Expected и Received из журнала' },
  { uz: "Terminalda `npm test` yashil — shundan keyin `git push`", ru: 'В терминале `npm test` зелёный — только потом `git push`' }
];
const CP_QADAM = [
  { uz: "Mashq uchun KitobShop'dagi `order.ts` da `price * quantity` ni `price + quantity` qiling va `git push`.", ru: 'Для тренировки в `order.ts` KitobShop замените `price * quantity` на `price + quantity` и сделайте `git push`.' },
  { uz: "GitHub → Actions → qizil «npm test» → jurnaldan FAIL, Expected, Received va qator raqamini toping.", ru: 'GitHub → Actions → красный «npm test» → найдите в журнале FAIL, Expected, Received и номер строки.' },
  { uz: "Copilot Chat, «Agent» rejimi: promptni qo'ying, jurnal qatorlarini o'zingiznikiga almashtiring (qator raqami boshqacha bo'lishi mumkin).", ru: 'Copilot Chat, режим «Agent»: вставьте промпт, замените строки журнала на свои (номер строки может отличаться).' },
  { uz: "Javobni tekshiruv ro'yxati bilan solishtiring. Copilot testni o'zgartirsa — «Undo» va aniqlashtiruvchi so'rov.", ru: 'Сверьте ответ со списком проверки. Если Copilot меняет тест — «Undo» и уточняющий запрос.' },
  { uz: "«Keep» → terminalda `npm test` yashil → `git push` → Actions yashil.", ru: '«Keep» → `npm test` в терминале зелёный → `git push` → Actions зелёный.' }
];
const CpDiff = ({ fayl, eski, yangi }) => (
  <div className="cp-diff">
    <div className="cp-diff-f">{fayl}</div>
    <div className="cp-del">- {eski}</div>
    <div className="cp-add">+ {yangi}</div>
  </div>
);
const ScreenCopilot = ({ screen, onNext, onPrev }) => {
  const [b, setB] = useState('bosh'); // bosh → j1 → (j1keep) → f1 → j2 → (j2undo) → test → done
  const [belgi, setBelgi] = useState(() => new Set());
  const [sc, setSc] = useState(0);
  const go = (x) => { setB(x); setSc(n => n + 1); };
  const tog = (i) => setBelgi(s => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  const BOSQ = ['bosh', 'j1', 'j1keep', 'f1', 'j2', 'j2undo', 'test', 'done'];
  const oldi = (x) => BOSQ.indexOf(b) >= BOSQ.indexOf(x);
  const ikkinchi = oldi('f1');
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 2 · Copilot Chat', ru: 'Практика 2 · Copilot Chat' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>KitobShop testini <span className="italic" style={{ color: T.accent }}>Copilot bilan</span> tuzating.</>, ru: <>Почините тест KitobShop <span className="italic" style={{ color: T.accent }}>вместе с Copilot</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Jurnaldagi qatorlarni promptga qo'yib, Copilot'ga yuboring. Copilot ba'zan testni javobga moslab qo'yadi — test yashil bo'ladi, lekin xato kodda qoladi. Shuning uchun har o'zgarishni «Keep» bosishdan oldin tekshirasiz.</>, ru: <>Вставьте строки журнала в промпт и отправьте Copilot. Иногда Copilot подгоняет тест под ответ — тест зеленеет, а ошибка остаётся в коде. Поэтому каждое изменение Вы проверяете до «Keep».</> })}</Mentor>
        <Split>
          <Col>
            <div className="rj-oyna">
              <div className="rj-bar"><span className="bb-dots"><i /><i /><i /></span><span className="rj-fayl">KitobShop · Actions</span><span className={`ci-tablo ${b === 'done' ? 'green' : 'red'}`}>CI {b === 'done' ? 'passing' : 'failing'}</span></div>
              <div className="rj-body">
                {b === 'done'
                  ? ['✓ npm ci · 14s', '✓ npm test · 9s', '✓ npm run lint · 4s', '✓ npm run build · 11s'].map((l, i) => <div key={i} className="rj-li cp-ok">{l}</div>)
                  : CP_JURNAL.map((l, i) => <div key={i} className={`rj-li cp-${l.tone}`}>{tr(l.t)}</div>)}
              </div>
            </div>
            <div className="am-karta cp-chat">
              <div className="cp-chat-h"><span className="ai-badge">Copilot</span><span>Chat · Agent</span></div>
              {b === 'bosh' && <button type="button" className="am-saqla" onClick={() => go('j1')}>{tr({ uz: 'Promptni yuborish', ru: 'Отправить промпт' })}</button>}
              {oldi('j1') && <>
                <p className="cp-siz">{tr({ uz: 'Siz: jurnal qatorlari + «Sababini top va tuzat»', ru: 'Вы: строки журнала + «Найди причину и исправь»' })}</p>
                <div className="cp-javob">
                  <p>{tr({ uz: 'Test 20000 kutyapti, funksiya 10002 qaytaryapti. Testdagi kutilgan qiymatni yangiladim:', ru: 'Тест ожидает 20000, функция возвращает 10002. Я обновил ожидаемое значение в тесте:' })}</p>
                  <CpDiff fayl="order.spec.ts" eski="expect(orderTotal(10000, 2)).toBe(20000);" yangi="expect(orderTotal(10000, 2)).toBe(10002);" />
                  {(b === 'j1' || b === 'j1keep') && <div className="am-chips">
                    {b === 'j1' && <button type="button" className="am-chip" onClick={() => go('j1keep')}>Keep</button>}
                    <button type="button" className="am-chip" onClick={() => go('f1')}>Undo</button>
                  </div>}
                  {b === 'j1keep' && <p className="ql-xabar xato" role="status">{tr({ uz: "Test yashil bo'ladi — lekin KitobShop endi 2 kitobga 10 002 so'm oladi. Copilot testni javobga moslab qo'ydi, xato order.ts da qoldi. «Undo» bosing.", ru: 'Тест позеленеет — но KitobShop теперь берёт за 2 книги 10 002 сума. Copilot подогнал тест под ответ, ошибка осталась в order.ts. Нажмите «Undo».' })}</p>}
                  {ikkinchi && <p className="cp-rad">{tr({ uz: "✗ Rad etildi — test o'zgartirilgan edi", ru: '✗ Отклонено — был изменён тест' })}</p>}
                </div>
              </>}
              {b === 'f1' && <button type="button" className="am-saqla" onClick={() => go('j2')}>{tr({ uz: "Aniqlashtiruvchi so'rovni yuborish", ru: 'Отправить уточняющий запрос' })}</button>}
              {oldi('j2') && <>
                <p className="cp-siz">{tr({ uz: "Siz: «Testni o'zgartirma… Faqat order.ts ni tuzat»", ru: 'Вы: «Не меняй тест… Исправь только order.ts»' })}</p>
                <div className="cp-javob">
                  <p>{tr({ uz: "Tushunarli. orderTotal'da qo'shish yozilgan — ko'paytirish kerak:", ru: 'Понял. В orderTotal стоит сложение — нужно умножение:' })}</p>
                  <CpDiff fayl="order.ts" eski="return price + quantity;" yangi="return price * quantity;" />
                  {(b === 'j2' || b === 'j2undo') && <div className="am-chips">
                    <button type="button" className="am-chip" onClick={() => go('test')}>Keep</button>
                    {b === 'j2' && <button type="button" className="am-chip" onClick={() => go('j2undo')}>Undo</button>}
                  </div>}
                  {b === 'j2undo' && <p className="ql-xabar info" role="status">{tr({ uz: "Bu safar taklif to'g'ri: test o'zgarmadi, order.ts tuzatildi, 10000 × 2 = 20000. «Keep» bosing.", ru: 'На этот раз предложение верное: тест не тронут, order.ts исправлен, 10000 × 2 = 20000. Нажмите «Keep».' })}</p>}
                </div>
              </>}
              {oldi('test') && <div className="rj-oyna cp-term">
                <div className="rj-body">
                  <div className="rj-li">$ npm test</div>
                  <div className="rj-li cp-ok">PASS  order.spec.ts</div>
                  <div className="rj-li cp-ok">✓ {tr({ uz: '2 kitob narxini hisoblaydi', ru: 'считает цену 2 книг' })}</div>
                </div>
              </div>}
              {b === 'test' && <button type="button" className="am-saqla" onClick={() => go('done')}>git push</button>}
              {b === 'done' && <p className="ql-xabar info" role="status">{tr({ uz: "Lenta yashil. Copilot tez topdi, lekin noto'g'ri o'zgarishni siz to'xtatdingiz.", ru: 'Лента зелёная. Copilot нашёл быстро, но неверное изменение остановили Вы.' })}</p>}
            </div>
          </Col>
          <Col>
            <KodNusxa yorliq={ikkinchi ? { uz: "Aniqlashtiruvchi so'rov (follow-up)", ru: 'Уточняющий запрос (follow-up)' } : { uz: 'Prompt · Copilot Chat', ru: 'Промпт · Copilot Chat' }} kod={tr(ikkinchi ? CP_PROMPT2 : CP_PROMPT1)} />
            <div className="am-karta">
              <p className="flow-label">{tr({ uz: '«Keep» dan oldin tekshiring', ru: 'Проверьте до «Keep»' })}</p>
              <div className="ag-tek">{CP_TEKSHIRUV.map((t, i) => <label key={i} className="ag-tek-q"><input type="checkbox" checked={belgi.has(i)} onChange={() => tog(i)} /><span>{fmtCode(tr(t))}</span></label>)}</div>
            </div>
            <QadamTugma b={CP_QADAM} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};
