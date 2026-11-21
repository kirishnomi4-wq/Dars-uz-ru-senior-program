// 1-darsning oltin namuna stsenariylari (dvigatel 4a, 19.11; avval sinov/dvigatel/oltin.mjs ichida edi — harakatlar va tartibi o'zgarmagan).
// Umumiy qism (brauzer, surat, har qadam: ustoz · o'quvchi · solo · yonma-yon · varaq · eshik · LMS ko'rigi) — sinov/dvigatel/oltin.mjs.
// Bu yerda faqat shu darsga xos narsa: qaysi demo sahifa, o'quvchi profillari va ekran nomi bilan bog'liq ishlar (studiya holatlari, tanlovlar).
// t — umumiy yordamchilar: { p, QADAM, SOLO, bor, ol, ek, blok, ishga, qi (P… ekran qadami), b0 (B… ekranga o'tish), tanlabOl, holat, xato }.

export const DEMO = 'demo.html'                          // demo sahifasi (public/ ichida)
export const LMS = 'lms/sinov/index.html?preview=1'      // CRM ko'rigi (LMS yig'masi bilan); yo'q bo'lsa — null

// o'quvchi profillari (noutbukdagi saqlov kalitlari — demoda 'demo-' bilan): yangi kirgan va hamma narsani tanlab bo'lgan bola
export const PROFIL = {
  yangi: { 'demo-ism': 'Aziz' },
  tanlagan: {
    'demo-ism': 'Aziz', 'demo-qah': 'jele', 'demo-qism': 'Bulut', 'demo-qrang': '2', 'demo-jr001-joy': 'kosmos',
    'demo-jr001-qdastur': JSON.stringify([{ t: 'r', m: '' }, { t: 's', m: 'Men Bulutman!' }, { t: 'j', m: '' }, { t: 'r', m: '' }]),
    'demo-jr001-pog': '4', 'demo-jr001-tayyor': '1',
    'demo-jr001-bloklar': JSON.stringify({ B2: { r: 3, l: 0, j: 0, s: 0, m: '' }, B8: { r: 2, l: 0, j: 1, s: 1, m: 'Men Bulutman!' } }),
  },
}
export const ISH_PROFIL = 'tanlagan', TANLOV_PROFIL = 'yangi', SOLO_ISH_PROFIL = 'yangi' // studiya holatlari, tanlovlar va solo ishlari qaysi profilda olinadi

// ustoz bajaradigan ishlar (har qadam suratidan keyin, «yakunlandi»dan oldin)
export async function ustozIshlari({ p, qi, bor, ol, ishga }) {
  await bor(p, qi('P2B'))
  const c = await p.locator('#ilova .oyna .yol .q').first().boundingBox()
  if (c) { await p.mouse.move(c.x + c.width / 2, c.y + c.height / 2); await p.mouse.down(); await p.mouse.move(c.x + c.width / 2 + 60, c.y + c.height / 2 - 20, { steps: 6 }); await ol(p, 'u-x-P2B-sudrash'); await p.mouse.up(); await p.waitForTimeout(700); await ol(p, 'u-x-P2B-qaytdi') }
  await bor(p, qi('P2K')); for (let k = 1; k <= 3; k++) { await p.click('#ilova .sin3 .mb'); await p.waitForTimeout(700); await ol(p, 'u-x-P2K-' + k) }
  for (const id of ['P6', 'P7A', 'P11']) { await bor(p, qi(id)); await ishga(p); await ol(p, 'u-x-' + id + '-ishga') }
  // 4d (95-qaror): blok bosilsa — tanlanadi, «✕» — olib tashlanadi
  await bor(p, qi('P6')); await ishga(p); await p.locator('#ilova .jr-bl .mb').last().click(); await p.waitForTimeout(400); await ol(p, 'u-x-P6-tanlandi'); await p.click('#ilova .bl-x'); await p.waitForTimeout(400); await ol(p, 'u-x-P6-olindi'); await ishga(p); await ol(p, 'u-x-P6-tuzatildi')
}

// o'quvchi topshiriqlari: studiya holatlari (ISH_PROFIL bilan ochilgan sahifada)
export async function bolaIshlari({ p, b0, blok, ishga, ol }) {
  await b0('B2'); await ishga(p); await ol(p, 'bx-B2-bosh')
  await blok(p, 'move right', 2); await ishga(p); await ol(p, 'bx-B2-kam')
  await p.click('#ilova .hn .mas:not(.ishga)'); await ol(p, 'bx-B2-maslahat')
  await blok(p, 'move right', 2); await ol(p, 'bx-B2-qoshildi'); await ishga(p); await ol(p, 'bx-B2-ortiq')
  await b0('B2'); await blok(p, 'move right', 3); await ishga(p); await ol(p, 'bx-B2-yetdi')
  await p.waitForFunction(() => (document.querySelector('#ilova .ekran') || {}).dataset?.id === 'B4', null, { timeout: 5000 }).catch(() => {}); await p.waitForTimeout(400); await ol(p, 'bx-B4')
  await p.click('#ilova .hn .mas'); await p.waitForFunction(() => { const e = document.querySelector('#ilova .ekran'); return e && !e.dataset.yuryapti }, null, { timeout: 20000 }); await p.waitForTimeout(300); await ol(p, 'bx-B4-qayta')
  await b0('B3X'); await ishga(p); await ol(p, 'bx-B3X-ortiq'); await p.locator('#ilova .jr-bl .mb').last().click(); await p.waitForTimeout(400); await ol(p, 'bx-B3X-tanlandi'); await p.click('#ilova .bl-x'); await p.waitForTimeout(400); await ol(p, 'bx-B3X-olindi'); await ishga(p); await ol(p, 'bx-B3X-yetdi'); await p.waitForTimeout(1800)
  await b0('B2P'); await blok(p, 'move right'); await ishga(p); await ol(p, 'bx-B2P-teskari')
  await b0('B2P'); await blok(p, 'move left', 3); await ishga(p); await ol(p, 'bx-B2P-ortiq')
  await b0('B2P'); await blok(p, 'move left', 2); await ishga(p); await ol(p, 'bx-B2P-yetdi'); await p.waitForTimeout(1800)
  await b0('B2Q'); await blok(p, 'move right', 3); await ishga(p); await ol(p, 'bx-B2Q-olma')
  await b0('B2Q'); await blok(p, 'move right', 4); await blok(p, 'move left'); await ishga(p); await ol(p, 'bx-B2Q-yetdi'); await p.waitForTimeout(1800)
  // 4d: joy almashtirish — r r r l r (olma qoladi) → 4-blok tanlanadi → 5-blok bosiladi → r r r r l (yetdi). Blok o'z qatoridan bosiladi:
  // Blockly'da keyingi bloklar oldingisining ichida, birinchi bloklarning o'rtasi boshqa blokka tushishi mumkin
  const bosJoy = (n) => p.locator('#ilova .jr-bl .mb').nth(n).click({ position: { x: 18, y: 14 } })
  await b0('B2Q'); await blok(p, 'move right', 3); await blok(p, 'move left'); await blok(p, 'move right'); await ishga(p); await ol(p, 'bx-B2Q-olmasiz')
  await bosJoy(3); await p.waitForTimeout(400); await ol(p, 'bx-B2Q-tanlandi'); await bosJoy(4); await p.waitForTimeout(400); await ol(p, 'bx-B2Q-almashdi')
  await ishga(p); await ol(p, 'bx-B2Q-almashib-yetdi'); await p.waitForTimeout(1800)
  await b0('B2Y'); await blok(p, 'move right', 6); await blok(p, 'move left', 3); await ishga(p); await ol(p, 'bx-B2Y-yetdi'); await p.waitForTimeout(1800)
  await b0('B2Y'); await blok(p, 'move right', 10); await ol(p, 'bx-B2Y-toldi'); await blok(p, 'move right'); await ol(p, 'bx-B2Y-10dan-kop')
  await b0('B7'); await ishga(p); await ol(p, 'bx-B7-salom')
  await b0('B1'); await p.click('#ilova .rg .rd.f-h'); await ol(p, 'bx-B1-kok'); await p.click('#ilova .rg .rd.f-g'); await ol(p, 'bx-B1-binafsha'); await p.waitForTimeout(1800); await ol(p, 'bx-B1-tugadi')
  await b0('B6'); await p.fill('#ilova .ism-inp', 'Chaqmoq'); await p.locator('#ilova .rng i').nth(4).click(); await ol(p, 'bx-B6-ism-rang')
  await b0('B8'); await p.click('#ilova .rg .rd.f-h'); await p.waitForTimeout(200); await blok(p, 'move right', 2); await blok(p, 'jump'); await ol(p, 'bx-B8-bloklar'); await ishga(p); await ol(p, 'bx-B8-gapsiz')
}

// tanlovlar (TANLOV_PROFIL bilan ochilgan sahifada): tanlangan lahza — dars o'zi keyingi ekranga o'tishidan oldin (tanlabOl taymerni ushlab turadi)
export async function tanlovlar({ p, b0, ol, tanlabOl }) {
  await b0('P2N'); await tanlabOl('P2N', () => p.locator('#ilova .jk').nth(2).click(), 'bx-P2N-tanladi')
  await b0('BY'); await p.click('#ilova .yur-b'); await p.waitForTimeout(150); await ol(p, 'bx-BY-bosdi'); await p.waitForTimeout(2500)
  await b0('BQ'); await tanlabOl('BQ', () => p.locator('#ilova .tq-o').nth(1).click(), 'bx-BQ-tanladi')
  await b0('B8A'); await tanlabOl('B8A', () => p.locator('#ilova .jy').nth(2).click(), 'bx-B8A-tanladi')
}

// solo'da bolaning o'zi bajaradigan joy (faqat «yangi» profilda)
export async function soloIshlari({ p, SOLO, bor, ol }) {
  const q = Object.keys(SOLO).map(Number).find((k) => SOLO[k].includes('BY')); await bor(p, q, SOLO[q].indexOf('BY')); await p.click('#ilova .yur-b'); await p.waitForTimeout(200); await ol(p, 'sx-BY-bosdi'); await p.waitForTimeout(2500)
}
