# F-1015-357 · drag-drop chip — brend gradient (F-1002-59, foydalanuvchi 17.10 «eski chiroyli rang»): oq fon + accent matn o'rniga to'ldirilgan gradient, ⠿ ushlagich.
import re
DD_CHIP = '        .dd-chip { font-family: \'JetBrains Mono\', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: clamp(13px,1.7vw,15px); color: #fff; background: linear-gradient(170deg, #FF8A3D, ${T.accent}); border: none; border-radius: 11px; padding: 11px 15px; cursor: grab; touch-action: none; box-shadow: 0 8px 16px -8px rgba(255,79,40,.6), inset 0 2px 0 rgba(255,255,255,.3); transition: transform .12s; user-select: none; }'
DD_BEFORE = "        .dd-chip::before { content: '⠿'; margin-right: 7px; opacity: .75; font-weight: 400; } /* F-1015-352 (F-1002-59): to'ldirilgan gradient chip, ⠿ ushlagich sudralishni aytadi */"
def dd_gradient(s):
    s, n1 = re.subn(r'(?m)^        \.dd-chip \{.*$', lambda m: DD_CHIP, s)
    s, n2 = re.subn(r'(?m)^        \.dd-chip::before \{.*$', lambda m: DD_BEFORE, s)
    assert n1 == 1 and n2 == 1, (n1, n2)
    return s
