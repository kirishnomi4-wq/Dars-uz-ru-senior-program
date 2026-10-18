import{i as e,r as t,t as n}from"./modul11-DpsKOPZS.js";var r=e(t(),1),i=n(),a=`uz`,o=e=>e==null?``:typeof e==`string`||(0,r.isValidElement)(e)?e:e[a]??e.uz??e.ru??``,s=e=>{let[t,n]=(0,r.useState)(()=>typeof window<`u`&&window.matchMedia?window.matchMedia(e).matches:!1);return(0,r.useEffect)(()=>{if(typeof window>`u`||!window.matchMedia)return;let t=window.matchMedia(e),r=()=>n(t.matches);return r(),t.addEventListener?(t.addEventListener(`change`,r),()=>t.removeEventListener(`change`,r)):(t.addListener(r),()=>t.removeListener(r))},[e]),t},c={html:[`<`,`>`,`/`,`"`,`=`,`#`,`-`],css:[`{`,`}`,`:`,`;`,`.`,`#`,`-`],js:[`(`,`)`,`{`,`}`,`;`,`=`,`"`]},l=e=>{try{let t=JSON.parse(localStorage.getItem(e)||`null`);return t&&typeof t==`object`?t:null}catch{return null}},u=(e,t)=>{try{localStorage.setItem(e,JSON.stringify({codes:t,savedAt:Date.now()}))}catch{}},d={bg:`#F6F4EF`,ink:`#0E0E10`,ink2:`#5A5A60`,ink3:`#A7A6A2`,paper:`#FFFFFF`,accent:`#FF4D26`,accent2:`#FF8A3D`,accentSoft:`#FFEDE5`,success:`#0FA968`,successSoft:`#E3F0E8`,warn:`#9A5400`,shadowBase:`58, 53, 48`,line:`#E9E6DF`},f={bg:`#0E1525`,text:`#E7EAF2`,gutter:`#1C2740`,tag:`#FF7755`,attr:`#FFD380`,str:`#7DD181`,comment:`#6B7585`,punct:`#9FB4D8`,num:`#C9A9FF`},p=e=>String(e).replace(/[&<>]/g,e=>e===`&`?`&amp;`:e===`<`?`&lt;`:`&gt;`),m=(e,t)=>t?`<i class="t-`+e+`">`+p(t)+`</i>`:``,h=/[a-zA-Z0-9:_-]/;function g(e){let t=``,n=0,r=e.length;for(;n<r;){let i=e.indexOf(`<`,n);if(i===-1){t+=p(e.slice(n));break}if(t+=p(e.slice(n,i)),e.startsWith(`<!--`,i)){let a=e.indexOf(`-->`,i+4),o=a===-1?r:a+3;t+=m(`comment`,e.slice(i,o)),n=o;continue}if(e[i+1]===`!`){let a=e.indexOf(`>`,i),o=a===-1?r:a+1;t+=m(`comment`,e.slice(i,o)),n=o;continue}let a=e[i+1]===`/`,o=i+(a?2:1),s=o;for(;s<r&&h.test(e[s]);)s++;if(s===o){t+=p(`<`),n=i+1;continue}for(t+=m(`punct`,a?`</`:`<`)+m(`tag`,e.slice(o,s));s<r&&e[s]!==`>`&&e[s]!==`<`;){let n=e[s];if(/\s/.test(n)){t+=p(n),s++;continue}if(n===`=`||n===`/`){t+=m(`punct`,n),s++;continue}if(n===`"`||n===`'`){let i=s+1;for(;i<r&&e[i]!==n;)i++;let a=Math.min(i+1,r);t+=m(`str`,e.slice(s,a)),s=a;continue}let i=s;for(;i<r&&h.test(e[i]);)i++;if(i===s){t+=p(n),s++;continue}t+=m(`attr`,e.slice(s,i)),s=i}e[s]===`>`&&(t+=m(`punct`,`>`),s++),n=s}return t}function ee(e){let t=``,n=0,r=!1,i=!1,a=e.length;for(;n<a;){if(e.startsWith(`/*`,n)){let r=e.indexOf(`*/`,n+2),i=r===-1?a:r+2;t+=m(`comment`,e.slice(n,i)),n=i;continue}let o=e[n];if(o===`{`){t+=m(`punct`,o),r=!0,i=!1,n++;continue}if(o===`}`){t+=m(`punct`,o),r=!1,i=!1,n++;continue}if(o===`;`){t+=m(`punct`,o),i=!1,n++;continue}if(o===`:`&&r){t+=m(`punct`,o),i=!0,n++;continue}let s=n;for(;s<a&&!`{};`.includes(e[s])&&!(e[s]===`:`&&r)&&!e.startsWith(`/*`,s);)s++;let c=e.slice(n,s),l=/^\s*/.exec(c)[0],u=c.slice(l.length);t+=p(l)+m(r?i?`str`:`attr`:`tag`,u),n=s}return t}var te=new Set(`const.let.var.function.return.if.else.for.while.do.break.continue.new.class.extends.typeof.instanceof.null.undefined.true.false.this.import.export.from.async.await.try.catch.finally.throw.switch.case.default.of.in`.split(`.`));function ne(e){let t=``,n=0,r=e.length;for(;n<r;){if(e.startsWith(`//`,n)){let i=e.indexOf(`
`,n);i===-1&&(i=r),t+=m(`comment`,e.slice(n,i)),n=i;continue}if(e.startsWith(`/*`,n)){let i=e.indexOf(`*/`,n+2),a=i===-1?r:i+2;t+=m(`comment`,e.slice(n,a)),n=a;continue}let i=e[n];if(i===`"`||i===`'`||i==="`"){let a=n+1;for(;a<r&&e[a]!==i;)e[a]===`\\`&&a++,a++;t+=m(`str`,e.slice(n,Math.min(a+1,r))),n=Math.min(a+1,r);continue}if(/[A-Za-z_$]/.test(i)){let i=n;for(;i<r&&/[\w$]/.test(e[i]);)i++;let a=e.slice(n,i);t+=te.has(a)?m(`tag`,a):p(a),n=i;continue}if(/[0-9]/.test(i)){let i=n;for(;i<r&&/[\d.]/.test(e[i]);)i++;t+=m(`num`,e.slice(n,i)),n=i;continue}t+=p(i),n++}return t}var re=2e4,ie=(e,t)=>{if(!e)return``;if(e.length>re)return p(e);try{return t===`css`?ee(e):t===`js`?ne(e):g(e)}catch{return p(e)}};function _(e){let t=[],n=0,r=e.length,i=e=>{e&&t.push({t:`text`,raw:e})};for(;n<r;){let a=e.indexOf(`<`,n);if(a===-1){i(e.slice(n));break}if(i(e.slice(n,a)),e.startsWith(`<!--`,a)){let r=e.indexOf(`-->`,a+4);if(r===-1)return null;t.push({t:`comment`,raw:e.slice(a,r+3)}),n=r+3;continue}if(e[a+1]===`!`){let r=e.indexOf(`>`,a);if(r===-1)return null;t.push({t:`doctype`,raw:e.slice(a,r+1)}),n=r+1;continue}let o=a+1,s=null;for(;o<r;){let t=e[o];if(s)t===s&&(s=null);else if(t===`"`||t===`'`)s=t;else if(t===`>`)break;else if(t===`<`)return null;o++}if(o>=r)return null;let c=e.slice(a,o+1),l=/^<\/?\s*([a-zA-Z][a-zA-Z0-9-]*)/.exec(c);if(!l)return null;let u=l[1].toLowerCase(),d=c[1]===`/`,f=/\/\s*>$/.test(c)||O.has(u);t.push({t:d?`close`:f?`self`:`open`,name:u,raw:c}),n=o+1}return t}var ae=e=>e.map(e=>e.t===`text`?`T:`+e.raw.replace(/\s+/g,` `).trim():e.t===`comment`||e.t===`doctype`?e.t+`:`+e.raw.replace(/\s+/g,` `):e.t+`:`+e.name+`:`+e.raw.replace(/\s+/g,` `)).filter(e=>e!==`T:`).join(`|`);function oe(e){if(!e||!e.trim()||/<(pre|textarea)\b/i.test(e))return null;let t=_(e);if(!t)return null;let n=[],r=0;for(let e=0;e<t.length;e++){let i=t[e];if(i.t===`text`){let e=i.raw.replace(/\s+/g,` `).trim();e&&n.push(`  `.repeat(r)+e);continue}if(i.t===`close`){r=Math.max(0,r-1),n.push(`  `.repeat(r)+i.raw);continue}if(i.t===`open`){let a=t[e+1],o=t[e+2];if(a&&o&&a.t===`text`&&o.t===`close`&&o.name===i.name){let t=a.raw.replace(/\s+/g,` `).trim(),s=i.raw+t+o.raw;if(!t.includes(`
`)&&(`  `.repeat(r)+s).length<=100){n.push(`  `.repeat(r)+s),e+=2;continue}}n.push(`  `.repeat(r)+i.raw),r++;continue}n.push(`  `.repeat(r)+i.raw)}let i=n.join(`
`),a=_(i);return!a||ae(a)!==ae(t)?null:i}var se=`m1-01.m1-02.m1-03.m1-04.m1-14.m1-05.m1-06.m1-07.m1-15.m1-08.m1-10.m1-09.m1-11.m1-12.m1-13.m2-01.m2-02.m2-03.m2-04.m2-05.m2-06.m2-07.m2-08.m2-09.m2-10.m2-11.m2-12.m2-13.m2-14.m2-15.m2-16.m3-*.m4-*.m4a-*.m4b-*.m4c-*`.split(`.`),ce={_izoh:"Qaysi darsdan qaysi imkoniyat ochiladi (Q5). Dars kompilyatorga `stage` bermasa — hammasi ochiq (2-Moduldan boshlab).",emmet:`m1-15`,class_id_qisqartma:`m1-06`,css_maslahat:`m1-06`,js_maslahat:`m2-02`},le=[{t:`h1`,dars:`m1-03`,matn:!0,d:{uz:`eng katta sarlavha`,ru:`самый большой заголовок`}},{t:`h2`,dars:`m1-03`,matn:!0,d:{uz:`bo'lim sarlavhasi`,ru:`заголовок раздела`}},{t:`h3`,dars:`m1-03`,matn:!0,d:{uz:`kichik sarlavha`,ru:`малый заголовок`}},{t:`h4`,dars:`m1-03`,matn:!0,d:{uz:`4-daraja sarlavha`,ru:`заголовок 4-го уровня`}},{t:`h5`,dars:`m1-03`,matn:!0,d:{uz:`5-daraja sarlavha`,ru:`заголовок 5-го уровня`}},{t:`h6`,dars:`m1-03`,matn:!0,d:{uz:`eng kichik sarlavha`,ru:`самый маленький заголовок`}},{t:`p`,dars:`m1-03`,matn:!0,d:{uz:`matn xatboshisi`,ru:`абзац текста`}},{t:`strong`,dars:`m1-03`,matn:!0,d:{uz:`qalin matn`,ru:`жирный текст`}},{t:`em`,dars:`m1-03`,matn:!0,d:{uz:`qiya matn`,ru:`наклонный текст`}},{t:`ul`,dars:`m1-03`,d:{uz:`ro'yxat`,ru:`список`}},{t:`ol`,dars:`m1-03`,d:{uz:`raqamli ro'yxat`,ru:`нумерованный список`}},{t:`li`,dars:`m1-03`,matn:!0,d:{uz:`ro'yxat bandi`,ru:`пункт списка`}},{t:`a`,dars:`m1-03`,matn:!0,d:{uz:`havola`,ru:`ссылка`}},{t:`html`,dars:`m1-03`,d:{uz:`butun sahifa`,ru:`вся страница`}},{t:`head`,dars:`m1-03`,d:{uz:`sahifa sozlamalari (ko'rinmaydi)`,ru:`настройки страницы (не видно)`}},{t:`title`,dars:`m1-03`,matn:!0,d:{uz:`varaq nomi`,ru:`название вкладки`}},{t:`body`,dars:`m1-03`,d:{uz:`sahifa tanasi (ko'rinadi)`,ru:`тело страницы (видно)`}},{t:`img`,dars:`m1-04`,void:!0,d:{uz:`rasm`,ru:`картинка`}},{t:`header`,dars:`m1-04`,d:{uz:`sahifa boshi`,ru:`шапка страницы`}},{t:`main`,dars:`m1-04`,d:{uz:`asosiy qism`,ru:`основная часть`}},{t:`footer`,dars:`m1-04`,d:{uz:`sahifa pasti`,ru:`подвал страницы`}},{t:`div`,dars:`m1-04`,d:{uz:`oddiy quti`,ru:`обычный блок`}},{t:`form`,dars:`m1-04`,d:{uz:`forma`,ru:`форма`}},{t:`input`,dars:`m1-04`,void:!0,d:{uz:`yozish maydoni`,ru:`поле ввода`}},{t:`label`,dars:`m1-04`,matn:!0,d:{uz:`maydon yozuvi`,ru:`подпись поля`}},{t:`button`,dars:`m1-04`,matn:!0,d:{uz:`tugma`,ru:`кнопка`}},{t:`style`,dars:`m1-06`,d:{uz:`CSS shu yerda`,ru:`CSS здесь`}},{t:`link`,dars:`m1-06`,void:!0,d:{uz:`CSS faylini ulash`,ru:`подключить CSS`}},{t:`nav`,dars:`m1-08`,d:{uz:`menyu`,ru:`меню`}},{t:`section`,dars:`m1-08`,d:{uz:`bo'lim`,ru:`раздел`}},{t:`span`,dars:`m2-08`,matn:!0,d:{uz:`matn ichidagi bo'lak`,ru:`кусочек внутри текста`}}],ue={a:[{a:`href`,dars:`m1-03`,d:{uz:`qayerga olib boradi`,ru:`куда ведёт`}}],img:[{a:`src`,dars:`m1-04`,d:{uz:`rasm manzili`,ru:`адрес картинки`}},{a:`alt`,dars:`m1-04`,d:{uz:`rasm o'rnidagi matn`,ru:`текст вместо картинки`}}],input:[{a:`type`,dars:`m1-04`,d:{uz:`maydon turi`,ru:`тип поля`},v:[`text`,`email`,`password`,`number`]},{a:`placeholder`,dars:`m1-04`,d:{uz:`xira maslahat`,ru:`подсказка`}},{a:`value`,dars:`m1-04`,d:{uz:`boshlang'ich qiymat`,ru:`начальное значение`}}],"*":[{a:`class`,dars:`m1-06`,d:{uz:`CSS uchun nom`,ru:`имя для CSS`}},{a:`style`,dars:`m1-06`,d:{uz:`CSS shu yerning o'zida`,ru:`CSS прямо здесь`}},{a:`id`,dars:`m1-08`,d:{uz:`yagona nom`,ru:`уникальное имя`}}],link:[{a:`rel`,dars:`m1-06`,d:{uz:`ulash turi`,ru:`тип связи`},v:[`stylesheet`]},{a:`href`,dars:`m1-06`,d:{uz:`fayl manzili`,ru:`адрес файла`}}],html:[{a:`lang`,dars:`m1-15`,d:{uz:`sahifa tili`,ru:`язык страницы`}}]},de=[{p:`color`,dars:`m1-06`,d:{uz:`matn rangi`,ru:`цвет текста`},v:[`red`,`blue`,`green`,`white`,`black`,`#…`]},{p:`background-color`,dars:`m1-06`,d:{uz:`fon rangi`,ru:`цвет фона`},v:[`#…`,`white`,`black`]},{p:`font-size`,dars:`m1-06`,d:{uz:`shrift kattaligi`,ru:`размер шрифта`},v:[`16px`,`24px`,`32px`]},{p:`text-align`,dars:`m1-06`,d:{uz:`matn tekislash`,ru:`выравнивание текста`},v:[`center`,`left`,`right`]},{p:`font-family`,dars:`m1-06`,d:{uz:`shrift`,ru:`шрифт`},v:[`Arial`,`Georgia`,`sans-serif`]},{p:`margin`,dars:`m1-06`,d:{uz:`tashqi bo'shliq`,ru:`внешний отступ`},v:[`0`,`8px`,`16px`,`auto`]},{p:`padding`,dars:`m1-06`,d:{uz:`ichki bo'shliq`,ru:`внутренний отступ`},v:[`8px`,`16px`,`24px`]},{p:`display`,dars:`m1-07`,d:{uz:`ko'rinish turi`,ru:`тип отображения`},v:[`flex`,`block`,`none`]},{p:`gap`,dars:`m1-07`,d:{uz:`elementlar orasi`,ru:`промежуток`},v:[`8px`,`16px`,`24px`]},{p:`justify-content`,dars:`m1-07`,d:{uz:`gorizontal joylash`,ru:`по горизонтали`},v:[`center`,`space-between`,`flex-start`,`flex-end`]},{p:`align-items`,dars:`m1-07`,d:{uz:`vertikal joylash`,ru:`по вертикали`},v:[`center`,`flex-start`,`flex-end`]},{p:`flex-direction`,dars:`m1-07`,d:{uz:`yo'nalish`,ru:`направление`},v:[`row`,`column`]},{p:`height`,dars:`m1-07`,d:{uz:`balandlik`,ru:`высота`},v:[`100px`,`200px`,`100vh`]},{p:`width`,dars:`m1-15`,d:{uz:`kenglik`,ru:`ширина`},v:[`100px`,`300px`,`100%`]},{p:`background`,dars:`m1-15`,d:{uz:`fon`,ru:`фон`},v:[`#…`,`white`]},{p:`border-radius`,dars:`m1-15`,d:{uz:`burchak yumaloqligi`,ru:`скругление углов`},v:[`8px`,`12px`,`50%`]},{p:`box-shadow`,dars:`m1-15`,d:{uz:`soya`,ru:`тень`},v:[`0 4px 12px rgba(0,0,0,.15)`]}],fe={kw:[{k:`let`,dars:`m2-02`,d:{uz:`o'zgaruvchi (o'zgaradi)`,ru:`переменная (меняется)`}},{k:`const`,dars:`m2-02`,d:{uz:`o'zgarmas`,ru:`константа`}},{k:`if`,dars:`m2-04`,d:{uz:`shart`,ru:`условие`}},{k:`else`,dars:`m2-04`,d:{uz:`aks holda`,ru:`иначе`}},{k:`else if`,dars:`m2-04`,d:{uz:`yana bir shart`,ru:`ещё одно условие`}},{k:`true`,dars:`m2-04`,d:{uz:`rost`,ru:`истина`}},{k:`false`,dars:`m2-04`,d:{uz:`yolg'on`,ru:`ложь`}},{k:`for`,dars:`m2-05`,d:{uz:`sikl (sanab)`,ru:`цикл (со счётчиком)`}},{k:`while`,dars:`m2-05`,d:{uz:`sikl (shart bo'lguncha)`,ru:`цикл (пока условие)`}},{k:`function`,dars:`m2-06`,d:{uz:`funksiya`,ru:`функция`}},{k:`return`,dars:`m2-06`,d:{uz:`javob qaytarish`,ru:`вернуть значение`}},{k:`=>`,dars:`m2-08`,d:{uz:`qisqa funksiya`,ru:`стрелочная функция`}}],api:[{k:`console.log`,dars:`m2-02`,d:{uz:`konsolga chiqarish`,ru:`вывести в консоль`},q:`console.log()`},{k:`prompt`,dars:`m2-04`,d:{uz:`foydalanuvchidan so'rash`,ru:`спросить у пользователя`},q:`prompt("")`},{k:`.length`,dars:`m2-05`,d:{uz:`nechta element`,ru:`сколько элементов`}},{k:`onclick`,dars:`m2-08`,d:{uz:`bosilganda`,ru:`при нажатии`},q:`.onclick = () => {
  
}`},{k:`oninput`,dars:`m2-08`,d:{uz:`yozilganda`,ru:`при вводе`},q:`.oninput = () => {
  
}`}],snip:[{q:`log`,dars:`m2-02`,body:`console.log();`},{q:`if`,dars:`m2-04`,body:`if () {
  
}`},{q:`else`,dars:`m2-04`,body:`else {
  
}`},{q:`for`,dars:`m2-05`,body:`for (let i = 0; i < 5; i++) {
  
}`},{q:`while`,dars:`m2-05`,body:`while () {
  
}`},{q:`fn`,dars:`m2-06`,body:`function nom() {
  
}`}]},v=e=>{if(!e)return 1/0;let t=se.indexOf(e);if(t!==-1)return t;let n=/^(m\d[abc]?)-/.exec(e),r=n?se.indexOf(n[1]+`-*`):-1;return r===-1?1/0:r},y=(e,t)=>!e||v(t)<=v(e),pe=(e,t)=>{let n=x[e];return n?{body:n.body.split(`
`).join(`
`+t),caret:n.body.slice(0,n.caret).split(`
`).join(`
`+t).length}:O.has(e)?{body:`<${e}>`,caret:e.length+2}:{body:`<${e}></${e}>`,caret:e.length+2}},b=`<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <title>Sahifa</title>
</head>
<body>
  
</body>
</html>`;function me(e,t,{classOn:n}){if(e===`!`){let e=b.split(`
`).join(`
`+t);return{body:e,caret:e.indexOf(`<body>
`)+7+t.length+2}}let r=e.split(`>`),i=/^([a-zA-Z][a-zA-Z0-9]*)?((?:[.#][a-zA-Z0-9_-]+)*)(?:\*(\d{1,2}))?$/,a=[];for(let e of r){let t=i.exec(e);if(!t||!t[1]&&!t[2]||t[2]&&!n)return null;let o=(t[1]||`div`).toLowerCase();if(!le.some(e=>e.t===o)||r.length===1&&!t[2]&&!t[3])return null;let s=(t[2].match(/\.[a-zA-Z0-9_-]+/g)||[]).map(e=>e.slice(1)),c=(t[2].match(/#[a-zA-Z0-9_-]+/)||[``])[0].slice(1);a.push({tag:o,cls:s,id:c,n:Math.min(20,Math.max(1,Number(t[3]||1)))})}let o=e=>`<`+e.tag+(e.id?` id="`+e.id+`"`:``)+(e.cls.length?` class="`+e.cls.join(` `)+`"`:``)+`>`,s=(e,t)=>{let n=a[e],r=[];for(let i=0;i<n.n;i++){if(O.has(n.tag)){r.push(t+o(n));continue}e===a.length-1?r.push(t+o(n)+`</`+n.tag+`>`):r.push(t+o(n)+`
`+s(e+1,t+`  `)+`
`+t+`</`+n.tag+`>`)}return r.join(`
`)},c=s(0,t).slice(t.length),l=c.indexOf(`></`);return{body:c,caret:l===-1?c.length:l+1}}var x={ul:{body:`<ul>
  <li></li>
  <li></li>
</ul>`,caret:11},ol:{body:`<ol>
  <li></li>
  <li></li>
</ol>`,caret:11},a:{body:`<a href=""></a>`,caret:9},img:{body:`<img src="" alt="">`,caret:10}},S=e=>(e||``).trim(),C=null,he=(e,t)=>{let n=String(t??``).trim();if(typeof document>`u`)return n;try{return C||=document.createElement(`div`),C.style.cssText=``,C.style.setProperty(e,n),C.style.getPropertyValue(e)||n}catch{return n}},w=null,ge=(e,t,n)=>{if(!/(^|-)color$/.test(e)||typeof document>`u`||!document.body)return!1;try{w||(w=document.createElement(`i`),w.style.cssText=`position:absolute;width:0;height:0;overflow:hidden;visibility:hidden`),w.isConnected||document.body.appendChild(w);let r=t=>(w.style.setProperty(e,``),w.style.setProperty(e,String(t??``).trim()),w.style.getPropertyValue(e)?getComputedStyle(w).getPropertyValue(e):null),i=r(t),a=r(n);return w.style.setProperty(e,``),!!i&&i===a}catch{return!1}},T=e=>{let t=e||``,n=``,r=0,i=``,a=t.length,o=()=>!i||/[(,=:\[!&|?{};+\-*%<>~^]/.test(i)||/\b(return|typeof|case|in|of|delete|void|throw|new)$/.test(n.slice(-8));for(;r<a;){let e=t[r],s=t[r+1];if(e===`/`&&s===`/`){for(;r<a&&t[r]!==`
`;)n+=` `,r++;continue}if(e===`/`&&s===`*`){let e=t.indexOf(`*/`,r+2),i=e===-1?a:e+2;for(;r<i;r++)n+=t[r]===`
`?`
`:` `;continue}if(e===`"`||e===`'`||e==="`"){let o=e;for(n+=e,r++;r<a&&t[r]!==o;){if(t[r]===`\\`&&r+1<a){n+=t[r]+t[r+1],r+=2;continue}if(t[r]===`
`&&o!=="`")break;n+=t[r],r++}r<a&&t[r]===o&&(n+=o,r++),i=o;continue}if(e===`/`&&o()){n+=e,r++;let o=!1;for(;r<a&&t[r]!==`
`&&(o||t[r]!==`/`);){if(t[r]===`\\`&&r+1<a){n+=t[r]+t[r+1],r+=2;continue}t[r]===`[`?o=!0:t[r]===`]`&&(o=!1),n+=t[r],r++}r<a&&t[r]===`/`&&(n+=`/`,r++),i=`/`;continue}n+=e,/\s/.test(e)||(i=e),r++}return n},E={has:(e,t)=>n=>n.$(e)?!0:o(t??{uz:`\`${e}\` topilmadi`,ru:`\`${e}\` не найден`}),text:(e,t)=>n=>{let r=n.$(e);return r?S(r.textContent)?!0:o(t??{uz:`\`${e}\` bor, lekin ichi bo'sh — matn yozing`,ru:`\`${e}\` есть, но внутри пусто — напишите текст`}):o(t??{uz:`\`${e}\` topilmadi`,ru:`\`${e}\` не найден`})},attr:(e,t,n,r)=>i=>{let a=i.$(e);if(!a)return o(n??{uz:`\`${e}\` topilmadi`,ru:`\`${e}\` не найден`});let s=a.getAttribute(t);return s==null||!S(s)?o(n??{uz:`\`${e}\` da \`${t}="..."\` to'ldiring`,ru:`заполните \`${t}="..."\` у \`${e}\``}):r!=null&&S(s)!==S(r)?o(n??{uz:`\`${e}\` da \`${t}\` qiymati \`${r}\` bo'lsin`,ru:`у \`${e}\` значение \`${t}\` должно быть \`${r}\``}):!0},attrs:(e,t,n)=>r=>{let i=r.$(e);if(!i)return o(n??{uz:`\`${e}\` topilmadi`,ru:`\`${e}\` не найден`});let a=t.filter(e=>!S(i.getAttribute(e)||``));return a.length?o(n??{uz:`\`${e}\` da \`${a.join("` va `")}\` to'ldiring`,ru:`заполните \`${a.join("` и `")}\` у \`${e}\``}):!0},nested:(e,t,n)=>r=>r.$(`${e} ${t}`)?!0:o(n??{uz:`\`${t}\` ni \`${e}\` ichiga joylang`,ru:`поместите \`${t}\` внутрь \`${e}\``}),count:(e,t,n)=>r=>r.$$(e).length>=t?!0:o(n??{uz:`Kamida ${t} ta \`${e}\` kerak`,ru:`Нужно минимум ${t} \`${e}\``}),cssProp:(e,t,n)=>r=>r.cssRules.some(n=>n.selector.split(`,`).map(S).includes(S(e))&&S(n.props[t]))?!0:o(n??{uz:`\`${e}\` uchun \`${t}\` xossasini yozing`,ru:`для \`${e}\` задайте свойство \`${t}\``}),cssValue:(e,t,n,r)=>i=>{let a=he(t,n);return i.cssRules.some(r=>r.selector.split(`,`).map(S).includes(S(e))&&(S(r.props[t])===S(String(n??``))||S(r.props[t]).toLowerCase()===a.toLowerCase()||ge(t,r.props[t],n)))?!0:o(r??{uz:`\`${e}\` da \`${t}: ${n}\` yozing`,ru:`в \`${e}\` напишите \`${t}: ${n}\``})},js:(e,t)=>n=>e.test(T(n.js))?!0:o(t??{uz:`Skriptda kerakli qism topilmadi`,ru:`В скрипте не найден нужный фрагмент`}),jsText:(e,t)=>n=>T(n.js).includes(e)?!0:o(t??{uz:`Skriptda kerakli qism topilmadi`,ru:`В скрипте не найден нужный фрагмент`}),custom:e=>e,logs:(e,t)=>({__runtime:`log_includes`,value:String(e),hint:t}),logsEach:(e,t)=>({__runtime:`log_each`,values:(Array.isArray(e)?e:[e]).map(String),hint:t}),evalEquals:(e,t,n)=>({__runtime:`eval_equals`,expr:e,expected:String(t),hint:n}),domAfterClick:(e,t,n,r)=>({__runtime:`click_text`,clickSel:e,readSel:t,expected:String(n),hint:r}),toggle:(e,t,n,r,i)=>({__runtime:`toggle`,clickSel:e,readSel:t,textA:String(n),textB:String(r),hint:i})};function D(e){let t=e.hint;if(e.css){let{sel:n,prop:r,value:i}=e.css;return i==null?E.cssProp(n,r,t):E.cssValue(n,r,i,t)}if(e.js)return e.js instanceof RegExp?E.js(e.js,t):E.jsText(String(e.js),t);if(e.logs!==void 0)return E.logs(e.logs,t);if(e.logsEach!==void 0)return E.logsEach(e.logsEach,t);if(e.eval!==void 0)return E.evalEquals(e.eval,e.equals,t);if(e.toggle)return E.toggle(e.toggle,e.read||e.toggle,e.a,e.b,t);if(e.click)return E.domAfterClick(e.click,e.read,e.expect,t);let n=e.tag||e.sel;return n?e.child||e.nested?E.nested(n,e.child||e.nested,t):e.count==null?Array.isArray(e.attrs)?E.attrs(n,e.attrs,t):e.attr?E.attr(n,e.attr,t,e.equals):e.text?E.text(n,t):E.has(n,t):E.count(n,e.count,t):()=>o(t??{uz:`shart aniqlanmadi`,ru:`условие не распознано`})}function _e(e){if(e.css)return`CSS: ${e.css.sel} { ${e.css.prop}${e.css.value==null?``:`: ${e.css.value}`} }`;if(e.logs!==void 0)return{uz:`konsolda «${e.logs}»`,ru:`в консоли «${e.logs}»`};if(e.toggle)return`${e.a} ⇄ ${e.b}`;if(e.click)return{uz:`bosilsa «${e.expect}»`,ru:`по клику «${e.expect}»`};if(e.eval!==void 0)return`${e.eval} = ${e.equals}`;if(e.js)return e.js instanceof RegExp?{uz:`JS namunasi`,ru:`фрагмент JS`}:`JS: ${e.js}`;let t=e.tag||e.sel;return t?e.child||e.nested?{uz:`<${t}> ichida <${e.child||e.nested}>`,ru:`<${e.child||e.nested}> внутри <${t}>`}:Array.isArray(e.attrs)?`<${t}> — ${e.attrs.join(`, `)}`:e.attr?`<${t}> — ${e.attr}`:e.count==null?e.text?{uz:`<${t}> (matn bilan)`,ru:`<${t}> (с текстом)`}:`<${t}>`:{uz:`kamida ${e.count} ta <${t}>`,ru:`минимум ${e.count} <${t}>`}:{uz:`shart`,ru:`условие`}}function ve(e,t=0){if((!e||typeof e!=`object`)&&(e={}),typeof e.check==`function`||e.check&&e.check.__runtime||e.re)return{id:e.id??`r${t}`,label:e.label??``,...e};let n=D(e),r=e.id??`${e.tag||e.sel||`r`}${t}`;return{...e,id:r,label:e.label??_e(e),check:n}}var ye=[{name:`index.html`,lang:`html`,starter:{uz:`<!-- Bu yerga yozing -->
`,ru:`<!-- Пишите здесь -->
`}}],be={eyebrow:{uz:`Praktika`,ru:`Практика`},title:{uz:`O'z sahifangizni quring`,ru:`Соберите свою страницу`},brief:{uz:`Quyidagi shartlarni bajaring. Har biri bajarilganda yashil ✓ yonadi. Hammasi yashil bo'lsa — “Davom etish” ochiladi.`,ru:`Выполните условия ниже. За каждое выполненное загорается зелёная ✓. Когда всё зелёное — откроется «Продолжить».`},requirements:[{id:`h1`,label:{uz:`<h1> sarlavha (matn bilan)`,ru:`<h1> заголовок (с текстом)`},check:E.text(`h1`,{uz:"`<h1>` ichiga sarlavha matnini yozing",ru:"Напишите текст заголовка внутри `<h1>`"})},{id:`p`,label:{uz:`<p> — matn (paragraf)`,ru:`<p> — текст (абзац)`},check:E.text(`p`,{uz:"`<p>` ichiga bir-ikki gap yozing",ru:"Напишите пару предложений внутри `<p>`"})},{id:`img`,label:{uz:`<img> — src va alt bilan`,ru:`<img> — с src и alt`},check:E.attrs(`img`,[`src`,`alt`],{uz:"`<img>` da `src` va `alt` ikkalasini to'ldiring",ru:"Заполните у `<img>` оба атрибута: `src` и `alt`"})}]};function xe(e){if(!e||!e.trim()||typeof document>`u`)return[];e=e.replace(/@import\b[^;]*;?/gi,``);let t=document.createElement(`style`);t.textContent=e,document.head.appendChild(t);let n=[];try{let r=new Set((e.match(/([-a-zA-Z]+)\s*:/g)||[]).map(e=>e.replace(/\s*:$/,``).toLowerCase())),i=[],a=e=>{for(let t of e||[])t.style&&t.selectorText!=null?i.push(t):t.cssRules&&t.cssRules.length&&!(typeof CSSKeyframesRule<`u`&&t instanceof CSSKeyframesRule)&&a([...t.cssRules])};a([...t.sheet?.cssRules||[]]),n=i.map(e=>{let t={};for(let n=0;n<e.style.length;n++){let r=e.style[n];t[r]=e.style.getPropertyValue(r)}return r.forEach(n=>{if(t[n]==null){let r=e.style.getPropertyValue(n);r&&(t[n]=r)}}),{selector:e.selectorText||``,props:t}})}catch{}return t.remove(),n}var O=new Set([`area`,`base`,`br`,`col`,`embed`,`hr`,`img`,`input`,`link`,`meta`,`param`,`source`,`track`,`wbr`]),k=new Set([`li`,`p`,`td`,`th`,`tr`,`dt`,`dd`,`option`,`thead`,`tbody`,`tfoot`]),Se=new Set(`address.article.aside.blockquote.details.div.dl.fieldset.figcaption.figure.footer.form.h1.h2.h3.h4.h5.h6.header.hr.main.menu.nav.ol.p.pre.section.table.ul`.split(`.`));function A(e,t){return t===`li`?e===`li`:t===`p`?e===`p`||Se.has(e):t===`option`?e===`option`:t===`td`||t===`th`?e===`td`||e===`th`||e===`tr`:t===`tr`?e===`tr`:t===`dt`||t===`dd`?e===`dt`||e===`dd`:t===`thead`||t===`tbody`||t===`tfoot`?e===`tbody`||e===`tfoot`||e===`thead`:!1}var Ce=new Set([`p`,`h1`,`h2`,`h3`,`h4`,`h5`,`h6`,`a`,`span`,`strong`,`em`,`b`,`i`,`button`,`li`,`label`,`title`,`td`,`th`,`figcaption`,`blockquote`,...le.filter(e=>e.matn).map(e=>e.t)]),we=e=>{let t=/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)(?:"[^"]*"|'[^']*'|[^<>"'])*?(\/?)>/g,n=[],r;for(;r=t.exec(e);){let e=r[2].toLowerCase();if(r[1]){let t=n.lastIndexOf(e);t!==-1&&(n.length=t)}else if(!r[3]&&!O.has(e)){for(;n.length&&A(e,n[n.length-1]);)n.pop();n.push(e)}}return n.length>0&&Ce.has(n[n.length-1])},Te=700;function Ee(e){let t=[];if(!e)return t;let n=[],r=e.length,i=0,a=1,s=1,c=()=>({line:a,col:s}),l=()=>{e[i]===`
`?(a++,s=1):s++,i++},u=e=>{for(;i<e&&i<r;)l()};for(;i<r;){if(e[i]!==`<`){l();continue}let a=e[i+1];if(e.startsWith(`<!--`,i)){let n=e.indexOf(`-->`,i+4);if(n===-1){t.push({...c(),atEnd:!0,msg:o({uz:"Izoh yopilmagan (`-->` yetishmayapti)",ru:"Комментарий не закрыт (не хватает `-->`)"})});break}u(n+3);continue}if(a===`!`){let n=e.indexOf(`>`,i);if(n===-1){t.push({...c(),atEnd:!0,msg:o({uz:"`<! ... >` yopilmagan",ru:"`<! ... >` не закрыт"})});break}u(n+1);continue}if(a===`/`){let a=c(),s=i+2,l=``;for(;s<r&&/[a-zA-Z0-9-]/.test(e[s]);)l+=e[s],s++;for(;s<r&&e[s]!==`>`;)s++;if(s>=r){t.push({line:a.line,atEnd:!0,msg:o({uz:`Yopuvchi teg \`</${l}>\` to'liq emas (\`>\` yetishmayapti)`,ru:`Закрывающий тег \`</${l}>\` неполный (не хватает \`>\`)`})});break}let d=l.toLowerCase();for(;n.length&&k.has(n[n.length-1].name)&&n[n.length-1].name!==d&&n.some((e,t)=>e.name===d&&t<n.length-1);)n.pop();if(n.length===0)t.push({line:a.line,msg:o({uz:`Ortiqcha yopuvchi teg \`</${l}>\` — mos ochuvchi yo'q`,ru:`Лишний закрывающий тег \`</${l}>\` — нет парного открывающего`})});else{let e=n[n.length-1];if(e.name===d)n.pop();else{let r=n.map(e=>e.name).lastIndexOf(d);r===-1?t.push({line:a.line,msg:o({uz:`\`</${l}>\` mos ochuvchi tegga ega emas (xato yoki typo)`,ru:`У \`</${l}>\` нет парного открывающего тега (ошибка или опечатка)`})}):(t.push({line:e.line,msg:o({uz:`\`<${e.name}>\` yopilmagan — \`</${e.name}>\` kutilgan, \`</${l}>\` keldi`,ru:`\`<${e.name}>\` не закрыт — ожидался \`</${e.name}>\`, а пришёл \`</${l}>\``})}),n.length=r)}}u(s+1);continue}if(/[a-zA-Z]/.test(a||``)){let a=c(),s=i+1,l=``;for(;s<r&&/[a-zA-Z0-9-]/.test(e[s]);)l+=e[s],s++;let d=!1,f=!1,p=null,m=!1;for(;s<r;){let t=e[s];if(p){t===p&&(p=null),s++;continue}if(t===`"`||t===`'`){p=t,s++;continue}if(t===`<`){m=!0;break}if(t===`/`&&e[s+1]===`>`){d=!0,f=!0,s+=2;break}if(t===`>`){f=!0,s++;break}s++}if(p&&s>=r){t.push({line:a.line,atEnd:!0,msg:o({uz:`\`<${l}>\` ichida tirnoq (${p}) yopilmagan`,ru:`Кавычка (${p}) внутри \`<${l}>\` не закрыта`})});break}if(m){t.push({line:a.line,msg:o({uz:`\`<${l}\` tegi \`>\` bilan yopilmagan`,ru:`Тег \`<${l}\` не закрыт символом \`>\``})}),u(s);continue}if(!f&&s>=r){t.push({line:a.line,atEnd:!0,msg:o({uz:`\`<${l}\` tegi \`>\` bilan yopilmagan`,ru:`Тег \`<${l}\` не закрыт символом \`>\``})});break}let h=l.toLowerCase();for(;n.length&&A(h,n[n.length-1].name);)n.pop();!d&&!O.has(h)&&n.push({name:h,line:a.line}),u(s);continue}l()}for(let e of n)k.has(e.name)||t.push({line:e.line,msg:o({uz:`\`<${e.name}>\` ochiq qoldi — \`</${e.name}>\` bilan yoping`,ru:`\`<${e.name}>\` остался открытым — закройте его \`</${e.name}>\``})});return t}function De(e,t){try{if(e.check&&e.check.__runtime)return{ok:!1,hint:o({uz:`ishga tushirilmoqda…`,ru:`запускается…`}),runtime:!0};if(typeof e.check==`function`){let n=e.check(t);return n===!0?{ok:!0,hint:null}:{ok:!1,hint:typeof n==`string`?n:o(e.hint)||null}}if(e.re){let n=e.re.test((t.html||``).replace(/<!--[\s\S]*?-->/g,``));return{ok:n,hint:n?null:o(e.hint)||null}}return{ok:!1,hint:null}}catch{return{ok:!1,hint:o({uz:`tekshirishda xatolik`,ru:`ошибка при проверке`})}}}var Oe=(e,t)=>`<script>
(function(){
  var N=${JSON.stringify(e)},JS=${Number(t&&t.jsStart)||0},HT=${Number(t&&t.htmlStart)||0};
  // K-P-07/K-C-16: DevTools uslubidagi ko'rinish — Error name: message, Map(n) {k => v}, Set(n) {..}, <tag id>, Date ISO,
  // undefined saqlanadi, 5n, ƒ nom(); chuqurlik maks 3 ({…}/[…]), 50 element (… +N), [Circular]; bitta satr maks 4000 belgi.
  var DEPTH=3,ITEMS=50,MAXCH=4000;
  function insp(v,d,seen){
    var t=typeof v;
    if(v===null)return 'null';if(t==='undefined')return 'undefined';
    if(t==='string')return d>0?JSON.stringify(v):v;
    if(t==='number')return (v===0&&1/v<0)?'-0':String(v);
    if(t==='bigint')return String(v)+'n';if(t==='symbol'||t==='boolean')return String(v);
    if(t==='function')return 'ƒ '+(v.name||'')+'()';
    try{
      if(v instanceof Error)return (v.name||'Error')+': '+v.message;
      if(v instanceof Date)return isNaN(v.getTime())?'Invalid Date':v.toISOString();
      if(v instanceof RegExp)return String(v);
      if(v.nodeType===1)return '<'+String(v.tagName).toLowerCase()+(v.id?' id="'+v.id+'"':'')+(typeof v.className==='string'&&v.className?' class="'+v.className+'"':'')+'>';
      if(v.nodeType)return String(v.nodeName);
      if(seen.indexOf(v)!==-1)return '[Circular]';
      var isArr=Array.isArray(v),isMap=v instanceof Map,isSet=v instanceof Set;
      if(d>=DEPTH)return isArr?'[…]':'{…}';
      seen.push(v);
      var out=[],i=0,more=0;
      if(isMap){v.forEach(function(val,k){if(i<ITEMS)out.push(insp(k,d+1,seen)+' => '+insp(val,d+1,seen));else more++;i++;});seen.pop();return 'Map('+v.size+') {'+out.join(', ')+(more?', … +'+more:'')+'}';}
      if(isSet){v.forEach(function(val){if(i<ITEMS)out.push(insp(val,d+1,seen));else more++;i++;});seen.pop();return 'Set('+v.size+') {'+out.join(', ')+(more?', … +'+more:'')+'}';}
      if(isArr){for(i=0;i<v.length;i++){if(i<ITEMS)out.push(insp(v[i],d+1,seen));else{more=v.length-ITEMS;break;}}seen.pop();return '['+out.join(', ')+(more?', … +'+more:'')+']';}
      var ks=Object.keys(v);for(i=0;i<ks.length;i++){if(i<ITEMS)out.push(ks[i]+': '+insp(v[ks[i]],d+1,seen));else{more=ks.length-ITEMS;break;}}
      seen.pop();return '{'+out.join(', ')+(more?', … +'+more:'')+'}';
    }catch(e){try{return String(v);}catch(x){return '[?]';}}
  }
  function fmt(a){return insp(a,0,[]);}
  var indent='';
  function join(args){
    var parts=[],i=0;
    if(args.length>1&&typeof args[0]==='string'&&/%[sdifoOc]/.test(args[0])){ // %s/%d/%o format-belgilar (birinchi arg satr)
      var k=1,str=args[0].replace(/%([sdifoOc])/g,function(m,c){if(k>=args.length)return m;var a=args[k++];if(c==='c')return '';if(c==='d'||c==='i')return String(parseInt(a,10));if(c==='f')return String(parseFloat(a));return fmt(a);});
      parts.push(str);i=k;
    }
    for(;i<args.length;i++)parts.push(fmt(args[i]));
    var text=parts.join(' ');
    if(text.length>MAXCH)text=text.slice(0,MAXCH)+' … (+'+(text.length-MAXCH)+' belgi)';
    return indent+text;
  }
  function send(level,args){
    try{parent.postMessage({__hcConsole:true,nonce:N,level:level,text:join(args)},'*');}catch(e){}
  }
  ['log','info','warn','error'].forEach(function(m){
    var _o=console[m]?console[m].bind(console):function(){};
    console[m]=function(){send(m,arguments);try{_o.apply(null,arguments);}catch(e){}};
  });
  // K-P-16: debug/dir → log; group/groupEnd → chekinish; table → matnli jadval (maks 20 qator × 6 ustun); clear → panel tozalanadi
  var _dbg=console.debug?console.debug.bind(console):function(){},_dir=console.dir?console.dir.bind(console):function(){};
  console.debug=function(){send('log',arguments);try{_dbg.apply(null,arguments);}catch(e){}};
  console.dir=function(){send('log',arguments);try{_dir.apply(null,arguments);}catch(e){}};
  console.group=console.groupCollapsed=function(){send('log',arguments.length?['▼ '+join(arguments).slice(indent.length)]:['▼']);indent+='  ';};
  console.groupEnd=function(){indent=indent.slice(0,-2);};
  console.clear=function(){try{parent.postMessage({__hcConsole:true,nonce:N,level:'clear',text:''},'*');}catch(e){}};
  console.table=function(data){
    if(!data||typeof data!=='object'){send('log',arguments);return;}
    var ROWS=20,COLS=6,rows=[],keys=[],rk=Object.keys(data),i,j;
    for(i=0;i<rk.length&&i<ROWS;i++){var r=data[rk[i]];rows.push([rk[i],r]);if(r&&typeof r==='object'){var kk=Object.keys(r);for(j=0;j<kk.length;j++)if(keys.indexOf(kk[j])===-1&&keys.length<COLS)keys.push(kk[j]);}}
    var hasVal=rows.some(function(r){return !(r[1]&&typeof r[1]==='object');});
    var head=['(index)'].concat(keys,hasVal?['Value']:[]);
    var lines=[head];
    rows.forEach(function(r){var line=[r[0]];keys.forEach(function(k){line.push(r[1]&&typeof r[1]==='object'&&k in r[1]?insp(r[1][k],1,[]):'');});if(hasVal)line.push(r[1]&&typeof r[1]==='object'?'':insp(r[1],1,[]));lines.push(line);});
    var w=head.map(function(_,c){var m=0;lines.forEach(function(l){var s=String(l[c]==null?'':l[c]).slice(0,24);if(s.length>m)m=s.length;});return m;});
    var txt=lines.map(function(l){return l.map(function(c,ci){var s=String(c==null?'':c).slice(0,24);while(s.length<w[ci])s+=' ';return s;}).join(' │ ');});
    txt.splice(1,0,w.map(function(x){var s='';while(s.length<x)s+='─';return s;}).join('─┼─'));
    if(rk.length>ROWS)txt.push('… +'+(rk.length-ROWS)+' qator');
    send('log',[txt.join('\\n')]);
  };
  // K-C-14 (= K-P-05): sandbox'da (allow-modals yo'q) alert/prompt/confirm brauzer tomonidan JIM yutiladi.
  // Semantika SAQLANADI (alert→undefined, prompt→null, confirm→false — «Bekor» bosilgandek), lekin har
  // chaqiriq konsolga warn-marker yuboradi (matn RENDER paytida o'quvchi tilida — K-M-01). O'quvchi
  // o'z kodida window.alert'ni qayta belgilasa — uniki ustun (oddiy o'zlashtirish, himoya YO'Q, ataylab).
  var seenModal=false,firstOf={};
  function modal(kind,ret){return function(msg){
    seenModal=true;var again=!!firstOf[kind];firstOf[kind]=true;
    var t='';try{t=msg===undefined?'':String(msg);}catch(e){t='';}
    try{parent.postMessage({__hcConsole:true,nonce:N,level:'warn',text:'__hcModal:'+kind+':'+(again?'again':'first')+':'+t},'*');}catch(e){}
    return ret;};}
  try{window.alert=modal('alert',undefined);window.prompt=modal('prompt',null);window.confirm=modal('confirm',false);}catch(e){}
  window.addEventListener('error',function(e){
    var ln=e.lineno||0,file='',line=0;
    if(JS&&ln>=JS){file='script.js';line=ln-JS+1;}
    else if(HT&&ln>=HT){file='index.html';line=ln-HT+1;}
    try{parent.postMessage({__hcConsole:true,nonce:N,level:'error',text:String(e.message||''),file:file,line:line,col:e.colno||0,hint:seenModal?'modal-null':''},'*');}catch(x){}
  });
})();
<\/script>`,ke=(e,t)=>`<script>
(function(){
  try{var _cs=document.currentScript;if(_cs)_cs.parentNode.removeChild(_cs);}catch(e){}
  var logs=[],_push=Array.prototype.push,_str=String,_json=JSON.stringify,
      _idx=String.prototype.indexOf,_trim=String.prototype.trim,_low=String.prototype.toLowerCase,_rep=String.prototype.replace,
      _st=window.setTimeout,_qs=document.querySelector;
  var _l=console.log;console.log=function(){
    for(var i=0;i<arguments.length;i++){var a=arguments[i];
      try{_push.call(logs,typeof a==='object'?_json(a):_str(a));}catch(e){_push.call(logs,_str(a));}}
    try{_l.apply(console,arguments);}catch(e){}
  };
  function has(hay,needle){return _idx.call(_str(hay),needle)!==-1;}
  // F-1017-206: konsol-matnini normallashtirish — kichik harf, apostrof turlari → ', probel yig'iladi
  function norm(s){var x=_low.call(_str(s));x=_rep.call(x,/[\u2018\u2019\u02BB\u02BC\u0060\u00B4]/g,"'");x=_rep.call(x,/\\s+/g,' ');return _trim.call(x);}
  function qs(sel){try{return _qs.call(document,sel);}catch(e){return null;}}
  function runProbes(){
    var P=${JSON.stringify(e)};
    var joined='';for(var j=0;j<logs.length;j++)joined+=(j?' ':'')+logs[j];
    var out={};
    for(var k=0;k<P.length;k++){
      var p=P[k],ok=false;
      try{
        if(p.type==='log_includes'){
          var v=norm(p.value);
          ok=has(norm(joined),v);
          if(!ok){for(var q=0;q<logs.length;q++){if(has(norm(logs[q]),v)){ok=true;break;}}}
        }else if(p.type==='log_each'){
          var J=norm(joined),vals=p.values||[];
          ok=vals.length>0;
          for(var m=0;m<vals.length;m++){if(!has(J,norm(vals[m]))){ok=false;break;}}
        }else if(p.type==='eval_equals'){
          var r; try{r=eval(p.expr);}catch(e){r=undefined;}
          ok=_str(r)===_str(p.expected);
        }else if(p.type==='click_text'){
          var exp=_str(p.expected);
          var t0=qs(p.readSel);
          var before=t0?t0.textContent:'';
          var b=qs(p.clickSel);
          if(b){try{b.click();}catch(e){}}
          var t1=qs(p.readSel);
          var after=t1?t1.textContent:'';
          // Matn bosishdan KEYIN paydo bo'lishi kerak (oldin bo'lmagan) — JS'siz o'tmaydi
          ok=has(after,exp) && !has(before,exp);
        }else if(p.type==='toggle'){
          var A=_trim.call(_low.call(_str(p.textA)));
          var B=_trim.call(_low.call(_str(p.textB)));
          var rd=function(){var e=qs(p.readSel);return _low.call(_str(e?e.textContent:''));};
          var b2=qs(p.clickSel);
          var s0=rd();
          var startOk=has(s0,A) && !has(s0,B); // boshida A
          if(b2){try{b2.click();}catch(e){}}
          var s1=rd();
          var firstOk=has(s1,B) && !has(s1,A); // 1-bosish -> B
          if(b2){try{b2.click();}catch(e){}}
          var s2=rd();
          var secondOk=has(s2,A) && !has(s2,B); // 2-bosish -> A
          ok=startOk && firstOk && secondOk;
        }
      }catch(e){ok=false;}
      out[p.id]=ok;
    }
    try{parent.postMessage({__hcReport:true,nonce:${JSON.stringify(t)},results:out},'*');}catch(e){}
  }
  // 'load' hodisasidan keyin ishga tushiramiz — o'quvchi handler'ni
  // window.onload / addEventListener('load') ichida ulagan bo'lsa ham ulgursin.
  function start(){ _st.call(window, runProbes, 50); }
  if(document.readyState==='complete') start();
  else window.addEventListener('load', start);
})();
<\/script>`,Ae=`
  *{box-sizing:border-box}
  body{font-family:-apple-system,'Segoe UI',Roboto,sans-serif;margin:0;padding:24px;color:#13141A;line-height:1.6;background:#fff}
  h1{font-family:Georgia,serif;margin:0 0 12px;letter-spacing:-.01em}
  img{max-width:100%;border-radius:12px;display:block;margin:10px 0}
  p{margin:0 0 12px}
  li:empty{display:none}
  .hc-imgfb{display:flex;flex-direction:column;gap:2px;border:2px dashed #D8D3C8;border-radius:12px;padding:16px 18px;margin:10px 0;background:#FAF8F4;color:#5A5A60;font-size:14px}
  .hc-imgfb-i{font-size:26px;line-height:1}
  .hc-imgfb-t{font-weight:700;color:#0E0E10}
  .hc-imgfb-h{font-size:12.5px;color:#8A8880}
  .hc-imgfb code{font-family:ui-monospace,Menlo,Consolas,monospace;background:#EFEBE3;padding:1px 5px;border-radius:5px}`,je=()=>`<script>
document.addEventListener('error',function(e){
  var el=e.target;
  if(!el||el.tagName!=='IMG'||el.dataset.hcFb)return;
  el.dataset.hcFb='1';el.style.display='none';
  var alt=(el.getAttribute('alt')||'').trim();
  var b=document.createElement('div');
  b.className='hc-imgfb';
  b.innerHTML='<span class="hc-imgfb-i">\\uD83D\\uDDBC</span>'
    +'<span class="hc-imgfb-t"></span>'
    +'<span class="hc-imgfb-h">'+${JSON.stringify(o({uz:`rasm topilmadi — <code>src</code> manzilini tekshiring`,ru:`картинка не найдена — проверьте адрес в <code>src</code>`}))}+'</span>';
  b.querySelector('.hc-imgfb-t').textContent = alt || ${JSON.stringify(o({uz:`alt matni yozilmagan`,ru:`текст alt не написан`}))};
  if(el.parentNode)el.parentNode.insertBefore(b,el.nextSibling);
},true);
<\/script>`,Me=`<script>
document.addEventListener('click',function(e){
  var a=e.target&&e.target.closest?e.target.closest('a[href^="#"]'):null;
  if(!a)return;
  e.preventDefault();
  var id=a.getAttribute('href').slice(1),el=null;
  try{id=decodeURIComponent(id)}catch(_){}
  if(id)el=document.getElementById(id);
  if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
  else if(!id)window.scrollTo({top:0,behavior:'smooth'});
},true);
<\/script>`,Ne=(e,t,n,r={})=>{let i=e=>`<!doctype html>
<html lang="${a}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<base target="_blank">
<style>${Ae}
${r.previewCss||``}
${t||``}</style>
${r.harness||``}
${r.consoleNonce==null?``:Oe(r.consoleNonce,e)}
${r.harness?``:je()}
${r.harness?``:Me}
</head>
<body>
`,o=e=>(String(e||``).match(/\n/g)||[]).length,s=o(i({jsStart:0,htmlStart:0}))+1;return`${i({jsStart:s+o(e)+1,htmlStart:s})}${e||``}
<script>${n||``}<\/script>
${r.doneNonce==null?``:`<script>try{parent.postMessage({__hcDone:true,nonce:${JSON.stringify(r.doneNonce)}},'*')}catch(e){}<\/script>`}
</body>
</html>`},j=[[/^(?:Uncaught )?ReferenceError: (.+?) is not defined$/,e=>({uz:`\`${e[1]}\` aniqlanmagan — bunday o'zgaruvchi yoki funksiya yo'q. Imlosini yoki e'lon qilinganini tekshiring`,ru:`\`${e[1]}\` не определено — такой переменной или функции нет. Проверьте написание или объявление`})],[/^(?:Uncaught )?TypeError: Cannot read propert(?:y|ies) of (null|undefined) \(reading '(.+?)'\)$/,e=>({uz:`\`${e[2]}\` ni o'qib bo'lmadi — qiymat ${e[1]}. Element topilmagan yoki o'zgaruvchi hali bo'sh bo'lishi mumkin`,ru:`не удалось прочитать \`${e[2]}\` — значение ${e[1]}. Возможно, элемент не найден или переменная ещё пустая`})],[/^(?:Uncaught )?TypeError: (.+?) is not a function$/,e=>({uz:`\`${e[1]}\` funksiya emas — uni qavs bilan chaqirib bo'lmaydi. Nomini tekshiring`,ru:`\`${e[1]}\` — не функция, её нельзя вызвать со скобками. Проверьте имя`})],[/^(?:Uncaught )?SyntaxError: Unexpected token '?(.+?)'?$/,e=>({uz:`kutilmagan belgi \`${e[1]}\` — oldingi qator(lar)da qavs, tirnoq yoki nuqta-vergul tekshiring`,ru:`неожиданный символ \`${e[1]}\` — проверьте скобки, кавычки или точку с запятой в предыдущих строках`})],[/^(?:Uncaught )?SyntaxError: Unexpected end of input$/,()=>({uz:"kod tugab qoldi — qavs `)` yoki `}` yopilmagan",ru:"код оборвался — не закрыта скобка `)` или `}`"})],[/^(?:Uncaught )?SyntaxError: Invalid or unexpected token$/,()=>({uz:`noto'g'ri belgi — tirnoq yopilmagan yoki begona belgi kirib qolgan bo'lishi mumkin`,ru:`неверный символ — возможно, не закрыта кавычка или попал лишний символ`})],[/^(?:Uncaught )?SyntaxError: Identifier '(.+?)' has already been declared$/,e=>({uz:`\`${e[1]}\` allaqachon e'lon qilingan — ikkinchi marta \`let\`/\`const\` yozmang`,ru:`\`${e[1]}\` уже объявлено — не пишите \`let\`/\`const\` второй раз`})],[/^(?:Uncaught )?SyntaxError: Missing initializer in const declaration$/,()=>({uz:"`const` ga qiymat berilmagan — `const nom = qiymat;` shaklida yozing",ru:"`const` без значения — пишите `const имя = значение;`"})],[/^(?:Uncaught )?TypeError: Assignment to constant variable\.?$/,()=>({uz:"`const` ga qayta qiymat berib bo'lmaydi — o'zgarishi kerak bo'lsa `let` ishlating",ru:"`const` нельзя переприсвоить — если значение меняется, используйте `let`"})],[/^(?:Uncaught )?Error: (.+)$/,e=>({uz:`xato: ${e[1]}`,ru:`ошибка: ${e[1]}`})]],Pe=(e,t)=>{let n=String(e??``).trim();if(t===`modal-null`){let e=/^(?:Uncaught )?TypeError: Cannot read propert(?:y|ies) of null \(reading '(.+?)'\)$/.exec(n);if(e)return o({uz:`\`${e[1]}\` ni o'qib bo'lmadi — qiymat null. Ehtimol bu \`prompt()\`/\`confirm()\` javobi: bu muhitda ular doim null/false qaytaradi — qiymatni o'zgaruvchiga to'g'ridan-to'g'ri yozing`,ru:`не удалось прочитать \`${e[1]}\` — значение null. Вероятно, это ответ \`prompt()\`/\`confirm()\`: в этой среде они всегда возвращают null/false — запишите значение в переменную напрямую`})}for(let[e,t]of j){let r=e.exec(n);if(r)return o(t(r))}return n.replace(/^Uncaught /,``)||n},Fe=/^__hcModal:(alert|prompt|confirm):(first|again):([\s\S]*)$/,Ie=e=>{let t=Fe.exec(String(e??``));if(!t)return null;let[,n,r,i]=t,a=`${n}(${i?JSON.stringify(i):``})`;return o(r===`again`?{uz:`${a} — o'tkazib yuborildi (bu muhitda ishlamaydi)`,ru:`${a} — пропущено (в этой среде не работает)`}:{alert:{uz:`${a} — bu muhitda dialog-oyna ochilmaydi. Matnni ko'rsatish uchun \`console.log(...)\` yoki sahifaga yozing`,ru:`${a} — в этой среде диалоговое окно не открывается. Чтобы показать текст, используйте \`console.log(...)\` или выведите на страницу`},prompt:{uz:`${a} — bu yerda ishlamaydi, javob null (bo'sh) qaytdi. Qiymatni o'zgaruvchiga to'g'ridan-to'g'ri yozing: \`let ism = "Ali"\``,ru:`${a} — здесь не работает, ответ null (пусто). Запишите значение в переменную напрямую: \`let ism = "Ali"\``},confirm:{uz:`${a} — bu yerda ishlamaydi, javob false qaytdi — \`else\` tarmog'i ishlaydi`,ru:`${a} — здесь не работает, ответ false — сработает ветка \`else\``}}[n])};function M({task:e=be,starterCode:t,onContinue:n,onBack:d,storageKey:f,lang:p=`uz`,stage:m}){let h=(0,r.useMemo)(()=>le.filter(e=>y(m,e.dars)),[m]),g=(0,r.useMemo)(()=>{let e={};for(let t of Object.keys(ue))e[t]=ue[t].filter(e=>y(m,e.dars));return e},[m]),ee=y(m,ce.emmet),te=y(m,ce.class_id_qisqartma),ne=(0,r.useMemo)(()=>y(m,ce.css_maslahat)?de.filter(e=>y(m,e.dars)):[],[m]),re=(0,r.useMemo)(()=>{if(!y(m,ce.js_maslahat))return[];let e=Object.fromEntries(fe.snip.filter(e=>y(m,e.dars)).map(e=>[e.q,e.body])),t=[];for(let n of fe.kw)y(m,n.dars)&&t.push({k:n.k,d:n.d,body:e[n.k]||(/^(true|false|null|=>)$/.test(n.k)?n.k:n.k+` `)});for(let e of fe.api)y(m,e.dars)&&t.push({k:e.k,d:e.d,body:e.q||e.k});for(let n of Object.keys(e))t.some(e=>e.k===n)||t.push({k:n,d:{uz:e[n].split(`
`)[0]+` …`,ru:e[n].split(`
`)[0]+` …`},body:e[n]});return t},[m]);a=p===`ru`?`ru`:`uz`;let _=e&&typeof e==`object`?e:be,ae=Array.isArray(_.requirements)?_.requirements:[],se=Array.isArray(_.files)?_.files.filter(e=>e&&typeof e==`object`&&e.name):[],v=(0,r.useMemo)(()=>ae.map((e,t)=>ve(e,t)),[_.requirements]),b=(0,r.useMemo)(()=>{if(se.length)return se;let e={...ye[0]};return t!=null&&(e.starter=t),[e]},[_.files,t]),[x,S]=(0,r.useState)(()=>{let e=Object.fromEntries(b.map(e=>[e.name,o(e.starter)??``]));if(!f)return e;let t=l(f);if(!t||!t.codes)return e;let n=Object.keys(e);return!t.codes||typeof t.codes!=`object`||Array.isArray(t.codes)||n.length!==Object.keys(t.codes).length||!n.every(e=>e in t.codes)?e:Object.fromEntries(n.map(n=>[n,typeof t.codes[n]==`string`?t.codes[n]:e[n]]))});(0,r.useEffect)(()=>{if(!f)return;let e=setTimeout(()=>u(f,x),400);return()=>clearTimeout(e)},[x,f]);let[C,he]=(0,r.useState)(b[0].name),w=(0,r.useRef)(null),ge=e=>{let t=b.find(t=>t.lang===e);return t?x[t.name]??``:``},T=ge(`html`),E=ge(`css`),D=ge(`js`),_e=(0,r.useMemo)(()=>v.filter(e=>e.check&&e.check.__runtime).map(e=>({id:e.id,type:e.check.__runtime,...e.check})),[v]),k=_e.length>0,Se=(0,r.useRef)(``),A=(0,r.useRef)(null),[Ce,Oe]=(0,r.useState)({}),Ae=(0,r.useRef)(null),je=(0,r.useRef)(null),Me=(e,t)=>!!(t.current&&e.source&&e.source===t.current.contentWindow),j=(0,r.useMemo)(()=>b.some(e=>e.lang===`js`),[b]),M=j&&!_.previewUrl&&!b.some(e=>e.lang===`html`)&&!/\bdocument\b|\balert\s*\(/.test(D),Le=(0,r.useRef)(0),[N,ze]=(0,r.useState)({lines:[],dropped:0}),P=N.lines,Be=(0,r.useCallback)(e=>ze({lines:Array.isArray(e)?e:[],dropped:0}),[]),Ve=(0,r.useRef)(null),He=(0,r.useRef)(!0),[Ue,We]=(0,r.useState)(0),Ge=(0,r.useCallback)(()=>{let e=Ve.current;e&&(e.scrollTop=e.scrollHeight),He.current=!0,We(0)},[]),Ke=(0,r.useRef)(0),qe=(0,r.useCallback)(()=>{let e=Ve.current;e&&(e.scrollHeight-e.scrollTop-e.clientHeight<24?(He.current=!0,We(0)):e.scrollTop<Ke.current-2&&(He.current=!1),Ke.current=e.scrollTop)},[]),Je=(0,r.useRef)(0);(0,r.useEffect)(()=>{let e=Ve.current,t=Je.current;Je.current=P.length,!(!e||P.length===0)&&(He.current?(e.scrollTop=e.scrollHeight,Ke.current=e.scrollTop):We(e=>e+Math.max(1,P.length-t)))},[P]);let Ye=(e={})=>Ne(T,E,D,{previewCss:_.previewCss,...e}),[Xe,Ze]=(0,r.useState)(()=>Ne(T,E,D,{previewCss:_.previewCss})),[Qe,$e]=(0,r.useState)(``),et=o({uz:`⏱ Kod juda uzoq ishladi — sikl tugamayapti (cheksiz sikl?). Shartni tekshiring: sanagich o'zgaryaptimi (masalan i++)?`,ru:`⏱ Код работал слишком долго — цикл не заканчивается (бесконечный цикл?). Проверьте условие: меняется ли счётчик (например i++)?`}),[tt,nt]=(0,r.useState)(0),[rt,it]=(0,r.useState)(!1),[at,ot]=(0,r.useState)(!1),st=(0,r.useRef)(0),F=(0,r.useRef)({}),ct=(0,r.useRef)(null),lt=(0,r.useRef)(null),ut=()=>{clearTimeout(ct.current),ct.current=setTimeout(()=>{let e=F.current;if(e.doc==null&&e.check==null)return;let t=`${e.doc}/${e.check}`;ot(!0),F.current={},it(!0),lt.current!==t&&(lt.current=t,setTimeout(()=>{nt(e=>e+1),it(!1),F.current={...e},ut()},120))},5e3)},I=(e,t)=>{F.current={...F.current,[e]:t},ut()},dt=(e,t)=>{if(F.current[e]!==t)return;F.current={...F.current,[e]:null};let n=F.current;n.doc==null&&n.check==null&&(clearTimeout(ct.current),ot(!1))};(0,r.useEffect)(()=>()=>clearTimeout(ct.current),[]);let ft=j,L=`${T} ${E} ${D}`,R=(0,r.useRef)(null),[pt,mt]=(0,r.useState)(!1);(0,r.useEffect)(()=>{let e=setTimeout(()=>{if(ot(!1),it(!1),!ft){let e=++st.current;Ze(Ye({doneNonce:e})),I(`doc`,e)}else if(R.current===null){let e=++Le.current,t=++st.current;Be([]),Ze(Ye({consoleNonce:e,doneNonce:t})),I(`doc`,t),R.current=L,mt(!1)}else mt(R.current!==L);if(k){let e=Se.current=`${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;A.current=null,Oe({}),$e(Ye({harness:ke(_e,e)})),I(`check`,e)}},300);return()=>clearTimeout(e)},[L,T,E,D,k,_e,ft]),(0,r.useEffect)(()=>{if(!k)return;let e=e=>{let t=e.data;t&&t.__hcReport&&t.nonce===Se.current&&Me(e,je)&&A.current!==t.nonce&&(A.current=t.nonce,Oe(t.results||{}),dt(`check`,t.nonce))};return window.addEventListener(`message`,e),()=>window.removeEventListener(`message`,e)},[k]),(0,r.useEffect)(()=>{let e=e=>{let t=e.data;t&&t.__hcDone&&t.nonce===st.current&&Me(e,Ae)&&dt(`doc`,t.nonce)};return window.addEventListener(`message`,e),()=>window.removeEventListener(`message`,e)},[]),(0,r.useEffect)(()=>{if(!j)return;let e=e=>{let t=e.data;if(t&&t.__hcConsole&&t.nonce===Le.current&&Me(e,Ae)){if(t.level===`clear`){ze({lines:[{level:`clear`,text:``}],dropped:0});return}let e={level:t.level,text:String(t.text??``),file:t.file||``,line:Number(t.line)||0,col:Number(t.col)||0,hint:String(t.hint||``)};ze(t=>t.lines.length>=500?{lines:[...t.lines.slice(t.lines.length-500+1),e],dropped:t.dropped+1}:{lines:[...t.lines,e],dropped:t.dropped})}};return window.addEventListener(`message`,e),()=>window.removeEventListener(`message`,e)},[j]);let ht=(0,r.useMemo)(()=>{let e=new DOMParser().parseFromString(T||``,`text/html`),t={html:T,css:E,js:D,doc:e,$:t=>{try{return e.querySelector(t)}catch{return null}},$$:t=>{try{return[...e.querySelectorAll(t)]}catch{return[]}},cssRules:xe(E)};return v.map(e=>De(e,t))},[T,E,D,v,p]),[gt,_t]=(0,r.useState)(T);(0,r.useEffect)(()=>{let e=setTimeout(()=>_t(T),Te);return()=>clearTimeout(e)},[T]);let vt=(0,r.useMemo)(()=>Ee(gt),[gt,p]),[yt,bt]=(0,r.useState)(!1),xt=vt.length>0,z=v.map((e,t)=>{if(e.check&&e.check.__runtime){let t=Ce[e.id];return t===void 0?{ok:!1,hint:at?et:o({uz:`ishga tushirilmoqda…`,ru:`запускается…`})}:{ok:!!t,hint:t?null:o(e.check.hint)||o({uz:`natija kutilgancha emas`,ru:`результат не такой, как ожидалось`})}}return ht[t]}),St=z.filter(e=>e.ok).length,B=v.length>0&&St===v.length&&!xt,Ct=z.find(e=>!e.ok&&e.hint)?.hint,wt=v.length>0&&St===v.length&&xt,V=(0,r.useMemo)(()=>yt&&!wt?vt.filter(e=>!e.atEnd):vt,[vt,yt,wt]),Tt=e=>S(t=>({...t,[C]:e})),H=(0,r.useRef)(null);(0,r.useLayoutEffect)(()=>{let e=H.current;if(e==null)return;H.current=null;let t=w.current;t&&document.activeElement===t&&t.setSelectionRange(e,e)});let U=(e,t,n)=>{e.focus(),document.execCommand(`insertText`,!1,t),n!=null&&(e.setSelectionRange(n,n),H.current=n)},W=()=>{let e=w.current;bt(!!e&&document.activeElement===e&&e.selectionStart===e.selectionEnd&&e.selectionStart===e.value.length)},G=(b.find(e=>e.name===C)||{}).lang||`html`,K=s(`(max-width: 860px)`),Et=s(`(pointer: coarse)`),[q,Dt]=(0,r.useState)(`code`),Ot=(0,r.useRef)(null),kt=(0,r.useRef)(null),At=(0,r.useRef)(0),jt=(0,r.useRef)(``),Mt=(0,r.useRef)(!1),Nt=(0,r.useRef)(null),Pt=()=>{let e=w.current,t=Nt.current;if(!e||!t)return;let n=getComputedStyle(e),r=parseFloat(n.lineHeight)||24,i=parseFloat(n.paddingTop)||0,a=e.value.slice(0,e.selectionStart).split(`
`).length-1;t.style.top=i+a*r-e.scrollTop+`px`,t.style.height=r+`px`,t.style.opacity=document.activeElement===e&&e.selectionStart===e.selectionEnd?`1`:`0`},[Ft,It]=(0,r.useState)({ln:1,col:1}),J=()=>{Pt();let e=w.current;if(!e)return;let t=e.value.slice(0,e.selectionStart),n=t.split(`
`).length,r=t.length-t.lastIndexOf(`
`);It(e=>e.ln===n&&e.col===r?e:{ln:n,col:r})},[Y,Lt]=(0,r.useState)(()=>{try{let e=parseInt(localStorage.getItem(`hcFont`),10);return e>=12&&e<=20?e:14}catch{return 14}}),Rt=e=>Lt(t=>Math.max(12,Math.min(20,t+e)));(0,r.useEffect)(()=>{try{localStorage.setItem(`hcFont`,String(Y))}catch{}At.current=0,Pt()},[Y]);let zt=(0,r.useRef)(null),[Bt,Vt]=(0,r.useState)(()=>{try{let e=parseFloat(localStorage.getItem(`hcSplit`));return e>=.3&&e<=.7?e:.5}catch{return .5}}),[Ht,Ut]=(0,r.useState)(!1);(0,r.useEffect)(()=>{try{localStorage.setItem(`hcSplit`,String(Bt))}catch{}},[Bt]);let Wt=e=>{let t=zt.current;if(!t)return;e.preventDefault(),Ut(!0);let n=e=>{let n=t.getBoundingClientRect();n.width&&Vt(Math.max(.3,Math.min(.7,(e.clientX-n.left)/n.width)))},r=()=>{Ut(!1),window.removeEventListener(`pointermove`,n),window.removeEventListener(`pointerup`,r)};window.addEventListener(`pointermove`,n),window.addEventListener(`pointerup`,r)};(0,r.useEffect)(()=>{let e=requestAnimationFrame(J);return()=>cancelAnimationFrame(e)},[C]);let[X,Z]=(0,r.useState)(null),Gt=(0,r.useRef)(null);(0,r.useLayoutEffect)(()=>{let e=Gt.current;if(!e||!X)return;let t=e.children[X.idx];if(!t)return;let n=t.offsetTop,r=n+t.offsetHeight;n<e.scrollTop?e.scrollTop=n:r>e.scrollTop+e.clientHeight&&(e.scrollTop=r-e.clientHeight)},[X]);let Kt=e=>{let t=e.target;tn.current&&(tn.current.scrollTop=t.scrollTop),Ot.current&&(Ot.current.scrollTop=t.scrollTop,Ot.current.scrollLeft=t.scrollLeft),Pt()},Q=()=>{let e=w.current,t=kt.current;if(!e||!t)return{x:0,y:0};let n=getComputedStyle(e),r=parseFloat(n.lineHeight)||24,i=parseFloat(n.paddingLeft)||0,a=parseFloat(n.paddingTop)||0,o=At.current;if(!o){let e=document.createElement(`span`);e.textContent=`M`.repeat(50),e.style.cssText=`position:absolute;visibility:hidden;white-space:pre;font-family:${n.fontFamily};font-size:${n.fontSize};font-feature-settings:"liga" 0,"calt" 0`,t.appendChild(e),o=e.getBoundingClientRect().width/50,e.remove(),At.current=o}let s=e.value.slice(0,e.selectionStart),c=s.split(`
`).length-1,l=i+(s.length-(s.lastIndexOf(`
`)+1))*o-e.scrollLeft,u=a+(c+1)*r-e.scrollTop;l=Math.max(4,Math.min(l,Math.max(4,t.clientWidth-246-6)));let d=u+250>t.clientHeight&&u>250;return d&&(u-=r),{x:l,y:u,above:d}},qt=(0,r.useRef)(0),Jt=(0,r.useRef)({at:-1,seq:-1}),Yt=()=>{let e=w.current;if(!e||document.activeElement!==e)return Z(null);let t=e.value,n=e.selectionStart;if(n!==e.selectionEnd||Jt.current.at===n&&Jt.current.seq===qt.current)return Z(null);let r=e=>Z(t=>t&&t.kind===e.kind&&t.from===e.from&&t.items.length===e.items.length?{...e,idx:Math.min(t.idx,e.items.length-1)}:e),i=t.slice(0,n);if(G===`css`){if(!ne.length)return Z(null);let e=i.lastIndexOf(`{`),t=i.lastIndexOf(`}`);if(e===-1||t>e)return Z(null);let a=i.slice(Math.max(e,i.lastIndexOf(`;`),i.lastIndexOf(`
`))+1),o=/^\s*([a-z-]+)\s*:\s*([a-zA-Z0-9#.%-]*)$/.exec(a);if(o){let e=ne.find(e=>e.p===o[1]);if(!e)return Z(null);let t=o[2],i=e.v.filter(e=>e.startsWith(t)).map(e=>({a:e,d:``}));return i.length?r({kind:`cssval`,src:`lt`,items:i,idx:0,from:n-t.length,...Q()}):Z(null)}let s=/^\s*([a-z-]+)$/.exec(a);if(s){let e=s[1],t=ne.filter(t=>t.p.startsWith(e)).sort((t,n)=>(t.p===e?0:1)-(n.p===e?0:1));return t.length?r({kind:`cssprop`,src:`lt`,items:t,idx:0,from:n-e.length,...Q()}):Z(null)}return Z(null)}if(G===`js`){if(!re.length)return Z(null);let e=i.lastIndexOf(`
`)+1,t=i.slice(e);if(t.includes(`//`)||i.lastIndexOf(`/*`)>i.lastIndexOf(`*/`))return Z(null);let a=null;for(let e of t)a?e===a&&(a=null):(e===`"`||e===`'`||e==="`")&&(a=e);if(a)return Z(null);let o=/([A-Za-z_$.][\w$.]*)$/.exec(t);if(!o||o[1].replace(/^\./,``).length<2)return Z(null);let s=e=>re.filter(t=>t.k.startsWith(e)).sort((t,n)=>(t.k===e?0:1)-(n.k===e?0:1)),c=o[1],l=s(c);return!l.length&&c.includes(`.`)&&(c=c.slice(c.lastIndexOf(`.`)),l=s(c)),l.length?r({kind:`js`,src:`bare`,items:l,idx:0,from:n-c.length,...Q()}):Z(null)}if(G!==`html`)return Z(null);let a=(e,t,n)=>e.filter(e=>e[t].startsWith(n)).sort((e,r)=>(e[t]===n?0:1)-(r[t]===n?0:1)),o=/<([a-zA-Z][a-zA-Z0-9-]*)?$/.exec(i);if(o&&i[o.index+1]!==`/`){let e=a(h,`t`,(o[1]||``).toLowerCase());return e.length?r({kind:`tag`,src:`lt`,items:e,idx:0,from:o.index,...Q()}):Z(null)}let s=/<([a-zA-Z][a-zA-Z0-9-]*)(?:"[^"]*"|'[^']*'|[^<>"'])*\s([a-zA-Z-]+)="([a-zA-Z0-9-]*)$/.exec(i);if(s){let e=s[1].toLowerCase(),t=s[2].toLowerCase(),i=s[3].toLowerCase(),o=[...g[e]||[],...g[`*`]||[]].find(e=>e.a===t),c=o&&o.v?a(o.v.map(e=>({a:e,d:``})),`a`,i):[];return c.length?r({kind:`val`,src:`lt`,items:c,idx:0,from:n-i.length,...Q()}):Z(null)}let c=/<([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^<>"'])*)\s([a-zA-Z-]*)$/.exec(i);if(c){let e=c[1].toLowerCase(),t=(c[3]||``).toLowerCase(),i=c[2],o=a([...g[e]||[],...g[`*`]||[]],`a`,t).filter(e=>!RegExp(`(^|\\s)`+e.a+`\\s*=`).test(i));return o.length?r({kind:`attr`,src:`lt`,items:o,idx:0,from:n-t.length,...Q()}):Z(null)}let l=i.lastIndexOf(`
`)+1,u=/(?:^[ \t]*|<[a-zA-Z][^<>]*>)([a-zA-Z][a-zA-Z0-9-]*)$/.exec(i.slice(l)),d=t.slice(n).split(`
`)[0];if(u&&(!d.trim()||/^\s*<\/[a-zA-Z][a-zA-Z0-9-]*>\s*$/.test(d))&&!we(i.slice(0,n-u[1].length))){let e=a(h,`t`,u[1].toLowerCase());return e.length?r({kind:`tag`,src:`bare`,items:e,idx:0,from:n-u[1].length,...Q()}):Z(null)}Z(null)},Xt=e=>{let t=w.current;if(!t||!X)return;let n=t.selectionStart;if(t.setSelectionRange(X.from,n),X.kind===`attr`){U(t,e.a+`=""`,X.from+e.a.length+2),Z(null);return}if(X.kind===`val`||X.kind===`cssval`){U(t,e.a,X.from+e.a.length),Z(null);return}if(X.kind===`cssprop`){U(t,e.p+`: `,X.from+e.p.length+2),Z(null);return}if(X.kind===`js`){let n=t.value,r=n.lastIndexOf(`
`,X.from-1)+1,i=(/^[ \t]*/.exec(n.slice(r,X.from))||[``])[0],a=e.body.split(`
`).join(`
`+i),o=a.indexOf(`()`)===-1?a.indexOf(`
`+i+`  
`)===-1?a.length:a.indexOf(`
`+i+`  
`)+i.length+3:a.indexOf(`()`)+1;U(t,a,X.from+o),Z(null);return}let r=e.t,i=t.value,a=i.lastIndexOf(`
`,X.from-1)+1,o=(/^[ \t]*/.exec(i.slice(a,X.from))||[``])[0],{body:s,caret:c}=pe(r,o);U(t,s,X.from+c),Z(null)},Zt=(e,t,n)=>{if(G!==`html`||!t||t===n)return;let r=e.selectionStart,i=/<([a-zA-Z][a-zA-Z0-9-]*)$/.exec(n.slice(0,r));if(!i)return;let a=i.index,o=i[1],s=/^<([a-zA-Z][a-zA-Z0-9-]*)/.exec(t.slice(a));if(!s)return;let c=s[1];if(c===o||O.has(c.toLowerCase()))return;let l=n.indexOf(`>`,r);if(l===-1)return;let u=1,d=l+1,f=RegExp(`<`+c+`(?=[\\s/>])`,`gi`),p=`</`+c+`>`;for(;d<n.length;){let t=n.toLowerCase().indexOf(p.toLowerCase(),d);if(t===-1)return;f.lastIndex=d;let i=0,a;for(;(a=f.exec(n))&&a.index<t;)i++;if(u+=i-1,u===0){e.setSelectionRange(t,t+p.length),document.execCommand(`insertText`,!1,`</`+o+`>`),e.setSelectionRange(r,r),H.current=r;return}d=t+p.length}},Qt=e=>{let t=e.target;if(!Mt.current){Mt.current=!0;try{Zt(t,jt.current,t.value)}catch{}finally{Mt.current=!1}}Tt(t.value),jt.current=t.value,qt.current+=1,W(),Yt(),J()},$t=(e,t)=>{let n=e.value,r=e.selectionStart,i=e.selectionEnd,a=n.lastIndexOf(`
`,r-1)+1,o=n.slice(a,r);if(r===i&&G===`html`&&!t){let t=(/^[ \t]*/.exec(o)||[``])[0],i=/(?:^[ \t]*|<[a-zA-Z][^<>]*>)([a-zA-Z][a-zA-Z0-9-]*)$/.exec(o),a=i?i[1].toLowerCase():null,s=null,c=r;if(a&&le.some(e=>e.t===a)&&!we(n.slice(0,r-a.length)))s=pe(a,t),c=r-a.length;else if(ee){let e=/([!a-zA-Z.#][a-zA-Z0-9.#>*_-]*)$/.exec(o),i=e?e[1]:null;if(i&&o[e.index-1]===`<`){let e=i.indexOf(`>`);i=e===-1?null:i.slice(e+1)||null}i&&(i!==`!`||o.trim()===`!`)&&!we(n.slice(0,r-i.length))&&(s=me(i,t,{classOn:te}),s&&(c=r-i.length))}if(s){e.setSelectionRange(c,r),document.execCommand(`insertText`,!1,s.body);let t=c+s.caret;e.setSelectionRange(t,t),H.current=t,Z(null);return}}if(t){let t=/^ {1,2}/.exec(n.slice(a,a+2));if(!t)return;let i=Math.max(a,r-t[0].length);e.setSelectionRange(a,a+t[0].length),document.execCommand(`delete`),e.setSelectionRange(i,i)}else U(e,`  `,r+2)},en=e=>{let t=e.target,n=t.value,r=t.selectionStart,i=t.selectionEnd,a=r===i,o=n.lastIndexOf(`
`,r-1)+1,s=n.slice(o,r);if(X){if(e.key===`ArrowDown`){e.preventDefault(),Z(e=>({...e,idx:(e.idx+1)%e.items.length}));return}if(e.key===`ArrowUp`){e.preventDefault(),Z(e=>({...e,idx:(e.idx-1+e.items.length)%e.items.length}));return}if(e.key===`Tab`||e.key===`Enter`&&X.src!==`bare`&&!e.shiftKey&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault(),Xt(X.items[X.idx]);return}if(e.key===`Enter`&&X.src===`bare`&&Z(null),e.key===`Escape`){e.preventDefault(),Jt.current={at:r,seq:qt.current},Z(null);return}}if((e.ctrlKey||e.metaKey)&&!e.altKey&&!e.shiftKey&&e.key===`/`){e.preventDefault();let a=n.lastIndexOf(`
`,r-1)+1,o=i>r&&n[i-1]===`
`?i-1:i,s=n.indexOf(`
`,o),c=s===-1?n.length:s,l=n.slice(a,c).split(`
`),u=G===`js`?{re:/^(\s*)\/\/ ?/,o:`// `,c:``}:G===`css`?{re:/^(\s*)\/\*\s?/,ce:/\s?\*\/\s*$/,o:`/* `,c:` */`}:{re:/^(\s*)<!--\s?/,ce:/\s?-->\s*$/,o:`<!-- `,c:` -->`},d=l.filter(e=>e.trim()),f=d.length>0&&d.every(e=>u.re.test(e)&&(!u.ce||u.ce.test(e))),p=l.map(e=>{if(!e.trim())return e;if(f){let t=e.replace(u.re,`$1`);return u.ce?t.replace(u.ce,``):t}let t=/^(\s*)([\s\S]*)$/.exec(e);return t[1]+u.o+t[2]+u.c}).join(`
`);t.setSelectionRange(a,c),document.execCommand(`insertText`,!1,p);let m=a+p.length;t.setSelectionRange(m,m),H.current=m;return}if(e.key===`Tab`){e.preventDefault(),$t(t,e.shiftKey);return}if(e.key===`Enter`&&a){let i=(/^[ \t]*/.exec(s)||[``])[0],a=/<[a-zA-Z][a-zA-Z0-9-]*(\s[^<>]*)?>$/.test(s.trimEnd()),o=/^<\//.test(n.slice(r)),c=s.trimEnd().slice(-1),l=G!==`html`&&c===`{`&&n[r]===`}`,u=G!==`html`&&c===`{`;e.preventDefault(),a&&o||l?U(t,`\n${i}  \n${i}`,r+1+i.length+2):u?U(t,`\n${i}  `,r+1+i.length+2):U(t,`\n${i}`,r+1+i.length);return}if(e.key===`>`&&a&&!e.ctrlKey&&!e.metaKey&&!e.altKey){let i=/<\/([a-zA-Z][a-zA-Z0-9-]*)$/.exec(n.slice(0,r));if(i){let a=`</${i[1]}>`;if(n.slice(r).startsWith(a)){e.preventDefault();let n=r-i[0].length;t.setSelectionRange(n,r),document.execCommand(`delete`);let o=n+a.length;t.setSelectionRange(o,o),H.current=o}return}let a=n.lastIndexOf(`<`,r-1);if(a===-1)return;let o=n.slice(a+1,r);if(!/^[a-zA-Z][a-zA-Z0-9-]*(\s[^<>]*)?$/.test(o)||/\/\s*$/.test(o))return;let s=/^[a-zA-Z][a-zA-Z0-9-]*/.exec(o)[0].toLowerCase();if(O.has(s)||n.slice(r).startsWith(`</${s}>`))return;e.preventDefault(),U(t,`></${s}>`,r+1);return}if(e.key===`"`&&a&&G===`html`&&!e.ctrlKey&&!e.metaKey&&!e.altKey){if(n[r]===`"`){e.preventDefault(),t.setSelectionRange(r+1,r+1),W();return}let i=n.lastIndexOf(`<`,r-1),a=n.lastIndexOf(`>`,r-1);if(i===-1||a>i)return;e.preventDefault(),U(t,`""`,r+1);return}let c=G!==`html`,l=!e.ctrlKey&&!e.metaKey&&!e.altKey,u={"{":`}`,"(":`)`,"[":`]`},d=G===`js`?[`"`,`'`,"`"]:G===`css`?[`"`,`'`]:[];if(l&&!a&&c&&(u[e.key]||d.includes(e.key))){e.preventDefault(),U(t,e.key+n.slice(r,i)+(u[e.key]||e.key),i+2);return}if(l&&a&&c){if((e.key===`)`||e.key===`]`||e.key===`}`||d.includes(e.key))&&n[r]===e.key){e.preventDefault(),t.setSelectionRange(r+1,r+1),W();return}if(u[e.key]){e.preventDefault(),U(t,e.key+u[e.key],r+1);return}if(d.includes(e.key)&&!/[A-Za-z0-9_'"`]/.test(n[r-1]||``)&&!/[A-Za-z0-9_]/.test(n[r]||``)){e.preventDefault(),U(t,e.key+e.key,r+1);return}}if(e.key===`Backspace`&&a&&r>0&&[`()`,`[]`,`{}`,`""`,`''`,"``"].includes(n.slice(r-1,r+1))){e.preventDefault(),t.setSelectionRange(r-1,r+1),document.execCommand(`delete`);return}},tn=(0,r.useRef)(null),nn=((x[C]??``).match(/\n/g)||[]).length+1,rn=(0,r.useMemo)(()=>Array.from({length:nn},(e,t)=>t+1).join(`
`),[nn]),[an,on]=(0,r.useState)(``),sn=e=>{on(e),setTimeout(()=>on(``),2400)},cn=()=>{let e=w.current;if(!e)return;let t=x[C]??``,n=oe(t);if(n==null)return sn(o({uz:`Avval sintaksis xatosini tuzating`,ru:`Сначала исправьте синтаксис`}));if(n===t)return sn(o({uz:`Kod allaqachon chiroyli 👍`,ru:`Код уже аккуратный 👍`}));e.focus(),e.setSelectionRange(0,t.length),document.execCommand(`insertText`,!1,n),e.setSelectionRange(0,0),H.current=0},ln=(e,t)=>{let n=w.current;if(!n||!e)return;let r=(t??x[C]??``).split(`
`),i=0;for(let t=0;t<Math.min(e-1,r.length);t++)i+=r[t].length+1;n.focus(),n.setSelectionRange(i,i),H.current=i},un=()=>{let e=j?++Le.current:null;j&&Be([]);let t=++st.current;ot(!1),it(!1),lt.current=null,Ze(Ye(e==null?{doneNonce:t}:{consoleNonce:e,doneNonce:t})),I(`doc`,t),R.current=L,mt(!1),K&&Dt(`result`)},[dn,fn]=(0,r.useState)(!1),$=(0,r.useRef)(null),pn=(0,r.useRef)(null),[mn,hn]=(0,r.useState)(!1),gn=(0,r.useRef)(null),_n=()=>{clearTimeout($.current),$.current=null,fn(!1)};(0,r.useEffect)(()=>()=>{clearTimeout($.current),clearTimeout(gn.current)},[]);let vn=()=>{if(!dn){fn(!0),clearTimeout($.current),$.current=setTimeout(()=>{$.current=null,fn(!1)},4e3);return}_n(),pn.current=x,S(Object.fromEntries(b.map(e=>[e.name,o(e.starter)??``]))),hn(!0),clearTimeout(gn.current),gn.current=setTimeout(()=>hn(!1),8e3)},yn=()=>{pn.current&&(S(pn.current),pn.current=null,hn(!1),clearTimeout(gn.current))},bn;return bn=mn?(0,i.jsxs)(`span`,{className:`hc-wait-msg`,children:[o({uz:`Kod tozalandi.`,ru:`Код очищен.`}),` `,(0,i.jsxs)(`button`,{type:`button`,className:`hc-undo`,onClick:yn,children:[`↶ `,o({uz:`Qaytarish`,ru:`Вернуть`})]})]}):dn?(0,i.jsxs)(`span`,{className:`hc-warn-msg`,children:[`⚠ `,o({uz:`Butun kod o'chadi — tugmani yana bosing`,ru:`Весь код сотрётся — нажмите кнопку ещё раз`})]}):B?(0,i.jsxs)(`span`,{className:`hc-ok-msg`,children:[`✓ `,o({uz:`Barcha shartlar bajarildi!`,ru:`Все условия выполнены!`})]}):wt?(0,i.jsxs)(`span`,{className:`hc-wait-msg`,children:[`✓ `,o({uz:`Shartlar bajarildi — sintaksis xatosi qoldi (yuqorida)`,ru:`Условия выполнены — остался синтаксис (см. выше)`})]}):(0,i.jsx)(`span`,{className:`hc-wait-msg`,children:o(K?M?{uz:`Shartlarni bajaring — «Console» tabida ko'rinadi`,ru:`Выполняйте условия — смотрите во вкладке «Console»`}:{uz:`Shartlarni bajaring — «Natija» tabida ko'rinadi`,ru:`Выполняйте условия — смотрите во вкладке «Результат»`}:{uz:`Shartlarni bajaring — natija o'ngda ko'rinadi`,ru:`Выполняйте условия — результат виден справа`})}),(0,i.jsxs)(`div`,{className:`hc-root${Ht?` dragging`:``}`,style:{"--hcfs":Y+`px`,"--hcL":Bt.toFixed(3)+`fr`,"--hcR":(1-Bt).toFixed(3)+`fr`},children:[(0,i.jsx)(Re,{}),(0,i.jsxs)(`header`,{className:`hc-top`,children:[_.eyebrow&&(0,i.jsx)(`span`,{className:`hc-eyebrow`,children:o(_.eyebrow)}),(0,i.jsx)(`h1`,{className:`hc-title`,children:o(_.title)}),_.brief&&(0,i.jsx)(`p`,{className:`hc-brief`,children:o(_.brief)}),(0,i.jsxs)(`div`,{className:`hc-checklist`,children:[(0,i.jsxs)(`span`,{className:`hc-count`,children:[St,`/`,v.length]}),v.map((e,t)=>(0,i.jsxs)(`span`,{className:`hc-chip ${z[t]?.ok?`ok`:``}`,title:z[t]?.hint||``,children:[(0,i.jsx)(`span`,{className:`hc-dot`,children:z[t]?.ok?`✓`:t+1}),o(e.label)]},e.id))]}),(0,i.jsx)(`div`,{className:`hc-msg`,children:an?(0,i.jsx)(`p`,{className:`hc-note`,children:an}):V.length>0?(0,i.jsxs)(`button`,{type:`button`,className:`hc-err`,onClick:()=>ln(V[0].line),title:`${o({uz:`Qator`,ru:`Строка`})} ${V[0].line}: ${V[0].msg}\n${o({uz:`Bosing — kursor shu qatorga tushadi`,ru:`Нажмите — курсор перейдёт на эту строку`})}`,children:[(0,i.jsxs)(`span`,{className:`hc-err-text`,children:[`⚠ `,o({uz:`Qator`,ru:`Строка`}),` `,V[0].line,`: `,V[0].msg]}),V.length>1&&(0,i.jsxs)(`b`,{className:`hc-err-more`,children:[`+`,V.length-1]})]}):!B&&Ct&&(0,i.jsxs)(`p`,{className:`hc-hint`,children:[`💡 `,Ct]})})]}),K&&(0,i.jsxs)(`div`,{className:`hc-panetabs`,role:`tablist`,children:[(0,i.jsxs)(`button`,{type:`button`,role:`tab`,"aria-selected":q===`code`,className:q===`code`?`on`:``,onClick:()=>Dt(`code`),children:[`⌨ `,o({uz:`Kod`,ru:`Код`})]}),(0,i.jsx)(`button`,{type:`button`,role:`tab`,"aria-selected":q===`result`,className:q===`result`?`on`:``,onClick:()=>Dt(`result`),children:M?`🖥️ Console`:(0,i.jsxs)(i.Fragment,{children:[`📺 `,o({uz:`Natija`,ru:`Результат`})]})})]}),(0,i.jsxs)(`main`,{ref:zt,className:`hc-split${K?` tabbed pane-${q}`:``}`,children:[(0,i.jsxs)(`section`,{className:`hc-pane hc-editor-pane`,children:[(0,i.jsxs)(`div`,{className:`hc-pane-bar hc-tabs-bar`,children:[(0,i.jsxs)(`span`,{className:`hc-dots`,children:[(0,i.jsx)(`i`,{}),(0,i.jsx)(`i`,{}),(0,i.jsx)(`i`,{})]}),(0,i.jsx)(`div`,{className:`hc-tabs`,children:b.map(e=>(0,i.jsx)(`button`,{className:`hc-tab ${C===e.name?`active`:``}`,onClick:()=>he(e.name),children:e.name},e.name))}),(0,i.jsxs)(`div`,{className:`hc-tools`,children:[(0,i.jsx)(`button`,{className:`hc-ic`,onMouseDown:e=>e.preventDefault(),onClick:()=>{w.current?.focus(),document.execCommand(`undo`)},title:o({uz:`Orqaga qaytarish (Ctrl+Z)`,ru:`Отменить (Ctrl+Z)`}),"aria-label":o({uz:`Orqaga qaytarish`,ru:`Отменить`}),children:`↶`}),(0,i.jsx)(`button`,{className:`hc-ic`,onMouseDown:e=>e.preventDefault(),onClick:()=>{w.current?.focus(),document.execCommand(`redo`)},title:o({uz:`Qaytarilganni tiklash (Ctrl+Y)`,ru:`Вернуть (Ctrl+Y)`}),"aria-label":o({uz:`Tiklash`,ru:`Вернуть`}),children:`↷`}),G===`html`&&(0,i.jsxs)(`button`,{className:`hc-ic wide`,onMouseDown:e=>e.preventDefault(),onClick:cn,title:o({uz:`Kodni chiroyli chekintiradi`,ru:`Аккуратно расставит отступы`}),children:[`✨ `,o({uz:`Chiroyli`,ru:`Красиво`})]})]}),(0,i.jsxs)(`button`,{className:`hc-mini`,onClick:un,title:o({uz:`Ishga tushirish`,ru:`Запустить`}),children:[`▶ `,o({uz:`Ishga tushirish`,ru:`Запустить`})]})]}),(0,i.jsxs)(`div`,{className:`hc-editor-wrap`,children:[(0,i.jsx)(`div`,{className:`hc-gutter`,ref:tn,"aria-hidden":`true`,children:rn}),(0,i.jsxs)(`div`,{className:`hc-code-box`,ref:kt,children:[(0,i.jsx)(`pre`,{className:`hc-hl`,ref:Ot,"aria-hidden":`true`,dangerouslySetInnerHTML:{__html:ie(x[C]??``,G)+`
`}}),(0,i.jsx)(`div`,{className:`hc-curline`,ref:Nt,"aria-hidden":`true`}),(0,i.jsx)(`textarea`,{ref:w,className:`hc-code`,value:x[C]??``,onChange:Qt,onKeyDown:en,onKeyUp:()=>{W(),Yt(),J()},onSelect:()=>{W(),Yt(),J()},onFocus:()=>{W(),J()},onBlur:()=>{bt(!1),Z(null),Pt()},onScroll:Kt,spellCheck:!1,autoCapitalize:`off`,autoCorrect:`off`,placeholder:o(b.find(e=>e.name===C)?.placeholder??_.placeholder??{uz:`Kodingizni shu yerga yozing…`,ru:`Пишите свой код здесь…`})}),X&&(0,i.jsxs)(`div`,{className:`hc-menu${X.above?` up`:``}`,style:{left:X.x,top:X.y},role:`listbox`,onMouseDown:e=>e.preventDefault(),children:[(0,i.jsx)(`div`,{className:`hc-menu-list`,ref:Gt,children:X.items.map((e,t)=>(0,i.jsxs)(`button`,{role:`option`,"aria-selected":t===X.idx,className:`hc-menu-row ${t===X.idx?`on`:``}`,onClick:()=>Xt(e),children:[(0,i.jsx)(`span`,{className:`hc-menu-k`,children:X.kind===`tag`?`<${e.t}>`:X.kind===`val`?`"${e.a}"`:X.kind===`cssprop`?`${e.p}:`:e.a??e.k}),(0,i.jsx)(`span`,{className:`hc-menu-d`,children:o(e.d)})]},e.t||e.a||e.p||e.k))}),(0,i.jsx)(`span`,{className:`hc-menu-tip`,children:Et?o({uz:`Bosib tanlang`,ru:`Нажмите, чтобы выбрать`}):X.src===`bare`?o({uz:`Tab — tanlash · Esc — yopish`,ru:`Tab — выбрать · Esc — закрыть`}):o({uz:`Enter — tanlash · Esc — yopish`,ru:`Enter — выбрать · Esc — закрыть`})})]})]})]}),Et&&(0,i.jsxs)(`div`,{className:`hc-keys`,children:[(c[G]||c.html).map(e=>(0,i.jsx)(`button`,{type:`button`,className:`hc-key`,onMouseDown:e=>e.preventDefault(),onClick:()=>{let t=w.current;t&&U(t,e,t.selectionStart+e.length)},children:e},e)),(0,i.jsx)(`button`,{type:`button`,className:`hc-key wide`,onMouseDown:e=>e.preventDefault(),onClick:()=>{let e=w.current;e&&(X?Xt(X.items[X.idx]):$t(e,!1))},title:o({uz:`Tab — tegni yoyish / ichkariga surish`,ru:`Tab — раскрыть тег / отступ`}),children:`⇥`})]}),!K&&(0,i.jsxs)(`div`,{className:`hc-statusbar`,children:[(0,i.jsx)(`span`,{className:`hc-sb-file`,children:C}),(0,i.jsx)(`span`,{className:`hc-sb-lang`,children:G}),(0,i.jsxs)(`div`,{className:`hc-sb-font`,children:[(0,i.jsx)(`button`,{type:`button`,className:`hc-sb-btn`,onMouseDown:e=>e.preventDefault(),onClick:()=>Rt(-1),title:o({uz:`Shriftni kichraytirish`,ru:`Уменьшить шрифт`}),"aria-label":o({uz:`Shriftni kichraytirish`,ru:`Уменьшить шрифт`}),children:`A−`}),(0,i.jsx)(`span`,{className:`hc-sb-fs`,children:Y}),(0,i.jsx)(`button`,{type:`button`,className:`hc-sb-btn`,onMouseDown:e=>e.preventDefault(),onClick:()=>Rt(1),title:o({uz:`Shriftni kattalashtirish`,ru:`Увеличить шрифт`}),"aria-label":o({uz:`Shriftni kattalashtirish`,ru:`Увеличить шрифт`}),children:`A+`})]}),(0,i.jsxs)(`span`,{className:`hc-sb-pos`,children:[o({uz:`Qator`,ru:`Строка`}),` `,Ft.ln,`, `,o({uz:`Ustun`,ru:`Столбец`}),` `,Ft.col]})]})]}),!K&&(0,i.jsx)(`div`,{className:`hc-divider`,role:`separator`,"aria-orientation":`vertical`,onPointerDown:Wt,onDoubleClick:()=>Vt(.5),title:o({uz:`Sudrang — panellar kengligi o'zgaradi · 2 marta bosish — teng`,ru:`Тяните — изменится ширина панелей · двойной клик — поровну`}),children:(0,i.jsx)(`i`,{})}),(0,i.jsxs)(`section`,{className:`hc-pane hc-preview-pane${M?` console-only`:``}`,children:[(0,i.jsxs)(`div`,{className:`hc-pane-bar`,children:[_.previewUrl?(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(`span`,{className:`hc-dots`,children:[(0,i.jsx)(`i`,{}),(0,i.jsx)(`i`,{}),(0,i.jsx)(`i`,{})]}),(0,i.jsxs)(`span`,{className:`hc-url`,children:[(0,i.jsx)(`span`,{className:`hc-lock`,children:`●`}),o(_.previewUrl)]})]}):M?(0,i.jsx)(`span`,{className:`hc-pane-name`,children:`🖥️ Console`}):(0,i.jsxs)(`span`,{className:`hc-pane-name`,children:[`📺 `,o({uz:`Natija`,ru:`Результат`})]}),pt?(0,i.jsx)(`span`,{className:`hc-stale`,children:o({uz:`eskirdi · ▶ bosing`,ru:`устарело · нажмите ▶`})}):(0,i.jsx)(`span`,{className:`hc-live`,children:o({uz:`jonli`,ru:`live`})})]}),!rt&&(0,i.jsx)(`iframe`,{ref:Ae,className:`hc-frame`,title:`natija`,sandbox:`allow-scripts allow-popups allow-popups-to-escape-sandbox`,srcDoc:Xe},tt),at&&(0,i.jsx)(`div`,{className:`hc-hung`,role:`alert`,children:et}),j&&(0,i.jsxs)(`div`,{className:`hc-console`,children:[(0,i.jsxs)(`div`,{className:`hc-console-bar`,children:[!M&&(0,i.jsx)(`span`,{className:`hc-console-title`,children:`🖥️ Console`}),P.length>0&&(0,i.jsxs)(`span`,{className:`hc-console-count`,children:[P.length,N.dropped>0?` · `+o({uz:`eng eski ${N.dropped} yashirildi`,ru:`скрыто старых: ${N.dropped}`}):``]}),Ue>0&&(0,i.jsxs)(`button`,{className:`hc-console-new`,onClick:Ge,children:[`↓ `,o({uz:`yangi ${Ue}`,ru:`новых ${Ue}`})]}),P.length>0&&(0,i.jsx)(`button`,{className:`hc-console-clear`,onClick:()=>Be([]),children:o({uz:`tozalash`,ru:`очистить`})})]}),(0,i.jsx)(`div`,{className:`hc-console-body`,ref:Ve,onScroll:qe,children:P.length===0?(0,i.jsx)(`div`,{className:`hc-console-empty`,children:o({uz:`console.log(...) natijasi shu yerda chiqadi`,ru:`результат console.log(...) появится здесь`})}):P.map((e,t)=>e.level===`clear`?(0,i.jsx)(`div`,{className:`hc-console-line lvl-clear`,children:(0,i.jsxs)(`span`,{className:`hc-console-text`,children:[`— `,o({uz:`console.clear() — tozalandi`,ru:`console.clear() — очищено`}),` —`]})},t):e.level===`error`&&e.file?(0,i.jsxs)(`div`,{className:`hc-console-line lvl-${e.level} has-pos`,title:e.text,onClick:()=>{b.some(t=>t.name===e.file)&&(he(e.file),setTimeout(()=>ln(e.line,x[e.file]),0))},children:[(0,i.jsx)(`span`,{className:`hc-console-caret`,children:`›`}),(0,i.jsxs)(`span`,{className:`hc-console-pos`,children:[e.file,`:`,e.line]}),(0,i.jsx)(`span`,{className:`hc-console-text`,children:Pe(e.text,e.hint)})]},t):(0,i.jsxs)(`div`,{className:`hc-console-line lvl-${e.level}${e.level===`warn`&&Fe.test(e.text)?` is-modal`:``}`,title:e.level===`error`&&/^Uncaught /.test(e.text)?e.text:void 0,children:[(0,i.jsx)(`span`,{className:`hc-console-caret`,children:e.level===`warn`&&Fe.test(e.text)?`⚠`:`›`}),(0,i.jsx)(`span`,{className:`hc-console-text`,children:e.level===`error`&&/^Uncaught /.test(e.text)?Pe(e.text,e.hint):e.level===`warn`&&Ie(e.text)||e.text})]},t))})]})]})]}),k&&!rt&&(0,i.jsx)(`iframe`,{ref:je,"aria-hidden":`true`,tabIndex:-1,title:`tekshiruv`,sandbox:`allow-scripts`,srcDoc:Qe,style:{position:`fixed`,left:`-9999px`,top:0,width:1,height:1,opacity:0,pointerEvents:`none`,border:`none`}},tt),(0,i.jsxs)(`footer`,{className:`hc-bottom`,children:[d&&(0,i.jsxs)(`button`,{className:`hc-ghost`,onClick:d,children:[`← `,o({uz:`Orqaga`,ru:`Назад`})]}),(0,i.jsx)(`button`,{className:`hc-ghost${dn?` armed`:``}`,onClick:vn,onBlur:_n,title:o({uz:`Kodni boshlang'ich holatga qaytaradi`,ru:`Вернуть код к начальному виду`}),children:dn?`⚠ ${o({uz:`Rostdanmi?`,ru:`Точно?`})}`:o({uz:`Qaytadan`,ru:`Заново`})}),(0,i.jsx)(`div`,{className:`hc-status`,children:bn}),(0,i.jsxs)(`button`,{className:`hc-next`,disabled:!B,title:B?``:o(wt?{uz:`Sintaksis xatosi tuzatilsa ochiladi`,ru:`Откроется после исправления синтаксиса`}:{uz:`Barcha shartlar bajarilsa ochiladi`,ru:`Откроется, когда все условия выполнены`}),onClick:()=>B&&n&&n({codes:x,code:T}),children:[o({uz:`Davom etish`,ru:`Продолжить`}),` →`]})]})]})}var Le=`https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap`;function Re(){return(0,r.useEffect)(()=>{if(typeof document>`u`||document.getElementById(`hc-fonts`))return;let e=document.createElement(`link`);e.id=`hc-fonts`,e.rel=`stylesheet`,e.href=Le,document.head.appendChild(e)},[]),(0,i.jsx)(`style`,{children:`
      .hc-root,.hc-root *{box-sizing:border-box}
      .hc-root{font-family:'Manrope',system-ui,sans-serif;color:${d.ink};background:
        radial-gradient(120% 80% at 50% -10%, ${d.accentSoft} 0%, rgba(255,237,229,0) 46%),
        ${d.bg};
        /* Keng ekranda dars bilan bir xil masshtab (--lz), lekin balandlik zoomga BO'LINADI —
           aks holda 100dvh zoomga ko'payib, kompilyatorning pasti ekrandan chiqib ketadi (F-0808-02). */
        zoom:var(--lz,1);height:calc(100dvh / var(--lz,1));
        /* F-0813-01: 1160px «kichkina ramka» e'tirozi — desktopda +50% kengaytirildi.
           Balandlik TEGILMAGAN (100dvh o'zgarishsiz); kichik ekranda width:100% cap. */
        display:flex;flex-direction:column;justify-content:safe center;gap:clamp(12px,1.8vw,18px);padding:clamp(16px,2.4vw,30px);overflow:hidden;-webkit-font-smoothing:antialiased;width:100%;max-width:1740px;margin:0 auto}

      .hc-top{display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px}
      .hc-eyebrow{font-size:11px;letter-spacing:.2em;text-transform:uppercase;font-weight:800;color:${d.accent};display:inline-flex;align-items:center;gap:7px}
      .hc-eyebrow::before{content:"";width:6px;height:6px;border-radius:50%;background:${d.accent}}
      .hc-title{font-family:Georgia,serif;font-size:clamp(22px,3vw,32px);margin:0;color:${d.ink};font-weight:600;letter-spacing:-.015em;line-height:1.12}
      .hc-brief{margin:0;color:${d.ink2};font-size:clamp(13px,1.5vw,15px);line-height:1.55;max-width:60ch}

      .hc-checklist{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:6px}
.hc-title,.hc-brief,.hc-chip,.hc-hint{user-select:none;-webkit-user-select:none} /* F-1017-224 (mentor): vazifa matni/shart/maslahatdagi kod belgilanmaydi — o'quvchi nusxalamasdan o'zi teradi */
      .hc-count{font-family:'JetBrains Mono',monospace; font-feature-settings: "liga" 0, "calt" 0;font-weight:700;font-size:12px;color:#fff;background:linear-gradient(135deg,${d.accent},${d.accent2});padding:6px 11px;border-radius:99px;box-shadow:0 6px 16px -6px rgba(255,77,38,.5)}
      .hc-chip{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:500;color:${d.ink2};background:${d.paper};padding:6px 14px 6px 7px;border-radius:99px;border:1px solid ${d.line};box-shadow:0 1px 2px rgba(${d.shadowBase},.04);transition:all .22s ease;cursor:default}
      .hc-chip.ok{color:${d.ink};font-weight:600;border-color:${d.success}40;background:${d.successSoft}}
      .hc-dot{flex-shrink:0;width:21px;height:21px;border-radius:50%;background:${d.bg};color:${d.ink3};display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;transition:all .25s}
      .hc-chip.ok .hc-dot{background:${d.success};color:#fff;box-shadow:0 3px 8px -2px ${d.success}88}
      /* F-0808-02: qat'iy balandlik — xabar paydo bo'lganda/yo'qolganda muharrir SAKRAMAYDI */
      .hc-msg{height:40px;width:100%;display:flex;align-items:center;justify-content:center;margin-top:3px;overflow:hidden}
      .hc-hint.hc-hint{margin:0;font-size:13px;color:${d.warn};background:#FFF6EA;border:1px solid #F4DFBC;padding:8px 15px;border-radius:11px;max-width:76ch;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      /* K-M-02: tugma flex — matn (span) kesiladi, «+N» belgisi qisilmaydi va doim ko'rinadi */
      .hc-err{font-size:12.5px;color:#C01024;background:#FDECEC;border:1px solid #F6CFCF;padding:7px 14px;border-radius:10px;font-family:'JetBrains Mono',monospace; font-feature-settings: "liga" 0, "calt" 0;max-width:min(100%,96ch);line-height:1.4;display:inline-flex;align-items:center;gap:8px;min-width:0;cursor:pointer;text-align:left}
      .hc-err-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
      .hc-err:hover{background:#FBDFDF;border-color:#EEB8B8}
      .hc-err-more{flex-shrink:0;background:#C01024;color:#fff;border-radius:99px;padding:1px 7px;font-size:11px}

      /* F-0813-01: 3 ustun — editor | sudraluvchi chegara | natija. Ulush --hcL/--hcR
         o'zgaruvchilarida (30–70%), sudralganda JS yangilaydi, tanlov eslab qolinadi. */
      /* F-1004-18: past ekranda (1280×773) sarlavha + ro'yxat + 62dvh sig'masdi — markazlash tepani kesardi.
         Endi panel qisqaradi (balandlik doimiy, xabar paydo bo'lganda sakramaydi), tepa «safe center» bilan kesilmaydi. */
      .hc-split{flex:0 1 auto;height:calc(62dvh / var(--lz,1));min-height:240px;display:grid;grid-template-columns:minmax(0,var(--hcL,1fr)) 12px minmax(0,var(--hcR,1fr));gap:clamp(3px,.4vw,5px)}
      .hc-pane{display:flex;flex-direction:column;min-height:0;border-radius:18px;overflow:hidden;background:${d.paper};box-shadow:0 1px 0 ${d.line},0 18px 40px -22px rgba(${d.shadowBase},.35)}
      .hc-pane-bar{display:flex;align-items:center;gap:10px;padding:10px 15px;font-size:12px;font-weight:600;color:${d.ink2}}
      .hc-editor-pane .hc-pane-bar{background:${f.bg};color:#A7B6D6;border-bottom:1px solid rgba(255,255,255,.06)}
      .hc-preview-pane .hc-pane-bar{background:${d.paper};border-bottom:1px solid ${d.line}}
      .hc-dots{display:inline-flex;gap:6px;flex-shrink:0}
      .hc-dots i{width:11px;height:11px;border-radius:50%;background:#3A4760;display:block}
      .hc-dots i:nth-child(1){background:#ff5f56}.hc-dots i:nth-child(2){background:#ffbd2e}.hc-dots i:nth-child(3){background:#27c93f}
      .hc-pane-name{font-family:'JetBrains Mono',monospace; font-feature-settings: "liga" 0, "calt" 0;font-weight:700}
      /* Soxta brauzer manzil-qatori — task.previewUrl berilganda (F-0809-05) */
      .hc-url{font-family:'JetBrains Mono',monospace; font-feature-settings: "liga" 0, "calt" 0;font-size:11px;color:${d.ink2};display:flex;align-items:center;gap:6px;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
      .hc-lock{color:${d.success};font-size:8px;flex-shrink:0}
      .hc-live{margin-left:auto;font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:${d.success};background:${d.successSoft};padding:4px 9px;border-radius:99px;font-weight:800;display:inline-flex;align-items:center;gap:6px}
      .hc-live::before{content:"";width:6px;height:6px;border-radius:50%;background:${d.success};animation:hc-pulse 1.8s infinite}
      /* Kod o'zgardi, natija hali eski (F-0809-03) */
      .hc-stale{margin-left:auto;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:${d.warn};background:#FFF3E0;padding:4px 9px;border-radius:99px;font-weight:800;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
      .hc-stale::before{content:"";width:6px;height:6px;border-radius:50%;background:${d.warn}}
      @keyframes hc-pulse{0%{box-shadow:0 0 0 0 ${d.success}66}70%{box-shadow:0 0 0 6px ${d.success}00}100%{box-shadow:0 0 0 0 ${d.success}00}}

      /* K-E-01: tablar QISILMAYDI (flex-shrink:0) va joy yetmasa gorizontal suriladi — 1024–1400px
         va telefonda style.css/script.js 0 gacha qisilib yo'qolardi. Tor panelda ▶/✨ ikonkaga ixchamlashadi. */
      .hc-tabs{display:flex;gap:4px;flex:1 1 auto;min-width:0;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-webkit-overflow-scrolling:touch}
      .hc-tabs::-webkit-scrollbar{display:none}
      .hc-tab{flex-shrink:0}
      .hc-tab{background:transparent;border:none;color:#7E92B4;font-family:'JetBrains Mono',monospace; font-feature-settings: "liga" 0, "calt" 0;font-size:12px;font-weight:600;padding:6px 13px;border-radius:9px;cursor:pointer;transition:all .15s;white-space:nowrap}
      .hc-tab:hover{color:#cfe0ff;background:rgba(255,255,255,.06)}
      .hc-tab.active{color:#fff;background:rgba(255,255,255,.14);box-shadow:inset 0 -2px 0 ${d.accent}}
      .hc-mini{margin-left:auto;background:linear-gradient(135deg,${d.accent},${d.accent2});color:#fff;border:none;border-radius:9px;padding:6px 13px;font-size:11.5px;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif;transition:all .18s;flex-shrink:0;box-shadow:0 6px 14px -6px rgba(255,77,38,.6)}
      .hc-mini:hover{transform:translateY(-1px);box-shadow:0 9px 18px -6px rgba(255,77,38,.7)}
      .hc-mini:active{transform:translateY(0)}

      .hc-editor-wrap{flex:1;min-height:0;display:flex;background:${f.bg};overflow:hidden}
      .hc-gutter{flex:0 0 auto;padding:18px 10px 18px 16px;font-family:'JetBrains Mono',monospace; font-feature-settings: "liga" 0, "calt" 0;font-size:var(--hcfs,14px);line-height:1.7;color:#41527A;text-align:right;white-space:pre;user-select:none;overflow:hidden;pointer-events:none}
      /* overflow:hidden — joriy-qator chizig'i surilganda quti tashqarisiga chiqmasin */
      .hc-code-box{position:relative;flex:1;min-width:0;min-height:0;overflow:hidden}

      /* 🔴 RANG QATLAMI: quyidagi UCHTA xossa .hc-hl va .hc-code da AYNAN bir xil
         bo'lishi shart (shrift, o'lcham, qator balandligi, chekinish, white-space) —
         bitta piksel farq qilsa, harflar kursordan siljib ketadi. */
      .hc-hl,.hc-code{position:absolute;inset:0;margin:0;border:none;
        font-family:'JetBrains Mono',monospace; font-feature-settings: "liga" 0, "calt" 0;font-size:var(--hcfs,14px);line-height:1.7;letter-spacing:0;
        padding:18px 20px 18px 12px;tab-size:2;white-space:pre;overflow:auto}
      .hc-hl{color:${f.text};background:${f.bg};pointer-events:none;overflow:hidden;z-index:0}
      .hc-code{resize:none;outline:none;background:transparent;color:transparent;caret-color:${d.accent2};z-index:1}
      .hc-code::placeholder{color:#5B6B86}
      /* yarim-shaffof: tanlangan matn ostidagi rangli harflar ko'rinib tursin */
      .hc-code::selection{background:rgba(255,138,61,.34)}
      .hc-hl i{font-style:normal}
      .hc-hl .t-tag{color:${f.tag}}
      .hc-hl .t-attr{color:${f.attr}}
      .hc-hl .t-str{color:${f.str}}
      .hc-hl .t-comment{color:${f.comment};font-style:italic}
      .hc-hl .t-punct{color:${f.punct}}
      .hc-hl .t-num{color:${f.num}}

      /* Taklif-ro'yxati (teg va atribut) */
      .hc-menu{position:absolute;z-index:5;min-width:230px;max-width:330px;background:#16213A;border:1px solid #2C3C5E;border-radius:12px;padding:5px;box-shadow:0 18px 40px -12px rgba(0,0,0,.6);display:flex;flex-direction:column;gap:1px}
      /* ~8 qator ko'rinadi, qolgani suriladi; yorliq pastda QOTIB turadi */
      .hc-menu-list{display:flex;flex-direction:column;gap:1px;max-height:248px;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#3A4C70 transparent}
      .hc-menu-list::-webkit-scrollbar{width:8px}
      .hc-menu-list::-webkit-scrollbar-thumb{background:#3A4C70;border-radius:99px}
      .hc-menu-row{display:flex;align-items:baseline;gap:9px;width:100%;text-align:left;background:transparent;border:none;border-radius:8px;padding:7px 10px;cursor:pointer;color:#C9D6EE;font-family:'Manrope',sans-serif}
      .hc-menu-row:hover{background:rgba(255,255,255,.07)}
      .hc-menu-row.on{background:${d.accent}2E;outline:1px solid ${d.accent}77}
      .hc-menu-k{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:${f.tag};white-space:nowrap;font-feature-settings:"liga" 0,"calt" 0}
      .hc-menu-d{font-size:12px;color:#8FA2C4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .hc-menu-tip{padding:5px 10px 3px;font-size:10.5px;color:#61759B;font-family:'Manrope',sans-serif;border-top:1px solid #26344F;margin-top:2px}

      /* Muharrir tugmachalari: ↶ ↷ ✨ */
      .hc-tools{display:flex;align-items:center;gap:4px;margin-left:10px;flex-shrink:0}
      .hc-ic{background:rgba(255,255,255,.07);color:#B9C8E4;border:none;border-radius:8px;min-width:28px;height:26px;padding:0 7px;font-size:14px;line-height:1;cursor:pointer;transition:all .15s;font-family:'Manrope',sans-serif}
      .hc-ic.wide{font-size:11.5px;font-weight:700;padding:0 10px}
      .hc-ic:hover{background:rgba(255,255,255,.16);color:#fff}
      .hc-note{margin:0;font-size:13px;font-weight:600;color:${d.ink2};background:${d.paper};border:1px solid ${d.line};padding:8px 15px;border-radius:11px;white-space:nowrap}
      @media (max-width:720px){ .hc-ic.wide{font-size:0;padding:0 8px} .hc-ic.wide::after{content:"✨";font-size:13px} }

      /* 🔴 F-0808-02 LIGATURA: JetBrains Mono izoh-ochilishini chap strelka deb, izoh-yopilishini
         o'ng strelka deb chizadi; yopuvchi-teg boshi va o'zi-yopiluvchi teg oxiri bir-biriga
         qo'shilib ketadi. HTML o'rganayotgan bola o'zi yozgan belgini ko'rmay qoladi.
         Shuning uchun barcha kod-matnda ligatura O'CHIRILGAN.
         DIQQAT: font-variant-ligatures QO'SHILMAYDI — u qo'shilsa Chrome bu qatorni e'tiborsiz qoldiradi. */
      .hc-code,.hc-hl,.hc-gutter,.hc-err,.hc-count,.hc-pane-name,.hc-tab,.hc-console-title,.hc-console-body{font-feature-settings:"liga" 0,"calt" 0}

      .hc-frame{flex:1;min-height:0;width:100%;border:none;background:#fff}
      .hc-hung{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;font-size:14px;line-height:1.55;font-weight:700;color:#9A2A0F;background:#FFF1EC;border-top:2px solid ${d.accent}}

      .hc-console{flex-shrink:0;height:34%;min-height:96px;display:flex;flex-direction:column;background:${f.bg};border-top:1px solid rgba(255,255,255,.07)}
      /* F-1004-18: console-only — bo'sh oq Natija oynasi o'rniga console butun panelda */
      .hc-preview-pane.console-only{background:${f.bg}}
      .hc-preview-pane.console-only .hc-pane-bar{background:${f.bg};color:#A7B6D6;border-bottom:1px solid rgba(255,255,255,.06)}
      .hc-preview-pane.console-only .hc-frame{flex:none;height:0;visibility:hidden}
      .hc-preview-pane.console-only .hc-console{flex:1;height:auto;border-top:none}
      .hc-console-bar:empty{display:none}
      .hc-console-bar{display:flex;align-items:center;gap:8px;padding:7px 14px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#7E92B4;border-bottom:1px solid rgba(255,255,255,.06)}
      .hc-console-title{font-family:'JetBrains Mono',monospace;font-feature-settings:"liga" 0,"calt" 0}
      .hc-console-clear{margin-left:auto;background:rgba(255,255,255,.08);color:#cfe0ff;border:none;border-radius:7px;padding:4px 10px;font-size:10.5px;font-weight:600;cursor:pointer;text-transform:none;letter-spacing:0;font-family:'Manrope',sans-serif;transition:all .15s}
      .hc-console-clear:hover{background:${d.accent};color:#fff}
      .hc-console-body{flex:1;min-height:0;overflow:auto;padding:6px 0;font-family:'JetBrains Mono',monospace; font-feature-settings: "liga" 0, "calt" 0;font-size:13px;line-height:1.6}
      .hc-console-empty{color:#5B6B86;padding:4px 15px;font-style:italic}
      .hc-console-count{font-weight:600;color:#5B6B86;text-transform:none;letter-spacing:0}
      .hc-console-new{background:${d.accent};color:#fff;border:none;border-radius:99px;padding:3px 10px;font-size:10.5px;font-weight:700;cursor:pointer;text-transform:none;letter-spacing:0}
      .hc-console-line.lvl-clear{color:#5B6B86;font-style:italic;justify-content:center}
      .hc-console-line{display:flex;gap:8px;padding:2px 15px;color:#E7EAF2;border-bottom:1px solid rgba(255,255,255,.03);white-space:pre-wrap;word-break:break-word}
      .hc-console-caret{color:#27c93f;flex-shrink:0;font-weight:700}
      .hc-console-line.lvl-warn{color:#FFD380;background:rgba(255,189,46,.08)}
      .hc-console-line.lvl-error{color:#ff8a7a;background:rgba(255,95,86,.1)}
      .hc-console-line.lvl-error .hc-console-caret{color:#ff5f56}
      .hc-console-line.has-pos{cursor:pointer}
      .hc-console-line.has-pos:hover{background:rgba(255,95,86,.18)}
      .hc-console-pos{flex-shrink:0;color:#FFD380;font-weight:700;text-decoration:underline dotted}

      .hc-bottom{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
      .hc-ghost{background:transparent;border:1px solid transparent;color:${d.ink2};font-family:'Manrope',sans-serif;font-weight:600;font-size:14px;cursor:pointer;padding:11px 17px;border-radius:12px;transition:all .15s}
      .hc-ghost:hover{background:${d.paper};color:${d.ink};border-color:${d.line};box-shadow:0 6px 16px -10px rgba(${d.shadowBase},.3)}
      .hc-status{margin-left:auto}
      .hc-ok-msg{color:${d.success};font-weight:700;font-size:14px}
      .hc-wait-msg{color:${d.ink3};font-size:13px}
      /* «Qaytadan» ogohlantirish holati (F-0809-03) */
      .hc-ghost.armed{color:#C01024;border-color:#F6CFCF;background:#FDECEC;font-weight:800}
      .hc-ghost.armed:hover{background:#FBDFDF;border-color:#EEB8B8;color:#C01024}
      .hc-warn-msg{color:#C01024;font-size:13px;font-weight:700}
      .hc-undo{background:${d.ink};color:#fff;border:none;border-radius:9px;padding:5px 12px;font-family:'Manrope',sans-serif;font-weight:800;font-size:12.5px;cursor:pointer;margin-left:4px}
      .hc-undo:hover{background:${d.accent}}
      .hc-next{background:linear-gradient(135deg,${d.accent},${d.accent2});color:#fff;border:none;border-radius:13px;font-family:'Manrope',sans-serif;font-weight:800;font-size:15px;cursor:pointer;padding:13px 30px;box-shadow:0 10px 24px -8px rgba(255,77,38,.6);transition:all .2s}
      .hc-next:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 16px 32px -8px rgba(255,77,38,.7)}
      .hc-next:active:not(:disabled){transform:translateY(0)}
      .hc-next:disabled{background:#D7D8DE;color:#fff;cursor:not-allowed;box-shadow:none}

      /* ============================================================
         F-0813-01 — VS CODE QULAYLIKLARI
         Joriy qator · holat-qatori · shrift o'lchami · sudraluvchi chegara
         ============================================================ */
      /* Joriy qator — DOM'da .hc-hl DAN KEYIN turadi (hl foni to'q va shaffof emas,
         shuning uchun tartib muhim); matn maydoni (z-index:1) baribir ustida. */
      .hc-curline{position:absolute;left:0;right:0;top:0;height:0;background:rgba(148,180,255,.08);pointer-events:none;opacity:0;transition:opacity .2s}

      .hc-statusbar{flex-shrink:0;display:flex;align-items:center;gap:14px;padding:3px 14px;background:${f.bg};border-top:1px solid rgba(255,255,255,.07);color:#7E92B4;font-size:11px;font-family:'JetBrains Mono',monospace;user-select:none;font-feature-settings:"liga" 0,"calt" 0}
      .hc-sb-file{color:#A7B6D6;font-weight:700}
      .hc-sb-lang{text-transform:uppercase;letter-spacing:.08em;color:#61759B}
      .hc-sb-pos{margin-left:auto;white-space:nowrap}
      .hc-sb-font{display:flex;align-items:center;gap:3px}
      .hc-sb-fs{min-width:20px;text-align:center;color:#A7B6D6}
      .hc-sb-btn{background:transparent;border:none;color:#7E92B4;font-family:'JetBrains Mono',monospace; font-feature-settings: "liga" 0, "calt" 0;font-size:11px;font-weight:700;cursor:pointer;border-radius:6px;padding:2px 7px;transition:all .15s}
      .hc-sb-btn:hover{background:rgba(255,255,255,.12);color:#fff}

      .hc-divider{cursor:col-resize;display:flex;align-items:center;justify-content:center;touch-action:none;border-radius:8px;transition:background .15s}
      .hc-divider:hover{background:rgba(0,0,0,.04)}
      .hc-divider i{width:4px;height:46px;border-radius:99px;background:${d.line};transition:all .15s}
      .hc-divider:hover i{background:${d.accent};height:70px}
      .hc-root.dragging .hc-divider i{background:${d.accent};height:70px}
      .hc-root.dragging{cursor:col-resize;user-select:none}
      /* Sudrash payti iframe sichqonchani «yutmasin» — aks holda chegara qo'ldan chiqadi */
      .hc-root.dragging .hc-frame{pointer-events:none}

      /* ============================================================
         3-BOSQICH — PLANSHET VA TELEFON
         Ikki mustaqil o'lchov:
           1) tabbed sinfi (JS, 860px gacha) — muharrir/natija tab bilan almashadi
           2) pointer:coarse so'rovi (CSS) — barmoq bilan ishlanadigan ekran
         Sichqonchali keng ekranga bu qoidalarning BIRORTASI ham tegmaydi.
         ============================================================ */
      .hc-panetabs{display:flex;gap:6px;justify-content:center;width:100%}
      .hc-panetabs button{flex:1;max-width:200px;background:${d.paper};border:1px solid ${d.line};color:${d.ink2};
        font-family:'Manrope',sans-serif;font-weight:700;font-size:13px;padding:9px 12px;border-radius:11px;cursor:pointer;transition:all .15s}
      .hc-panetabs button.on{background:${d.ink};color:#fff;border-color:${d.ink}}

      /* Tab rejimi: bitta panel to'liq balandlikda */
      .hc-split.tabbed{grid-template-columns:1fr;grid-template-rows:1fr;flex:1;height:auto;min-height:0}
      .hc-split.tabbed .hc-pane{display:none}
      .hc-split.tabbed.pane-code .hc-editor-pane{display:flex}
      .hc-split.tabbed.pane-result .hc-preview-pane{display:flex}

      /* Barmoq uchun belgi qatori */
      .hc-keys{flex-shrink:0;display:flex;gap:5px;padding:6px 8px;background:#121C30;border-top:1px solid rgba(255,255,255,.07);overflow-x:auto}
      /* flex 1 1 auto — tor telefonda tugmalar QISQARADI, oxirgisi qirqilib qolmaydi */
      .hc-key{flex:1 1 auto;min-width:34px;max-width:76px;height:38px;background:rgba(255,255,255,.09);color:#DCE6F7;border:none;border-radius:9px;
        font-family:'JetBrains Mono',monospace;font-size:17px;font-weight:700;cursor:pointer;font-feature-settings:"liga" 0,"calt" 0}
      .hc-key:active{background:${d.accent};color:#fff}
      .hc-key.wide{font-size:15px}

      /* Ro'yxat pastga sig'masa — kursordan TEPAGA chiqadi */
      .hc-menu.up{transform:translateY(-100%)}

      @media (max-width:860px){
        .hc-root{justify-content:flex-start;padding:10px 12px;gap:8px}
        .hc-statusbar{display:none}
        .hc-title{font-size:clamp(17px,4.6vw,23px)}
        .hc-brief{font-size:12.5px;line-height:1.4}
        .hc-checklist{width:100%;flex-wrap:nowrap;overflow-x:auto;justify-content:flex-start;padding-bottom:3px;gap:6px}
        .hc-chip{flex-shrink:0}
        .hc-msg{height:34px}
        .hc-bottom{gap:8px}
        .hc-status{order:3;width:100%;text-align:center}
      }
      @media (max-width:520px){
        /* Telefonda shart-matni o'rniga chiplar qoladi — ular baribir shartni aytadi */
        .hc-brief{display:none}
        .hc-panetabs button{font-size:12.5px;padding:8px 10px}
        .hc-ghost{padding:10px 12px;font-size:12.5px}
      }
      /* Barmoq bilan bosiladigan nishonlar kattaroq */
      @media (pointer: coarse){
        .hc-tab{padding:9px 14px;font-size:13px}
        .hc-ic{min-width:38px;height:36px;font-size:17px}
        .hc-mini{padding:9px 15px;font-size:13px}
        .hc-menu-row{padding:11px 12px}
        .hc-menu{min-width:246px}
        .hc-ghost,.hc-next{padding:12px 18px}
        .hc-panetabs button{padding:11px 12px}
      }
      /* K-E-01: tor panelda ▶/✨ ikonkaga ixchamlashadi (panel ENIga qarab — container query) */
      .hc-editor-pane{container-type:inline-size}
      @container (max-width:760px){
        .hc-mini{font-size:0;padding:6px 10px;line-height:1}
        .hc-mini::after{content:"▶";font-size:13px}
        .hc-ic.wide{font-size:0;padding:0 8px}
        .hc-ic.wide::after{content:"✨";font-size:13px}
        .hc-tools{margin-left:4px}
      }
      @container (max-width:480px){
        /* telefon: tablar O'Z qatorida (to'liq en), tugmalar pastki qatorda — hech biri yo'qolmaydi */
        .hc-tabs-bar{flex-wrap:wrap;row-gap:6px}
        .hc-tabs{order:-1;flex-basis:100%}
        .hc-dots{display:none}
      }

    `})}export{E as n,M as t};