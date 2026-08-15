/* Le guide d'audit : document court, donc pagination mesurée autrement.
   Pour chaque titre, on rend le document tronqué juste après lui et on compte
   les pages : le nombre obtenu est la page où ce titre se trouve. Aucun saut de
   page forcé n'est nécessaire — la mise en page reste dense. */
const {chromium}=require("playwright-core"); const fs=require("fs");
const {Document,Packer,Paragraph,TextRun,HeadingLevel,AlignmentType,Table,TableRow,TableCell,
       WidthType,ShadingType,BorderStyle,Header,Footer,PageNumber}=require("docx");
const SRC=process.argv[2]||"./dossier.js";
const SORTIE=process.argv[3]||"Dossier-de-preuve-4-causes";
const TITRE=process.argv[4]||"Le dossier de preuve, cause par cause — L. 1233-3";
const IT=require(SRC);
const ech=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const BLEU="1F3864";
const CSS=`@page{size:A4;margin:18mm 16mm 20mm}
 body{font:12pt/1.45 "Times New Roman",Times,"Liberation Serif",serif;color:#111;margin:0}
 h1{font-size:24pt;color:${"#"+BLEU};margin:0 0 8pt}
 h2{font-size:17pt;color:#1F3864;margin:18pt 0 8pt;page-break-before:always;page-break-after:avoid;
    border-bottom:1pt solid #1F3864;padding-bottom:5pt}
 h3{font-size:14pt;color:#1F3864;margin:14pt 0 6pt;page-break-after:avoid}
 h4{font-size:12.5pt;color:#1F3864;margin:11pt 0 5pt;page-break-after:avoid}
 p{margin:0 0 6pt;text-align:justify} .note{font-size:11pt;color:#555}
 .puce{margin:0 0 4pt 16pt;text-indent:-16pt}
 .enc{border:.6pt solid #1F3864;background:#F4F6FB;padding:8pt 10pt;margin:8pt 0;page-break-inside:avoid}
 .enc .sh{font-weight:bold;color:#1F3864;margin:0 0 4pt}
 table{border-collapse:collapse;width:100%;margin:8pt 0;font-size:10.5pt;page-break-inside:auto}
 th,td{border:.5pt solid #999;padding:4pt 6pt;text-align:left;vertical-align:top}
 th{background:#1F3864;color:#fff}
 .sch{table-layout:fixed;margin:10pt 0 4pt} .sch td{border:none;padding:0 3pt 6pt 0}
 .sch .bo{border:1.2pt solid #1F3864;background:#fff;color:#1F3864;font-weight:bold;text-align:center;padding:8pt 5pt}
 .sch .ba{background:#1F3864;color:#fff;padding:7pt 8pt;font-size:10.5pt}
 .sch .fl{text-align:center;color:#1F3864;font-size:13pt;padding:2pt 0}
 .schT{font-weight:bold;color:#1F3864;font-size:12.5pt;margin:12pt 0 0}
 .schA{font-style:italic;color:#666;font-size:10.5pt;margin:0 0 4pt}
 .toc{font-size:11pt;line-height:1.35} .toc div{margin:0}
 .t1{font-weight:bold;margin-top:7pt!important;font-size:12pt}
 .t2{margin-left:14pt!important} .t3{margin-left:30pt!important;color:#555}
 .pg{float:right;color:#666}
 .piece{border:1.2pt solid #1F3864;padding:7pt 9pt;margin:14pt 0 6pt;page-break-after:avoid;background:#F4F6FB}
 .piece .n{font-weight:bold;color:#1F3864;font-size:13pt}
 .piece .m{font-size:10pt;color:#444;margin:3pt 0 0}
 .doc{border:.5pt solid #999;padding:9pt 11pt;margin:6pt 0 10pt;background:#fff;font-size:11pt}
 .doc p{margin:0 0 5pt} .doc .r{text-align:right} .doc .c{text-align:center;font-weight:bold}
 .sign{text-align:right;font-style:italic;font-size:10.5pt;color:#444;margin:6pt 0 12pt}
 /* --- page de décision --- */
 .bandeau{padding:13pt 15pt;margin:12pt 0 6pt;color:#fff;page-break-inside:avoid}
 .bandeau .r{font-size:25pt;font-weight:bold;letter-spacing:.4pt;line-height:1.1;margin:0}
 .bandeau .s{font-size:11pt;margin:6pt 0 0;line-height:1.35}
 .b-rouge{background:#8E1B1B} .b-orange{background:#9C5A05} .b-vert{background:#1C5E36}
 .b-gris{background:#3C4557}
 .etape{margin:15pt 0 6pt;padding:0 0 3pt;border-bottom:1.2pt solid #1F3864;
   color:#1F3864;font-weight:bold;font-size:12.5pt;page-break-after:avoid}
 .etape span{font-weight:normal;font-size:10pt;color:#666;float:right;padding-top:3pt}
 .acte{border-left:3pt solid #1F3864;background:#F6F7FA;padding:6pt 9pt 6pt 10pt;
   margin:0 0 5pt;page-break-inside:avoid}
 .acte .t{font-size:11.5pt;font-weight:bold;margin:0;text-align:left}
 .acte .t b{color:#1F3864;padding-right:5pt}
 .acte .w{font-size:9.5pt;color:#555;margin:3pt 0 0;line-height:1.35;text-align:left}
 .acte .k{font-size:8pt;color:#999}
 .chip{font-size:8pt;color:#fff;padding:1pt 5pt;margin-left:6pt;white-space:nowrap}
 .c-bloquant{background:#8E1B1B} .c-critique{background:#9C5A05}
 .c-important{background:#1F3864} .c-information{background:#767676}
 .a-bloquant{border-left-color:#8E1B1B;background:#FAF3F3}
 .a-critique{border-left-color:#9C5A05;background:#FBF7F1}
 .a-information{border-left-color:#767676;background:#F7F7F7}
 .interdit{border:1pt solid #8E1B1B;background:#FAF2F2;padding:8pt 10pt;margin:0 0 6pt;
   page-break-inside:avoid}
 .interdit .t{font-size:12pt;font-weight:bold;color:#8E1B1B;margin:0;text-align:left}
 .i-reserve{border-color:#9C5A05;background:#FBF7F1} .i-reserve .t{color:#9C5A05}
 .i-examen{border-color:#767676;background:#F7F7F7} .i-examen .t{color:#4A4A4A}
 .interdit .w{font-size:9.5pt;color:#555;margin:3pt 0 0;text-align:left}
 .acquis{font-size:10.5pt;margin:0 0 3pt;padding-left:15pt;text-indent:-15pt;line-height:1.35}
 .acquis b{color:#1C5E36}`;
const H={sur:i=>`<p class="note">${ech(i.t)}</p>`,t1:i=>`<h1>${ech(i.t)}</h1>`,
 trait:()=>`<hr style="border:none;border-top:.6pt solid #bfbfbf;margin:10pt 0 14pt">`,
 h1:i=>`<h2>${ech(i.t)}</h2>`,h2:i=>`<h3>${ech(i.t)}</h3>`,h3:i=>`<h4>${ech(i.t)}</h4>`,
 p:i=>`<p>${ech(i.t)}</p>`,note:i=>`<p class="note">${ech(i.t)}</p>`,
 puce:i=>`<p class="puce">— ${ech(i.t)}</p>`,
 enc:i=>`<div class="enc"><p class="sh">${ech(i.titre)}</p><p style="margin-bottom:0">${ech(i.t)}</p></div>`,
 table:i=>`<table><tr>${i.head.map(h=>`<th>${ech(h)}</th>`).join("")}</tr>`+
   i.rows.map(r=>`<tr>${r.map(c=>`<td>${ech(c)}</td>`).join("")}</tr>`).join("")+`</table>`,
 piece:i=>`<div class="piece"><div class="n">Pièce n° ${ech(i.num)} — ${ech(i.titre)}</div>`+
   `<div class="m"><b>Nature :</b> ${ech(i.nature)} &nbsp;·&nbsp; <b>Émetteur :</b> ${ech(i.emetteur)} &nbsp;·&nbsp; <b>Date :</b> ${ech(i.date)}</div>`+
   `<div class="m"><b>Ce qu'elle prouve :</b> ${ech(i.prouve)}${i.texte?` &nbsp;·&nbsp; <b>Fondement :</b> ${ech(i.texte)}`:""}</div></div>`,
 doc:i=>`<div class="doc">${i.lignes.map(l=>typeof l==="string"?`<p>${ech(l)}</p>`:
   (l.k==="c"?`<p class="c">${ech(l.t)}</p>`:(l.k==="r"?`<p class="r">${ech(l.t)}</p>`:
   (l.k==="table"?`<table>${l.head?`<tr>${l.head.map(h=>`<th>${ech(h)}</th>`).join("")}</tr>`:""}`+
     l.rows.map(r=>`<tr>${r.map(c=>`<td>${ech(c)}</td>`).join("")}</tr>`).join("")+`</table>`:`<p>${ech(l.t)}</p>`)))).join("")}</div>`,
 sign:i=>`<p class="sign">${ech(i.t)}</p>`,
 bandeau:i=>`<div class="bandeau b-${ech(i.couleur)}"><p class="r">${ech(i.t)}</p>`+
   `<p class="s">${ech(i.sous)}</p></div>`,
 etape:i=>`<p class="etape">${ech(i.t)}${i.compte?`<span>${ech(i.compte)}</span>`:""}</p>`,
 acte:i=>`<div class="acte a-${ech(i.priorite)}"><p class="t"><b>${ech(i.n)}.</b>${ech(i.t)}`+
   `<span class="chip c-${ech(i.priorite)}">${ech(i.priorite)}</span></p>`+
   `<p class="w">${ech(i.pourquoi)} <span class="k">· ${ech(i.id)}</span></p></div>`,
 saut:()=>`<div style="page-break-after:always"></div>`,
 interdit:i=>`<div class="interdit i-${ech(i.ton||"certain")}"><p class="t">${ech(i.t)}</p>`+
   `<p class="w">${ech(i.pourquoi)} <span class="k">· ${ech(i.id)}</span></p></div>`,
 acquis:i=>`<p class="acquis"><b>&#10003;</b> ${ech(i.t)} <span style="color:#666">— ${ech(i.base)}</span></p>`,
 schema:i=>{let h=`<p class="schT">${ech(i.titre)}</p><p class="schA">${ech(i.article)}</p><table class="sch">`;
   h+=`<tr>${i.cols.map(c=>`<td class="bo">${ech(c.t)}</td>`).join("")}</tr>`;
   h+=`<tr>${i.cols.map(()=>`<td class="fl">&#9660;</td>`).join("")}</tr>`;
   for(const r of i.bandes) h+=`<tr>${r.map(b=>`<td class="ba" colspan="${b.span}">${ech(b.t)}</td>`).join("")}</tr>`;
   return h+`</table>`;}};
const corps=(a,b)=>IT.slice(a,b).map(i=>H[i.k](i)).join("");
const page=c=>`<!DOCTYPE html><html lang=fr><head><meta charset=utf-8><title>${ech(TITRE)}</title><style>${CSS}</style></head><body>${c}</body></html>`;
const compte=b=>(b.toString("latin1").match(/\/Type\s*\/Page[^s]/g)||[]).length;
const NIVT={h1:1,h2:2,h3:3,piece:3};
const libelle=x=>x.k==="piece"?`Pièce n° ${x.num} — ${x.titre}`:x.t;
const titres=IT.map((x,i)=>({x,i})).filter(o=>NIVT[o.x.k]);
const tocHtml=pg=>'<div style="page-break-after:always"><h2 style="page-break-before:auto">Sommaire</h2>'+
  '<p class="note">Les numéros de page ont été mesurés sur ce document : ils sont exacts.</p><div class="toc">'+
  titres.map(o=>`<div class="t${NIVT[o.x.k]}">${ech(libelle(o.x))}<span class="pg">${pg?pg[o.i]:"000"}</span></div>`).join("")+
  "</div></div>";
(async()=>{
  const nav=await chromium.launch({executablePath:"/opt/pw-browsers/chromium-1194/chrome-linux/chrome"});
  const p=await nav.newPage();
  const rendre=async h=>{ await p.setContent(page(h),{waitUntil:"load"});
    return p.pdf({format:"A4",printBackground:true,margin:{top:"18mm",right:"16mm",bottom:"20mm",left:"16mm"},
      displayHeaderFooter:true,
      headerTemplate:'<div style="font:8pt \'Times New Roman\',serif;color:#999;width:100%;padding:0 16mm;text-align:right">'+ech(TITRE)+'</div>',
      footerTemplate:'<div style="font:8pt \'Times New Roman\',serif;color:#999;width:100%;padding:0 16mm;text-align:center">— <span class="pageNumber"></span> / <span class="totalPages"></span> —</div>'}); };
  const brut={};
  for(const o of titres) brut[o.i]=compte(await rendre(corps(0,o.i+1)));
  const tete=compte(await rendre(tocHtml(null)));
  const pg={}; titres.forEach(o=>pg[o.i]=brut[o.i]+tete);
  const pdf=await rendre(tocHtml(pg)+corps(0,IT.length));
  fs.writeFileSync(SORTIE+".pdf",pdf);
  console.log(`PDF : ${(pdf.length/1024|0)} Ko · ${compte(pdf)} pages · sommaire de ${tete} page(s) · ${titres.length} titres`);
  await nav.close();

  /* ---------- Word ---------- */
  const t=(x,o={})=>new TextRun({text:String(x??""),size:o.size??24,bold:o.b,italics:o.it,color:o.c});
  const P=(c,o={})=>new Paragraph({spacing:{after:o.after??120,before:o.before??0,line:280},
    alignment:o.al??AlignmentType.JUSTIFIED,indent:o.ind,border:o.border,heading:o.h,
    pageBreakBefore:o.saut,children:[].concat(c).map(x=>typeof x==="string"?t(x,o):x)});
  const cell=(x,o={})=>new TableCell({columnSpan:o.span,
    shading:o.fond?{type:ShadingType.CLEAR,fill:o.fond}:undefined,
    margins:{top:60,bottom:60,left:90,right:90},
    children:[P(t(x,{size:o.size??21,b:o.b,c:o.c}),{after:0,al:o.al??AlignmentType.LEFT})]});
  const E=[];
  const W={sur:i=>E.push(P(i.t,{size:20,c:"666666",after:70})),
   t1:i=>E.push(new Paragraph({spacing:{after:70},children:[t(i.t,{b:1,size:40,c:BLEU})]})),
   trait:()=>E.push(P("",{after:140,border:{bottom:{style:BorderStyle.SINGLE,size:6,color:"BFBFBF",space:8}}})),
   h1:i=>E.push(P(t(i.t,{b:1,size:32,c:BLEU}),{h:HeadingLevel.HEADING_1,saut:true,after:120,al:AlignmentType.LEFT,
     border:{bottom:{style:BorderStyle.SINGLE,size:8,color:BLEU,space:5}}})),
   h2:i=>E.push(P(t(i.t,{b:1,size:26,c:BLEU}),{h:HeadingLevel.HEADING_2,after:90,before:200,al:AlignmentType.LEFT})),
   h3:i=>E.push(P(t(i.t,{b:1,size:23,c:BLEU}),{h:HeadingLevel.HEADING_3,after:70,before:150,al:AlignmentType.LEFT})),
   p:i=>E.push(P(i.t)),note:i=>E.push(P(i.t,{size:21,c:"555555"})),
   puce:i=>E.push(P("—  "+i.t,{ind:{left:280,hanging:280}})),
   enc:i=>{E.push(P(t(i.titre,{b:1,size:23,c:BLEU}),{after:40,before:120,al:AlignmentType.LEFT,
     border:{top:{style:BorderStyle.SINGLE,size:4,color:BLEU,space:6}}}));
     E.push(P(i.t,{after:130,border:{bottom:{style:BorderStyle.SINGLE,size:4,color:BLEU,space:6}}}));},
   piece:i=>{E.push(P([t("Pièce n° "+i.num+" — ",{b:1,size:25,c:BLEU}),t(i.titre,{b:1,size:25,c:BLEU})],
     {before:200,after:30,al:AlignmentType.LEFT,border:{top:{style:BorderStyle.SINGLE,size:8,color:BLEU,space:5}}}));
     E.push(P([t("Nature : ",{b:1,size:19}),t(i.nature,{size:19}),t("  ·  Émetteur : ",{b:1,size:19}),t(i.emetteur,{size:19}),
               t("  ·  Date : ",{b:1,size:19}),t(i.date,{size:19})],{after:20,al:AlignmentType.LEFT}));
     E.push(P([t("Ce qu'elle prouve : ",{b:1,size:19}),t(i.prouve,{size:19}),
               ...(i.texte?[t("  ·  Fondement : ",{b:1,size:19}),t(i.texte,{size:19})]:[])],
       {after:120,al:AlignmentType.LEFT,border:{bottom:{style:BorderStyle.SINGLE,size:4,color:BLEU,space:5}}}));},
   doc:i=>{i.lignes.forEach(l=>{ if(typeof l==="string") return E.push(P(l,{size:22,ind:{left:200,right:200}}));
     if(l.k==="c") return E.push(P(t(l.t,{b:1,size:22}),{al:AlignmentType.CENTER}));
     if(l.k==="r") return E.push(P(l.t,{size:22,al:AlignmentType.RIGHT}));
     if(l.k==="table") return E.push(new Table({width:{size:100,type:WidthType.PERCENTAGE},
       rows:[...(l.head?[new TableRow({children:l.head.map(h=>cell(h,{b:1,fond:BLEU,c:"FFFFFF"}))})]:[]),
             ...l.rows.map(r=>new TableRow({children:r.map(c=>cell(c))}))]}));
     E.push(P(l.t,{size:22,ind:{left:200,right:200}})); }); E.push(P("",{after:100}));},
   sign:i=>E.push(P(i.t,{it:1,size:21,c:"444444",al:AlignmentType.RIGHT,after:140})),
   table:i=>{E.push(new Table({width:{size:100,type:WidthType.PERCENTAGE},
     rows:[new TableRow({children:i.head.map(h=>cell(h,{b:1,fond:BLEU,c:"FFFFFF"}))}),
           ...i.rows.map(r=>new TableRow({children:r.map(c=>cell(c))}))]}));E.push(P("",{after:120}));},
   schema:i=>{E.push(P(t(i.titre,{b:1,size:25,c:BLEU}),{after:20,before:160,al:AlignmentType.LEFT}));
     E.push(P(i.article,{it:1,size:21,c:"666666",after:80,al:AlignmentType.LEFT}));
     E.push(new Table({width:{size:100,type:WidthType.PERCENTAGE},
       rows:[new TableRow({children:i.cols.map(c=>cell(c.t,{b:1,c:BLEU,size:22,al:AlignmentType.CENTER}))}),
         ...i.bandes.map(r=>new TableRow({children:r.map(b=>cell(b.t,{span:b.span,fond:BLEU,c:"FFFFFF",size:20}))}))]}));
     E.push(P("",{after:120}));}};
  IT.filter(i=>["sur","t1","trait"].includes(i.k)).forEach(i=>W[i.k](i));
  E.push(new Paragraph({pageBreakBefore:true,spacing:{after:110},children:[t("Sommaire",{b:1,size:30,c:BLEU})]}));
  E.push(P([t("Les numéros ci-dessous sont ceux du "),t("PDF joint",{b:1}),
    t(", mesurés sur le document. Word ne découpe pas les lignes de la même façon : sa pagination différera.")],
    {size:21,c:"555555",after:150}));
  titres.forEach(o=>E.push(new Paragraph({spacing:{after:NIVT[o.x.k]===1?45:20},
    indent:{left:NIVT[o.x.k]===1?0:(NIVT[o.x.k]===2?200:400)},
    children:[t(libelle(o.x),{b:NIVT[o.x.k]===1,size:NIVT[o.x.k]===1?23:21,c:NIVT[o.x.k]===3?"555555":undefined}),
              t("   ·   p. "+pg[o.i],{size:20,c:"999999"})]})));
  /* Le .docx produit ici est écrasé par word_py.py — seule la sortie PDF importe. */
  IT.forEach(i=>{ if(["sur","t1","trait"].includes(i.k)) return; if(W[i.k]) W[i.k](i); });
  const doc=new Document({creator:"Application Jurisprudence",title:TITRE,
    styles:{default:{document:{run:{font:"Times New Roman",size:24}}}},
    sections:[{properties:{page:{margin:{top:1134,right:1134,bottom:1134,left:1134}}},
      headers:{default:new Header({children:[new Paragraph({alignment:AlignmentType.RIGHT,spacing:{after:110},
        border:{bottom:{style:BorderStyle.SINGLE,size:6,color:"D9D9D9",space:6}},
        children:[t(TITRE,{size:16,c:"999999"})]})]})},
      footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,
        children:[t("— ",{size:18,c:"999999"}),new TextRun({children:[PageNumber.CURRENT],size:18,color:"999999"}),
                  t(" —",{size:18,c:"999999"})]})]})},
      children:E}]});
  const buf=await Packer.toBuffer(doc);
  fs.writeFileSync(SORTIE+".docx",buf);
  console.log(`Word : ${(buf.length/1024|0)} Ko`);
})();
