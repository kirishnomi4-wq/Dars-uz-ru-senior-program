// CRM section sahifasida (go.coddycamp.uz/account/student_courses/section/<sid>) javascript_tool bilan bir marta e'lon qilinadi.
// Keyin har qator uchun:  await window.__yukla(qid, '2-Modul/01-InternetLesson-v5.jsx', '01-InternetLesson-v5.jsx')
// Fayl lokal yordamchi serverdan olinadi (yordamchi-server.mjs, 127.0.0.1:5399, faqat yuklash-20261029-prod/yakka).
window.__waitFor = (fn, ms=15000) => new Promise((ok,no)=>{const t0=Date.now();(function p(){try{const v=fn(); if(v) return ok(v);}catch(e){} if(Date.now()-t0>ms) return no(new Error('kutish tugadi')); setTimeout(p,150);})();});
window.__yukla = async function(qid, relPath, fileName) {
  const eski = document.querySelector('#editForm');
  if (eski) eski.dataset.eski = '1';                       // editQuestion formani AJAX bilan QAYTA chizadi — eskisini belgilab qo'yamiz
  window.editQuestion(qid);
  const f = await window.__waitFor(() => { const f=document.querySelector('#editForm'); const q=f&&f.querySelector('input[name=question_id]'); const inp=f&&f.querySelector('#editLessonRunnerFile'); return (f && !f.dataset.eski && q && q.value===String(qid) && inp && f.querySelector('button[name=editSubmit]')) ? f : null; });
  const sel = f.querySelector('select[name=edit_type]'); const lang = f.querySelector('select[name=edit_lang]');
  const r0 = await fetch('http://127.0.0.1:5399/files/'+relPath); if(!r0.ok) throw new Error('lokal fayl yo\'q '+relPath);
  const blob = await r0.blob();
  const file = new File([blob], fileName, {type:'text/javascript'});
  const dt = new DataTransfer(); dt.items.add(file);
  const inp = f.querySelector('#editLessonRunnerFile'); inp.files = dt.files;   // faqat JSX fayl almashadi
  const btn = f.querySelector('button[name=editSubmit]');                        // «Saqlash» tugmasi (name=editSubmit, id=editLessonRunnerButton)
  const fd = new FormData(f, btn);                                               // «Saqlash» bosilgandagi bilan bir xil maydonlar
  const res = await fetch(location.pathname, {method:'POST', body: fd, credentials:'same-origin', redirect:'follow'});
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html,'text/html');
  const tr = [...doc.querySelectorAll('table tbody tr')].find(tr=>[...tr.querySelectorAll('td')].some(td=>td.textContent.trim()===String(qid)));
  const a = tr && tr.querySelector('a[href*="jsx="]');
  return {qid, status: res.status, url: res.url, type: sel&&sel.value, lang: lang&&lang.value, size: blob.size, fieldCount: [...fd.keys()].length,
          rowText: tr ? tr.textContent.replace(/\s+/g,' ').trim() : null,
          newHash: a ? (a.getAttribute('href').split('lesson_runner/')[1]||'').replace('.jsx','') : null};   // newHash chiqishda «[BLOCKED]» ko'rinadi — bu faqat ko'rsatish; qiymat sahifada bor
};
