# F-1015-145 (A): «O'z g'oyangiz» formalari — har qator kamida 2 so'z / 8 harf / 4 xil harf, bir harf 4 marta ketma-ket emas;
# to'lmagan bo'lsa forma ostida izoh; m8-09 A1/A2 da «Nusxalash» yo'q (matn hech qayerga ketmaydi). python3 goya145.py
import re, shutil, os
B = '/home/kali/Desktop/internetLesson/arxiv/F-1015-145-oldin/'
OK = ("const matnOk = (s) => { const t = String(s || '').trim(); const h = t.match(/\\p{L}/gu) || []; "
      "return t.split(/\\s+/).filter(w => /\\p{L}/u.test(w)).length >= 2 && h.length >= 8 && new Set(h.map(x => x.toLowerCase())).size >= 4 && !/(\\p{L})\\1{3,}/u.test(t); }; "
      "// F-1015-145: bema'ni matn («aaaa», bitta so'z) qabul qilinmaydi\n")
IZ = ("{!tola && Object.values(qiymat || {}).some(v => String(v || '').trim()) && <span className=\"goya-iz\">{tr({ uz: \"Har qatorga kamida ikki so'z yozing.\", ru: 'В каждой строке — хотя бы два слова.' })}</span>}")
CSS = ".goya-iz { display: block; margin-top: 2px; font-size: 12px; line-height: 1.4; color: ${T.ink2}; } /* F-1015-145: forma izohi */\n"
F = {
 'src/7-Modull/MvpCompleteLesson.jsx': [("TALAB_QISM.every(q => String(goya[q.id] || '').trim())", "TALAB_QISM.every(q => matnOk(goya[q.id]))")],
 'src/7-Modull/MvpFirstScreenLesson.jsx': [("TALAB_QATORLAR.every(q => String(goya[q.id] || '').trim())", "TALAB_QATORLAR.every(q => matnOk(goya[q.id]))")],
 'src/8-Modull/LiveDashboardLesson.jsx': [("TALAB_QISMLAR.every(q => String(goya[q.id] || '').trim())", "TALAB_QISMLAR.every(q => matnOk(goya[q.id]))")],
 'src/8-Modull/ProdUpgradeLesson.jsx': [("const tolami = (g, ids) => ids.every(id => String(g[id] || '').trim());", "const tolami = (g, ids) => ids.every(id => matnOk(g[id]));")],
 'src/8-Modull/ProdReviewLesson.jsx': [("goya.every(q => String(qiymat[q.id] || '').trim())", "goya.every(q => matnOk(qiymat[q.id]))")],
}
for p, rep in F.items():
    if not os.path.exists(B + os.path.basename(p)): shutil.copy(p, B + os.path.basename(p))
    s = open(p, encoding='utf-8').read()
    for a, b in rep:
        assert s.count(a) == 1, (p, a); s = s.replace(a, b)
    # helper GoyaForma'dan oldin
    i = s.index('const GoyaForma = '); s = s[:i] + OK + s[i:]
    # izoh: GoyaForma ichida textarea ro'yxatidan keyin (birinchi «))}» — map yopilishi)
    i = s.index('const GoyaForma = '); j = s.index('))}\n', i) + 4
    ind = re.match(r'[ \t]*', s[s.rfind('\n', 0, j - 4) + 1:]).group(0)
    s = s[:j] + ind + IZ + '\n' + s[j:]
    m = re.search(r'(?m)^([ \t]*)\.zoom-btn \{[^\n]*\n', s); s = s[:m.end()] + m.group(1) + CSS + s[m.end():]
    open(p, 'w', encoding='utf-8').write(s); print('ok', p)
# m8-09: Nusxalash faqat A3 (talab agentga ketadi)
p = 'src/8-Modull/ProdReviewLesson.jsx'; s = open(p, encoding='utf-8').read()
R = [("const GoyaForma = ({ qismlar, qiymat, onYoz, tola }) => {", "const GoyaForma = ({ qismlar, qiymat, onYoz, tola, nusxa = true }) => {"),
     ("      <QTugma ikkinchi disabled={!tola} onClick={nusxa}>{ok ?", "      {nusxa && <QTugma ikkinchi disabled={!tola} onClick={nusxaOl}>{ok ?"),
     ("  const nusxa = async () => {\n    try { await navigator.clipboard.writeText(qismlar", "  const nusxaOl = async () => {\n    try { await navigator.clipboard.writeText(qismlar")]
for a, b in R:
    assert s.count(a) == 1, a; s = s.replace(a, b)
i = s.index("{nusxa && <QTugma ikkinchi disabled={!tola} onClick={nusxaOl}>"); j = s.index('</QTugma>', i) + 9; s = s[:j] + '}' + s[j:]
a = "<GoyaForma qismlar={goya} qiymat={qiymat} onYoz={goyaYoz} tola={tola} />"; assert s.count(a) == 1
s = s.replace(a, "<GoyaForma qismlar={goya} qiymat={qiymat} onYoz={goyaYoz} tola={tola} nusxa={!nusxasiz} />")
for a in ["goya={A1_GOYA}", "goya={A2_GOYA}"]:
    assert s.count(a) == 1, a; s = s.replace(a, a + ' nusxasiz')
open(p, 'w', encoding='utf-8').write(s); print('ok m8-09 nusxa')
