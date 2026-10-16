# F-1016-01 — m2-08 PracticeLesson1 · Screen15 («Oxirgi sinov») — mentor fidbeki TUZATILDI

**Kim uchun:** praktika seansi. PracticeLesson1 ni qayta qurayotganda bu tuzatish **yo'qolmasin** —
eski nusxa ustidan yozilmasin; Screen15 qolsa, shu mantiq saqlanadi (yoki ekran o'zgarsa — shu mantiqqa mos bo'lsin).

**Sana:** 16.10 17:33 · **Seans:** alohida (mentor savoli, foydalanuvchi buyrug'i bilan) · commit YO'Q

## Mentor nima dedi
Rasm: `F-1016-01-mentor-rasm.png`. «Hover + Rangni o'zgartir belgiladim — qulf turibdi, ishlamadi.
Birinchisi ishlaydi, qolganlari qulfda qotib qoladi.»
Qo'shimcha topilgan: noto'g'ri tanlovda ham yashil «Mukammal!» turardi (bir marta yechilgandan keyin `passed` doim true);
kod oynasida `tugma.scroll` chiqardi (`onscroll` emas).

## Nima qilindi (faqat `Screen15`, ~1391–1470-qatorlar)
- Tugma qulfi faqat **tanlovgacha** («🔒 Avval tanlang»). Ikkalasi tanlangach tugma doim bosiladi va o'zini haqiqatdagidek tutadi:
  - Hover + Rang → sichqoncha ustiga kelganda rang o'zgaradi; izoh «Ishladi, lekin… Maqsad — bosilganda. Hodisani almashtiring.»
  - Aylantirilganda + … → bosilsa hech narsa bo'lmaydi + sababi
  - … + Hech narsa → «Hech narsa o'zgarmadi — reaksiya yo'q»
  - … + Sahifani o'chir → sahifa o'chadi, «Qaytarish» tugmasi
  - Bosilganda + Rang → avvalgidek (rang o'zgaradi, «Mukammal!», «Davom etish» ochiladi)
- Yashil «Mukammal!» → `passed && ready` (faqat hozirgi tanlov to'g'ri bo'lsa).
- Kod oynasi: `onclick` / `onmouseover` / `onscroll`; reaksiya izohi tanlovga mos.
- Ball mantiqi (`markWrong`, birinchi urinish, `onAnswer`) **o'zgarmadi**.

## Tekshiruv
- `npm run gates` → 10/12; yiqilgan **tell** (QUIZ_BANK 2019, 2028) va **emoji** (351, 2087) — tahrirdan OLDIN ham bor, Screen15 ga aloqasiz.
- Playwright (chrome, 1280): 7 holat — hammasi kutilgandek, pageerror 0. Surat: `F-1016-01-screen15-hover.png`.

## Diff
```diff
--- /tmp/claude-1000/-home-kali-Desktop-internetLesson/753ccc49-974b-42a8-9cbe-f6d6cd1a3194/scratchpad/PracticeLesson1.oldin.jsx	2026-10-16 17:22:42.365513825 +0500
+++ src/2-Modull/PracticeLesson1.jsx	2026-10-16 17:22:43.396504783 +0500
@@ -1393,6 +1393,10 @@
   const [react, setReact] = useState(storedAnswer ? 'color' : null);
   const [passed, setPassed] = useState(!!(storedAnswer && (storedAnswer.solved || storedAnswer.correct)));
   const [bg, setBg] = useState(false);
+  // Mentor-fidbek: tugma tanlangan juftlikka qarab o'zini haqiqatdagidek tutadi (qulf faqat tanlovgacha)
+  const [deleted, setDeleted] = useState(false);
+  const [tried, setTried] = useState(false);
+  const resetSite = () => { setBg(false); setDeleted(false); setTried(false); };
   // Ball — birinchi urinish (8-A, Q4): noto'g'ri hodisa yoki reaksiya chipi tanlansa — urinish xato (F5 dan keyin ham)
   const achMiss = useContext(AchMissCtx);
   const wrongEverRef = useRef(false);
@@ -1400,6 +1404,17 @@
   const evtOk = evt === 'click';
   const reactOk = react === 'color';
   const ready = evtOk && reactOk;
+  const both = !!(evt && react);
+  const onSiteClick = () => { if (!both) return; setTried(true); if (evt !== 'click') return; if (react === 'color') setBg(b => !b); else if (react === 'delete') setDeleted(true); };
+  const onSiteEnter = () => { if (!both || evt !== 'hover') return; setTried(true); if (react === 'color') setBg(true); else if (react === 'delete') setDeleted(true); };
+  const onSiteLeave = () => { if (evt === 'hover' && react === 'color') setBg(false); };
+  const outcome = !both ? null
+    : ready ? (bg ? tr({ uz: "Bosdingiz — sahifa rangi o'zgardi! Yana bosing, qaytadi.", ru: 'Вы нажали — цвет страницы изменился! Нажмите ещё раз — вернётся.' }) : tr({ uz: "Tugmani bosing — sahifa rangi darhol o'zgaradi.", ru: 'Нажмите кнопку — цвет страницы сразу изменится.' }))
+    : !tried ? tr({ uz: "Tugmani bosib ko'ring — nima bo'ladi?", ru: 'Нажмите кнопку — что произойдёт?' })
+    : deleted ? tr({ uz: "Sahifa o'chdi — maqsad bu emas edi. Reaksiyani almashtiring.", ru: 'Страница удалилась — цель была не эта. Смените реакцию.' })
+    : evt === 'scroll' ? tr({ uz: "Bosdingiz — hech narsa bo'lmadi: «Aylantirilganda» bosishni sezmaydi. Hodisani almashtiring.", ru: 'Вы нажали — ничего не произошло: «При прокрутке» не замечает нажатие. Смените событие.' })
+    : react === 'nothing' ? tr({ uz: "Hech narsa o'zgarmadi — reaksiya yo'q. Reaksiyani almashtiring.", ru: 'Ничего не изменилось — реакции нет. Смените реакцию.' })
+    : tr({ uz: "Ishladi, lekin sichqoncha tugma ustiga kelganda. Maqsad — bosilganda. Hodisani almashtiring.", ru: 'Сработало, но при наведении мыши. Цель — при нажатии. Смените событие.' });
   useEffect(() => { if (ready && !passed) { setPassed(true); const first = !wrongEverRef.current && !(achMiss && achMiss.missed.has(SCREEN_META[screen].id)); onAnswer(screen, { stage: 'final', screenIdx: screen, question: tr({ uz: "Tugmani jonlantirish: hodisa + reaksiya", ru: 'Оживить кнопку: событие + реакция' }), studentAnswer: `${evt}+${react}`, correct: first, firstAttemptCorrect: first, solved: true, picked: first ? 0 : 1 }); } }, [ready]);
   const EVTS = [{ id: 'click', l: tr({ uz: 'Bosilganda (click)', ru: 'При нажатии (click)' }) }, { id: 'hover', l: 'Hover' }, { id: 'scroll', l: tr({ uz: 'Aylantirilganda', ru: 'При прокрутке' }) }];
   const REACTS = [{ id: 'color', l: tr({ uz: "Rangni o'zgartir", ru: 'Изменить цвет' }) }, { id: 'delete', l: tr({ uz: "Sahifani o'chir", ru: 'Удалить страницу' }) }, { id: 'nothing', l: tr({ uz: 'Hech narsa', ru: 'Ничего' }) }];
@@ -1413,17 +1428,17 @@
           <Col>
             <p className="flow-label">{tr({ uz: '1. Qaysi HODISA?', ru: '1. Какое СОБЫТИЕ?' })}</p>
             <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
-              {EVTS.map(e => <button key={e.id} className={`chip ${evt === e.id ? 'chip-on' : ''}`} onClick={() => { setEvt(e.id); setBg(false); if (e.id !== 'click') markWrong(); }} style={evt === e.id && e.id === 'click' ? { background: T.successSoft, color: T.success, boxShadow: `0 0 0 2px ${T.success}` } : undefined} /* F-0926-06: baland rang -> soft (159/10) */>{e.l}</button>)}
+              {EVTS.map(e => <button key={e.id} className={`chip ${evt === e.id ? 'chip-on' : ''}`} onClick={() => { setEvt(e.id); resetSite(); if (e.id !== 'click') markWrong(); }} style={evt === e.id && e.id === 'click' ? { background: T.successSoft, color: T.success, boxShadow: `0 0 0 2px ${T.success}` } : undefined} /* F-0926-06: baland rang -> soft (159/10) */>{e.l}</button>)}
             </div>
             {evt && <p className="small fade-step" style={{ margin: 0, fontWeight: 600, color: evtOk ? T.success : T.accent }}>{evtOk ? tr({ uz: "✓ Tugma aynan bosishni sezadi", ru: '✓ Кнопка замечает именно нажатие' }) : tr({ uz: "✗ Bu hodisa tugma bosilishini sezmaydi.", ru: '✗ Это событие не замечает нажатие кнопки.' }) /* F-0926-06: javobni aytmaydi (159/11) */}</p>}
             <p className="flow-label" style={{ marginTop: 4 }}>{tr({ uz: '2. Qaysi REAKSIYA?', ru: '2. Какая РЕАКЦИЯ?' })}</p>
             <div className="fade-up delay-2" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
-              {REACTS.map(r => <button key={r.id} className={`chip ${react === r.id ? 'chip-on' : ''}`} onClick={() => { setReact(r.id); setBg(false); if (r.id !== 'color') markWrong(); }} style={react === r.id && r.id === 'color' ? { background: T.successSoft, color: T.success, boxShadow: `0 0 0 2px ${T.success}` } : undefined}>{r.l}</button>)}
+              {REACTS.map(r => <button key={r.id} className={`chip ${react === r.id ? 'chip-on' : ''}`} onClick={() => { setReact(r.id); resetSite(); if (r.id !== 'color') markWrong(); }} style={react === r.id && r.id === 'color' ? { background: T.successSoft, color: T.success, boxShadow: `0 0 0 2px ${T.success}` } : undefined}>{r.l}</button>)}
             </div>
             {react && <p className="small fade-step" style={{ margin: 0, fontWeight: 600, color: reactOk ? T.success : T.accent }}>{reactOk ? tr({ uz: "✓ Rang o'zgaradi — maqsad shu", ru: '✓ Цвет изменится — это и есть цель' }) : (react === 'delete' ? tr({ uz: "✗ Bu sahifani o'chiradi — maqsadga mos emas", ru: '✗ Это удалит страницу — не соответствует цели' }) : tr({ uz: "✗ 'Hech narsa' bo'lsa sayt jonlanmaydi", ru: '✗ Если «ничего» — сайт не оживёт' }))}</p>}
             <div className="codebox" style={{ marginTop: 6 }}>
-              <div><FN>tugma</FN>.<FN>{evt === 'click' ? 'onclick' : (evt || '???')}</FN> = () =&gt; {'{'}</div>
-              <div style={{ paddingLeft: 18 }}>{reactOk ? <>sahifa.<FN>rang</FN> = <STR>{tr({ uz: '"yangi"', ru: '"новый"' })}</STR></> : <CM>{tr({ uz: '// reaksiyani tanlang', ru: '// выберите реакцию' })}</CM>}</div>
+              <div><FN>tugma</FN>.<FN>{({ click: 'onclick', hover: 'onmouseover', scroll: 'onscroll' })[evt] || '???'}</FN> = () =&gt; {'{'}</div>
+              <div style={{ paddingLeft: 18 }}>{reactOk ? <>sahifa.<FN>rang</FN> = <STR>{tr({ uz: '"yangi"', ru: '"новый"' })}</STR></> : <CM>{react === 'delete' ? tr({ uz: "// sahifani o'chiradi", ru: '// удаляет страницу' }) : react === 'nothing' ? tr({ uz: "// bo'sh — hech narsa", ru: '// пусто — ничего' }) : tr({ uz: '// reaksiyani tanlang', ru: '// выберите реакцию' })}</CM>}</div>
               <div>{'}'}</div>
             </div>
           </Col>
@@ -1434,13 +1449,18 @@
               <span className="tagpill" style={{ background: react ? (reactOk ? T.successSoft : T.accentSoft) : T.paper, color: react ? (reactOk ? T.success : T.accent) : T.ink3 }}>{react ? (reactOk ? '✓' : '✗') : '2'} {tr({ uz: 'REAKSIYA', ru: 'РЕАКЦИЯ' })}</span>
             </div>
             <Browser>
-              <div style={{ borderRadius: 12, padding: 'clamp(22px,4vw,34px)', textAlign: 'center', transition: 'background .35s ease', background: bg ? T.accent : '#FFFFFF', border: `1.5px solid ${bg ? T.accent : '#E6E1D8'}` }}>
-                <p className="small" style={{ margin: '0 0 14px', fontWeight: 700, letterSpacing: '0.03em', color: bg ? '#fff' : T.ink2 }}>{tr({ uz: 'Sahifa rangi:', ru: 'Цвет страницы:' })} {bg ? tr({ uz: "TO'Q SARIQ", ru: 'ОРАНЖЕВЫЙ' }) : tr({ uz: 'OQ', ru: 'БЕЛЫЙ' })}</p>
-                <button className={`site-btn ${ready && !bg ? 'glow-btn' : ''}`} disabled={!ready} onClick={() => { if (ready) setBg(b => !b); }} style={{ opacity: ready ? 1 : 0.5, background: bg ? '#fff' : T.accent, color: bg ? T.accent : '#fff' }}>{ready ? tr({ uz: 'Tugmani bos', ru: 'Нажми кнопку' }) : tr({ uz: '🔒 qulflangan', ru: '🔒 заблокировано' })}</button>
-              </div>
+              {deleted
+                ? <div className="fade-step" style={{ borderRadius: 12, padding: 'clamp(22px,4vw,34px)', textAlign: 'center', background: T.bg, border: '1.5px dashed #E6E1D8' }}>
+                    <p className="small" style={{ margin: '0 0 14px', fontWeight: 700, color: T.ink3 }}>{tr({ uz: "Sahifa o'chdi", ru: 'Страница удалена' })}</p>
+                    <button className="site-btn" onClick={resetSite}>{tr({ uz: 'Qaytarish', ru: 'Вернуть' })}</button>
+                  </div>
+                : <div style={{ borderRadius: 12, padding: 'clamp(22px,4vw,34px)', textAlign: 'center', transition: 'background .35s ease', background: bg ? T.accent : '#FFFFFF', border: `1.5px solid ${bg ? T.accent : '#E6E1D8'}` }}>
+                    <p className="small" style={{ margin: '0 0 14px', fontWeight: 700, letterSpacing: '0.03em', color: bg ? '#fff' : T.ink2 }}>{tr({ uz: 'Sahifa rangi:', ru: 'Цвет страницы:' })} {bg ? tr({ uz: "TO'Q SARIQ", ru: 'ОРАНЖЕВЫЙ' }) : tr({ uz: 'OQ', ru: 'БЕЛЫЙ' })}</p>
+                    <button className={`site-btn ${ready && !bg ? 'glow-btn' : ''}`} disabled={!both} onClick={onSiteClick} onMouseEnter={onSiteEnter} onMouseLeave={onSiteLeave} style={{ opacity: both ? 1 : 0.5, background: bg ? '#fff' : T.accent, color: bg ? T.accent : '#fff' }}>{both ? tr({ uz: 'Tugmani bos', ru: 'Нажми кнопку' }) : tr({ uz: '🔒 Avval tanlang', ru: '🔒 Сначала выберите' })}</button>
+                  </div>}
             </Browser>
-            {ready && <p className="small" style={{ margin: 0, color: T.ink3 }}>{/* F-0926-06: tanlovgacha yozuv olindi — mentor takrori (159/7) */}{(bg ? tr({ uz: "Bosdingiz — sahifa rangi o'zgardi! Yana bosing, qaytadi.", ru: 'Вы нажали — цвет страницы изменился! Нажмите ещё раз — вернётся.' }) : tr({ uz: "Tugmani bosing — sahifa rangi darhol o'zgaradi.", ru: 'Нажмите кнопку — цвет страницы сразу изменится.' }))}</p>}
-            {passed
+            {outcome && <p className="small" style={{ margin: 0, color: !ready && tried ? T.accent : T.ink3, fontWeight: !ready && tried ? 600 : 400 }}>{/* F-0926-06: tanlovgacha yozuv olindi — mentor takrori (159/7) */}{outcome}</p>}
+            {passed && ready
               ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Mukammal! <b>Bosish</b> hodisasi va <b>rangni o'zgartirish</b> reaksiyasi birga — tugma jonlandi. Siz uni o'zingiz jonlantirdingiz.</>, ru: <>Отлично! Событие <b>клик</b> и реакция <b>изменить цвет</b> вместе — кнопка ожила. Вы оживили её сами.</> })}</p></div>
               : <p className="body" style={{ margin: 0, color: T.ink3, fontSize: 13 }}>{tr({ uz: "Maslahat: maqsad gapini qayta o'qing — unda hodisa ham, reaksiya ham bor.", ru: 'Подсказка: перечитайте цель — в ней есть и событие, и реакция.' }) /* F-0926-06: qayerga qarashni aytadi (V2) */}</p>}
           </Col>
```
