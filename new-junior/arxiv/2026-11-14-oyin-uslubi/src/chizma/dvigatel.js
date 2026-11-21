// Junior chizish dvigateli: qahramon, Coddy, zona — hammasi kodda (SVG satri qaytaradi), rasm fayli yoq.
// Coddy shakllari brend qollanmasidagi asl rasmdan olchangan (KONSEPSIYA 10-bolim).
/* Junior chizish dvigateli: qahramon, robot, zona. Hammasi kodda, rasm fayli yoq. */
let UID = 0;
const hx = (h) => { h = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16)); };
const toHex = (r) => '#' + r.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => { a = hx(a); b = hx(b); return toHex(a.map((v, i) => v + (b[i] - v) * t)); };
function hsl(c) { const [r, g, b] = hx(c).map((v) => v / 255); const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2; if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; } return [h, s, l]; }
function fromHsl(h, s, l) { h = ((h % 360) + 360) % 360; const f = (n) => { const k = (n + h / 30) % 12, a = s * Math.min(l, 1 - l); return 255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))); }; return toHex([f(0), f(8), f(4)]); }
/* Soya rangi: sariq-zargaldoqda iliq (qizgish), qolganida sovuq (binafsha) tomonga buriladi — loyqa chiqmaydi */
function shade(c, dl) { const [h, s, l] = hsl(c); const target = h >= 15 && h <= 75 ? 12 : 270; let dh = target - h; if (dh > 180) dh -= 360; if (dh < -180) dh += 360; const warm = target === 12; return fromHsl(h + Math.max(-22, Math.min(22, dh)) * (warm ? 0.7 : 1), Math.min(1, s * (warm ? 1 : 0.94)), l * (warm ? dl + (1 - dl) * 0.42 : dl)); }
const pal = (c) => ({ c, hi: mix(c, '#fff7e6', 0.55), lo: shade(c, 0.68), deep: shade(c, 0.3), lid: shade(c, 0.92), lid2: shade(c, 0.7), glow: mix(c, '#fff3b0', 0.5) });

function starD(cx, cy, R, r) {
  const p = [];
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, q = i % 2 ? r : R; p.push([cx + q * Math.cos(a), cy + q * Math.sin(a)]); }
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const m0 = mid(p[9], p[0]);
  let d = 'M' + m0[0].toFixed(1) + ' ' + m0[1].toFixed(1);
  for (let i = 0; i < 10; i++) { const m = mid(p[i], p[(i + 1) % 10]); d += 'Q' + p[i][0].toFixed(1) + ' ' + p[i][1].toFixed(1) + ' ' + m[0].toFixed(1) + ' ' + m[1].toFixed(1); }
  return d + 'Z';
}

const HEROES = {
  momiq: { nom: 'Momiq', izoh: 'momiq junli, yumshoq', rang: '#9A7BFF', mat: 'jun',
    d: 'M100 60a66 63 0 1 1 0 126a66 63 0 1 1 0-126z', eye: { y: 116, dx: 24, rx: 18, ry: 20 }, my: 153, feet: { y: 190, dx: 24 }, hands: { y: 148, dx: 70 }, hl: [70, 84], tepa: 'quloq' },
  jele: { nom: 'Jele', izoh: 'shaffof, liqillaydi', rang: '#FF6F8F', mat: 'jele',
    d: 'M100 32C112 60 161 96 161 137C161 171 134 193 100 193C66 193 39 171 39 137C39 96 88 60 100 32Z', eye: { y: 130, dx: 23, rx: 17, ry: 19 }, my: 165, hands: { y: 158, dx: 64 }, hl: [72, 108], tepa: 'pufak' },
  katak: { nom: 'Katak', izoh: 'silliq kubik, piksellari uchadi', rang: '#3FA2FF', mat: 'loy',
    d: 'M74 70h52a30 30 0 0 1 30 30v58a30 30 0 0 1-30 30H74a30 30 0 0 1-30-30v-58a30 30 0 0 1 30-30z', eye: { y: 120, dx: 24, rx: 17, ry: 19 }, my: 157, feet: { y: 192, dx: 27 }, hands: { y: 146, dx: 65 }, hl: [72, 88], tepa: 'piksel' },
  yulduz: { nom: 'Yulduz', izoh: 'yaltiroq, uchlari yumaloq', rang: '#FFC12E', mat: 'yaltiroq',
    d: starD(100, 120, 114, 42), eye: { y: 114, dx: 19, rx: 14.5, ry: 16.5 }, my: 142, hl: [80, 82], tepa: 'uchqun' },
  nihol: { nom: 'Nihol', izoh: 'boshida ikki bargi bor', rang: '#58C765', mat: 'loy',
    d: 'M100 72C137 72 157 104 157 139C157 173 132 193 100 193C68 193 43 173 43 139C43 104 63 72 100 72Z', eye: { y: 130, dx: 23, rx: 17, ry: 19 }, my: 165, feet: { y: 193, dx: 23 }, hands: { y: 156, dx: 63 }, hl: [72, 100], tepa: 'barg' },
  /* muammochalar */
  kamvoy: { nom: 'Kamvoy', rang: '#FFA928', mat: 'loy', d: 'M148.2 116.4A52 52 0 1 1 119.6 87.9A22 22 0 0 0 148.2 116.4Z', eye: { y: 134, dx: 18, rx: 14, ry: 16 }, my: 164, feet: { y: 190, dx: 18 }, hl: [70, 112] },
  ortiqvoy: { nom: 'Ortiqvoy', rang: '#E45BD6', mat: 'jele', d: 'M100 92C150 92 184 112 184 146C184 176 150 192 100 192C50 192 16 176 16 146C16 112 50 92 100 92Z', eye: { y: 134, dx: 24, rx: 15, ry: 17 }, my: 165, hands: { y: 150, dx: 92 }, hl: [58, 112] },
  boshvoy: { nom: "Bo'shvoy", rang: '#9FB2EE', mat: 'arvoh', d: 'M100 62C134 62 152 90 152 124V186C152 192 146 194 141 189C134 182 126 182 120 189C114 195 106 195 100 189C94 182 86 182 80 189C74 195 66 195 59 189C54 184 48 192 48 186V124C48 90 66 62 100 62Z', eye: { y: 120, dx: 21, rx: 15, ry: 17 }, my: 152, hl: [74, 88] },
};

const MOODS = {
  xotirjam: { lab: 'xotirjam', lid: 0.05, mouth: 'smile' },
  xursand: { lab: 'xursand', lid: 0, low: 1, mouth: 'open', brow: 'up', hands: 'up' },
  hayron: { lab: 'hayron', lid: 0, pr: 0.48, mouth: 'o', brow: 'high' },
  oylanadi: { lab: "o'ylanadi", lid: 0.14, gx: 4, gy: -5, mouth: 'side', brow: 'one', hands: 'chin' },
  xafa: { lab: 'xafa', lid: 0.3, tilt: 13, gy: 3, mouth: 'frown', brow: 'sad' },
  mudroq: { lab: 'mudroq', lid: 0.6, gy: 4, mouth: 'tiny', zz: 1 },
  qaraydi: { ichki: 1, lid: 0, gx: 4, gy: -6, mouth: 'smile', brow: 'up' },
};
const MOVES = { turadi: 'turadi', yuradi: 'yuradi', sakraydi: 'sakraydi', gapiradi: 'gapiradi' };

function eyeSvg(u, side, cx, cy, rx, ry, m, p, lite) {
  const pr = rx * (m.pr || 0.62), tilt = (m.tilt || 0) * (side === 'L' ? -1 : 1), lidPct = -(1 - (m.lid || 0)) * 100;
  const fix = m.gx || m.gy ? ' data-fix="1"' : '';
  return `<g>${lite ? '' : `<ellipse cx="${cx}" cy="${cy + 3}" rx="${rx + 1.5}" ry="${ry + 1.5}" fill="${p.lo}" opacity=".4" filter="url(#${u}f3)"/>`}
<clipPath id="${u}e${side}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath>
<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${u}w)"/>
<g clip-path="url(#${u}e${side})"><g class="pp"${fix} style="--gx:${m.gx || 0}px;--gy:${m.gy || 0}px">
<circle cx="${cx}" cy="${cy + 1}" r="${pr}" fill="url(#${u}p)"/>
<circle cx="${cx - pr * 0.36}" cy="${cy + 1 - pr * 0.42}" r="${pr * 0.36}" fill="#fff"/>
<circle cx="${cx + pr * 0.44}" cy="${cy + 1 + pr * 0.46}" r="${pr * 0.16}" fill="#fff" opacity=".8"/></g>
${m.low ? `<ellipse cx="${cx}" cy="${cy + ry * 1.52}" rx="${rx * 1.4}" ry="${ry}" fill="${p.lid}"/>` : ''}
<g transform="rotate(${tilt} ${cx} ${cy})"><rect class="lid" x="${cx - rx - 5}" y="${cy - ry - 5}" width="${2 * rx + 10}" height="${2 * ry + 10}" fill="url(#${u}l)" style="--lid:${lidPct}%"/></g></g></g>`;
}

function browSvg(side, cx, y, kind, p) {
  const s = side === 'L' ? 1 : -1;
  let d = '';
  if (kind === 'up') d = `M${cx - 10} ${y}q10 -7 20 0`;
  else if (kind === 'high') d = `M${cx - 10} ${y - 6}q10 -8 20 0`;
  else if (kind === 'one') d = side === 'L' ? `M${cx - 10} ${y + 2}h20` : `M${cx - 10} ${y - 5}q10 -8 20 0`;
  else if (kind === 'sad') d = `M${cx - 10 * s} ${y + 4}L${cx + 10 * s} ${y - 4}`;
  else return '';
  return `<path d="${d}" fill="none" stroke="${p.deep}" stroke-width="4.4" stroke-linecap="round" opacity=".78"/>`;
}

function mouthSvg(u, x, y, kind, p, talk) {
  const k = talk ? 'open' : kind;
  let s = '';
  if (k === 'smile') s = `<path d="M-11 -2q11 10 22 0" fill="none" stroke="${p.deep}" stroke-width="3.8" stroke-linecap="round"/>`;
  else if (k === 'open') s = `<clipPath id="${u}mc"><path d="M-15 -4Q0 1 15 -4Q13 14 0 14Q-13 14 -15 -4Z"/></clipPath><path d="M-15 -4Q0 1 15 -4Q13 14 0 14Q-13 14 -15 -4Z" fill="#5a1634"/><ellipse cx="0" cy="12" rx="8" ry="5" fill="#ff7d93" clip-path="url(#${u}mc)"/>`;
  else if (k === 'o') s = `<ellipse cx="0" cy="3" rx="6.5" ry="8.5" fill="#5a1634"/><ellipse cx="0" cy="7" rx="4" ry="3" fill="#ff7d93" opacity=".8"/>`;
  else if (k === 'side') s = `<path d="M-2 2q8 -6 15 -1" fill="none" stroke="${p.deep}" stroke-width="3.8" stroke-linecap="round"/>`;
  else if (k === 'frown') s = `<path d="M-10 5q10 -10 20 0" fill="none" stroke="${p.deep}" stroke-width="3.8" stroke-linecap="round"/>`;
  else if (k === 'tiny') s = `<ellipse cx="0" cy="2" rx="4.5" ry="5.5" fill="#5a1634"/>`;
  return `<g transform="translate(${x} ${y})"><g class="mo">${s}</g></g>`;
}

function topSvg(u, h, p, lite) {
  const t = h.tepa;
  if (t === 'quloq') return `<circle cx="52" cy="78" r="19" fill="url(#${u}b)"/><circle cx="148" cy="78" r="19" fill="url(#${u}b)"/><circle cx="53" cy="79" r="9" fill="${p.hi}" opacity=".7"/><circle cx="147" cy="79" r="9" fill="${p.hi}" opacity=".5"/><path d="M100 64C92 50 96 40 104 36C103 46 110 50 108 64Z" fill="url(#${u}b)"/>`;
  if (t === 'piksel') return `<g class="fl1"><rect x="146" y="44" width="18" height="18" rx="6" fill="${p.c}"/><rect x="149" y="46" width="8" height="4" rx="2" fill="#fff" opacity=".6"/></g><g class="fl2"><rect x="168" y="68" width="12" height="12" rx="4" fill="${p.lo}"/></g><g class="fl3"><rect x="160" y="24" width="9" height="9" rx="3" fill="${p.hi}"/></g>`;
  if (t === 'barg') return `<g class="sway"><path d="M100 76q-3 -14 1 -26" fill="none" stroke="#3f9d4e" stroke-width="6" stroke-linecap="round"/><path d="M102 52C118 22 152 24 162 32C152 60 122 64 102 52Z" fill="url(#${u}lf)"/><path d="M106 50Q130 36 154 34" fill="none" stroke="#e9ffb8" stroke-width="2.2" stroke-linecap="round" opacity=".7"/><path d="M100 56C86 34 60 36 52 42C58 62 84 66 100 56Z" fill="url(#${u}lf)"/><path d="M96 55Q78 44 58 44" fill="none" stroke="#e9ffb8" stroke-width="2" stroke-linecap="round" opacity=".6"/></g>`;
  return '';
}
function overSvg(u, h, p, lite) {
  const t = h.tepa;
  if (t === 'pufak') return `<circle cx="134" cy="112" r="7" fill="#fff" opacity=".28"/><circle cx="132" cy="110" r="2.2" fill="#fff" opacity=".8"/><circle cx="146" cy="134" r="4" fill="#fff" opacity=".25"/><circle cx="62" cy="164" r="5" fill="#fff" opacity=".22"/>`;
  if (t === 'uchqun') return `<path class="tw" d="M162 40q3 12 14 14q-11 3 -14 14q-3 -11 -14 -14q11 -2 14 -14z" fill="#fffbe0"/>`;
  return '';
}

function heroInner(o) {
  const h = HEROES[o.k], p = pal(o.rang || h.rang), m = MOODS[o.mood || 'xotirjam'], u = 'h' + ++UID + '_', lite = !!o.lite;
  const talk = o.mv === 'gapiradi', E = h.eye, jele = h.mat === 'jele' || h.mat === 'arvoh';
  const bl = (n) => (lite ? '' : ` filter="url(#${u}f${n})"`);
  const defs = `<defs>
<radialGradient id="${u}b" gradientUnits="userSpaceOnUse" cx="${h.hl[0] - 4}" cy="${h.hl[1] - 12}" r="150"><stop offset="0" stop-color="${p.hi}"/><stop offset=".42" stop-color="${p.c}"/><stop offset="1" stop-color="${p.lo}"/></radialGradient>
<radialGradient id="${u}w" cx=".42" cy=".34" r=".78"><stop offset=".55" stop-color="#fff"/><stop offset="1" stop-color="#cdd4ee"/></radialGradient>
<radialGradient id="${u}p" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#4d4570"/><stop offset=".62" stop-color="#15111e"/></radialGradient>
<linearGradient id="${u}l" x1="0" y1="0" x2="0" y2="1"><stop offset=".7" stop-color="${p.lid}"/><stop offset="1" stop-color="${p.lid2}"/></linearGradient>
<linearGradient id="${u}lf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c8f27a"/><stop offset=".6" stop-color="#74d055"/><stop offset="1" stop-color="#2f9a57"/></linearGradient>
<clipPath id="${u}c"><path d="${h.d}"/></clipPath>
${lite ? '' : `<filter id="${u}f1" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.3"/></filter>
<filter id="${u}f3" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="${u}f7" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="7"/></filter>
${h.mat === 'jun' ? `<filter id="${u}jun" x="-14%" y="-14%" width="128%" height="128%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".62" numOctaves="2" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="11" xChannelSelector="R" yChannelSelector="G" result="fz"/><feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="2" seed="11" result="f"/><feColorMatrix in="f" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1.1 -0.5" result="fa"/><feComposite in="fa" in2="fz" operator="in" result="sp"/><feMerge><feMergeNode in="fz"/><feMergeNode in="sp"/></feMerge></filter>` : ''}
${h.mat === 'loy' ? `<filter id="${u}loy" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" result="n"/><feDiffuseLighting in="n" surfaceScale=".9" diffuseConstant="1" lighting-color="#fff" result="lt"><feDistantLight azimuth="225" elevation="62"/></feDiffuseLighting><feComposite in="SourceGraphic" in2="lt" operator="arithmetic" k1=".5" k2=".56" k3="0" k4="0" result="m"/><feComposite in="m" in2="SourceGraphic" operator="in"/></filter>` : ''}`}
</defs>`;
  const matF = lite ? '' : h.mat === 'jun' ? ` filter="url(#${u}jun)"` : h.mat === 'loy' ? ` filter="url(#${u}loy)"` : '';
  const inner = jele
    ? `<path d="${h.d}" fill="none" stroke="${p.glow}" stroke-width="26" opacity=".7"${bl(7)} transform="translate(-8 -10)"/><path d="${h.d}" fill="none" stroke="#fff" stroke-width="12" opacity=".55"${bl(3)} transform="translate(5 6)"/>`
    : `<path d="${h.d}" fill="none" stroke="${p.lo}" stroke-width="24" opacity=".6"${bl(7)} transform="translate(-8 -10)"/><path d="${h.d}" fill="none" stroke="#fff" stroke-width="13" opacity=".42"${bl(7)} transform="translate(6 7)"/>`;
  const body = `<g${matF}>${topSvg(u, h, p, lite)}<path d="${h.d}" fill="url(#${u}b)"${h.mat === 'arvoh' ? ' opacity=".82"' : jele ? ' opacity=".95"' : ''}/>
<g clip-path="url(#${u}c)">${lite ? '' : inner}<ellipse cx="${h.hl[0] + 4}" cy="${h.hl[1] + 6}" rx="30" ry="19" fill="#fff" opacity="${lite ? 0.22 : 0.38}"${bl(7)} transform="rotate(-28 ${h.hl[0] + 4} ${h.hl[1] + 6})"/></g></g>
<ellipse cx="${h.hl[0]}" cy="${h.hl[1]}" rx="${h.mat === 'yaltiroq' || jele ? 15 : 12}" ry="${h.mat === 'yaltiroq' || jele ? 6.5 : 5.5}" fill="#fff" opacity="${h.mat === 'jun' ? 0.5 : 0.88}"${bl(1)} transform="rotate(-30 ${h.hl[0]} ${h.hl[1]})"/>
${h.mat === 'yaltiroq' || jele ? `<circle cx="${h.hl[0] - 16}" cy="${h.hl[1] + 14}" r="3" fill="#fff" opacity=".8"/>` : ''}${overSvg(u, h, p, lite)}`;
  const foot = (x, cls) => `<g class="${cls}"><ellipse cx="${x}" cy="${h.feet.y}" rx="16" ry="10" fill="${mix(p.c, p.lo, 0.45)}"/><ellipse cx="${x - 3}" cy="${h.feet.y - 3}" rx="8" ry="3.6" fill="${p.hi}" opacity=".55"/></g>`;
  const feet = h.feet ? foot(100 - h.feet.dx, 'ft-l') + foot(100 + h.feet.dx, 'ft-r') : '';
  let hands = '';
  if (h.hands) {
    const hy = h.hands.y, dx = h.hands.dx, up = m.hands === 'up', chin = m.hands === 'chin';
    const hand = (x, y, sh) => `${sh && !lite ? `<ellipse cx="${x - 1}" cy="${y + 4}" rx="12" ry="11" fill="${p.lo}" opacity=".45" filter="url(#${u}f3)"/>` : ''}<ellipse cx="${x}" cy="${y}" rx="11.5" ry="12.5" fill="url(#${u}b)"/><ellipse cx="${x}" cy="${y}" rx="11.5" ry="12.5" fill="${p.hi}" opacity=".28"/><ellipse cx="${x - 3}" cy="${y - 5}" rx="4.5" ry="2.6" fill="#fff" opacity=".7"/>`;
    hands = `<g class="hd-l">${hand(100 - dx - (up ? 4 : 0), hy - (up ? 40 : 0))}</g><g class="hd-r">${chin ? hand(100 + 20, h.my + 10, 1) : hand(100 + dx + (up ? 4 : 0), hy - (up ? 40 : 0))}</g>`;
  }
  const cheeks = `<ellipse cx="${100 - E.dx - E.rx * 0.9}" cy="${E.y + E.ry + 5}" rx="9" ry="5.5" fill="#ff5d8f" opacity="${m.mouth === 'open' ? 0.5 : 0.3}"${bl(3)}/><ellipse cx="${100 + E.dx + E.rx * 0.9}" cy="${E.y + E.ry + 5}" rx="9" ry="5.5" fill="#ff5d8f" opacity="${m.mouth === 'open' ? 0.5 : 0.3}"${bl(3)}/>`;
  const face = `${cheeks}${eyeSvg(u, 'L', 100 - E.dx, E.y, E.rx, E.ry, m, p, lite)}${eyeSvg(u, 'R', 100 + E.dx, E.y, E.rx, E.ry, m, p, lite)}
${browSvg('L', 100 - E.dx, E.y - E.ry - 7, m.brow, p)}${browSvg('R', 100 + E.dx, E.y - E.ry - 7, m.brow, p)}${mouthSvg(u, 100 + (m.mouth === 'side' ? 3 : 0), h.my, m.mouth, p, talk)}`;
  const zz = m.zz ? `<g fill="${p.deep}" font-family="Nunito,sans-serif" font-weight="900" opacity=".7"><text class="z1" x="150" y="70" font-size="13">z</text><text class="z2" x="162" y="54" font-size="16">z</text><text class="z3" x="176" y="36" font-size="20">Z</text></g>` : '';
  return `${defs}<ellipse class="h-sh" cx="100" cy="206" rx="${h.k === 'ortiqvoy' ? 80 : 56}" ry="8" fill="#1b1140" opacity=".2"${bl(3)}/>
<g class="h-all">${feet}${body}${face}${hands}${zz}</g>`;
}
function hero(o) {
  return `<svg class="hero mv-${o.mv || 'turadi'} ${o.cls || ''}" viewBox="0 0 200 220" style="--d:${(-(UID % 7) * 0.6).toFixed(1)}s" role="img" aria-label="${HEROES[o.k].nom}">${heroInner(o)}</svg>`;
}

/* ===== Ustoz roboti: CoddyCamp rasmiy maskoti =====
   Shakllar brend qollanmasidagi old korinishdan olchab olingan: qol konturlari asl rasmdan, yeng qalinligi, sviter, oyoq va bosh olchamlari ham.
   Ranglar qollanmadan: Gold E7CA66, Blue 0D2137, Coral FF4F28, Beige E7E6BE. Nisbatlar ozgartirilmagan. */
const RPOSES = { salom: 'salom beradi', turadi: 'turadi', korsatadi: "ko'rsatadi", oylaydi: "o'ylaydi", tushuntiradi: 'tushuntiradi', quvonadi: 'quvonadi' };
const RYUZ = { oddiy: 'oddiy', xursand: 'xursand', hayron: 'hayron', oylaydi: "o'ylaydi", koz: "ko'z qisadi", savol: 'savol', son: 'sanoq' };
const MK_QOL = { ochiq: 'M1.9 -37.9C2.6 -37.5 3.7 -37.9 4.2 -35.5C4.8 -33.1 4.9 -25.3 5.4 -23.3C5.9 -21.4 6.5 -23.2 7.2 -23.8C7.8 -24.4 8.5 -26.2 9.4 -26.9C10.4 -27.5 11.9 -27.8 12.9 -27.6C13.9 -27.3 15.1 -26.1 15.6 -25.3C16.1 -24.4 16.3 -24.2 15.7 -22.4C15.2 -20.6 13.2 -17.5 12.4 -14.5C11.6 -11.4 15.1 -6.9 11.0 -4.1C6.9 -1.3 -7.5 2.5 -12.4 2.6C-17.2 2.7 -16.8 -1.7 -18.1 -3.5C-19.4 -5.3 -18.4 -5.6 -20.1 -8.3C-21.7 -11.0 -26.5 -17.4 -27.9 -19.8C-29.4 -22.1 -28.7 -21.5 -28.6 -22.2C-28.4 -23.0 -27.7 -23.9 -26.9 -24.4C-26.1 -24.8 -24.7 -25.1 -23.8 -24.9C-22.9 -24.7 -21.8 -23.6 -21.3 -23.0C-20.9 -22.5 -21.8 -22.7 -21.1 -21.7C-20.4 -20.7 -18.0 -17.9 -16.9 -17.1C-15.9 -16.4 -15.3 -16.4 -14.9 -17.1C-14.5 -17.8 -14.0 -19.1 -14.5 -21.2C-14.9 -23.4 -17.2 -27.8 -17.6 -29.8C-17.9 -31.8 -17.6 -32.5 -16.7 -33.2C-15.9 -33.9 -13.7 -34.3 -12.5 -34.0C-11.3 -33.6 -10.5 -32.6 -9.5 -31.1C-8.4 -29.7 -6.9 -26.3 -6.1 -25.2C-5.3 -24.0 -5.3 -24.2 -4.9 -24.1C-4.4 -24.0 -3.9 -22.6 -3.6 -24.5C-3.3 -26.3 -3.7 -33.2 -3.1 -35.4C-2.6 -37.7 -1.1 -37.3 -0.3 -37.7C0.6 -38.2 1.1 -38.3 1.9 -37.9Z', yopiq: 'M-9.3 0.4C-11.9 0.3 -10.7 -3.0 -11.0 -4.3C-11.2 -5.5 -11.4 -2.5 -10.9 -7.0C-10.3 -11.4 -8.6 -26.4 -7.8 -30.9C-6.9 -35.3 -6.7 -33.1 -6.0 -33.6C-5.4 -34.1 -4.7 -33.4 -3.9 -34.0C-3.0 -34.5 -2.2 -36.5 -1.0 -36.9C0.1 -37.2 2.1 -36.8 3.0 -36.2C3.9 -35.6 4.3 -35.2 4.4 -33.0C4.4 -30.8 3.2 -25.3 3.2 -23.2C3.3 -21.1 4.0 -20.7 4.4 -20.3C4.9 -19.9 5.5 -20.1 6.1 -20.7C6.7 -21.4 7.3 -23.4 8.0 -24.3C8.7 -25.1 9.4 -25.7 10.3 -25.9C11.2 -26.1 12.5 -25.9 13.4 -25.4C14.2 -24.8 15.3 -25.9 15.2 -22.4C15.1 -18.9 13.3 -7.5 12.8 -4.3C12.2 -1.0 13.2 -3.2 11.8 -3.0C10.4 -2.8 7.8 -3.8 4.3 -3.2C0.8 -2.7 -6.8 0.6 -9.3 0.4Z' };
function robot(o) {
  const u = 'r' + ++UID + '_', pose = o.pose || 'turadi', lite = !!o.lite, mv = o.mv || 'turadi';
  const yuz = o.yuz || { quvonadi: 'xursand', oylaydi: 'oylaydi' }[pose] || 'oddiy';
  const talk = pose === 'tushuntiradi' || mv === 'gapiradi';
  const bl = (n) => (lite ? '' : ` filter="url(#${u}f${n})"`);
  const W = '#f1f1ee';
  let nq = 0;
  /* qol: asl rasmdan olingan kontur; (0,0) — bilak, barmoqlar tepaga. oyna = -1 bolsa kozgudagi aksi */
  const hand = (w, rot, kind, oyna, cls) => {
    const id = u + 'q' + ++nq;
    const shape = kind === 'korsat'
      ? `<rect x="-5.2" y="-37" width="10.4" height="26" rx="5.2" fill="url(#${u}kq)"/><path d="M-11 0C-13 -8 -12 -17 -5 -19.5C4 -22 12 -18 12.5 -9C13 -4 12 0 11 1Z" fill="url(#${u}kq)"/><ellipse cx="7" cy="-12" rx="5" ry="6.5" fill="#fff" opacity=".22"/>`
      : `<clipPath id="${id}"><path d="${MK_QOL[kind]}"/></clipPath><path d="${MK_QOL[kind]}" fill="url(#${u}kq)"/>${lite ? '' : `<g clip-path="url(#${id})"><path d="${MK_QOL[kind]}" fill="none" stroke="#9f9d86" stroke-width="6" opacity=".4" filter="url(#${u}f3)" transform="translate(-2.5 -3)"/></g>`}`;
    return `<g transform="translate(${w[0]} ${w[1]})"><g class="${cls || ''}"><g transform="rotate(${rot}) scale(${oyna || 1} 1)"><circle cx="0" cy="3" r="11.6" fill="url(#${u}kq)"/><g transform="translate(0 3.4)">${shape}</g></g></g></g>`;
  };
  /* yeng: yelkadan bilakkacha yogon naycha (asl olchov: radiusi 13.5, uzunligi 41–46) */
  const tubeD = (a, b, r1, r2) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, f = (c, r, s) => (c[0] + nx * r * s).toFixed(1) + ' ' + (c[1] + ny * r * s).toFixed(1); return `M${f(a, r1, 1)}A${r1} ${r1} 0 1 1 ${f(a, r1, -1)}L${f(b, r2, -1)}L${f(b, r2, 1)}Z`; };
  const sleeve = (d, cuff) => { const id = u + 'y' + ++nq; return `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="url(#${u}n2)"/>${lite ? '' : `<g clip-path="url(#${id})"><path d="${d}" fill="none" stroke="#0a1322" stroke-width="8" opacity=".38" filter="url(#${u}f3)" transform="translate(-3 -4)"/></g>`}${cuff ? `<path d="M${cuff[0]}L${cuff[1]}" stroke="#0a1220" stroke-width="2" stroke-linecap="round" opacity=".5"/>` : ''}`; };
  const arm = (s, e, w, rot, kind, oyna, cls, ac) => {
    const last = e || s, dx = w[0] - last[0], dy = w[1] - last[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    const cuff = [(w[0] + nx * 13.2).toFixed(1) + ' ' + (w[1] + ny * 13.2).toFixed(1), (w[0] - nx * 13.2).toFixed(1) + ' ' + (w[1] - ny * 13.2).toFixed(1)];
    return `<g class="mk-arm ${ac || ''}" style="transform-origin:${s[0]}px ${s[1]}px">` + hand(w, rot, kind, oyna, cls) + (e ? sleeve(tubeD(s, e, 13.8, 13.6)) + sleeve(tubeD(e, w, 13.6, 13.3), cuff) : sleeve(tubeD(s, w, 13.8, 13.3), cuff)) + '</g>';
  };
  const dR = arm([84, 128], null, [69.6, 168], -173.5, 'yopiq', -1, '', 'a-L'), dL = arm([176, 128], null, [190.4, 168], 173.5, 'yopiq', 1, '', 'a-R');
  let back = dR + dL, front = '', gx = 0, gy = 0;
  if (pose === 'salom') back = arm([93, 129], null, [50, 113.7], -33.6, 'ochiq', 1, 'wave', 'a-L a-wave') + dL;
  if (pose === 'korsatadi') { back = dR + arm([176, 128], null, [215, 117], 78, 'korsat', 1, '', 'a-R a-point'); gx = 5; }
  if (pose === 'oylaydi') { back = dR; front = arm([176, 129], [196, 152], [172, 127], -38, 'yopiq', -1, '', 'a-R a-think'); }
  if (pose === 'tushuntiradi') back = dR + arm([176, 128], null, [216, 134], 62, 'ochiq', -1, 'cheer', 'a-R a-gest');
  if (pose === 'quvonadi') back = arm([92, 127], null, [52, 102], -28, 'ochiq', 1, 'cheer', 'a-L a-up') + arm([168, 127], null, [208, 102], 28, 'ochiq', -1, 'cheer', 'a-R a-up');
  /* yuz — ekran: oq shakllar */
  const E = (cx, r) => `<circle cx="${cx}" cy="58.8" r="${r}" fill="${W}"/>`;
  const arc = (cx) => `<path d="M${cx - 12} 63a12 12 0 0 1 24 0" fill="none" stroke="${W}" stroke-width="7.5" stroke-linecap="round"/>`;
  const smile = `<path d="M116.5 78.2Q130 80.4 143.5 78.2Q141.6 88.6 130 88.6Q118.4 88.6 116.5 78.2Z" fill="${W}"/>`;
  let eyes = E(99.6, 12.8) + E(160.1, 12.8), mouth = smile, fix = '';
  if (yuz === 'xursand') { eyes = arc(99.6) + arc(160.1); mouth = `<path d="M113 76Q130 78.5 147 76Q145 90.5 130 90.5Q115 90.5 113 76Z" fill="${W}"/>`; }
  if (yuz === 'hayron') { eyes = `<g transform="translate(0 -3)">${E(99.6, 13.8)}${E(160.1, 13.8)}</g>`; mouth = `<ellipse cx="130" cy="87.5" rx="9.2" ry="9.8" fill="none" stroke="${W}" stroke-width="5.4"/>`; }
  if (yuz === 'oylaydi') { eyes = `<g transform="translate(-5 -6)">${E(99.6, 11.5)}${E(160.1, 11.5)}</g>`; mouth = `<path d="M124 85h15" fill="none" stroke="${W}" stroke-width="5.5" stroke-linecap="round"/>`; fix = ' data-fix="1"'; }
  if (yuz === 'koz') eyes = E(99.6, 12.8) + `<path d="M148 60h24" fill="none" stroke="${W}" stroke-width="7.5" stroke-linecap="round"/>`;
  if (talk && (yuz === 'oddiy' || yuz === 'koz')) mouth = `<g transform="translate(130 77)"><g class="mo"><path d="M-14 0Q0 2 14 0Q12 12.5 0 12.5Q-12 12.5 -14 0Z" fill="${W}"/></g></g>`;
  let face = `<g class="mk-gaze"${fix || (gx ? ' data-fix="1"' : '')} style="--gx:${gx}px;--gy:${gy}px"><g class="mk-look"><g class="mk-eyes">${eyes}</g>${mouth}</g></g>`;
  if (yuz === 'savol') face = `<text x="130" y="88" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="74" fill="${W}">?</text>`;
  if (yuz === 'son') face = `<text class="tw" x="130" y="88" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="74" fill="${W}">3</text>`;
  const HEAD = 'M106.7 12H153.3C178 12 193.3 26 193.3 49V78C193.3 102 178 114.6 153.3 114.6H106.7C82 114.6 66.7 102 66.7 78V49C66.7 26 82 12 106.7 12Z';
  const SCR = 'M106 18.3H154C175 18.3 187.1 30 187.1 49.5V75C187.1 94.5 175 104.6 154 104.6H106C85 104.6 72.9 94.5 72.9 75V49.5C72.9 30 85 18.3 106 18.3Z';
  const BODY = 'M95 111H165Q171.5 111 171.5 117.5V167Q171.5 175.6 163 176.2Q130 178.4 97 176.2Q88.5 175.6 88.5 167V117.5Q88.5 111 95 111Z';
  const HIP = 'M89.5 170H170.5V205H136.4V203Q136.4 196 129.8 196Q123.2 196 123.2 203V205H89.5Z';
  const leg = (x0, x1, cls, flip) => { const g = flip ? -1 : 1; return `<g class="${cls}"><path d="M${x0} 190H${x1}V219Q${x1} 230 ${x1 - g * 10.5} 230H${x0 + g * 14}Q${x0 - g * 1} 230 ${x0 - g * 1} 214Z" fill="url(#${u}kk)"/></g>`; };
  return `<svg class="robot rp-${pose} mv-${mv} ${o.cls || ''}" viewBox="0 0 260 240" role="img" aria-label="Ustoz roboti"><defs>
<radialGradient id="${u}kq" gradientUnits="userSpaceOnUse" cx="-5" cy="-24" r="34"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#EEEDDC"/><stop offset="1" stop-color="#c2c0a8"/></radialGradient>
<radialGradient id="${u}kk" gradientUnits="userSpaceOnUse" cx="110" cy="182" r="76"><stop offset="0" stop-color="#ffffff"/><stop offset=".42" stop-color="#EEEDDC"/><stop offset="1" stop-color="#bdbba4"/></radialGradient>
<linearGradient id="${u}g" gradientUnits="userSpaceOnUse" x1="78" y1="10" x2="182" y2="118"><stop offset="0" stop-color="#fbeeb8"/><stop offset=".3" stop-color="#E7CA66"/><stop offset=".62" stop-color="#bf9f43"/><stop offset=".82" stop-color="#dcbd5c"/><stop offset="1" stop-color="#8f7126"/></linearGradient>
<linearGradient id="${u}g2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f7e39c"/><stop offset=".45" stop-color="#d9b955"/><stop offset="1" stop-color="#957628"/></linearGradient>
<radialGradient id="${u}n" gradientUnits="userSpaceOnUse" cx="110" cy="126" r="86"><stop offset="0" stop-color="#46546f"/><stop offset=".5" stop-color="#27334a"/><stop offset="1" stop-color="#131b2b"/></radialGradient>
<linearGradient id="${u}n2" gradientUnits="userSpaceOnUse" x1="60" y1="100" x2="210" y2="180"><stop offset="0" stop-color="#3a4760"/><stop offset=".5" stop-color="#293550"/><stop offset="1" stop-color="#1a2437"/></linearGradient>
<radialGradient id="${u}s" gradientUnits="userSpaceOnUse" cx="130" cy="56" r="74"><stop offset="0" stop-color="#17171b"/><stop offset="1" stop-color="#050506"/></radialGradient>
<linearGradient id="${u}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7d58"/><stop offset="1" stop-color="#f1451d"/></linearGradient>
<clipPath id="${u}hc"><path d="${HEAD}"/></clipPath><clipPath id="${u}sc"><path d="${SCR}"/></clipPath><clipPath id="${u}bc"><path d="${BODY}"/></clipPath><clipPath id="${u}lc"><path d="M88 170H172V232H88Z"/></clipPath>
${lite ? '' : `<filter id="${u}f1" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.1"/></filter><filter id="${u}f3" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.6"/></filter><filter id="${u}f7" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6"/></filter>`}</defs>
<ellipse class="r-sh" cx="130" cy="231" rx="58" ry="7" fill="#1b1140" opacity=".26"${bl(3)}/>
<g class="r-all"><g class="mk-legs">
${leg(89.4, 123.2, 'lg-l', 0)}${leg(170.6, 136.4, 'lg-r', 1)}
<path d="${HIP}" fill="url(#${u}kk)"/>
<g clip-path="url(#${u}lc)"><ellipse cx="130" cy="177" rx="42" ry="5" fill="#77755c" opacity=".42"${bl(3)}/>${lite ? '' : `<path d="M129.8 196V232" stroke="#8a8870" stroke-width="14" opacity=".28" filter="url(#${u}f3)"/><path d="M168 186V226" stroke="#8a8870" stroke-width="7" opacity=".3" filter="url(#${u}f3)"/>`}</g>
</g><g class="mk-up"><g class="mk-torso"><path d="${BODY}" fill="url(#${u}n)"/>
<g clip-path="url(#${u}bc)"><ellipse cx="130" cy="112" rx="50" ry="9" fill="#02060c" opacity=".8"${bl(3)}/>${lite ? '' : `<path d="${BODY}" fill="none" stroke="#060c16" stroke-width="8" opacity=".38" filter="url(#${u}f3)" transform="translate(-3 -4)"/><ellipse cx="106" cy="146" rx="13" ry="26" fill="#8494b2" opacity=".2" filter="url(#${u}f7)"/>`}<path d="M88 172Q130 174.2 172 172" fill="none" stroke="#040a14" stroke-width="1.2" opacity=".35"/></g>
<g stroke-linejoin="round"><g fill="#8f270a" stroke="#8f270a" stroke-width="4.6"><path d="M125.2 127.2L138.3 127.2L151.8 141.6L138.3 156.7L125 156.7L135.6 140.7Z"/><path d="M122.2 140.4L135.6 140.4L124.8 155.5L135.6 168.2L135.6 170.2L121.7 170.2L108.2 155.5Z"/></g>
<g fill="url(#${u}c)" stroke="#ff623c" stroke-width="2"><path d="M125.2 127.2L138.3 127.2L151.8 141.6L138.3 156.7L125 156.7L135.6 140.7Z"/><path d="M122.2 140.4L135.6 140.4L124.8 155.5L135.6 168.2L135.6 170.2L121.7 170.2L108.2 155.5Z"/></g><path d="M136.4 141L125.4 156" stroke="#8f270a" stroke-width="1.6" stroke-linecap="round"/><path d="M127 129.2H137.6L148 140.6" fill="none" stroke="#ffb199" stroke-width="1.3" stroke-linecap="round" opacity=".8"/></g>
</g>${back}
<g class="mk-head"><path d="M69 47.6H66Q58 47.6 58 55.6V78.6Q58 86.6 66 86.6H69Z" fill="url(#${u}g2)"/><path d="M62.6 52V82" stroke="#fff3c2" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>
<path d="M191 47.6H194Q202 47.6 202 55.6V78.6Q202 86.6 194 86.6H191Z" fill="url(#${u}g2)"/><path d="M197.4 52V82" stroke="#6f5718" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>
<path d="${HEAD}" fill="url(#${u}g)"/>
<g clip-path="url(#${u}hc)">${lite ? '' : `<path d="${HEAD}" fill="none" stroke="#fff8d6" stroke-width="5" opacity=".9" filter="url(#${u}f1)" transform="translate(1.6 2)"/><path d="${HEAD}" fill="none" stroke="#6b5213" stroke-width="9" opacity=".7" filter="url(#${u}f3)" transform="translate(-2 -3.4)"/>`}<ellipse cx="130" cy="114" rx="26" ry="3.4" fill="#ff6a3c" opacity=".5"${bl(3)}/></g>
<path d="${SCR}" fill="#4f3d0f" transform="translate(130 61.4) scale(1.018 1.024) translate(-130 -61.4)"/>
<path d="${SCR}" fill="url(#${u}s)"/>
<g clip-path="url(#${u}sc)"><ellipse cx="88" cy="27" rx="30" ry="9" fill="#fff" opacity="${lite ? 0.2 : 0.5}"${bl(3)} transform="rotate(-36 88 27)"/><ellipse cx="172" cy="27" rx="26" ry="8" fill="#fff" opacity="${lite ? 0.16 : 0.42}"${bl(3)} transform="rotate(36 172 27)"/><ellipse cx="130" cy="104" rx="50" ry="6" fill="#fff" opacity=".07"${bl(3)}/>${lite || yuz === 'savol' || yuz === 'son' ? '' : `<g opacity=".22" filter="url(#${u}f7)" fill="${W}"><circle cx="99.6" cy="58.8" r="15"/><circle cx="160.1" cy="58.8" r="15"/></g>`}
${face}</g></g>
${front}
</g></g></svg>`;
}

/* ===== Zonalar (qahramon yashaydigan joylar) — 800x450 ===== */
const ZONES = { hovli: 'Hovli', kosmos: 'Kosmos', suv: 'Suv osti', qor: 'Qor' };
function rnd(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }
function world(k, lite) {
  const u = 'z' + ++UID + '_', bl = (n) => (lite ? '' : ` filter="url(#${u}f${n})"`);
  const F = `<filter id="${u}f4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter><filter id="${u}f12" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter><filter id="${u}f30" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>`;
  const cloud = (x, y, s, o) => `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o || 1}"><g fill="url(#${u}cl)"><circle cx="-30" cy="2" r="22"/><circle cx="2" cy="-12" r="31"/><circle cx="36" cy="4" r="20"/><rect x="-52" y="2" width="108" height="22" rx="11"/></g><ellipse cx="-6" cy="-24" rx="14" ry="6" fill="#fff" opacity=".9"/></g>`;
  let s = '';
  if (k === 'hovli') {
    const tree = (x, y, sc) => `<g transform="translate(${x} ${y}) scale(${sc})"><ellipse cx="0" cy="4" rx="46" ry="8" fill="#1d5c3a" opacity=".25"${bl(4)}/><rect x="-9" y="-70" width="18" height="74" rx="8" fill="url(#${u}tr)"/><circle cx="-28" cy="-88" r="34" fill="url(#${u}lf)"/><circle cx="26" cy="-92" r="38" fill="url(#${u}lf)"/><circle cx="0" cy="-122" r="40" fill="url(#${u}lf)"/><ellipse cx="-14" cy="-140" rx="14" ry="7" fill="#fff" opacity=".45" transform="rotate(-25 -14 -140)"/><circle cx="-30" cy="-80" r="7" fill="url(#${u}ap)"/><circle cx="24" cy="-104" r="7" fill="url(#${u}ap)"/><circle cx="34" cy="-74" r="6" fill="url(#${u}ap)"/></g>`;
    const flower = (x, y, c) => `<g transform="translate(${x} ${y})"><path d="M0 0v16" stroke="#3f9d4e" stroke-width="3" stroke-linecap="round"/><g fill="${c}"><circle cx="0" cy="-6" r="4.5"/><circle cx="6" cy="-1" r="4.5"/><circle cx="-6" cy="-1" r="4.5"/><circle cx="3.6" cy="5" r="4.5"/><circle cx="-3.6" cy="5" r="4.5"/></g><circle cx="0" cy="0" r="3.4" fill="#ffd84a"/></g>`;
    s = `<defs>${F}<linearGradient id="${u}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fcbff"/><stop offset=".6" stop-color="#cdeeff"/><stop offset="1" stop-color="#fff1cf"/></linearGradient>
<radialGradient id="${u}sun" cx=".46" cy=".42" r=".62"><stop offset="0" stop-color="#ffffff"/><stop offset=".42" stop-color="#fffbe2"/><stop offset=".78" stop-color="#ffe58a"/><stop offset="1" stop-color="#ffcf45"/></radialGradient><radialGradient id="${u}sg" cx="660" cy="92" r="230" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fffbe0" stop-opacity=".95"/><stop offset=".22" stop-color="#fff4c2" stop-opacity=".55"/><stop offset=".55" stop-color="#ffefb0" stop-opacity=".16"/><stop offset="1" stop-color="#fff2c0" stop-opacity="0"/></radialGradient><radialGradient id="${u}sr" cx="660" cy="92" r="190" gradientUnits="userSpaceOnUse"><stop offset=".2" stop-color="#fff" stop-opacity=".36"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}cl" x1="0" y1="0" x2="0" y2="1"><stop offset=".3" stop-color="#fff"/><stop offset="1" stop-color="#cfe2ff"/></linearGradient>
<linearGradient id="${u}h1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b7ec8f"/><stop offset="1" stop-color="#7fd482"/></linearGradient>
<linearGradient id="${u}h2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fe070"/><stop offset="1" stop-color="#3fae5b"/></linearGradient>
<linearGradient id="${u}pt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9bd"/><stop offset="1" stop-color="#e9c183"/></linearGradient>
<radialGradient id="${u}lf" cx=".35" cy=".28" r=".85"><stop offset="0" stop-color="#c4f48a"/><stop offset=".5" stop-color="#63c95a"/><stop offset="1" stop-color="#2c8f52"/></radialGradient>
<radialGradient id="${u}ap" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffb3a6"/><stop offset=".5" stop-color="#ff4d5e"/><stop offset="1" stop-color="#b3213f"/></radialGradient>
<linearGradient id="${u}tr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c98a55"/><stop offset=".5" stop-color="#a86a3c"/><stop offset="1" stop-color="#7a4627"/></linearGradient></defs>
<rect width="800" height="450" fill="url(#${u}sky)"/><circle cx="660" cy="92" r="230" fill="url(#${u}sg)"/>${lite ? '' : `<g class="quyosh-nur" fill="url(#${u}sr)"><path d="M660 92L850 83L850 101Z"/><path d="M660 92L829 179L820 195Z"/><path d="M660 92L763 252L747 261Z"/><path d="M660 92L669 282L651 282Z"/><path d="M660 92L573 261L557 252Z"/><path d="M660 92L500 195L491 179Z"/><path d="M660 92L470 101L470 83Z"/><path d="M660 92L491 5L500 -11Z"/><path d="M660 92L557 -68L573 -77Z"/><path d="M660 92L651 -98L669 -98Z"/><path d="M660 92L747 -77L763 -68Z"/><path d="M660 92L820 -11L829 5Z"/></g><circle class="quyosh-toj" cx="660" cy="92" r="66" fill="#fff6c8" opacity=".7"${bl(12)}/>`}<circle cx="660" cy="92" r="44" fill="url(#${u}sun)"/><circle cx="660" cy="92" r="43" fill="none" stroke="#fffbe6" stroke-width="2.5" opacity=".7"/><circle cx="566" cy="166" r="11" fill="#fff8d8" opacity=".22"/><circle cx="512" cy="208" r="6" fill="#fff8d8" opacity=".16"/>
<g class="drift">${cloud(150, 86, 1)}${cloud(430, 60, 0.7, 0.9)}</g>${cloud(560, 170, 0.5, 0.75)}
<path d="M0 300C120 230 260 236 400 286C520 240 680 232 800 290V450H0Z" fill="url(#${u}h1)"/><path d="M0 300C120 230 260 236 400 286C520 240 680 232 800 290" fill="none" stroke="#e6ffc4" stroke-width="5" opacity=".7"${bl(4)}/>
${tree(120, 338, 0.9)}${tree(700, 344, 1.05)}
<path d="M0 352C200 318 420 330 800 346V450H0Z" fill="url(#${u}h2)"/><path d="M0 352C200 318 420 330 800 346" fill="none" stroke="#d6ffb0" stroke-width="5" opacity=".6"${bl(4)}/>
<ellipse cx="400" cy="408" rx="470" ry="26" fill="url(#${u}pt)"/><ellipse cx="400" cy="400" rx="440" ry="10" fill="#fff6dc" opacity=".6"${bl(4)}/>
${flower(250, 366, '#ff8fb7')}${flower(290, 372, '#fff')}${flower(560, 368, '#ffb44a')}${flower(610, 362, '#ff8fb7')}${flower(56, 380, '#fff')}`;
  }
  if (k === 'kosmos') {
    const r = rnd(7); let st = '';
    for (let i = 0; i < 70; i++) { const x = r() * 800, y = r() * 330, q = r(); st += `<circle${q > 0.85 ? ' class="tw"' : ''} cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(0.6 + q * 1.9).toFixed(1)}" fill="#fff" opacity="${(0.35 + q * 0.6).toFixed(2)}" style="animation-delay:${(-q * 3).toFixed(1)}s"/>`; }
    const crater = (x, y, w) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w * 0.3}" fill="#5d54a8"/><ellipse cx="${x}" cy="${y + w * 0.1}" rx="${w * 0.9}" ry="${w * 0.22}" fill="#8b82d6"/>`;
    s = `<defs>${F}<radialGradient id="${u}sky" cx=".5" cy="0" r="1.1"><stop offset="0" stop-color="#4a36a8"/><stop offset=".55" stop-color="#22175c"/><stop offset="1" stop-color="#0e0828"/></radialGradient>
<radialGradient id="${u}pl" cx=".34" cy=".28" r=".85"><stop offset="0" stop-color="#ffd6a6"/><stop offset=".45" stop-color="#ff8355"/><stop offset="1" stop-color="#9c2f6b"/></radialGradient>
<radialGradient id="${u}mn" cx=".34" cy=".28" r=".85"><stop offset="0" stop-color="#f4f1ff"/><stop offset="1" stop-color="#8f86cf"/></radialGradient>
<linearGradient id="${u}gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3bdf2"/><stop offset="1" stop-color="#6f65c2"/></linearGradient><clipPath id="${u}pc"><circle cx="640" cy="120" r="64"/></clipPath></defs>
<rect width="800" height="450" fill="url(#${u}sky)"/><ellipse cx="250" cy="150" rx="260" ry="80" fill="#8a5cff" opacity=".22"${bl(30)}/><ellipse cx="600" cy="250" rx="200" ry="60" fill="#ff5fa8" opacity=".16"${bl(30)}/>${st}
<ellipse cx="640" cy="120" rx="104" ry="22" fill="none" stroke="#ffe3a6" stroke-width="9" opacity=".8" transform="rotate(-16 640 120)"/><circle cx="640" cy="120" r="64" fill="url(#${u}pl)"/>
<g clip-path="url(#${u}pc)"><ellipse cx="630" cy="96" rx="80" ry="9" fill="#ffd9a8" opacity=".5"/><ellipse cx="650" cy="138" rx="80" ry="11" fill="#c2456f" opacity=".45"/><circle cx="640" cy="120" r="64" fill="none" stroke="#3a1352" stroke-width="26" opacity=".5"${bl(12)} transform="translate(-10 -12)"/></g>
<ellipse cx="618" cy="92" rx="18" ry="8" fill="#fff" opacity=".55" transform="rotate(-28 618 92)"/>
<circle cx="140" cy="96" r="24" fill="url(#${u}mn)"/><circle cx="132" cy="90" r="5" fill="#8f86cf" opacity=".6"/><circle cx="148" cy="104" r="3.4" fill="#8f86cf" opacity=".6"/>
<g class="fly"><g transform="translate(300 120) rotate(38)"><path d="M0 -22C10 -12 10 8 8 18H-8C-10 8 -10 -12 0 -22Z" fill="#f4f1ff"/><circle cx="0" cy="-4" r="4.5" fill="#3fa2ff"/><path d="M-8 12L-15 22H-8Z" fill="#f0531c"/><path d="M8 12L15 22H8Z" fill="#f0531c"/><path d="M-5 19Q0 34 5 19Z" fill="#ffc12e"/></g></g>
<path d="M0 372C160 344 330 350 470 366C600 350 720 352 800 364V450H0Z" fill="url(#${u}gr)"/><path d="M0 372C160 344 330 350 470 366C600 350 720 352 800 364" fill="none" stroke="#f1eeff" stroke-width="5" opacity=".7"${bl(4)}/>
${crater(120, 410, 44)}${crater(640, 398, 30)}${crater(330, 432, 26)}${crater(520, 424, 18)}`;
  }
  if (k === 'suv') {
    const bub = (x, y, r2, d) => `<g class="bub" style="animation-delay:${d}s"><circle cx="${x}" cy="${y}" r="${r2}" fill="#fff" opacity=".16"/><circle cx="${x}" cy="${y}" r="${r2}" fill="none" stroke="#fff" stroke-width="1.6" opacity=".6"/><circle cx="${x - r2 * 0.35}" cy="${y - r2 * 0.35}" r="${r2 * 0.22}" fill="#fff" opacity=".9"/></g>`;
    const weed = (x, hgt, c, d) => `<g class="weed" style="transform-origin:${x}px 400px;animation-delay:${d}s"><path d="M${x} 400C${x - 20} ${400 - hgt * 0.33} ${x + 22} ${400 - hgt * 0.66} ${x} ${400 - hgt}" fill="none" stroke="${c}" stroke-width="13" stroke-linecap="round"/><path d="M${x - 3} 398C${x - 22} ${400 - hgt * 0.33} ${x + 18} ${400 - hgt * 0.66} ${x - 3} ${404 - hgt}" fill="none" stroke="#d2ffd8" stroke-width="3" stroke-linecap="round" opacity=".5"/></g>`;
    const fish = (x, y, c1, c2, sc, cls) => `<g class="${cls}"><g transform="translate(${x} ${y}) scale(${sc})"><path d="M-22 0L-40 -13V13Z" fill="${c2}"/><ellipse cx="0" cy="0" rx="26" ry="16" fill="${c1}"/><ellipse cx="-2" cy="6" rx="22" ry="8" fill="${c2}" opacity=".55"/><ellipse cx="2" cy="-7" rx="14" ry="4" fill="#fff" opacity=".5"/><circle cx="12" cy="-3" r="5.5" fill="#fff"/><circle cx="13.5" cy="-3" r="3" fill="#17131f"/><circle cx="12.5" cy="-4.2" r="1.1" fill="#fff"/></g></g>`;
    s = `<defs>${F}<linearGradient id="${u}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ce9ff"/><stop offset=".5" stop-color="#2fa9e6"/><stop offset="1" stop-color="#0f5aa8"/></linearGradient>
<linearGradient id="${u}sd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0c4"/><stop offset="1" stop-color="#e8b96c"/></linearGradient>
<radialGradient id="${u}co" cx=".35" cy=".25" r=".9"><stop offset="0" stop-color="#ffc2d6"/><stop offset=".5" stop-color="#ff6f9d"/><stop offset="1" stop-color="#b83274"/></radialGradient></defs>
<rect width="800" height="450" fill="url(#${u}sky)"/>
<g opacity=".5"${bl(12)}><path d="M120 -10L60 380H170L210 -10Z" fill="#fff" opacity=".22"/><path d="M360 -10L330 380H470L450 -10Z" fill="#fff" opacity=".18"/><path d="M620 -10L640 380H740L700 -10Z" fill="#fff" opacity=".2"/></g>
${fish(600, 130, '#ffb02e', '#f0531c', 1, 'swim')}${fish(180, 210, '#b79bff', '#6b4eff', 0.7, 'swim2')}
${weed(70, 150, '#2fbf7a', 0)}${weed(108, 100, '#48d68e', -1)}${weed(730, 170, '#2fbf7a', -0.6)}${weed(690, 110, '#48d68e', -1.6)}
<g transform="translate(600 392)"><rect x="-10" y="-70" width="20" height="74" rx="10" fill="url(#${u}co)"/><rect x="-44" y="-44" width="18" height="48" rx="9" fill="url(#${u}co)"/><rect x="26" y="-56" width="18" height="60" rx="9" fill="url(#${u}co)"/><circle cx="0" cy="-74" r="14" fill="url(#${u}co)"/><circle cx="-35" cy="-48" r="12" fill="url(#${u}co)"/><circle cx="35" cy="-60" r="12" fill="url(#${u}co)"/><circle cx="-4" cy="-80" r="3.5" fill="#fff" opacity=".7"/></g>
<path d="M0 378C170 356 300 368 430 380C580 362 700 364 800 374V450H0Z" fill="url(#${u}sd)"/><path d="M0 378C170 356 300 368 430 380C580 362 700 364 800 374" fill="none" stroke="#fffbe8" stroke-width="5" opacity=".8"${bl(4)}/>
<g transform="translate(250 420)"><path d="M0 -13L4 -4L13 -4L6 2L9 12L0 6L-9 12L-6 2L-13 -4L-4 -4Z" fill="#ff8a5c" stroke="#ff8a5c" stroke-width="5" stroke-linejoin="round"/><circle cx="-2" cy="-2" r="2" fill="#fff" opacity=".6"/></g>
<ellipse cx="470" cy="428" rx="13" ry="8" fill="#fff" opacity=".85"/><ellipse cx="468" cy="426" rx="6" ry="3" fill="#ffd9e6"/>
${bub(140, 300, 9, 0)}${bub(160, 250, 5, -1.2)}${bub(520, 320, 7, -2)}${bub(700, 260, 10, -0.6)}${bub(380, 200, 5, -2.6)}`;
  }
  if (k === 'qor') {
    const pine = (x, y, sc) => `<g transform="translate(${x} ${y}) scale(${sc})"><ellipse cx="0" cy="4" rx="40" ry="7" fill="#5d6fb8" opacity=".22"${bl(4)}/><rect x="-7" y="-20" width="14" height="24" rx="5" fill="#9a6a45"/><path d="M0 -150L44 -84Q0 -70 -44 -84Z" fill="url(#${u}pn)"/><path d="M0 -112L54 -46Q0 -30 -54 -46Z" fill="url(#${u}pn)"/><path d="M0 -72L62 -12Q0 6 -62 -12Z" fill="url(#${u}pn)"/><path d="M0 -150L20 -118Q4 -126 -6 -116Q-12 -124 -20 -118Z" fill="#fff"/><path d="M-30 -66Q-14 -78 0 -70Q16 -80 30 -66Q14 -60 0 -62Q-16 -58 -30 -66Z" fill="#fff"/><path d="M-38 -30Q-18 -42 0 -34Q20 -44 38 -30Q18 -22 0 -26Q-20 -20 -38 -30Z" fill="#fff"/></g>`;
    const r = rnd(11); let sn = '';
    for (let i = 0; i < 38; i++) { const x = r() * 800, y = r() * 430, q = r(); sn += `<circle class="snow" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(1.6 + q * 2.6).toFixed(1)}" fill="#fff" opacity="${(0.6 + q * 0.4).toFixed(2)}" style="animation-delay:${(-q * 6).toFixed(1)}s;animation-duration:${(5 + q * 5).toFixed(1)}s"/>`; }
    s = `<defs>${F}<linearGradient id="${u}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9c8ff"/><stop offset=".55" stop-color="#ecdcff"/><stop offset="1" stop-color="#ffe6ee"/></linearGradient>
<linearGradient id="${u}h1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#c9d6ff"/></linearGradient>
<linearGradient id="${u}h2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#dfe7ff"/></linearGradient>
<linearGradient id="${u}pn" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5fd0a4"/><stop offset=".6" stop-color="#2f9f86"/><stop offset="1" stop-color="#1f6f78"/></linearGradient>
<radialGradient id="${u}sb" cx=".34" cy=".26" r=".9"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#f1f4ff"/><stop offset="1" stop-color="#b9c6f2"/></radialGradient></defs>
<rect width="800" height="450" fill="url(#${u}sky)"/><circle cx="150" cy="100" r="80" fill="#fff" opacity=".6"${bl(12)}/><circle cx="150" cy="100" r="38" fill="#fffdf2"/>
<path d="M0 310C130 220 250 250 380 300C500 230 660 226 800 296V450H0Z" fill="url(#${u}h1)"/>
${pine(110, 330, 0.8)}${pine(190, 344, 1.05)}${pine(690, 340, 1.1)}
<path d="M0 360C220 326 440 340 800 352V450H0Z" fill="url(#${u}h2)"/><ellipse cx="400" cy="412" rx="470" ry="22" fill="#d4e0ff" opacity=".7"/><ellipse cx="400" cy="404" rx="430" ry="9" fill="#fff" opacity=".8"${bl(4)}/>
<g transform="translate(590 350)"><ellipse cx="0" cy="34" rx="40" ry="7" fill="#5d6fb8" opacity=".22"${bl(4)}/><circle cx="0" cy="8" r="28" fill="url(#${u}sb)"/><circle cx="0" cy="-32" r="20" fill="url(#${u}sb)"/><circle cx="-7" cy="-36" r="2.8" fill="#17131f"/><circle cx="7" cy="-36" r="2.8" fill="#17131f"/><path d="M0 -31L16 -27L0 -25Z" fill="#ff8a3d"/><rect x="-14" y="-56" width="28" height="9" rx="3" fill="#6b4eff"/><rect x="-9" y="-72" width="18" height="18" rx="4" fill="#6b4eff"/><path d="M-18 -16Q0 -8 18 -16" fill="none" stroke="#f0531c" stroke-width="7" stroke-linecap="round"/></g>
${sn}`;
  }
  return `<svg class="world" viewBox="0 0 800 450" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${s}</svg>`;
}

export { hero, robot, world, HEROES, MOODS, MOVES, RPOSES, RYUZ, ZONES };
