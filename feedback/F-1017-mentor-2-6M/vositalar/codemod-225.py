#!/usr/bin/env python3
# F-1017-225 codemod: import + FinishBtn + lobby-catch. Har faylda sonlar tekshiriladi; farq → to'xtaydi (fayl yozilmaydi).
import re, sys
TOAST = ("liveToast({ uz: \"Jonli arena ochilmadi: server javob bermadi. Mashq rejimida ochildi — o'quvchilar ekranida ko'rinmaydi.\", "
         "ru: 'Живая арена не открылась: сервер не ответил. Открыта в режиме тренировки — на экранах учеников не видна.' })")
LOBBY_RE = re.compile(r"\{ try \{ await (_live|live)\.quizControl\('lobby', -1\); \} catch(?: \(_e\))? \{ return; \} \}")
def lobby_new(m):
    v = m.group(1)
    return ("{ try { await %s.quizControl('lobby', -1); } catch (e) { console.warn('[arena]', e); %s; setArenaSolo(true); setArena(true); return; } }" % (v, TOAST))
IMP_RE = re.compile(r"^import \{([^}]*)\} from '\.\./live/index\.js';", re.M)
BTN_OPEN = '<button className="btn-white-accent" onClick={onFinish}'
report = []
for p in sys.argv[1:]:
    s = open(p, encoding='utf8').read(); o = s
    # 1. import
    imps = IMP_RE.findall(s)
    if len(imps) != 1: report.append((p, 'IMPORT', len(imps))); continue
    if 'FinishBtn' not in imps[0]:
        s = IMP_RE.sub(lambda m: "import {%s, FinishBtn, liveToast } from '../live/index.js';" % m.group(1).rstrip().rstrip(','), s, count=1)
    # 2. button
    n = s.count(BTN_OPEN)
    if n != 1: report.append((p, 'BTN', n)); continue
    i = s.index(BTN_OPEN); j = s.index('</button>', i)
    seg = s[i+len(BTN_OPEN):j]
    if '<button' in seg: report.append((p, 'BTN-NESTED', seg[:80])); continue
    s = s[:i] + '<FinishBtn className="btn-white-accent" onClick={onFinish}' + seg + '</FinishBtn>' + s[j+len('</button>'):]
    # 3. lobby
    lob = LOBBY_RE.findall(s)
    if len(lob) > 1: report.append((p, 'LOBBY', len(lob))); continue
    if lob:
        if 'setArenaSolo' not in s: report.append((p, 'LOBBY-NO-setArenaSolo', 0)); continue
        s = LOBBY_RE.sub(lobby_new, s, count=1)
        # 4. mentor-fallback: arena self-rejimda ochiladi (mentor obyekti bilan arena ichida isMentor tarmoqlari qoladi — plitkalar o'chiq)
        ar = re.findall(r"live=\{(_live|live) \|\| \{ mode: 'self' \}\} startSolo=\{arenaSolo\}", s)
        if len(ar) != 1: report.append((p, 'ARENA-RENDER', len(ar))); continue
        s = re.sub(r"live=\{(_live|live) \|\| \{ mode: 'self' \}\} startSolo=\{arenaSolo\}", lambda m: "live={(isMentorL && arenaSolo) ? { mode: 'self' } : (%s || { mode: 'self' })} startSolo={arenaSolo}" % m.group(1), s, count=1)
    open(p, 'w', encoding='utf8').write(s)
    report.append((p, 'OK', 'import+btn+lobby' if lob else 'import+btn'))
for r in report: print('%-48s %-8s %s' % r)
bad = [r for r in report if r[1] != 'OK']
print('--- %d fayl, %d OK, %d muammo' % (len(report), len(report)-len(bad), len(bad)))
sys.exit(1 if bad else 0)
