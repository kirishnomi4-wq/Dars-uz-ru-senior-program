# F-1015-398: m4a-04 kirish ekrani (01/09) «juda ko'p yozuv» — mentor qisqa, «Uch dars — bitta zanjir» tasmasi olindi,
# kirish javobi 216-qonun (variantga ≤60 + «Bugun…», jami ≤120). Zaxira: arxiv/F-1015-398-oldin/. Qayta yurgizilmaydi.
import re, pathlib
P = pathlib.Path('/home/kali/Desktop/internetLesson/src/4a-Modull/NestArchPracticeLesson.jsx')
s = P.read_text()

def rep(old, new, n=1):
    global s
    assert s.count(old) == n, (s.count(old), old[:90])
    s = s.replace(old, new)

def rep_re(pat, new, n=1):
    global s
    m = re.findall(pat, s, flags=re.S)
    assert len(m) == n, (len(m), pat[:60])
    s = re.sub(pat, new, s, flags=re.S)

# 1) LEGACY / STAFF / LegacyRail bloki — o'lik kod qolmasin
rep_re(r"const LEGACY = \[\n.*?\n\];\nconst STAFF = .*?\n(?:// [^\n]*\n)?const LegacyRail = \(\{ seen, onTap \}\) => \(\n.*?\n\);\n\n", "")
rep("  const [lseen, setLseen] = useState(storedAnswer ? new Set(LEGACY.map(l => l.id)) : new Set());\n", "")
rep("  const tapLegacy = (id) => { setLseen(prev => { const s = new Set(prev); s.add(id); return s; }); setSc(n => n + 1); };\n", "")
rep_re(r"        \{/\* F-0916-01 Q9: zanjir-tasmasi[^\n]*\n        <p className=\"flow-label\" style=\{\{ marginTop: 4 \}\}>\{tr\(\{ uz: \"Uch dars — bitta zanjir[^\n]*\n        <LegacyRail seen=\{lseen\} onTap=\{tapLegacy\} />\n", "")
rep_re(r"            \{lseen\.size >= LEGACY\.length && <p className=\"body fade-step\"[^\n]*\n", "")
# CSS .lg-* (s0-opts qatori qoladi)
rep_re(r"        /\* F-0916-01 Q9 \(s0\): uch dars zanjiri[^\n]*\n(?:        \.lg-rail[^\n]*\n)+", "")
rep_re(r"        @media \(max-width: 640px\) \{ \.lg-rail \{ grid-template-columns: 1fr; \} \}\n(?:        \.lg-[^\n]*\n)+", "")

# 2) Mentor — qisqa (uz+ru), bitta qatorda
rep_re(r"        <Mentor>\{tr\(\{ uz: <>Bu — <b style=\{\{ color: T\.ink \}\}>KitobShop</b>: admin kitob qo'shadi[^\n]*\n",
  "        <Mentor>{tr({ uz: <>Bu — <b style={{ color: T.ink }}>KitobShop</b>: admin kitob qo'shadi, mijoz ko'radi va buyurtma beradi. Har qator — bitta <b style={{ color: T.ink }}>eshik</b> (endpoint): 🔒 faqat admin, 🌐 hamma. Bittasini ochib <b style={{ color: T.ink }}>«Try it out»</b> bilan sinang.</>, ru: <>Это — <b style={{ color: T.ink }}>KitobShop</b>: админ добавляет книги, клиент смотрит и заказывает. Каждая строка — одна <b style={{ color: T.ink }}>дверь</b> (endpoint): 🔒 только админ, 🌐 все. Откройте одну и проверьте через <b style={{ color: T.ink }}>«Try it out»</b>.</> })}</Mentor>\n")

# 3) Kirish javobi — 216-qonun (F-1015-393 namunasi: variantga bitta qisqa gap + «Bugun…»)
rep_re(r"  // 137-qonun: har tanlovga O'Z javobi;.*?\n  const ACK = \{\n.*?\n  \};\n",
  "  // F-1015-398 (216-qonun): variantga bitta qisqa gap + «Bugun…» qatori (eski uzun matn o'qilmasdi)\n"
  "  const ACK = {\n"
  "    a: { uz: 'Bitta ulkan fayl — har o\\'zgarish uni chalkashtiradi.', ru: 'Один огромный файл — каждая правка его запутывает.' },\n"
  "    b: { uz: 'Aynan!', ru: 'Именно!' },\n"
  "    c: { uz: 'Katta jamoa emas — tartib kerak.', ru: 'Нужна не команда — порядок.' }\n"
  "  };\n")
rep('{picked !== null && <p className="hook-ack fade-step">{tr(ACK[picked])}</p>}',
    '{picked !== null && <p className="hook-ack fade-step"><b>{tr(ACK[picked])}</b> {tr({ uz: "Bugun 3 resursni agent bilan qurasiz: siz buyurasiz, tekshirasiz.", ru: \'Сегодня строите 3 ресурса с агентом: Вы даёте команду и проверяете.\' })}</p>}')
assert 'LegacyRail' not in s and 'lseen' not in s and 'lg-rail' not in s
P.write_text(s)
print('OK f398')
