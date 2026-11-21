// 2-darsning oltin namuna stsenariylari (dvigatel 5c, 19.11). Umumiy qism — sinov/dvigatel/oltin.mjs (har qadam: ustoz · o'quvchi · solo · yonma · varaq · eshik).
// Bu yerda faqat shu darsga xos narsa: demo sahifa, o'quvchi profili va ekran nomi bilan bog'liq ishlar (huk, raqamlar, namoyishlar, labirint topshiriqlari).
// Namuna faqat dars tasdiqlangach yoziladi: node new-junior/sinov/dvigatel/oltin.mjs yoz 002-ketma-ketlik
// t — umumiy yordamchilar: { p, QADAM, SOLO, bor, ol, ek, blok, ishga, qi (P… ekran qadami), b0 (B… ekranga o'tish), tanlabOl, holat, xato }.

export const DEMO = 'demo-002.html'
export const LMS = null // 2-dars LMS'ga modul tugagach (93-qaror) — ko'rik namunasi o'shanda qo'shiladi

// o'quvchi: 1-darsdan qahramoni bor (kurs bo'yi saqlanadi, 94-qaror). Qahramoni yo'q bola (BQ) — tanlovlarda alohida
export const PROFIL = {
  qahramonli: { 'demo-ism': 'Aziz', 'demo-qah': 'jele', 'demo-qism': 'Bulut', 'demo-qrang': '2' },
}
export const ISH_PROFIL = 'qahramonli', TANLOV_PROFIL = 'qahramonli', SOLO_ISH_PROFIL = 'qahramonli'

// dasturdagi n-blokni bosish (0 dan) — tanlash yoki joy almashtirish (95-qaror). Blok o'z qatoridan bosiladi:
// Blockly'da keyingi bloklar oldingisining ichida, birinchi bloklarning o'rtasi boshqa blokka tushishi mumkin
const bos = (p, n) => p.locator('#ilova .jr-bl .mb').nth(n).click({ position: { x: 18, y: 14 } }).then(() => p.waitForTimeout(400))
const kut = (p, f, arg, ms = 15000) => p.waitForFunction(f, arg, { timeout: ms, polling: 100 }).catch(() => {})
const BL = { r: 'move right', l: 'move left', u: 'move up', d: 'move down' }
const qosh = async (blok, p, d) => { for (const t of d) await blok(p, BL[t]) }

// ustoz bajaradigan ishlar (har qadam suratidan keyin, «yakunlandi»dan oldin)
export async function ustozIshlari({ p, qi, bor, ol, blok, ishga }) {
  // 3-qadam: uch sinov — A o'zi boshlanadi, keyin «Keyingi» bilan B va C
  await bor(p, qi('P2S'))
  for (let k = 1; k <= 3; k++) {
    if (k > 1) await p.click('#ilova .hn .asos')
    await kut(p, (n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti, k)
    await ol(p, 'u-x-P2S-' + 'ABC'[k - 1])
  }
  // 5-qadam: raqamlar birma-bir (1 va 6 ta yongan holat)
  await bor(p, qi('P3')); await p.click('#ilova .hn .asos'); await ol(p, 'u-x-P3-1')
  for (let k = 2; k <= 6; k++) await p.click('#ilova .hn .asos')
  await ol(p, 'u-x-P3-6')
  // 7-qadam: ustoz yo'l tuzadi
  await bor(p, qi('P6')); await qosh(blok, p, 'rurr'); await ol(p, 'u-x-P6-tuzildi'); await ishga(p); await ol(p, 'u-x-P6-yetdi')
  // 10-qadam: xato — urildi, tanlash, joy almashtirish, yetdi
  await bor(p, qi('P7')); await ishga(p); await ol(p, 'u-x-P7-urildi')
  await bos(p, 3); await ol(p, 'u-x-P7-tanlandi'); await bos(p, 4); await ol(p, 'u-x-P7-almashdi'); await ishga(p); await ol(p, 'u-x-P7-yetdi')
  // 14-qadam: kalit — kalitsiz eshik, keyin almashtirib chiqish
  await bor(p, qi('P8K')); await qosh(blok, p, 'urrr'); await ishga(p); await ol(p, 'u-x-P8K-eshik')
  await bos(p, 0); await bos(p, 1); await ishga(p); await ol(p, 'u-x-P8K-yetdi')
  // 16-qadam: bo'sh dastur — Bo'shvoy; bola o'qigan dastur
  await bor(p, qi('P11')); await ishga(p); await ol(p, 'u-x-P11-bosh')
  await qosh(blok, p, 'rluurrrr'); await ishga(p); await ol(p, 'u-x-P11-yetdi')
}

// o'quvchi topshiriqlari: studiya holatlari (ISH_PROFIL bilan ochilgan sahifada). Yetgach dars 1,4 s da keyingi pog'onaga o'tadi — surat undan oldin
export async function bolaIshlari({ p, b0, blok, ishga, ol }) {
  await b0('B2'); await ishga(p); await ol(p, 'bx-B2-bosh')
  await qosh(blok, p, 'rrr'); await ishga(p); await ol(p, 'bx-B2-urildi')
  await p.click('#ilova .hn .mas'); await ol(p, 'bx-B2-maslahat')
  await b0('B2'); await qosh(blok, p, 'uu'); await ishga(p); await ol(p, 'bx-B2-kam')
  await b0('B2'); await qosh(blok, p, 'uurrr'); await ishga(p); await ol(p, 'bx-B2-yetdi'); await p.waitForTimeout(1800)
  await b0('B2B'); await qosh(blok, p, 'rddrr'); await ishga(p); await ol(p, 'bx-B2B-yetdi'); await p.waitForTimeout(1800)
  await b0('B2C'); await qosh(blok, p, 'rurrur'); await ishga(p); await ol(p, 'bx-B2C-yetdi'); await p.waitForTimeout(1800)
  await b0('B2Y'); await qosh(blok, p, 'ruurrrur'); await ishga(p); await ol(p, 'bx-B2Y-yetdi'); await p.waitForTimeout(1800)
  // 2-bekat: tayyor xatoli dastur → urildi → bloklar joyi almashtiriladi → yetdi
  await b0('B3A'); await ishga(p); await ol(p, 'bx-B3A-urildi'); await bos(p, 1); await ol(p, 'bx-B3A-tanlandi'); await bos(p, 2); await ol(p, 'bx-B3A-almashdi'); await ishga(p); await ol(p, 'bx-B3A-yetdi'); await p.waitForTimeout(1800)
  await b0('B3B'); await ishga(p); await ol(p, 'bx-B3B-urildi'); await bos(p, 2); await bos(p, 3); await ishga(p); await ol(p, 'bx-B3B-yetdi'); await p.waitForTimeout(1800)
  await b0('B3C'); await ishga(p); await ol(p, 'bx-B3C-urildi'); await bos(p, 0); await bos(p, 1); await ishga(p); await ol(p, 'bx-B3C-yetdi'); await p.waitForTimeout(1800)
  await b0('B3Y'); await ishga(p); await ol(p, 'bx-B3Y-urildi1'); await bos(p, 0); await bos(p, 1); await ishga(p); await ol(p, 'bx-B3Y-urildi6'); await bos(p, 5); await bos(p, 6); await ishga(p); await ol(p, 'bx-B3Y-yetdi'); await p.waitForTimeout(1800)
  // 3-bekat: kalitsiz eshik, kalit bilan chiqish, ★ da 10 blok chegarasi
  await b0('B4A'); await qosh(blok, p, 'uurrrr'); await ishga(p); await ol(p, 'bx-B4A-eshik')
  await b0('B4A'); await qosh(blok, p, 'rluurrrr'); await ishga(p); await ol(p, 'bx-B4A-yetdi'); await p.waitForTimeout(1800)
  await b0('B4B'); await qosh(blok, p, 'dduurrrr'); await ishga(p); await ol(p, 'bx-B4B-yetdi'); await p.waitForTimeout(1800)
  await b0('B4Y'); await qosh(blok, p, 'rrlluurrrr'); await ol(p, 'bx-B4Y-toldi'); await blok(p, 'move right'); await ol(p, 'bx-B4Y-10dan-kop')
  await ishga(p); await ol(p, 'bx-B4Y-yetdi'); await p.waitForTimeout(1800)
  // yakun: bolaning o'z natijasi (shu sahifada yechilgan labirintlardan)
  await b0('B5'); await ol(p, 'bx-B5-natija')
}

// tanlovlar: dastur kartasi (P2N) va qahramoni yo'q bola (BQ → tanlagach o'z joyi)
export async function tanlovlar({ p, b0, ol, tanlabOl }) {
  await b0('P2N'); await tanlabOl('P2N', () => p.locator('#ilova .jk').nth(2).click(), 'bx-P2N-tanladi')
  // qahramoni yo'q bola — 1-darsda tanlamagan: qahramon ham, uning ismi ham yo'q (tanlaganda ism tozalanadi — qobiq.js)
  await p.evaluate(() => { localStorage.removeItem('demo-qah'); localStorage.removeItem('demo-qism'); qah = ''; qism = ''; chiz() }); await p.waitForTimeout(450); await ol(p, 'bx-BQ')
  await p.locator('#ilova .tq-o').nth(3).click(); await p.waitForTimeout(1200); await ol(p, 'bx-BQ-tanladi')
}

// solo'da bolaning o'zi bajaradigan joy: uch sinovni o'zi, raqamlarni o'zi yoqadi
export async function soloIshlari({ p, SOLO, bor, ol }) {
  const q = (id) => Object.keys(SOLO).map(Number).find((k) => SOLO[k].includes(id))
  await bor(p, q('P2S'), 0)
  for (let k = 0; k < 3; k++) {
    await p.locator('#ilova .jk').nth(k).locator('.hk-sinab').click()
    await kut(p, (n) => document.querySelectorAll('#ilova .jk .jn').length >= n && !document.querySelector('#ilova .ekran').dataset.yuryapti, k + 1)
    await ol(p, 'sx-P2S-' + 'ABC'[k])
  }
  await bor(p, q('P3'), 0); for (let k = 0; k < 6; k++) await p.click('#ilova .hn .asos')
  await ol(p, 'sx-P3-6')
}
