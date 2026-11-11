// Konveyer (11.11): ro'yxatdagi darslarni bittalab CRM'ga yuklaydi — yashirin iframe'da bo'lim sahifasi ochiladi,
// yukla-sahifa-v3 (`__darsSaqla`: uz → ru, bayt-solishtiruv) bilan saqlanadi, kutuvchi (`__kut` → `__kutFaollash`)
// CRM tekshiruvi tugagach XATO bo'lmasa Active qiladi. Bir vaqtda ko'pi bilan `parallel` dars kutishda (Draft vaqti qisqa).
// TO'XTAYDI: saqlash rad etilsa · faollashtirish to'xtasa (XATO / tekshiruv tugamadi) · konveyer/PAUZA fayli · window.__kv.pauza.
// Kutuvchi tabda ishlaydi (oldin yukla-sahifa-v3 + __kut yuklangan bo'lishi shart). Holat: dump/konveyer-holat.json.
(function () {
  const KV = 'http://127.0.0.1:5398/kv/';
  window.__kv = window.__kv || {holat: 'tayyor', i: 0, n: 0, natija: [], pauza: null};
  const kv = window.__kv;

  const pauzaFayl = async () => { try { const r = await fetch(KV + 'PAUZA', {cache: 'no-store'}); return r.ok; } catch (e) { return false; } };
  // nosoz — faqat SHU yurishda paydo bo'lganlar (oldingi yurishdagi ma'lum nosozlar, masalan 09-VsCode B06, hisobga olinmaydi)
  const nosoz = () => Object.entries(window.__faol || {}).filter(([q, v]) => (v.holat === 'stop' || v.holat === 'xato-js') && !(kv.nosozBoshi || []).includes(q));
  kv.rad = kv.rad || []; // saqlashda rad etilgan darslar (qator o'zgarmagan)
  const kutyapti = (L) => (L._qs || []).some(q => window.__faol[q] && window.__faol[q].holat === 'kutyapti');

  const modullar = (list) => {
    const m = {};
    for (const L of list) {
      const o = m[L.m] = m[L.m] || {jami: 0, active: 0, kutyapti: 0, nosoz: 0, otkazildi: 0};
      o.jami++;
      if (L._holat === 'allaqachon') { o.active++; continue; }
      if (L._holat === 'otkazildi') { o.otkazildi++; continue; }
      const h = (L._qs || []).map(q => window.__faol[q] && window.__faol[q].holat);
      if (h.length === 2 && h.every(x => x === 'active')) o.active++;
      else if (h.some(x => x === 'stop' || x === 'xato-js')) o.nosoz++;
      else if (h.some(x => x === 'kutyapti')) o.kutyapti++;
    }
    return m;
  };

  const holatYoz = (list) => window.__dump('konveyer-holat.json', {
    vaqt: new Date().toISOString(), holat: kv.holat, pauza: kv.pauza, i: kv.i, n: kv.n,
    joriy: list[kv.i] ? list[kv.i].fn : null, modullar: modullar(list),
    rad: kv.rad, nosoz: nosoz().map(([q, v]) => ({qid: q, holat: v.holat, stop: v.r && v.r.stop, xatolar: v.r && v.r.q && v.r.q.xatolar, e: v.e})),
    oxirgi: kv.natija.slice(-3)
  });

  const iframeOch = (sid) => new Promise((ok, no) => {
    let f = document.getElementById('__kvFrame');
    if (!f) { f = document.createElement('iframe'); f.id = '__kvFrame'; f.style.cssText = 'position:fixed;left:-12000px;top:0;width:1280px;height:900px;border:0;'; document.body.appendChild(f); }
    const t = setTimeout(() => no(new Error('iframe yuklanmadi ' + sid)), 90000);
    f.onload = () => { clearTimeout(t); ok(f.contentWindow); };
    f.src = '/account/student_courses/section/' + sid; // so'rov-parametrsiz: forma POST'i aynan bo'lim manziliga ketadi
  });

  window.__konveyer = async function (list, opt) {
    // davom: true — XATO/rad bo'lsa ham keyingi darsga o'tadi (yozib boradi); maxNosoz qatordan oshsa to'xtaydi (umumiy muammo belgisi)
    opt = Object.assign({parallel: 2, chegara: list.length, davom: false, maxNosoz: 0, maxRad: 0}, opt || {});
    kv.holat = 'ishlayapti'; kv.n = list.length; kv.pauza = null; kv.boshlandi = kv.boshlandi || new Date().toISOString();
    if (!kv.nosozBoshi) kv.nosozBoshi = Object.entries(window.__faol || {}).filter(([q, v]) => v.holat === 'stop' || v.holat === 'xato-js').map(([q]) => q);
    window.__kvList = list;
    let saqlandi = 0;
    for (let i = kv.i; i < list.length; i++) {
      kv.i = i;
      // kutishdagi darslar soni chegaradan kam bo'lguncha kutamiz
      while (list.slice(0, i).filter(kutyapti).length >= opt.parallel) {
        if (nosoz().length > opt.maxNosoz || kv.pauza) break;
        await window.__uxla(10000);
      }
      if (nosoz().length > opt.maxNosoz) { kv.pauza = 'faollashtirish to\'xtadi (' + nosoz().length + ' qator): ' + nosoz().map(([q, v]) => q + ' ' + (v.r ? v.r.stop : v.e)).join('; '); break; }
      if (kv.rad.length > opt.maxRad) { kv.pauza = 'saqlash rad etildi (' + kv.rad.length + ' dars): ' + kv.rad.map(x => x.fn).join(', '); break; }
      if (kv.pauza) break;
      if (await pauzaFayl()) { kv.pauza = 'PAUZA fayli'; break; }
      if (saqlandi >= opt.chegara) { kv.pauza = 'chegara ' + opt.chegara; break; }

      const L = list[i];
      // qayta ishga tushirishga chidamli: allaqachon yangi faylda bo'lsa — qayta saqlamaymiz
      const hu = await window.__holat(L.uz, L.sid), hr = await window.__holat(L.ru, L.sid);
      if (!hu || !hr) { kv.pauza = L.fn + ': qator topilmadi'; break; }
      if (hu.file === L.fn && hr.file === L.fn) {
        const qs = [];
        for (const [q, h] of [[L.uz, hu], [L.ru, hr]]) {
          if (h.status !== 'Active') qs.push({qid: q, sid: L.sid, m: L.m, oldSt: null});
          else if (!window.__faol[q]) window.__faol[q] = {holat: 'active', sid: L.sid, m: L.m, oldin: true};
        }
        L._holat = qs.length ? 'kutyapti' : 'allaqachon'; L._qs = [L.uz, L.ru];
        if (qs.length) window.__kut(qs);
        kv.natija.push({fn: L.fn, holat: L._holat});
        await holatYoz(list);
        continue;
      }

      let w, r;
      try { w = await iframeOch(L.sid); } catch (e) { kv.pauza = L.fn + ': ' + e.message; break; }
      try {
        w.eval(localStorage.__yk3); w.eval(localStorage.__yk3dars);
        r = await w.__darsSaqla(L);
      } catch (e) { r = {fn: L.fn, stop: 'js: ' + (e && e.message)}; }
      saqlandi++;
      const qs = [];
      if (r.u && r.u.ok) qs.push({qid: L.uz, sid: L.sid, m: L.m, oldSt: r.u.oldSt});
      if (r.r && r.r.ok) qs.push({qid: L.ru, sid: L.sid, m: L.m, oldSt: r.r.oldSt});
      L._qs = qs.map(x => x.qid); L._holat = 'saqlandi';
      if (qs.length) window.__kut(qs);
      kv.natija.push({fn: L.fn, u: r.u, r: r.r, stop: r.stop || null, sek: r.sek});
      if (!(r.u && r.u.ok && r.r && r.r.ok)) {
        const sabab = (r.u && r.u.stop) || (r.r && r.r.stop) || r.stop || '?';
        L._holat = 'otkazildi'; kv.rad.push({fn: L.fn, sabab});
        if (!opt.davom) { kv.pauza = 'saqlash: ' + L.fn + ' — ' + sabab; await holatYoz(list); break; }
        await holatYoz(list);
        continue;
      }
      await holatYoz(list);
    }
    // qolgan kutishlar tugashini kutamiz (pauzada ham — Draft qatorlar Active bo'lsin)
    while (list.some(kutyapti)) { await window.__uxla(10000); await holatYoz(list); }
    kv.holat = kv.pauza ? 'pauza' : (kv.i >= list.length - 1 ? 'tugadi' : 'to\'xtadi');
    if (nosoz().length && !kv.pauza) { kv.pauza = 'faollashtirish to\'xtadi'; kv.holat = 'pauza'; }
    await holatYoz(list);
    return kv.holat + (kv.pauza ? ' — ' + kv.pauza : '');
  };
  return 'konveyer tayyor';
})();
