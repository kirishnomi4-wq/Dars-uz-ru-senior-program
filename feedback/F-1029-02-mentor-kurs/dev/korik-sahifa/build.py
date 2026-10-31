#!/usr/bin/env python3
# MD v4 → ko'rik sahifasi (HTML). Ekranlar MD'dan avtomatik olinadi; qo'lda ko'chirish yo'q.
import json, re, sys
def parse(md_path):
    L = open(md_path, encoding='utf-8').read().splitlines()

    STAGES = {1: 'Kirish', 2: '1 · Ishga tushirish', 5: '2 · Farqlar', 8: '3 · Resurs', 16: '4 · Guard', 20: '5 · Buzamiz', 24: '6 · Ko\'prik', 29: 'Sinov va yakun'}
    def stage_of(n):
        k = max(s for s in STAGES if s <= n); return STAGES[k]

    screens, cur, mode = [], None, None
    fence = False
    for line in L:
        if line.strip().startswith('```'): fence = not fence
        elif fence:
            pass
        m = None if fence and not line.strip().startswith('```') else re.match(r'^## (\d+) · (.*?)\s+← `(\w+)`', line)
        if m:
            cur = {'n': int(m.group(1)), 'title': m.group(2), 'type': m.group(3), 'stage': stage_of(int(m.group(1))),
                   'head': '', 'segs': [], 'details': []}
            screens.append(cur); mode = None; continue
        if not fence and (line.startswith('## ') or line == '---'):
            cur = None
            continue
        if cur is None: continue
        seg = None if fence else re.match(r'^(\d+)\. \*\*(.+?)\*\*\s*$', line)
        if seg:
            cur['segs'].append({'key': seg.group(2), 'voice': '', 'extra': []}); mode = 'seg'; continue
        if line.startswith('- ') and not fence:
            txt = line[2:]
            if txt.startswith('Kicker:') and not cur['head']:
                cur['head'] = txt; mode = 'head'; continue
            cur['details'].append(txt); mode = 'det'; continue
        if mode == 'seg' and cur['segs']:
            s = cur['segs'][-1]; v = re.match(r'^\s+Ovoz: «(.+)»(.*)$', line)
            if v and not s['voice']:
                s['voice'] = v.group(1)
                if v.group(2).strip(): s['extra'].append(v.group(2).strip().lstrip('·').strip())
            else: s['extra'].append(line[3:] if line.startswith('   ') else line)
        elif mode == 'det' and cur['details']:
            cur['details'][-1] += '\n' + (line[2:] if line.startswith('  ') else line)
        elif mode == 'head':
            cur['head'] += '\n' + line

    for s in screens:
        for g in s['segs']: g['extra'] = '\n'.join(g['extra']).strip()

    # Pasport — jadval qatorlari
    pas = []
    inp = False
    for line in L:
        if line.startswith('## 0. Pasport'): inp = True; continue
        if inp and line.startswith('## '): break
        if inp and line.startswith('| ') and not line.startswith('| Band') and not line.startswith('|---'):
            c = [x.strip() for x in line.strip('|').split('|')]
            if len(c) >= 2: pas.append([c[0], ' | '.join(c[1:])])
    return screens, pas

if __name__ == '__main__':
    md_path, tpl_path, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
    screens, pas = parse(md_path)
    data = {'screens': screens, 'pasport': pas, 'source': 'feedback/F-1029-02-mentor-kurs/03-Nest2-mentor-v4.md'}
    js = json.dumps(data, ensure_ascii=False).replace('</', '<\\/')
    tpl = open(tpl_path, encoding='utf-8').read()
    assert '/*DATA*/null' in tpl
    open(out_path, 'w', encoding='utf-8').write(tpl.replace('/*DATA*/null', js))
    print('ekranlar:', len(screens), '| segmentlar:', sum(len(s['segs']) for s in screens), '| pasport:', len(pas), '| bayt:', len(tpl) + len(js))
    for s in screens:
        if not s['head']: print('  ogoh: head yo\'q →', s['n'])
