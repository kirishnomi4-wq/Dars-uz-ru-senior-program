# F-1019-08 (sinf-supurish, DE 213.22): m7-12 PmUserStoryPitchLesson Screen2 — «Slaydga qo'ying» tugmasi -> 3 qaror
p='/home/kali/Desktop/internetLesson/src/7-Modull/PmUserStoryPitchLesson.jsx'
s=open(p).read()
def rep(a,b,n=1):
    global s
    c=s.count(a); assert c==n,(c,a[:90]); s=s.replace(a,b)
rep("""const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);""","""// F-1019-08 (213.22): qaror qadami — savol, 3 variant (biri to'g'ri, qolgani tipik xato), xatoga bir qatorli sabab, xato tugma yopiladi. Namuna — PmStoryPitchLesson Qaror.
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
    <div className="ps-qr fade-step">
      <p className="ps-qr-s">{tr(savol)}</p>
      <div className="ps-qr-v">{variantlar.map((v, j) => <QChip key={j} holat={togri === j ? 'ok' : xato.includes(j) ? 'err' : undefined} disabled={togri !== null || xato.includes(j)} onClick={() => tanla(j)}>{tr(v.t)}</QChip>)}</div>
      {izoh && <QXato key={tr(izoh)}>{tr(izoh)}</QXato>}
    </div>
  );
};
const S2_QAROR = [
  { savol: { uz: "Muammo slaydiga avval nima qo'yiladi?", ru: 'Что сначала ставят на слайд «Проблема»?' }, v: [
    { t: { uz: 'Saytdan olingan skrinshot', ru: 'Скриншот с сайта' }, izoh: { uz: "Skrinshot yechimni ko'rsatadi; muammo slaydi odamlar haqida.", ru: 'Скриншот показывает решение; слайд проблемы — о людях.' } },
    { ok: true, t: { uz: 'Suhbatdagi raqam', ru: 'Число из бесед' } },
    { t: { uz: 'Keyingi oy uchun reja', ru: 'План на следующий месяц' }, izoh: { uz: "Reja — oxirgi slaydda; bu slayd muammo haqida.", ru: 'План — на последнем слайде; этот слайд о проблеме.' } }
  ] },
  { savol: { uz: "Zal so'raydi: «Bu qanday bo'lgan?» Raqam o'rniga nima qo'yasiz?", ru: 'Зал спрашивает: «Как это было?» Что поставите вместо числа?' }, v: [
    { t: { uz: 'Kattaroq raqam', ru: 'Число побольше' }, izoh: { uz: "Raqam «qanday bo'lgan?» savoliga javob bermaydi — voqea kerak.", ru: 'Число не отвечает на «как это было?» — нужен случай.' } },
    { ok: true, t: { uz: "Bitta odamning voqeasi", ru: 'Случай одного человека' } },
    { t: { uz: '«Muammo juda katta» degan gap', ru: 'Фразу «проблема очень большая»' }, izoh: { uz: "Baho voqea emas: zal bitta odamning kunini eshitmoqchi.", ru: 'Оценка — не случай: зал хочет услышать день одного человека.' } }
  ] },
  { savol: { uz: "Zal so'raydi: «Bu nechta odamda bo'lgan?» Slaydda nima qoladi?", ru: 'Зал спрашивает: «У скольких людей так было?» Что останется на слайде?' }, v: [
    { t: { uz: 'Faqat voqea, raqamsiz', ru: 'Только случай, без числа' }, izoh: { uz: "Voqea bitta odamni ko'rsatadi; nechta ekanini raqam aytadi.", ru: 'Случай показывает одного человека; сколько их — говорит число.' } },
    { t: { uz: 'Faqat raqam, voqeasiz', ru: 'Только число, без случая' }, izoh: { uz: "Raqam yolg'iz qolsa, zal yana «qanday bo'lgan?» deydi.", ru: 'Если число одно, зал снова спросит «как это было?».' } },
    { ok: true, t: { uz: 'Raqam va voqea birga', ru: 'Число и случай вместе' } }
  ] }
];
const IPUCHA_QAROR = { uz: "Variantlardan birini tanlang — xato bo'lsa, sababini o'qib, qayta tanlang.", ru: 'Выберите вариант — если ошиблись, прочитайте причину и выберите снова.' };
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);""")
rep("""`${tr({ uz: 'Qadamlarni bajaring', ru: 'Выполните шаги' })} (${q}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Raqamdan keyin zal""","""tr({ uz: 'Savollarga javob bering', ru: 'Ответьте на вопросы' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Raqamdan keyin zal""")
rep("""tr({ uz: "Raqam slaydini o'tgan modulda yozgansiz — endi unga yozuvdan bo'laklar qo'shib, zalga qarang.", ru: 'Слайд с числом вы писали в прошлом модуле — теперь добавляйте к нему куски из записей и смотрите на зал.' })""","""tr({ uz: "Raqam slaydini o'tgan modulda yozgansiz. Har savolga javob bering — slayd va zal savoli qanday o'zgarishini ko'rasiz.", ru: 'Слайд с числом вы писали в прошлом модуле. Ответьте на каждый вопрос — увидите, как меняются слайд и вопрос зала.' })""")
rep("""          {taxmin && !done && <div className="ps-amal"><QTugma className="ps-bos" key={q} onClick={() => setQ(n => Math.min(3, n + 1))}>{tr({ uz: "Slaydga qo'ying", ru: 'Вставьте в слайд' })}</QTugma></div>}
          {ipucha && <QIzoh>{tr({ uz: "Keyingi qadamni bosing — zal yana nima so'rashini ko'ring.", ru: 'Нажмите следующий шаг — посмотрите, что ещё спросит зал.' })}</QIzoh>}""","""          {taxmin && !done && <Qaror key={q} savol={S2_QAROR[q].savol} variantlar={S2_QAROR[q].v} onTogri={() => setQ(n => Math.min(3, n + 1))} />}
          {ipucha && <QIzoh>{tr(IPUCHA_QAROR)}</QIzoh>}""")
rep("""        .ps-amal { display: flex; justify-content: flex-end; align-items: center; gap: 10px; flex-wrap: wrap; }""","""        .ps-amal { display: flex; justify-content: flex-end; align-items: center; gap: 10px; flex-wrap: wrap; }
        /* F-1019-08 (213.22): qaror qadami */
        .ps-qr { display: flex; flex-direction: column; gap: 10px; width: 100%; }
        .ps-qr-s { margin: 0; font-size: 15px; font-weight: 800; line-height: 1.4; color: ${T.ink}; }
        .ps-qr-v { display: flex; flex-wrap: wrap; gap: 8px; }""")
open(p,'w').write(s); print('ok')
