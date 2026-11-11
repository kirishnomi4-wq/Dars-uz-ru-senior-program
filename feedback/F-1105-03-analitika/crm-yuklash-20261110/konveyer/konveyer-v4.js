// Konveyer v4 (11.11 kunduzi, 43-javobdan keyin): ro'yxatdagi darslarni bittalab CRM'ga yuklaydi.
// Har dars: yashirin iframe'da bo'lim sahifasi → yukla-v4.js (diskdan, 5398) → __darsYukla (uz → ru: saqlash, bayt ✓, Active).
// Tekshiruv KUTILMAYDI (CRM endi bloklamaydi); tekshiruv natijalari keyin __tekshiruvYig bilan hisobotga yig'iladi.
// TO'XTAYDI: birinchi muammoda (saqlash rad · bayt farq · Active emas · js xato) · konveyer/PAUZA fayli · window.__kv4.pauza ·
//            ro'yxatda opt.modullar dan tashqari modul · opt.chegara.
// Ishga tushirish (asosiy tab, istalgan CRM sahifasi):
//   eval(await (await fetch('http://127.0.0.1:5398/kv/yukla-v4.js',{cache:'no-store'})).text());
//   eval(await (await fetch('http://127.0.0.1:5398/kv/konveyer-v4.js',{cache:'no-store'})).text());
//   const R = await (await fetch('http://127.0.0.1:5398/kv/royxat-v4.json',{cache:'no-store'})).json();
//   __konveyer4(R.filter(L => L.m === 2), {modullar: [2]});   // natija: dump/konveyer-v4-holat.json
(function () {
  const KV = 'http://127.0.0.1:5398/kv/';
  // 11.11 14:47 xato: `kv` IIFE yuklanganda bir marta olinardi → zanjir window.__kv4 ni yangilasa ham konveyer ESKI holatni (i=14) ishlatdi,
  // 5-Modulda faqat oxirgi dars yuklandi (zanjir tekshiruvi tutdi, zarar yo'q). Endi har __konveyer4 chaqiruvi YANGI holatdan (i=0) boshlaydi;
  // qayta ishga tushirishga chidamlilik — «allaqachon» tekshiruvi orqali.
  let kv = window.__kv4 = {holat: 'tayyor', i: 0, n: 0, natija: [], pauza: null};

  // To'xtatish fayli: sukut TOXTAT-V4. Eski `PAUZA` (v3, 11.11 02:34 foydalanuvchi qarori — 3-Modul to'xtatilgan) o'chirilmaydi;
  // v4 da modul chegarasini opt.modullar qo'riqlaydi. To'xtatish: `touch konveyer/TOXTAT-V4`.
  let pauzaNom = 'TOXTAT-V4';
  const pauzaFayl = async () => { try { const r = await fetch(KV + pauzaNom, {cache: 'no-store'}); return r.ok; } catch (e) { return false; } };
  const holatYoz = (list) => window.__dump('konveyer-v4-holat.json', {
    vaqt: new Date().toISOString(), holat: kv.holat, pauza: kv.pauza, i: kv.i, n: kv.n,
    joriy: list[kv.i] ? list[kv.i].fn : null,
    yuklandi: kv.natija.filter(x => x.ok).length, allaqachon: kv.natija.filter(x => x.holat === 'allaqachon').length,
    otkazildi: kv.natija.filter(x => x.otkazildi).map(x => x.fn + ' — ' + x.stop),
    natija: kv.natija
  });

  const iframeOch = (sid) => new Promise((ok, no) => {
    let f = document.getElementById('__kvFrame');
    if (!f) { f = document.createElement('iframe'); f.id = '__kvFrame'; f.style.cssText = 'position:fixed;left:-12000px;top:0;width:1280px;height:900px;border:0;'; document.body.appendChild(f); }
    const t = setTimeout(() => no(new Error('iframe yuklanmadi ' + sid)), 90000);
    f.onload = () => { clearTimeout(t); ok(f.contentWindow); };
    f.src = '/account/student_courses/section/' + sid; // so'rov-parametrsiz: forma POST'i aynan bo'lim manziliga ketadi
  });

  window.__konveyer4 = async function (list, opt) {
    opt = Object.assign({chegara: list.length, modullar: null, pauzaNom: 'TOXTAT-V4'}, opt || {});
    pauzaNom = opt.pauzaNom;
    if (!opt.modullar) return 'opt.modullar shart (masalan {modullar: [2]})';
    kv = window.__kv4 = {holat: 'tayyor', i: 0, n: 0, natija: [], pauza: null};
    const kod = await (await fetch(KV + 'yukla-v4.js', {cache: 'no-store'})).text();
    kv.holat = 'ishlayapti'; kv.n = list.length; kv.pauza = null; kv.boshlandi = kv.boshlandi || new Date().toISOString();
    window.__kvList = list;
    let saqlandi = 0;
    for (let i = kv.i; i < list.length; i++) {
      kv.i = i; const L = list[i];
      if (opt.modullar && !opt.modullar.includes(L.m)) { kv.pauza = L.fn + ': ' + L.m + '-Modul ruxsat etilmagan'; break; }
      if (await pauzaFayl()) { kv.pauza = pauzaNom + ' fayli'; break; }
      if (saqlandi >= opt.chegara) { kv.pauza = 'chegara ' + opt.chegara; break; }
      // qayta ishga tushirishga chidamli: ikkala qator allaqachon yangi faylda va Active bo'lsa — qayta saqlamaymiz
      const hu = await window.__holat(L.uz, L.sid), hr = await window.__holat(L.ru, L.sid);
      if (!hu || !hr) { kv.pauza = L.fn + ': qator topilmadi'; break; }
      if (hu.file === L.fn && hr.file === L.fn && hu.status === 'Active' && hr.status === 'Active') {
        kv.natija.push({fn: L.fn, m: L.m, holat: 'allaqachon'}); await holatYoz(list); continue;
      }
      let r;
      try { const w = await iframeOch(L.sid); w.eval(kod); r = await w.__darsYukla(L); }
      catch (e) { r = {fn: L.fn, m: L.m, ok: false, stop: 'js: ' + (e && e.message)}; }
      saqlandi++;
      kv.natija.push(r); await holatYoz(list);
      if (!r.ok) {
        // opt.otkaz (foydalanuvchi qarori 11.11 14:4x: 6-M 11 R04): faqat SAQLASHDA rad etilsa va ikkala qator hamon ESKI faylda Active bo'lsa — o'tkazamiz
        if ((opt.otkaz || []).includes(L.fn) && / saqlash: /.test(' ' + (r.stop || ''))) {
          const hu2 = await window.__holat(L.uz, L.sid), hr2 = await window.__holat(L.ru, L.sid);
          if (hu2 && hr2 && hu2.file === L.eski && hr2.file === L.eski && hu2.status === 'Active' && hr2.status === 'Active') {
            r.otkazildi = true; await holatYoz(list); continue;
          }
        }
        kv.pauza = 'TO\'XTADI: ' + L.fn + ' — ' + (r.stop || '?'); break;
      }
    }
    kv.holat = kv.pauza ? 'pauza' : 'tugadi';
    if (!kv.pauza) kv.i = list.length;
    await holatYoz(list);
    return kv.holat + (kv.pauza ? ' — ' + kv.pauza : '') + ' · yuklandi ' + kv.natija.filter(x => x.ok).length;
  };

  // Modul hisoboti uchun: har qatorning CRM tekshiruv natijasi (yuklashni to'xtatmaydi; «Браузер» ketma-ket ~3 daq/fayl)
  window.__tekshiruvYig = async function (list, nom) {
    const q = [];
    for (const L of list) for (const [til, qid] of [['uz', L.uz], ['ru', L.ru]]) {
      const h = window.__qisqa(await window.__hisobot(qid));
      q.push({fn: L.fn, til, qid, static: h.static && h.static.natija, browser: h.browser && h.browser.natija,
              ogoh: h.browser && h.browser.son ? h.browser.son.ogoh : null, xatolar: h.xatolar || []});
    }
    const xulosa = {jami: q.length, browserTugagan: q.filter(x => x.browser).length, xatoli: q.filter(x => x.xatolar.length).map(x => x.fn + ' ' + x.til + ': ' + x.xatolar.join('; '))};
    await window.__dump(nom || 'tekshiruv-v4.json', {vaqt: new Date().toISOString(), xulosa, q});
    return xulosa;
  };
  // Modulma-modul zanjir (11.11 14:4x, foydalanuvchi: «5 dan 14 gacha avtomat»): har modul → __konveyer4 → mustaqil qayta o'qish
  // (holat + bayt). O'tkazilgan dars eski faylda Active bo'lishi kerak. Har qanday nomuvofiqlikda TO'XTAYDI. Holat: dump/zanjir-holat.json.
  window.__zanjir4 = async function (R, modullar, opt) {
    opt = Object.assign({otkaz: []}, opt || {});
    const z = window.__z4 = {boshlandi: new Date().toISOString(), modullar, natija: [], holat: 'ishlayapti', pauza: null};
    const yoz = () => window.__dump('zanjir-holat.json', Object.assign({vaqt: new Date().toISOString()}, z));
    await yoz();
    for (const m of modullar) {
      const LL = R.filter(L => L.m === m);
      window.__kv4 = {holat: 'tayyor', i: 0, n: 0, natija: [], pauza: null};
      const res = await window.__konveyer4(LL, {modullar: [m], otkaz: opt.otkaz});
      const kn = window.__kv4.natija;
      const otk = new Set(kn.filter(x => x.otkazildi).map(x => x.fn));
      const muammo = []; let ok = 0, jami = 0;
      for (const L of LL) for (const [til, q] of [['uz', L.uz], ['ru', L.ru]]) {
        jami++;
        const h = await window.__holat(q, L.sid);
        if (otk.has(L.fn)) { if (h && h.status === 'Active' && h.file === L.eski) ok++; else muammo.push(L.fn + ' ' + til + ' ' + q + ': o\'tkazilgan, lekin ' + (h ? h.status + ' ' + h.file : 'qator yo\'q')); continue; }
        const c = h && h.file === L.fn && h.jsx ? await window.__solishtir(h.jsx, L.rel) : {same: false, why: h ? 'fayl ' + h.file : 'qator yo\'q'};
        if (h && h.status === 'Active' && h.file === L.fn && c.same) ok++; else muammo.push(L.fn + ' ' + til + ' ' + q + ': ' + (h ? h.status : '?') + ' ' + (c.why || ''));
      }
      z.natija.push({m, darslar: LL.length, res, yuklandi: kn.filter(x => x.ok).length, allaqachon: kn.filter(x => x.holat === 'allaqachon').length,
                     otkazildi: [...otk], tekshiruv: ok + '/' + jami, muammo, tugadi: new Date().toISOString()});
      await yoz();
      if (!res.startsWith('tugadi') || muammo.length) { z.pauza = m + '-Modul: ' + (muammo.length ? 'tekshiruv ' + ok + '/' + jami : res); break; }
    }
    z.holat = z.pauza ? 'pauza' : 'tugadi'; await yoz();
    return z.holat + (z.pauza ? ' — ' + z.pauza : '');
  };
  return 'konveyer v4 tayyor';
})();
