#!/usr/bin/env python3
# codemod-izoh — test izohi va recap ko'rinishini qisqartiradi (30.09, foydalanuvchi qarori S8=A S9=A S10=B).
# Faqat KOD qatlami (matnga tegmaydi — matnni izoh.py extract/apply qiladi):
#   1. QuestionScreen FeedbackBlock: o'quvchi rejimida sarlavha-qator («To'g'ri» / «Qaytadan urinib ko'ring») yo'q,
#      o'rniga izoh boshida «✓ To'g'ri.» / «✗ Xato.» (mentor/kutish/qulf holatlari o'zgarmaydi).
#   2. Recap tugmasi «📖 Eslatma», overlay yorlig'i «📖 Eslatma», yakuniy tugma «Tushunarli».
#   3. RecapOverlay: «Sinfga savol» faqat mentor-jonli ekranida (showAsk={isMentorLive}).
# Ishlatish: python3 codemod-izoh.py <fayl.jsx>…   (idempotent: qayta yurgizilsa o'zgarmaydi)
import re, sys

MARK = ("{!isMentorLive && !waiting && !wrongLocked && <b className=\"fb-mark\" style={{ color: solved ? T.success : T.accent, marginRight: 6 }}>"
        "{solved ? tr({ uz: \"✓ To'g'ri.\", ru: '✓ Верно.' }) : tr({ uz: '✗ Xato.', ru: '✗ Неверно.' })}</b>}")

def find_close_p(s, i):
    # i — '<p' boshlanishi; ichma-ich <p> yo'q deb olinadi
    return s.index('</p>', i) + 4

def feedback(s):
    q = s.index('const QuestionScreen')
    fb = s.index('<FeedbackBlock show={isMentorLive ? mReveal', q)
    if 'className="fb-mark"' in s[fb:fb + 4000]:
        return s, 0
    h = s.index('<p className="small mono"', fb)
    assert h - fb < 300, 'sarlavha-p FeedbackBlock boshida emas'
    he = find_close_p(s, h)
    s = s[:h] + '{(isMentorLive || waiting || wrongLocked) && (' + s[h:he] + ')}' + s[he:]
    b0 = s.index('<p className="body" style={{ margin: 0 }}>', h)
    assert b0 - h < 2500, 'body-p topilmadi'
    b1 = b0 + len('<p className="body" style={{ margin: 0 }}>')
    s = s[:b1] + '\n            ' + MARK + s[b1:]
    return s, 1

def labels(s):
    n = 0
    # recap tugmasi (xato javobdan keyin)
    def mini(m):
        return f"uz: '{m.group(2) or ''}Eslatma', ru: '{m.group(4) or ''}Напоминание'"
    s, k = re.subn(r"uz: ([\"'])(📖 )?Qisqa takrorlash — mavzuni yana bir ko\\?'rish\1, ru: ([\"'])(📖 )?[^\"']*\3", mini, s); n += k
    # overlay yorlig'i va mentor tugmalari
    s, k = re.subn(r"uz: ([\"'])(📖 ?)?Qayta tushuntirish\1, ru: ([\"'])(📖 ?)?[^\"']*\3", mini, s); n += k
    # mentor tugmalari (MentorTestStats) — bir xil nom
    s, k = re.subn(r"uz: 'Qayta tushuntirish — ', ru: '[^']*'", "uz: 'Eslatma — ', ru: 'Напоминание — '", s); n += k
    s, k = re.subn(r"uz: 'Qayta tushuntirishni ochish', ru: '[^']*'", "uz: 'Eslatmani ochish', ru: 'Открыть напоминание'", s); n += k
    s, k = re.subn(r">📖 Qayta tushuntirishni ochish</button>", ">{tr({ uz: '📖 Eslatmani ochish', ru: '📖 Открыть напоминание' })}</button>", s); n += k
    # yakuniy tugma
    s, k = re.subn(r"uz: '✓ Tushunarli — davom etamiz', ru: '✓ Понятно — [^']*'", "uz: 'Tushunarli', ru: 'Понятно'", s); n += k
    s, k = re.subn(r"✓ \{tr\(\{ uz: 'Tushunarli — davom etamiz', ru: 'Понятно — [^']*' \}\)\}", "{tr({ uz: 'Tushunarli', ru: 'Понятно' })}", s); n += k
    s, k = re.subn(r">✓ Tushunarli — davom etamiz</button>", ">{tr({ uz: 'Tushunarli', ru: 'Понятно' })}</button>", s); n += k
    return s, n

def recap(s):
    n = 0
    s, k = re.subn(r'function RecapOverlay\(\{ screenIdx, onClose \}\)', 'function RecapOverlay({ screenIdx, onClose, showAsk })', s); n += k
    s, k = re.subn(r'\{card\.ask && <div className="rc-ask">', '{card.ask && showAsk && <div className="rc-ask">', s); n += k
    # chaqiriqlar: faqat isMentorLive bor komponentda showAsk uzatiladi
    out, last = [], 0
    for m in re.finditer(r'<RecapOverlay screenIdx=\{screen\} onClose=\{\(\) => setRecapOpen\(false\)\} />', s):
        pre = s[:m.start()]
        comp = pre[max(pre.rfind('\nconst '), pre.rfind('\nfunction ')):]
        if 'isMentorLive' in comp:
            out.append(s[last:m.start()]); out.append('<RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} showAsk={isMentorLive} />')
            last = m.end(); n += 1
    out.append(s[last:])
    return ''.join(out), n

for f in sys.argv[1:]:
    s0 = open(f, encoding='utf8').read()
    s, a = feedback(s0)
    s, b = labels(s)
    s, c = recap(s)
    if s != s0:
        open(f, 'w', encoding='utf8').write(s)
    print(f'{f}: feedback={a} yorliq={b} recap={c}')
