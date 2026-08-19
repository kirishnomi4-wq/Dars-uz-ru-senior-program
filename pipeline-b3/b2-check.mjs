// B2 darvoza-skripti (QOIDA 10 — bosh-agent dasturiy tekshiruvi). node b2-check.mjs <jsx> [--no-build]
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
const f = process.argv[2]; const noBuild = process.argv.includes('--no-build');
const src = readFileSync(f, 'utf8'); const lines = src.split('\n');
const out = []; const R = (k, v, ok) => out.push(`${ok === undefined ? '·' : ok ? '✅' : '🔴'} ${k}: ${v}`);
const seg = new Intl.Segmenter('uz', { granularity: 'grapheme' });
const glen = s => [...seg.segment(s)].length;

R('qatorlar', lines.length, lines.length >= 3000);
const lid = (src.match(/lessonId:\s*['"]([^'"]+)['"]/) || [])[1]; R('lessonId', lid, /-v\d+$/.test(lid || '') && !/v16/.test(lid || ''));

// QUIZ_BANK
const qb = src.match(/const QUIZ_BANK = \[([\s\S]*?)\n\];/);
if (qb) {
  const items = [...qb[1].matchAll(/\{\s*q:\s*(["'])(.*?)\1,\s*opts:\s*\[(.*?)\],\s*correct:\s*(\d)/g)];
  const dist = [0, 0, 0, 0]; let longest = 0; let mutlaq = 0; let ladder = 0; const seq = [];
  const MUT = /\b(faqat|eng|hamma|hammasi|hech|har doim|doim|umuman|barcha|butunlay)\b/i;
  for (const m of items) {
    const c = +m[4]; dist[c]++; seq.push(c);
    const opts = [...m[3].matchAll(/(["'])((?:\\.|(?!\1).)*)\1/g)].map(x => x[2]);
    if (opts.length === 4) {
      const L = opts.map(glen); if (L[c] === Math.max(...L) && L.filter(x => x === L[c]).length === 1) longest++;
      const mono = L.every((v,i)=>i===0||v>=L[i-1]) || L.every((v,i)=>i===0||v<=L[i-1]); if (mono && new Set(L).size > 2) ladder++;
      const mq = opts.filter((o, i) => i !== c && MUT.test(o)).length; if (mq >= 2) mutlaq++;
    }
  }
  R('QUIZ_BANK soni', items.length, items.length === 12);
  R('QUIZ_BANK correct taqsimot', dist.join('/'), dist.every(x => x === 3));
  const canon=[[0,3,2,1],[1,0,2,3],[0,2,1,3]]; let asc=0; for(let i=0;i<seq.length;i+=4){const q=seq.slice(i,i+4); if(q.join()==='0,1,2,3'||q.join()==='3,2,1,0') asc++;}
  R('QUIZ_BANK correct ketma-ketlik', seq.join(',') + (asc?` (o'suvchi/kamayuvchi o'nlik: ${asc})`:''), asc===0);
  R('uzunlik-narvoni (monoton variantlar)', ladder, ladder === 0);
  R('shakl-telli (to\'g\'ri javob eng uzun)', `${longest}/${items.length}`, longest * 2 <= items.length);
  R('mutlaq-so\'zli distraktorlar (§110)', mutlaq, mutlaq <= 3);
} else R('QUIZ_BANK', 'TOPILMADI', false);

const meta = (src.match(/const SCREEN_META = \[([\s\S]*?)\n\];/) || [])[1] || '';
const nMeta = (meta.match(/\{\s*id:/g) || []).length;
const intents = (src.match(/SCREEN_INTENTS = \{([\s\S]*?)\n\};/) || [])[1] || '';
const nInt = (intents.match(/^\s*\d+:/gm) || intents.match(/^\s*s?\d+\s*:/gm) || []).length;
R('SCREEN_META ekranlar', nMeta, nMeta === 16);
R('SCREEN_INTENTS', nInt, nInt === nMeta);
R('predict: soni', (src.match(/predict:\s*\{/g) || []).length, (src.match(/predict:\s*\{/g) || []).length >= 2);
R('previewUrl', (src.match(/previewUrl/g) || []).length, (src.match(/previewUrl/g) || []).length === 0);
R('fixed-qobiq (HtmlCompiler)', src.includes('<HtmlCompiler') ? (/position:\s*'fixed',\s*inset:\s*0,\s*zIndex:\s*\d{4}/.test(src) ? 'bor' : 'YO\'Q') : 'kompilyator yo\'q');
R('p{padding:0} reset-nuqsoni', /\.lesson-root p[^{]*\{[^}]*padding:\s*0/.test(src) ? 'BOR' : 'yo\'q', !/\.lesson-root p[^{]*\{[^}]*padding:\s*0/.test(src));
R('ccProgress', (src.match(/ccProgress/g) || []).length, src.includes('ccProgress'));
R('useLiveSession', src.includes('useLiveSession('), src.includes('useLiveSession('));
R('FLASHCARDS', (src.match(/const FLASHCARDS = \[/g) || []).length === 1);
R('INLINE_KEYS', (src.match(/const INLINE_KEYS = \{([^}]*)\}/) || [])[1]?.trim());
// 19-ov (F-0818-03): ichki testlarning to'g'ri javobi bir xil o'rinda turmasin.
// b2-check QUIZ_BANK taqsimotini o'lchardi, ichki testlar (s3/s5/s7/s11) nazoratsiz qolgan edi —
// PmLesson20 da to'rttasi ham 1-o'rinda chiqdi (doim B bosgan o'quvchi 4/4 oladi).
{
  const ik = (src.match(/const INLINE_KEYS = \{([^}]*)\}/) || [])[1] || '';
  const pos = [...ik.matchAll(/s\d+\s*:\s*(\d+)/g)].map(m => +m[1]);
  const uniq = new Set(pos).size;
  R('ichki-test o\'rin taqsimoti (19-ov)',
    pos.length ? `${pos.join(',')} — ${uniq} xil o\'rin` : 'topilmadi',
    pos.length < 3 || uniq >= 2);
}
// residue
const RES = ['bufet', 'somsa', 'lavash', 'Netflix', 'musiqa', 'jurnal', 'kino', 'hot-dog', 'Spotify', 'kutubxona', 'AvtoStoyanka', 'chipta', 'konsert', 'Amazon', 'Airbnb', 'UZUM', 'stakeholder', 'pitch', 'arxitektura', 'masshtab', 'PRD', 'e\'lon', 'daftar', 'professional', 'skelet'];
const rc = RES.map(w => [w, (src.match(new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length]).filter(x => x[1]);
R('so\'z-sanoq (residue/atama)', rc.map(x => `${x[0]}=${x[1]}`).join(' '));
R('taqiq-so\'z «taxmin qil»', (src.match(/taxmin qil/gi) || []).length, !/taxmin qil/i.test(src));
R('«keyingi darsda»', (src.match(/keyingi darsda/gi) || []).length, !/keyingi darsda/i.test(src));
R('sen-forma (sen/sening/qil!)', (src.match(/\b(sening|senga|seni)\b/gi) || []).length);
R('turnBusy', (src.match(/turnBusy/g) || []).length);
R('kirill harf (ru: tashqarida ehtimol)', (src.match(/[а-яё]/gi) || []).length);
if (!noBuild) {
  try { execSync(`npx esbuild "${f}" --bundle --outfile=/dev/null --loader:.png=dataurl --loader:.jpg=dataurl --loader:.svg=dataurl --loader:.webp=dataurl --loader:.mp3=dataurl --log-level=error`, { stdio: 'pipe' }); R('esbuild', 'OK', true); } catch (e) { R('esbuild', 'FAIL ' + String(e.stderr || e.message).slice(0, 300), false); }
  try { const o = execSync(`node jsx-lint.mjs "${f}"`, { encoding: 'utf8' }); R('lint:jsx', o.trim().split('\n').slice(-1)[0]); } catch (e) { R('lint:jsx', 'FAIL ' + String(e.stdout || e.message).slice(-300), false); }
  try { const o = execSync(`node til-lint.mjs "${f}"`, { encoding: 'utf8' }); R('lint:til', o.trim().split('\n').slice(-6).join(' | ')); } catch (e) { R('lint:til', 'ERR ' + String(e.stdout || e.message).replace(/\x1b\[[0-9;]*m/g, '').trim().split('\n').slice(0, 8).join(' | '), false); }
}
console.log(out.join('\n'));
