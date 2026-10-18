# F-1015-407: m4c-07 03/07 «Ishonchli lenta (maket)» — o'ng ustun yaxshilash yoqilguncha bo'sh edi (F-399/403/405 sinfi) →
# boshidanoq xira «Oldin / Keyin» kartasi + chorlov; «Parallel lentalar» kartasi «3 muhitda (Node 18/20/22)» deydi — dars (kirish, reja, ci.yml)
# «ikki Node 22, 24» → «2 muhitda (Node 22/24)» (uz+ru). Zaxira: arxiv/F-1015-407-oldin/. Qayta yurgizilmaydi.
import pathlib
P = pathlib.Path('/home/kali/Desktop/internetLesson/src/4c-Modull/FullProPipelineLesson.jsx')
s = P.read_text()
def rep(old, new):
    global s
    assert s.count(old) == 1, (s.count(old), old[:90]); s = s.replace(old, new)
rep("""          <Col>
            {IMPROVEMENTS.map(im => on.has(im.id) && (""",
"""          <Col>
            {on.size === 0 && <div className="sk-info imp locked" aria-hidden="true">{/* F-1015-407: ustun bo'sh turmasin — birinchi yoqishgacha xira namuna */}
              <p className="note-h zb-notch">{tr({ uz: 'Oldin / Keyin', ru: 'До / После' })}</p>
              <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: "yaxshilashni yoqing — farq shu yerda chiqadi ←", ru: 'включите улучшение — разница появится здесь ←' })}</p>
            </div>}
            {IMPROVEMENTS.map(im => on.has(im.id) && (""")
rep("""after: { uz: "3 muhitda (Node 18/20/22) parallel tekshiriladi — muammo oldindan ko'rinadi", ru: 'Параллельная проверка в 3 средах (Node 18/20/22) — проблема видна заранее' }""",
    """after: { uz: "2 muhitda (Node 22/24) parallel tekshiriladi — muammo oldindan ko'rinadi", ru: 'Параллельная проверка в 2 средах (Node 22/24) — проблема видна заранее' }""")
rep("        .sk-info.imp {", "        .sk-info.imp.locked { opacity: 0.5; } /* F-1015-407 */\n        .sk-info.imp {")
# arena savoli ham 3 muhit/Node 18 derdi — darsga moslandi (2 muhit, Node 22); «qolgan ikkita» varianti → «qolgan»
rep("""Matrix'da 3 muhitdan biri (masalan Node 18) qizil chiroq bersa nima bo'ladi?", ru: 'Что будет, если в matrix одна из 3 сред (например, Node 18) даст красный свет?'""",
    """Matrix'da 2 muhitdan biri (masalan Node 22) qizil chiroq bersa nima bo'ladi?", ru: 'Что будет, если в matrix одна из 2 сред (например, Node 22) даст красный свет?'""")
rep("""Qolgan ikkita muhit ham avtomatik ravishda qizil bo'lib qolaveradi", ru: 'Остальные две среды тоже автоматически станут красными'""",
    """Ikkinchi muhit ham avtomatik ravishda qizil bo'lib qoladi", ru: 'Вторая среда тоже автоматически станет красной'""")
rep("s2-s3 Matrix (3 muhit parallel, biri qizil)", "s2-s3 Matrix (2 muhit parallel, biri qizil)")  # sarlavha-izoh
assert '3 muhit' not in s and 'Node 18' not in s, 'eski 3-muhit qoldi'
P.write_text(s); print('OK f407')
