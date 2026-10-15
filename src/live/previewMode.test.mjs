// node --test src/live/previewMode.test.mjs
// F-1015: LMS preview (A-yechim). Yagona manba — visitMode prop. Preview-belgi sahifa yopilguncha o'chmaydi — shuning uchun har holat
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
    const pm = await import('./previewMode.js');
    const lc = await import('./liveClient.js');
    r.isPreview = pm.isPreview();
    r.patched = !!b.Storage.prototype.__ccPreview;
    r.liveRead = lc.liveRead('L1');
    await lc.liveRpc('session_heartbeat', {});
    r.fetchCalls = b.calls.length;
    r.hook = await hookState({ liveToken: null });
  } else if (name === 'global' || name === 'urlYolgiz') {
    // F-1015-09/13: window.__CC_VISIT_MODE__ ham, URL'dagi visit_mode ham manba EMAS — oddiy rejim qolishi kerak
    const b = name === 'global' ? fakeBrowser({ globalMode: 'preview' }) : fakeBrowser({ search: '?jsx=x.jsx&visit_mode=preview' });
    const pm = await import('./previewMode.js');
    const lc = await import('./liveClient.js');
    r.isPreview = pm.isPreview();
    r.patched = !!b.Storage.prototype.__ccPreview;
    await lc.liveRpc('session_heartbeat', {});
    r.fetchCalls = b.calls.length;
  } else if (name === 'preview') {
    const b = fakeBrowser();
    const pm = await import('./previewMode.js');
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
    const pm = await import('./previewMode.js');
    r.before = pm.isPreview();
    r.wrongCase = pm.notePreviewProps({ visitMode: 'Preview' });
    r.live = pm.notePreviewProps({ visitMode: 'live' });
    r.patchedBefore = !!b.Storage.prototype.__ccPreview;
    r.ok = pm.notePreviewProps({ visitMode: 'preview', previewRunId: '7be2c261-5db1-4fb6-9265-b9da22e077e6', liveToken: 'x' });
    r.runId = pm.previewRunId();
    r.patchedAfter = !!b.Storage.prototype.__ccPreview;
    r.stays = pm.notePreviewProps({});
  } else if (name === 'hookprop') {
    fakeBrowser();
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
    assert.equal(r.patchedAfter, true);
    assert.equal(r.stays, true);
  });

  test('hook opts.visitMode="preview" + liveToken → self, token e\'tiborsiz', () => {
    const r = run('hookprop');
    assert.deepEqual(r.hook, { mode: 'self', pin: null, preview: true, hasLmsToken: false });
  });
}
