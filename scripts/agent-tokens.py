#!/usr/bin/env python3
# agent-tokens — subagent token-sarfi va jonli nazorat (2026-09-26, foydalanuvchi: «har bir agent-subagentni
# nazoratini ko'rishimiz kerak»). Manba: ~/.claude/projects/<loyiha>/<seans>/subagents/agent-*.jsonl transkriptlari.
#
#   python3 scripts/agent-tokens.py                 — 14 kunlik hisobot: tip bo'yicha yig'indi + eng og'ir yurishlar
#   python3 scripts/agent-tokens.py --days 3        — davr
#   python3 scripts/agent-tokens.py --live          — HOZIR ishlayotgan (oxirgi 30 daq ichida yozgan) agentlar:
#                                                     turn, kontekst, daqiqa, oxirgi harakat, byudjet-ogohlantirish
#   python3 scripts/agent-tokens.py --live --budget 50 --quiet-min 5
#
# «kontekst» = input + cache_creation + cache_read (har turn'da qayta o'qilgan hamma narsa) — sarfning asosiy o'lchovi.
import json, os, glob, time, collections, re, sys, argparse
from datetime import datetime, timezone

ap = argparse.ArgumentParser()
ap.add_argument('--days', type=float, default=14)
ap.add_argument('--live', action='store_true')
ap.add_argument('--budget', type=int, default=50, help='turn-byudjet (rol-fayldagi ⏱ BYUDJET bilan bir xil)')
ap.add_argument('--quiet-min', type=float, default=5, help='shuncha daqiqa harakat bo\'lmasa — «sukut» belgisi')
ap.add_argument('--live-window', type=float, default=30, help='--live: oxirgi N daqiqada yozgan fayllar')
ap.add_argument('--top', type=int, default=12)
a = ap.parse_args()

cwd = os.getcwd()
P = os.path.expanduser('~/.claude/projects/' + re.sub(r'[^A-Za-z0-9]', '-', cwd))
if not os.path.isdir(P):
    print('transkript papkasi topilmadi:', P); sys.exit(1)
now = time.time(); cut = now - a.days * 86400

def ts(s): return datetime.fromisoformat(s.replace('Z', '+00:00'))

# 1) agentId → (tip, tavsif) — ota-seans transkriptidagi Agent tool_use dan
tu2type, agent2type = {}, {}
for sf in glob.glob(P + '/*.jsonl'):
    if os.path.getmtime(sf) < cut - 86400: continue
    with open(sf, encoding='utf-8', errors='replace') as fh:
        for l in fh:
            try: r = json.loads(l)
            except Exception: continue
            m = r.get('message') or {}; c = m.get('content')
            if not isinstance(c, list): continue
            if r.get('type') == 'assistant':
                for b in c:
                    if b.get('type') == 'tool_use' and b.get('name') == 'Agent':
                        i = b.get('input', {}); tu2type[b['id']] = (i.get('subagent_type') or 'general', (i.get('description') or '')[:44])
            elif r.get('type') == 'user':
                for b in c:
                    if b.get('type') == 'tool_result' and b.get('tool_use_id') in tu2type:
                        s = json.dumps(r.get('toolUseResult') or '')
                        mm = re.search(r'agent-?([0-9a-f]{12,20})|"agentId":\s*"([0-9a-f]+)"', s)
                        if mm: agent2type[mm.group(1) or mm.group(2)] = tu2type[b['tool_use_id']]

# 2) har subagent-fayl → o'lchovlar
def scan(af):
    aid = os.path.basename(af)[6:-6]
    typ, desc = agent2type.get(aid, ('?', ''))
    n = ctx = cc = out = 0; t0 = t1 = None; tools = collections.Counter(); reads = collections.Counter(); last_tool = ''; first = ''
    with open(af, encoding='utf-8', errors='replace') as fh:
        for l in fh:
            try: r = json.loads(l)
            except Exception: continue
            t = r.get('timestamp')
            if t: t0 = t0 or t; t1 = t
            m = r.get('message') or {}; c = m.get('content')
            if r.get('type') == 'user' and not first:
                txt = c if isinstance(c, str) else ' '.join(b.get('text', '') for b in c if isinstance(b, dict)) if isinstance(c, list) else ''
                if txt.strip() and not txt.lstrip().startswith('<system-reminder'): first = txt[:60].replace('\n', ' ')
            if r.get('type') == 'assistant':
                u = m.get('usage') or {}
                if u:
                    n += 1; ctx += u.get('input_tokens', 0) + u.get('cache_creation_input_tokens', 0) + u.get('cache_read_input_tokens', 0)
                    cc += u.get('cache_creation_input_tokens', 0); out += u.get('output_tokens', 0)
                if isinstance(c, list):
                    for b in c:
                        if b.get('type') == 'tool_use':
                            tools[b['name']] += 1; inp = b.get('input', {})
                            arg = inp.get('file_path') or inp.get('command') or inp.get('pattern') or ''
                            last_tool = b['name'] + ' ' + os.path.basename(str(arg))[:50]
                            if b['name'] == 'Read': reads[os.path.basename(str(inp.get('file_path', '')))] += 1
    dur = (ts(t1) - ts(t0)).total_seconds() / 60 if t0 and t1 else 0
    return dict(aid=aid, typ=typ, desc=desc or first, n=n, ctx=ctx, cc=cc, out=out, dur=dur, tools=tools, reads=reads,
                date=(t0 or '')[:16].replace('T', ' '), mtime=os.path.getmtime(af), last_tool=last_tool)

files = [f for f in glob.glob(P + '/*/subagents/agent-*.jsonl') if os.path.getmtime(f) >= cut]

if a.live:
    live = [scan(f) for f in files if now - os.path.getmtime(f) <= a.live_window * 60]
    live = [r for r in live if r['n']]
    if not live: print(f'oxirgi {a.live_window:.0f} daqiqada yozgan subagent yo\'q.'); sys.exit(0)
    print(f"{'agent':18s} {'tip':20s} {'turn':>5s} {'ctx-M':>6s} {'daq':>4s} {'sukut':>6s}  holat · oxirgi harakat")
    for r in sorted(live, key=lambda r: -r['mtime']):
        quiet = (now - r['mtime']) / 60
        flag = []
        if r['n'] > a.budget * 1.5: flag.append(f'🔴 byudjet×1,5 ({a.budget}) — TaskStop nomzodi')
        elif r['n'] > a.budget: flag.append(f'🟡 byudjetdan oshdi ({a.budget})')
        if quiet > a.quiet_min: flag.append(f'⏸ {quiet:.0f} daq sukut — scratchpad ham tekshirilsin')
        rr = r['reads'].most_common(1)
        if rr and rr[0][1] >= 5: flag.append(f'♻ {rr[0][0]} ×{rr[0][1]} qayta o\'qilgan')
        print(f"{r['aid'][:18]:18s} {r['typ'][:20]:20s} {r['n']:5d} {r['ctx']/1e6:6.1f} {r['dur']:4.0f} {quiet:5.1f}m  {' · '.join(flag) or '✅'} · {r['last_tool']}")
    sys.exit(0)

runs = [r for r in (scan(f) for f in files) if r['n']]
print(f'subagent-yurishlar ({a.days:g} kun): {len(runs)} · tip aniqlangan: {sum(1 for r in runs if r["typ"] != "?")}')
agg = collections.defaultdict(lambda: dict(k=0, ctx=0, out=0, cc=0, n=0, dur=0, reads=collections.Counter()))
for r in runs:
    g = agg[r['typ']]; g['k'] += 1; g['ctx'] += r['ctx']; g['out'] += r['out']; g['cc'] += r['cc']; g['n'] += r['n']; g['dur'] += r['dur']; g['reads'].update(r['reads'])
print(f"\n{'tip':26s} {'yurish':>6s} {'ctx-M':>8s} {'o`rt-M':>7s} {'chiqish-K':>9s} {'turn/yur':>8s} {'daq/yur':>7s}  eng ko'p qayta o'qilgan")
for t, g in sorted(agg.items(), key=lambda x: -x[1]['ctx']):
    rr = g['reads'].most_common(1); rs = f"{rr[0][0]} ×{rr[0][1]}" if rr else ''
    print(f"{t:26s} {g['k']:6d} {g['ctx']/1e6:8.1f} {g['ctx']/g['k']/1e6:7.2f} {g['out']/1e3:9.0f} {g['n']/g['k']:8.0f} {g['dur']/g['k']:7.0f}  {rs}")
print(f'\nENG OG\'IR {a.top} YURISH:')
for r in sorted(runs, key=lambda r: -r['ctx'])[:a.top]:
    print(f"  {r['date']} {r['typ'][:20]:20s} ctx={r['ctx']/1e6:5.1f}M turn={r['n']:3d} {r['dur']:4.0f}daq  {r['desc'][:50]}")
