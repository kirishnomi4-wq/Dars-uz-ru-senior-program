# F-1019-07: m9-16 PmPrototypePitchLesson s2, s4, s8 — passiv qadam tugmasi -> qaror (DE 213.22)
p='/home/kali/Desktop/internetLesson/src/9-Modull/PmPrototypePitchLesson.jsx'
s=open(p).read()
def rep(a,b,n=1):
    global s
    c=s.count(a); assert c==n,(c,a[:90]); s=s.replace(a,b)

# 1) QadamQatori -> Qaror
rep('''const QadamQatori = ({ qadamlar, joriy, onBos, yopiq }) => (
  <div className="pt-qq fade-step">
    {qadamlar.map((q, i) => i < joriy
      ? <span key={i} className="pt-qq-ok"><i>✓</i>{q}</span>
      : i === joriy
        ? <QTugma key={i} className={halqa(!yopiq)} disabled={yopiq} onClick={onBos}><b className="pt-qq-n">{i + 1}</b> {q}</QTugma>
        : null)}
  </div>
);''','''// F-1019-07 (DE 213.22): qaror qadami — savol, 3 variant (biri to'g'ri, qolgani tipik xato), xatoga bir qatorli sabab, qayta tanlash.
// Namuna — PmStoryPitchLesson Qaror. To'g'ri tanlovdan keyin variantlar yopiladi; sahna harakati tugaguncha shu savol turadi (key — javob kutilayotgan qadam).
const Qaror = ({ savol, variantlar, onTogri }) => {
  const [xato, setXato] = useState([]);
  const [izoh, setIzoh] = useState(null);
  const [togri, setTogri] = useState(null);
  const tanla = (j) => {
    if (togri !== null) return;
    const v = variantlar[j];
    if (v.ok) { setIzoh(null); setTogri(j); onTogri(); return; }
    setXato(x => (x.includes(j) ? x : [...x, j])); setIzoh(v.izoh);
  };
  return (
    <div className="pt-qr fade-step">
      <p className="pt-qr-s">{tr(savol)}</p>
      <div className="pt-qr-v">{variantlar.map((v, j) => <QChip key={j} holat={togri === j ? 'ok' : xato.includes(j) ? 'err' : undefined} disabled={togri !== null || xato.includes(j)} onClick={() => tanla(j)}>{tr(v.t)}</QChip>)}</div>
      {izoh && <QXato key={tr(izoh)}>{tr(izoh)}</QXato>}
    </div>
  );
};
const IPUCHA_QAROR = { uz: "Variantlardan birini tanlang — xato bo'lsa, sababini o'qib, qayta tanlang.", ru: 'Выберите вариант — если ошиблись, прочитайте причину и выберите снова.' };''')

# 2) Screen2
rep('''const S2_QADAM = [{ uz: "Muammoni qo'shing", ru: 'Добавьте проблему' }, { uz: "Yechimni qo'shing", ru: 'Добавьте решение' }, { uz: "Ilovani ko'rsating", ru: 'Покажите приложение' }, { uz: "Keyingi qadamni qo'shing", ru: 'Добавьте следующий шаг' }];''','''// F-1019-07 (213.22): har qadam — qaror; to'g'ri tanlov bo'lakni taymerga qo'shadi
const S2_QAROR = [
  { savol: { uz: 'Pitch nimadan boshlanadi?', ru: 'С чего начинается питч?' }, v: [
    { t: { uz: 'Ilova tugmalaridan', ru: 'С кнопок приложения' }, izoh: { uz: "Zal hali nimani hal qilishini bilmaydi — avval muammo.", ru: 'Зал ещё не знает, что решается, — сначала проблема.' } },
    { ok: true, t: { uz: 'Muammodan', ru: 'С проблемы' } },
    { t: { uz: 'Jamoa bilan tanishuvdan', ru: 'Со знакомства с командой' }, izoh: { uz: "3 daqiqada tanishuvga vaqt yo'q; zal muammoni kutadi.", ru: 'На знакомство за 3 минуты нет времени; зал ждёт проблему.' } }
  ] },
  { savol: { uz: 'Muammodan keyin zalga nima aytiladi?', ru: 'Что говорят залу после проблемы?' }, v: [
    { t: { uz: 'Keyingi oy uchun reja', ru: 'План на следующий месяц' }, izoh: { uz: "Reja oxirida; zal hali mahsulot nima qilishini bilmaydi.", ru: 'План — в конце; зал ещё не знает, что делает продукт.' } },
    { t: { uz: 'Yana bitta boshqa muammo', ru: 'Ещё одну, другую проблему' }, izoh: { uz: "Bitta muammo yetadi; endi uni nima hal qilishi kerak.", ru: 'Одной проблемы хватит; теперь — что её решает.' } },
    { ok: true, t: { uz: 'Mahsulot nima qilishi', ru: 'Что делает продукт' } }
  ] },
  { savol: { uz: 'Zal ilova ishlashini qanday ko\\'radi?', ru: 'Как зал увидит, что приложение работает?' }, v: [
    { ok: true, t: { uz: 'Ilovani telefonda ishlatib', ru: 'Покажете на телефоне' } },
    { t: { uz: "Slaydda skrinshot ko'rsatib", ru: 'Покажете скриншот на слайде' }, izoh: { uz: "Skrinshot — rasm; zal ishlashini o'z ko'zi bilan ko'rmaydi.", ru: 'Скриншот — картинка; зал не видит работу своими глазами.' } },
    { t: { uz: '«U ishlaydi» deb aytib', ru: 'Скажете «оно работает»' }, izoh: { uz: "Gapga ishonish qiyin; zal ilovani ko'rishni xohlaydi.", ru: 'Словам верить трудно; зал хочет увидеть приложение.' } }
  ] },
  { savol: { uz: 'Pitch nima bilan tugaydi?', ru: 'Чем заканчивается питч?' }, v: [
    { t: { uz: '«Rahmat, savollar bormi?»', ru: '«Спасибо, есть вопросы?»' }, izoh: { uz: "Zal hali «endi nima qilasiz?» deb kutib turibdi.", ru: 'Зал всё ещё ждёт ответа на «что дальше?».' } },
    { ok: true, t: { uz: 'Keyingi qadam bilan', ru: 'Следующим шагом' } },
    { t: { uz: 'Muammoni qaytarish bilan', ru: 'Повтором проблемы' }, izoh: { uz: "Muammo boshida aytildi; oxirida — oldinga reja.", ru: 'Проблему уже назвали в начале; в конце — план вперёд.' } }
  ] }
];''')
rep('''    : { uz: "O'tgan modulda pitch besh daqiqalik edi: bo'laklarni birma-bir qo'shib, taymerga qarang.", ru: 'В прошлом модуле питч был пятиминутным: добавляйте части по одной и смотрите на таймер.' };''','''    : { uz: "O'tgan modulda pitch besh daqiqalik edi. Har savolga javob bering — bo'laklar taymerga qanday joylashishini ko'rasiz.", ru: 'В прошлом модуле питч был пятиминутным. Ответьте на каждый вопрос — увидите, как части лягут на таймер.' };''')
rep('''label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "Bo'laklarni qo'shing", ru: 'Добавьте части' })} (${q}/4)`} onClick={onNext} /></>}>''','''label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Savollarga javob bering', ru: 'Ответьте на вопросы' })} onClick={onNext} /></>}>''')
rep('''        harakat={taxmin && !done && <QadamQatori qadamlar={S2_QADAM.map(tr)} joriy={q} onBos={bos} yopiq={band} />}''','''        harakat={taxmin && !done && <Qaror key={band ? q - 1 : q} savol={S2_QAROR[band ? q - 1 : q].savol} variantlar={S2_QAROR[band ? q - 1 : q].v} onTogri={bos} />}''')
rep('''        natija={!done && ipucha && <QIzoh>{tr({ uz: "Yoqilgan qadamni bosing — zal qaysi bo'lakda nimani so'rashini ko'ring.", ru: 'Нажмите активный шаг — посмотрите, что зал спросит в каждой части.' })}</QIzoh>}''','''        natija={!done && ipucha && !band && <QIzoh>{tr(IPUCHA_QAROR)}</QIzoh>}''')

# 3) Screen4
rep('''const S4_QADAM = [{ uz: "Muammo gapini qo'ying", ru: "Поставьте формулировку проблемы" }, { uz: "Sanoqni qo'shing", ru: 'Добавьте подсчёт' }, { uz: "Harakat belgisini qo'shing", ru: 'Добавьте знак действия' }];''','''// F-1019-07 (213.22): har qadam — qaror; to'g'ri tanlov qatorni jadvaldan bo'lakka uchiradi
const S4_QAROR = [
  { savol: { uz: "Muammo bo'lagiga avval nima yoziladi?", ru: 'Что сначала пишется в часть «Проблема»?' }, v: [
    { t: { uz: 'Ilovaning nomi', ru: 'Название приложения' }, izoh: { uz: "Nom — yechimda; bu bo'lak o'yinchining qiyinchiligi haqida.", ru: 'Название — в решении; эта часть о трудности игрока.' } },
    { t: { uz: 'Jadvaldagi hamma son', ru: 'Все числа из таблицы' }, izoh: { uz: "Avval zal muammoni eshitsin; sonlar uni keyin tasdiqlaydi.", ru: 'Сначала зал должен услышать проблему; числа потом её подтвердят.' } },
    { ok: true, t: { uz: 'Muammo gapi', ru: 'Формулировка проблемы' } }
  ] },
  { savol: { uz: "Zal so'raydi: «Muammo borligini qayerdan bilasiz?» Qaysi dalil javob beradi?", ru: 'Зал спрашивает: «Откуда знаете, что проблема есть?» Какой довод отвечает?' }, v: [
    { ok: true, t: { uz: "Necha kishida bo'lgani", ru: 'У скольких это было' } },
    { t: { uz: 'Hozir nima bilan yechishadi', ru: 'Чем сейчас решают' }, izoh: { uz: "Bu — hozirgi yo'l; muammo borligini ko'rsatmaydi.", ru: 'Это нынешний способ; он не показывает, что проблема есть.' } },
    { t: { uz: 'Eng qiyin joyi qaysiligi', ru: 'Какое место самое трудное' }, izoh: { uz: "Bu — qaysi qism qiyinligi; necha kishida bo'lgani emas.", ru: 'Это — какая часть трудная, а не у скольких она была.' } }
  ] },
  { savol: { uz: "Zal so'raydi: «Ular bu ilovaga qiziqadimi?» Qaysi dalil javob beradi?", ru: 'Зал спрашивает: «Им интересно это приложение?» Какой довод отвечает?' }, v: [
    { t: { uz: "«Zo'r g'oya» deyishgani", ru: 'Сказали «классная идея»' }, izoh: { uz: "Maqtov — harakat emas; kun belgilash — harakat.", ru: 'Похвала — не действие; назначить день — действие.' } },
    { ok: true, t: { uz: 'Sinovga kun belgilagani', ru: 'Назначили день пробы' } },
    { t: { uz: "Mahalla to'garaklari ustuni", ru: 'Столбец кружков махалли' }, izoh: { uz: "Bu boshqa guruh — sizning o'yinchilaringiz haqida emas.", ru: 'Это другая группа, а не ваши игроки.' } }
  ] }
];''')
rep('''`${tr({ uz: "Dalillarni qo'shing", ru: 'Добавьте доводы' })} (${q}/3)`} onClick={onNext} /></>}>''','''tr({ uz: 'Savollarga javob bering', ru: 'Ответьте на вопросы' })} onClick={onNext} /></>}>''')
rep('''          : { uz: "Muammo gapi intervyulardan keyin yozilgan edi: yoniga jadvaldan dalil qo'shib, zal savoliga qarang.", ru: "Формулировка проблемы написана после интервью: добавьте рядом довод из таблицы и посмотрите на вопрос зала." })}</Mentor>}''','''          : { uz: "Muammo gapi intervyulardan keyin yozilgan edi. Har savolga javob bering — jadvaldan qaysi dalil bo'lakka o'tishini ko'rasiz.", ru: 'Формулировка проблемы написана после интервью. Ответьте на каждый вопрос — увидите, какой довод из таблицы перейдёт в часть.' })}</Mentor>}''')
rep('''{taxmin && !done && <QadamQatori qadamlar={S4_QADAM.map(tr)} joriy={q} onBos={bos} />}''','''{taxmin && !done && <Qaror key={q} savol={S4_QAROR[q].savol} variantlar={S4_QAROR[q].v} onTogri={bos} />}''')
rep('''          {!done && ipucha && <QIzoh>{tr({ uz: "Yoqilgan qadamni bosing — zal savoli qanday o'zgarishini ko'ring.", ru: 'Нажмите активный шаг — посмотрите, как меняется вопрос зала.' })}</QIzoh>}''','''          {!done && ipucha && <QIzoh>{tr(IPUCHA_QAROR)}</QIzoh>}''')

# 4) Screen8
rep('''const S8_QADAM = [{ uz: 'Ilovani oldindan oching', ru: 'Откройте приложение заранее' }, { uz: "Asosiy harakatni ko'rsating", ru: 'Покажите главное действие' }, { uz: 'Sinovdagi tuzatishni ayting', ru: 'Расскажите об исправлении после теста' }];''','''// F-1019-07 (213.22): har qadam — qaror; to'g'ri tanlov telefonda shu harakatni o'ynatadi
const S8_QAROR = [
  { savol: { uz: 'Bepul Backend uxlab qolishi mumkin. Pitchdan oldin nima qilasiz?', ru: 'Бесплатный Backend может уснуть. Что сделаете до питча?' }, v: [
    { t: { uz: 'Zal oldida birinchi ochaman', ru: 'Открою впервые перед залом' }, izoh: { uz: "Backend uyg'onguncha zal ham kutib qoladi.", ru: 'Пока Backend просыпается, зал тоже будет ждать.' } },
    { ok: true, t: { uz: 'Ilovani oldindan ochaman', ru: 'Заранее открою приложение' } },
    { t: { uz: "Telefonni o'chirib yoqaman", ru: 'Перезагружу телефон' }, izoh: { uz: "Telefon emas, Backend uxlaydi — uni so'rov uyg'otadi.", ru: 'Спит не телефон, а Backend — его будит запрос.' } }
  ] },
  { savol: { uz: "Demoda zalga nimani ko'rsatasiz?", ru: 'Что покажете залу в демо?' }, v: [
    { ok: true, t: { uz: 'Bitta asosiy harakatni', ru: 'Одно главное действие' } },
    { t: { uz: 'Hamma ekranni birma-bir', ru: 'Все экраны по очереди' }, izoh: { uz: "3 daqiqada hamma ekranga vaqt yo'q — zal adashadi.", ru: 'За 3 минуты на все экраны нет времени — зал запутается.' } },
    { t: { uz: 'Kod yozilgan fayllarni', ru: 'Файлы с кодом' }, izoh: { uz: "Zal kodni emas, ilova nima qilishini ko'rmoqchi.", ru: 'Зал хочет видеть не код, а что делает приложение.' } }
  ] },
  { savol: { uz: "Demo oxirida qaysi gap qo'shiladi?", ru: 'Какая фраза добавляется в конце демо?' }, v: [
    { t: { uz: '«Ilova hali xom, uzr»', ru: '«Приложение ещё сырое, извините»' }, izoh: { uz: "Uzr zalga hech narsa bermaydi; nima o'zgarganini ayting.", ru: 'Извинения ничего не дают залу; скажите, что изменилось.' } },
    { t: { uz: 'Keyingi oy uchun katta reja', ru: 'Большой план на следующий месяц' }, izoh: { uz: "Reja — Keyingi qadam bo'lagida; demo sinovga tayanadi.", ru: 'План — в части «Следующий шаг»; демо опирается на тест.' } },
    { ok: true, t: { uz: 'Sinovdan keyingi tuzatish', ru: 'Исправление после теста' } }
  ] }
];''')
rep('''label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Qadamlarni bajaring', ru: 'Выполните шаги' })} (${tayyor}/3)`} onClick={onNext} /></>}>''','''label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Savollarga javob bering', ru: 'Ответьте на вопросы' })} onClick={onNext} /></>}>''')
rep('''            : taxmin ? <>{tr({ uz: `${Math.min(q, 2) + 1}-qadam: tugmani bosing —`, ru: `Шаг ${Math.min(q, 2) + 1}: нажмите кнопку —` })} «{tr(S8_QADAM[Math.min(q, 2)])}».</>''','''            : taxmin ? tr({ uz: "Har savolga javob bering — telefonda nima o'zgarishini ko'rasiz.", ru: 'Ответьте на каждый вопрос — увидите, что изменится на телефоне.' })''')
rep('''        harakat={taxmin && !done && <QadamQatori qadamlar={S8_QADAM.map(tr)} joriy={tayyor >= q ? q : q - 1} onBos={bos} yopiq={band} />}''','''        harakat={taxmin && !done && <Qaror key={band ? q - 1 : q} savol={S8_QAROR[band ? q - 1 : q].savol} variantlar={S8_QAROR[band ? q - 1 : q].v} onTogri={bos} />}''')
rep('''        natija={!done && ipucha && <QIzoh>{tr({ uz: "Yoqilgan qadamni bosing — telefonda nima o'zgarishini ko'ring.", ru: 'Нажмите активный шаг — посмотрите, что изменится на телефоне.' })}</QIzoh>}''','''        natija={!done && ipucha && !band && <QIzoh>{tr(IPUCHA_QAROR)}</QIzoh>}''')

# 5) CSS: pt-qq -> pt-qr
rep('''        .pt-qq { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; }
        .pt-qq-ok { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; padding: 7px 11px; border-radius: 10px; }
        .pt-qq-ok { color: ${T.ok}; background: ${T.okFon}; } .pt-qq-ok i { font-style: normal; }
        .pt-qq-n { font-family: 'JetBrains Mono', monospace; font-size: 12px; margin-right: 2px; }''','''        /* F-1019-07 (213.22): qaror qadami — savol, variantlar, sabab */
        .pt-qr { display: flex; flex-direction: column; gap: 10px; width: 100%; }
        .pt-qr-s { margin: 0; font-size: 15px; font-weight: 800; line-height: 1.4; color: ${T.ink}; }
        .pt-qr-v { display: flex; flex-wrap: wrap; gap: 8px; }''')
open(p,'w').write(s); print('m9-16 ok')
