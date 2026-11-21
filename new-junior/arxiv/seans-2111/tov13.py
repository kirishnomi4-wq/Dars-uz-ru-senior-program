s = open('sinov/demo/012-tovush.mjs').read()
s = s.replace("// 12-dars «Jon va qadam» — tovush sinovi (21.11; 11-dars usulida): AudioContext soxtasi notalarni yozadi. Ustoz ekranida: yurish — qadam (330 Hz);\n// kaktusga tegish — qadam yo'q, jon o'zgarganda «bos» (520 Hz); muammochada — 262 Hz; jonli darsda bola noutbuki jim; solo'da chalinadi; «Ovoz» o'chiq — jim.",
              "// 13-dars «Tasodifiy son» — tovush sinovi (21.11; 11–12-dars usulida): AudioContext soxtasi notalarni yozadi. Ustoz ekranida: olma tushdi — qadam (330 Hz);\n// maydondan tashqari — «tuk» va muammo (262 Hz); «Har safar boshqa joy!» — yulduz ohangi; jonli darsda bola noutbuki jim; solo'da chalinadi; «Ovoz» o'chiq — jim.")
s = s.replace('demo-012', 'demo-013').replace('d12tov-', 'd13tov-').replace('demo-jr012-solo', 'demo-jr013-solo').replace('012-tovush.mjs', '013-tovush.mjs')
a = s.index("const dastur = (p, d)"); b = s.index("const u = await oyna")
s = s[:a] + """const dastur = (p, d) => p.evaluate((d) => {
  const ek = document.querySelector('#ilova .ekran'), ws = BL_WS.get(ek); ws.clear()
  let o = null; for (const [t, m] of d) { const x = blYangi(ws, t, m); if (o) o.nextConnection.connect(x.previousConnection); else x.moveTo(new Blockly.utils.Coordinate(0, 0)); o = x }
  ws.getAllBlocks(false).forEach(blBelgila); blMasshtab(ek, ws); sanoq(ek)
}, d).then(() => p.waitForTimeout(300))
const O1 = [['y', 'r1-5,0']]
""" + s[b:]
a = s.index("// P6 (7-qadam)"); b = s.index("// bola: jonli dars")
s = s[:a] + """// P6 (7-qadam): tanlov 8 — tashqari; keyin 4, 2, 5 (1 to 5)
await u.selectOption('select[data-a=sakra]', '6'); await u.waitForTimeout(1500); await dastur(u, [['y', 'r1-10,0']]); await tozala(u)
await u.click('#ust .hn .ishga'); await u.waitForTimeout(400); await tinch(u); await u.waitForTimeout(300); let n = await nota(u)
tek('7 · «8» — maydondan tashqari: «tuk» va muammo (262 Hz), qadam yo‘q', bor(n, 262) >= 1 && bor(n, 330) === 0)
await dastur(u, O1); await tozala(u); await u.click('#ust .hn .ishga'); await u.waitForTimeout(400); await tinch(u); await u.waitForTimeout(300); n = await nota(u)
tek('7 · olma savatga tushdi — qadam (330 Hz)', bor(n, 330) === 1 && bor(n, 262) === 0)
await tozala(u); for (let i = 0; i < 2; i++) { await u.click('#ust .hn .ishga'); await u.waitForTimeout(400); await tinch(u) } await u.waitForTimeout(300); n = await nota(u)
tek('7 · uchinchi sinov — «Har safar boshqa joy!»: yulduz ohangi', [660, 880, 1100, 1320].every((f) => bor(n, f) >= 1))
""" + s[b:]
i1 = s.index("await dastur(o, O1)"); i2 = s.index("\n", s.index("tek('8 · jonli", i1))
s = s[:i1] + """await dastur(o, [['y', 'r0-6,2']]); await tozala(o); await o.click('#bol .hn .asos'); await o.waitForTimeout(400); await tinch(o)
tek('8 · jonli darsda bola noutbuki jim (' + (await nota(o)).length + ' nota), olma tushdi', (await nota(o)).length === 0 && (await o.$$('#bol .kt-olma.tushdi')).length === 1)""" + s[i2:]
i1 = s.index("await u.selectOption('select[data-a=sakra]', '6'); await u.waitForTimeout(1500); await dastur(u, O1); await u.click")
i2 = s.index("\n", i1)
s = s[:i1] + "await u.selectOption('select[data-a=sakra]', '6'); await u.waitForTimeout(1500); await dastur(u, O1); await tozala(u); await u.click('#ust .hn .ishga'); await u.waitForTimeout(400); await tinch(u)" + s[i2:]
i1 = s.index("await s.goto(U + '?rol=solo')"); i2 = s.index("\n", s.index("tek('solo B1A", i1))
s = s[:i1] + """await s.goto(U + '?rol=solo'); await s.waitForTimeout(1800); await dastur(s, [['y', 'r0-6,2']]); await tozala(s); await s.click((await s.$('#ilova .hn .ishga')) ? '#ilova .hn .ishga' : '#ilova .hn .asos:not(.k-solo)'); await s.waitForTimeout(400); await tinch(s)
n = await nota(s); tek('solo B1A: olma tushdi — bola noutbukida chalinadi (330 Hz)', bor(n, 330) === 1)""" + s[i2:]
open('sinov/demo/013-tovush.mjs', 'w').write(s)
print('ok')
