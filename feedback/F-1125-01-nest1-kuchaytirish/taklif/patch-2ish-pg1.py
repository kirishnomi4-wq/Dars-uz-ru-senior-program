#!/usr/bin/env python3
"""F-1125-01 2-ish TAKLIFI — PG-1 kirish ekrani «Mongo'ni videodan ko'rgan» mentor uchun (faqat o'zbekcha).
PG-1 matni MD'dan yasaladi: MD tahrirlanadi → dev/pg1-matn.py → pg1/parts/03-matn.gen.jsx.
Ko'rik uchun VAQTINCHA; qaytarish: git checkout -- feedback/F-1029-02-mentor-kurs/06-PostgreSQL1-mentor-v1.md src/mentor-kurs/pg1
Ishlatish (repo ildizidan): python3 feedback/F-1125-01-nest1-kuchaytirish/taklif/patch-2ish-pg1.py && python3 feedback/F-1029-02-mentor-kurs/dev/pg1-matn.py
"""
import os
MD = os.environ.get('MD') or os.path.join(os.path.dirname(__file__), '..', '..', 'F-1029-02-mentor-kurs', '06-PostgreSQL1-mentor-v1.md')
s = open(MD, encoding='utf-8').read()
pairs = [
    ("Sarlavha: **Siz Mongo'ni bilasiz. Bugun o'sha blog PostgreSQL'da.**",
     "Sarlavha: **Siz Mongo'ni bilasiz. Bugun blog misoli PostgreSQL'da.**"),
    ("1. **Siz Mongo'da blog yozgansiz — bugun xuddi shu blogni PostgreSQL'da quramiz**",
     "1. **Mongo'dagi oddiy blog misoli — bugun xuddi shu blogni PostgreSQL'da quramiz**"),
    ("Ovoz: «Assalomu alaykum. Siz MongoDB bilan, Mongoose orqali ishlagansiz: modellar, ref, populate.",
     "Ovoz: «Assalomu alaykum. Siz MongoDB va Mongoose'ni videodarslarda ko'rgansiz: modellar, ref, populate."),
]
for old, new in pairs:
    assert s.count(old) == 1, (s.count(old), old[:80])
    s = s.replace(old, new)
open(MD, 'w', encoding='utf-8').write(s)
print('ok PG-1 MD', len(pairs))
