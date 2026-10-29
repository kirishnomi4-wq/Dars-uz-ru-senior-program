import fs from 'node:fs'; import { execFileSync } from 'node:child_process';
const S = '/home/kali/Desktop/internetLesson/feedback/F-1023-01-learn/crm-yuklash-20261029';
const P = '/home/kali/Desktop/internetLesson';
const reestr = JSON.parse(fs.readFileSync(P+'/LMS_REESTR.json','utf8'));
const crm = JSON.parse(fs.readFileSync(S+'/dump/crm-oldin.json','utf8'));
const csv = fs.readFileSync(P+'/yuklash-20261029-prod/yuklangan.csv','utf8').trim().split('\n').slice(1).map(l=>{const [lesson_id,modul,crm_bolim,fayl,md5,versiya,crm_uz,crm_ru,yuklandi,izoh]=l.split(','); return {lesson_id,modul:+modul,crm_bolim,fayl,md5,versiya,crm_uz,crm_ru,yuklandi,izoh};});
const q = {}; // qid -> row
for (const [m, topics] of Object.entries(crm)) for (const t of topics) for (const r of t.q) q[r.qid] = {...r, m:+m, sid:t.sid, topicUz:t.uz, topicTur:t.tur, topicStatus:t.status};
const xato = [], xarita = [], ishlatilgan = new Set();
for (const row of csv) {
  const d = reestr.darslar[row.lesson_id]; if (!d) { xato.push(`${row.lesson_id}: reestrda yo'q`); continue; }
  if (d.crm.uz!==row.crm_uz || d.crm.ru!==row.crm_ru) xato.push(`${row.lesson_id}: csv crm id ≠ reestr (${row.crm_uz}/${row.crm_ru} vs ${d.crm.uz}/${d.crm.ru})`);
  const ent = {lesson_id: row.lesson_id, m: row.modul, yangi: row.fayl, md5_yangi: row.md5, eski: d.fayl, md5_eski: d.md5};
  for (const lang of ['uz','ru']) {
    const id = d.crm[lang]; const r = q[id]; ishlatilgan.add(id);
    if (!r) { xato.push(`${row.lesson_id} ${lang} #${id}: CRM'da topilmadi`); continue; }
    if (r.lang!==lang) xato.push(`${row.lesson_id} #${id}: til ${r.lang} ≠ ${lang}`);
    if (r.tur!=='lesson-runner') xato.push(`${row.lesson_id} #${id}: tur ${r.tur}`);
    if (r.fayl!==d.fayl) xato.push(`${row.lesson_id} #${id}: CRM fayl «${r.fayl}» ≠ reestr «${d.fayl}»`);
    if (r.m!==row.modul) xato.push(`${row.lesson_id} #${id}: modul ${r.m} ≠ ${row.modul}`);
    if (!r.hash) xato.push(`${row.lesson_id} #${id}: fayl havolasi yo'q`);
    ent[lang] = {qid:id, sid:r.sid, hash:r.hash, status:r.status, tartib:r.tartib, topicUz:r.topicUz, topicStatus:r.topicStatus};
  }
  if (ent.uz && ent.ru && ent.uz.sid!==ent.ru.sid) xato.push(`${row.lesson_id}: uz/ru har xil section (${ent.uz.sid}/${ent.ru.sid})`);
  xarita.push(ent);
}
const ortiqcha = Object.values(q).filter(r=>r.tur==='lesson-runner' && !ishlatilgan.has(r.qid)).map(r=>`#${r.qid} m${r.m} sid${r.sid} ${r.lang} «${r.topicUz}» ${r.fayl} [${r.status}]`);
// CRM fayllarini yuklab olib md5
fs.mkdirSync(S+'/crm-eski',{recursive:true});
const list = xarita.flatMap(e=>['uz','ru'].filter(l=>e[l]&&e[l].hash).map(l=>e[l].hash));
fs.writeFileSync(S+'/crm-eski/hashlar.txt', list.join('\n')+'\n');
execFileSync('sh',['-c',`cd ${S}/crm-eski && xargs -P 8 -I{} sh -c 'test -s {}.jsx || curl -s -f -o {}.jsx https://go.coddycamp.uz/uploads/lessons/lesson_runner/{}.jsx' < hashlar.txt`],{stdio:'inherit'});
let md5ok=0, md5yoq=0;
for (const e of xarita) for (const l of ['uz','ru']) { if(!e[l]||!e[l].hash) continue; const fp=`${S}/crm-eski/${e[l].hash}.jsx`; if(!fs.existsSync(fp)){xato.push(`${e.lesson_id} ${l}: yuklab olinmadi`);md5yoq++;continue;} const h=execFileSync('md5sum',[fp]).toString().split(' ')[0]; e[l].md5_crm=h; if(h===e.md5_eski) md5ok++; else {md5yoq++; xato.push(`${e.lesson_id} ${l} #${e[l].qid}: CRM md5 ${h.slice(0,8)} ≠ reestr ${e.md5_eski.slice(0,8)}`);} }
fs.writeFileSync(S+'/yuklash-xarita.json', JSON.stringify(xarita,null,1));
const statusTopic = {}; for (const e of xarita) { const s=(e.uz||{}).topicStatus; statusTopic[s]=(statusTopic[s]||0)+1; }
const statusQ = {}; for (const e of xarita) for (const l of ['uz','ru']) if(e[l]) statusQ[e[l].status]=(statusQ[e[l].status]||0)+1;
console.log(JSON.stringify({darslar: xarita.length, qatorlar: list.length, md5ok, md5yoq, xato_soni: xato.length, ortiqcha_lesson_runner: ortiqcha.length, topicStatus: statusTopic, qStatus: statusQ},null,1));
console.log('--- XATO ---'); console.log(xato.join('\n')||'(yo\'q)');
console.log('--- ORTIQCHA (reestrda yo\'q lesson-runner qatorlar) ---'); console.log(ortiqcha.join('\n')||'(yo\'q)');
