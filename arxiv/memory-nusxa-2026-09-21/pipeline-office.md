---
name: pipeline-office
description: "Pipeline HQ ofis-vizualizatsiya (v2–v13) — rollar ishini jonli ko'rsatadigan sahifa; Windows'da hook qayta sozlanmagan"
metadata: 
  node_type: memory
  type: project
  originSessionId: c0edd3e6-e97f-4f1c-9d67-b34e8de431a5
  modified: 2026-07-23T15:20:27.280Z
---

Eski mashinada qurilgan: `pipeline-office.html` (repo ildizida) — rol-agentlar ishini BINO→QAVAT→XONA ko'rinishida jonli ko'rsatadi; bulut-versiya https://office-deploy.vercel.app (Supabase `office_sync` RPC, alohida loyiha; sir `.claude/supabase/office-cloud.json` gitignored). Arxitektura: `.claude/hooks/pipeline-office-sync.py` hook → `pipeline-live.js` (gitignored) → sahifa merge; `pipeline-state.js` = statik reja.

**Muhim protokol:** fon-agent tugashini hook KO'RMAYDI — bosqichni bosh-agent qo'lda belgilaydi: `office-mark.py done <rol> <Dars.jsx>`. Usiz «birdaniga tayyor / navbatda» yolg'on manzara.

**Hozirgi holat:** Windows-mashinada hook'lar (`python3`, `/home/kali` yo'llari) QAYTA SOZLANMAGAN — ofis ishlatilmoqchi bo'lsa avval hook-yo'llarni Windows'ga moslash kerak. To'liq v2–v13 tafsiloti eski arxivda (`claude_backup.tar.gz` → memory/pipeline-office-v2.md).
