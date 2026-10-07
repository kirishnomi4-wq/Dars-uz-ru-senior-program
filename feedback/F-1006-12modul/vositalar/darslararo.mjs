// 12-Modul darslararo kalit sinovi: yozuvchi dars (UI yoki tayanch 8 shaklidagi namuna) → o'quvchi dars ekranida qiymat ko'rinadimi. pageerror tinglanadi.
// node feedback/F-1006-12modul/vositalar/darslararo.mjs [05]
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const natija = []; const errs = [];
const ok = (nom, shart, izoh = '') => natija.push(`${shart ? '✓' : '✗'} ${nom}${izoh ? ' — ' + izoh : ''}`);
async function och(key, id, N, s, ls = {}, answers = {}) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); p.on('pageerror', e => errs.push(`${key} s${s}: ${e.message}`));
  await p.addInitScript(([id, s, N, ls, a]) => { try { if (!sessionStorage.getItem('_k')) { localStorage.clear(); for (const [k, v] of Object.entries(ls)) localStorage.setItem(k, JSON.stringify(v)); localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: s, answers: a, total: N, savedAt: Date.now() })); sessionStorage.setItem('_k', '1'); } } catch {} }, [id, s, N, ls, answers]);
  await p.goto(`http://127.0.0.1:5174/#/lesson/${key}`, { waitUntil: 'networkidle' }); await p.waitForTimeout(1800); return p;
}
const matn = async (p) => (await p.innerText('body')).replace(/\s+/g, ' ');
// A. 2-dars 13-ekran UI → pm-m10d2-sxema → 3-dars 5-ekran
let p = await och('m10-02', 'm10-02-v1', 20, 13);
const qiy = ['«12 / 15» joylar', "o'yinchi joy oladi", 'joy-ozgardi · olindi', 'hamma ulangan ilova', '«13 / 15»'];
for (let i = 0; i < 5; i++) await p.locator('.ws-ms-inp').nth(i).fill(qiy[i]);
await p.getByRole('button', { name: 'Qator tayyor' }).click(); await p.waitForTimeout(400);
await p.getByRole('button', { name: 'Saqlash' }).click(); await p.waitForTimeout(500);
const sx = await p.evaluate(() => localStorage.getItem('pm-m10d2-sxema')); await p.close();
ok('2-dars sxemani yozdi', sx && sx.includes('joy-ozgardi'), sx ? sx.slice(0, 80) : 'yo\'q');
p = await och('m10-03', 'pm-m10d3-v1', 12, 5, { 'pm-m10d2-sxema': JSON.parse(sx) });
ok('3-dars 5-ekran sxema qatorini ko\'rsatadi', (await matn(p)).includes('joy-ozgardi')); await p.close();
// B. pm-m10d3-talab (3-dars saqla() shakli) → 4-dars A1
const TALAB = { hodisalar: [{ id: 'q1', kimNima: "o'yinchi joy oladi", hodisa: 'joy-ozgardi · olindi', kimOladi: 'hamma ulangan ilova', ekranda: '«13 / 15»' }], holatlar: { ulangan: 'yashil nuqta', ulanmoqda: 'sariq nuqta', ulanmagan: 'kulrang nuqta' }, chekka: [{ id: 'c1', matn: 'internet uzilsa — eski son' }, { id: 'c2', matn: 'ilova fonda — xabar kelmaydi' }], buzilmasin: 'kirish va joy olish avvalgidek ishlasin' };
p = await och('m10-04', 'm10-04-v1', 12, 3, { 'pm-m10d3-talab': TALAB, 'pm-m9d8-platforma': { trek: 'mobil' } });
await p.getByRole('button', { name: 'Bajardim' }).first().click(); await p.waitForTimeout(800); // prompt 2-qadamda; joy — input qiymati (innerText da ko'rinmaydi)
const v4 = await p.evaluate(() => [...document.querySelectorAll('input,textarea')].map(e => e.value).join(' | '));
ok('4-dars A1 promptida «buzilmasin» talabdan', v4.includes('kirish va joy olish avvalgidek'), v4.slice(0, 60)); await p.close();
if (process.argv[2] === '05') {
  p = await och('m10-05', 'm10-05-v1', 19, 12, { 'pm-m10d3-talab': TALAB });
  ok('5-dars 12-ekranda talab chekka holatlari', (await matn(p)).includes('internet uzilsa')); await p.close();
}
// C. pm-m10d1-lending → 6-dars 10-ekran; pm-m10d6-kanallar → 7-dars 5-ekran va A2
const LEND = { nom: 'Kitob Almash', sarlavha: 'Kitoblaringizni almashing', osti: 'E\'lon qiling.', foydalar: ['Kerakli kitobni bepul topasiz', 'Kitob chang bosmaydi', 'Bir bosishda kelishasiz'], funksiyaQatori: ['Qidiruv', 'E\'lon', 'Almashaman'], tugma: 'Kitob qo\'shish', hodisa: 'kitob-qoshish', manzil: 'https://kitob-almash.netlify.app', sinov: null };
p = await och('m10-06', 'pm-m10d6-v1', 16, 10, { 'pm-m10d1-lending': LEND });
const t6 = await matn(p);
ok('6-dars 10-ekranda lending foydasi yoki manzili', t6.includes('Kerakli kitobni bepul') || t6.includes('kitob-almash.netlify.app')); await p.close();
const KAN = { kanallar: [{ id: 'k1', nom: 'sinf chati', auditoriya: true, azo: true, ruxsat: 'bor' }, { id: 'k2', nom: 'futbol guruhi', auditoriya: true, azo: true, ruxsat: 'soraladi' }], post: { kim: 'Maktabdoshlar uchun', foyda: 'kitobni bepul topasiz', harakat: 'Ro\'yxatdan o\'ting https://kitob-almash.netlify.app?kanal=sinf', holat: 'Sayt ishlayapti' }, tekshiruv: [true, true, true, true, true, true], mentorga: true, yuborildi: null };
p = await och('m10-07', 'pm-m10d7-v1', 12, 5, { 'pm-m10d6-kanallar': KAN, 'pm-m10d1-lending': LEND });
const v7 = await p.evaluate(() => [...document.querySelectorAll('input')].map(i => i.value).join(' | '));
const t7 = await matn(p);
ok('7-dars 5-ekran kanal 6-darsdan (ruxsat: bor)', v7.includes('sinf chati') || t7.includes('sinf chati'), 'inputlar: ' + v7.slice(0, 80)); await p.close();
p = await och('m10-07', 'pm-m10d7-v1', 12, 7, { 'pm-m10d6-kanallar': KAN, 'pm-m10d1-lending': LEND });
ok('7-dars A2 post qutisi 6-dars postidan', (await matn(p)).includes('Maktabdoshlar uchun')); await p.close();
// D. B to'lqin: 7→8 (reja), 8→9 / 8→10 (qadamlar), 10→11 (hisobot), 11→12 (pitch) — tayanch 8 shaklidagi namunalar
if (process.argv.includes('B')) {
  const qiymat = async (p) => (await matn(p)) + ' | ' + (await p.evaluate(() => [...document.querySelectorAll('input,textarea')].map(e => e.value).join(' | ')));
  const REJA = { bosqichlar: [{ id: 'b1', kanal: 'sinf chati', nima: 'post', kutilgan: '20', qachon: 'bugun' }, { id: 'b2', kanal: 'futbol guruhi', nima: 'post', kutilgan: '15', qachon: 'hafta' }, { id: 'b3', kanal: 'maktab', nima: 'havola', kutilgan: '15', qachon: 'keyinroq' }], tekshiruv: { malumot: true, olchov: true, havola: true }, yuborildi: true, royxat: 14, sinfdosh: 6, asosiy: 9, sana: '2026-10-04' };
  p = await och('m10-08', 'pm-m10d8-v1', 12, 4, { 'pm-m10d7-reja': REJA, 'pm-m10d1-lending': LEND, 'pm-m9d8-platforma': { trek: 'mobil' } });
  for (let i = 0; i < 3; i++) { const bj = p.getByRole('button', { name: 'Bajardim' }).first(); if (await bj.isEnabled().catch(() => false)) { await bj.click(); await p.waitForTimeout(500); } }
  ok('8-dars A1 7-dars rejasidan (ro\'yxat 14)', (await qiymat(p)).includes('14')); await p.close();
  const QAD = { tur: 'real', qadamlar: [{ id: 'q1', nom: 'ochdi', soni: 50 }, { id: 'q2', nom: "ro'yxatdan o'tdi", soni: 30 }, { id: 'q3', nom: 'qoshilganlar', soni: 12 }], toxtash: ['q3', 'q2'], gipoteza: { agar: 'tugma katta bo\'lsa', ozgaradi: 'qoshilish', chunki: 'ko\'rinmaydi' }, tuzatildi: true, chiqarildi: true, chiqarildiVaqt: '2026-10-05T10:00:00Z', sana: '2026-10-05' };
  p = await och('m10-09', 'm10-09-v1', 12, 8, { 'pm-m10d8-qadamlar': QAD, 'pm-m9d8-platforma': { trek: 'mobil' } });
  ok('9-dars 3-blok 8-dars qadamlaridan (qoshilganlar 12)', (await qiymat(p)).includes('qoshilganlar')); await p.close();
  p = await och('m10-10', 'pm-m10d10-v1', 16, 10, { 'pm-m10d8-qadamlar': QAD, 'pm-m10d7-reja': REJA }); // qadamlar 10, 11-ekranlarda o'qiladi
  const t10 = await qiymat(p);
  ok('10-dars 10-ekran 8-dars qadam nomi (forma keyingi kartasida bo\'lishi mumkin)', t10.includes('qoshilganlar') || t10.includes("ro'yxatdan o'tdi")); await p.close();
  const HIS = { royxat: { soni: 42, sinfdosh: 9, manba: 'Database', sana: '2026-10-06' }, asosiy: { soni: 21, manba: 'Database', sana: '2026-10-06' }, bosh: { nima: 'qoshilish', soni: 17, manba: 'sanoq sahifasi', sana: '2026-10-06' }, qaytgan: null, kunlar: [{ sana: '2026-10-04', soni: 20 }, { sana: '2026-10-05', soni: 12 }, { sana: '2026-10-06', soni: 10 }], tekshiruv: 'qabul', zaxira: null };
  p = await och('m10-11', 'pm-m10d11-v1', 12, 0, { 'pm-m10d10-hisobot': HIS }); // 6-ekran 5-ekran da'volarisiz ochilmaydi — 0-ekran ham hisobotni o'qiydi
  ok('11-dars 0-ekran 10-dars hisobotidan (42; faqat pm-m9d16-pitch ham bo\'lsa — aks holda Mentor sonlari, ataylab)', (await qiymat(p)).includes('42')); await p.close();
  const PIT = { davolar: [{ id: 'd1', bolak: 'muammo', gap: "O'yinchilar yig'ilmaydi", dalil: { son: '42', yozuv: "42 kishi ro'yxatdan o'tdi", manba: 'Database', qachon: '2026-10-06' }, qaror: 'qoldi', yangiGap: '' }], bolaklar: { muammo: "O'yinchilar yig'ilmaydi — 42 kishi ro'yxatdan o'tdi", yechim: 'Maydon Jamoa', demo: 'Qo\'shilaman', keyingi: '50 ga yetamiz' }, savedAt: Date.now() };
  p = await och('m10-12', 'pm-m10d12-v1', 16, 10, { 'pm-m10d11-pitch': PIT, 'pm-m10d10-hisobot': HIS, 'pm-m10d1-lending': LEND });
  ok('12-dars 10-ekran 11-dars pitchidan', (await qiymat(p)).includes("O'yinchilar yig'ilmaydi")); await p.close();
}
console.log(natija.join('\n')); console.log(errs.length ? 'pageerror:\n' + errs.join('\n') : "pageerror yo'q");
await b.close();
