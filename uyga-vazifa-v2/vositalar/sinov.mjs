// Compiler vazifalari: namuna yechimni Chrome'da ochib, stsenariyni bajaradi, natijani tekshiradi va natija rasmini oladi.
import { chromium } from '../../node_modules/playwright-core/index.mjs';
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// TIL=ru — compiler/<id>/ru/ dan yuradi, natija rasmlari rasm/ru/ ga, kutilgan matnlar ruscha
const RU = process.env.TIL === 'ru';
const C = (id, q) => path.join(ROOT, 'compiler', id, RU ? 'ru' : '', q);
const M = RU
  ? { ism: 'Введите имя', salom: 'Привет, Aziza!', rahmat: 'Спасибо, Aziza!', faol: 'Вы выбрали: Активный', sev2: 'Избранное: 2', bosh: 'Корзина пуста', qabul: 'Заказ принят: 134000 сум' }
  : { ism: 'Ism kiriting', salom: 'Salom, Aziza!', rahmat: 'Rahmat, Aziza!', faol: 'Siz tanladingiz: Faol', sev2: 'Sevimli: 2', bosh: "Savat bo'sh", qabul: "Buyurtma qabul qilindi: 134000 so'm" };
const RASM_DIR = path.join(ROOT, 'rasm', RU ? 'ru' : ''); fs.mkdirSync(RASM_DIR, { recursive: true });
const tmp = path.join(ROOT, '.sinov'); fs.mkdirSync(tmp, { recursive: true });
function tayyorla(id, qism) { // RASM_MANZILI → lokal asset; papkani vaqtinchalik nusxalaydi
  const d = path.join(tmp, id + '-' + qism); fs.rmSync(d, { recursive: true, force: true }); fs.mkdirSync(d, { recursive: true });
  for (const f of fs.readdirSync(C(id, qism))) {
    let s = fs.readFileSync(path.join(C(id, qism), f), 'utf8');
    s = s.replace('RASM_MANZILI', 'file://' + path.join(ROOT, 'rasm/assets/futbol.png')).replace('LOGO_MANZILI', 'file://' + path.join(ROOT, 'rasm/assets/logo.png'));
    fs.writeFileSync(path.join(d, f), s);
  }
  return 'file://' + path.join(d, 'index.html');
}
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--allow-file-access-from-files'] });
const ctx = await b.newContext({ deviceScaleFactor: 2, viewport: { width: 900, height: 640 } });
let xato = 0;
async function och(id, qism) { const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); await p.goto(tayyorla(id, qism)); await p.waitForTimeout(300); return { p, errs }; }
const t = (shart, nom) => { console.log((shart ? '  ✓ ' : '  ✗ ') + nom); if (!shart) xato++; };
const matn = (p, s) => p.$eval(s, e => e.textContent.trim());
// 2-5: login oynasi ekran o'rtasida (balandroq oyna), kirish animatsiyasi tugashi kutiladi
const rasm = async (p, id) => { await p.setViewportSize({ width: 900, height: id === '2-5' ? 640 : 200 }); await p.waitForTimeout(id === '2-5' ? 900 : 150); await p.screenshot({ path: path.join(RASM_DIR, id + '-natija.png'), fullPage: true }); };

const S = {
  '2-3': async p => { t(await p.$$eval('ul > li', a => a.length) === 3, 'ul 3 li'); t(await p.$$eval('ol > li', a => a.length) === 3, 'ol 3 li'); t(!!(await p.$('p strong')) && !!(await p.$('p em')), 'strong + em'); t(/^https?:/.test(await p.$eval('a', a => a.getAttribute('href'))), 'to\'liq href'); },
  '2-4': async p => { t(await p.$$eval('form input', a => a.map(i => i.type).join()) === 'text,email,password', 'input turlari'); t(await p.$$eval('form label', a => a.length) === 3, '3 label'); t(await p.$eval('main img', i => i.naturalWidth > 0 && i.alt.length > 5), 'rasm yuklandi + alt'); t(!!(await p.$('header h1')) && !!(await p.$('footer')), 'header/footer'); },
  '2-5': async p => { t(await p.$$eval('input', a => a.map(i => i.type).join()) === 'email,password', 'email + password'); t(!!(await p.$('a')), 'parol linki'); },
  '2-7': async p => { const st = await p.evaluate(() => { const g = s => getComputedStyle(document.querySelector(s)); return { bg: g('body').backgroundColor, t: g('#title').color, fs: g('#title').fontSize, ta: g('#title').textAlign, gw: g('.genre').fontWeight, pp: g('.card').padding }; }); t(st.bg === 'rgb(244, 244, 244)', 'body fon'); t(st.t === 'rgb(255, 77, 38)' && st.fs === '32px' && st.ta === 'center', '#title'); t(st.gw === '700', '.genre qalin'); t(st.pp === '24px', '.card padding'); },
  '2-8': async p => { const st = await p.evaluate(() => { const g = s => getComputedStyle(document.querySelector(s)); return [g('.menu').display, g('.menu').justifyContent, g('.cards').display, g('.cards').gap, g('.card').flexDirection].join('|'); }); t(st === 'flex|space-between|flex|16px|column', 'flex qoidalari ' + st); const y = await p.$$eval('.card', a => a.map(e => Math.round(e.getBoundingClientRect().top))); t(new Set(y).size === 1, '3 karta bir qatorda'); },
  '3-8': async p => { await p.click('#send'); t(await matn(p, '#msg') === M.ism, "bo'sh → " + M.ism); await p.fill('#name', 'Aziza'); t(await matn(p, '#greet') === M.salom, 'jonli salom'); await p.click('#send'); t(await matn(p, '#msg') === M.rahmat, 'Rahmat'); await p.click('#toggle'); t(!(await p.isVisible('#about')), 'yashirildi'); await p.click('#toggle'); t(await p.isVisible('#about'), 'qaytdi'); },
  '3-9': async p => { const bt = await p.$$('.tanlash'); await bt[1].click(); t(await matn(p, '#tanlov') === M.faol, 'Faol tanlandi'); t(await p.$$eval('.tarif.tanlangan', a => a.length) === 1, 'bitta ajralgan'); await bt[2].click(); await bt[1].click(); t(await matn(p, '#tanlov') === M.faol, 'almashadi'); },
  '3-11': async p => { let sev = await p.$$('.sev'); await sev[1].click(); sev = await p.$$('.sev'); await sev[3].click(); t(await matn(p, '#sevSon') === M.sev2, M.sev2); await p.click('button[data-t="sevimli"]'); t(await p.$$eval('.karta', a => a.length) === 2, 'faqat 2 karta'); await p.click('button[data-t="hammasi"]'); },
  '3-12': async p => { await p.click('#buyurtma'); t(await matn(p, '#xabar') === M.bosh, "bo'sh savat"); const k = await p.$$('#katalog button'); await k[0].click(); await k[1].click(); t(await matn(p, '#jami') === '134000', 'jami son 134000'); await p.click('#buyurtma'); t(await matn(p, '#xabar') === M.qabul, 'buyurtma xabari'); t(await matn(p, '#jami') === '0' && (await p.$$('#savatList li')).length === 0, 'savat tozalandi'); },
};
const RASM_HOLAT = { '3-8': async p => { await p.fill('#name', 'Aziza'); }, '3-9': async p => { await (await p.$$('.tanlash'))[1].click(); }, '3-11': async p => { await (await p.$$('.sev'))[1].click(); await (await p.$$('.sev'))[3].click(); }, '3-12': async p => { const k = await p.$$('#katalog button'); await k[0].click(); await k[2].click(); } };
for (const id of Object.keys(S)) {
  console.log('▶', id);
  const { p, errs } = await och(id, 'yechim'); await S[id](p); t(errs.length === 0, 'konsolda xato yo\'q ' + (errs[0] || ''));
  { const r = await och(id, 'yechim'); if (RASM_HOLAT[id]) await RASM_HOLAT[id](r.p); await r.p.waitForTimeout(400); await rasm(r.p, id); }
  if (fs.existsSync(C(id, 'starter/index.html')) && fs.statSync(C(id, 'starter/index.html')).size > 0) { const s = await och(id, 'starter'); t(s.errs.length === 0, 'starter: konsolda xato yo\'q'); }
}
// 3-12 starter'dagi ataylab qo'yilgan xato haqiqatan chiqadimi
{ const { p } = await och('3-12', 'starter'); const k = await p.$$('#katalog button'); await k[0].click(); await k[1].click(); const j = await matn(p, '#jami'); t(j === '8900045000', "3-12 starter xatosi ko'rinadi: " + j); }
await b.close(); fs.rmSync(tmp, { recursive: true, force: true });
console.log(xato ? `\n✗ ${xato} ta xato` : '\n✓ hammasi o\'tdi');
