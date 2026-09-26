#!/usr/bin/env python3
# codemod-taskspec — PM darslardagi global qoldiqlar (F-0926-04, 159-qonun, foydalanuvchi 26.09 «ortiqcha umuman qolmasin»):
#   python3 scripts/codemod-taskspec.py [--write] <fayl...>
# Qiladi:
#   N — TaskSpec sarlavhasidagi «3 tadan N tasi yozildi» sanog'i (holatni qadam-chiplari / ro'yxat ko'rsatadi) — span olinadi
#   X — «💡 Yordam / ⭐ Qo'shimcha» uzuq chiziqli qutilari → matn-havola (PmLesson9 naqshi, 16-qonun: yopiladigan MATN, bo'sh joy emas)
#   P — test izohi boshidagi «To'g'ri — » / «Верно — » (natija yorlig'i tepada allaqachon aytadi) — keyingi harf bosh harf bo'ladi
import re, sys
W = '--write' in sys.argv
files = [a for a in sys.argv[1:] if not a.startswith('--')]

N = re.compile(r'\n[ \t]*<span className="wsp-task-n mono">(?:(?!</span>\n).)*tadan(?:(?!</span>\n).)*</span>(?=\n)')
X_NEW = {
    'wsxrow': "  .wsxrow { display: flex; gap: 18px; flex-wrap: wrap; align-items: flex-start; }",
    'wsx': "  /* 16-qonun: bu yopiladigan MATN, bo'sh joy emas — uzuq chiziqli quti EMAS, matn-havola. */\n"
           "  .wsx { flex: none; min-width: 0; background: transparent; border: none; border-radius: 0; overflow: visible; }",
    'toggle': "  .wsx-toggle { width: auto; text-align: left; background: none; border: none; border-bottom: 1px solid ${T.line}; padding: 2px 0; font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink2}; cursor: pointer; }\n"
              "  .wsx-toggle:hover, .wsx-toggle:focus-visible { color: ${T.accent}; border-bottom-color: ${T.accent}; }",
    'startog': "  .wsx.star .wsx-toggle:hover, .wsx.star .wsx-toggle:focus-visible { color: ${T.blue}; border-bottom-color: ${T.blue}; }",
    'body': "  .wsx-body { padding: 8px 0 0; display: flex; flex-direction: column; gap: 6px; animation: fade-step 0.25s ease-out; }",
}
X_PAT = {
    'wsxrow': re.compile(r'^  \.wsxrow \{[^\n]*\}$', re.M),
    'wsx': re.compile(r'^  \.wsx \{[^\n]*dashed[^\n]*\}$', re.M),
    'toggle': re.compile(r'^  \.wsx-toggle \{[^\n]*\}$', re.M),
    'startog': re.compile(r'^  \.wsx\.star \.wsx-toggle \{ color: \$\{T\.blue\}; \}$', re.M),
    'body': re.compile(r'^  \.wsx-body \{[^\n]*\}$', re.M),
}
X_MEDIA = re.compile(r'^[ \t]{4,}\.wsx(?:-body|-toggle) \{ padding:[^\n]*\}\n', re.M)  # eski quti-padding'ni media'da qayta bermasin
P = re.compile(r"(explainCorrect=\{tr\(\{\s*uz:\s*)([\"'])To'g'ri — («?)(\w)|(,\s*ru:\s*)(['\"])Верно — («?)(\w)")

def cap(m):
    if m.group(1): return m.group(1) + m.group(2) + m.group(3) + m.group(4).upper()
    return m.group(5) + m.group(6) + m.group(7) + m.group(8).upper()

tot = {}
for f in files:
    s = open(f, encoding='utf-8').read(); o = s; c = {}
    s, c['N'] = N.subn('', s)
    c['X'] = 0
    if X_PAT['wsx'].search(s):
        for k, p in X_PAT.items():
            s, n = p.subn(lambda m, k=k: X_NEW[k], s, count=1); c['X'] += n
        s, n = X_MEDIA.subn('', s); c['X'] += n
    # P: faqat explainCorrect satrlarida
    L = s.split('\n'); n = 0
    for i, l in enumerate(L):
        if 'explainCorrect=' in l and ("To'g'ri — " in l or 'Верно — ' in l):
            l2, a = P.subn(cap, l); L[i] = l2; n += a
    s = '\n'.join(L); c['P'] = n
    left = len(re.findall(r"wsp-task-n mono|explainCorrect=\{tr\(\{ uz: [\"']To'g'ri — ", s))
    for k, v in c.items(): tot[k] = tot.get(k, 0) + v
    print(f"{f}: " + ' '.join(f"{k}={v}" for k, v in c.items()) + (f'  ⚠ qoldiq {left}' if left else ''))
    if W and s != o: open(f, 'w', encoding='utf-8').write(s)
print('JAMI ' + ' '.join(f"{k}={v}" for k, v in tot.items()) + (' (yozildi)' if W else ' (quruq)'))
