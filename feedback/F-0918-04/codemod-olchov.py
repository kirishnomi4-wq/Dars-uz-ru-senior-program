#!/usr/bin/env python3
# codemod-olchov — KATTA §41 codemod'i uchun QURUQ O'LCHOV. FAQAT O'QIYDI (src/ ga yozmaydi).
# Har `ACH_TRIGGERS` li darsda 151-qonun 6-bandi («birinchi o'tish — hisob») va onFinished yukini muhrlash
# uchun kerakli langar-nuqtalarni topadi, shaklini etalon (pilotdan OLDINGI InternetLesson) bilan solishtiradi.
# Ishlatish: python3 feedback/F-0918-04/codemod-olchov.py  → codemod-olchov.json + stdout jadval
import re, json, subprocess, glob, os, sys, hashlib
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(ROOT)
PILOT = 'src/1-Modull/InternetLesson.jsx'
files = sorted(f for f in glob.glob('src/**/*.jsx', recursive=True) if 'ACH_TRIGGERS' in open(f, encoding='utf-8').read())

def body_from(src, start):
    """start — '{' dan oldingi indeks; mos '}' gacha (satr/shablon ichini qo'pol hisobga oladi)."""
    i = src.index('{', start); depth = 0; j = i; q = None
    while j < len(src):
        c = src[j]
        if q:
            if c == '\\': j += 2; continue
            if c == q: q = None
        elif c == '/' and src[j:j + 2] == '//':  # qator-izoh: ichidagi apostrof satr ochmasin
            j = src.find('\n', j); j = len(src) if j < 0 else j; continue
        elif c == '/' and src[j:j + 2] == '/*':
            j = src.find('*/', j) + 2; continue
        elif c in '"\'`': q = c
        elif c == '{': depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0: return src[i:j + 1]
        j += 1
    return src[i:]

def norm(s): return re.sub(r'\s+', ' ', re.sub(r'//[^\n]*', '', s)).strip()

def finish_body(src):
    m = re.search(r'const finishLesson = (?:async )?\(\) => \{', src)
    return body_from(src, m.start()) if m else None

canon_src = subprocess.run(['git', 'show', 'aad46b9^:' + PILOT], capture_output=True, text=True).stdout
CANON_FIN = norm(finish_body(canon_src))
RESET_R1 = "const reset = () => { progClear(LESSON_META.lessonId); setAnswers({}); setScreen(0); startTimeRef.current = Date.now(); };"
EARN_RE = re.compile(r"const earn = useCallback\(\(id\) => \{\n\s*if \(!ACHIEVEMENTS\[id\] \|\| earnedRef\.current\.has\(id\)\) return;")
EREF_RE = re.compile(r"const earnedRef = useRef\(new Set\(saved\?\.earned \|\| \[\]\)\);")
PW_RE = re.compile(r"progWrite\(LESSON_META\.lessonId, \{([^}]*)\}\);\s*\n\s*\}, \[([^\]]*)\]\);")
SUB_Q = "live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);"
REC_Q = "if (live && live.recordAttempt) live.recordAttempt(screen, SCREEN_META[screen]?.id || `s${screen}`, i, Date.now() - mountTs.current,"

rows = []
for f in files:
    src = open(f, encoding='utf-8').read()
    r = {'file': f, 'lines': src.count('\n') + 1}
    mroot = re.search(r'export default function (\w+)\(\{([^)]*)\}\)', src)
    r['root'] = mroot.group(1) if mroot else None
    r['root_props'] = norm(mroot.group(2)) if mroot else None
    root = src[mroot.start():] if mroot else src
    # reset (ildizdagi — setScreen(0) li)
    resets = [l.strip() for l in root.split('\n') if re.match(r'\s*const reset = ', l) and 'setScreen(0)' in l]
    r['reset_n'] = len(resets)
    rl = resets[0] if resets else ''
    r['reset'] = ('R1' if rl == RESET_R1 else 'R2-prac' if 'setPractice(null)' in rl and 'earnedRef' not in rl else
                  'R3-earned-reset' if 'earnedRef.current = new Set()' in rl else 'R0-yoq' if not rl else 'R4-boshqa')
    r['reset_line'] = rl if r['reset'] not in ('R1',) else ''
    # nom to'qnashuvi: ildizda `practice` allaqachon bormi
    r['practice_collision'] = bool(re.search(r'\[\s*practice\s*,\s*setPractice\s*\]', root))
    r['saved'] = 'const saved = savedRef.current;' in root
    r['progRead'] = 'progRead(' in root
    r['earnedRef'] = len(EREF_RE.findall(root))
    r['earn'] = len(EARN_RE.findall(root))
    r['earn_any'] = len(re.findall(r'const earn = ', root))
    pw = PW_RE.findall(root)
    r['progWrite_n'] = len(pw)
    r['progWrite_fields'] = norm(pw[0][0]) if pw else None
    r['progWrite_deps'] = norm(pw[0][1]) if pw else None
    r['progWrite_any'] = root.count('progWrite(')
    fb = finish_body(root)
    r['finish'] = 'yoq'
    if fb:
        nb = norm(fb)
        r['finish_hash'] = hashlib.md5(nb.encode()).hexdigest()[:8]
        r['finish'] = 'F1-etalon' if nb == CANON_FIN else 'F?'
        r['fin_answers_tokens'] = len(re.findall(r'\banswers\b', fb))
        r['fin_duration'] = fb.count('durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000)')
        r['fin_brd'] = fb.count('buildResultDetails(')
        r['fin_onFinished'] = fb.count("if (typeof onFinished === 'function') onFinished(payload);")
        r['fin_onFinished_any'] = len(re.findall(r'onFinished\(', fb))
        r['fin_payload'] = fb.count('const payload = {')
        r['fin_progClear'] = fb.count('progClear(')
        r['fin_endSession'] = fb.count('live.endSession()')
        r['fin_len'] = len(nb)
        # token-darajali: `answers[i]` lar + buildResultDetails ichidagi `answers, earned` + `answers:` kaliti = hamma `answers` so'zi
        r['fin_ans_idx'] = len(re.findall(r'\banswers\[i\]', fb))
        r['fin_ans_brd'] = fb.count('screenMeta: SCREEN_META, answers, earned')
        r['fin_ans_key'] = len(re.findall(r'\banswers:', fb))
        r['fin_tokens_ok'] = (r['fin_answers_tokens'] == r['fin_ans_idx'] + r['fin_ans_brd'] + r['fin_ans_key'] and r['fin_ans_idx'] >= 2
                              and r['fin_ans_brd'] == 1 and r['fin_duration'] == 1 and r['fin_onFinished'] == 1 and r['fin_payload'] == 1)
    # QuestionScreen
    mq = re.search(r'(?:const|function) QuestionScreen\b', src)
    r['QuestionScreen'] = bool(mq)
    r['sub_q_exact'] = src.count(SUB_Q)
    r['rec_q_exact'] = src.count(REC_Q)
    r['submitAnswer_all'] = src.count('live.submitAnswer(')
    r['recordAttempt_all'] = src.count('live.recordAttempt(')
    r['oneShot'] = bool(re.search(r'\boneShot\b', src))
    r['sub_q_variant'] = len(re.findall(r"^\s*live\.submitAnswer\(screen, SCREEN_META\[screen\]\?\.id \|\| [^,]+, i, isCorrect, Date\.now\(\) - mountTs\.current\);", src, re.M))
    mqs = re.search(r'const QuestionScreen = \(', src)
    r['qs_practice_word'] = len(re.findall(r'\bpractice\b', body_from(src, src.index('=>', mqs.start())))) if mqs else -1
    r['live_import'] = bool(re.search(r"^import \{[^}]*\} from '(\.\./)+live/index\.js';", src, re.M))
    r['earnedRef_variant'] = len(re.findall(r"const earnedRef = useRef\(new Set\(", root))
    # kontekstlar / importlar
    r['AchCtx_def'] = src.count('const AchCtx = createContext(')
    r['AchCtx_provider'] = src.count('<AchCtx.Provider value={earned}>')
    r['AchCtx_provider_any'] = src.count('<AchCtx.Provider')
    imp = re.search(r"import (?:React, )?\{([^}]*)\} from 'react'", src)
    names = set(x.strip() for x in imp.group(1).split(',')) if imp else set()
    r['imp_missing'] = [n for n in ('useRef', 'useState', 'useContext', 'createContext', 'useCallback') if n not in names]
    r['AchMissCtx'] = 'AchMissCtx' in src
    # «Qaytadan»
    r['onReset_prop'] = root.count('onReset={reset}')
    r['onReset_click'] = src.count('onClick={onReset}')
    r['useServerProgress'] = 'useServerProgress(' in root
    r['onFinished_prop'] = bool(mroot and 'onFinished' in mroot.group(2))
    rows.append(r)

# finishLesson shakl-guruhlari (hash bo'yicha)
from collections import Counter, defaultdict
hc = Counter(r.get('finish_hash') for r in rows)
def grp(r):
    if r['file'] == PILOT: return 'G0-pilot'
    if '/eski/' in r['file']: r['probs'] = ['arxiv-papka']; return 'GX-arxiv'
    probs, notes = [], []
    if r['reset'] == 'R3-earned-reset': probs.append('reset-nishonni-tozalaydi')
    elif r['reset'] == 'R0-yoq' or r['reset_n'] != 1: probs.append('reset-topilmadi')
    elif r['reset'] != 'R1': notes.append('reset-qoshimcha-setter')
    if r['practice_collision']: notes.append('ildizda-practice-nomi-band')
    if r['qs_practice_word'] > 0: notes.append('QuestionScreen-da-practice-sozi')
    if not r['saved']: probs.append('saved-yoq')
    if r['earnedRef'] != 1:
        (notes if r['earnedRef_variant'] == 1 else probs).append('earnedRef-variant')
    if r['earn'] != 1: probs.append('earn')
    if r['progWrite_n'] != 1: probs.append('progWrite')
    if not r.get('fin_tokens_ok'): probs.append('finishLesson-token')
    if r['sub_q_variant'] > 1: probs.append('ikkinchi-test-komponent')
    elif r['sub_q_variant'] != 1: probs.append('submitAnswer-qatori')
    elif r['sub_q_exact'] != 1: notes.append('submitAnswer-variant-yozuv')
    if r['rec_q_exact'] != 1: probs.append('recordAttempt-qatori')
    if r['AchCtx_def'] != 1 or r['AchCtx_provider'] != 1: probs.append('AchCtx')
    if r['onReset_prop'] != 1 or r['onReset_click'] < 1: probs.append('onReset')
    if not r['live_import']: probs.append('live-import')
    r['probs'], r['notes'] = probs, notes
    return 'G3-qol' if probs else ('G2-parametrli' if notes else 'G1-mexanik')
for r in rows: r['group'] = grp(r)
print('fayl:', len(rows), '| guruh:', dict(sorted(Counter(r['group'] for r in rows).items())))
print('finishLesson shakllari (hash):', hc.most_common(10))
print('eslatma-turlari:', Counter(n for r in rows for n in r.get('notes', [])).most_common())
print('muammo-turlari:', Counter(p for r in rows for p in r.get('probs', [])).most_common())
for g in ('G2-parametrli', 'G3-qol', 'GX-arxiv'):
    print('==', g)
    for r in rows:
        if r['group'] == g: print('  ', r['file'].replace('src/', ''), '→', ', '.join(r.get('probs', []) + r.get('notes', [])))
# muhrlash qamrovi: onFinished(payload) chaqiradigan HAMMA fayl (ACH_TRIGGERS siz ham)
allf = [f for f in glob.glob('src/**/*.jsx', recursive=True) if "onFinished(payload)" in open(f, encoding='utf-8').read()]
extra = sorted(set(allf) - set(files))
print('== onFinished(payload) bor, ACH_TRIGGERS yo\'q:', len(extra))
for f in extra: print('  ', f.replace('src/', ''))
json.dump({'rows': rows, 'seal_extra': extra}, open('feedback/F-0918-04/codemod-olchov.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
