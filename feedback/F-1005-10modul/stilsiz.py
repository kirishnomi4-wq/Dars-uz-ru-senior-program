# Stilsiz klass detektori: JSX className / cxx('…') dagi klass ↔ fayl yoki qolip CSS dagi «.klass» selektori.
import re, sys
s = open(sys.argv[1], encoding='utf8').read()
qolip = open('/home/kali/Desktop/internetLesson/src/qolip/qolipCss.js', encoding='utf8').read()
tok = set()
for m in re.finditer(r'className="([^"]+)"', s): tok.update(m.group(1).split())
for m in re.finditer(r"className=\{cxx\(([^)]*)\)", s): tok.update(w for t in re.findall(r"'([^']+)'", m.group(1)) for w in t.split())
for m in re.finditer(r"className=\{`([^`]+)`\}", s): tok.update(w for w in re.sub(r'\$\{[^}]*\}', ' ', m.group(1)).split())
tok = {t for t in tok if re.fullmatch(r'[a-zA-Z][\w-]*', t)}
sel = lambda t, txt: re.search(r'\.' + re.escape(t) + r'(?=[\s{:,.>\[)~+]|$)', txt, re.M)
yoq = sorted(t for t in tok if not sel(t, s) and not sel(t, qolip))
print(len(tok), 'klass; stilsiz:', ' '.join(yoq) if yoq else "yo'q")
