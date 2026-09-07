// PILOT demo-sahifa: pilot/demo.html — dars + yuqorida token-panel.
//   node pilot/demo-build.mjs   → pilot/demo.html (o'zi-yetarli, bitta fayl)
// Panel: Tokensiz · O'quvchi · Mentor · Buzuq · «Keyin keladi» (2 s) · real token qo'yish maydoni.
// Sinov-JWT'lar SINOV kaliti bilan imzolanadi (real secret ishlatilmaydi).
import { build } from 'esbuild';
import { writeFileSync } from 'node:fs';
import { createHmac } from 'node:crypto';

const ROOT = process.cwd();
const TARGET = ROOT + '/pilot/InternetLesson.liveToken.jsx';
const b64u = (s) => Buffer.from(s).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const now = Math.floor(Date.now() / 1000);
const mk = (claims) => {
  const h = b64u(JSON.stringify({ alg: 'HS256', typ: 'JWT', kid: 'v1' })), p = b64u(JSON.stringify(claims));
  const sig = createHmac('sha256', 'sinov-kalit').update(h + '.' + p).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${h}.${p}.${sig}`;
};
const base = { iss: 'coddycamp-lms', aud: 'dars-platform', iat: now, nbf: now, exp: now + 43200 };
const TOK = {
  student: mk({ sub: '34174', role: 'student', name: 'Sinov O‘quvchi', crm_id: 17226, ...base, jti: 'e3f1c2d4-0000-4000-8000-000000000001' }),
  mentor: mk({ sub: '145', role: 'mentor', name: 'Sinov Mentor', gid: 861, ...base, jti: 'e3f1c2d4-0000-4000-8000-000000000002' }),
  bad: 'abc.def',
};

const res = await build({
  stdin: {
    contents: `
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Lesson from ${JSON.stringify(TARGET)};
const TOK = ${JSON.stringify(TOK)};
const btn = { padding: '6px 12px', borderRadius: 8, border: '1px solid #999', background: '#fff', cursor: 'pointer', fontSize: 13 };
const on = { ...btn, background: '#1F5E3E', color: '#fff', border: '1px solid #1F5E3E' };
function Host() {
  const [tok, setTok] = useState(null);
  const [which, setWhich] = useState('none');
  const [paste, setPaste] = useState('');
  const pick = (k, v) => { setWhich(k); setTok(v); };
  const later = () => { pick('none', null); setTimeout(() => pick('student', TOK.student), 2000); };
  return (
    <>
      <div style={{ position: 'fixed', bottom: 10, right: 10, zIndex: 20000, maxWidth: 640, background: '#FFF7E6', border: '2px solid #E8A33D', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', fontFamily: 'system-ui', fontSize: 13 }}>
        <b>PILOT · liveToken:</b>
        <button style={which === 'none' ? on : btn} onClick={() => pick('none', null)}>Tokensiz</button>
        <button style={which === 'student' ? on : btn} onClick={() => pick('student', TOK.student)}>O‘quvchi</button>
        <button style={which === 'mentor' ? on : btn} onClick={() => pick('mentor', TOK.mentor)}>Mentor</button>
        <button style={which === 'bad' ? on : btn} onClick={() => pick('bad', TOK.bad)}>Buzuq</button>
        <button style={btn} onClick={later}>Keyin keladi (2 s)</button>
        <input value={paste} onChange={(e) => setPaste(e.target.value)} placeholder="Real LMS-tokenni shu yerga qo‘ying…" style={{ flex: 1, minWidth: 220, padding: '6px 8px', borderRadius: 8, border: '1px solid #999', fontFamily: 'monospace', fontSize: 12 }} />
        <button style={which === 'paste' ? on : btn} onClick={() => pick('paste', paste.trim() || null)}>Qo‘llash</button>
      </div>
      <div>
        <Lesson lang="uz" liveToken={tok} />
      </div>
    </>
  );
}
createRoot(document.getElementById('root')).render(<Host />);
`,
    resolveDir: ROOT, sourcefile: 'demo-entry.jsx', loader: 'jsx',
  },
  bundle: true, format: 'iife', jsx: 'automatic', charset: 'utf8', write: false, logLevel: 'silent',
});
const html = `<!doctype html><html lang="uz"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PILOT — liveToken</title></head><body><div id="root"></div>
<script>${res.outputFiles[0].text}<\/script></body></html>`;
writeFileSync(ROOT + '/pilot/demo.html', html, 'utf8');
console.log('pilot/demo.html yozildi —', (Buffer.byteLength(html) / 1024).toFixed(0), 'KB');
