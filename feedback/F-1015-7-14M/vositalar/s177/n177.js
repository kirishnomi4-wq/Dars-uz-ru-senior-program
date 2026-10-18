(function () {
  const $ = (s, r = document) => r.querySelector(s); const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const asl = {};
  $$('.dars').forEach(d => { asl[d.id] = d.innerHTML; });
  const ulash = { e3: e3, e5: e5, e8: e8, e10: e10, e11: e11 };
  document.addEventListener('click', (ev) => {
    const q = ev.target.closest('[data-qayta]'); if (!q) return;
    const id = q.dataset.qayta; const d = document.getElementById(id); d.innerHTML = asl[id]; ulash[id]();
  });
  function e3() {
    const J = ['velosipedda yuradigan o\'smirlar', 'g\'ildirak teshilsa, yaqin ustaxonani topolmay velosipedni uyga yetaklab ketishadi', 'yaqin ustaxonalar xaritasi'];
    const N = ['Kim uchun', 'Nima qiynaydi', 'Nima quriladi'];
    $$('#e3 .e3-q').forEach(q => q.querySelector('button').addEventListener('click', () => {
      const i = +q.dataset.i;
      q.innerHTML = '<div class="d-qator"><span>' + N[i] + '</span><div class="d-tayyor">' + J[i] + '</div></div>';
      const nx = $('#e3 .e3-q[data-i="' + (i + 1) + '"]'); if (nx) nx.hidden = false; else $('#e3-x').hidden = false;
    }));
  }
  function e5() {
    const G = [
      ['Ilovada to\'lov tugmasi yo\'q', 'y', 'Ichida tayyor yechim bor — to\'lov tugmasi. Muammo esa: kim qancha to\'lagani unutiladi.'],
      ['Kim qancha to\'lagani unutiladi', 'm', 'Odam bilan bo\'lgan voqea, yechim aytilmagan.'],
      ['Maktabga bot kerak', 'y', 'Bot — yechim. Qaysi voqea uchun kerakligi aytilmagan.'],
      ['Uy vazifasi chatda boshqa xabarlar ostida qolib ketadi', 'm', 'Odam bilan bo\'lgan voqea: vazifani topolmay qoladi.']
    ];
    let i = 0;
    const kor = () => { $('#e5-n').textContent = (i + 1) + ' / 4'; $('#e5-g').textContent = '«' + G[i][0] + '»'; $('#e5-iz').hidden = true; $$('#e5 .d-hn button').forEach(b => b.disabled = false); };
    kor();
    $$('#e5 .d-hn button').forEach(b => b.addEventListener('click', () => {
      const t = b.dataset.j === G[i][1]; const iz = $('#e5-iz');
      iz.className = 'e5-iz ' + (t ? 'ok' : 'xato');
      iz.innerHTML = (t ? '<b>To\'g\'ri — ' : '<b>Adashdingiz — bu ') + (G[i][1] === 'm' ? 'muammo.</b> ' : 'yechim.</b> ') + G[i][2];
      iz.hidden = false; $$('#e5 .d-hn button').forEach(x => x.disabled = true);
      setTimeout(() => {
        const c = document.createElement('span'); c.className = 'd-rc ' + (G[i][1] === 'm' ? 'ok' : 'chet'); c.textContent = (G[i][1] === 'm' ? 'muammo · ' : 'yechim · ') + G[i][0].slice(0, 26) + (G[i][0].length > 26 ? '…' : '');
        $('#e5-ro').appendChild(c); i++;
        if (i < G.length) kor(); else { $('#e5-k').hidden = true; $('#e5-x').hidden = false; }
      }, 1900);
    }));
  }
  function e8() {
    $$('#e8 .d-tq').forEach(b => b.addEventListener('click', () => { $('#e8-t').hidden = true; $('#e8-s').hidden = false; }));
    let s = 0;
    $('#e8-keyin').addEventListener('click', () => {
      s++; const el = $('#e8 [data-s="' + s + '"]'); if (el) el.hidden = false;
      if (s >= 2) $('#e8-keyin').parentElement.hidden = true;
    });
  }
  function e10() {
    const R = { r: ['Tanaffusda telefonni quvvatlash uchun bo\'sh rozetka topilmaydi', 'Oshxonada bugun nima borligini bilish uchun navbatga turib ko\'rishadi'], k: ['Maydondagi o\'yinga botdan yozilish'] };
    let n = 3, muammo = '', kim = '';
    const tek = () => {
      const bot = /\b(ilova|bot|sayt)/i.test(muammo); $('#e10-ogoh').hidden = !bot;
      const y = $('#e10-y').value.trim(); const yoq = [];
      if (!muammo) yoq.push('nima qiynaydi'); if (!kim) yoq.push('kim uchun'); if (!y) yoq.push('nima quriladi');
      return { bot, yoq, y };
    };
    const ochKeyin = () => { ['#e10-kq', '#e10-yq', '#e10-a'].forEach(s => $(s).hidden = false); };
    $$('#e10-man .d-chip').forEach(b => b.addEventListener('click', () => {
      $$('#e10-man .d-chip').forEach(x => x.classList.toggle('on', x === b));
      $('#e10-mq').hidden = false; const m = b.dataset.m; const mj = $('#e10-mj');
      if (m === 'o') { mj.innerHTML = '<input class="d-inp" id="e10-mi" placeholder="Oxirgi marta nimaga vaqtingiz behuda ketdi?">'; $('#e10-mi').addEventListener('input', (e) => { muammo = e.target.value.trim(); tek(); }); muammo = ''; }
      else {
        let k = 0; const qoy = () => { muammo = R[m][k % R[m].length]; mj.innerHTML = '<div class="d-tayyor"><span>' + muammo + '</span><button type="button" aria-label="Boshqasini olish">↻</button></div>'; mj.querySelector('button').addEventListener('click', () => { k++; qoy(); }); tek(); };
        qoy();
      }
      ochKeyin();
    }));
    $$('#e10-kim .d-chip').forEach(b => b.addEventListener('click', () => { $$('#e10-kim .d-chip').forEach(x => x.classList.toggle('on', x === b)); kim = b.textContent; }));
    $('#e10-saq').addEventListener('click', () => {
      const r = tek(); const sab = $('#e10-sab');
      if (r.bot) { sab.textContent = 'Avval muammo qatorini voqea qilib yozing.'; return; }
      if (r.yoq.length) { sab.textContent = 'Yetishmayapti: ' + r.yoq.join(', ') + '.'; return; }
      sab.textContent = '';
      const c = document.createElement('span'); c.className = 'd-rc ok'; c.textContent = n + ' · ' + r.y.slice(0, 24) + (r.y.length > 24 ? '…' : '') + ' ✓';
      $('#e10-ro').appendChild(c); $('#e10-son').textContent = n + ' / 6'; n++;
      const k = $('#e10-k'); k.classList.add('ket');
      setTimeout(() => {
        k.classList.remove('ket'); muammo = ''; kim = ''; $('#e10-n').textContent = n + '-g\'oya';
        $$('#e10 .d-chip').forEach(x => x.classList.remove('on')); $('#e10-y').value = ''; $('#e10-mj').innerHTML = '';
        ['#e10-mq', '#e10-kq', '#e10-yq', '#e10-a', '#e10-ogoh'].forEach(s => $(s).hidden = true);
        if (n > 6) { k.hidden = true; }
      }, 350);
    });
  }
  function e11() {
    $$('#e11 .d-hn button').forEach(b => b.addEventListener('click', () => {
      const x = $('#e11-x'); x.hidden = false;
      x.innerHTML = b.dataset.j === 'ha' ? 'Yechim muammoga mos. Keyingi g\'oyani o\'qing.' : 'Muammo qatorini aniqroq yozing: kim, qachon, nima bo\'ldi. Shu g\'oyaning kartasi ochiladi.';
    }));
  }
  e3(); e5(); e8(); e10(); e11();
  const z = $('#zoom');
  document.addEventListener('click', (e) => { const im = e.target.closest('img[data-zoom]'); if (im) { z.querySelector('img').src = im.src; z.hidden = false; } else if (e.target.closest('#zoom')) z.hidden = true; });
})();
