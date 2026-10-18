(function () {
  const $ = (s) => document.querySelector(s);
  const yig = () => {
    const p = [1, 2, 3, 4, 5, 6].map(n => { const r = document.querySelector('input[name="q' + n + '"]:checked'); return r ? n + r.value : null; }).filter(Boolean);
    $('#jv').textContent = p.length ? p.join(' · ') : '— hali belgilanmagan —';
  };
  document.addEventListener('change', (e) => { if (e.target.matches('input[type="radio"]')) yig(); });
  $('#nusxa').addEventListener('click', () => {
    const t = $('#jv').textContent;
    const b = $('#nusxa');
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => { b.textContent = 'Nusxalandi ✓'; }, () => { const r = document.createRange(); r.selectNodeContents($('#jv')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = 'Belgilandi — Ctrl+C'; });
  });
  const z = $('#zoom');
  document.addEventListener('click', (e) => { const im = e.target.closest('img[data-zoom]'); if (im) { z.querySelector('img').src = im.src; z.hidden = false; } else if (e.target.closest('#zoom')) z.hidden = true; });
})();
