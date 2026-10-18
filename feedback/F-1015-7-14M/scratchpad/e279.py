import re, sys
p = 'src/10-Modull/PmUsersCheckLesson.jsx'
s = open(p, encoding='utf-8').read()
def rep(a, b, n=1):
    global s
    c = s.count(a)
    assert c == n, (c, a[:80])
    s = s.replace(a, b)

# ---------- 279 · s2: bashorat yolg'iz; manbalar bitta kartada ----------
rep("""        vizual={tugadi
          ? <div className="uc-fokus">{varaq}</div>
          : <div className="uc-split"><ManbaMaketlar yonik={yonik} mRefs={mRefs} />{varaq}</div>}""",
"""        vizual={!taxmin ? null : tugadi
          ? <div className="uc-fokus">{varaq}</div>
          : <div className="uc-split uc-karta-kir"><ManbaMaketlar yonik={yonik} mRefs={mRefs} />{varaq}</div>}""")
rep("        .uc-manbalar { display: flex; flex-direction: column; gap: 10px; min-width: 0; }\n        .uc-manba { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; transition: border-color .3s, box-shadow .3s; }",
    "        .uc-manbalar { display: flex; flex-direction: column; gap: 6px; min-width: 0; padding: 10px 12px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; } /* F-1015-279: uch manba bitta kartada, qatorlar ramkasiz */\n        .uc-manba { display: flex; flex-direction: column; gap: 6px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; border: 1.5px solid transparent; transition: border-color .3s, box-shadow .3s; }")

# ---------- 280 · s4: bashorat yolg'iz; hv-q qatorlari ramkasiz ----------
rep("""        vizual={tugadi
          ? <div className="uc-fokus">{varaq}</div>
          : <div className="uc-split uc-split-v">{varaq}{karta || <span />}</div>}""",
"""        vizual={!taxmin ? null : tugadi
          ? <div className="uc-fokus">{varaq}</div>
          : <div className="uc-split uc-split-v uc-karta-kir">{varaq}{karta || <span />}</div>}""")
rep("padding: 8px 10px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; text-align: left; font-family: 'Manrope', sans-serif; width: 100%; position: relative; transition: border-color .3s, background .3s; }",
    "padding: 8px 10px; border-radius: 10px; border: 1.5px solid transparent; background: ${T.bg}; text-align: left; font-family: 'Manrope', sans-serif; width: 100%; position: relative; transition: border-color .3s, background .3s; } /* F-1015-280: qatorlar ramkasiz (213.3) */")
rep("        .hv-q.h-yalang { border-style: solid; background: ${T.bg}; }", "        .hv-q.h-yalang { background: ${fon(T.ink, 0.04)}; }")

# ---------- 281 · s9: savol yolg'iz; qadamlar tanlovdan keyin; izohlar Yordamda ----------
rep("          <div className={cxx('uc-darvoza', !gpick && !isMentor && 'uc-chorla')}>",
    "          {gpick ? <span className=\"uc-yig yopiq\"><i>✓</i><span>{tr({ uz: 'Ustun', ru: 'Столбец' })}:</span><b className=\"mono\">{gpick}</b></span> : <div className={cxx('uc-darvoza', !isMentor && 'uc-chorla')}>")
rep("""            {miss && !gpick && <QXato>{fmtCode(tr(S9_DARVOZA.find(g => g.id === miss.id).x))}</QXato>}
          </div>
          <ol className="uc-vazifa">""",
"""            {miss && !gpick && <QXato>{fmtCode(tr(S9_DARVOZA.find(g => g.id === miss.id).x))}</QXato>}
          </div>}
          {gpick && <ol className="uc-vazifa fade-step">""")
rep("""<span>{fmtCode(tr(v))}</span></li>)}</ol>
          {webQator && <span className="uc-kulrang">{fmtCode(tr({ uz: "Web-trekda — saytingizning foydalanuvchilar jadvali; unda vaqt ustuni bo'lmasa, kunlarsiz jami: `SELECT COUNT(*) FROM {jadval} WHERE namuna = false;`", ru: "В веб-треке — таблица пользователей вашего сайта; если в ней нет столбца времени, итог без дней: `SELECT COUNT(*) FROM {jadval} WHERE namuna = false;`" }))}</span>}
""", """<span>{fmtCode(tr(v))}</span></li>)}</ol>}
""")
rep("""          {yordam && !done && <div className="uc-yordam fade-step">
""", """          {yordam && !done && <div className="uc-yordam fade-step">
            {webQator && <QIzoh>{fmtCode(tr({ uz: "Web-trekda — saytingizning foydalanuvchilar jadvali; unda vaqt ustuni bo'lmasa, kunlarsiz jami: `SELECT COUNT(*) FROM {jadval} WHERE namuna = false;`", ru: "В веб-треке — таблица пользователей вашего сайта; если в ней нет столбца времени, итог без дней: `SELECT COUNT(*) FROM {jadval} WHERE namuna = false;`" }))}</QIzoh>}
            <QIzoh>{tr({ uz: "Vaqt tugasa — keyingi mashqda 1-qatorga sanoq sahifasidagi sonni yozing va manbani «sanoq sahifasi» deb belgilang; kunlar — uyda.", ru: "Если время вышло — в следующем упражнении впишите в 1-ю строку число со страницы подсчёта и отметьте источник «страница подсчёта»; дни — дома." })}</QIzoh>
""")
rep("""            <span className="uc-kulrang uc-kichik">{tr({ uz: "Vaqt tugasa — keyingi mashqda 1-qatorga sanoq sahifasidagi sonni yozing va manbani «sanoq sahifasi» deb belgilang; kunlar — uyda.", ru: "Если время вышло — в следующем упражнении впишите в 1-ю строку число со страницы подсчёта и отметьте источник «страница подсчёта»; дни — дома." })}</span>
""", "")
rep("""          <QIzoh>{tr({ uz: 'Sizning qatorlaringiz shu yerda chiqadi. Mentor misolida bir haftada jami — 38.', ru: "Здесь появятся ваши строки. В примере Ментора за неделю всего — 38." })}</QIzoh>
""", "")

# ---------- 283 · s11: bo'g'in tanlangach dalil; ogohlantirish faqat 3-qadamda ----------
rep("""        <Maydon y="1" keng value={z.dalil} max={120} err={xato === 'dalil'} halqa={!!z.boginda && !String(z.dalil).trim()}""",
    """        {z.boginda && <Maydon y="1" keng value={z.dalil} max={120} err={xato === 'dalil'} halqa={!String(z.dalil).trim()}""")
rep("""onEnter={zSaqla} ph={tr({ uz: 'Qaysi son yoki fakt buni ko\\'rsatadi?', ru: "Какое число или факт это показывает?" })} />
      </>}""", """onEnter={zSaqla} ph={tr({ uz: 'Qaysi son yoki fakt buni ko\\'rsatadi?', ru: "Какое число или факт это показывает?" })} />}
      </>}""")
rep("""      <span className="uc-kulrang">{tr({ uz: "Soxta akkaunt, o'zingiz qayta ro'yxatdan o'tish va sovg'a va'dasi — yo'q.", ru: "Фейковые аккаунты, своя повторная регистрация и обещание подарков — нет." })}</span>
    </div>
  );
  const yetdiKarta""", """      {zi === 2 && <span className="uc-kulrang">{tr({ uz: "Soxta akkaunt, o'zingiz qayta ro'yxatdan o'tish va sovg'a va'dasi — yo'q.", ru: "Фейковые аккаунты, своя повторная регистрация и обещание подарков — нет." })}</span>}
    </div>
  );
  const yetdiKarta""")

# ---------- 282 · s10: QatorKarta va PastkiKarta — bittadan forma (213.11) ----------
a = s.index('const QatorKarta = (')
b = s.index('const MENTOR_QADAM_NOM = ')
QK = r'''// F-1015-282 (213.11): qator kartasi — savollar ketma-ket; javob berilgani yashil qatorga yig'iladi (bosilsa qayta ochiladi), navbati kelmagani kulrang qator; Saqlash doim bosiladi
const S10_QADAM_NOM = {
  nima: { uz: 'Nimani sanaydi', ru: 'Что считает' }, son: { uz: 'Son', ru: 'Число' }, manba: { uz: 'Manba', ru: 'Источник' },
  sana: { uz: 'Sana', ru: 'Дата' }, oldin: { uz: 'Oldingi son', ru: 'Предыдущее число' }
};
const S10_QADAM_F = { nima: ['nima'], son: ['soni', 'sinfdosh', 'birinchi', 'keyingi', 'davr'], manba: ['manba'], sana: ['sana'], oldin: ['oldinSon', 'oldinSana'] };
const S10_IZOH = {
  reja: { uz: 'ishga tushirish kunidagi son — bilsangiz, yangilang (ixtiyoriy)', ru: "число из дня запуска — если знаете, обновите (по желанию)" },
  royxat: { uz: 'Namuna va tekshiruv akkauntlari sanalmaydi; sinfdoshlar sanaladi, lekin alohida aytiladi.', ru: "Аккаунты-образцы и проверочные не считаются; одноклассники считаются, но называются отдельно." },
  asosiy: { uz: "Mentor misolida — hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan; navbatda turgani — qo'shilgan emas.", ru: "В примере Ментора — сейчас участвуют хотя бы в одной игре или объявили игру; кто стоит в очереди — не присоединился." },
  qaytgan: { uz: 'Keyingi davrga faqat birinchi davrda ochgan qurilmalar kiradi — yangi kelganlar emas.', ru: "В следующий период входят только устройства, открывшие в первый, — не новые." }
};
const s10Qadamlar = (id, avtoOldin) => (id === 'bosh' ? ['nima', 'son', 'manba', 'sana'] : id === 'qaytgan' || avtoOldin ? ['son', 'manba', 'sana'] : ['son', 'manba', 'sana', 'oldin']);
const s10Toldi = (k, id, d, qatiy) => (k === 'nima' ? !!String(d.nima || '').trim()
  : k === 'son' ? (id === 'qaytgan' ? sonmi(d.birinchi) && sonmi(d.keyingi) : sonmi(d.soni))
    : k === 'manba' ? !!d.manba : k === 'sana' ? !!d.sana
      : qatiy ? !!(d.birinchiOlchov || (sonmi(d.oldinSon) && d.oldinSana)) : true);
const s10Foiz = (d) => (sonmi(d.birinchi) && sonmi(d.keyingi) && Number(d.birinchi) > 0 ? Math.round((Number(d.keyingi) / Number(d.birinchi)) * 100) : null);
const s10Yigma = (k, id, d) => {
  if (k === 'nima') return d.nima;
  if (k === 'son') {
    if (id === 'qaytgan') { const f = s10Foiz(d); return `${d.birinchi} → ${d.keyingi}${f != null ? ' · ' + f + '%' : ''}${String(d.davr || '').trim() ? ' · ' + d.davr : ''}`; }
    return id === 'royxat' ? `${d.soni} / 50${sonmi(d.sinfdosh) ? ' · ' + tr({ uz: `${d.sinfdosh} tasi — sinfdosh`, ru: `${d.sinfdosh} из них — одноклассники` }) : ''}` : d.soni;
  }
  if (k === 'manba') return d.manba ? tr(MANBA_NOM[d.manba] || { uz: d.manba, ru: d.manba }) : '';
  if (k === 'sana') return d.sana;
  return d.birinchiOlchov ? tr(BIRINCHI_OLCHOV) : sonmi(d.oldinSon) && d.oldinSana ? `${d.oldinSon} — ${d.oldinSana}` : tr({ uz: "yo'q", ru: 'нет' });
};
const QatorKarta = ({ id, h, reja, prd, trek, kRef, sarlavha, onSaqla, onSanalmagan, uyda, onUyda }) => {
  const [d, setD] = useState(() => qoralamaBosh(id, h, reja, prd));
  const avtoOldin = (id === 'royxat' || id === 'asosiy') && rejaOldin(id, reja);
  const qadamlar = s10Qadamlar(id, avtoOldin);
  // Boshlang'ich: to'lgan savollar (SQL dan kelgan son, reja) yig'ilgan holda, birinchi bo'shi ochiq
  const [qi, setQi] = useState(() => { const i = qadamlar.findIndex(k => !s10Toldi(k, id, d, true)); return i < 0 ? qadamlar.length : i; });
  const [otdi, setOtdi] = useState(qi);
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(null);
  const [yordam, setYordam] = useState(false);
  const iRef = useRef(null);
  const o = (k) => (v) => { setD(x => ({ ...x, [k]: k === 'soni' || k === 'sinfdosh' || k === 'birinchi' || k === 'keyingi' || k === 'oldinSon' ? v.replace(/[^\d]/g, '') : v })); setXato(null); };
  const oldinga = () => { setXato(null); const n = qi + 1 < otdi ? otdi : qi + 1; setOtdi(m => Math.max(m, n)); setQi(n); };
  const keyingi = () => {
    const k = qadamlar[qi];
    if (!s10Toldi(k, id, d)) { setXato({ x: k === 'nima' ? 'nima' : k, f: k === 'son' && id === 'qaytgan' ? (!sonmi(d.birinchi) ? 'birinchi' : 'keyingi') : S10_QADAM_F[k][0] }); return; }
    oldinga();
  };
  const och = (i) => { setQi(i); setXato(null); };
  const tanlaManba = (m) => { setD(x => ({ ...x, manba: m })); setXato(null); if (qadamlar[qi] === 'manba') { const n = qi + 1 < otdi ? otdi : qi + 1; setOtdi(mm => Math.max(mm, n)); setQi(n); } };
  const birinchiOlchov = () => { setD(x => ({ ...x, birinchiOlchov: true, oldinSon: '', oldinSana: '' })); oldinga(); };
  const saqla = () => {
    const t = s10Tekshir(id, d, h);
    const imzo = JSON.stringify(d);
    if (t && (t.blok || !(yumshoq && yumshoq === imzo))) {
      setXato(t); if (!t.blok) setYumshoq(imzo);
      const i = qadamlar.findIndex(k => S10_QADAM_F[k].includes(t.f)); if (i >= 0) setQi(i);
      return;
    }
    onSaqla(id, s10Qiymat(id, d, reja), iRef.current);
  };
  const ef = xato && xato.f;
  const tayyor = id === 'qaytgan' ? sonmi(d.birinchi) && sonmi(d.keyingi) && d.manba && d.sana : sonmi(d.soni) && d.manba && d.sana && (id !== 'bosh' || String(d.nima || '').trim());
  const izoh = id === 'royxat' ? (reja && reja.sinfdosh != null ? S10_IZOH.reja : S10_IZOH.royxat) : S10_IZOH[id] || null;
  const foiz = s10Foiz(d);
  const savol = (k) => {
    if (k === 'nima') return <Maydon iRef={iRef} y={tr(S10_QADAM_NOM.nima)} keng value={d.nima} onChange={o('nima')} max={120} err={ef === 'nima'} halqa={!String(d.nima || '').trim()} onEnter={keyingi} ph={tr({ uz: "Qaysi bitta raqam mahsulot ishini ko'rsatadi?", ru: "Какое одно число показывает работу продукта?" })} />;
    if (k === 'son') return id !== 'qaytgan'
      ? <div className="uc-qator-m">
          <Maydon iRef={iRef} y={tr(S10_QADAM_NOM.son)} son value={d.soni} onChange={o('soni')} max={7} err={ef === 'soni'} halqa={!d.soni} onEnter={keyingi} />
          {id === 'royxat' && <span className="uc-50">/ 50</span>}
          {id === 'royxat' && <Maydon y={tr({ uz: 'shundan sinfdosh', ru: "из них одноклассники" })} son value={d.sinfdosh} onChange={o('sinfdosh')} max={5} err={ef === 'sinfdosh'} onEnter={keyingi} />}
        </div>
      : <>
          <div className="uc-qator-m">
            <Maydon iRef={iRef} y={tr({ uz: 'Birinchi davrda ochgan', ru: "Открыли в первый период" })} son value={d.birinchi} onChange={o('birinchi')} max={6} err={ef === 'birinchi'} halqa={!d.birinchi} onEnter={keyingi} />
            <Maydon y={tr({ uz: 'Keyingi davrda ham ochgan', ru: "Открыли и в следующий период" })} son value={d.keyingi} onChange={o('keyingi')} max={6} err={ef === 'keyingi'} onEnter={keyingi} />
            <span className="uc-foiz">{foiz != null ? <b key={foiz}>{foiz}%</b> : '— %'} <i className="hv-birlik">{tr(birlikQ(trek))}</i></span>
          </div>
          <Maydon y={tr({ uz: 'Davrlar', ru: "Периоды" })} keng value={d.davr} onChange={o('davr')} max={40} ph={tr({ uz: 'Davrlar', ru: "Периоды" })} onEnter={keyingi} />
        </>;
    if (k === 'manba') return <div className={cxx('uc-manba-t', !d.manba && 'uc-chorla')}>
      {MANBALAR.map(m => <QChip key={m} className="uc-chip" holat={d.manba === m ? 'on' : ef === 'manba' && !d.manba ? 'err' : undefined} onClick={() => tanlaManba(m)}>{tr(MANBA_NOM[m])}</QChip>)}
    </div>;
    if (k === 'sana') return <Maydon y={tr(SANA_Y)} type="date" value={d.sana} onChange={o('sana')} err={ef === 'sana'} onEnter={keyingi} />;
    return <div className="uc-qator-m">
      {!d.birinchiOlchov && <Maydon y={tr({ uz: 'Oldingi son', ru: "Предыдущее число" })} son value={d.oldinSon} onChange={o('oldinSon')} max={6} onEnter={keyingi} />}
      {!d.birinchiOlchov && <Maydon y={tr(SANA_Y)} type="date" value={d.oldinSana} onChange={o('oldinSana')} onEnter={keyingi} />}
      <QChip className="uc-chip" holat={d.birinchiOlchov ? 'on' : undefined} onClick={d.birinchiOlchov ? () => setD(x => ({ ...x, birinchiOlchov: false })) : birinchiOlchov}>{tr({ uz: "Birinchi o'lchov", ru: "Первое измерение" })}</QChip>
    </div>;
  };
  return (
    <div ref={kRef} className={cxx('uc-karta', 'uc-kirish', xato && 'err')}>
      {sarlavha && <span className="q-yorliq">{sarlavha}</span>}
      <b className="uc-karta-nom">{tr(QATOR_NOM[id])}</b>
      {avtoOldin && <span className="uc-kulrang">{oldinMatn(avtoOldin)}</span>}
      <div className="uc-qadamlar">
        {qadamlar.map((k, i) => {
          if (i === qi) return (
            <div key={k} className="uc-sav fade-step">
              {k !== 'manba' && k !== 'son' && k !== 'nima' && <span className="uc-sav-y">{tr(S10_QADAM_NOM[k])}</span>}
              {k === 'manba' && <span className="uc-sav-y">{tr({ uz: 'Bu son qayerdan olindi?', ru: "Откуда взято это число?" })}</span>}
              {savol(k)}
              {i === 0 && izoh && <span className="uc-kulrang">{tr(izoh)}</span>}
              {xato && <QXato>{tr(S10_XATO[xato.x])}</QXato>}
              {xato && !xato.blok && <span className="uc-kulrang">{tr({ uz: 'Shunday qoldirsangiz — yana «Saqlash»ni bosing.', ru: "Если оставить так — снова нажмите «Сохранить»." })}</span>}
              {k !== 'manba' && <div className="uc-sav-t"><QTugma ikkinchi className={cxx(s10Toldi(k, id, d) && 'uc-halqa')} onClick={keyingi}>{tr({ uz: 'Keyingi', ru: 'Дальше' })}</QTugma></div>}
            </div>
          );
          if (i < otdi) return <button key={k} type="button" className="uc-yig" onClick={() => och(i)}><i>✓</i><span>{tr(S10_QADAM_NOM[k])}:</span><b>{s10Yigma(k, id, d)}</b></button>;
          return <span key={k} className="uc-kul-q">{tr(S10_QADAM_NOM[k])}</span>;
        })}
      </div>
      {yordam && <YordamBlok satrlar={S10_YORDAM[id]} />}
      <div className="uc-karta-tug">
        <QTugma className={cxx(tayyor && qi >= qadamlar.length && 'uc-halqa')} onClick={saqla}>{tr({ uz: 'Saqlash', ru: "Сохранить" })}</QTugma>
        <QTugma ikkinchi onClick={() => onSanalmagan(id, sanalmaganQiymat(id, d), iRef.current)}>{tr({ uz: 'Hali sanalmagan', ru: "Ещё не посчитано" })}</QTugma>
        {uyda && <QTugma ikkinchi onClick={onUyda}>{tr({ uz: 'Uyda tuzataman', ru: "Исправлю дома" })}</QTugma>}
        <QTugma ikkinchi className="uc-yordam-t" aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: "Подсказка" })}</QTugma>
      </div>
    </div>
  );
};
'''
s = s[:a] + QK + s[b:]
a = s.index('const PastkiKarta = (')
b = s.index('const qadamNomlari = ')
PK = r'''// F-1015-282 (213.11): pastki karta — uch qadam: qadamlar → lending → eslatmadan ochdi; hammasi ixtiyoriy, Saqlash doim
const PASTKI_QADAM = ['qadam', 'lending', 'eslatma'];
const PastkiKarta = ({ p0, nomlar, trek, kRef, onSaqla }) => {
  const [p, setP] = useState(() => ({ qadamlar: nomlar.map((_, i) => (p0 && p0.qadamlar && p0.qadamlar[i] != null ? String(p0.qadamlar[i]) : '')), lending: { tashrif: p0?.lending?.tashrif ?? '', bosish: p0?.lending?.bosish ?? '' }, eslatmadanOchdi: p0?.eslatmadanOchdi ?? '' }));
  const [qi, setQi] = useState(p0 ? PASTKI_QADAM.length : 0);
  const [otdi, setOtdi] = useState(qi);
  const [yordam, setYordam] = useState(false);
  const raq = (v) => String(v).replace(/[^\d]/g, '');
  const keyingi = () => { const n = qi + 1 < otdi ? otdi : qi + 1; setOtdi(m => Math.max(m, n)); setQi(n); };
  const nom = { qadam: tr({ uz: 'Qadamlar', ru: "Шаги" }) + ' · ' + tr(birlikQ(trek)), lending: tr({ uz: 'Lending', ru: "Лендинг" }) + ' · ' + tr({ uz: 'tashrif · bosish', ru: "посещение · нажатие" }), eslatma: trek === 'web' ? tr({ uz: 'xabardan ochdi', ru: "открыл из сообщения" }) : tr({ uz: 'eslatmadan ochdi', ru: "открыл из напоминания" }) };
  const yigma = (k) => (k === 'qadam' ? (nomlar.map((n, i) => (p.qadamlar[i] !== '' ? `${n.yoz || tr(n.mentor)} ${p.qadamlar[i]}` : null)).filter(Boolean).join(' · ') || '—')
    : k === 'lending' ? tr({ uz: `tashriflar ${p.lending.tashrif || '—'} · tugma ${p.lending.bosish || '—'}`, ru: `посещения ${p.lending.tashrif || '—'} · кнопка ${p.lending.bosish || '—'}` })
      : (p.eslatmadanOchdi || '—'));
  const savol = (k) => (k === 'qadam'
    ? <div className="uc-qator-m">{nomlar.map((n, i) => <Maydon key={i} y={n.yoz || tr(n.mentor)} son value={p.qadamlar[i]} onChange={(v) => setP(x => ({ ...x, qadamlar: x.qadamlar.map((q, j) => (j === i ? raq(v) : q)) }))} max={6} onEnter={keyingi} />)}</div>
    : k === 'lending'
      ? <div className="uc-qator-m">
          <Maydon y={tr({ uz: 'tashriflar', ru: "посещения" })} son value={p.lending.tashrif} onChange={(v) => setP(x => ({ ...x, lending: { ...x.lending, tashrif: raq(v) } }))} max={6} onEnter={keyingi} />
          <Maydon y={tr({ uz: 'tugma bosilishi', ru: "нажатия кнопки" })} son value={p.lending.bosish} onChange={(v) => setP(x => ({ ...x, lending: { ...x.lending, bosish: raq(v) } }))} max={6} onEnter={keyingi} />
        </div>
      : <Maydon y={nom.eslatma} son value={p.eslatmadanOchdi} onChange={(v) => setP(x => ({ ...x, eslatmadanOchdi: raq(v) }))} max={6} onEnter={keyingi} />);
  return (
    <div ref={kRef} className="uc-karta uc-kirish">
      <span className="q-yorliq">{tr({ uz: 'Pastda: qadamlar va lending', ru: "Внизу: шаги и лендинг" })}</span>
      <div className="uc-qadamlar">
        {PASTKI_QADAM.map((k, i) => {
          if (i === qi) return (
            <div key={k} className="uc-sav fade-step">
              <span className="uc-sav-y">{nom[k]}</span>
              {savol(k)}
              {k === 'qadam' && <span className="uc-kulrang">{tr({ uz: "Bo'sh qoldirsangiz bo'ladi — zaxira rejada qayerda kamligini shu sonlar ko'rsatadi.", ru: "Можно оставить пустым — в запасном плане эти числа покажут, где мало." })}</span>}
              {k === 'eslatma' && <span className="uc-kulrang">{tr({ uz: "9-darsdagi tekshiruv yozuvlarini o'chirmagan bo'lsangiz — yoniga «o'z qurilmam ham bor» deb yozing.", ru: "Если не удалили проверочные записи 9-го урока — допишите рядом «есть и моё устройство»." })}</span>}
              <div className="uc-sav-t"><QTugma ikkinchi className="uc-halqa" onClick={keyingi}>{tr({ uz: 'Keyingi', ru: 'Дальше' })}</QTugma></div>
            </div>
          );
          if (i < otdi) return <button key={k} type="button" className="uc-yig" onClick={() => setQi(i)}><i>✓</i><span>{nom[k]}:</span><b>{yigma(k)}</b></button>;
          return <span key={k} className="uc-kul-q">{nom[k]}</span>;
        })}
      </div>
      {yordam && <YordamBlok satrlar={S10_YORDAM.pastki} />}
      <div className="uc-karta-tug">
        <QTugma className={cxx(qi >= PASTKI_QADAM.length && 'uc-halqa')} onClick={() => onSaqla(p)}>{tr({ uz: 'Saqlash', ru: "Сохранить" })}</QTugma>
        <QTugma ikkinchi className="uc-yordam-t" aria-expanded={yordam} onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: "Подсказка" })}</QTugma>
      </div>
    </div>
  );
};
'''
s = s[:a] + PK + s[b:]

# ---------- CSS: bittadan forma + kirish animatsiyasi ----------
rep("        /* --- Karta (bittadan; E 53) --- */\n",
"""        /* --- Karta (bittadan; E 53) --- */
        /* F-1015-282 (213.11): savol kartasi · yig'ilgan yashil qator · navbatdagi kulrang qator */
        .uc-qadamlar { display: flex; flex-direction: column; gap: 8px; }
        .uc-sav { display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: 12px; border: 1.5px solid ${T.accent}; background: ${T.paper}; min-width: 0; }
        .uc-sav-y { font-size: 11px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; color: ${T.accent}; }
        .uc-sav-t { display: flex; justify-content: flex-end; }
        .uc-yig { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; width: 100%; padding: 8px 14px; border-radius: 12px; border: 0; background: ${T.okFon}; color: ${T.ok}; font-family: inherit; font-size: 13.5px; font-weight: 700; text-align: left; cursor: pointer; }
        .uc-yig i { font-style: normal; font-weight: 800; } .uc-yig b { font-weight: 700; min-width: 0; overflow-wrap: anywhere; } .uc-yig.yopiq { cursor: default; }
        .uc-kul-q { padding: 8px 14px; border-radius: 12px; background: ${T.bg}; color: ${T.ink2}; font-size: 13px; font-weight: 600; }
        .uc-karta-kir { animation: uc-kir .4s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .uc-karta-kir { animation: none; } }
""")
open(p, 'w', encoding='utf-8').write(s)
print('ok')
