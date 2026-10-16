F='/home/kali/Desktop/internetLesson/src/1-Modull/CssPractice.jsx'
S=open(F,encoding='utf8').read()
def one(a):
    n=S.count(a); assert n==1,(n,a[:110]); return S.index(a)
def rep(a,b):
    global S; one(a); S=S.replace(a,b)

# 1) Illyustratsiya komponenti (DsIkon dan keyin) — yuklanmaydi, ranglari uslubga qarab (CSS o'zgaruvchilari)
rep("""const DemoSahifa = ({ holat = 'uslub', uslub = USLUB_STD, halqa = null }) => {""",
r"""// F-1015-314: bosh qism rasmi — kod ichida chizilgan (tashqi rasm yo'q → darhol ochiladi); telefon ichida jadval + to'garak belgilari
const DsIll = () => (
  <svg className="ds-svg" viewBox="0 0 300 230" aria-hidden="true">
    <circle className="il-b1" cx="225" cy="70" r="62" /><circle className="il-b2" cx="70" cy="175" r="48" /><circle className="il-b3" cx="270" cy="190" r="22" />
    <g transform="translate(108,14)">
      <rect className="il-phone" width="104" height="204" rx="18" />
      <rect className="il-screen" x="6" y="10" width="92" height="184" rx="13" />
      <rect className="il-notch" x="38" y="16" width="28" height="5" rx="2.5" />
      <rect className="il-bar" x="14" y="30" width="76" height="22" rx="7" />
      <text className="il-bar-t" x="22" y="45">{tr({ uz: 'Dushanba', ru: 'Понедельник' })}</text>
      {DS_JADVAL.map((r, i) => (
        <g key={i} transform={`translate(14,${60 + i * 40})`}>
          <rect className={`il-r${i + 1}`} width="76" height="34" rx="8" />
          <rect width="4" height="34" rx="2" style={{ fill: r.c }} />
          <text className="il-t" x="10" y="14">{tr(r.t)}</text>
          <text className="il-v" x="10" y="26">{r.v} · {tr(r.x)}</text>
        </g>
      ))}
    </g>
    <g transform="translate(36,46)"><circle className="il-c" r="26" /><rect className="il-robot" x="-12" y="-9" width="24" height="18" rx="5" /><circle className="il-eye" cx="-5" cy="0" r="3" /><circle className="il-eye" cx="5" cy="0" r="3" /><rect className="il-robot" x="-1.5" y="-16" width="3" height="7" /><circle className="il-robot" cy="-17" r="3" /></g>
    <g transform="translate(262,128)"><circle className="il-c" r="24" /><path className="il-chess" d="M-7 12h14v-4h-2l-2-8 4-4-3-6h-6l1 5-5 5 2 8h-3z" /></g>
    <g transform="translate(44,128)"><circle className="il-c" r="20" /><circle className="il-ball-o" r="11" /><path className="il-ball" d="M0-5l4.5 3.3-1.7 5.2h-5.6l-1.7-5.2z" /></g>
  </svg>
);
const DemoSahifa = ({ holat = 'uslub', uslub = USLUB_STD, halqa = null }) => {""")

# 2) eski oq jadval qutisi → illyustratsiya
i=one("          <div className=\"ds-ill\" aria-hidden=\"true\">"); j=S.index("          </div>\n",i)+len("          </div>\n")
S=S[:i]+"          <DsIll />\n"+S[j:]

# 3) CSS: eski ds-ill / ds-row qoidalari → svg qoidalari + uslub ranglari
rep("""        .ds-ill { flex: 1 1 150px; min-width: 0; background: var(--ds-ill); border-radius: 14px; padding: 10px; box-shadow: 0 10px 24px -10px rgba(0,0,0,0.25); display: flex; flex-direction: column; gap: 7px; }
        .ds-ill-h { margin: 0 0 2px; font-size: 10.5px; font-weight: 800; color: var(--ds-ink); }
        .ds-row { display: grid; grid-template-columns: 8px minmax(0,1fr); column-gap: 7px; align-items: center; font-size: 10.5px; }
        .ds-row i { width: 8px; height: 8px; border-radius: 50%; grid-row: span 2; }
        .ds-row-t { font-weight: 700; color: var(--ds-ink); } .ds-row-v { color: var(--ds-mut); grid-column: 2; }
""","""        .ds-svg { flex: 1 1 150px; min-width: 0; max-width: 240px; height: auto; margin: 0 auto; display: block;
          --il-b1: #fed7c7; --il-b2: #e0e7ff; --il-b3: #fde68a; --il-phone: #1e293b; --il-screen: #fff; --il-notch: #cbd5e1; --il-r1: #f8fafc; --il-r2: #fff7ed; --il-r3: #f0fdf4;
          --il-ink: #0f172a; --il-mut: #475569; --il-c: #fff; --il-cl: #e2e8f0; --il-robot: #2563eb; --il-eye: #fff; --il-chess: #0f172a; --il-ball: #16a34a; }
        .ds-svg .il-b1 { fill: var(--il-b1); fill-opacity: 0.75; } .ds-svg .il-b2 { fill: var(--il-b2); fill-opacity: 0.85; } .ds-svg .il-b3 { fill: var(--il-b3); fill-opacity: 0.8; }
        .ds-svg .il-phone { fill: var(--il-phone); } .ds-svg .il-screen { fill: var(--il-screen); } .ds-svg .il-notch { fill: var(--il-notch); }
        .ds-svg .il-bar { fill: var(--ds-acc); } .ds-svg .il-bar-t { fill: var(--ds-acc-ink); font-size: 9px; font-weight: 800; font-family: 'Manrope', Arial, sans-serif; }
        .ds-svg .il-r1 { fill: var(--il-r1); } .ds-svg .il-r2 { fill: var(--il-r2); } .ds-svg .il-r3 { fill: var(--il-r3); }
        .ds-svg .il-t { fill: var(--il-ink); font-size: 8.5px; font-weight: 800; font-family: 'Manrope', Arial, sans-serif; } .ds-svg .il-v { fill: var(--il-mut); font-size: 7.5px; font-family: 'Manrope', Arial, sans-serif; }
        .ds-svg .il-c { fill: var(--il-c); stroke: var(--il-cl); } .ds-svg .il-robot { fill: var(--il-robot); } .ds-svg .il-eye { fill: var(--il-eye); }
        .ds-svg .il-chess { fill: var(--il-chess); } .ds-svg .il-ball { fill: var(--il-ball); } .ds-svg .il-ball-o { fill: var(--il-c); stroke: var(--il-ball); stroke-width: 2.5; }
        .ds-yorqin .ds-svg { --il-b1: #fdba74; --il-b2: #bfdbfe; --il-b3: #fde047; --il-r1: #eff6ff; --il-r2: #fffbeb; --il-r3: #f0fdf4; }
        .ds-qorongi .ds-svg { --il-b1: #134e4a; --il-b2: #1e3a8a; --il-b3: #065f46; --il-phone: #020617; --il-screen: #1e293b; --il-notch: #334155; --il-r1: #0f172a; --il-r2: #0f172a; --il-r3: #0f172a;
          --il-ink: #f1f5f9; --il-mut: #cbd5e1; --il-c: #1e293b; --il-cl: #334155; --il-robot: #34d399; --il-eye: #0f172a; --il-chess: #f1f5f9; --il-ball: #34d399; }
        .ds-gradient .ds-svg { --il-b1: #e9d5ff; --il-b2: #fbcfe8; --il-b3: #c4b5fd; --il-r1: #faf5ff; --il-r2: #fdf2f8; --il-r3: #f5f3ff; --il-robot: #7e22ce; }
        .ds-rang .ds-svg { --il-robot: #15803d; } .ds-rang.ds-qorongi .ds-svg { --il-robot: #fbbf24; --il-ball: #fbbf24; } .ds-rang.ds-gradient .ds-svg { --il-robot: #be185d; }
""")
rep(".ds-xom .ds-mark, .ds-xom .ds-bub, .ds-xom .ds-row i { display: none; }",".ds-xom .ds-mark, .ds-xom .ds-bub, .ds-xom .ds-svg { display: none; }")
rep(".ds-xom .ds-karta, .ds-xom .ds-ill { border: none; padding: 2px 0; box-shadow: none; }",".ds-xom .ds-karta { border: none; padding: 2px 0; box-shadow: none; }")
rep(".lesson-root .ds-xom .ds-h1 { font-size: 24px; } .ds-xom .ds-row { display: block; } .ds-xom .ds-row-v { display: block; }",".lesson-root .ds-xom .ds-h1 { font-size: 24px; }")
open(F,'w',encoding='utf8').write(S); print('ok')
