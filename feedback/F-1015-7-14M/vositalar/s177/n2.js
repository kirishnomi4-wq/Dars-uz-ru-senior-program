(function () {
  const $ = (s, r = document) => r.querySelector(s); const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const asl = {}; $$('.dars[id]').forEach(d => { asl[d.id] = d.innerHTML; });
  const fmt = (x) => String(Math.round(x * 100) / 100).replace('.', ',');
  const ulash = { u3, r5, o10, s11 };
  document.addEventListener('click', (ev) => { const q = ev.target.closest('[data-qayta]'); if (!q) return; const id = q.dataset.qayta; const d = document.getElementById(id); d.innerHTML = asl[id]; ulash[id](); });
  function u3() {
    const SAV = ['Bajariladimi?', 'Real auditoriya bormi?', 'Qiziqmi?'];
    const G = [["Jamoa yig'ish", [1, 1, 1]], ["Maydon pulini bo'lishish", [1, 1, 1]], ["Mahalla to'garaklari", [1, 1, 1]], ['Sinf uy vazifalari', [1, 1, 1]], ['Eski darsliklar', [0], 'pul va yetkazish kerak']];
    let q = 0;
    const chiz = () => {
      $('#u3-sav').innerHTML = q < 3 ? '<button class="d-btn" type="button">' + (q + 1) + '. ' + SAV[q] + '</button>' : '<div class="d-xulosa">To\'rtta g\'oya o\'tdi. «Eski darsliklar» chetda — o\'chirilmadi, sababi yozildi.</div>';
      const b = $('#u3-sav button'); if (b) b.onclick = () => { q++; chiz(); };
      $('#u3-ro').innerHTML = G.filter(g => !(g[1][0] === 0 && q >= 1)).map(g => '<div class="u3-q"><span>' + g[0] + '</span><span class="u3-b">' + [0, 1, 2].map(k => k < q ? '<i class="ok">✓</i>' : '<i>?</i>').join('') + '</span></div>').join('');
      const chet = G.filter(g => g[1][0] === 0 && q >= 1);
      $('#u3-chet').hidden = !chet.length;
      $('#u3-chet-ro').innerHTML = chet.map(g => '<div class="u3-q chet"><span>' + g[0] + '<small>' + g[2] + '</small></span><span class="u3-b"><i class="yoq">✕</i></span></div>').join('');
    };
    chiz();
  }
  function bars(el, rows, hi) {
    const max = Math.max(...rows.map(r => r[1]));
    el.innerHTML = rows.slice().sort((a, b) => b[1] - a[1]).map((r, i) => '<div class="br' + (r[0] === hi ? ' hi' : '') + '"><span class="br-n">' + (i + 1) + '. ' + r[0] + '</span><span class="br-t"><i style="width:' + Math.round(r[1] / max * 100) + '%"></i></span><b>' + fmt(r[1]) + '</b></div>').join('');
  }
  function r5() {
    const Q = [
      ['Qamrov', 'Bir oyda nechta odam ishlatadi?', '60 ta o\'yinchi', 60],
      ['Ta\'sir', 'Har biriga qanchalik yordam beradi?', 'katta — o\'yin bo\'ladi yoki bo\'lmaydi', 2],
      ['Ishonch', 'Bunga dalil bormi?', 'dalil bor — 9-Modulda 5 kishidan 2 tasi aytgan', 0.8],
      ['Mehnat', 'Necha haftada quriladi?', '4 hafta', 4]
    ];
    let k = 0;
    const btn = $('#r5-next');
    const chiz = () => {
      $('#r5-q').innerHTML = Q.slice(0, k).map((x, i) => '<div class="r5-r"><span class="r5-l"><b>' + x[0] + '</b>' + x[1] + '</span><span class="r5-j">' + x[2] + '</span><span class="r5-s">' + (i === 2 ? Math.round(x[3] * 100) + '%' : fmt(x[3])) + '</span></div>').join('');
      if (k === 4) { $('#r5-f').hidden = false; $('#r5-f').innerHTML = '60 × 2 × 0,8 ÷ 4 = <b>24</b>'; btn.textContent = 'Ikkinchi g\'oya bilan solishtirish'; }
      else if (k < 4) btn.textContent = (k + 1) + '. ' + Q[k][0];
    };
    btn.onclick = () => { if (k < 4) { k++; chiz(); } else { const b = $('#r5-bar'); b.hidden = false; bars(b, [["Jamoa yig'ish", 24], ["Mahalla to'garaklari", 20]], "Jamoa yig'ish"); btn.hidden = true; } };
    chiz(); btn.textContent = '1. Qamrov';
  }
  function o10() {
    const v = {};
    $$('#o10 .d-chiplar').forEach(c => c.querySelectorAll('.d-chip').forEach(b => b.addEventListener('click', () => {
      c.querySelectorAll('.d-chip').forEach(x => x.classList.toggle('on', x === b)); v[c.dataset.k] = +b.dataset.v;
      const f = $('#o10-f'); const ok = ['q', 't', 'i', 'm'].every(x => v[x] !== undefined);
      f.innerHTML = ['q', 't', 'i', 'm'].map(x => v[x] === undefined ? '…' : (x === 'i' ? Math.round(v[x] * 100) + '%' : fmt(v[x]))).join(' × ').replace(/ × ([^×]*)$/, ' ÷ $1') + ' = <b>' + (ok ? fmt(v.q * v.t * v.i / v.m) : '…') + '</b>';
    })));
    $('#o10-f').innerHTML = '… × … × … ÷ … = <b>…</b>';
  }
  function s11() {
    const R = (i) => [["Jamoa yig'ish", 24], ["Mahalla to'garaklari", 80 * 1 * i / 2], ["Maydon pulini bo'lishish", 5], ['Sinf uy vazifalari', 3.75]];
    bars($('#s11-bar'), R(0.5), "Mahalla to'garaklari");
    $$('#s11-c .d-chip').forEach(b => b.addEventListener('click', () => {
      $$('#s11-c .d-chip').forEach(x => x.classList.toggle('on', x === b));
      bars($('#s11-bar'), R(+b.dataset.v), "Mahalla to'garaklari"); $('#s11-x').hidden = +b.dataset.v !== 0.8;
    }));
  }
  u3(); r5(); o10(); s11();
  const z = $('#zoom');
  document.addEventListener('click', (e) => { const im = e.target.closest('img[data-zoom]'); if (im) { z.querySelector('img').src = im.src; z.hidden = false; } else if (e.target.closest('#zoom')) z.hidden = true; });
})();
