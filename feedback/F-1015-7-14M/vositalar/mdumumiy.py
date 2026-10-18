# MD sinxroni: python3 mdumumiy.py <md> <F-ID> [teg] [nuq] [tugma=Voqea davomi]  (tugma — voqea ekranidagi pastki tugma nomi, KODDAN oling)
#  teg: «Reja» ro'yxatidagi qatorlar oxiridagi « · <teg>» (yoki « · `teg`») olinadi, ro'yxat oldiga izoh
#       (16.10: teg ichida vergul va « · » ham bo'lishi mumkin — «adaptiv sayt · PWA», «doimiy ulanish, hodisalar»)
#  nuq: «… yorlig'i: X · N/k (… nuqta)» → «nuqtalar yo'q — tugma aytadi»; «Bashorat (X · 1/k)» → «Bashorat (Avval o'zingiz belgilab ko'ring)»
import sys, re
p, fid = sys.argv[1], sys.argv[2]; ops = set(x for x in sys.argv[3:] if '=' not in x)
TUG = next((x.split('=',1)[1] for x in sys.argv[3:] if x.startswith('tugma=')), 'Keyingi bosqich')  # voqea tugmasi kodda qanday bo'lsa
s = open(p, encoding='utf-8').read(); log = []
T = f" *(✎ {fid}, 208-qonun 0-band: takror olindi)*"
if 'teg' in ops:
    L = s.split('\n'); n = 0; first = None
    for i, l in enumerate(L):
        m = re.match(r"^(\s+(?:\d\.|- 0\d ·)\s.+?) · (`[^`]+`|[A-Za-zА-Яа-я'ʻ’/ .,·\-]+)$", l)
        if m and i + 1 < len(L) and n < 4:
            # faqat reja bloki: birinchi topilgan joydan ketma-ket 4 qator
            if first is None: first = i
            if i - first < 4: L[i] = m.group(1); n += 1
    if first is not None:
        L.insert(first, (re.match(r'^(\s*)', L[first]).group(1)) + "(teg yo'q — eyebrow/matnni takrorlardi)" + T)
    s = '\n'.join(L); log.append(f'teg {n}')
if 'nuq' in ops:
    s, a = re.subn(r"^- (Bosqich yorlig'i|Yorliq|Nuqtalar)[^\n]*N/(\d)[^\n]*$", lambda m: f"- Yorliq va nuqtalar yo'q — tugma «{TUG} (N/{m.group(2)})» aytadi; bashorat yorlig'i «Avval o'zingiz belgilab ko'ring»" + T, s, flags=re.M)
    s, b = re.subn(r"Bashorat \(([^)]*?) · \d/\d\)", "Bashorat (Avval o'zingiz belgilab ko'ring)", s)
    s, b2 = re.subn(r"Bashorat \(yorliq «[^»]*· \d/\d»\)", "Bashorat (yorliq «Avval o'zingiz belgilab ko'ring»)", s); b += b2
    s, a2 = re.subn(r"^(- Mentor[^\n]*?); uning ostida yorliq «[^»]* · N/(\d)» va [^\n]*nuqta$", lambda m: m.group(1) + f"; yorliq va nuqtalar yo'q — tugma «{TUG} (N/{m.group(2)})» aytadi" + T, s, flags=re.M); a += a2
    log.append(f'nuq {a} · bashorat-yorliq {b}')
open(p, 'w', encoding='utf-8').write(s); print(' | '.join(log))
