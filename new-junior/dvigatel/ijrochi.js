// Dastur daraxti va ijrochi (dvigatel 4b, 19.11) — brauzerda ishlaydi; yigish.mjs uni blockly.js dan keyin, studiya.js dan oldin qo'shadi.
// Studiya dasturni shu yerdan o'qiydi va shu yerda bajaradi; blokning o'z ishi (qahramon yuradi, sakraydi, gapiradi) — studiya.js da (bajar).
//   dasturDaraxti(ek) — [{ tur, el, ichki: [] }]: tur — blok turi ('r', 'l', 'j', 's'…), el — ekrandagi blok (yonadi), ichki — ichidagi bloklar
//                       (hozircha bo'sh: «takrorla», «agar» kabi ichma-ich bloklar o'z darsi bilan keladi — 5, 8-dars).
//   ijroTartibi(daraxt) — bloklarni bajarilish tartibida beradi (yuqoridan pastga). Ichma-ich bloklar kelganda shu yerda ochiladi.
//   ijro(daraxt, bajar, { kut }) — har blok: yonadi («hozir»), bajar(tugun) chaqiriladi, kut ms kutiladi, blok «yon» (o'tildi) bo'ladi;
//                       bajar 'toxta' qaytarsa — dastur shu blokda to'xtaydi (2-dars: devorga urildi) va blok «urildi» belgisi bilan qoladi
//                       (qayerda to'xtagani ko'rinadi; studiya dastur o'zgarganda yoki qayta ishga tushganda olib tashlaydi). Oxirida «yon» belgilari olinadi.
//                       Qaytaradi: { bajarildi: necha blok bajarildi, toxtadi }.
// Keyin (4-dars, hodisalar): bir nechta skript — har biri o'z ijroTartibi bilan navbatma-navbat; bitta skript uchun ijro shu ko'rinishda qoladi.
function dasturDaraxti(ek) {
  const d = (typeof blDaraxt === 'function' && blDaraxt(ek)) || Array.from(ek.querySelectorAll('.dst .mb')).map((el) => ({ el, ichki: [] }))
  const tur = (t) => { t.tur = blokTuri(t.el); if (t.tur === 'p' && !t.n) t.n = typeof blokSon === 'function' ? blokSon(t.el) : 3; if (t.tur === 'a' && !t.yon) t.yon = typeof blokYon === 'function' ? blokYon(t.el) : 'right'; t.ichki.forEach(tur); return t }
  return d.map(tur)
}
// 5-dars: takrorlash (tur 'p') — o'zi bajarilmaydi, ichidagi bloklar n marta (1–4-darsda bunday tugun yo'q — avvalgidek)
// belgi — ijro uchun: har aylanish oldidan { belgi: true, el, i } (takrorlash yonidagi sanoq); boshqa joyda (bloklar ro'yxati) belgisiz
// 8-dars: shart (tur 'a') — tugunning o'zi beriladi (sahna tekshiradi va t.ha ni qo'yadi), keyin «ha» bo'lsa ichiga kiriladi;
// belgisiz (bloklar ro'yxati, sanoq) — ichidagilar bir marta
function* ijroTartibi(daraxt, belgi = false) { for (const t of daraxt) { if (t.tur === 'a' || t.tur === 'i') { yield t; if (!belgi || t.ha) yield* ijroTartibi(t.ichki, belgi); continue } /* 12-dars: 'i' — o'zgaruvchi sharti */ if (t.tur === 'p') { for (let i = 0; i < (t.n || 0); i++) { if (belgi) yield { belgi: true, el: t.el, i: i + 1 }; yield* ijroTartibi(t.ichki, belgi) } } else { yield t; if (t.ichki.length) yield* ijroTartibi(t.ichki, belgi) } } }
// 14-dars («Bitta qadam»): oldin(t) — ixtiyoriy; har harakat blokidan oldin kutiladi (shart tekshiruvi va takrorlash sanog'i kutmaydi — ular
// o'sha bosishda ko'rinadi); 'bekor' qaytarsa — dastur shu yerda to'xtaydi, blok belgisiz (dastur o'zgardi). Berilmasa — avvalgidek.
async function ijro(daraxt, bajar, { kut = 700, oldin = null } = {}) {
  const otdi = []
  let toxtadi = false, bekor = false
  for (const t of ijroTartibi(daraxt, true)) {
    if (t.belgi) { if (typeof blSanoq === 'function') blSanoq(t.el, t.i); continue }
    if (oldin && t.tur !== 'a' && t.tur !== 'i' && (await oldin(t)) === 'bekor') { bekor = true; break }
    t.el.classList.add('hozir')
    const r = await bajar(t)
    // 8-dars: shart tekshiruvi qadam emas — 0,35 soniya (manba 008: «tekshiruv ko'rinishi»)
    await KUT(t.tur === 'a' || t.tur === 'i' ? Math.min(kut, 350) : kut)
    t.el.classList.remove('hozir'); t.el.classList.add('yon'); otdi.push(t)
    if (r === 'toxta') { toxtadi = true; t.el.classList.add('urildi'); break }
  }
  await KUT(150)
  otdi.forEach((t) => t.el.classList.remove('yon'))
  if (typeof blSanoqOl === 'function' && daraxt[0] && daraxt[0].el) { const ek = daraxt[0].el.closest && daraxt[0].el.closest('.ekran'); if (ek) setTimeout(() => blSanoqOl(ek), 900) }
  return { bajarildi: otdi.length, toxtadi, bekor }
}
