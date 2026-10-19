// F-1019-01 · NestArchAlive s9 «Buyurtma yo'li» — mijoz kartasi aniqligi va ortiqcha qatorlar. node feedback/F-1019-01-nest-mijoz/sinov.mjs
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const OUT = '/home/kali/Desktop/internetLesson/feedback/F-1019-01-nest-mijoz'; const ID = 'nest-arch-alive-4a-01-v18';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const errs = [];
const ctx = await b.newContext({ viewport: { width: 1280, height: 860 } }); await ctx.route(/^https?:\/\//, r => r.abort());
await ctx.addInitScript((id) => { for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:'+id, JSON.stringify({mode:'self'})); localStorage.setItem('ccProgress:'+id, JSON.stringify({ screen: 8, maxReached: 8, answers: {}, earned: [], startedAt: Date.now(), total: 22, savedAt: Date.now() })); }, ID);
const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + OUT + '/uz/_p.html'); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
const nav = () => p.evaluate(() => { const b = [...document.querySelectorAll('.stage-nav button')].pop(); return b ? b.innerText.trim() + (b.disabled ? ' (yopiq)' : '') : null; });
console.log('mentor: ' + (await p.innerText('.mentor')).replace(/\n/g, ' ').slice(0, 170));
console.log('boshida: nav=' + await nav() + ' · yorliq=' + await p.innerText('.rz-cust-y') + ' · Mijoz katagi tugmami: ' + (await p.$eval('.rz-exit', e => e.tagName)));
const ROUTE = ["Eshik qo'riqchisi", 'Nazoratchi + anketa', 'Ofitsiant', 'Oshpaz + retsept kitobi', 'Ombor + omborchi', 'Bir xil lagan'];
for (const nm of ROUTE) { await p.locator('.rz-pool .rz-card', { hasText: nm }).click(); await p.waitForTimeout(150); }
await p.waitForTimeout(400);
console.log("to'lgach: nav=" + await nav() + ' · yorliq=' + await p.innerText('.rz-cust-y') + ' · halqa=' + (await p.$$('.rz-cbtn.chorla')).length + ' · pool=' + await p.innerText('.rz-pool'));
await p.screenshot({ path: OUT + '/uz/t-toldi.png' });
for (const nm of ["To'g'ri mijoz", "Bo'sh username", 'Tokensiz mijoz']) { await p.locator('.rz-cbtn', { hasText: nm }).click(); await p.waitForTimeout(5200); console.log('  ' + nm + ': ' + (await p.innerText('.rz-run .note-h').catch(() => '?'))); }
console.log('uchala: nav=' + await nav() + " · nishon qatori: " + (await p.$$('.ach-rule')).length + ' · klapan qatori: ' + (await p.$$('.bhint.calm')).length);
await p.screenshot({ path: OUT + '/uz/t-tugadi.png', fullPage: true });
console.log('pageerror: ' + errs.length + (errs.length ? ' ' + errs[0] : ''));
await b.close();
