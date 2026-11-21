// Ustozning tayyorgarlik varag'i (KONSEPSIYA 11-bo'lim, 19-qaror): darsdan oldin o'qiladi, proyektorga chiqmaydi, chop etsa bo'ladi.
// Matn alohida yozilmaydi — dars manbasidan (manba/001-tanishuv.md) o'zi yig'iladi: manba o'zgarsa, varaq ham o'zgaradi.
// Manzil: ?rol=varaq#/dars/1 (dars eshigida havola bor).
import MANBA from '../../manba/001-tanishuv.md?raw'
import './dars.css'

// «**qalin**» va «`kod`» belgilarini oddiy matnga aylantiradi (qalin — qalin bo'lib qoladi)
function Satr({ matn }) {
  return matn.replace(/`([^`]*)`/g, '$1').split(/\*\*(.+?)\*\*/).map((b, i) => (i % 2 ? <b key={i}>{b}</b> : b))
}

const bolimlar = (md) => md.split(/^## /m).slice(1).map((q) => {
  const [sarlavha, ...qator] = q.split('\n')
  return { sarlavha: sarlavha.trim(), matn: qator.join('\n').split(/^---$/m)[0] }
})

// «- **Nom:** qiymat» qatorlari va ularning ichidagi «  1. …» qatorlari
function maydonlar(matn) {
  const m = {}
  let joriy = null
  for (const qator of matn.split('\n')) {
    const t = qator.match(/^- \*\*(.+?):\*\*\s?(.*)$/)
    if (t) { joriy = t[1]; m[joriy] = { bosh: t[2].trim(), ichki: [] }; continue }
    if (joriy && /^\s{2,}\S/.test(qator)) m[joriy].ichki.push(qator.trim().replace(/^\d+\.\s+/, ''))
    else if (qator.trim() && !/^\s/.test(qator)) joriy = null
  }
  return m
}
// «0:54–1:01 (7 daqiqa; izoh…)» → «0:54–1:01 · 7 daqiqa» (izoh varaqqa kerak emas)
const vaqtQisqa = (t) => { const m = t.match(/^([\d:]+–[\d:]+) \((\d+) daqiqa/); return m ? `${m[1]} · ${m[2]} daqiqa` : t }
const katta = (t) => t.charAt(0).toUpperCase() + t.slice(1)
const jadval = (matn) => matn.split('\n').filter((q) => q.startsWith('|') && !/^\|[-\s|]+\|$/.test(q)).map((q) => q.split('|').slice(1, -1).map((k) => k.trim()))
const royxat = (matn) => matn.split('\n').filter((q) => /^\s*(-|\d+\.)\s/.test(q)).map((q) => q.replace(/^\s*(-|\d+\.)\s+/, ''))

function Sahna({ b }) {
  const [, raqam, nom] = b.sarlavha.match(/^(\d+) · (.+)$/)
  const f = maydonlar(b.matn)
  const qism = (nomi, ichi, cls = '') => ichi && <div className={'d1v-qism ' + cls}><h4>{nomi}</h4>{ichi}</div>
  const ekran = f['Qadamlar']?.ichki.length
    ? <ol>{f['Qadamlar'].ichki.map((x, i) => <li key={i}><Satr matn={x} /></li>)}</ol>
    : f['Sahna'] && <p><Satr matn={f['Sahna'].bosh} /></p>
  return (
    <section className="d1v-sahna">
      <header>
        <em>{raqam}</em>
        <h3>{nom}</h3>
        {f['Vaqt'] && <span className="d1v-vaqt">{vaqtQisqa(f['Vaqt'].bosh)}</span>}
      </header>
      {qism('Ayting', f['Tayanch gaplar'] && <ol className="d1v-gaplar">{f['Tayanch gaplar'].ichki.map((x, i) => <li key={i}><Satr matn={x} /></li>)}</ol>, 'asosiy')}
      {qism("O'z so'zingiz bilan", f["O'z so'zi bilan"] && <p><Satr matn={f["O'z so'zi bilan"].bosh} /></p>)}
      {qism('Siz qilasiz', f['Ustoz qiladi'] && <p><Satr matn={f['Ustoz qiladi'].bosh} /></p>)}
      {qism("Ekranda («Keyingi» har bosilganda)", ekran)}
      {qism('Bolalar', f['Bola qiladi'] && <p><Satr matn={f['Bola qiladi'].bosh} /></p>)}
      {qism('Bola noutbukida', f['Parta'] && <p><Satr matn={[f['Parta'].bosh, ...f['Parta'].ichki].join(' ')} /></p>, 'kichik')}
      {qism("Bola qiynalsa", f['Xatoda'] && <p><Satr matn={[f['Xatoda'].bosh, ...f['Xatoda'].ichki].join(' ')} /></p>, 'kichik')}
    </section>
  )
}

export default function Varaq() {
  const b = bolimlar(MANBA)
  const top = (nom) => b.find((x) => x.sarlavha.startsWith(nom))
  const nom = (MANBA.match(/^# (.+)$/m) || [])[1] || '1-dars'
  const pasport = maydonlar(top('Pasport')?.matn || '')
  const yol = jadval(top('Bola nima qiladi')?.matn || '').slice(1)
  const sozlar = jadval(top("So'zlar")?.matn || '').slice(1)
  const oldin = royxat(top('Darsdan oldin')?.matn || '')
  const sahnalar = b.filter((x) => /^\d+ · /.test(x.sarlavha))
  return (
    <div className="d1v">
      <header className="d1v-bosh">
        <div>
          <span>Ustoz varag'i · darsdan oldin o'qing · proyektorga chiqmaydi</span>
          <h1>{nom}</h1>
        </div>
        <nav>
          <button type="button" onClick={() => window.print()}>Chop etish</button>
          <a href="./#/dars/1">Dars eshigi</a>
        </nav>
      </header>

      <div className="d1v-ustki">
        <section className="d1v-quti">
          <h2>Bugun bola</h2>
          <p><Satr matn={katta(pasport['Bola nimani tushunadi']?.bosh || '')} /></p>
          <p className="d1v-izoh"><b>Natija:</b> <Satr matn={pasport['Natija (dasturdan)']?.bosh || ''} /> · <b>Vaqt:</b> <Satr matn={pasport['Vaqt']?.bosh || ''} /></p>
          {sozlar.length > 0 && (
            <>
              <h2>Uchta yangi so'z</h2>
              <ul className="d1v-sozlar">{sozlar.map((s) => <li key={s[0]}><b>{s[0]}</b> — {s[1]}</li>)}</ul>
            </>
          )}
        </section>
        {oldin.length > 0 && (
          <section className="d1v-quti">
            <h2>Darsdan oldin</h2>
            <ul className="d1v-belgi">{oldin.map((x, i) => <li key={i}><Satr matn={x} /></li>)}</ul>
          </section>
        )}
      </div>

      {yol.length > 0 && (
        <section className="d1v-quti d1v-yol">
          <h2>Darsning yo'li</h2>
          <table>
            <thead><tr><th>Daqiqa</th><th>Bola nima qiladi</th><th>Sahna</th></tr></thead>
            <tbody>{yol.map((q) => <tr key={q[0]}><td>{q[0]}</td><td><Satr matn={q[1]} /></td><td>{q[2]}</td></tr>)}</tbody>
          </table>
        </section>
      )}

      <h2 className="d1v-sahnalar-nom">Sahnalar</h2>
      {sahnalar.map((x) => <Sahna key={x.sarlavha} b={x} />)}
      <p className="d1v-oxiri">Varaq dars manbasidan o'zi yig'iladi: <code>new-junior/manba/001-tanishuv.md</code></p>
    </div>
  )
}
