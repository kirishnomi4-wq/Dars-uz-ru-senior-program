// ===== F-1015-390 (17.10, foydalanuvchi «xa qil maqul»): MUSTAQIL ISH — kattaroq topshiriq, tayyor promptsiz; promptni o'quvchi yig'adi; qabul shartlari — ustoz tekshiradi =====
const MI_KEY = 'ccAvtoMustaqil';
const miRead = () => { try { const v = JSON.parse(localStorage.getItem(MI_KEY) || 'null'); return v && typeof v === 'object' ? v : {}; } catch { return {}; } };
const miOk = (t) => { const s = (t || '').trim(); return s.split(/\s+/).filter(Boolean).length >= 2 && s.replace(/\s/g, '').length >= 8; }; // 210.2: kamida 2 so'z, 8 harf
const MI_MAYDON = [
  { id: 'nima', t: { uz: 'Nima qo\'shamiz?', ru: 'Что добавляем?' }, ph: { uz: "masalan: har kartochkaga ✕ va narxni o'zgartirish", ru: 'например: на каждую карточку ✕ и изменение цены' } },
  { id: 'qayerda', t: { uz: 'Qayerda?', ru: 'Где?' }, ph: { uz: 'masalan: Home.jsx dagi kartochkalarda', ru: 'например: в карточках в Home.jsx' } },
  { id: 'qanday', t: { uz: 'Qanday ishlashi kerak?', ru: 'Как должно работать?' }, ph: { uz: "masalan: DELETE va PUT yuborsin, keyin ro'yxatni qayta olsin", ru: 'например: отправляет DELETE и PUT, потом заново получает список' } }
];
const miPrompt = (f) => tr({
  uz: `AvtoIjara saytimga (React, avto-ijara) qo'sh: ${f.nima.trim() || '{nima}'}.\nQayerda: ${f.qayerda.trim() || '{qayerda}'}.\nQanday ishlashi kerak: ${f.qanday.trim() || '{qanday}'}.\nServer: ${API} — DELETE /api/cars/:id va PUT /api/cars/:id (narx) serverda bor.\nO'zgargan fayllarni to'liq qaytar.\nMana kodim:\n{Home.jsx kodini shu yerga qo'ying}`,
  ru: `Добавь в мой сайт AvtoIjara (React, avto-ijara): ${f.nima.trim() || '{что}'}.\nГде: ${f.qayerda.trim() || '{где}'}.\nКак должно работать: ${f.qanday.trim() || '{как}'}.\nСервер: ${API} — DELETE /api/cars/:id и PUT /api/cars/:id (цена) на сервере есть.\nИзменённые файлы верни целиком.\nВот мой код:\n{вставьте сюда код Home.jsx}`
});
const MI_SHART = [
  { uz: "✕ bosilsa mashina saytdan ham, bazadan ham o'chadi (psql'da `SELECT * FROM cars;`).", ru: 'После ✕ машина исчезает и с сайта, и из базы (в psql `SELECT * FROM cars;`).' },
  { uz: "Narx o'zgartirilsa, F5 dan keyin ham yangi narx turadi.", ru: 'После изменения цены новая цена остаётся и после F5.' },
  { uz: "Server o'chiq bo'lsa, sayt xato xabarini ko'rsatadi — oq ekran emas.", ru: 'Если сервер выключен, сайт показывает сообщение об ошибке — не белый экран.' }
];
const MI_QADAM = [
  { uz: "O'ngda uchta maydonni to'ldiring — prompt o'zingiz yozgan gaplardan yig'iladi.", ru: 'Справа заполните три поля — промпт собирается из ваших слов.' },
  { uz: "«Promptni nusxalash» → gemini.google.com, oxiriga `Home.jsx` kodini qo'shing.", ru: '«Скопировать промпт» → gemini.google.com, в конце добавьте код `Home.jsx`.' },
  { uz: "Javobni qo'ying, `Ctrl+S`; natija chiqmasa — Gemini'ga aniq yozing: nima bo'ldi va nima bo'lishi kerak.", ru: 'Вставьте ответ, `Ctrl+S`; если не вышло — точно напишите Gemini: что случилось и как должно быть.' },
  { uz: "Qabul shartlarini bittalab tekshiring va ustozga ko'rsating.", ru: 'Проверьте условия приёмки по одному и покажите учителю.' }
];
const ScreenMustaqil = ({ screen, onNext, onPrev }) => {
  const [f, setF] = useState(() => ({ nima: '', qayerda: '', qanday: '', ...miRead() }));
  const yoz = (k, v) => setF(o => { const n = { ...o, [k]: v }; try { localStorage.setItem(MI_KEY, JSON.stringify(n)); } catch { /* saqlab bo'lmadi */ } return n; });
  const [rows, setRows] = useState(CARS_DB);
  const [tahrir, setTahrir] = useState(null);
  const tayyor = MI_MAYDON.every(m => miOk(f[m.id]));
  const [ok, setOk] = useState(false);
  const matn = miPrompt(f);
  const nusxa = async () => { if (!tayyor) return; try { await navigator.clipboard.writeText(matn); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — ustoz ko'rsatadi */ } };
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Endi <span className="italic" style={{ color: T.accent }}>o'zingiz</span>: o'chirish va narxni o'zgartirish.</>, ru: <>Теперь <span className="italic" style={{ color: T.accent }}>сами</span>: удаление и изменение цены.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Bu safar tayyor prompt yo'q — uni o'zingiz yig'asiz. Gemini bilan quring va <b style={{ color: T.ink }}>qabul shartlari</b> bo'yicha tekshiring: ustoz shu bo'yicha qabul qiladi.</>, ru: <>В этот раз готового промпта нет — соберёте его сами. Постройте с Gemini и проверьте по <b style={{ color: T.ink }}>условиям приёмки</b>: учитель принимает по ним.</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "Kutilgan natija · bosib ko'ring", ru: 'Ожидаемый результат · попробуйте' })}</p>
            <div className="am-karta mi-ilova">
              {rows.map(c => <div key={c.id} className="mi-qator">
                <span className="us-em" style={{ background: c.bg }}>{c.emoji}</span><b>{c.nom}</b>
                <span className="mi-narx">{tahrir === c.id ? '480 000' : sp(c.narx)}</span>
                <button type="button" className="mi-tg" onClick={() => setTahrir(t => (t === c.id ? null : c.id))}>{tr({ uz: 'Narx', ru: 'Цена' })}</button>
                <button type="button" className="mi-tg mi-x" aria-label={tr({ uz: "O'chirish", ru: 'Удалить' })} onClick={() => setRows(r => r.filter(x => x.id !== c.id))}>✕</button>
              </div>)}
              {!rows.length && <button type="button" className="am-chip" onClick={() => setRows(CARS_DB)}>{tr({ uz: '↺ Boshidan', ru: '↺ Сначала' })}</button>}
            </div>
            <div className="am-karta">
              <p className="flow-label">{tr({ uz: 'Qabul shartlari', ru: 'Условия приёмки' })}</p>
              <ul className="am-band">{MI_SHART.map((x, i) => <li key={i}>{fmtCode(tr(x))}</li>)}</ul>
              <p className="mi-tez"><b>{tr({ uz: 'Tez tugatganlarga:', ru: 'Кто закончил быстрее:' })}</b> {tr({ uz: "o'chirishdan oldin «Rostdan o'chirilsinmi?» deb so'rasin.", ru: 'перед удалением пусть спрашивает «Точно удалить?».' })}</p>
            </div>
          </Col>
          <Col>
            <div className="am-karta">
              <p className="flow-label">{tr({ uz: "Promptni o'zingiz yig'ing", ru: 'Соберите промпт сами' })}</p>
              {MI_MAYDON.map(m => <label key={m.id} className="am-maydon"><span>{tr(m.t)}</span><input className="am-input" value={f[m.id]} onChange={e => yoz(m.id, e.target.value)} placeholder={tr(m.ph)} /></label>)}
              {!tayyor && <p className="am-satr">{tr({ uz: "Har maydonga kamida ikki so'z yozing.", ru: 'В каждое поле — хотя бы два слова.' })}</p>}
            </div>
            <div className="am-karta">
              <div className="am-prompt-h"><p className="flow-label">{tr({ uz: 'Prompt', ru: 'Промпт' })}</p><button type="button" className="am-nusxa" disabled={!tayyor} onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Promptni nusxalash', ru: 'Скопировать промпт' })}</button></div>
              <pre className="am-masalan">{matn}</pre>
            </div>
            <QadamTugma b={MI_QADAM} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};
