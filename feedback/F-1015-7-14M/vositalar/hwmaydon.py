# F-1015-123 S3 (3-guruh): uy vazifasi maydonlari → P-025 katta maydon (m7-06 etaloni). Faqat CSS qoidalari almashtiriladi
# (+ yorliqdagi «:» olinadi). python3 hwmaydon.py [--yoz]
import re, sys
yoz = '--yoz' in sys.argv
KONT = "display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 8px;"
MAY = "display: flex; flex-direction: column; gap: 3px; padding: 9px 11px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 13.5px; font-weight: 700; line-height: 1.35; color: ${T.ink};"
YOR = "display: block; font-style: normal; font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2};"
QIY = "font-size: 13.5px; font-weight: 700; line-height: 1.35; color: ${T.ink};"
DOIRA = ("flex: 0 0 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; "
         "font-style: normal; font-weight: 800; font-size: 12px; line-height: 1; color: ${T.accent}; background: ${T.accentSoft};")
# fayl: [(selektor, yangi deklaratsiya)] — selektor aynan fayldagidek; margin (meta) saqlanmaydi, karta gap'i bilan
R = {
 'src/7-Modull/PmUserStoryPitchLesson.jsx': [('.ps-hw-karta', KONT), ('.ps-hw-q', MAY), ('.ps-hw-k', YOR), ('.ps-hw-v', QIY)],
 'src/8-Modull/EventTrackingLesson.jsx': [('.et-hw-meta', KONT + ' margin: 4px 0 10px;'), ('.et-hw-meta span', MAY), ('.et-hw-meta small', YOR), ('.et-hw-q li i', DOIRA)],
 'src/8-Modull/SecurityBasicsLesson.jsx': [('.xr-hw-meta', KONT + ' margin: 4px 0 10px;'), ('.xr-hw-meta span', MAY), ('.xr-hw-meta small', YOR), ('.xr-hw-q li i', DOIRA)],
 'src/8-Modull/PmTrustAuditLesson.jsx': [('.ta-hw-meta', KONT + ' margin: 4px 0 10px;'), ('.ta-hw-meta span', MAY), ('.ta-hw-meta small', YOR), ('.ta-hw-q li i', DOIRA)],
 'src/8-Modull/ProductionDeployLesson.jsx': [('.pd-hw-meta', KONT + ' margin: 4px 0 10px;'), ('.pd-hw-meta > span', MAY), ('.pd-hw-meta small', YOR), ('.pd-hw-q > li > i', DOIRA)],
 'src/10-Modull/PmRealtimeSpecLesson.jsx': [('.rt-hw-karta', KONT), ('.rt-hw-q', MAY), ('.rt-hw-q em', YOR), ('.rt-hw-q b', QIY)],
 'src/10-Modull/PmPitchReviewLesson.jsx': [('.pd-hw-karta', KONT), ('.pd-hw-q', MAY), ('.pd-hw-q em', YOR), ('.pd-hw-q b', QIY)],
 'src/11-Modull/PmPricingLesson.jsx': [('.pz-hw-karta', KONT), ('.pz-hw-q', MAY), ('.pz-hw-k', YOR), ('.pz-hw-v', QIY)],
 'src/11-Modull/PmReflectionLesson.jsx': [('.hd-hw-karta', KONT + ' margin-bottom: 10px;'), ('.hd-hw-q', MAY), ('.hd-hw-k', YOR), ('.hd-hw-v', QIY)],
 'src/9-Modull/LivePrototypeLesson.jsx': [('.jp-hw-karta', KONT), ('.jp-hw-q', MAY), ('.jp-hw-band li i', DOIRA)],
 'src/10-Modull/WebSocketBasicsLesson.jsx': [('.ws-hw-karta', KONT), ('.ws-hw-q', MAY), ('.ws-hw-q em', YOR), ('.ws-hw-q b', QIY), ('.ws-hw-qadam li i', DOIRA)],
 'src/10-Modull/BreakAndFixLesson.jsx': [('.bf-hw-karta', KONT), ('.bf-hw-q', MAY), ('.bf-hw-q em', YOR), ('.bf-hw-q b', QIY), ('.bf-hw-qadam li i', DOIRA)],
 'src/11-Modull/PaymentWebhookLesson.jsx': [('.pw-hw-karta', KONT), ('.pw-hw-q', MAY), ('.pw-hw-q em', YOR), ('.pw-hw-q b', QIY), ('.pw-hw-qadam li i', DOIRA)],
 'src/12-Modull/ProductSpeedLesson.jsx': [('.tz-hw-karta', KONT + ' margin-bottom: 10px;'), ('.tz-hw-q', MAY), ('.tz-hw-q em', YOR), ('.tz-hw-q b', QIY), ('ol.tz-hw-qadam li i', DOIRA)],
}
# sarlavha «Uyga vazifa» (banner bilan takror) → P-025 «Uyda nima qilasiz?»
SARL = ("<div className=\"card-lbl acc\">{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div>", "<div className=\"card-lbl acc\">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>")
SARL_F = ['src/9-Modull/LivePrototypeLesson.jsx', 'src/10-Modull/WebSocketBasicsLesson.jsx', 'src/10-Modull/BreakAndFixLesson.jsx', 'src/11-Modull/PaymentWebhookLesson.jsx', 'src/12-Modull/ProductSpeedLesson.jsx']
# yorliqdagi ikki nuqta (uppercase yorliqda «KIM UCHUN:» bo'lmasin)
KOLON = {
 'src/10-Modull/PmRealtimeSpecLesson.jsx': [("{ uz: 'Kim uchun:', ru: 'Для кого:' }", "{ uz: 'Kim uchun', ru: 'Для кого' }"), ("{ uz: 'Muddat:', ru: 'Срок:' }", "{ uz: 'Muddat', ru: 'Срок' }")],
 'src/10-Modull/PmPitchReviewLesson.jsx': [("{ uz: 'Kim bilan:', ru: 'С кем:' }", "{ uz: 'Kim bilan', ru: 'С кем' }"), ("{ uz: 'Nechta:', ru: 'Сколько:' }", "{ uz: 'Nechta', ru: 'Сколько' }"), ("{ uz: 'Muddat:', ru: 'Срок:' }", "{ uz: 'Muddat', ru: 'Срок' }")],
}
faqat = sys.argv[sys.argv.index('--faqat') + 1] if '--faqat' in sys.argv else ''
for f, qoidalar in R.items():
    if faqat and faqat not in f: continue
    s = open(f, encoding='utf-8').read(); n0 = s
    for sel, dek in qoidalar:
        pat = re.compile(r'(?m)(^\s*(?:ol\.)?|\}\s)' + re.escape(sel.removeprefix('ol.')) + r' \{(?:\$\{[^}]*\}|[^{}])*\}')
        m = list(pat.finditer(s))
        if len(m) != 1: print('!!', f, sel, len(m)); continue
        a = m[0]; s = s[:a.start()] + a.group(1) + sel.removeprefix('ol.') + ' { ' + dek + ' }' + s[a.end():]
    if f in SARL_F:
        if s.count(SARL[0]) != 1: print('!! sarl', f, s.count(SARL[0]))
        else: s = s.replace(SARL[0], SARL[1])
    for a, b in KOLON.get(f, []):
        if s.count(a) != 1: print('!! kolon', f, a, s.count(a)); continue
        s = s.replace(a, b)
    print(f, 'ozgardi' if s != n0 else 'YO\'Q')
    if yoz: open(f, 'w', encoding='utf-8').write(s)
