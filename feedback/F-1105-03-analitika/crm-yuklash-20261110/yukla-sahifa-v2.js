// v2 (10.11 23:4x) — CRM yangi formasi uchun: «Saqlash» _jsx_async=1 bilan, javob JSON {ok,error};
// fayl versions/<id>/lesson.jsx da; yuklangach qator Draft bo'ladi → bayt-solishtiruv ✓ bo'lsagina Active (foydalanuvchi ruxsati 23:38).
// Sahifa: go.coddycamp.uz/account/student_courses/section/<sid>. Har navigatsiyadan keyin: eval(sessionStorage.__yk2)
window.__waitFor = (fn, ms=20000) => new Promise((ok,no)=>{const t0=Date.now();(function p(){try{const v=fn(); if(v) return ok(v);}catch(e){} if(Date.now()-t0>ms) return no(new Error('kutish tugadi')); setTimeout(p,150);})();});

// Qator holati — sahifani keshsiz qayta o'qib (DOM'ga tegmaydi)
window.__holat = async function(qid) {
  const html = await (await fetch(location.pathname, {credentials:'same-origin', cache:'no-store'})).text();
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

// Bitta qatorga JSX yuklash — UI «Saqlash» bilan bir xil yo'l (faqat JSX fayl almashadi)
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
  // UI kabi: lesson-runner'dan boshqa turlarning resurs bloklari yuborilmaydi
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

// Active qilish — status badge'idagi «Active» bosilgandagi so'rovning aynan o'zi
window.__faollash = (qid) => new Promise((ok, no) => {
  const fd = new FormData(); fd.append('question_id', qid); fd.append('status', 'active');
  window.js_ajax_post('student_courses/change_question_status.php', fd)
    .done(d => { let r; try { r = typeof d === 'string' ? JSON.parse(d) : d; } catch(e) { r = {raw: String(d).slice(0,300)}; } ok(r); })
    .fail(x => no(new Error('faollash xato '+(x && x.status))));
});

// Bitta qator to'liq: oldin-tekshiruv → yuklash → solishtirish (1 qayta urinish) → Active → keyin-holat
window.__qator = async function(qid, relPath, fileName, eskiNom) {
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
  let akt = null;
  if (keyin.status !== 'Active') akt = await window.__faollash(qid);
  const yakun = await window.__holat(qid);
  const xato = [];
  if (yakun.status !== 'Active') xato.push('status '+yakun.status);
  if (yakun.tartib !== oldin.tartib || yakun.lang !== oldin.lang || yakun.nom !== oldin.nom || yakun.type !== oldin.type) xato.push('meta o\'zgardi');
  return {qid, ok: xato.length === 0, xato, oldin: {file: oldin.file, status: oldin.status, tartib: oldin.tartib, lang: oldin.lang}, up: {ok: up.ok, error: up.error, size: up.size, fileCount: up.fileCount},
          akt: akt && (akt.stat || akt.raw || JSON.stringify(akt).slice(0,120)), yakun: {file: yakun.file, status: yakun.status, jsx: yakun.jsx}, bayt: cmp};
};
'yk2 tayyor';
