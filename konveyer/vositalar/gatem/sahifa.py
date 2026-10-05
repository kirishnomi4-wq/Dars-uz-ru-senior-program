# GATE M sahifasi — MD v3 ko'rigi uchun bitta HTML (konveyer 2-bosqich, 05.10.2026; 6-Modul GATE M dan umumlashtirildi).
#   python3 konveyer/vositalar/gatem/sahifa.py <config.json> <md-papka> <chiqish.html>
# config: { title, eyebrow, kirish, kod, darslar: [ { id, qisqa, eyebrow, nom, fayl|null, xulosa, savollar: [ { savol, variantlar: [[harf, matn], …] } ] } ] }
#   - fayl: <md-papka> dagi MD v3 (to'liq matni <details> ichida chiqadi); fayl yo'q — «Modul bo'yi» kabi faqat savollar bo'limi.
#   - birinchi variant = TAVSIYA (sukutda belgilangan). Javob qatori: «GATE M <kod> / Darslar: 02 ✓ … / Savollar: M-q0 A …» — nusxalash tugmasi bilan.
# Namuna: namuna-6modul.json. Natijani asosiy seans Artifact sifatida e'lon qiladi (icon: checklist).
import sys, os, json, html, re, markdown
HERE = os.path.dirname(os.path.abspath(__file__))
if len(sys.argv) != 4: print(__doc__ or 'sahifa.py <config.json> <md-papka> <chiqish.html>'); sys.exit(2)
CFG = json.load(open(sys.argv[1], encoding='utf8'))
P = os.path.join(sys.argv[2], '')
OUT = sys.argv[3]
G = CFG.get('kod', 'modul')
CSS = open(os.path.join(HERE, 'base.css'), encoding='utf8').read()
def esc(s): return re.sub(r'`([^`]+)`', r'<code>\1</code>', html.escape(s))
def md(path):
    t = open(path, encoding='utf8').read()
    return markdown.markdown(t, extensions=['tables', 'fenced_code', 'sane_lists'])
secs = []
for i, d in enumerate(CFG['darslar']):
    body = md(P + d['fayl']) if d.get('fayl') else ''
    qs = ''.join(f'''<div class="qq"><p class="qq-h"><span class="kalit">{d["id"]}-q{k}</span> {esc(q["savol"])}</p><div class="opts">{''.join(f'<label class="opt"><input type="radio" name="{d["id"]}-q{k}" value="{v[0]}"{" checked" if j == 0 else ""}><span><span class="t">{esc(v[0])} · {esc(v[1])}</span>{"<span class=tag>TAVSIYA</span>" if j == 0 else ""}</span></label>' for j, v in enumerate(q["variantlar"]))}</div></div>''' for k, q in enumerate(d.get('savollar', [])))
    secs.append(f'''<section class="q dars" id="{d['id']}">
  <div class="eyebrow">{esc(d['eyebrow'])}</div><h2>{esc(d['nom'])}</h2>
  <p class="ctx">{esc(d['xulosa'])}</p>
  {('<div class="savollar"><div class="eyebrow">Savollar</div>' + qs + '</div>') if qs else ''}
  {f'''<details><summary>MD v3 — to'liq matn ({esc(d['fayl'])})</summary><div class="mdv">{body}</div></details>
  <div class="opts tasdiq"><label class="opt"><input type="radio" name="{d['id']}" value="tasdiq" checked><span><span class="t">Tasdiq</span><span class="d">MD shu holda koddan quriladi</span></span></label>
  <label class="opt"><input type="radio" name="{d['id']}" value="izoh"><span><span class="t">Izoh bilan</span><span class="d">pastdagi izoh maydoniga yozing (ekran raqami bilan)</span></span></label></div>''' if d.get('fayl') else ''}
</section>''')
CSS2 = '''
.dars > * { min-width: 0; } .dars details { min-width: 0; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: var(--bg); }
.dars summary { cursor: pointer; padding: 12px 14px; font-weight: 700; }
.mdv { padding: 4px 18px 18px; overflow-x: auto; min-width: 0; font-size: 14.5px; line-height: 1.55; }
.mdv h1 { font-size: 20px; } .mdv h2 { font-size: 17px; margin-top: 22px; border-top: 1px solid var(--line); padding-top: 14px; } .mdv h3 { font-size: 15px; }
.mdv table { border-collapse: collapse; font-size: 13px; display: block; overflow-x: auto; } .mdv td, .mdv th { border: 1px solid var(--line); padding: 5px 8px; vertical-align: top; }
.mdv pre { background: var(--code-bg, rgba(0,0,0,.05)); padding: 10px; border-radius: 8px; overflow-x: auto; } .mdv blockquote { margin: 0; padding-left: 12px; border-left: 3px solid var(--line); color: var(--muted); }
.mdv li { margin: 3px 0; } .mdv code { overflow-wrap: anywhere; } .mdv p, .mdv li { overflow-wrap: anywhere; } .savollar { display: grid; gap: 10px; grid-template-columns: minmax(0, 1fr); } .qq, .qq .opts, .qq .opt, .qq .opt > span { min-width: 0; } .qq-h, .qq .opt .t { overflow-wrap: anywhere; } .qq-h { font-weight: 700; margin: 0 0 6px; }
.kalit { font: 600 11px/1 'JetBrains Mono', monospace; color: var(--accent); border: 1px solid var(--line); border-radius: 6px; padding: 2px 6px; margin-right: 4px; vertical-align: 1px; } .tasdiq { grid-template-columns: 1fr 1fr; } @media (max-width: 640px) { .tasdiq { grid-template-columns: 1fr; } }
.answer { position: static; } #ans { max-height: 220px; overflow: auto; } .nav a.javob { border-color: var(--accent); color: var(--accent); font-weight: 700; }
.nav { display: flex; flex-wrap: wrap; gap: 8px; } .nav a { font-size: 13px; padding: 6px 10px; border: 1px solid var(--line); border-radius: 999px; text-decoration: none; color: var(--ink); }
'''
names = [d['id'] for d in CFG['darslar'] if d.get('fayl')]
qnames = [f"{d['id']}-q{k}" for d in CFG['darslar'] for k in range(len(d.get('savollar', [])))]
JS = '''
(function () {
  var out = document.getElementById('ans'), note = document.getElementById('note'), st = document.getElementById('st');
  var N = %s, Q = %s, G = %s;
  function v(n) { var c = document.querySelector('input[name="' + n + '"]:checked'); return c ? c.value : '-'; }
  function build() {
    var s = 'GATE M ' + G + '\\nDarslar: ' + N.map(function (n) { return n + ' ' + (v(n) === 'tasdiq' ? '✓' : 'izoh'); }).join(' · ');
    if (Q.length) s += '\\nSavollar: ' + Q.map(function (q) { return q + ' ' + v(q); }).join(' · ');
    var t = note.value.trim(); if (t) s += '\\nIzoh: ' + t; out.textContent = s;
  }
  document.addEventListener('change', build); note.addEventListener('input', build); build();
  document.getElementById('cp').addEventListener('click', function () {
    var t = out.textContent;
    function sel() { var r = document.createRange(); r.selectNodeContents(out); var x = window.getSelection(); x.removeAllRanges(); x.addRange(r); st.textContent = 'Belgilandi — Ctrl+C bosing'; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { st.textContent = 'Nusxalandi'; }, sel); else sel();
  });
})();
''' % (json.dumps(names), json.dumps(qnames), json.dumps(CFG.get('kod', G)))
nav = ''.join(f'<a href="#{d["id"]}">{esc(d["id"])} · {esc(d["qisqa"])}</a>' for d in CFG['darslar']) + '<a class="javob" href="#javob">Javob</a>'
page = f'''<title>{html.escape(CFG['title'])}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap">
<style>{CSS}{CSS2}</style>
<div class="wrap">
  <header><div class="eyebrow">{esc(CFG['eyebrow'])}</div><h1>{esc(CFG['title'])}</h1><p>{esc(CFG['kirish'])}</p></header>
  <div class="nav">{nav}</div>
  {''.join(secs)}
  <div class="answer" id="javob"><div class="eyebrow">Javob — nusxalab chatga qo'ying</div><pre id="ans"></pre>
    <textarea id="note" placeholder="Izoh: dars raqami · ekran raqami · nima o'zgarsin"></textarea>
    <div class="row"><button type="button" class="copy" id="cp">Javobni nusxalash</button><span class="status" id="st" aria-live="polite"></span></div></div>
</div>
<script>{JS}</script>
'''
open(OUT, 'w', encoding='utf8').write(page)
print(OUT, round(os.path.getsize(OUT) / 1e6, 2), 'MB')
