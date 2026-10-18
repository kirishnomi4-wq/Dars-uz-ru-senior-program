const fs=require('fs');
for (const f of process.argv.slice(2)) {
  const src=fs.readFileSync(f,'utf8'); const out={};
  for (const c of ['HW_VARIANT','HW_STEPS']) {
    const m=src.match(new RegExp('^const '+c+' = ([\\s\\S]*?)^(\\];|\\};)','m'));
    out[c]=new Function('return '+m[1]+m[2].slice(0,1))();
  }
  const s=src.indexOf('const HwCard'); const body=src.slice(s,s+1500);
  const intro=(body.match(/<p className="body"[^>]*>\{tr\(\{ uz: (["'])([\s\S]*?)\1, ru:/)||[])[2];
  console.log('== '+f); console.log('intro:',intro);
  out.HW_VARIANT.forEach(v=>console.log('V',v.k,'|',v.t.uz));
  for (const [k,arr] of Object.entries(out.HW_STEPS)) console.log('S',k,'|',arr.map(x=>x.uz).join(' / '));
}
