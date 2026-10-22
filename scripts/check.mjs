import {readFile,readdir,access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const files=[...(await readdir(root)).filter(f=>f.endsWith('.html')),...(await readdir(path.join(root,'hizmetler'))).filter(f=>f.endsWith('.html')).map(f=>'hizmetler/'+f)];
const errors=[];const titles=new Set();let checked=0;
for(const file of files){
 const html=await readFile(path.join(root,file),'utf8');
 const fail=message=>errors.push(`${file}: ${message}`);
 const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
 if(!title||titles.has(title))fail('Sayfa başlığı eksik veya tekrarlı.');
 titles.add(title);
 if((html.match(/<h1[\s>]/g)||[]).length!==1)fail('Tam bir adet h1 bulunmalı.');
 if(!html.includes('<html lang="tr">'))fail('Türkçe dil bildirimi eksik.');
 if(!/<meta name="description" content="[^"]+"/.test(html))fail('SEO açıklaması eksik.');
 if(/lorem ipsum|siteadiniz|TODO|undefined/i.test(html))fail('Yer tutucu içerik bulundu.');
 for(const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){try{JSON.parse(m[1])}catch{fail('Yapısal veri geçersiz.')}}
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 if(ids.length!==new Set(ids).size)fail('Aynı id birden çok kez kullanılmış.');
 for(const m of html.matchAll(/<img\b[^>]*>/g)){if(!/alt="[^"]*"/.test(m[0]))fail('Görsel alt metni eksik.');}
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const raw=m[1].replaceAll('&amp;','&');
  if(/^(https?:|tel:|data:)/.test(raw)){
   if(raw.startsWith('tel:')&&raw!=='tel:+905066792471')fail('Telefon bağlantısı tutarsız.');
   if(raw.startsWith('https://wa.me/')&&!raw.startsWith('https://wa.me/905066792471?'))fail('WhatsApp numarası tutarsız.');
   continue;
  }
  const [local,fragment]=raw.split('#');
  const target=local?path.resolve(root,path.dirname(file),decodeURIComponent(local)):path.join(root,file);
  try{await access(target);checked++;if(fragment&&path.extname(target)==='.html'){const other=await readFile(target,'utf8');if(!other.includes(`id="${fragment}"`))fail(`Bağlantı hedefi bulunamadı: ${raw}`)}}catch{fail(`Yerel dosya bulunamadı: ${raw}`)}
 }
}
const css=await readFile(path.join(root,'assets/style.css'),'utf8');
for(const m of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)){try{await access(path.resolve(root,'assets',m[1]))}catch{errors.push('CSS varlığı eksik: '+m[1])}}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1}else console.log(`BAŞARILI: ${files.length} sayfa, ${checked} yerel dosya/bağlantı; başlıklar, meta açıklamaları, görseller, JSON-LD ve iletişim numaraları kontrol edildi.`);
