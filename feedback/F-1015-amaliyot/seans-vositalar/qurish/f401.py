# F-1015-401: m4a-04 09/09 yakun — «ikki xatoni … ochiq qolgan eshik» bandi kesilgan Screen19 (audit) ga tayanardi;
# o'lik Screen19 (+DOORLIST/CLAIMS, .cl-* CSS) olindi, sarlavha-izoh yangilandi. Zaxira: arxiv/F-1015-401-oldin/. Qayta yurgizilmaydi.
import re, pathlib
P = pathlib.Path('/home/kali/Desktop/internetLesson/src/4a-Modull/NestArchPracticeLesson.jsx')
s = P.read_text()
def rep(old, new):
    global s
    assert s.count(old) == 1, (s.count(old), old[:90]); s = s.replace(old, new)
def rep_re(pat, new):
    global s
    m = re.findall(pat, s, flags=re.S); assert len(m) == 1, (len(m), pat[:60]); s = re.sub(pat, new, s, flags=re.S)

# 1) o'lik Screen19 bloki (DOORLIST + CLAIMS + Screen19)
rep_re(r"// ===== SCREEN 19 — 🔓 BEAT 4: OCHILISH TEKSHIRUVI[^\n]*\nconst DOORLIST = \[\n.*?\nconst Screen19 = \(\{ screen, storedAnswer, onAnswer, onNext, onPrev \}\) => \{\n.*?\n    </Stage>\n  \);\n\};\n\n", "")
assert 'Screen19' not in s and 'DOORLIST' not in s and 'CLAIMS' not in s
# 2) faqat Screen19 ishlatgan CSS (.cl-* ro'yxat + ev-row signal)
assert 'className="cl-' not in s and "'cl-row" not in s and 'ev-row' not in s.split('<style>')[0]
rep_re(r"(?:        (?:\.cl-[^\n]*|@keyframes cl-liar[^\n]*)\n)+", "")
rep_re(r"        \.ev-row \{[^\n]*\n        /\* ochiq qolgan eshik SIGNAL BERADI[^\n]*\n        \.ev-row\.hot[^\n]*\n        @keyframes ev-alarm[^\n]*\n        \.ev-row\.is-fixed[^\n]*\n        @keyframes ev-lock[^\n]*\n", "")
assert 'cl-liar' not in s and 'ev-alarm' not in s
# 3) sarlavha-izoh
rep("// Ekranlar: 23 (s0..s17, s19, spf praktika, spod podium, sflash flashcards, s20 yakun).\n",
    "// Ekranlar: 9 (s0 kirish · s1 reja · s3 aniq buyruq · a2 Copilot agent · s7 @Roles · s14 eshik sinovi · s15 test · spod podium · s20 yakun) — F-1015-353/401.\n")
# 4) yakun bandi — bitta xato (Screen19 audit ekrani kesilgan)
rep("""    { uz: "AI yo'l qo'ygan ikki xatoni dalil bilan topdingiz (403 va ochiq qolgan eshik)", ru: 'Две ошибки ИИ вы нашли по уликам (403 и незапертая дверь)' }""",
    """    { uz: "AI yo'l qo'ygan xatoni dalil bilan topdingiz (403 — mijozga yopiq qolgan eshik)", ru: 'Ошибку ИИ вы нашли по уликам (403 — дверь, закрытая для клиента)' } // F-1015-401: bitta xato (Screen19 audit kesilgan)""")
P.write_text(s); print('OK f401')
# (tuzatish, shu seansda): .ev-row/.ev-alarm/.ev-lock CSS 03/09 taxtasida (GET /category 404 qatori) ham ishlatiladi — zaxiradan qaytarildi; faqat .cl-* o'chirilgan.
