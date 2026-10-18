# F-1015-355 · RECAPS ekran RAQAMI bilan bog'langan: ekranlar qisqargach eski raqamdagi eslatma boshqa savolga chiqardi.
# recap_kalit(s, {eski: yangi}) — faqat xaritadagi eslatmalar qoladi, yangi raqam bilan; qolganlari olinadi.
import re
def recap_kalit(s, xarita):
    bosh = 'const RECAPS = {'
    r = s.index(bosh); end = s.index('\n};', r)
    body = s[r + len(bosh):end]
    parts = re.split(r'(?=\n  \d+: \{)', body)
    qol = []
    for b in parts[1:]:
        k = int(re.match(r'\n  (\d+): \{', b).group(1))
        if k in xarita:
            b = re.sub(r'^\n  \d+:', '\n  %d:' % xarita[k], b, count=1).rstrip()
            qol.append(b[:-1] if b.endswith(',') else b)
    assert len(qol) == len(xarita), (sorted(xarita), len(qol))
    return s[:r] + bosh + parts[0] + ','.join(qol) + s[end:]
