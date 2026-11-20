
// ============================================================
//  12 · Admin tugmalari: har statusga bitta test (keyboards.ts 37–51 · keyboards.spec.ts 1–35 · jest1v2-out/07)
// ============================================================
const ST12 = [['NEW', ['✅ Tasdiqlash', '❌ Bekor']], ['CONFIRMED', ['🚚 Yetkazildi', '❌ Bekor']], ['DELIVERED', []], ['CANCELLED', []]];
function StatusTab({ on = [] }) {
  return <table className="st-tab"><tbody>{ST12.map(([s, b], i) => <tr key={s} className={on.includes(i) ? 'hl' : ''}><td>{s}</td><td>{b.length ? b.map((x) => <span key={x} className="btn">{x}</span>) : <span style={{ color: T.ink3 }}>{t("tugma yo'q — undefined", "кнопок нет — undefined")}</span>}</td></tr>)}</tbody></table>;
}
const T12 = out('07', 2);
const S12 = mkS(12, [{ v: 'tab' }, { v: 'src' }, { v: 'spec' }, { v: 'tab', all: true }]);
function Screen12(p) {
  return <Lesson p={p} S={S12} scene={({ seg }) => <>
    {seg.v === 'tab' && <StatusTab on={seg.all ? [0, 1, 2, 3] : []} />}
    {seg.v === 'src' && <Code k="KB_ORDER" ids={{ 39: 'u', 43: 'b', 44: 'b', 47: 'b', 48: 'b' }} focus={['u', 'b']} files={FILES()} active={F.kb} />}
    {seg.v === 'spec' && <><CodePanel file="keyboards.spec.ts" lines={[...kod('SPEC_KB', { 5: 'h', 6: 'h', 7: 'h', 8: 'h' }, 4, 10), { h: '<span class="cm">…</span>', n: '' }, ...kod('SPEC_KB', { 31: 'u', 32: 'u', 33: 'u' }, 31, 35)]} focus={['h', 'u']} /><Term lines={T12} /></>}
  </>} />;
}

// ============================================================
//  13 · toBe massivda ishlamaydi — toEqual (kod-06b-tobe.spec.ts · jest1v2-out/06b, 08)
// ============================================================
const L06B = outLines('06b');
const T13 = out('06b', 2, L06B.findIndex((l) => /^\s*>/.test(l)) + 1, { [L06B.findIndex((l) => /If it should pass/.test(l)) + 1]: { id: 'w' }, [L06B.findIndex((l) => /serializes/.test(l)) + 1]: { id: 'w' } });
const L08 = outLines('08');
const T13_HIDE = [{ h: jestLine(L08.find((l) => /Received: \{/.test(l)).replace(/^\s+/, '    ')), id: 'h' }];
const S13 = mkS(13, [{ v: 'run', f: ['w'] }, { v: 'run', f: [] }, { v: 'hide' }, { v: 'sum' }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <>
    {seg.v !== 'hide' && <><CodePanel file="tobe.spec.ts" lines={kod('SPEC06B', { 3: 'b', 7: 'e' })} focus={['b', 'e']} /><Term lines={T13} er focus={seg.f || []} /></>}
    {seg.v === 'hide' && <><Term title={t("VS Code terminali · Received (Telegraf klaviaturasi)", "терминал VS Code · Received (клавиатура Telegraf)")} lines={T13_HIDE} er />
      <div className="n2-warn"><code>"hide": false</code>{t(" — kodda yozilmagan, Telegraf ", " — в коде не написано, Telegraf ")}<b>{t("o'zi qo'shadi", "добавляет сам")}</b>{t(". Yordamchi faqat ", ". Помощник берёт только ")}<code>text</code>{t(" va ", " и ")}<code>callback_data</code>{t(" ni ajratadi.", " .")}</div></>}
    {seg.v === 'sum' && <div className="mk-rule">{t("Son va satr — ", "Число и строка — ")}<code>toBe</code>{t("; massiv va obyekt — ", "; массив и объект — ")}<code>toEqual</code>.</div>}
  </>} />;
}

// ============================================================
//  14 · Kodni buzamiz: CANCELLED da ham tugma (jest1v2-out/08)
// ============================================================
const BREAK14 = { 39: KOD.KB_ORDER.lines[2].t.replace(" || o.status === 'CANCELLED'", '') };
const T14 = out('08', outFind('08', /^\$ /));
const T14_OK = out('07', 2);
// F-1120-02 (M52): 1-segment (x) — mentor 39-satrdagi «|| o.status === 'CANCELLED'» ni o'zi bosadi (data-act)
const L39 = KOD.KB_ORDER.lines.find((l) => l.n === 39).t;
const ACT14 = kod('KB_ORDER', { 39: 'x' }, 38, 41).map((l) => (l.n === 39 ? { ...l, h: tsLine(L39.split(" || o.status === 'CANCELLED'")[0]) + '<span class="n1-act" data-act="1">' + tsLine(" || o.status === 'CANCELLED'") + '</span>' + tsLine(L39.split(" || o.status === 'CANCELLED'")[1]) } : l));
// 1280×720 da kod ko'rinib tursin: terminaldan «> 33» va «^» satrlarigacha, keyin faqat «Tests:» satri (jest1v2-out/08)
const T14S = (() => { const i = T14.findIndex((l) => /\^/.test((l.h || '').replace(/<[^>]+>/g, '')) && !/expect/.test(l.h || '')); const k = T14.findIndex((l) => /Tests:/.test(l.h || '')); return [...T14.slice(0, i + 1), ...(k > i ? [T14[k]] : [])]; })();
const S14 = mkS(14, [{ v: 'act' }, { v: 'break' }, { v: 'run' }, { v: 'fix' }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={(b) => <Scene14 b={b} />} />;
}
// Qadamlar: 0 bosing · 1 buzildi (javob «?») · 2 test → 1 failed, bo'laklar 1·2 · 3 xulosa: tiklandi → 3 passed
function Scene14({ b }) {
  const { seg, beat } = b;
  const act = useAct(b);
  const v = beat === 0 ? (act.hit ? 'break' : 'act') : seg.v;
  const mini = <N1Mini><KbMini broken={v !== 'act'} fixed={v === 'fix'} known={beat >= 2} pins={beat === 2 ? { a: 1, b: 2 } : {}} /></N1Mini>;
  return <>
    <Ide files={compact(FILES(F.txs, F.kbs), F.kb)} active={F.kb}>
      {v === 'act' && <div onClick={act.onClick}><CodePanel file="keyboards.ts" lines={ACT14} focus={['x']} /></div>}
      {(v === 'break' || v === 'run') && <CodePanel key="b" file={t("keyboards.ts · buzilgan", "keyboards.ts · сломан")} lines={kod('KB_ORDER', { 39: 'x' }, 38, 41, BREAK14)} focus={['x']} />}
      {v === 'fix' && <CodePanel key="f" file={t("keyboards.ts · tiklandi", "keyboards.ts · восстановлен")} lines={kod('KB_ORDER', { 39: 'x' }, 38, 41)} focus={['x']} />}
      {mini}
    </Ide>
    {v === 'run' && <Term title={t("VS Code terminali · npm test -- keyboards", "терминал VS Code · npm test -- keyboards")} lines={T14S} er marks={{ [T14S.findIndex((l) => /● orderKeyboard ›/.test(l.h || ''))]: 'n1-p1', [T14S.findIndex((l) => /Received:/.test(l.h || ''))]: 'n1-p2' }} />}
    {v === 'fix' && <Term lines={T14_OK} />}
  </>;
}

// ============================================================
//  15 · Katalog: chegara — oxirgi va bitta sahifa (keyboards.ts 18–25 · jest1v2-out/09, 10)
// ============================================================
const PAGES15 = [['1/3 ▶', 'birinchi'], ['◀ 2/3 ▶', "o'rtada"], ['◀ 3/3', 'oxirgi'], ['1/1', 'yagona']];
const BREAK15 = { 21: KOD.KB_NAV.lines[3].t.replace('page < pages - 1', 'page <= pages - 1') };
const T15 = [...out('10', outFind('10', /^FAIL/), outFind('10', /^FAIL/)), ...out('10', outFind('10', /^\s*catalogKeyboard$/), outFind('10', /- Expected/) + 6)];
// F-1109-06: xulosa — sahifa belgilari qatori o'rniga 4 sahifa × ikki shart jadvali va haqiqiy npx jest farqi (jest1v2-out/10)
const ROWS15 = [
  ["birinchi", "первая", '0 · 2', 'f1', ['1/3', '▶'], false, false],
  ["o'rtada", 'в середине', '1 · 2', 'f1', ['◀', '2/3', '▶'], false, false],
  ['oxirgi', 'последняя', '2 · 2', 'f0', ['◀', '3/3', '▶'], true, true],
  ['yagona', 'единственная', '0 · 0', 'f0', ['1/1', '▶'], true, true],
];
function Edge15() {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("keyboards.ts 21-satr · ▶ qachon chiqadi — 4 sahifa, ikki shart", "keyboards.ts строка 21 · когда появляется ▶ — 4 страницы, два условия")}</p>
      <table className="z-tbl j1-15"><tbody>
        <tr><th className="l">{t("sahifa", "страница")}</th><th>page · pages − 1</th><th>page &lt; pages − 1</th><th>page &lt;= pages − 1</th><th>{t("buzilgan kod ko'rsatdi", "показал сломанный код")}</th><th>test</th></tr>
        {ROWS15.map(([uz, ruN, v, f, kb, edge, x]) => <tr key={uz} className={edge ? 'edge' : ''}>
          <td className="l">{edge ? <b>{t(uz, ruN)}</b> : t(uz, ruN)}</td><td>{edge ? <b>{v}</b> : v}</td>
          <td className={f}>{f === 'f1' ? 'true ▶' : 'false'}</td><td className={edge ? 'f2' : 'f1'}>true ▶</td>
          <td><span className="kb">{kb.map((k, j) => <i key={j} className={x && j === kb.length - 1 ? 'x' : ''}>{k}</i>)}</span></td>
          <td className={x ? 'tf' : 'tp'}>{x ? '✕' : '✓'}</td>
        </tr>)}
      </tbody></table>
      <span className="z-mut">{t("Ikki shart faqat page = pages − 1 bo'lganda farq qiladi — ya'ni chegarada. O'rtadagi sahifa testi farqni ko'rmaydi.", "Два условия различаются только при page = pages − 1 — то есть на границе. Тест средней страницы разницы не видит.")}</span>
    </div>
    <div className="z-card" style={{ borderColor: 'var(--bad)' }}>
      <p className="z-h" style={{ color: 'var(--bad)' }}>{t("npx jest keyboards — haqiqiy farq", "npx jest keyboards — настоящая разница")}</p>
      <div className="z-term"><span className="r">✕ oxirgi sahifada ▶ yo'q</span>      Array [ "◀", "3/3", <span className="r">+ "▶"</span> ]{'\n'}<span className="r">✕ bitta sahifa — faqat 1/1</span>    Array [ "1/1", <span className="r">+ "▶"</span> ]{'\n'}<span className="g">✓ birinchi sahifada ◀ yo'q   ✓ o'rtada ikkalasi bor</span></div>
    </div>
  </div>;
}
const S15 = mkS(15, [{ v: 'pages' }, { v: 'spec' }, { v: 'break' }, { v: 'pages', bad: true }]);
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <>
    {seg.v === 'pages' && !seg.bad && <div className="pages">{PAGES15.map(([x, n], i) => <div key={x} className={seg.bad ? (i >= 2 ? 'hl' : 'ok') : ''}>{x}<small>{n}{t(" sahifa", " стр.")}</small></div>)}</div>}
    {seg.v === 'pages' && !seg.bad && <Code k="KB_NAV" ids={{ 19: 'c', 21: 'c', 22: 'c' }} focus={['c']} files={FILES()} active={F.kb} />}
    {seg.v === 'spec' && <Code k="SPEC_KB" ids={Object.fromEntries(Array.from({ length: 15 }, (_, i) => [47 + i, 'n']))} focus={['n']} from={37} to={71} files={FILES(F.txs, F.kbs)} active={F.kbs} />}
    {seg.v === 'break' && <><CodePanel file={t("keyboards.ts · buzilgan", "keyboards.ts · сломан")} lines={kod('KB_NAV', { 21: 'x' }, 19, 22, BREAK15)} focus={['x']} /><Term title={t("VS Code terminali · npm test -- keyboards", "терминал VS Code · npm test -- keyboards")} lines={T15} er /></>}
    {seg.bad && <Edge15 />}
  </>} />;
}

// ============================================================
//  16 · Tekshiruv 3 — page <= pages - 1 (jest1v2-out/10)
// ============================================================
const L10 = outLines('10');
const T16_AFTER = out('10', L10.findIndex((l) => /✓ birinchi/.test(l)) + 1, L10.findIndex((l) => /✓ tugagan/.test(l)) + 1);
function Screen16(p) {
  return MC(p, 16, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <CodePanel file={t("keyboards.ts · buzilgan", "keyboards.ts · сломан")} lines={kod('KB_NAV', { 21: 'x' }, 19, 22, BREAK15)} focus={['x']} />
      <div className="mk-pair">{t("Faqat ikki test: ", "Только два теста: ")}<code>{t("birinchi sahifada ◀ yo'q", "на первой странице нет ◀")}</code> (0, 3) · <code>{t("o'rtada ikkalasi bor", "в середине есть обе")}</code> (1, 3)</div>
    </div>,
    after: <Term title={t("VS Code terminali · to'rt sahifa testi bilan", "терминал VS Code · с тестами четырёх страниц")} lines={T16_AFTER} er />,
  });
}

// ============================================================
//  17 · Amaliyot 2 — keyboards.spec.ts va bitta buzish
// ============================================================
const P17 = mkPractice(17, [[], [0, 1], [2, 3], []], {
  code: [
    { step: 0, file: F.kbs, lines: kod('SPEC_KB', {}, 1, 35), copy: false },
    { step: 1, file: F.kbs, lines: kod('SPEC_KB', {}, 37, 71), copy: false },
  ],
});
function ScreenP17(p) { return <Practice p={p} S={P17.S} steps={P17.steps} trouble={P17.trouble} proof={P17.proof} code={P17.code} tree={FILES(F.txs, F.kbs)} />; }

// ============================================================
//  18 · AI ikki to'plam yozdi — ikkalasi yashil (jest1v2-ai/ai1, ai2 — 1-prompt)
// ============================================================
const S18 = mkS(18, [{ v: 'intro' }, { v: 'prompt' }, { v: 'two' }, { v: 'two', snip: true }, { v: 'two', snip: true, sum: true }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <>
    {seg.v === 'intro' && <div className="pg-two">
      <Card c={T.ink3} h={t("1–4-bosqich · testni siz yozdingiz", "Этапы 1–4 · тест писали вы")} dim><p><code>describe</code> · <code>it</code> · <code>expect</code>{t(" · FAIL o'qish · yolg'on testlar · chegara", " · чтение FAIL · ложные тесты · граница")}</p></Card>
      <Card c={JC.ai} h={t("5-bosqich · testni AI yozadi, siz qabul qilasiz", "Этап 5 · тест пишет AI, вы принимаете")} hl><p>{t("Savol endi «qanday yozaman?» emas — ", "Вопрос теперь не «как написать?», а — ")}<b>{t("«bu test xatoni ushlaydimi?»", "«ловит ли этот тест ошибку?»")}</b></p></Card>
    </div>}
    {seg.v !== 'intro' && <AiReply who={t("Prompt — ikkala AI'ga bir xil", "Промпт — одинаковый для обоих AI")} prompt={KOD.PROMPT1} tag={t("haqiqiy yurgizish · 04.11", "настоящий запуск · 04.11")} />}
    {seg.v === 'two' && <div className="pg-two">
      <AiReply who={t('1-AI (kuchli model)', '1-й AI (сильная модель)')} said={seg.snip ? t(<>«36 test, hammasi o'tdi» · probel: <code>norm()</code> — oddiysiga almashtiradi; «U+202F bo'lishi mumkin» — <b>AI aytdi, lekin tekshirmagan</b></>, <>«36 тестов, все прошли» · пробел: <code>norm()</code> — заменяет обычным; «может быть U+202F» — <b>AI сказал, но не проверил</b></>) : t(<>«36 test, hammasi o'tdi»</>, <>«36 тестов, все прошли»</>)} diff={KOD.AI_DIFF1} hl={seg.snip && !seg.sum} />
      <AiReply who={t('2-AI (kuchsizroq model)', '2-й AI (модель слабее)')} said={seg.snip ? t(<>«33 test o'tdi» · etalonda <b>ko'rinmas belgining o'zi</b> (U+00A0, 33-satr) · etalon koddan: <code>{'`Jami: ${som(50000)}`'}</code></>, <>«33 теста прошли» · в эталоне <b>сам невидимый символ</b> (U+00A0, строка 33) · эталон из кода: <code>{'`Jami: ${som(50000)}`'}</code></>) : t(<>«33 test o'tdi»</>, <>«33 теста прошли»</>)} diff={KOD.AI_DIFF2} hl={seg.snip && !seg.sum} />
    </div>}
    {seg.snip && <CodePanel file="1-AI · texts.spec.ts" lines={kod('AI1_NORM', { 7: 'n' })} focus={['n']} />}
    {seg.sum && <div className="mk-rule">{t("«Hammasi yashil» — ", "«Всё зелёное» — ")}<b>{t("tekshiruv emas", "не проверка")}</b>{t(". Testning o'zini tekshiramiz.", ". Проверяем сам тест.")}</div>}
  </>} />;
}

// ============================================================
//  19 · Buzib tekshirish: 36 test nimani sezmadi (jest1v2-ai/mutatsiya.txt)
// ============================================================
const S19 = mkS(19, [{ rows: 5 }, { rows: 5, col: 0 }, { rows: 5, col: 1, code: true }, { rows: 5, sum: true }]);
function Screen19(p) {
  return <Lesson p={p} S={S19} scene={({ seg }) => <>
    <div className="mk-light" style={{ padding: 12 }}><div className="mk-tag">{t("Nechta test qizardi (0 — buzilish sezilmadi) · ", "Сколько тестов покраснело (0 — поломка не замечена) · ")}<code>jest1v2-mutatsiya.sh</code></div><MutTable rows={seg.rows} hlCol={seg.col} /></div>
    {seg.code && <CodePanel file="1-AI · texts.spec.ts" lines={kod('AI1_STATUS', { 45: 't' })} focus={['t']} />}
    {seg.sum && <div className="mk-rule">{t("Test soni — sifat emas. Sifat — ", "Число тестов — не качество. Качество — ")}<b>{t("qaysi buzilishni ushlashi", "какую поломку он ловит")}</b>{t(". Qizarmagan joyga test qo'shing.", ". Где не покраснело — добавьте тест.")}</div>}
  </>} />;
}

// ============================================================
//  20 · Tekshiruv 4 — toBeTruthy (jest1v2-out/25)
// ============================================================
const BREAK20 = { 10: "  CANCELLED: '🆕 Yangi'," };
const T20 = out('25').filter((l, i) => !/buzilmagan|^\d+:/.test(outLines('25')[i].replace(/^## \w+ /, '').trim()) || /●/.test(outLines('25')[i]));
function Screen20(p) {
  return MC(p, 20, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <CodePanel file="1-AI · texts.spec.ts" lines={kod('AI1_STATUS', { 45: 't' })} focus={['t']} />
      <CodePanel file={t("texts.ts · buzilgan", "texts.ts · сломан")} lines={kod('TX_STATUS', { 10: 'x' }, 6, 11, BREAK20)} focus={['x']} />
    </div>,
    after: <Term title={t("VS Code terminali · CANCELLED «🆕 Yangi» bilan", "терминал VS Code · CANCELLED с «🆕 Yangi»")} lines={T20} />,
  });
}

// ============================================================
//  21 · Amaliyot 3 — AI test yozadi, siz buzib tekshirasiz (prompt — jest1v2-ai/p2-prompt.txt aynan)
// ============================================================
const PROMPT21 = KOD.PROMPT2.split('. ').map((s, i, a) => ({ h: escH(s + (i < a.length - 1 ? '.' : '')) }));
const P21 = mkPractice(21, [[], [0, 1], [2, 3], []], {
  code: [{ step: 0, file: 'prompt.txt', lines: PROMPT21 }],
});
function ScreenP21(p) { return <Practice p={p} S={P21.S} steps={P21.steps} trouble={P21.trouble} proof={P21.proof} code={P21.code} tree={['prompt.txt', F.txs]} />; }
