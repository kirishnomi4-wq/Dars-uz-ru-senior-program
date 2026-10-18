const Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  // F-1015-352 (foydalanuvchi): a1 da qo'shish (spread) yoziladi — yakuniy endi o'chirish (filter) qatorini so'raydi
  const [value, setValue] = useState(typeof storedAnswer?.picked === 'string' ? storedAnswer.picked : '');
  const [passed, setPassed] = useState(!!storedAnswer?.correct);
  const norm = value.replace(/\s+/g, ' ').trim();
  const valid = /^setGames\(\s*games\s*\.\s*filter\(\s*\(?\s*([A-Za-z_]\w*)\s*\)?\s*=>\s*\1\s*\.\s*id\s*!==?\s*id\s*\)\s*\)\s*;?$/.test(norm);
  const hasSet = /setGames\s*\(/.test(value);
  const hasFilter = /games\s*\.\s*filter\s*\(/.test(value);
  const hasCond = /\.\s*id\s*!==?\s*id\b/.test(value);
  const spliceBug = /\.\s*splice\b/.test(value);
  useEffect(() => {
    if (valid && !passed) {
      setPassed(true);
      onAnswer(screen, { stage: 'final', screenIdx: screen, question: 'VS Code: setGames(games.filter(g => g.id !== id)) ni yozing', studentAnswer: value, correct: true, firstAttemptCorrect: true, solved: true, picked: value });
    }
  }, [valid]);
  const Ln = ({ n, children }) => (
    <div className="vsc-line"><span className="vsc-ln">{n}</span><span style={{ whiteSpace: 'pre' }}>{children}</span></div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · amaliy', ru: 'Финал · практика' })} screen={screen} scrollSignal={passed} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!passed} label={passed ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Kodni yozing', ru: 'Напишите код' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Oxirgi qadam: <span className="italic" style={{ color: T.accent }}>o'chirish</span> kodini o'zingiz yozing.</>, ru: <>Последний шаг: сами напишите код <span className="italic" style={{ color: T.accent }}>удаления</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>VS Code'da <span className="mono">App.jsx</span> ochiq: <span className="mono">ochirish(id)</span> funksiyasi tayyor — faqat <b style={{ color: T.ink }}>2-qator bo'sh</b>. Bosilgan o'yindan boshqa hammasi ro'yxatda qolsin.</>, ru: <>В VS Code открыт <span className="mono">App.jsx</span>: функция <span className="mono">ochirish(id)</span> готова — пуста только <b style={{ color: T.ink }}>2-я строка</b>. Пусть в списке останутся все игры, кроме нажатой.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="vsc fade-up delay-2">
              <div className="vsc-bar">
                <span className="vsc-tab on"><span style={{ color: '#61DAFB' }}>⚛</span> App.jsx <span style={{ color: '#6E7681', marginLeft: 4 }}>×</span></span>
                <span className="vsc-tab">GameCard.jsx</span>
              </div>
              <div className="vsc-body">
                <Ln n={1}><Jx>{'function'}</Jx><span style={{ color: '#DCDCAA' }}> ochirish</span>{'(id) {'}</Ln>
                <div className="vsc-line">
                  <span className="vsc-ln">2</span>
                  <span style={{ whiteSpace: 'pre' }}>{'  '}</span>
                  <input className={`vsc-input ${valid ? 'ok' : ''}`} value={value} onChange={e => setValue(e.target.value)} placeholder='…' spellCheck={false} autoCapitalize="off" autoComplete="off" aria-label={tr({ uz: "2-qator — o'chirish kodi", ru: 'Строка 2 — код удаления' })} />
                </div>
                <Ln n={3}>{'}'}</Ln>
              </div>
            </div>
            <div className="fade-up delay-2" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="tagpill" style={{ opacity: hasSet ? 1 : 0.4 }}>{hasSet ? '✓' : '1'} {tr({ uz: "state'ni yangilash", ru: 'обновить state' })}</span>
              <span className="tagpill" style={{ opacity: hasFilter ? 1 : 0.4 }}>{hasFilter ? '✓' : '2'} {tr({ uz: 'elak', ru: 'фильтр' })}</span>
              <span className="tagpill" style={{ opacity: hasCond ? 1 : 0.4 }}>{hasCond ? '✓' : '3'} {tr({ uz: 'shu id dan boshqasi', ru: 'кроме этого id' })}</span>
            </div>
            {spliceBug && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><span className="mono">splice</span> ham <span className="mono">push</span> kabi eski ro'yxatni buzadi — React ko'rmaydi. Yangi ro'yxat kerak: <span className="mono">filter</span>.</>, ru: <><span className="mono">splice</span>, как и <span className="mono">push</span>, портит старый список — React не увидит. Нужен новый список: <span className="mono">filter</span>.</> })}</p></div>}
            {passed && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "✓ Mukammal! O'chirish ishladi — shu o'yindan boshqa hammasi qoldi. To'liq CRUD ilovasi sizning qo'lingizda.", ru: '✓ Отлично! Удаление сработало — остались все, кроме этой игры. Полное CRUD-приложение в Ваших руках.' })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'natija · ochirish(2)', ru: 'результат · ochirish(2)' })}</p>
            <Win title={tr({ uz: "Mening o'yinlarim — localhost:5173", ru: 'Мои игры — localhost:5173' })} minH={130}>
              <div className="fade-step"><CardGrid cols={3}>{GAMES.slice(0, 3).filter(g => !(valid && g.id === 2)).map(g => <MyCard key={g.id} game={g} dim={!valid && g.id === 2} />)}</CardGrid></div>
            </Win>
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};
