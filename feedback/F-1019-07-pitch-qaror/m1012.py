# F-1019-07: m10-12 PmGrowthPitchLesson s2, s4 — passiv tugma qatori -> qaror (DE 213.22)
p='/home/kali/Desktop/internetLesson/src/10-Modull/PmGrowthPitchLesson.jsx'
s=open(p).read()
def rep(a,b,n=1):
    global s
    c=s.count(a); assert c==n,(c,a[:90]); s=s.replace(a,b)

# TugmaQator endi ishlatilmaydi (gp-tq CSS 11-ekran bosqich-tablarida qoladi)
rep('''const TugmaQator = ({ tugmalar, joriy, onBos, yopiq }) => (
  <div className="gp-tq">{tugmalar.map((t, i) => (
    <QTugma key={i} ikkinchi={i !== joriy} disabled={yopiq || i !== joriy} className={cxx('gp-tq-b', i < joriy && 'ok', i === joriy && !yopiq && 'gp-halqa')} onClick={() => onBos(i)}>
      <span className="gp-tq-n">{i < joriy ? '✓' : i + 1}</span>{tr(t)}
    </QTugma>
  ))}</div>
);
''','')

# Screen2
rep('''const S2_TUGMA = [{ uz: "Yangi bo'lak", ru: 'Новая часть' }, { uz: 'Halol gap', ru: 'Честная фраза' }, { uz: 'Besh daqiqa', ru: 'Пять минут' }];''','''// F-1019-07 (213.22): har qadam — qaror; to'g'ri tanlov avvalgi tugma qiladigan o'zgarishni yuritadi
const S2_QAROR = [
  { savol: { uz: "Pitchga yangi bo'lak qo'shiladi. Unda nima ko'rsatiladi?", ru: 'В питч добавляется новая часть. Что в ней показывают?' }, v: [
    { t: { uz: "Intervyudagi va'dalar", ru: 'Обещания из интервью' }, izoh: { uz: "Va'da — hali bo'lmagan ish; bu bo'lak sanalgan sonni ko'rsatadi.", ru: 'Обещание — то, чего ещё нет; эта часть показывает посчитанное.' } },
    { ok: true, t: { uz: 'Sanalgan sonlar', ru: 'Посчитанные числа' } },
    { t: { uz: 'Ilovaning yangi tugmalari', ru: 'Новые кнопки приложения' }, izoh: { uz: "Tugmalarni jonli demo ko'rsatdi; bu bo'lak — natija.", ru: 'Кнопки показало живое демо; эта часть — результат.' } }
  ] },
  { savol: { uz: "Zal so'raydi: «Bu son qayerdan?» Nima deysiz?", ru: 'Зал спрашивает: «Откуда это число?» Что ответите?' }, v: [
    { t: { uz: "«Ilova juda tez o'smoqda!»", ru: '«Приложение очень быстро растёт!»' }, izoh: { uz: "Bu baho; zal sonning qayerdan kelganini so'radi.", ru: 'Это оценка; зал спросил, откуда число.' } },
    { t: { uz: 'Faqat eng katta son — 44', ru: 'Только самое большое — 44' }, izoh: { uz: "Yolg'iz 44 sinfdoshlarni va sekinlashuvni yashiradi.", ru: 'Одно 44 скрывает одноклассников и замедление.' } },
    { ok: true, t: { uz: '11 tasi sinfdosh ekanini', ru: 'Что 11 — одноклассники' } }
  ] },
  { savol: { uz: "Endi bo'lak beshta. 5 daqiqa qanday bo'linadi?", ru: 'Теперь частей пять. Как делятся 5 минут?' }, v: [
    { ok: true, t: { uz: "Har bo'lakka o'z ulushi", ru: 'Каждой части своя доля' } },
    { t: { uz: 'Hammasini jonli demoga', ru: 'Всё — живому демо' }, izoh: { uz: "Qolgan to'rt bo'lakka vaqt qolmaydi.", ru: 'На остальные четыре части времени не останется.' } },
    { t: { uz: "Raqamlar bo'lagiga 3 daqiqa", ru: 'Части «Цифры» 3 минуты' }, izoh: { uz: "Sonlar muhim, lekin muammo va demo ham vaqt so'raydi.", ru: 'Числа важны, но проблеме и демо тоже нужно время.' } }
  ] }
];''')
rep('''  const harakat = taxmin && !tugadi && <TugmaQator tugmalar={S2_TUGMA} joriy={q} onBos={bos} yopiq={q >= 3} />;''','''  const harakat = taxmin && !tugadi && <Qaror key={Math.min(q, 2)} savol={S2_QAROR[Math.min(q, 2)].savol} variantlar={S2_QAROR[Math.min(q, 2)].v} yopiq={q >= 3} onTogri={() => bos(q)} />;''')
rep('''{ipucha && <p className="gp-ipucha fade-step">{tr({ uz: "Yoqilgan tugmani bosing — pitch va taymer qanday o'zgarishini ko'ring.", ru: 'Нажмите активную кнопку — посмотрите, как меняются питч и таймер.' })}</p>}''','''{ipucha && <p className="gp-ipucha fade-step">{tr(IPUCHA_QAROR)}</p>}''')
rep('''tr({ uz: "O'tgan modulda pitch 3 daqiqa va to'rt bo'lak edi: tugmalarni birma-bir bosib, taymerga qarang.", ru: "В прошлом модуле питч длился 3 минуты и состоял из четырёх частей: нажимайте кнопки по очереди и смотрите на таймер." })''','''tr({ uz: "O'tgan modulda pitch 3 daqiqa va to'rt bo'lak edi. Har savolga javob bering — pitch va taymer qanday o'zgarishini ko'rasiz.", ru: 'В прошлом модуле питч длился 3 минуты и состоял из четырёх частей. Ответьте на каждый вопрос — увидите, как меняются питч и таймер.' })''')
rep('''label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Tugmalarni bosing', ru: 'Нажмите кнопки' })}`} onClick={onNext} /></>}>''','''label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Savollarga javob bering', ru: 'Ответьте на вопросы' })} onClick={onNext} /></>}>''',2)

# Screen4
rep('''const S4_TUGMA = [{ uz: 'Noldan boshlang', ru: 'Начните с нуля' }, { uz: 'Oraliqni teng qiling', ru: 'Сделайте шаг равным' }, { uz: "Sana va sonni qo'ying", ru: 'Поставьте дату и число' }, { uz: 'Nima sanalganini yozing', ru: 'Напишите, что посчитано' }];''','''// F-1019-07 (213.22): har qadam — buzilgan grafikning bitta kamchiligiga qaror; to'g'ri tanlov uni tuzatadi
const S4_QAROR = [
  { savol: { uz: 'Ustunlar 18 dan boshlanadi. Nima qilasiz?', ru: 'Столбики начинаются с 18. Что сделаете?' }, v: [
    { t: { uz: 'Ustunlarni rangli qilaman', ru: 'Раскрашу столбики' }, izoh: { uz: "Rang farqni to'g'rilamaydi: 18 dan boshlansa, o'sish bo'rtadi.", ru: 'Цвет не исправит: от 18 рост выглядит больше.' } },
    { ok: true, t: { uz: 'Noldan boshlayman', ru: 'Начну с нуля' } },
    { t: { uz: 'Eng balandini ajrataman', ru: 'Выделю самый высокий' }, izoh: { uz: "Ajratish ham yordam bermaydi — ustunlar noldan chizilmagan.", ru: 'Выделение не поможет — столбики не от нуля.' } }
  ] },
  { savol: { uz: "Bir ustun «3 kun o'tib», qolgani haftama-hafta. Nima qilasiz?", ru: 'Один столбик «через 3 дня», остальные по неделям. Что сделаете?' }, v: [
    { ok: true, t: { uz: 'Uni olib tashlayman', ru: 'Уберу его' } },
    { t: { uz: "Uni o'rtaga suraman", ru: 'Сдвину его в середину' }, izoh: { uz: "Joyi o'zgarsa ham oraliq teng bo'lmaydi: 3 kun — hafta emas.", ru: 'Место другое, а шаг неравный: 3 дня — не неделя.' } },
    { t: { uz: 'Hammasini 3 kunlik qilaman', ru: 'Сделаю все по 3 дня' }, izoh: { uz: "Sizda faqat haftalik sonlar bor — yangi son o'ylab topilmaydi.", ru: 'У вас только недельные числа — новые не придумывают.' } }
  ] },
  { savol: { uz: "Ustunlar ostida ham, ustida ham hech narsa yo'q. Nima qo'shasiz?", ru: 'Под столбиками и над ними пусто. Что добавите?' }, v: [
    { t: { uz: 'Har ustunga rasmcha', ru: 'Картинку к каждому столбику' }, izoh: { uz: "Rasmcha sonni aytmaydi; zal aniq kun va sonni ko'rishi kerak.", ru: 'Картинка не называет число; залу нужны день и число.' } },
    { t: { uz: 'Faqat oxirgi son: 44', ru: 'Только последнее число: 44' }, izoh: { uz: "Bitta son o'sishni ko'rsatmaydi — har ustunniki kerak.", ru: 'Одно число не показывает рост — нужно у каждого столбика.' } },
    { ok: true, t: { uz: 'Sana va son', ru: 'Дату и число' } }
  ] },
  { savol: { uz: "Zal so'raydi: «Bu son nimani sanaydi?» Qayerga yozasiz?", ru: 'Зал спрашивает: «Что считает это число?» Где напишете?' }, v: [
    { ok: true, t: { uz: 'Grafik sarlavhasiga', ru: 'В заголовок графика' } },
    { t: { uz: "Faqat og'zaki aytaman", ru: 'Только скажу устно' }, izoh: { uz: "Gap o'tib ketadi; sarlavha grafik bilan birga turadi.", ru: 'Слова забудутся; заголовок остаётся с графиком.' } },
    { t: { uz: 'Keyingi slaydga', ru: 'На следующий слайд' }, izoh: { uz: "Zal shu grafikka qarab turibdi — javob shu yerda kerak.", ru: 'Зал смотрит на этот график — ответ нужен здесь.' } }
  ] }
];''')
rep('''{ipucha && <p className="gp-ipucha fade-step">{tr({ uz: "Yoqilgan tugmani bosing — ustunlar qanday o'zgarishini ko'ring.", ru: 'Нажмите активную кнопку — посмотрите, как меняются столбики.' })}</p>}''','''{ipucha && <p className="gp-ipucha fade-step">{tr(IPUCHA_QAROR)}</p>}''')
rep('''tr({ uz: 'Mentor misolining sonlaridan chizilgan grafikda kamchiliklar bor: tugmalarni birma-bir bosib, ustunlarga qarang.', ru: 'В графике по числам из примера Ментора есть недочёты: нажимайте кнопки по очереди и смотрите на столбики.' })''','''tr({ uz: "Mentor misolining sonlaridan chizilgan grafikda kamchiliklar bor. Har savolga javob bering — ustunlar qanday o'zgarishini ko'rasiz.", ru: 'В графике по числам из примера Ментора есть недочёты. Ответьте на каждый вопрос — увидите, как меняются столбики.' })''')
rep('''        harakat={taxmin && !tugadi && <TugmaQator tugmalar={S4_TUGMA} joriy={q} onBos={bos} yopiq={done} />}''','''        harakat={taxmin && !tugadi && <Qaror key={Math.min(q, 3)} savol={S4_QAROR[Math.min(q, 3)].savol} variantlar={S4_QAROR[Math.min(q, 3)].v} yopiq={done} onTogri={() => bos(q)} />}''')
open(p,'w').write(s); print('m10-12 ok')
