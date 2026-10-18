# F-1018-14 · m12-05 PmPitchTrainingLesson (LMS 14-Modul 5-dars) 12 → 9 (222-qonun; guruh raundi — 1 raund istisno, QAROR 4). Zaxiradan quradi: python3 f1018m.py
import re, sys
R = '/home/kali/Desktop/internetLesson'
SRC = f'{R}/arxiv/F-1018-14-oldin/PmPitchTrainingLesson.jsx'
DST = f'{R}/src/12-Modull/PmPitchTrainingLesson.jsx'
s = open(SRC, encoding='utf8').read()
def rep(old, new, label=''):
    global s
    c = s.count(old)
    if c != 1: print(f'❌ {label or old[:70]!r}: topildi {c}'); sys.exit(1)
    s = s.replace(old, new)
def cut(a_m, b_m, label):
    global s
    a = s.find(a_m); b = s.find(b_m, a + 1)
    if a < 0 or b <= a: print(f'❌ cut {label}: {a} {b}'); sys.exit(1)
    out = s[a:b]; s = s[:a] + s[b:]; print(f'  kesildi {label}: {out.count(chr(10))} qator'); return out

H70 = "// 12 ekran (keyssiz PM shakli — tayanch 4): kirish → reja → Mentor varag'i → 1-savol → tuzatishlar ro'yxati → 2-savol → guruhda pitch → tuzatishlaringiz → yakuniy savol → podium → kartochkalar → yakun."
rep("lessonId: 'pm-m12d5-v1'", "lessonId: 'pm-m12d5-v2'")
rep(H70, "// 9 ekran (v2 · F-1018-14 · 222-qonun): kirish → reja → Mentor varag'i → tuzatishlar ro'yxati → guruhda pitch → tuzatishlaringiz → yakuniy savol → podium → yakun.\n//   Olindi: 1-, 2-savol (s3, s5), kartochkalar. Guruh raundi (har kishi 5 daq ≈ 20–25 daq) — bitta raund (QAROR 4 istisno); 2-raund — m12-08. Yakuniy MD: feedback/F-1018-pitch/YAKUNIY-10-m12-05.md", 'header')
a = s.index('const SCREEN_META = ['); b = s.index('const TOTAL_SCREENS')
s = s[:a] + """const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },          // 0 · QKirish
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },            // 1 · QReja
  { id: 'varaq', type: 'exploration', template: 'custom', scored: false, scope: null },            // 2 · Mentor varag'i
  { id: 'tuzatish', type: 'exploration', template: 'custom', scored: false, scope: null },         // 3 · tuzatishlar ro'yxati
  { id: 'guruh', type: 'practice',  template: 'custom',   scored: false, scope: null },            // 4 · guruhda pitch (gapirish raundi)
  { id: 'royxat', type: 'practice', template: 'custom',   scored: false, scope: null },            // 5 · tuzatishlaringiz
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },         // 6 · yakuniy savol
  { id: 'podium',   type: 'stats',      template: 'custom', scored: false, scope: null },          // 7 · podium
  { id: 'yakun', type: 'summary',   template: 'custom',   scored: false, scope: null }             // 8 · QYakun
];
""" + s[b:]
rep("const INLINE_KEYS = { s3: 2, s5: 0, s8: 3, practice: -1 };", "const INLINE_KEYS = { s8: 3, practice: -1 };")
a = s.index('const RECAPS = {'); b = s.index('\n};', a) + 3
m = re.search(r"\n  8: \{.*?\n  \},?", s[a:b], re.S)
if not m: print('❌ RECAPS 8'); sys.exit(1)
s = s[:a] + 'const RECAPS = {' + m.group(0).replace('\n  8: {', '\n  6: {').rstrip(',') + '\n};' + s[b:]
a = s.index('const Q_LABELS = {'); b = s.index('\n};', a) + 3
s = s[:a] + """const Q_LABELS = {
  6: { uz: 'Yakuniy — ✗ olganda nima qilasiz', ru: 'Итог — что делать, получив ✗' }
};""" + s[b:]
a = s.index('const SCREEN_INTENTS = ['); b = s.index('\n];', a) + 3
s = s[:a] + """const SCREEN_INTENTS = [
  'kirish: guruhning qaysi gapi pitchni tuzatishga foyda beradi', 'reja: guruh varag\\'idan tuzatish', 'Mentor varag\\'i: ikki ✗, izohlar (bo\\'lak haqida), hakam savoli',
  'Mentor varag\\'idan uch tuzatish', 'guruhda pitch: taymer, varaq, hakam savoli; yakka rejim', 'o\\'z varag\\'idan uch tuzatish',
  'yakuniy test: ✗ olganda nima qilasiz', 'podium', 'yakun: 4 holat'
];""" + s[b:]
cut("// ===== SCREEN 3 — 1-SAVOL", "// ===== SCREEN 4 — TUZATISHLAR", "s3 test")
cut("// ===== SCREEN 5 — 2-SAVOL", "// ===== SCREEN 6 — GURUHDA PITCH", "s5 test")
cut("// 🃏 KARTOCHKALAR", "// ===== UYGA VAZIFA", "kartochkalar")
rep("""  partNotPerson: { icon: '🎯', name: 'Part, Not Person!', desc: { uz: "Izohni bo'lak haqida yozishni tanladingiz", ru: 'Вы выбрали замечание о части' } },
""", "", 'partNotPerson')
rep("// Ekran id → nishon: s3 — ballik test (birinchi urinish) · tuzatish — 4-ekran kartalari (xatosiz). pitchRound, threeFixes — ish qilingan ekranda earn() bilan.\nconst ACH_TRIGGERS = { s3: 'partNotPerson', tuzatish: 'fixFinder' };",
    "// Ekran id → nishon: tuzatish — tuzatishlar ro'yxati kartalari (xatosiz). pitchRound, threeFixes — ish qilingan ekranda earn() bilan.\nconst ACH_TRIGGERS = { tuzatish: 'fixFinder' };", 'ACH_TRIGGERS')
rep("// ===== 🏅 BADGES (nishonlar, 4 —", "// ===== 🏅 BADGES (nishonlar, 3 —", 'badges')
rep("""  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });""",
"""  const next = () => setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setScreen(s => Math.max(s - 1, 0));""", 'root nav')
s = re.sub(r"\n  // 🃏 Flashcard[^\n]*", "", s)
rep("const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, ScreenPodium, ScreenFlashcards, SummaryScreen];",
    "const screens = [Screen0, Screen1, Screen2, Screen4, Screen6, Screen7, Screen8, ScreenPodium, SummaryScreen];")

# ---- o'lik CSS (keyframes olib tashlanmaydi — F-1018-10)
def dead_classes(src):
    css = src[src.index('<style>{`'):src.index('`}</style>')]
    jsx = src[:src.index('<style>{`')] + src[src.index('`}</style>'):]
    cls = set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", css))
    return {c for c in cls if not re.search(r"['\"` ]" + re.escape(c) + r"['\"` -]|className=\{`[^`]*\b" + re.escape(c) + r"\b|cxx?\([^)]*['\"]" + re.escape(c) + r"['\"]", jsx)}
d0 = dead_classes(open(SRC, encoding='utf8').read()); DEAD = dead_classes(s) - d0
ca = s.index('<style>{`'); cb = s.index('`}</style>')
lines = s[ca:cb].split('\n'); out = []; i = 0; removed = 0
while i < len(lines):
    L = lines[i]; st = L.strip(); sel = st.split('{')[0] if '{' in st else ''
    classes = set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", sel)) if re.match(r"^(?:[a-z]+)?\.", sel) else set()
    if classes and classes <= DEAD:
        depth = st.count('{') - st.count('}'); removed += 1; i += 1
        while depth > 0 and i < len(lines): depth += lines[i].count('{') - lines[i].count('}'); removed += 1; i += 1
        continue
    out.append(L); i += 1
css = '\n'.join(out)
out2 = []; audit = []
for L in css.split('\n'):
    st = L.strip(); groups = [g.split('{')[0].strip() for g in re.split(r"\}", st) if '{' in g]
    if groups and st.count('{') == st.count('}') and all(',' not in g and (set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", g)) & DEAD) for g in groups):
        removed += 1; audit.append(st[:90]); continue
    out2.append(L)
css = '\n'.join(out2)
if audit: print("  2-o'tish satrlari:"); [print('    ', a) for a in audit]
css = re.sub(r"\n[ \t]*/\* === 🃏 FLASHCARDS[^\n]*", "", css)
for pat in [r"\n[ \t]*\.gv-flash \.fc-front \{[^\n]*", r"\n[ \t]*\.gv-flash \.fc-back \{[^\n]*"]:
    css, c = re.subn(pat, "", css); removed += c
css = css.replace(", .gv-flash .fc-front { animation: none", " { animation: none")
s = s[:ca] + css + s[cb:]
print(f"  o'lik CSS: {len(DEAD)} klass, {removed} qator; qolgan: {sorted(dead_classes(s) - d0)}")
open(DST, 'w', encoding='utf8').write(s)
print('✅ yozildi', DST, s.count('\n') + 1, 'qator')
