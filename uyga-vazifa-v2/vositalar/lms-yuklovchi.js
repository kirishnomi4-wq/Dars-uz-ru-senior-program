// LMS uyga vazifa yuklovchi (go.coddycamp.uz, bo'lim sahifasida ishlaydi). Hech narsa o'chirilmaydi.
window.CC = {
  P: null, F: {}, log: [], ochir: [],
  sleep: ms => new Promise(r => setTimeout(r, ms)),
  async load() {
    this.F = {};
    for (const f of document.getElementById('ccYuk').files) {
      if (f.name === 'paket.json') this.P = JSON.parse(await f.text()).vazifalar; else if (f.name !== 'lib.js') this.F[f.name] = f;
    }
    return Object.keys(this.P).length + ' vazifa, ' + Object.keys(this.F).length + ' rasm';
  },
  img(n) { if (!n) return null; const f = this.F[n]; if (!f) throw new Error('rasm yoq: ' + n); return f; },
  async rows(sid) {
    const h = await fetch('/account/student_courses/section/' + sid).then(r => r.text());
    const d = new DOMParser().parseFromString(h, 'text/html');
    return [...d.querySelectorAll('table tbody tr')].map(r => [...r.querySelectorAll('td')].map(t => t.innerText.trim()))
      .filter(t => t.length > 4 && +t[1]).map(t => ({ id: +t[1], o: +t[2], lang: t[3], tur: t[4], q: t[5], s: t[7].split(/\s/)[0] }));
  },
  async post(sid, fd) {
    const r = await fetch('/account/student_courses/section/' + sid, { method: 'POST', body: fd, credentials: 'same-origin' });
    if (r.status !== 200) throw new Error('POST ' + sid + ' → ' + r.status);
  },
  async active(qid) {
    const fd = new FormData(); fd.append('question_id', qid); fd.append('status', 'active');
    const t = await fetch('/account/ajax/student_courses/change_question_status.php', { method: 'POST', body: fd, credentials: 'same-origin' }).then(r => r.text());
    if (!t.includes('success')) throw new Error('active ' + qid + ': ' + t.slice(0, 60));
  },
  // ── qo'shish (addForm bilan bir xil maydonlar) ──
  fd(type, lang) { const fd = new FormData(); fd.append('type_n', type); fd.append('lang', lang); return fd; },
  async addTest(sid, q, lang) {
    const fd = this.fd('test', lang); fd.append('type_test', 'one-option'); fd.append('test_one_option_question', q.q);
    const im = this.img(q.rasm); if (im) fd.append('test_question_selected_file', im, im.name.replace(/^(uz|ru)__/, ''));
    q.v.forEach((v, i) => { fd.append('value_text_selected_file[]', v); fd.append('hint_selected_file[]', q.h[i]); });
    fd.append('answer_one_option_point_selected_file', String(q.t + 1)); fd.append('addSubmit', '');
    await this.post(sid, fd);
  },
  async addCompiler(sid, b, lang) {
    const fd = this.fd('compiler', lang); fd.append('question_compiler', b.matn);
    const im = this.img(b.rasm); if (im) fd.append('compiler_image', im, im.name.replace(/^(uz|ru)__/, ''));
    fd.append('ai_prompt_compiler', b.prompt);
    for (const k of b.kod) fd.append('code_type_compiler[]', k);
    for (const [k, v] of Object.entries(b.starter)) fd.append(`starter_code_compiler[${k}]`, v);
    if (b.agent) fd.append('agent_enabled_compiler', '1');
    fd.append('addSubmit', ''); await this.post(sid, fd);
  },
  async addFile(sid, b, lang) {
    const fd = this.fd('input-file', lang); fd.append('topic_input_file', b.sarlavha); fd.append('question_input_file_new', b.matn);
    fd.append('addSubmit', ''); await this.post(sid, fd);
  },
  async addText(sid, b, lang) {
    const fd = this.fd('text', lang); fd.append('question_text', b.matn); fd.append('addSubmit', ''); await this.post(sid, fd);
  },
  // ── tahrir (editQuestion oynasi; forma har safar qayta qidiriladi) ──
  async openEdit(qid) {
    document.querySelector('.modal.show .close, .modal.show [data-dismiss="modal"], .modal.show .btn-close')?.click();
    editQuestion(qid);
    for (let i = 0; i < 40; i++) { await this.sleep(200); const f = document.getElementById('editForm'); if (f && +f.question_id?.value === qid && f.edit_type) return f; }
    throw new Error('edit oynasi ochilmadi ' + qid);
  },
  set(f, n, v) { const e = f.elements[n]; if (!e) throw new Error('maydon yoq: ' + n); e.value = v; e.dispatchEvent(new Event('change', { bubbles: true })); },
  async editFile(sid, qid, b, lang) {
    const f = await this.openEdit(qid); this.set(f, 'edit_type', 'input-file'); this.set(f, 'edit_lang', lang);
    this.set(f, 'edit_topic_input_file', b.sarlavha); this.set(f, 'edit_question_input_file_new', b.matn);
    const fd = new FormData(f); fd.append('editSubmit', ''); await this.post(sid, fd);
    const g = await this.openEdit(qid);
    if (g.edit_type.value !== 'input-file' || g.edit_lang.value !== lang || this.norm(g.edit_question_input_file_new.value) !== this.norm(b.matn)) throw new Error('editFile tekshiruv ' + qid);
  },
  async editText(sid, qid, b, lang) {
    const f = await this.openEdit(qid); this.set(f, 'edit_type', 'text'); this.set(f, 'edit_lang', lang); this.set(f, 'edit_text', b.matn);
    const fd = new FormData(f); fd.append('editSubmit', ''); await this.post(sid, fd);
    const g = await this.openEdit(qid);
    if (g.edit_type.value !== 'text' || g.edit_lang.value !== lang || this.norm(g.edit_text.value) !== this.norm(b.matn)) throw new Error('editText tekshiruv ' + qid);
  },
  kirill: s => /[а-яё]/i.test(s || ''),
  norm: s => (s || '').trim().replace(/[«»]/g, "'").replace(/\r/g, ''), // LMS «» ni ' ga almashtirib saqlaydi
  // ── bitta vazifa (mavjud uyga vazifa: v.uv) ──
  async vazifa(v) {
    const sid = v.uv; if (!sid) throw new Error('uv yoq ' + v.id);
    const eski = (await this.rows(sid)).filter(r => r.s === 'Active');
    const oldIds = new Set((await this.rows(sid)).map(r => r.id));
    const yoz = [];
    if (v.tur === 'test' || v.tur === 'compiler') {
      for (const lang of ['uz', 'ru']) {
        if (v.tur === 'test') for (const q of v[lang].savollar) await this.addTest(sid, q, lang);
        else await this.addCompiler(sid, v[lang], lang);
      }
      const yangi = (await this.rows(sid)).filter(r => !oldIds.has(r.id));
      for (const r of yangi) await this.active(r.id);
      const kut = v.tur === 'test' ? v.uz.savollar.length + v.ru.savollar.length : 2;
      if (yangi.length !== kut) throw new Error(`${v.id}: yangi ${yangi.length} ≠ ${kut}`);
      eski.forEach(r => this.ochir.push({ vazifa: v.id, sid, qid: r.id, lang: r.lang, tur: r.tur, q: r.q.slice(0, 60) }));
      yoz.push(`+${yangi.length} (${yangi.map(r => r.id).join(',')})`, `o'chiriladi: ${eski.map(r => r.id).join(',') || '—'}`);
    } else {
      // fayl/text: eski uz va ru bandlar tahrirlanadi (til matndan aniqlanadi), yetishmasa qo'shiladi, ortiqchasi ro'yxatga
      const pool = [...eski];
      const ol = lang => { let i = pool.findIndex(r => (lang === 'ru') === this.kirill(r.q)); if (i < 0) return null; return pool.splice(i, 1)[0]; };
      for (const lang of ['uz', 'ru']) {
        const r = ol(lang);
        if (r) { await (v.tur === 'file' ? this.editFile(sid, r.id, v[lang], lang) : this.editText(sid, r.id, v[lang], lang)); yoz.push(`${lang}✎${r.id}`); }
        else { await (v.tur === 'file' ? this.addFile(sid, v[lang], lang) : this.addText(sid, v[lang], lang)); yoz.push(`${lang}+`); }
      }
      const yangi = (await this.rows(sid)).filter(r => !oldIds.has(r.id));
      for (const r of yangi) await this.active(r.id);
      pool.forEach(r => this.ochir.push({ vazifa: v.id, sid, qid: r.id, lang: r.lang, tur: r.tur, q: r.q.slice(0, 60) }));
      if (pool.length) yoz.push(`o'chiriladi: ${pool.map(r => r.id).join(',')}`);
    }
    const oxir = (await this.rows(sid));
    yoz.push(`jami ${oxir.length}, active ${oxir.filter(r => r.s === 'Active').length}`);
    return v.id + ' [' + v.tur + '] ' + yoz.join(' · ');
  },
  async modul(ids) {
    const out = [];
    for (const id of ids) { try { out.push('✓ ' + await this.vazifa(this.P[id])); } catch (e) { out.push('✗ ' + id + ': ' + e.message); } }
    this.log.push(...out); return out.join('\n');
  },
};
'CC tayyor';

// ── 7–14-modul: yangi uyga vazifa (Practice) ochish — bo'lim (detail_part) sahifasida ishlaydi ──
Object.assign(window.CC, {
  async lessons(part) {
    const h = await fetch('/account/student_courses/detail_part/' + part).then(r => r.text());
    const d = new DOMParser().parseFromString(h, 'text/html');
    return [...d.querySelectorAll('table tbody tr')].map(r => [...r.querySelectorAll('td')].map(t => t.innerText.trim().replace(/\s+/g, ' ')))
      .filter(t => +t[1]).map(t => ({ id: +t[1], o: +t[2], uz: t[3], ru: t[4], tur: t[5], b: t[6], s: t[7] }));
  },
  async lessonStatus(id) {
    const fd = new FormData(); fd.append('lesson_id', id); fd.append('status', 'active');
    const t = await fetch('/account/ajax/student_courses/change_lesson_status.php', { method: 'POST', body: fd, credentials: 'same-origin' }).then(r => r.text());
    if (!t.includes('success')) throw new Error('lesson active ' + id + ': ' + t.slice(0, 60));
  },
  async openLesson(id) {
    document.querySelector('.modal.show .close, .modal.show [data-dismiss="modal"], .modal.show .btn-close')?.click();
    await this.sleep(300); editLesson(id);
    for (let i = 0; i < 40; i++) { await this.sleep(200); const f = document.getElementById('editForm'); if (f && +f.module_id?.value === id) return f; }
    throw new Error('dars oynasi ochilmadi ' + id);
  },
  async lessonPost(part, fd) {
    const r = await fetch('/account/student_courses/detail_part/' + part, { method: 'POST', body: fd, credentials: 'same-origin' });
    if (r.status !== 200) throw new Error('dars POST ' + r.status);
  },
  // bo'sh tartib: dars + 5, band bo'lsa +3/+2/+1/+4 (server band tartibni qabul qilmaydi — 7-10 da 105 «Metrika nima»da edi)
  bosh(L, t) { const band = new Set(L.filter(l => l.s !== 'Archive').map(l => l.o)); for (const d of [5, 3, 2, 1, 4]) if (!band.has(t + d)) return t + d; throw new Error('bo\'sh tartib yo\'q ' + t); },
  async yangiPractice(v) {
    const part = v.bolim;
    let L = await this.lessons(part);
    let hw = L.find(l => l.uz.trim() === v.nomUz.trim() && l.tur.startsWith('Practice'));
    if (!hw) {
      const f = document.getElementById('addForm');
      f.mtype_id.value = 'Practice'; f.mtype_id.dispatchEvent(new Event('change', { bubbles: true })); if (window.jQuery) jQuery(f.mtype_id).trigger('change');
      await this.sleep(500);
      f.querySelector('input[type=checkbox][name=is_homework]').checked = true;
      f.querySelector('input[type=checkbox][name=is_manual]').checked = false;
      f.level.value = 'standart'; f.coins.value = '0';
      [...f.elements['lesson_ids[]'].options].forEach(o => o.selected = false);
      f.module_text_uz.value = v.nomUz; f.module_text_ru.value = v.nomRu; f.description_uz.value = ''; f.description_ru.value = '';
      const fd = new FormData(f); fd.append('addLesson', '');
      await this.lessonPost(part, fd);
      L = await this.lessons(part); hw = L.find(l => l.uz.trim() === v.nomUz.trim() && l.tur.startsWith('Practice'));
      if (!hw) throw new Error('yangi Practice topilmadi ' + v.id);
    }
    // tartib = dars tartibi + 5
    let f = await this.openLesson(hw.id);
    const ord = (+f.module_order.value > v.tartib && +f.module_order.value < v.tartib + 6) ? +f.module_order.value : this.bosh(L.filter(l => l.id !== hw.id), v.tartib); if (+f.module_order.value !== ord) { f.module_order.value = String(ord); const fd = new FormData(f); fd.append('editLesson', ''); await this.lessonPost(part, fd); }
    // Class dars → lesson_ids[] ga uyga vazifa
    f = await this.openLesson(v.dars);
    const sel = f.elements['lesson_ids[]']; const opt = [...sel.options].find(o => +o.value === hw.id);
    if (!opt) throw new Error('dars ' + v.dars + ' ro\'yxatida ' + hw.id + ' yo\'q');
    if (!opt.selected) { opt.selected = true; const fd = new FormData(f); fd.append('editLesson', ''); await this.lessonPost(part, fd); }
    L = await this.lessons(part); hw = L.find(l => l.id === hw.id);
    if (!hw.s.startsWith('Active')) await this.lessonStatus(hw.id); // katakda «Draft Active» (tugma matni) bo'ladi
    const cl = (await this.lessons(part)).find(l => l.id === v.dars);
    return { hw: hw.id, tartib: (await this.lessons(part)).find(l => l.id === hw.id).o, belongs: cl.b };
  },
  async yangiVazifa(v) {
    const p = await this.yangiPractice(v); const sid = p.hw;
    const old = await this.rows(sid);
    if (old.length) throw new Error(`${v.id}: yangi Practice ${sid} bo'sh emas (${old.length}) — qayta yurgizilgan bo'lsa qo'lda ko'ring`);
    for (const lang of ['uz', 'ru']) {
      if (v.tur === 'test') for (const q of v[lang].savollar) await this.addTest(sid, q, lang);
      else if (v.tur === 'file') await this.addFile(sid, v[lang], lang);
      else if (v.tur === 'text') await this.addText(sid, v[lang], lang);
      else throw new Error('tur ' + v.tur);
    }
    const yangi = await this.rows(sid); for (const r of yangi) await this.active(r.id);
    const kut = v.tur === 'test' ? v.uz.savollar.length + v.ru.savollar.length : 2;
    const oxir = await this.rows(sid);
    if (oxir.length !== kut || oxir.some(r => r.s !== 'Active')) throw new Error(`${v.id}: bandlar ${oxir.length}/${kut}`);
    return `${v.id} [${v.tur}] Practice ${sid} @${p.tartib} ← dars ${v.dars} (${p.belongs}) · +${oxir.length}`;
  },
  async yangiModul(ids) {
    const out = [];
    for (const id of ids) { try { out.push('✓ ' + await this.yangiVazifa(this.P[id])); } catch (e) { out.push('✗ ' + id + ': ' + e.message); } }
    this.log.push(...out); return out.join('\n');
  },
});
'CC+ tayyor';
