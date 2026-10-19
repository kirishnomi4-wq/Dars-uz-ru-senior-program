# F-1019-07: m8-11 PmPitchRehearsalLesson s2, s6 — passiv qadam tugmasi -> qaror (DE 213.22)
p='/home/kali/Desktop/internetLesson/src/8-Modull/PmPitchRehearsalLesson.jsx'
s=open(p).read()
def rep(a,b,n=1):
    global s
    c=s.count(a); assert c==n,(c,a[:80]); s=s.replace(a,b)

# 1) Qaror komponenti — QadamQator dan keyin
rep('''// O'qituvchi eslatmasi — faqat mentor (proyektor) rejimida, bosilganda ochiladi
const MentorNote = ''','''// F-1019-07 (DE 213.22): qaror qadami — savol, 3 variant (biri to'g'ri, qolgani tipik xato), xatoga bir qatorli sabab, qayta tanlash.
// Namuna — PmStoryPitchLesson Qaror. To'g'ri tanlovdan keyin variantlar yopiladi; har qadam key bilan yangilanadi.
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
    <div className="pr-qr fade-step">
      <p className="pr-qr-s">{tr(savol)}</p>
      <div className="pr-qr-v">{variantlar.map((v, j) => <QChip key={j} holat={togri === j ? 'ok' : xato.includes(j) ? 'err' : undefined} disabled={togri !== null || xato.includes(j)} onClick={() => tanla(j)}>{tr(v.t)}</QChip>)}</div>
      {izoh && <QXato key={tr(izoh)}>{tr(izoh)}</QXato>}
    </div>
  );
};
const IPUCHA_QAROR = { uz: "Variantlardan birini tanlang — xato bo'lsa, sababini o'qib, qayta tanlang.", ru: 'Выберите вариант — если ошиблись, прочитайте причину и выберите снова.' };
// O'qituvchi eslatmasi — faqat mentor (proyektor) rejimida, bosilganda ochiladi
const MentorNote = ''')

# 2) Screen2 savollari
rep('''const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const [yur, setYur]''','''// F-1019-07 (213.22): har qadam — qaror; to'g'ri tanlov slaydni qo'shadi
const S2_QAROR = [
  { savol: { uz: "Zal so'raydi: «Sayt ishga tushgach nima bo'ldi?» Qaysi slayd javob beradi?", ru: 'Зал спрашивает: «Что стало после запуска сайта?» Какой слайд отвечает?' }, v: [
    { t: { uz: 'Yechim', ru: 'Решение' }, izoh: { uz: "Yechim — sayt nima qilishi; bo'lgan ishni raqam aytadi.", ru: 'Решение — что делает сайт; о случившемся говорит число.' } },
    { ok: true, t: { uz: 'Raqamlar', ru: 'Цифры' } },
    { t: { uz: 'Foydalanuvchi', ru: 'Пользователь' }, izoh: { uz: "Bu slayd — kim ishlatgani; zal endi natijani so'rayapti.", ru: 'Этот слайд — кто пользовался; зал теперь спрашивает о результате.' } }
  ] },
  { savol: { uz: "Zal so'raydi: «Endi nima qilasiz?» Slaydga nima yoziladi?", ru: 'Зал спрашивает: «Что будете делать дальше?» Что пишется на слайд?' }, v: [
    { t: { uz: 'Yana bir sanalgan raqam', ru: 'Ещё одно посчитанное число' }, izoh: { uz: "Sanalgan raqam — Raqamlar slaydida; bu slayd oldinga qaraydi.", ru: 'Посчитанное число — на слайде «Цифры»; этот слайд смотрит вперёд.' } },
    { t: { uz: "Jamoa a'zolarining ismlari", ru: 'Имена участников команды' }, izoh: { uz: "Zal reja so'radi; jamoa haqida savol yo'q edi.", ru: 'Зал спросил о плане; о команде вопроса не было.' } },
    { ok: true, t: { uz: 'Keyingi ish va maqsad', ru: 'Следующее дело и цель' } }
  ] },
  { savol: { uz: "Besh slayd — besh daqiqa. Vaqtni qanday bo'lasiz?", ru: 'Пять слайдов — пять минут. Как разделите время?' }, v: [
    { ok: true, t: { uz: 'Har slaydga 1 daqiqadan', ru: 'По 1 минуте на слайд' } },
    { t: { uz: 'Raqamlarga 3 daqiqa', ru: '«Цифрам» 3 минуты' }, izoh: { uz: "Bir slaydga 3 daqiqa — qolgan to'rttasiga 2 daqiqa qoladi.", ru: '3 минуты одному слайду — на остальные четыре останется 2.' } },
    { t: { uz: "Muammoga ko'proq, oxiriga kam", ru: 'Проблеме больше, концу меньше' }, izoh: { uz: "Oxirgi slayd shoshib o'tadi — zal rejani eshitmay qoladi.", ru: 'Последний слайд пройдёт впопыхах — зал не услышит план.' } }
  ] }
];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const [yur, setYur]''')
rep('''`${tr({ uz: 'Qadamlarni bajaring', ru: "Выполните шаги" })} (${q}/3)`} onClick={onNext} /></>}>''','''tr({ uz: 'Savollarga javob bering', ru: 'Ответьте на вопросы' })} onClick={onNext} /></>}>''')
rep('''Ikki slayd qo'shing va har slayd ustida zal nimani so'rashiga qarang.", ru: "Три слайда питча «Maydon» были готовы в прошлом модуле. Добавьте два слайда и посмотрите, о чём зал спрашивает над каждым." })}''','''Har savolga javob bering — zal har slayd ustida nimani so'rashini ko'rasiz.", ru: "Три слайда питча «Maydon» были готовы в прошлом модуле. Ответьте на каждый вопрос — увидите, о чём зал спрашивает над каждым слайдом." })}''')
rep('''              ? <QTugma className="pr-bos" onClick={bos}>{q + 1} · {tr(S2_QADAM[q])}</QTugma>''','''              ? <Qaror key={q} savol={S2_QAROR[q].savol} variantlar={S2_QAROR[q].v} onTogri={bos} />''')
rep('''            {ipucha && <QIzoh>{tr({ uz: "Slaydlar ostidagi tugmani bosing — zal qaysi slaydda nimani so'rashini ko'ring.", ru: "Нажмите кнопку под слайдами — посмотрите, о чём зал спрашивает на каждом слайде." })}</QIzoh>}''','''            {ipucha && q < 3 && <QIzoh>{tr(IPUCHA_QAROR)}</QIzoh>}''')
# S2_QADAM endi ishlatilmaydi — o'chiriladi
rep('''const S2_QADAM = [
  { uz: "Raqamlar slaydini qo'shing", ru: "Добавьте слайд «Цифры»" },
  { uz: "Keyingi qadam slaydini qo'shing", ru: "Добавьте слайд «Следующий шаг»" },
  { uz: "Vaqtni slaydlarga bo'ling", ru: "Разделите время по слайдам" }
];
''','')

# 3) Screen6
rep('''const S6_QADAM = [
  { uz: "U nimani sanashini qo'shing", ru: "Добавьте, что оно считает" },
  { uz: "Solishtirishni qo'shing", ru: "Добавьте сравнение" },
  { uz: "Halol gapni qo'shing", ru: "Добавьте честную фразу" }
];''','''// F-1019-07 (213.22): har qadam — zal savoliga qaror; to'g'ri tanlov slaydga qatorni qo'shadi
const S6_QAROR = [
  { savol: { uz: "Zal so'raydi: «17 nima?» Raqam yoniga nima qo'shasiz?", ru: 'Зал спрашивает: «Что значит 17?» Что добавите рядом с числом?' }, v: [
    { t: { uz: '17 ni kattaroq shriftda', ru: '17 крупным шрифтом' }, izoh: { uz: "Katta raqam ham «17 nima?» savoliga javob bermaydi.", ru: 'Крупное число тоже не отвечает на «Что значит 17?».' } },
    { ok: true, t: { uz: 'U nimani sanaganini', ru: 'Что оно посчитало' } },
    { t: { uz: 'Foizini: 42,5%', ru: 'Процент: 42,5%' }, izoh: { uz: "Foiz ham yolg'iz raqam: nimani sanagani noma'lum.", ru: 'Процент — тоже одинокое число: неясно, что посчитано.' } }
  ] },
  { savol: { uz: "Zal so'raydi: «Bu ko'pmi, kammi?» Nima qo'shasiz?", ru: 'Зал спрашивает: «Это много или мало?» Что добавите?' }, v: [
    { t: { uz: '«Bu juda yaxshi natija!»', ru: '«Это отличный результат!»' }, izoh: { uz: "Baho raqam emas: zal o'zi solishtira olmaydi.", ru: 'Оценка — не число: зал сам не может сравнить.' } },
    { t: { uz: 'Saytga kirganlar soni', ru: 'Сколько зашли на сайт' }, izoh: { uz: "Bu yana bitta son; «nima bilan solishtirdik?» ochiq qoladi.", ru: 'Это ещё одно число; «с чем сравнили?» остаётся открытым.' } },
    { ok: true, t: { uz: 'Boshqa tugma natijasi', ru: 'Результат другой кнопки' } }
  ] },
  { savol: { uz: "Zal so'raydi: «Bunga ishonsa bo'ladimi?» Nima deysiz?", ru: 'Зал спрашивает: «Этому можно верить?» Что ответите?' }, v: [
    { ok: true, t: { uz: 'Farq bor, brauzer hali kam', ru: 'Разница есть, браузеров мало' } },
    { t: { uz: 'B aniq yaxshi, tamom', ru: 'B точно лучше, и всё' }, izoh: { uz: "82 brauzerda «aniq» deyish — zalni chalg'itish.", ru: 'Сказать «точно» при 82 браузерах — ввести зал в заблуждение.' } },
    { t: { uz: 'Raqamni slayddan olib tashlayman', ru: 'Уберу число со слайда совсем' }, izoh: { uz: "Raqamsiz zal hech narsani tekshira olmaydi.", ru: 'Без числа зал ничего не сможет проверить.' } }
  ] }
];''')
rep('''`${tr({ uz: "Bo'laklarni qo'shing", ru: "Добавьте части" })} (${q}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} keng tugadi={tugadi}
        sarlavha={tr({ uz: <>A/B raqami''','''tr({ uz: 'Savollarga javob bering', ru: 'Ответьте на вопросы' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} keng tugadi={tugadi}
        sarlavha={tr({ uz: <>A/B raqami''')
rep('''Bo'laklarni birma-bir qo'shib, zal savoliga qarang.", ru: "На слайд «Цифры» поставили одно число из A/B-теста «Maydon». Добавляйте части по одной и смотрите на вопрос зала." })}''','''Zalning har savoliga javob bering — slaydga nima qo'shilishini ko'rasiz.", ru: "На слайд «Цифры» поставили одно число из A/B-теста «Maydon». Ответьте на каждый вопрос зала — увидите, что добавится на слайд." })}''')
rep('''            <QTugma className="pr-bos" onClick={bos}>{q + 1} · {tr(S6_QADAM[q])}</QTugma>
            {ipucha && <QIzoh>{tr({ uz: "Keyingi bo'lakni qo'shing — zal savoli qanday o'zgarishini ko'ring.", ru: "Добавьте следующую часть — посмотрите, как меняется вопрос зала." })}</QIzoh>}''','''            <Qaror key={q} savol={S6_QAROR[q].savol} variantlar={S6_QAROR[q].v} onTogri={bos} />
            {ipucha && <QIzoh>{tr(IPUCHA_QAROR)}</QIzoh>}''')

# 4) CSS
rep('''        .pr-qadam-d { display: flex; gap: 6px; }''','''        .pr-qadam-d { display: flex; gap: 6px; }
        /* F-1019-07 (213.22): qaror qadami — nuqtalar ostida to'liq kenglikda: savol, variantlar, sabab */
        .pr-qadam .pr-qr { flex-basis: 100%; }
        .pr-qr { display: flex; flex-direction: column; gap: 10px; width: 100%; }
        .pr-qr-s { margin: 0; font-size: 15px; font-weight: 800; line-height: 1.4; color: ${T.ink}; }
        .pr-qr-v { display: flex; flex-wrap: wrap; gap: 8px; }''')
open(p,'w').write(s); print('m8-11 ok')
