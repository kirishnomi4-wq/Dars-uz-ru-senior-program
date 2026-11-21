// Qat'iy setka tekshiruvi (v3.2): (1) panel/matn qahramonni yopmaydimi; (2) yo'l qatlamiga (oynaning pastki 40%) panel tushmaydimi;
// (3) narsa oynadan yoki ish zonasidan chiqmaydimi; (4) sarlavha bir qatorda (sahna shablonida — huk savoli — ikki qatorgacha) va ustuniga sig'adimi;
// (5) Coddy gapi 12 so'zdan oshmaydimi; (6) tepada bekat chizig'i yo'qmi (38-qaror); (7) bir qatorli yozuv idishidan chiqmaydimi; (8) chap ustunda bo'sh oraliq yo'qmi; (9) panel ichi sig'adimi
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const p = await b.newPage({ viewport: { width: 1500, height: 1000 } })
await p.goto('file://' + process.argv[2]); await p.waitForTimeout(1800)
const r = await p.evaluate(() => {
  const out = [], R = (e) => e.getBoundingClientRect()
  const kes = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top))
  let soni = 0
  document.querySelectorAll('.wrap .ekran').forEach((ek) => {
    soni++
    const id = ek.getAttribute('aria-label').split(' ')[0]
    ek.querySelectorAll('.oyna').forEach((o) => {
      const or = R(o), yq = { left: or.left, right: or.right, top: or.top + or.height * 0.6, bottom: or.bottom }
      const panel = [...o.querySelectorAll('.gl, .jv')].filter((e) => !e.closest('.yol'))
      const aktyor = [...o.querySelectorAll('.yol .q svg, .cdy svg, .cdy2 svg, .qq svg, .xr-q svg')]
      panel.forEach((pn) => { const pr = R(pn); if (kes(pr, yq) > 4) out.push(`${id}: «${(pn.className + '').slice(0, 18)}» yo‘l qatlamiga tushdi (${Math.round(kes(pr, yq))}px²)`); if (pr.left < or.left - 1 || pr.right > or.right + 1 || pr.top < or.top - 1 || pr.bottom > or.bottom + 1) out.push(`${id}: «${(pn.className + '').slice(0, 18)}» oynadan chiqdi`)
        aktyor.forEach((a) => { const ar = R(a), k = kes(pr, ar); if (k > ar.width * ar.height * 0.03) out.push(`${id}: «${(pn.className + '').slice(0, 18)}» qahramonni yopdi (${Math.round(100 * k / (ar.width * ar.height))}%)`) }) })
      aktyor.forEach((a) => { const ar = R(a); if (ar.top < or.top + or.height * 0.35) out.push(`${id}: qahramon tepa qatlamga chiqdi`) })
    })
    const hm = R(ek.querySelector('.hm'));
    [...ek.querySelectorAll('.hm > *')].forEach((e) => { const er = R(e); if (er.width && (er.bottom > hm.bottom + 1 || er.right > hm.right + 1)) out.push(`${id}: «${(e.className + '').slice(0, 18)}» ish zonasidan chiqdi`) })
    ek.querySelectorAll('.sar').forEach((s) => {
      const lh = parseFloat(getComputedStyle(s).lineHeight), q = Math.round(s.getBoundingClientRect().height / lh), ruxsat = ek.classList.contains('t2') ? 2 : 1
      if (q > ruxsat) out.push(`${id}: sarlavha ${q} qator (ruxsat ${ruxsat})`)
      const ota = s.parentElement, oR = R(ota)
      if (s.scrollWidth > s.clientWidth + 1 || R(s).right > oR.right + 1) out.push(`${id}: sarlavha ustuniga sig‘madi`)
    })
    ek.querySelectorAll('.cg p').forEach((g) => { const t = [...g.childNodes].filter((n) => n.nodeName !== 'SMALL').map((n) => n.textContent).join(' '), s = t.split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length; if (s > 12) out.push(`${id}: Coddy gapi ${s} so‘z (12 gacha)`) })
    // (7) bir qatorli yozuv (nowrap) o'z idishidan chiqmaydi
    ek.querySelectorAll('.hm *').forEach((e) => { if (getComputedStyle(e).whiteSpace !== 'nowrap' || !e.parentElement || e.closest('svg')) return; const er = R(e), pr = R(e.parentElement); if (er.width && (e.scrollWidth > e.clientWidth + 2 || er.right > pr.right + 1.5 || er.left < pr.left - 1.5) && !e.closest('.sudra, .yol, .konfeti')) out.push(`${id}: «${(e.textContent || '').trim().slice(0, 22)}» idishidan chiqdi`) })
    // (8) ikki ustun: chap ustunda bo'sh oraliq 3 cqw dan oshmaydi (16.11: sarlavha bir qatorga tushgach 9–17 cqw bo'sh qolgan edi)
    const cw = R(ek).width / 100
    ek.querySelectorAll('.t1 .chap, .chap').forEach((c) => { if (!ek.classList.contains('t1')) return; const k = [...c.children].map(R), cr = R(c); let m = 0; for (let i = 1; i < k.length; i++) m = Math.max(m, k[i].top - k[i - 1].bottom); m = Math.max(m, cr.bottom - k[k.length - 1].bottom); if (m > 3 * cw) out.push(`${id}: chap ustunda ${(m / cw).toFixed(1)} cqw bo‘sh oraliq`) })
    // (9) sahna panelining ichi sig'adi (kesilmaydi)
    ek.querySelectorAll('.pan').forEach((pn) => { if (pn.scrollHeight > pn.clientHeight + 1) out.push(`${id}: panel ichi sig‘madi (${pn.scrollHeight - pn.clientHeight}px)`) })
    if (ek.querySelector('.seg')) out.push(`${id}: tepada bekat chizig‘i bor (38-qaror)`)
  })
  return { out, soni }
})
console.log(`ekran: ${r.soni}`, r.out.length ? '\n  ' + [...new Set(r.out)].join('\n  ') : '— toza')
await b.close()
