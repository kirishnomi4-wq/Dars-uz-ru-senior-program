// LMS sinov sahifasi: CRM darsni qanday ochsa — shunday (komponent + liveToken). Faqat lokal sinov uchun.
//   /lms/sinov/index.html?t=<liveToken>   — ustoz yoki o'quvchi (token roli); &d=<dars-papkasi> — boshqa dars
//   /lms/sinov/index.html?preview=1       — CRM ko'rigi (visitMode: preview); &crm=1 — CRM sahifasi uslubi bilan
// Yig'ma lokal server bilan: JR_API=http://127.0.0.1:3101 node new-junior/lms/yig.mjs
import React from 'react'
import { createRoot } from 'react-dom/client'
// &d=<dars-papkasi> — qaysi dars (26.11; standart 001-tanishuv): lms/chiqish/junior-<d>.jsx
const DARSLAR = import.meta.glob('../chiqish/junior-*.jsx')

const q = new URLSearchParams(location.search)
// ?crm=1 — CRM sahifasiga o'xshatish: sahifa oq, body/html uslublari CRM'niki ustun (18.11: CRM ko'rigida fon oq, dars tepaga yopishgan edi)
if (q.get('crm')) { const st = document.createElement('style'); st.textContent = 'html,body{background:#fff!important;display:block!important;height:auto!important;min-height:0!important;overflow:auto!important;place-items:normal!important}'; document.head.appendChild(st) }
const props = q.get('preview') ? { visitMode: 'preview', previewRunId: 'sinov-preview-0000001' } : { liveToken: q.get('t') || null }
const yuk = DARSLAR['../chiqish/junior-' + (q.get('d') || '001-tanishuv') + '.jsx']
if (!yuk) document.getElementById('root').textContent = 'Dars topilmadi: ' + q.get('d')
else yuk().then((m) => { const Dars = m.default; createRoot(document.getElementById('root')).render(<Dars {...props} />) })
