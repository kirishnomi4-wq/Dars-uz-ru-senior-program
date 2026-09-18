#!/usr/bin/env python3
# KATTA §41, 1-qadam — nishon-triggerlarni SARALASH (faqat o'qiydi, hech narsani o'zgartirmaydi).
# Har `ACH_TRIGGERS` kaliti uchun: ekran turi, komponenti, komponent (va u ishlatgan shu fayldagi bolalar) ichida
# «xato qilish mumkin» belgisi bormi, `onAnswer` qanday yonadi. Natija: saralash.md + saralash.json (shu papkada).
# Ishlatish:  python3 feedback/F-0918-04/saralash.py
import re, glob, json, os, collections

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(ROOT)

FAIL = re.compile(r"shake|wrong|\bbad\b|xato|incorrect|isCorrect|isRight|\bcheck\w*\(|tekshir|setErr|error|\btries\b|attempts?\b|mistake|\bfail|\bmiss\w*|\.ok\b|notOk|isOk|valid\w*\(|compile|runCode|expected", re.I)
TOP = re.compile(r"^(?:export\s+)?(?:const|function)\s+([A-Z]\w*)\b", re.M)


def components(src):
    """{name: source} — ustun-0 dan boshlanadigan har komponent/funksiya keyingisigacha."""
    marks = [(m.start(), m.group(1)) for m in TOP.finditer(src)]
    out = {}
    for i, (pos, name) in enumerate(marks):
        end = marks[i + 1][0] if i + 1 < len(marks) else len(src)
        out.setdefault(name, src[pos:end])
    return out


def analyse(path):
    src = open(path, encoding="utf-8").read()
    mt = re.search(r"const ACH_TRIGGERS\s*=\s*\{([^}]*)\}", src)
    if not mt:
        return []
    trig = dict(re.findall(r"['\"]?([\w-]+)['\"]?\s*:\s*['\"]([\w-]+)['\"]", mt.group(1)))
    mm = re.search(r"const SCREEN_META\s*=\s*\[(.*?)\n\];", src, re.S)
    meta = re.findall(r"id:\s*'([^']+)'\s*,\s*type:\s*'([^']+)'", mm.group(1) if mm else src)
    ids = [m[0] for m in meta]
    types = dict(meta)
    ms = re.search(r"const screens\s*=\s*\[([^\]]*)\]", src)
    screens = [x.strip() for x in ms.group(1).split(",") if x.strip()] if ms else []
    comps = components(src)
    ach = re.search(r"const ACHIEVEMENTS\s*=\s*\{(.*?)\n\};", src, re.S)
    descs = {}
    if ach:
        for k, _q, v in re.findall(r"^\s*['\"]?([\w-]+)['\"]?\s*:\s*\{.*?desc:\s*\{\s*uz:\s*([\"'])(.*?)\2", ach.group(1), re.M):
            descs[k] = v
    rows = []
    for sid, badge in trig.items():
        typ = types.get(sid, "?")
        idx = ids.index(sid) if sid in ids else -1
        comp = screens[idx] if 0 <= idx < len(screens) and len(screens) == len(ids) else "?"
        body = comps.get(comp, "")
        kids = sorted({k for k in re.findall(r"<([A-Z]\w*)", body) if k in comps and k != comp})
        deep = body + "".join(comps[k] for k in kids)
        calls = re.findall(r"onAnswer\(\s*screen\s*,\s*\{([^}]*)\}", deep)
        literal_true = [c for c in calls if re.search(r"\bcorrect:\s*true\b", c)]
        computed = [c for c in calls if re.search(r"\bcorrect:\s*(?!true\b|false\b)\S", c) or re.search(r"\bcorrect\s*[,}]", c)]
        is_question = "QuestionScreen" in kids or "<QuestionScreen" in body
        fails = sorted(set(m.group(0).lower() for m in FAIL.finditer(deep)))
        if typ == "test" or is_question:
            basket = "C test (halol)"
        elif computed and not literal_true:
            basket = "C' hisoblangan correct"
        elif fails:
            basket = "A challenge"
        else:
            basket = "B xato qilib bo'lmaydi"
        rows.append(dict(file=path, sid=sid, type=typ, badge=badge, desc=descs.get(badge, ""), comp=comp, kids=kids,
                         basket=basket, fails=fails[:8], calls=len(calls), literal_true=len(literal_true), computed=len(computed)))
    return rows


files = sorted(f for f in glob.glob("src/**/*.jsx", recursive=True) if "ACH_TRIGGERS" in open(f, encoding="utf-8").read())
rows = [r for f in files for r in analyse(f)]
json.dump(rows, open("feedback/F-0918-04/saralash.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)

by = collections.Counter(r["basket"] for r in rows)
non_test = [r for r in rows if not r["basket"].startswith("C test")]
L = ["# KATTA §41 — nishon-triggerlarni saralash (avtomatik, 1-o'tish)", "",
     f"Fayl: {len(files)} · trigger: {len(rows)} · savatlar: " + " · ".join(f"**{k}** {v}" for k, v in by.most_common()), "",
     "Savatlar: **A** — komponentda xato-belgisi bor (151-naqsh qo'yiladi) · **B** — `onAnswer` doim `correct:true`, xato-belgisi yo'q "
     "(nishon «tekin»: foydalanuvchi qarori kerak) · **C'** — `correct` hisoblanadi (qo'lda ko'riladi) · **C** — test (tegilmaydi).", "",
     "Avtomatik saralash TAXMIN — A va B ning har biri kodga tegishdan oldin ko'z bilan tasdiqlanadi.", ""]
for basket in ["B xato qilib bo'lmaydi", "C' hisoblangan correct", "A challenge"]:
    sel = [r for r in rows if r["basket"] == basket]
    L += [f"## {basket} — {len(sel)} trigger, {len(set(r['file'] for r in sel))} fayl", "",
          "| Fayl | Ekran | Tur | Komponent | Nishon | Tavsif | Belgi |", "|---|---|---|---|---|---|---|"]
    for r in sel:
        L.append(f"| `{r['file'].replace('src/', '')}` | {r['sid']} | {r['type']} | {r['comp']} | {r['badge']} | {r['desc'][:60]} | {', '.join(r['fails'][:4])} |")
    L.append("")
open("feedback/F-0918-04/saralash.md", "w", encoding="utf-8").write("\n".join(L) + "\n")

print(f"fayl {len(files)} · trigger {len(rows)}")
for k, v in by.most_common():
    print(f"  {k:28} {v:4}  ({len(set(r['file'] for r in rows if r['basket'] == k))} fayl)")
print("test-bo'lmagan turlar:", dict(collections.Counter(r["type"] for r in non_test).most_common()))
unk = [r for r in rows if r["comp"] == "?"]
print("komponenti topilmagan:", len(unk), sorted(set(r["file"] for r in unk))[:5])
