// node --test src/live/previewMode.test.mjs
// F-1015: LMS preview (A-yechim). Yagona manba — visitMode prop. Modul holati jarayon bo'yicha — shuning uchun har holat
// ALOHIDA node-jarayonda yuritiladi (PREVIEW_SCEN muhit o'zgaruvchisi bilan shu faylning o'zi chaqiriladi).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SELF = fileURLToPath(import.meta.url);
const SCEN = process.env.PREVIEW_SCEN;

// ---- brauzer o'rnida: Storage sinfi (prototip — overlay shunga o'rnatiladi), window, fetch-hisoblagich
function fakeBrowser({ search = '', globalMode } = {}) {
  class Storage {
    constructor() { this._m = new Map(); }
    getItem(k) { return this._m.has(String(k)) ? this._m.get(String(k)) : null; }
    setItem(k, v) { this._m.set(String(k), String(v)); }
    removeItem(k) { this._m.delete(String(k)); }
  }
  Storage.__orig = { getItem: Storage.prototype.getItem, setItem: Storage.prototype.setItem, removeItem: Storage.prototype.removeItem };
  const ls = new Storage(), ss = new Storage();
  globalThis.Storage = Storage;
  globalThis.window = { location: { search }, localStorage: ls, sessionStorage: ss, addEventListener() {}, removeEventListener() {}, ...(globalMode ? { __CC_VISIT_MODE__: globalMode } : {}) };
  globalThis.localStorage = ls;
  globalThis.document = { hidden: false, addEventListener() {}, removeEventListener() {} };
  globalThis.sessionStorage = ss;
  const calls = [];
  globalThis.fetch = async (url) => { calls.push(String(url)); return { ok: true, status: 200, json: async () => [], text: async () => '' }; };
  // Oldingi jonli darsdan qolgan holat (R1) va o'quvchi progressi (R3) — haqiqiy saqlovda
  ls.setItem('liveSession:L1', JSON.stringify({ mode: 'mentor', pin: '123456', token: 't' }));
  ls.setItem('ccProgress:L1', JSON.stringify({ screen: 7 }));
  ls.setItem('lmsAuth', 'lms-kaliti'); // LMS'ning o'z kaliti — preview unga tegmasligi kerak
  ls.setItem('cc_lang', 'ru');
  return { ls, ss, calls, Storage };
}

// Yig'ma o'rnida (build-lms define + inject, F-1021-10): darsning `localStorage`/`sessionStorage` nomlari shu modul
// nusxasining adapteriga ulanadi; haqiqiy saqlov — window'da. Storage.prototype tegilmasligi ham shu yerda o'lchanadi.
async function bundle(spec = './previewMode.js') {
  const pm = await import(spec);
  globalThis.localStorage = pm.previewLocalStorage;
  globalThis.sessionStorage = pm.previewSessionStorage;
  return pm;
}
const protoTouched = (Storage) => !!Storage.prototype.__ccPreview || Storage.prototype.setItem !== Storage.__orig.setItem
  || Storage.prototype.getItem !== Storage.__orig.getItem || Storage.prototype.removeItem !== Storage.__orig.removeItem;

// Hook'ni React bilan bir marta chizib, qaytgan obyektni olamiz (effektlar SSR'da yurmaydi — boshlang'ich holat)
async function hookState(opts) {
  const React = (await import('react')).default;
  const { renderToString } = await import('react-dom/server');
  const { useLiveSession } = await import('./useLiveSession.js');
  let out = null;
  const C = () => { out = useLiveSession('L1', null, opts); return null; };
  renderToString(React.createElement(C));
  return { mode: out.mode, pin: out.pin, preview: !!out.preview, hasLmsToken: out.hasLmsToken };
}

async function runScenario(name) {
  const r = {};
  if (name === 'oddiy') {
    const b = fakeBrowser();
    const pm = await bundle();
    const lc = await import('./liveClient.js');
    r.isPreview = pm.isPreview();
    r.patched = protoTouched(b.Storage);
    r.liveRead = lc.liveRead('L1');
    await lc.liveRpc('session_heartbeat', {});
    r.fetchCalls = b.calls.length;
    r.hook = await hookState({ liveToken: null });
  } else if (name === 'global' || name === 'urlYolgiz') {
    // F-1015-09/13: window.__CC_VISIT_MODE__ ham, URL'dagi visit_mode ham manba EMAS — oddiy rejim qolishi kerak
    const b = name === 'global' ? fakeBrowser({ globalMode: 'preview' }) : fakeBrowser({ search: '?jsx=x.jsx&visit_mode=preview' });
    const pm = await bundle();
    const lc = await import('./liveClient.js');
    r.isPreview = pm.isPreview();
    r.patched = protoTouched(b.Storage);
    await lc.liveRpc('session_heartbeat', {});
    r.fetchCalls = b.calls.length;
  } else if (name === 'preview') {
    const b = fakeBrowser();
    const pm = await bundle();
    const lc = await import('./liveClient.js');
    pm.notePreviewProps({ visitMode: 'preview', liveToken: 'mentor.jwt.token' }); // build-lms o'rami shunday chaqiradi
    r.isPreview = pm.isPreview();
    r.liveRead = lc.liveRead('L1');
    r.progRead = localStorage.getItem('ccProgress:L1');
    lc.progWrite('L1', { screen: 2 });
    lc.liveStore('L1', { mode: 'self' });
    r.overlayProg = localStorage.getItem('ccProgress:L1');
    r.realProg = b.ls._m.get('ccProgress:L1');
    r.realLive = b.ls._m.get('liveSession:L1');
    r.lmsKey = localStorage.getItem('lmsAuth');
    localStorage.setItem('lmsAuth', 'yangi');
    r.lmsKeyReal = b.ls._m.get('lmsAuth');
    r.lang = localStorage.getItem('cc_lang');
    localStorage.setItem('cc_lang', 'uz');
    r.langOverlay = localStorage.getItem('cc_lang');
    r.langReal = b.ls._m.get('cc_lang');
    localStorage.removeItem('liveSession:L1');
    r.removedOverlay = localStorage.getItem('liveSession:L1');
    r.removedReal = b.ls._m.has('liveSession:L1');
    sessionStorage.setItem('ld-tahrir', 'x');
    r.sessReal = b.ss._m.get('ld-tahrir') ?? null;
    r.sessOverlay = sessionStorage.getItem('ld-tahrir');
    try { await lc.liveRpc('create_session', {}); r.rpc = 'ketdi'; } catch (e) { r.rpc = e.code; }
    try { await lc.lmsJoin('jwt', { lesson_id: 'L1' }); r.join = 'ketdi'; } catch (e) { r.join = e.code; }
    try { await lc.liveGet('123456'); r.get = 'ketdi'; } catch (e) { r.get = e.code; }
    try { await lc.progressPut('jwt', {}); r.put = 'ketdi'; } catch (e) { r.put = e.code; }
    r.fetchCalls = b.calls.length;
    r.hook = await hookState({ liveToken: 'mentor.jwt.token' }); // token kelsa ham — preview ustun
  } else if (name === 'prop') {
    const b = fakeBrowser();
    const pm = await bundle();
    r.before = pm.isPreview();
    r.wrongCase = pm.notePreviewProps({ visitMode: 'Preview' });
    r.live = pm.notePreviewProps({ visitMode: 'live' });
    r.patchedBefore = protoTouched(b.Storage);
    r.ok = pm.notePreviewProps({ visitMode: 'preview', previewRunId: '7be2c261-5db1-4fb6-9265-b9da22e077e6', liveToken: 'x' });
    r.runId = pm.previewRunId();
    r.patchedAfter = protoTouched(b.Storage);
    r.stays = pm.notePreviewProps({});
  } else if (name === 'spa') {
    // F-1021-08/09: LMS sahifani qayta yuklamay darsni almashtiradi — modul o'sha, har mount o'ram orqali startLessonRun
    const b = fakeBrowser();
    const pm = await bundle();
    const lc = await import('./liveClient.js');
    const ps = await import('./progressSync.js');
    const rd = await import('./resultDetails.js');
    const A = 'runA-0000000000000001', B = 'runB-0000000000000002', C = 'runC-0000000000000003';
    const prog = () => localStorage.getItem('ccProgress:L1');
    const attempts = () => (rd._detailsState().attemptsByLesson.get('L1') || new Map()).size;
    // preview A: javob va ekran
    r.a = pm.startLessonRun({ visitMode: 'preview', previewRunId: A });
    localStorage.setItem('ccProgress:L1', JSON.stringify({ screen: 2 }));
    rd.logAttempt('L1', 1, { picked: 1, elapsedMs: 500 });
    r.aAttempts = attempts();
    // o'sha run qayta mount (re-render/re-mount) — holat saqlanadi
    r.aAgain = pm.startLessonRun({ visitMode: 'preview', previewRunId: A });
    r.aProg = prog();
    // preview B (yangi previewRunId) — noldan (Defekt 1)
    r.b = pm.startLessonRun({ visitMode: 'preview', previewRunId: B });
    r.bProg = prog();
    r.bRun = pm.previewRunId();
    r.bAttempts = attempts();
    localStorage.setItem('ccProgress:L1', JSON.stringify({ screen: 3 }));
    // mentor (preview proplari yo'q) — preview o'chadi (Defekt 2)
    r.live = pm.startLessonRun({ liveToken: 'mentor.jwt.token' });
    r.liveIsPreview = pm.isPreview();
    r.liveRun = pm.previewRunId();
    r.liveProg = prog();
    r.liveSess = lc.liveRead('L1');
    r.liveAttempts = attempts();
    r.hookLive = await hookState({ liveToken: null });
    const f0 = b.calls.length;
    await lc.liveRpc('session_heartbeat', {});
    r.liveFetch = b.calls.length - f0;
    // jonli → preview C: jonli urinishning so'nggi yozuvi (kanal yopilganda) baribir ketadi, preview'ning o'zi — 0 so'rov
    ps.setProgressChannel('L1', { token: 'jwt', attemptId: 'att1', status: 'active' });
    ps.queueProgress('L1', { screen: 5, answers: {}, earned: [] });
    r.c = pm.startLessonRun({ visitMode: 'preview', previewRunId: C });
    const f1 = b.calls.length;
    ps.setProgressChannel('L1', null); // eski komponent unmount'i
    await new Promise((res) => setTimeout(res, 20));
    r.flushFetch = b.calls.length - f1;
    try { await lc.liveRpc('create_session', {}); r.cRpc = 'ketdi'; } catch (e) { r.cRpc = e.code; }
    r.cProg = prog();
    r.cSess = lc.liveRead('L1');
    // haqiqiy saqlov butun
    r.realProg = b.ls._m.get('ccProgress:L1');
    r.realDetails = b.ls._m.has('ccDetails:L1');
  } else if (name === 'ikkiYigma') {
    // F-1021-10 (LMS QA 21.10): har dars yig'masida previewMode'ning O'Z nusxasi — bir sahifada ikki mustaqil modul.
    // Ketma-ket, bir vaqtda mount yo'q, F5 yo'q.
    const b = fakeBrowser();
    const A = await import('./previewMode.js?yigma=A'), B = await import('./previewMode.js?yigma=B');
    const LA = A.previewLocalStorage, LB = B.previewLocalStorage;
    const run = (c) => `run${c}-0000000000000001`;
    // 1) A preview → B preview: B A xotirasini ko'rmaydi
    A.startLessonRun({ visitMode: 'preview', previewRunId: run('A') });
    LA.setItem('ccProgress:X', 'from-A');
    B.startLessonRun({ visitMode: 'preview', previewRunId: run('B') });
    r.bSeesA = LB.getItem('ccProgress:X');
    r.bOld = LB.getItem('ccProgress:L1');                 // haqiqiy progress ham ko'rinmaydi
    // 2) A preview → A jonli → B preview: B yozuvi haqiqiy saqlovga TUSHMAYDI
    A.startLessonRun({ liveToken: 'mentor.jwt.token' });
    B.startLessonRun({ visitMode: 'preview', previewRunId: run('C') });
    LB.setItem('ccProgress:L1', 'preview-B-write');
    r.bAfterALive = LB.getItem('ccProgress:L1');
    r.realAfterBPreview = b.ls._m.get('ccProgress:L1');
    // 3) A preview → B jonli: B (jonli) yozuvi haqiqiy saqlovga, A xotirasiga emas
    A.startLessonRun({ visitMode: 'preview', previewRunId: run('D') });
    B.startLessonRun({ liveToken: 'mentor.jwt.token' });
    LB.setItem('liveSession:L2', 'live-B');
    r.realLiveB = b.ls._m.get('liveSession:L2') ?? null;
    r.aSeesLiveB = LA.getItem('liveSession:L2');
    r.aPreview = A.isPreview();
    r.bPreview = B.isPreview();
    r.proto = protoTouched(b.Storage);
  } else if (name === 'hookprop') {
    fakeBrowser();
    await bundle();
    r.hook = await hookState({ liveToken: 'mentor.jwt.token', visitMode: 'preview' });
  }
  process.stdout.write(JSON.stringify(r));
}

const run = (name) => JSON.parse(execFileSync(process.execPath, [SELF], { env: { ...process.env, PREVIEW_SCEN: name }, encoding: 'utf8' }));

if (SCEN) {
  await runScenario(SCEN);
} else {
  test('belgi yo\'q → hammasi avvalgidek: Storage tegilmaydi, eski liveSession tiklanadi, so\'rov ketadi', () => {
    const r = run('oddiy');
    assert.equal(r.isPreview, false);
    assert.equal(r.patched, false);
    assert.deepEqual(r.liveRead, { mode: 'mentor', pin: '123456', token: 't' });
    assert.equal(r.fetchCalls, 1);
    assert.deepEqual(r.hook, { mode: 'mentor', pin: '123456', preview: false, hasLmsToken: false });
  });

  for (const [src, nom] of [['global', 'window.__CC_VISIT_MODE__'], ['urlYolgiz', 'URL\'dagi visit_mode=preview']]) {
    test(`${nom} yolg'iz — preview YOQILMAYDI (IT: bitta source of truth — faqat visitMode prop)`, () => {
      const r = run(src);
      assert.equal(r.isPreview, false);
      assert.equal(r.patched, false);
      assert.equal(r.fetchCalls, 1);
    });
  }

  for (const src of ['preview']) {
    test(`prop visitMode="preview": preview — 0 so'rov, eski holat ko'rinmaydi, yozuv xotirada, LMS kaliti va til tegilmaydi, token e'tiborsiz`, () => {
      const r = run(src);
      assert.equal(r.isPreview, true);
      assert.equal(r.liveRead, null);                       // R1: eski mentor sessiyasi tiklanmaydi
      assert.equal(r.progRead, null);                       // R3: eski progress ko'rinmaydi
      assert.equal(r.overlayProg, JSON.stringify({ screen: 2 }));
      assert.equal(r.realProg, JSON.stringify({ screen: 7 })); // haqiqiy saqlov o'zgarmadi
      assert.equal(r.realLive, JSON.stringify({ mode: 'mentor', pin: '123456', token: 't' }));
      assert.equal(r.lmsKey, 'lms-kaliti');
      assert.equal(r.lmsKeyReal, 'yangi');                  // LMS kaliti haqiqiy saqlovga yoziladi
      assert.equal(r.lang, 'ru');                           // til tanlovi haqiqiy saqlovdan o'qiladi
      assert.equal(r.langOverlay, 'uz');
      assert.equal(r.langReal, 'ru');                       // …lekin yozuv haqiqiy saqlovga TUSHMAYDI (F-1015-10)
      assert.equal(r.removedOverlay, null);
      assert.equal(r.removedReal, true);                    // o'chirish ham haqiqiy saqlovga tegmaydi
      assert.equal(r.sessReal, null);
      assert.equal(r.sessOverlay, 'x');
      assert.deepEqual([r.rpc, r.join, r.get, r.put], ['preview_offline', 'preview_offline', 'preview_offline', 'preview_offline']);
      assert.equal(r.fetchCalls, 0);
      assert.deepEqual(r.hook, { mode: 'self', pin: null, preview: true, hasLmsToken: false });
    });
  }

  test('prop: faqat aniq "preview"; previewRunId qabul qilinadi; yoqilgach o\'chmaydi', () => {
    const r = run('prop');
    assert.equal(r.before, false);
    assert.equal(r.wrongCase, false);
    assert.equal(r.live, false);
    assert.equal(r.patchedBefore, false);
    assert.equal(r.ok, true);
    assert.equal(r.runId, '7be2c261-5db1-4fb6-9265-b9da22e077e6');
    assert.equal(r.patchedAfter, false);                  // F-1021-10: Storage.prototype hech qachon tegilmaydi
    assert.equal(r.stays, true);
  });

  test('SPA (F-1021-08/09): yangi run noldan · o\'sha run saqlanadi · preview\'dan keyin jonli — preview yo\'q · jonli → preview izolyatsiya', () => {
    const r = run('spa');
    assert.equal(r.a, true);
    assert.equal(r.aAttempts, 1);
    assert.equal(r.aAgain, true);
    assert.equal(r.aProg, JSON.stringify({ screen: 2 }));     // AC-9: o'sha run — holat saqlanadi
    assert.equal(r.b, true);
    assert.equal(r.bProg, null);                              // AC-1: yangi previewRunId — noldan
    assert.equal(r.bRun, 'runB-0000000000000002');
    assert.equal(r.bAttempts, 0);                             // A javoblari B ga o'tmaydi
    assert.equal(r.live, false);                              // AC-3: preview proplarisiz — preview emas
    assert.equal(r.liveIsPreview, false);
    assert.equal(r.liveRun, null);
    assert.equal(r.liveProg, JSON.stringify({ screen: 7 }));  // haqiqiy saqlov ko'rinadi
    assert.deepEqual(r.liveSess, { mode: 'mentor', pin: '123456', token: 't' });
    assert.equal(r.liveAttempts, 0);                          // preview javoblari jonli natija-yukiga aralashmaydi
    assert.deepEqual(r.hookLive, { mode: 'mentor', pin: '123456', preview: false, hasLmsToken: false });
    assert.equal(r.liveFetch, 1);                             // jonli so'rovlar ochiq
    assert.equal(r.c, true);
    assert.equal(r.flushFetch, 1);                            // oldingi jonli urinishning so'nggi yozuvi yo'qolmaydi
    assert.equal(r.cRpc, 'preview_offline');                  // AC-8: preview'ning o'zi — so'rovsiz
    assert.equal(r.cProg, null);                              // AC-5: jonli holat preview'ga o'tmaydi
    assert.equal(r.cSess, null);
    assert.equal(r.realProg, JSON.stringify({ screen: 7 }));  // AC-7 (qisman): haqiqiy yozuvlar o'zgarmagan
    assert.equal(r.realDetails, false);
  });

  test('ikki mustaqil yig\'ma (F-1021-10): A→B preview · A preview→A jonli→B preview · A preview→B jonli — har biri o\'z rejimida', () => {
    const r = run('ikkiYigma');
    assert.equal(r.bSeesA, null);                           // two-independent-bundles-preview-memory
    assert.equal(r.bOld, null);
    assert.equal(r.bAfterALive, 'preview-B-write');         // B o'z xotirasida
    assert.equal(r.realAfterBPreview, JSON.stringify({ screen: 7 })); // bundle-A-live-then-bundle-B-preview-native-storage
    assert.equal(r.realLiveB, 'live-B');                    // ko'zgu holat: jonli B saqlovi yo'qolmaydi
    assert.equal(r.aSeesLiveB, null);
    assert.equal(r.aPreview, true);
    assert.equal(r.bPreview, false);
    assert.equal(r.proto, false);
  });

  test('hook opts.visitMode="preview" + liveToken → self, token e\'tiborsiz', () => {
    const r = run('hookprop');
    assert.deepEqual(r.hook, { mode: 'self', pin: null, preview: true, hasLmsToken: false });
  });
}
