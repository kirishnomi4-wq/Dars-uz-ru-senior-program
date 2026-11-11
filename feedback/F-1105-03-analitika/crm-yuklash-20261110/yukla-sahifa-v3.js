// v3 (11.11) — v2 + CRM JSX-tekshiruvini KUTISH: saqlash → Draft → Исходник + Браузер → (XATO yo'q bo'lsa) Active.
// Sahifa: go.coddycamp.uz/account/student_courses/section/<sid>. Har navigatsiyadan keyin: eval(sessionStorage.__yk3)
// Faqat JSX fayl almashadi; tartib/til/nom/tur o'zgarmaydi. XATO bo'lsa faollashtirilmaydi — to'xtab foydalanuvchiga.
window.__waitFor = (fn, ms=20000) => new Promise((ok,no)=>{const t0=Date.now();(function p(){try{const v=fn(); if(v) return ok(v);}catch(e){} if(Date.now()-t0>ms) return no(new Error('kutish tugadi')); setTimeout(p,150);})();});
window.__uxla = (ms) => new Promise(r => setTimeout(r, ms));
window.__dump = (name, obj) => fetch('http://127.0.0.1:5399/save?name='+encodeURIComponent(name), {method:'POST', body: JSON.stringify(obj, null, 1)}).then(r => r.text()).catch(e => 'dump xato '+e);

// Qator holati — bo'lim sahifasini keshsiz o'qib (DOM'ga tegmaydi). sid berilmasa — joriy sahifa.
window.__holat = async function(qid, sid) {
  const p = sid ? '/account/student_courses/section/'+sid : location.pathname;
  const html = await (await fetch(p, {credentials:'same-origin', cache:'no-store'})).text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const tr = [...doc.querySelectorAll('table tbody tr')].find(tr => { const td = tr.querySelectorAll('td'); return td[1] && td[1].textContent.trim() === String(qid); });
  if (!tr) return null;
  const td = [...tr.querySelectorAll('td')];
  const t = td.map(x => x.textContent.replace(/\s+/g,' ').trim());
  const badge = td[7] && td[7].querySelector('.badge');
  const a = tr.querySelector('a[href*="jsx="]');
  let jsx = null; if (a) { try { jsx = new URL(a.getAttribute('href')).searchParams.get('jsx'); } catch(e) {} }
  return {qid: t[1], tartib: t[2], lang: t[3], type: t[4], nom: t[5], file: t[6], status: badge ? badge.textContent.trim() : t[7], jsx};
};

// CRM tekshiruv hisoboti (UI «Скачать JSON» bilan bir xil so'rov)
window.__hisobot = async function(qid) {
  const body = new FormData(); body.set('question_id', String(qid));
  const r = await fetch('/account/ajax/student_courses/jsx_validation_report.php', {method:'POST', body, credentials:'same-origin', cache:'no-store'});
  if (!r.ok) return {http: r.status};
  try { return await r.json(); } catch(e) { return {http: r.status, parse: 'json emas'}; }
};
window.__qisqa = (h) => {
  if (!h || !h.validation_id) return {vid: h ? h.validation_id : null};
  const st = h.static, br = h.browser;
  const xatolar = [st, br].filter(Boolean).flatMap(x => (x.topilmalar||[]).filter(t => t.daraja === 'xato').map(t => t.id+': '+t.qoida+(t.tafsilot?' — '+String(t.tafsilot).slice(0,120):'')));
  return {vid: h.validation_id, static: st ? {sana: st.sana, natija: st.natija, son: st.son} : null,
          browser: br ? {sana: br.sana, natija: br.natija, son: br.son} : null, xatolar};
};

// Bitta qatorga JSX yuklash — UI «Saqlash» bilan bir xil yo'l (v2 dan o'zgarishsiz)
window.__yukla2 = async function(qid, relPath, fileName) {
  const eski = document.querySelector('#editForm'); if (eski) eski.dataset.eski = '1';
  window.editQuestion(qid);
  const f = await window.__waitFor(() => { const f=document.querySelector('#editForm'); const q=f&&f.querySelector('input[name=question_id]'); const inp=f&&f.querySelector('#editLessonRunnerFile'); return (f && !f.dataset.eski && q && q.value===String(qid) && inp && f.querySelector('button[name=editSubmit]')) ? f : null; });
  const val = n => { const e = f.querySelector('[name="'+n+'"]'); return e ? e.value : null; };
  const meta = {type: val('edit_type'), lang: val('edit_lang'), order: val('edit_order1'), title: val('edit_question_lesson_runner')};
  if (meta.type !== 'lesson-runner') throw new Error(qid+': tur '+meta.type);
  const r0 = await fetch('http://127.0.0.1:5399/files/'+relPath); if (!r0.ok) throw new Error('lokal fayl yo\'q '+relPath);
  const blob = await r0.blob();
  const dt = new DataTransfer(); dt.items.add(new File([blob], fileName, {type:'text/javascript'}));
  f.querySelector('#editLessonRunnerFile').files = dt.files;
  f.querySelectorAll('.js-lesson-media').forEach(box => { if (box.dataset.prefix !== 'edit_lesson_runner_') box.querySelectorAll('input').forEach(i => { i.disabled = true; }); });
  const body = new FormData(f);
  body.set('_jsx_async', '1'); body.set('editSubmit', '1');
  const n = [...body.values()].filter(v => v instanceof File && v.name).length;
  body.set('_jsx_file_count', String(n));
  const res = await fetch(location.href, {method:'POST', body, credentials:'same-origin'});
  const txt = await res.text(); let j = null; try { j = JSON.parse(txt); } catch(e) {}
  return {qid, http: res.status, ok: j ? !!j.ok : false, error: j ? (j.error||null) : txt.slice(0,300), ...meta, size: blob.size, fileCount: n};
};

// CRM'dagi fayl = paketdagi fayl (bayt-bayt)
window.__solishtir = async function(jsxUrl, relPath) {
  const [a, b] = await Promise.all([
    fetch(jsxUrl, {cache:'no-store'}).then(r => r.ok ? r.arrayBuffer() : null),
    fetch('http://127.0.0.1:5399/files/'+relPath).then(r => r.arrayBuffer())]);
  if (!a) return {same:false, why:'crm fayl ochilmadi'};
  const x = new Uint8Array(a), y = new Uint8Array(b);
  if (x.length !== y.length) return {same:false, why:'hajm '+x.length+' ≠ '+y.length};
  for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return {same:false, why:'bayt '+i};
  return {same:true, size:x.length};
};

// Active — status badge'idagi «Active» bosilgandagi so'rovning aynan o'zi
window.__faollash = (qid) => new Promise((ok) => {
  const fd = new FormData(); fd.append('question_id', qid); fd.append('status', 'active');
  window.js_ajax_post('student_courses/change_question_status.php', fd)
    .done(d => { let r; try { r = typeof d === 'string' ? JSON.parse(d) : d; } catch(e) { r = {raw: String(d).slice(0,300)}; } ok(r); })
    .fail(x => ok({fail: x && x.status, text: x && String(x.responseText||'').slice(0,300)}));
});

// 1-bosqich: saqlash + bayt-solishtiruv (faollashtirmaydi). Joriy sahifa = shu qatorning bo'limi.
window.__saqla = async function(qid, relPath, fileName, eskiNom) {
  const oldin = await window.__holat(qid);
  if (!oldin) return {qid, stop:'qator topilmadi'};
  if (oldin.type !== 'lesson-runner') return {qid, stop:'tur '+oldin.type, oldin};
  if (oldin.file !== eskiNom && oldin.file !== fileName) return {qid, stop:'fayl nomi '+oldin.file+' ≠ '+eskiNom, oldin};
  const hOldin = window.__qisqa(await window.__hisobot(qid));
  let up = null, keyin = null, cmp = null;
  for (let urinish = 1; urinish <= 2; urinish++) {
    up = await window.__yukla2(qid, relPath, fileName);
    if (!up.ok) { if (urinish === 2) return {qid, stop:'saqlash: '+up.error, oldin, up}; continue; }
    keyin = await window.__holat(qid);
    cmp = keyin && keyin.jsx ? await window.__solishtir(keyin.jsx, relPath) : {same:false, why:'havola yo\'q'};
    if (cmp.same && keyin.file === fileName) break;
    if (urinish === 2) return {qid, stop:'solishtiruv: '+(cmp.why||('nom '+(keyin&&keyin.file))), oldin, up, keyin};
  }
  const meta = (keyin.tartib === oldin.tartib && keyin.lang === oldin.lang && keyin.nom === oldin.nom && keyin.type === oldin.type);
  return {qid, ok: meta, saqlandi: new Date().toISOString(), hOldin, oldin: {file: oldin.file, status: oldin.status, tartib: oldin.tartib, lang: oldin.lang},
          keyin: {file: keyin.file, status: keyin.status, jsx: keyin.jsx}, bayt: cmp, meta: meta ? 'o\'zgarmagan' : 'O\'ZGARDI'};
};

// 2-bosqich: tekshiruv (Исходник + Браузер) tugashini kutish → XATO yo'q bo'lsa Active. Istalgan CRM sahifasidan.
// hOldin — saqlashdan oldingi hisobot (yangi tekshiruvni eskisidan ajratish uchun).
// maxMs 40 daq: «Браузер» tekshiruvi CRM bo'yicha ketma-ket (~3 daq/fayl), navbat chuqur bo'lsa 15 daq yetmaydi (11.11 02:08 da 14097 shunga tushdi)
window.__kutFaollash = async function(qid, sid, hOldin, maxMs=40*60*1000) {
  const t0 = Date.now(); let h = null, q = null;
  const oldSt = hOldin && hOldin.static ? hOldin.static.sana : null;
  while (Date.now() - t0 < maxMs) {
    h = await window.__hisobot(qid); q = window.__qisqa(h);
    const yangiSt = q.static && q.static.sana !== oldSt;
    if (yangiSt && q.static.natija === 'XATO') break;
    if (yangiSt && q.browser && q.browser.sana >= q.static.sana) break;
    await window.__uxla(15000);
  }
  const kutildi = Math.round((Date.now()-t0)/1000);
  const tayyor = q && q.static && q.static.sana !== oldSt && (q.static.natija === 'XATO' || (q.browser && q.browser.sana >= q.static.sana));
  if (!tayyor) return {qid, stop:'tekshiruv tugamadi ('+kutildi+' s)', q};
  if (q.xatolar.length) return {qid, stop:'XATO '+q.xatolar.length, q, kutildi};
  const akt = await window.__faollash(qid);
  const yakun = await window.__holat(qid, sid);
  return {qid, ok: !!yakun && yakun.status === 'Active', kutildi, q: {vid: q.vid, static: q.static && q.static.natija, browser: q.browser && q.browser.natija, ogoh: q.browser && q.browser.son && q.browser.son.ogoh},
          akt: akt && (akt.stat || akt.raw || akt.fail || JSON.stringify(akt).slice(0,120)), yakun: yakun && {file: yakun.file, status: yakun.status}};
};
'yk3 tayyor';
