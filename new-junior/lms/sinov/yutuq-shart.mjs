// LMS aloqasining yutuq sharti (26.11, F-1126-01) — 15-dars «Xakatonchi» va «Ikki haydovchi» faqat shart bajarilganda;
// ikkinchi noutbuk yutuqni xabar yubormasdan oladi (AL.yutuq). Brauzersiz, serversiz: fetch soxta, so'rovlar yoziladi.
//   node new-junior/lms/sinov/yutuq-shart.mjs
import { readFileSync } from 'node:fs'
const ILDIZ = '/home/kali/Desktop/internetLesson/new-junior/'
const { sinfAloqa } = await import(ILDIZ + 'lms/aloqa.js')
const YUTUQ = eval('(' + readFileSync(ILDIZ + 'darslar/015-xakaton-1/dars.mjs', 'utf8').match(/yutuqlar: (\[[^\n]*\]),\n/)[1] + ')')
let ok = 0, jami = 0
const tek = (nom, s, iz = '') => { jami++; if (s) ok++; console.log((s ? '✓ ' : '✗ ') + nom + (s || !iz ? '' : '  — ' + iz)) }
const sorovlar = []
globalThis.fetch = async (url, o) => { sorovlar.push({ url: String(url), body: o && o.body ? JSON.parse(o.body) : null }); return { status: 204, ok: true, json: async () => null } }
const kut = (ms) => new Promise((r) => setTimeout(r, ms))
const oxirgiEarned = () => { const p = sorovlar.filter((s) => s.url.endsWith('/me/progress')).pop(); return p ? [...p.body.earned].sort().join(',') : '' }
const bola = (kim) => sinfAloqa({ rol: 'bola', pin: '1234', kim, token: 't', liveToken: 'lt', attemptId: 'a1', lessonId: 'junior-015-xakaton-1-v1', jami: 20, yutuqlar: YUTUQ })

// o'yin noutbuki: xulosa xabarlari (xkXulosa: w — 1-qism tayyor, d — do'stlar o'ynagani, ikki — ikkalasi haydadi)
const A = bola('b1')
A.yubor({ t: 'xk', x: { oyin: 'olma', q: 0, ikki: false, d: 0, w: false } }); await kut(1400)
tek('1 · birinchi xk xabari (hech narsa tayyor emas) → yutuq yo‘q', oxirgiEarned() === '', oxirgiEarned())
A.yubor({ t: 'xk', x: { oyin: 'olma', q: 1, ikki: false, d: 0, w: true } }); await kut(1400)
tek('2 · 1-qism tayyor, do‘stlar o‘ynamagan → yutuq yo‘q', oxirgiEarned() === '', oxirgiEarned())
A.yubor({ t: 'xk', x: { oyin: 'olma', q: 1, ikki: false, d: 2, w: true } }); await kut(1400)
tek('3 · 1-qism tayyor + do‘stlar o‘ynadi → «Xakatonchi»', oxirgiEarned() === 'xakatonchi', oxirgiEarned())
A.yubor({ t: 'xk', x: { oyin: 'olma', q: 2, ikki: true, d: 2, w: true } }); await kut(1400)
tek('4 · ikkalasi ham haydadi → «Ikki haydovchi» qo‘shildi', oxirgiEarned() === 'ikki_haydovchi,xakatonchi', oxirgiEarned())
tek('5 · o‘yin noutbuki xabarlari serverga yuborildi (/junior/yubor × 4)', sorovlar.filter((s) => s.url.endsWith('/junior/yubor')).length === 4)

// ikkinchi noutbuk: xulosa ustozdan keladi — AL.yutuq, serverga xabar YO'Q
sorovlar.length = 0
const I = bola('b2')
I.yutuq({ t: 'xk', x: { q: 1, ikki: false, d: 0, w: true, n: 2 } }); await kut(1400)
tek('6 · ikkinchi noutbuk: 1-qism tayyor, do‘st o‘ynamagan → yutuq yo‘q', oxirgiEarned() === '', oxirgiEarned())
I.yutuq({ t: 'xk', x: { q: 2, ikki: true, d: 1, w: true, n: 2 } }); await kut(1400)
tek('7 · ikkinchi noutbuk: shartlar bajarildi → ikkala yutuq', oxirgiEarned() === 'ikki_haydovchi,xakatonchi', oxirgiEarned())
tek('8 · ikkinchi noutbuk serverga sinf xabari yubormadi', sorovlar.filter((s) => s.url.endsWith('/junior/yubor')).length === 0)
// ustoz oynasida yutuq() hech narsa qilmaydi
sorovlar.length = 0
sinfAloqa({ rol: 'ustoz', pin: '1234', kim: 'ustoz', token: 't', lessonId: 'junior-015-xakaton-1-v1', jami: 20, yutuqlar: YUTUQ }).yutuq({ t: 'xk', x: { w: true, d: 1, ikki: true } }); await kut(1400)
tek('9 · ustozda yutuq() — progress yo‘q', sorovlar.filter((s) => s.url.endsWith('/me/progress')).length === 0)
// boshqa darslarning yutuqlari (shartsiz) o'zgarmagan: pog n
sorovlar.length = 0
const P = sinfAloqa({ rol: 'bola', pin: '1', kim: 'b3', token: 't', liveToken: 'lt', attemptId: 'a3', lessonId: 'junior-017-kosmik-oyin-1-v1', jami: 20, yutuqlar: [{ t: 'pog', n: 1, nom: 'uchuvchi' }, { t: 'pog', n: 11, nom: 'mergan' }] })
P.yubor({ t: 'pog', n: 1 }); P.yubor({ t: 'pog', n: 10 }); await kut(1400)
tek('10 · pog‘ona yutuqlari avvalgidek: n 1 → «Uchuvchi», n 10 — «Mergan» hali yo‘q', oxirgiEarned() === 'uchuvchi', oxirgiEarned())
P.yubor({ t: 'pog', n: 11 }); await kut(1400)
tek('11 · n 11 → «Mergan»', oxirgiEarned() === 'mergan,uchuvchi', oxirgiEarned())
console.log('\nNATIJA: ' + ok + ' / ' + jami); process.exit(0)
