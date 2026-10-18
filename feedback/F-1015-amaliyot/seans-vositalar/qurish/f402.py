# F-1015-402: m4c-04 o'lik kod — Screen13 (eski yakuniy amaliy), jonli-praktika qatlami (PRACTICE_BASE, MentorPracticeStats,
# ScreenLivePractice, ScreenFullPipelinePractice), flashcard qatlami (PIPE_FLASHCARDS, ScreenFlashcards, FC_*, fc*, Flashcards)
# va faqat ularga tegishli CSS (.lp-*, .fc-*, .tagpill, .ci-line, .code-input). Zaxira: arxiv/F-1015-402-oldin/. Qayta yurgizilmaydi.
import re, pathlib
P = pathlib.Path('/home/kali/Desktop/internetLesson/src/4c-Modull/FullPipelineProjectLesson.jsx')
s = P.read_text()
def cut(a, b):
    """a dan b gacha (b qoladi) kesadi; ikkalasi ham bir marta uchrashi shart."""
    global s
    assert s.count(a) == 1 and s.count(b) == 1, (s.count(a), s.count(b), a[:50], b[:50])
    i, j = s.index(a), s.index(b); assert i < j
    chunk = s[i:j]; s = s[:i] + s[j:]; return chunk

# 1) JS: Screen13 … Flashcards (ACHIEVEMENTS sarlavhasigacha)
chunk = cut("// ===== SCREEN 13 — CASE: YAKUNIY AMALIY", "// ===== 🏅 ACHIEVEMENTS (nishonlar)")
names = re.findall(r"^(?:const|function) ([A-Za-z0-9_]+)", chunk, re.M)
print("olingan bloklar:", names)
code_only = re.sub(r"/\*.*?\*/|//[^\n]*", "", s, flags=re.S)  # izohlar hisobga olinmaydi
for n in names:
    assert not re.search(r"\b%s\b" % n, code_only), ("hali ishlatiladi:", n)
# 2) CSS
# jonli praktika CSS (.lp-*, .done-mini) + flashcard CSS (.fc-*) — ikkalasi ham yetim
cut("        /* === 🛠️ JONLI PRAKTIKA (VS Code-uslub, self-report) === */", "        /* === 🏅 ACHIEVEMENTS — hisoblagich")
cut("        .tagpill {", "        .option {")
cut("        .ci-line {", "        .term {")
for c in ['lp-mstats', 'lp-doer', 'lp-task', 'lp-step', 'lp-done-btn', 'done-mini', 'fc-center', 'fc-card', 'tagpill', 'ci-line', 'code-input']:
    assert not re.search(r'className=\{?["`][^"`]*\b%s\b' % c, s), ("JSX da hali bor:", c)
P.write_text(s); print('OK f402')
# (tuzatish, shu seansda): INLINE_KEYS.practice kaliti ScreenLivePractice bilan birga o'lik qoldi — lint:jsx 🔴 — olindi.
# SABOQ keyingi darslar uchun: jonli-praktika qatlamini olganda INLINE_KEYS.practice ham olinadi.
