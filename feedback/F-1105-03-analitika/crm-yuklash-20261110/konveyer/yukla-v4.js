// yukla-v4 (11.11 kunduzi, Abdullohning 43-javobidan keyin). v3 dan farqi:
//  - CRM endi tekshiruvni KUTMAYDI: Active qatorga yangi fayl saqlansa qator Active bo'lib qoladi, yangi versiya darhol o'quvchida.
//    Shuning uchun saqlagach tekshiruv kutilmaydi; faqat bayt-solishtiruv + holat Active ekanini tekshirish
//    (Active bo'lmasa — __faollash, CRM endi tekshiruvsiz ham ruxsat beradi).
//  - Fayl katagida endi ogohlantirish bloki ham bor («Опубликовано / сохранено с замечаниями» + JSON) — fayl nomi
//    havola matnidan olinadi (v3 katakning butun matnini olardi → nom solishtiruvi buzilardi).
//  - Skript diskda (konveyer-server 5398 /kv/yukla-v4.js) — localStorage'ga bog'liq emas (v3 dagi __darsSaqla/__kut
//    faqat brauzer xotirasida edi va 11.11 03:02 da yo'qoldi).
// Sahifa: go.coddycamp.uz/account/student_courses/section/<sid> (konveyer iframe'da ochadi). Fayllar: yordamchi-server 5399 (YAKKA=<paket>/yakka).
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
  const a = td[6] && td[6].querySelector('a[href*="jsx="]');
  let jsx = null; if (a) { try { jsx = new URL(a.getAttribute('href'), location.origin).searchParams.get('jsx'); } catch(e) {} }
  const ogoh = td[6] && td[6].querySelector('details summary');
  return {qid: t[1], tartib: t[2], lang: t[3], type: t[4], nom: t[5], file: a ? a.textContent.trim() : t[6],
          status: badge ? badge.textContent.trim() : t[7], jsx, ogoh: ogoh ? ogoh.textContent.trim() : null};
};

// CRM tekshiruv hisoboti (UI «Скачать JSON» bilan bir xil so'rov) — faqat hisobot uchun, yuklashni to'xtatmaydi
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

// Bitta qatorga JSX yuklash — UI «Saqlash» bilan bir xil yo'l (v2/v3 dan o'zgarishsiz)
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

// Saqlash + bayt-solishtiruv + meta (tartib/til/nom/tur) o'zgarmaganini tekshirish. Joriy sahifa = shu qatorning bo'limi.
window.__saqla = async function(qid, relPath, fileName, eskiNom) {
  const oldin = await window.__holat(qid);
  if (!oldin) return {qid, stop:'qator topilmadi'};
  if (oldin.type !== 'lesson-runner') return {qid, stop:'tur '+oldin.type, oldin};
  if (oldin.file !== eskiNom && oldin.file !== fileName) return {qid, stop:'fayl nomi '+oldin.file+' ≠ '+eskiNom, oldin};
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
  return {qid, ok: meta, oldin: {file: oldin.file, status: oldin.status, tartib: oldin.tartib, lang: oldin.lang},
          keyin: {file: keyin.file, status: keyin.status}, bayt: cmp, meta: meta ? 'o\'zgarmagan' : 'O\'ZGARDI'};
};

// Bitta dars: uz → ru. Har qator: saqlash → bayt ✓ → Active (bo'lmasa faollashtirish) → yakuniy holat. Birinchi muammoda to'xtaydi.
// L = {m, sid, uz, ru, rel, fn, eski, lid}
window.__darsYukla = async function(L) {
  const t0 = Date.now(); const out = {fn: L.fn, lid: L.lid, m: L.m};
  for (const [til, qid] of [['u', L.uz], ['r', L.ru]]) {
    let s;
    try { s = await window.__saqla(qid, L.rel, L.fn, L.eski); } catch (e) { s = {qid, stop: 'js: '+(e && e.message)}; }
    if (s.stop || !s.ok) { out[til] = s; out.stop = (til === 'u' ? 'uz ' : 'ru ')+qid+': '+(s.stop || 'meta '+s.meta); break; }
    let h = await window.__holat(qid), akt = null;
    if (!h || h.status !== 'Active') { akt = await window.__faollash(qid); h = await window.__holat(qid); }
    const ok = !!h && h.status === 'Active' && h.file === L.fn;
    out[til] = {qid, ok, oldin: s.oldin.status + ' ' + s.oldin.file, keyin: h ? h.status + ' ' + h.file : null, bayt: s.bayt.size,
                akt: akt ? (akt.stat || akt.raw || akt.fail || JSON.stringify(akt).slice(0,120)) : null, ogoh: h ? h.ogoh : null};
    if (!ok) { out.stop = (til === 'u' ? 'uz ' : 'ru ')+qid+': Active emas ('+(h ? h.status : '?')+')'; break; }
  }
  out.ok = !out.stop; out.sek = Math.round((Date.now()-t0)/1000);
  return out;
};
'yukla-v4 tayyor';
