
// ============================================================
//  NEST DARSLARI RASMI (F-1120-02) — Nest-1 (parts/*) va Nest-2 (yig.sh) ga yig'iladi.
//  Nest mashinasi: brauzer → Controller → Service, Module ro'yxati, Nest konteyneri; DI, «Buzamiz» kichik rasmlari,
//  Module ro'yxatlari, o'quvchi loyihasi yo'li (KitchenMap). Umumiy qism — parts/02b-rasm.jsx.
// ============================================================
// ---------- Katta mashina: brauzer + Nest ilovasi (Module, Controller, Service) + yo'laklar ----------
// st: br · mod · ctrl · svc — '' | 'hl' | 'g' | 'dim' | 'off'
// pkt: { x: 'b'|'c'|'s', lane: 1|2, label, grn, off, loop } · fill: [so'rov yo'lagi, javob yo'lagi] px (0…501)
const NM_X = { b: 105, c: 348, s: 606 };
const N1_APP = {
  names: { ctrl: 'AppController', svc: 'AppService', mod: 'AppModule' },
  files: { ctrl: 'src/app.controller.ts', svc: 'src/app.service.ts' },
  codes: { ctrl: '<span class="n1-d">@Get</span>() getHello()', svc: "<span class=\"n1-k\">return</span> <span class=\"n1-s\">'Hello World!'</span>" },
  chips: ['controllers: [AppController]', 'providers: [AppService]'],
};
const N1_CARS = {
  names: { ctrl: 'CarsController', svc: 'CarsService', mod: 'CarsModule' },
  files: { ctrl: 'src/cars/cars.controller.ts', svc: 'src/cars/cars.service.ts' },
  codes: { ctrl: '<span class="n1-d">@Get</span>() findAll()', svc: '<span class="n1-k">return this</span>.cars' },
  chips: ['controllers: [CarsController]', 'providers: [CarsService]'],
};
function NestMachine({ cfg = N1_APP, st = {}, url = 'localhost:3000', out, outKind, roles, lab, sock, exp, links, modHot, lanes, pkt, fill = [0, 0], readRow, read, tag, max, extra }) {
  const frameBottom = exp != null ? 330 : 292;
  const lanesTop = frameBottom + 30;
  const readTop = lanes ? lanesTop + 108 : frameBottom + 18;
  const H = readRow ? readTop + 48 : (lanes ? lanesTop + 94 : frameBottom + 6);
  const y1 = lanesTop + 30, y2 = lanesTop + 66;
  const R = roles || { ctrl: t("so'rovni qabul qiladi", 'принимает запрос'), svc: t('ishni bajaradi', 'выполняет работу') };
  const part = (k, x) => (
    <div className="n1-part n1-st" data-st={st[k] || ''} style={{ '--c': k === 'ctrl' ? PART.ctrl : PART.svc, left: x, top: 124, width: 236, height: 152 }}>
      <div className="nm"><i />{cfg.names[k]}</div>
      <div className="role">{R[k]}</div>
      {!(sock && sock[k]) && <span className="cd" dangerouslySetInnerHTML={html(cfg.codes[k])} />}
      {sock && sock[k] && <span className={`n1-sock${sock[k].er ? ' er' : ''}`} style={{ left: 14, top: 72, width: 150 }}>{sock[k].t}</span>}
      {lab && lab[k] && <span className="lab"><span className="n1-lab">{lab[k]}</span></span>}
      <span className="fl">{cfg.files[k]}</span>
    </div>
  );
  return <N1Fit w={760} h={H} max={max}>
    {tag && <span className="n1-tagl" style={{ left: 20, top: 8 }}>{tag}</span>}
    <div className="n1-br n1-st" data-st={st.br || ''} style={{ left: 20, top: 58, width: 170, height: 170 }}>
      <div className="top"><i /><i /><i /><span>{url}</span></div>
      <div className="bd">{out == null ? <span className="wait">{t('javob kutilmoqda…', 'ждём ответ…')}</span> : <span key={String(out)} className={`out${outKind ? ' ' + outKind : ''}`}>{out}</span>}</div>
    </div>
    <span className="n1-cap" style={{ left: 20, top: 236, width: 170 }}>{t('Brauzer · loyihadan tashqarida', 'Браузер · вне проекта')}</span>
    <div className="n1-app" style={{ left: 214, top: 34, width: 526, height: frameBottom - 34 }} />
    <span className="n1-tagl" style={{ left: 230, top: 44 }}>{t('Nest ilovasi · cars-api', 'Приложение Nest · cars-api')}</span>
    <div className="n1-mod n1-st" data-st={st.mod || ''} style={{ left: 230, top: 66, width: 494, height: 44 }}>
      <span className="lg">{cfg.names.mod} · {t("ro'yxat", 'список')}</span>
      {lab && lab.mod && <span className="lab"><span className="n1-lab">{lab.mod}</span></span>}
    </div>
    <span className={`n1-chip${modHot ? ' hot' : ''}`} style={{ left: 348, top: 76, transform: 'translateX(-50%)' }}>{cfg.chips[0]}</span>
    <span className={`n1-chip${modHot ? ' hot' : ''}`} style={{ left: 606, top: 76, transform: 'translateX(-50%)' }}>{cfg.chips[1]}</span>
    <i className={`n1-link${links ? ' on' : ''}`} style={{ left: 347, top: 110, height: 14 }} />
    <i className={`n1-link${links ? ' on' : ''}`} style={{ left: 605, top: 110, height: 14 }} />
    {part('ctrl', 230)}
    {part('svc', 488)}
    {exp != null && <div className="n1-exp n1-st" data-st={exp} style={{ left: 230, top: 288, width: 494, height: 30 }}><b>{t('Ichida: Express', 'Внутри: Express')}</b><span>(platform-express) — {t("so'rovni haqiqatda shu qabul qiladi", 'запрос на самом деле принимает он')}</span></div>}
    {lanes && <>
      <i className="n1-stem" style={{ left: 104, top: 252, height: lanesTop - 252 }} />
      <i className="n1-stem" style={{ left: 347, top: 276, height: lanesTop - 276 }} />
      <i className="n1-stem" style={{ left: 605, top: 276, height: lanesTop - 276 }} />
      <div className="n1-lanes" style={{ left: 20, top: lanesTop, width: 720, height: 94 }}>
        <i className="n1-ln" style={{ left: 85, width: 501, top: 30 }} />
        <i className="n1-ln" style={{ left: 85, width: 501, top: 66 }} />
        <i className="n1-lf r" style={{ left: 85, top: 30, width: fill[0] }} />
        <i className="n1-lf g" style={{ right: 720 - 586, top: 66, width: fill[1] }} />
        {[85, 328, 586].map((x) => <React.Fragment key={x}><i className="n1-stn" style={{ left: x, top: 31 }} /><i className="n1-stn" style={{ left: x, top: 67 }} /></React.Fragment>)}
        <span className="n1-lbl" style={{ top: 31 }}>{t("so'rov →", 'запрос →')}</span>
        <span className="n1-lbl" style={{ top: 67 }}>{t('← javob', '← ответ')}</span>
      </div>
      {pkt && <span className={`n1-pk${pkt.grn ? ' grn' : ''}${pkt.off ? ' off' : ''}${pkt.loop ? ' loop' : ''}`} style={pkt.loop ? { '--xa': NM_X.b + 'px', '--xc': NM_X.s + 'px', '--y1': y1 + 'px', '--y2': y2 + 'px', left: NM_X.b, top: y1 } : { left: NM_X[pkt.x || 'b'], top: pkt.lane === 2 ? y2 : y1 }}>{pkt.label}</span>}
    </>}
    {readRow && <div className={`n1-ro${read ? '' : ' off'}`} style={{ left: 20, top: readTop, width: 720, height: 46 }}>{read && <><span className="rf">{read[0]}</span><code dangerouslySetInnerHTML={html(read[1])} /></>}</div>}
    {extra}
  </N1Fit>;
}

// ---------- 14-ekran: Dependency Injection — Nest konteyneri instance'ni konstruktorga olib boradi ----------
// st qadamlari (S11 segmentlari bilan bir xil tartib): a savol · b Express · c providers · d instance · e konstruktorga · f nom · g foyda · h xulosa
function DiMachine({ beat }) {
  const T8 = [
    // mod, box, ctrl, prov, prm, sock, tok, pth, row, rowDim, ro
    ['g', 'g', 'hl', 0, 1, 'wait', 'off', '', 1, 0, null],
    ['g', 'g', 'dim', 0, 0, 'empty', 'off', '', 2, 0, null],
    ['hl', '', 'dim', 1, 0, 'empty', 'off', 'dash', 2, 1, ['src/app.module.ts:8', 'providers: [<span class="n1-c">AppService</span>],']],
    ['', 'hl', 'dim', 0, 0, 'empty', 'box', 'dash', 2, 1, ['terminal', '[Nest] LOG [InstanceLoader] <span class="n1-ok">AppModule dependencies initialized</span>']],
    ['', '', 'hl', 0, 1, 'full', 'slot', 'solid', 2, 1, ['terminal', '[Nest] LOG [InstanceLoader] <span class="n1-ok">AppModule dependencies initialized</span>']],
    ['', '', '', 0, 0, 'full', 'slot', 'solid', 2, 1, ['terminal', '[Nest] LOG [InstanceLoader] <span class="n1-ok">AppModule dependencies initialized</span>']],
    ['', '', '', 0, 0, 'full', 'slot', 'solid', 3, 0, null],
    ['', '', '', 1, 1, 'full', 'slot', 'solid', 3, 1, null],
  ][Math.min(beat, 7)];
  const [mod, box, ctrl, prov, prm, sock, tok, pth, row, rowDim, ro] = T8;
  const slot = tok === 'slot';
  const rowCls = (r) => `n1-row${row === r ? ' on' : ''}${row === r && rowDim ? ' dim' : ''}`;
  const files = [['cars.js', 1], ['orders.js', 2], ['users.js', 3]];
  return <N1Fit w={760} h={510}>
    <span className="n1-tagl" style={{ left: 26, top: 8 }}>{t("Nest ishga tushganda — birinchi so'rovdan oldin", 'Когда Nest запускается — до первого запроса')}</span>
    <div className="n1-mod n1-st" data-st={mod} style={{ left: 26, top: 40, width: 708, height: 46, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px' }}>
      <span className="lg">AppModule</span>
      <span className="n1-chip" style={{ position: 'static' }}>controllers: [AppController]</span>
      <span className={`n1-chip${prov ? ' hot' : ''}`} style={{ position: 'static' }}>providers: [AppService]</span>
      <span className={`n1-you${beat >= 7 ? ' on' : ''}`} style={{ position: 'static' }}>{t('1 · siz yozasiz', '1 · пишете вы')}</span>
      <span style={{ marginLeft: 'auto', font: `500 11px ${MONO}`, color: T.ink3 }}>src/app.module.ts</span>
    </div>
    <svg className="n1-svg" width="760" height="510" viewBox="0 0 760 510"><defs><marker id="n1ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill={pth === 'solid' ? T.green : '#A8AFBD'} /></marker></defs><path className={`n1-pth${pth ? ' ' + pth : ''}`} d="M208 186 C242 186 250 222 296 222" markerEnd="url(#n1ah)" /></svg>
    <div className={`n1-box2 n1-st${tok !== 'off' ? ' has' : ''}`} data-st={box} style={{ left: 26, top: 106, width: 180, height: 186 }}>
      <span className="bl">{t('NEST KONTEYNERI', 'КОНТЕЙНЕР NEST')}</span>
      <span className="sh" style={{ left: 15, top: 60, width: 150, height: 40 }}>{t("bo'sh", 'пусто')}</span>
      <span className={`nq${beat >= 7 ? ' on' : ''}`}>{t("Yaratish va berish — Nest'ning ishi", 'Создать и передать — работа Nest')}</span>
    </div>
    <div className="n1-part n1-st" data-st={ctrl} style={{ '--c': PART.ctrl, left: 286, top: 106, width: 448, height: 186 }}>
      <div className="nm"><i />AppController</div>
      <span className="fl" style={{ left: 'auto', right: 14, top: 16, bottom: 'auto' }}>src/app.controller.ts:6</span>
      <div className="n1-line" style={{ left: 14, top: 46, width: 420 }}><span><span className="n1-k">constructor</span>(<span className="n1-k">private readonly</span> <span className={`n1-prm${prm ? ' hot' : ''}`}>appService: <span className="n1-c">AppService</span></span>) {'{}'}</span></div>
      <span className={`n1-sock${sock === 'wait' ? ' wait' : ''}`} style={{ left: 14, top: 98, width: 150, borderStyle: slot ? 'solid' : 'dashed', borderColor: slot ? 'transparent' : undefined }}>{sock === 'full' ? '' : '?'}</span>
      <span className="n1-abs" style={{ left: 178, top: 107, font: `500 12.5px ${MONO}`, color: T.ink2, whiteSpace: 'nowrap' }}>→ this.appService <b className="n1-tayyor" style={{ opacity: slot ? 1 : 0 }}>✓ {t('tayyor', 'готово')}</b></span>
      <span className={`n1-you${beat >= 7 ? ' on' : ''}`} style={{ left: 300, top: 147 }}>{t("2 · siz so'raysiz", '2 · просите вы')}</span>
    </div>
    <span className={`n1-tok twin${slot ? ' on' : ''}`} style={{ left: 116, top: 186, width: 150 }}><i />AppService</span>
    <span className={`n1-tok${tok === 'off' ? ' off' : ''}`} style={{ left: slot ? 375 : 116, top: slot ? 222 : 186, width: 150 }}><i />AppService</span>
    <span className={`n1-ann${beat >= 5 ? ' on' : ''}`} style={{ left: 214, top: 150 }}><b>inject</b></span>
    <span className={`n1-ann${beat === 5 || beat === 6 ? ' on' : ''}`} style={{ left: 300, top: 252 }}><b>dependency</b> — {t('Controller usiz ishlamaydi', 'Controller без него не работает')}</span>
    <div className={`${rowCls(1)} n1-srch`} style={{ left: 26, top: 312, width: 708, height: 128 }}>
      <span className="n1-tagl" style={{ left: 14, top: 12 }}>{t('Search · butun loyiha', 'Search · весь проект')}</span>
      <div className="n1-fld" style={{ left: 14, top: 36, width: 420 }}><span style={{ color: T.ink3 }}>⌕</span><span>new AppService</span></div>
      <div className="n1-res" style={{ left: 14, top: 86 }}>{t('0 ta natija', '0 результатов')}<span>{t("hech kim uni new bilan yaratmagan", 'никто не создавал его через new')}</span></div>
    </div>
    <div className={rowCls(2)} style={{ left: 26, top: 312, width: 708, height: 128 }}>
      <span className="n1-tagl" style={{ left: 0, top: 0 }}>{t('Express · shartli misol — uch fayl, uch marta new', 'Express · условный пример — три файла, три раза new')}</span>
      {files.map(([f, n], i) => <div key={f} className="n1-exf" style={{ left: i * 241, top: 24, width: 226, height: 104 }}>
        <div className="tb">{f}</div>
        <span className="cl"><span style={{ color: T.ink3 }}>const</span> s = <b style={{ color: T.accent }}>new</b> CarsService();</span>
        <span className="n1-tok grey" style={{ left: 66, top: 78, width: 112, height: 28, fontSize: 11.5 }}><i />instance {n}</span>
      </div>)}
    </div>
    <div className={rowCls(3)} style={{ left: 26, top: 312, width: 708, height: 128 }}>
      <div className="n1-bn" style={{ left: 0, top: 0, width: 226, height: 128 }}>
        <svg width="200" height="72" viewBox="0 0 200 72"><rect x="4" y="6" width="74" height="24" rx="6" fill="#fff" stroke={PART.ctrl} strokeWidth="2" /><rect x="4" y="42" width="74" height="24" rx="6" fill="#fff" stroke={PART.ctrl} strokeWidth="2" /><path d="M78 18 C104 18 104 36 122 36 M78 54 C104 54 104 36 122 36" stroke={T.green} strokeWidth="2" fill="none" /><rect x="122" y="22" width="74" height="28" rx="14" fill="#E3F5EC" stroke={T.green} strokeWidth="2" /><circle cx="136" cy="36" r="4" fill={T.green} /></svg>
        <span className="bt">{t('Bitta instance', 'Один instance')}</span>
      </div>
      <div className="n1-bn" style={{ left: 241, top: 0, width: 226, height: 128 }}>
        <svg width="200" height="72" viewBox="0 0 200 72"><rect x="4" y="18" width="80" height="36" rx="8" fill="#fff" stroke={PART.ctrl} strokeWidth="2" /><rect x="14" y="27" width="60" height="18" rx="9" fill="#fff" stroke="#A8AFBD" strokeWidth="1.5" strokeDasharray="4 3" /><path d="M118 36 H90" stroke={PART.mod} strokeWidth="2" fill="none" /><path d="M96 31 L88 36 L96 41" stroke={PART.mod} strokeWidth="2" fill="none" /><rect x="118" y="22" width="78" height="28" rx="14" fill="#FFFBF0" stroke={PART.mod} strokeWidth="2" strokeDasharray="5 3" /><text x="157" y="40" textAnchor="middle" fontFamily={SANS} fontSize="11" fontWeight="700" fill={PART.mod}>{t('soxta', 'фейк')}</text></svg>
        <span className="bt">{t('Testda soxtasi beriladi', 'В тесте дают фейк')}</span>
      </div>
      <div className="n1-bn" style={{ left: 482, top: 0, width: 226, height: 128 }}>
        <svg width="200" height="72" viewBox="0 0 200 72"><rect x="110" y="18" width="86" height="36" rx="8" fill="#fff" stroke={PART.ctrl} strokeWidth="2" /><rect x="120" y="27" width="66" height="18" rx="9" fill="#E3F5EC" stroke={T.green} strokeWidth="1.5" /><path d="M64 36 H102" stroke={T.green} strokeWidth="2" fill="none" /><path d="M96 31 L104 36 L96 41" stroke={T.green} strokeWidth="2" fill="none" /><rect x="4" y="16" width="58" height="40" rx="10" fill="#F3F4F7" stroke="#9AA1B1" strokeWidth="2" strokeDasharray="5 3" /><text x="33" y="42" textAnchor="middle" fontFamily={SANS} fontSize="16" fontWeight="700" fill={T.ink3}>?</text></svg>
        <span className="bt">{t('Controller manbani bilmaydi', 'Controller не знает источника')}</span>
      </div>
    </div>
    <div className={`n1-ro${ro ? '' : ' off'}`} style={{ left: 26, top: 456, width: 708, height: 46 }}>{ro && <><span className="rf">{ro[0]}</span><code dangerouslySetInnerHTML={html(ro[1])} /></>}</div>
  </N1Fit>;
}

// 23 · providers bo'sh: Nest konteyneri bo'sh, CarsController konstruktori (?) — xatoning 3 bo'lagi raqam bilan
// who — dependency so'ragan klass · dep — yetishmagan dependency · mod — modul yorlig'i (Nest-2 20-ekran ham shu rasm)
function MiniProviders({ broken, fixed, pin, known = true, who = 'CarsController', dep = 'CarsService', mod = 'CarsModule · cars.module.ts' }) {
  const bad = broken && !fixed;
  const pins = [].concat(pin || []);
  const fs = dep.length > 14 ? 10.5 : 12.5;
  return <N1Mini>
    <div className="n1-mod" style={{ left: 6, top: 8, width: 380, height: 112 }}><span className="lg">{mod}</span></div>
    <span className={`n1-pin${pins.includes(3) ? ' on' : ''}`} style={{ left: 214, top: 4 }}>3</span>
    <div className={`n1-box2${bad ? '' : ' has'}`} style={{ left: 20, top: 28, width: 150, height: 80 }}><span className="bl" style={{ fontSize: 9.5, left: 10, top: 9 }}>{t('NEST KONTEYNERI', 'КОНТЕЙНЕР NEST')}</span><span className="sh" style={{ left: 9, top: 28, width: 128, height: 34 }}>{t("bo'sh", 'пусто')}</span></div>
    <span className={`n1-tok${bad ? ' off' : ''}`} style={{ left: 95, top: 79, width: 128, height: 34, fontSize: fs }}><i />{dep}</span>
    <i className={`n1-arr${bad ? ' bad' : ''}`} style={{ left: 176, top: 67, width: 30 }} />
    <div className="n1-part" style={{ '--c': PART.ctrl, left: 212, top: 28, width: 166, height: 80, padding: '8px 10px' }}>
      <div className="nm" style={{ fontSize: 13.5 }}><i />{who}</div>
      <span className={`n1-sock${bad ? ' er' : ''}`} style={{ left: 9, top: 28, width: 144, height: 34 }}>{bad ? '(?)' : ''}</span>
    </div>
    <span className={`n1-tok${bad ? ' off' : ''}`} style={{ left: 295, top: 79, width: 140, height: 34, fontSize: fs }}><i />{dep}</span>
    <span className={`n1-pin${pins.includes(1) ? ' on' : ''}`} style={{ left: 366, top: 20 }}>1</span>
    <span className={`n1-pin${pins.includes(2) ? ' on' : ''}`} style={{ left: 366, top: 70 }}>2</span>
    <span className="n1-tagl" style={{ left: 404, top: 12 }}>{t('Server', 'Сервер')}</span>
    <span className={`n1-say ${bad ? 'er' : 'ok'}`} style={{ left: 404, top: 34, color: known ? undefined : T.ink3 }}>{!known ? '…' : bad ? t('✕ yiqildi', '✕ упал') : t('✓ ishlayapti', '✓ работает')}</span>
    <span className={`n1-ann${pins.includes(2) ? ' on' : ''}`} style={{ left: 404, top: 64, fontSize: 11.5, whiteSpace: 'normal', width: 112 }}>{t('index [0] — birinchi parametr', 'index [0] — первый параметр')}</span>
  </N1Mini>;
}
// 24 · imports'da CarsModule yo'q: AppModule CarsModule'ni ulamadi — Nest cars papkasini o'qimadi, /cars → 404
function MiniImports({ broken, fixed, known = true, unread = true }) {
  const bad = broken && !fixed;
  const dim = bad && unread ? 'g' : '';
  return <N1Mini>
    <div className="n1-mod" style={{ left: 4, top: 8, width: 194, height: 104 }}><span className="lg">AppModule</span></div>
    <span className="n1-chip" style={{ left: 14, top: 28, fontSize: 11.5 }}>{bad ? 'imports: []' : 'imports: [CarsModule]'}</span>
    <span className="n1-chip" style={{ left: 14, top: 64, fontSize: 11.5, opacity: .6 }}>AppController</span>
    <i className={`n1-arr${bad ? ' bad' : ''}`} style={{ left: 204, top: 60, width: 30 }} />
    {bad && <span className="n1-say er" style={{ left: 210, top: 34, fontSize: 14 }}>✕</span>}
    <div className="n1-mod n1-st" data-st={dim} style={{ left: 240, top: 8, width: 152, height: 104 }}><span className="lg">CarsModule</span></div>
    <span className="n1-chip n1-st" data-st={dim} style={{ left: 250, top: 28, fontSize: 11.5, borderColor: '#BFD9EA' }}>CarsController</span>
    <span className="n1-chip n1-st" data-st={dim} style={{ left: 250, top: 64, fontSize: 11.5, borderColor: '#BFE3D2' }}>CarsService</span>
    {bad && unread && <span className="n1-say er" style={{ left: 250, top: 94, fontSize: 11.5, background: T.paper, padding: '0 4px' }}>{t("Nest o'qimadi", 'Nest не прочитал')}</span>}
    <Res left={404} top={26} rows={bad ? [['GET /cars', known ? 404 : null], ['GET /', known ? 200 : null]] : [['GET /cars', 200], ['GET /', 200]]} />
  </N1Mini>;
}
// 25 · @Controller('cars') yo'q: klass controllers ro'yxatida, lekin belgisi yo'q — Nest tanimaydi
function MiniCtrlDeco({ broken, fixed }) {
  const bad = broken && !fixed;
  return <N1Mini>
    <div className="n1-part" style={{ '--c': PART.ctrl, left: 6, top: 8, width: 230, height: 104, padding: '40px 12px 10px' }}>
      <div className="nm" style={{ fontSize: 14 }}><i />CarsController</div>
      <div className="role" style={{ fontSize: 12 }}>controllers: [CarsController]</div>
    </div>
    <span className={`n1-badge ${bad ? 'gone' : 'ok'}`} style={{ left: 18, top: 18 }}>{bad ? t("@Controller — yo'q", '@Controller — нет') : "@Controller('cars')"}</span>
    <i className={`n1-arr${bad ? ' bad' : ''}`} style={{ left: 244, top: 60, width: 30 }} />
    <div className="n1-box2" style={{ left: 282, top: 8, width: 232, height: 104 }}>
      <span className="bl" style={{ fontSize: 9.5 }}>NEST</span>
      <span className={`n1-say ${bad ? 'er' : 'ok'}`} style={{ left: 14, top: 30, whiteSpace: 'normal', width: 206 }}>{bad ? t('belgi yo\'q → «invalid controller», server yiqildi', 'нет метки → «invalid controller», сервер упал') : t("Controller deb tanidi → Mapped {/cars, GET}", 'узнал как Controller → Mapped {/cars, GET}')}</span>
    </div>
  </N1Mini>;
}
// 26 · @Injectable() yo'q: dependency'siz ishlaydi; PricingService qo'shilsa — konstruktorga hech narsa kelmaydi, so'rovda 500
function MiniInjectable({ broken, dep, fixed, known = true }) {
  const bad = broken && !fixed;
  const res = !known ? null : !dep ? 200 : bad ? 500 : 200;
  return <N1Mini>
    <div className="n1-part" style={{ '--c': PART.svc, left: 4, top: 8, width: 280, height: 104, padding: '8px 12px' }}>
      <div className="nm" style={{ fontSize: 14, marginTop: 4 }}><i />CarsService</div>
    </div>
    <span className={`n1-badge ${bad ? 'gone' : 'ok'}`} style={{ left: 128, top: 18 }}>{bad ? t("@Injectable — yo'q", '@Injectable — нет') : '@Injectable()'}</span>
    {!dep && <span className="n1-say" style={{ left: 18, top: 66, color: T.ink2, fontWeight: 500, fontFamily: MONO, fontSize: 11.5 }}>{t("konstruktor yo'q", 'конструктора нет')}</span>}
    {dep && <span className="n1-abs" style={{ left: 18, top: 66, font: `500 11.5px ${MONO}`, color: T.ink2 }}>pricing:</span>}
    {dep && <span className={`n1-sock${bad ? ' er' : ''}`} style={{ left: 82, top: 56, width: 176, height: 32 }}>{bad ? 'undefined' : ''}</span>}
    {dep && <span className={`n1-tok${bad ? ' off' : ''}`} style={{ left: 170, top: 72, width: 168, height: 32, fontSize: 12 }}><i />PricingService</span>}
    <div className="n1-box2 has" style={{ left: 292, top: 8, width: 100, height: 104 }}><span className="bl" style={{ fontSize: 9.5, left: 10 }}>{t('KONTEYNER', 'КОНТЕЙНЕР')}</span></div>
    {dep && bad && <span className="n1-tok" style={{ left: 342, top: 66, width: 88, height: 30, fontSize: 10.5 }}><i />Pricing</span>}
    {dep && bad && <span className="n1-say er" style={{ left: 300, top: 90, fontSize: 10.5 }}>{t('berilmadi', 'не передан')}</span>}
    <Res left={404} top={36} rows={[['GET /cars', res]]} />
  </N1Mini>;
}

// ---------- 3-ekran: Express'da har jamoa papkalarni o'zicha bo'ladi ----------
function TeamsStrip({ st }) {
  const teams = [['routes/', 'controllers/', 'services/'], ['api/', 'handlers/', 'logic/'], ['src/', 'lib/', 'utils/']];
  return <N1Fit w={760} h={128}>
    <span className="n1-tagl" style={{ left: 20, top: 4 }}>{t("Express · har jamoa o'zicha", 'Express · каждая команда по-своему')}</span>
    {teams.map((tm, i) => <div key={i} className="n1-team n1-st" data-st={st} style={{ left: 20 + i * 244, top: 24, width: 232, height: 100 }}>
      <h6>{t(`${i + 1}-jamoa`, `Команда ${i + 1}`)}</h6>{tm.map((f) => <div key={f}><i />{f}</div>)}
    </div>)}
  </N1Fit>;
}

// ---------- 10-ekran: Module — Nest ko'radigan uch ro'yxat; faylda bor, ro'yxatda yo'q — Nest uchun yo'q ----------
function Shelves({ beat }) {
  const sh = (k) => (beat === 1 ? (k === 'imports' ? 'dim' : 'hl') : beat === 2 ? (k === 'imports' ? 'hl' : 'dim') : beat >= 3 ? 'dim' : '');
  const box = (k, x, chips) => <div className={`n1-shelf ${sh(k)}`} style={{ left: x, top: 34, width: 232, height: 62 }}>
    <span className="sl">{k}: [ ]</span>
    {chips.length ? chips.map(([c, col], i) => <span key={c} className="n1-file" style={{ '--c': col, left: 12 + i * 120, top: 16 }}><i />{c}</span>) : <span className="emp">{t("bo'sh — boshqa modul yo'q", 'пусто — других модулей нет')}</span>}
  </div>;
  return <N1Fit w={760} h={beat >= 3 ? 168 : 104}>
    <span className="n1-tagl" style={{ left: 20, top: 4 }}>{t("Nest ko'radigan narsa — faqat shu uch ro'yxat", 'Nest видит только эти три списка')}</span>
    {box('imports', 20, [])}
    {box('controllers', 264, [['AppController', PART.ctrl]])}
    {box('providers', 508, [['AppService', PART.svc]])}
    {beat >= 3 && <>
      <span className="n1-tagl" style={{ left: 20, top: 112 }}>{t("Faylda bor, ro'yxatda yo'q", 'В файле есть, в списке нет')}</span>
      <div className="n1-abs" style={{ left: 20, top: 128, width: 720, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'nowrap' }}>
        <span className="n1-file new" style={{ '--c': PART.ctrl, position: 'static' }}><i />users.controller.ts</span>
        <span className="n1-ghost" style={{ position: 'static' }}>✕ {t("controllers'da yo'q", 'нет в controllers')}</span>
        <span style={{ width: 10 }} />
        <span className="n1-file new" style={{ '--c': PART.svc, position: 'static' }}><i />users.service.ts</span>
        <span className="n1-ghost" style={{ position: 'static' }}>✕ {t("providers'da yo'q", 'нет в providers')}</span>
      </div>
    </>}
  </N1Fit>;
}
function ModTree() {
  const kids = ['CarsModule', 'UsersModule', 'OrdersModule'];
  return <N1Fit w={760} h={196}>
    <span className="n1-tagl" style={{ left: 20, top: 4 }}>{t('Modullar strukturasi', 'Структура модулей')}</span>
    <div className="n1-mod" style={{ left: 200, top: 30, width: 360, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="lg">AppModule</span><span style={{ font: `500 12px ${MONO}` }}>imports: [CarsModule, UsersModule, OrdersModule]</span></div>
    <i className="n1-tree-ln" style={{ left: 379, top: 76, width: 2, height: 22 }} />
    <i className="n1-tree-ln" style={{ left: 135, top: 98, width: 492, height: 2 }} />
    {kids.map((m, i) => <React.Fragment key={m}>
      <i className="n1-tree-ln" style={{ left: 135 + i * 246, top: 98, width: 2, height: 22 }} />
      <div className="n1-mod" style={{ left: 18 + i * 246, top: 120, width: 236, height: 66, animation: `mk-up .4s ${0.15 + i * 0.15}s ease both` }}>
        <span className="lg">{m}</span>
        <span className="n1-file" style={{ '--c': PART.ctrl, left: 10, top: 18, padding: '5px 8px', fontSize: 11 }}><i />controllers</span>
        <span className="n1-file" style={{ '--c': PART.svc, left: 126, top: 18, padding: '5px 8px', fontSize: 11 }}><i />providers</span>
      </div>
    </React.Fragment>)}
  </N1Fit>;
}

// ---------- 32-ekran: o'quvchi loyihasi restoran tilida — har bekatda ikki so'z ----------
// DICT (07-bo'lak) ma'lumoti: [restoran so'zi, atama, vazifa] — RU tarjimasi ham o'sha yerdan
function KitchenMap({ beat, dict }) {
  const by = {}; dict.forEach(([w, a, v]) => { by[a] = { w, a, v }; });
  const ST = [
    { k: 'Guard', x: 120, c: T.purple },
    { k: 'Controller', x: 252, c: PART.ctrl },
    { k: 'Service', x: 384, c: PART.svc },
    { k: 'Repository', x: 516, c: T.ink2 },
    { k: 'Entity', x: 648, c: T.ink2 },
  ];
  const cls = (k) => (beat === 1 ? (k === 'Service' ? ' hl' : ' dim') : beat === 2 ? (k === 'Controller' || k === 'Service' ? ' hl' : ' dim') : '');
  return <N1Fit w={760} h={300}>
    <div className="n1-kit">
      <span className="n1-tagl" style={{ left: 8, top: 0 }}>{t("O'quvchi loyihasi · IntroNestArxitechture · bitta buyurtma", 'Проект ученика · IntroNestArxitechture · один заказ')}</span>
      <div className="n1-mod" style={{ left: 252, top: 26, width: 236, height: 36, opacity: beat === 1 || beat === 2 ? 0.4 : 1, transition: 'opacity .4s' }}>
        <span className="lg">{by.Module.a} · {by.Module.w}</span>
        <span className="n1-abs" style={{ left: 14, top: 12, font: `500 11px ${MONO}`, color: T.ink2 }}>{by.Module.v}: Controller · Service</span>
      </div>
      <div className={`st${beat === 1 || beat === 2 ? ' dim' : ''}`} style={{ '--c': '#C9CED8', left: 8, top: 84, width: 84, height: 120, borderWidth: 1.5 }}>
        <span className="w">{t('mijoz', 'клиент')}</span><span className="a">{t('brauzer', 'браузер')}</span><span className="v">{t("so'rov yuboradi", 'отправляет запрос')}</span>
      </div>
      {ST.map((x, i) => {
        const d = by[x.k];
        return <div key={x.k} className={`st${cls(x.k)}`} style={{ '--c': x.c, left: x.x, top: 84, width: 104, height: 120, animation: `mk-up .4s ${i * 0.1}s ease both` }}>
          <span className="w">{d.w}</span><span className="a">{d.a}</span><span className="v">{d.v}</span>
          {x.k === 'Service' && <span className={`f${beat === 1 ? ' on' : ''}`}>src/api/car/car.service.ts</span>}
        </div>;
      })}
      {[92, 224, 356, 488, 620].map((x) => <i key={x} className="ar" style={{ left: x + 4, top: 143, width: 20 }} />)}
      <span className="n1-abs" style={{ left: 8, top: 216, font: `600 11px ${MONO}`, color: T.ink3 }}>{t("so'rov bilan keladi", 'приходит с запросом')}</span>
      <span className={`n1-lab n1-st`} data-st={beat === 1 || beat === 2 ? 'dim' : ''} style={{ position: 'absolute', left: 8, top: 234 }}>{by.DTO.a} · {by.DTO.w} — {by.DTO.v}</span>
      <span className="n1-abs" style={{ left: 400, top: 216, font: `600 11px ${MONO}`, color: T.ink3 }}>{t('javob shu shaklda qaytadi', 'ответ возвращается в этой форме')}</span>
      <span className={`n1-lab n1-st`} data-st={beat === 1 || beat === 2 ? 'dim' : ''} style={{ position: 'absolute', left: 400, top: 234 }}>{by.successRes.a} · {by.successRes.w} — {by.successRes.v}</span>
      <span className={`no${beat === 2 ? ' on' : ''}`} style={{ left: 236, top: 270 }}>{t("ofitsiant oshxonaga kirmaydi: Controller Service'ni chaqiradi, hisobni o'zi qilmaydi", 'официант не заходит на кухню: Controller вызывает Service, сам не считает')}</span>
    </div>
  </N1Fit>;
}

// ---------- Nest-2 rasmi: o'quvchi loyihasida bitta so'rovning to'liq yo'li (8 bekat) ----------
// Bekat kalitlari Nest-2 SUM2 bilan bir xil: br · pre · guard · pipe · ctrl · svc · repo · db
// hl — yoritiladigan bekatlar (qolgani xira) · stop {k, code} — so'rov shu bekatda to'xtadi · ok {code} — so'rov bazagacha yetdi
// marks [{k, code}] — paketsiz belgilar · resp 'ok'|'err'|'both' — javob shakli · mod 'broken' — forFeature yo'q · lab {k: so'z} · pins {k: raqam}
const RM_X = { br: 8, pre: 101, guard: 194, pipe: 287, ctrl: 380, svc: 473, repo: 566, db: 659 };
const RM_W = 84;
function RepoMachine({ hl = [], stop, ok, marks = [], resp, mod, lab, pins = {}, url = 'GET /api/v1/car', tag, compact, max, extra }) {
  const ST = [
    ['br', t('Brauzer', 'Браузер'), 'Swagger', T.ink2],
    ['pre', '/api/v1', t('prefiks', 'префикс'), T.ink2],
    ['guard', 'Guard', t('token · rol', 'токен · роль'), '#B91C1C'],
    ['pipe', 'DTO', 'Validation', '#C2410C'],
    ['ctrl', 'Controller', 'route', PART.ctrl],
    ['svc', 'Service', 'BaseService', PART.svc],
    ['repo', 'Repository', 'TypeORM', T.purple],
    ['db', 'PostgreSQL', 'cars', T.purple],
  ];
  const bad = mod === 'broken';
  const st = (k) => (bad && k === 'repo' ? 'g' : hl.length ? (hl.includes(k) ? 'hl' : 'dim') : '');
  const SH = lab ? 132 : 74; // bekat balandligi — so'z (lab) bo'lsa baland
  const LY = 70 + SH + 24;    // yo'lak
  const H = compact ? LY + 28 : LY + 84;
  const cx = (k) => RM_X[k] + RM_W / 2;
  const code = (c) => (/^2/.test(String(c)) ? 'ok' : 'er');
  const pk = stop ? { k: stop.k, c: stop.code, ok: false } : ok ? { k: 'db', c: ok.code, ok: true } : null;
  const right = pk && (pk.k === 'db' || pk.k === 'repo'); // o'ng chetda — yozuv chapga suriladi, kesilmaydi
  return <N1Fit w={760} h={H} max={max}>
    {tag && <span className="n1-tagl" style={{ left: 8, top: 0 }}>{tag}</span>}
    <div className={`n1-mod n1-st`} data-st={hl.length && !hl.includes('mod') && !bad ? 'dim' : hl.includes('mod') ? 'hl' : ''} style={{ left: RM_X.ctrl - 6, top: 26, width: RM_X.repo + RM_W - RM_X.ctrl + 12, height: 30, borderColor: bad ? '#DC2626' : undefined, background: bad ? '#FEF2F2' : undefined }}>
      <span className="lg" style={{ color: bad ? '#DC2626' : undefined }}>CarModule</span>
      <span className="n1-abs" style={{ right: 10, top: 8, font: `500 11px ${MONO}`, color: bad ? '#DC2626' : T.ink2, whiteSpace: 'nowrap' }}>{bad ? 'imports: [ ]' : 'imports: forFeature([CarEntity])'}</span>
      {lab && lab.mod && <span className="lab"><span className="n1-lab">{lab.mod}</span></span>}
    </div>
    {ST.map(([k, n, s, c]) => <div key={k} className="n1-part n1-st" data-st={st(k)} style={{ '--c': c, left: RM_X[k], top: 70, width: RM_W, height: SH, padding: '9px 8px', borderWidth: k === 'br' || k === 'pre' ? 1.5 : 2 }}>
      <div className="nm" style={{ fontSize: 11.5 }}>{n}</div>
      <div className="role" style={{ fontSize: 10, fontFamily: MONO, marginTop: 4, lineHeight: 1.25, whiteSpace: 'nowrap' }}>{s}</div>
      {lab && lab[k] && <div style={{ marginTop: 6, font: `700 11px/1.25 ${SANS}`, color: T.ink }}>{lab[k]}</div>}
    </div>)}
    {Object.keys(pins).map((k) => <span key={k} className="n1-pin on" style={{ left: k === 'mod' ? RM_X.ctrl + 64 : RM_X[k] + RM_W - 12, top: k === 'mod' ? 16 : 62 }}>{pins[k]}</span>)}
    {[...Array(7)].map((_, i) => <i key={i} className={`n1-arr${bad && i === 5 ? ' bad' : ''}`} style={{ left: RM_X[ST[i][0]] + RM_W + 1, top: 70 + SH / 2, width: 7, height: 2 }} />)}
    <i className="n1-ln" style={{ left: cx('br'), width: cx('db') - cx('br'), top: LY }} />
    {ST.map(([k]) => <i key={k} className="n1-stn" style={{ left: cx(k), top: LY + 1 }} />)}
    {pk && <span className={`n1-pk${pk.ok ? ' grn' : ''}`} style={{ left: Math.max(cx(pk.k), 60), top: LY + 1, transform: right ? 'translate(-88%,-50%)' : undefined }}>{url}</span>}
    {pk && <span className={`n1-res2`} style={{ left: Math.min(cx(pk.k) - 26, 700), top: LY + 16 }}><div><b className={pk.ok ? 'n1-ok' : 'n1-er'}>{pk.c}</b></div></span>}
    {marks.map((m) => <span key={m.k + m.code} className="n1-res2" style={{ left: cx(m.k) - 22, top: LY - 12 }}><div><b className={code(m.code) === 'ok' ? 'n1-ok' : 'n1-er'}>{m.code}</b></div></span>)}
    {!compact && <>
      <div className={`n1-chip`} style={{ left: 8, top: LY + 48, opacity: resp === 'ok' || resp === 'both' ? 1 : 0.35, borderColor: '#BFE3D2', fontSize: 11.5 }}><b style={{ color: T.green }}>successRes</b> {'{ statusCode, message, data }'}</div>
      <div className={`n1-chip`} style={{ left: 330, top: LY + 48, opacity: resp === 'err' || resp === 'both' ? 1 : 0.35, borderColor: '#F2A9A9', fontSize: 11.5 }}><b style={{ color: '#B91C1C' }}>AllExceptionFilter</b> {'{ statusCode, error: { message } }'}</div>
    </>}
    {extra}
  </N1Fit>;
}
