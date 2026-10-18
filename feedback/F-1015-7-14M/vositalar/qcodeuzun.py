# F-1015-129: uzun inline-kod (bo'sh joyli, > 24 belgi — SQL, buyruq) faqat bo'sh joylardan qatorga bo'linadi; qisqa kod nowrap qoladi.
# fmtCode: className="qcode" → shartli 'qcode uzun'; CSS: .qcode.uzun { white-space: normal; } (.qcode qoidasidan keyin). python3 qcodeuzun.py <fayl...> [--yoz]
import re, sys
yoz = '--yoz' in sys.argv; fl = [a for a in sys.argv[1:] if not a.startswith('--')]
A = '<code className="qcode" key={i}>{p}</code>'
B = "<code className={p.length > 24 && p.includes(' ') ? 'qcode uzun' : 'qcode'} key={i}>{p}</code>"
CSS = "        .qcode.uzun { white-space: normal; overflow-wrap: break-word; } /* F-1015-129: uzun kod (SQL, buyruq) bo'sh joydan bo'linadi, kartadan chiqmaydi */"
for f in fl:
    s = open(f, encoding='utf-8').read()
    if s.count(A) != 1: print('!!', f, 'fmtCode', s.count(A)); continue
    s = s.replace(A, B)  # avval almashtirish — keyin CSS joyi (siljish xatosi, F-1015-129)
    m = list(re.finditer(r'\n[ \t]*\.qcode \{[^\n]*', s))
    if not m: print('!!', f, '.qcode css yo\'q'); continue
    i = m[0].end(); s = s[:i] + '\n' + CSS + s[i:]
    print(f, 'ok')
    if yoz: open(f, 'w', encoding='utf-8').write(s)
