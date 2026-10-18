# Ekran storedAnswer'dan o'qiydigan maydonlar ↔ onAnswer bilan yozadigan maydonlar. O'qiladi, lekin hech qayerda yozilmaydi → shubha.
import re, sys
for line in open(sys.argv[1]):
    mod, path = line.strip().split('|')
    src = open(path).read()
    m = re.search(r"const screens = \[([^\]]+)\]", src)
    names = [x.strip() for x in m.group(1).split(',')] if m else []
    allstarts = sorted(set(x.start() for x in re.finditer(r"\n(?:const [A-Z]\w* = |function [A-Z]\w*\()", src)))
    for n in names:
        mm = re.search(r"\n(?:const|function) " + re.escape(n) + r"\b", src)
        if not mm: continue
        nxt = next((s for s in allstarts if s > mm.start()), len(src))
        body = src[mm.start():nxt]
        reads = set(re.findall(r"storedAnswer\??\.(\w+)", body))
        if not reads: continue
        written = set()
        for om in re.finditer(r"onAnswer\(\s*screen\s*,\s*\{", body):
            # obyekt literal: qavslarni sanab olamiz
            i = om.end(); d = 1; j = i
            while j < len(body) and d: d += {'{': 1, '}': -1}.get(body[j], 0); j += 1
            lit = body[i:j]
            written |= set(re.findall(r"(?:^|[,{\s])(\w+)\s*(?=[:,}])", lit))
        if not re.search(r"onAnswer\(", body): continue
        if re.search(r"onAnswer\(\s*screen\s*,\s*[a-z]\w*\s*\)", body): continue  # o'zgaruvchi bilan — aniqlab bo'lmaydi
        miss = reads - written - {'correct', 'solved', 'picked'}
        if miss and written: print(f"{mod:9} {path.split('/')[-1]:34} {n:20} o'qiydi {sorted(reads)} · yozadi {sorted(written)[:8]}")
