/* ============================================================
   OFFICINA ASTROLOGICA — Genitura de Lucas
   Dados fixos da carta (casas conforme conferidas), mandala SVG,
   planetas nas casas (Olavo de Carvalho), estrelas fixas, aspectos,
   antiscia. Glifos reais com seletor de variação textual (U+FE0E).
   ============================================================ */
"use strict";
var VS = "︎"; // força apresentação textual (sem emoji)

/* ---------- glifos ---------- */
var SIGN_GL = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"].map(function(g){return g+VS;});
var SIGN_NM = ["Áries","Touro","Gêmeos","Câncer","Leão","Virgem","Libra","Escorpião","Sagitário","Capricórnio","Aquário","Peixes"];
var ELEM = ["fogo","terra","ar","agua","fogo","terra","ar","agua","fogo","terra","ar","agua"];
var ELEM_COLOR = {fogo:"var(--fire)",terra:"var(--earth)",ar:"var(--air)",agua:"var(--water)"};
var P = {
  sol:{gl:"☉"+VS, nm:"Sol"}, lua:{gl:"☽"+VS, nm:"Lua"},
  mer:{gl:"☿"+VS, nm:"Mercúrio"}, ven:{gl:"♀"+VS, nm:"Vênus"},
  mar:{gl:"♂"+VS, nm:"Marte"}, jup:{gl:"♃"+VS, nm:"Júpiter"},
  sat:{gl:"♄"+VS, nm:"Saturno"}, nn:{gl:"☊"+VS, nm:"Nodo Norte"},
  ns:{gl:"☋"+VS, nm:"Nodo Sul"}, for:{gl:"⊗"+VS, nm:"Fortuna"}
};
var ASP_GL = {con:"☌"+VS, sex:"⚹"+VS, qua:"□"+VS, tri:"△"+VS, opo:"☍"+VS};

/* ---------- posições (grau dentro do signo) ---------- */
function abs(signIdx, deg, min){ return signIdx*30 + deg + (min||0)/60; }
var PT = [
  {k:"sol", si:4, d:24, m:14, casa:1, dig:"Domicílio", rx:false},
  {k:"lua", si:9, d:5,  m:2,  casa:5, dig:"Detrimento · triplicidade", rx:false},
  {k:"mer", si:4, d:28, m:43, casa:1, dig:"Peregrino", rx:false},
  {k:"ven", si:6, d:10, m:4,  casa:2, dig:"Domicílio", rx:false},
  {k:"mar", si:3, d:0,  m:22, casa:11,dig:"Queda · triplicidade", rx:false},
  {k:"jup", si:7, d:7,  m:46, casa:3, dig:"Peregrino", rx:false},
  {k:"sat", si:11,d:10, m:9,  casa:7, dig:"Peregrino", rx:true},
  {k:"nn",  si:7, d:19, m:1,  casa:3, dig:"—", rx:true},
  {k:"ns",  si:1, d:19, m:1,  casa:9, dig:"—", rx:true},
  {k:"for", si:0, d:4,  m:28, casa:8, dig:"—", rx:false}
];
PT.forEach(function(p){ p.lon = abs(p.si,p.d,p.m); });
function ptByKey(k){ for(var i=0;i<PT.length;i++) if(PT[i].k===k) return PT[i]; return null; }

/* cúspides (quadrantes) */
var CUSP = [
  abs(4,15,16), abs(5,23,18), abs(6,28,3), abs(7,26,52), abs(8,21,55), abs(9,16,42),
  abs(10,15,16),abs(11,23,18),abs(0,28,3), abs(1,26,52), abs(2,21,55), abs(3,16,42)
];
var ASC = CUSP[0], MC = CUSP[9];

/* ---------- utilidades ---------- */
function fmtLonShort(lon){ lon=((lon%360)+360)%360; var si=Math.floor(lon/30), g=lon-si*30;
  return Math.floor(g)+"°"+String(Math.round((g-Math.floor(g))*60)).padStart(2,"0")+"′ "+SIGN_GL[si]; }
function fmtLonFull(lon){ lon=((lon%360)+360)%360; var si=Math.floor(lon/30), g=lon-si*30;
  var gi=Math.floor(g), mi=Math.round((g-gi)*60); if(mi===60){gi++;mi=0;}
  return gi+"°"+String(mi).padStart(2,"0")+"′ "+SIGN_NM[si]; }

/* ============================================================
   MANDALA (SVG)
   ============================================================ */
function pol(lon,r){ var a=(180+(lon-ASC))*Math.PI/180; return [200+r*Math.cos(a), 200-r*Math.sin(a)]; }
function sectorPath(l1,l2,ro,ri){
  var pts=[], step=3, n=Math.ceil((l2-l1)/step), i, p;
  for(i=0;i<=n;i++){ p=pol(l1+(l2-l1)*i/n, ro); pts.push((i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1)); }
  for(i=n;i>=0;i--){ p=pol(l1+(l2-l1)*i/n, ri); pts.push("L"+p[0].toFixed(1)+" "+p[1].toFixed(1)); }
  return pts.join(" ")+" Z";
}
function line(l,r1,r2,stroke,w,dash){ var a=pol(l,r1),b=pol(l,r2);
  return '<line x1="'+a[0].toFixed(1)+'" y1="'+a[1].toFixed(1)+'" x2="'+b[0].toFixed(1)+'" y2="'+b[1].toFixed(1)+'" stroke="'+stroke+'" stroke-width="'+w+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>'; }
function txt(x,y,s,size,fill,anchor,weight){
  return '<text x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" font-size="'+size+'" fill="'+fill+'" text-anchor="'+(anchor||"middle")+'" dominant-baseline="central"'+(weight?' font-weight="'+weight+'"':'')+'>'+s+'</text>';
}

var STARS_ON_WHEEL = [
  {nm:"Algol", lon: MC, dr:0}, {nm:"Menkalinan", lon: ptByKey("mar").lon, dr:0},
  {nm:"Al Jabhah", lon: ptByKey("mer").lon, dr:0}, {nm:"Dubhe", lon: ASC, dr:0},
  {nm:"Porrima", lon: ptByKey("ven").lon, dr:0}, {nm:"Vindemiatrix", lon: ptByKey("ven").lon, dr:12},
  {nm:"Khambalia", lon: ptByKey("jup").lon, dr:0}, {nm:"Zuben Eschamali", lon: ptByKey("nn").lon, dr:0}
];

function buildWheel(){
  var rOut=196, rZo=178, rZi=150, rHub=84, rPl=122, rNum=97, i, s='';
  s+='<svg class="mandala" viewBox="-14 -14 428 428" role="img" aria-label="Mandala natal de Lucas">';
  // fundo do miolo
  s+='<circle cx="200" cy="200" r="'+rHub+'" fill="#150c06"/>';
  // sectores do zodíaco por elemento
  for(i=0;i<12;i++){
    var l1=i*30, l2=(i+1)*30, col=ELEM_COLOR[ELEM[i]];
    s+='<path d="'+sectorPath(l1,l2,rZo,rZi)+'" fill="'+col+'" fill-opacity="0.16" stroke="var(--line)" stroke-width="0.6"/>';
    var g=pol(l1+15,(rZo+rZi)/2); s+=txt(g[0],g[1],SIGN_GL[i],15,col,"middle","400");
  }
  // círculos
  ['196','178','150','84'].forEach(function(r){ s+='<circle cx="200" cy="200" r="'+r+'" fill="none" stroke="var(--line)" stroke-width="1"/>'; });
  s+='<circle cx="200" cy="200" r="196" fill="none" stroke="var(--orange)" stroke-width="1.4" stroke-opacity="0.5"/>';
  // ticks de grau
  for(i=0;i<360;i+=5){ s+=line(i, rZi, rZi-(i%30===0?9:(i%10===0?6:3)), "var(--ink-faint)", i%30===0?1:0.6); }
  // cúspides
  for(i=0;i<12;i++){
    var ang=(i===0||i===3||i===6||i===9);
    s+=line(CUSP[i], rHub, rZi, ang?"var(--orange)":"var(--line)", ang?1.8:0.8, ang?"":"2 3");
    var mid=CUSP[i]+(((CUSP[(i+1)%12]-CUSP[i])%360+360)%360)/2;
    var np=pol(mid, rNum); s+=txt(np[0],np[1], (i+1===1?"I":i+1===4?"IV":i+1===7?"VII":i+1===10?"X":String(i+1)), 8.5, "var(--ink-faint)", "middle");
  }
  // eixos AC / MC
  [["Asc",ASC],["MC",MC],["Dsc",ASC+180],["IC",MC+180]].forEach(function(ax){
    var lp=pol(ax[1], rZo+9); s+=txt(lp[0],lp[1], ax[0], 8.5, ax[0]==="Asc"||ax[0]==="MC"?"var(--orange-lite)":"var(--ink-faint)", "middle","700");
  });
  // aspectos no miolo
  ASPECTS.forEach(function(a){
    if(a.tipo==="con") return;
    var pa=ptByKey(a.a), pb=ptByKey(a.b); if(!pa||!pb) return;
    var hard=(a.tipo==="qua"||a.tipo==="opo");
    s+=line2(pa.lon,pb.lon,rHub, hard?"var(--orange)":"var(--air)", hard?1.2:1, hard?"":"3 3", hard?0.75:0.6);
  });
  // estrelas fixas na borda
  STARS_ON_WHEEL.forEach(function(st){
    var mk=pol(st.lon, rZo+4); s+='<text x="'+mk[0].toFixed(1)+'" y="'+mk[1].toFixed(1)+'" font-size="8" fill="var(--peach)" text-anchor="middle" dominant-baseline="central">✦</text>';
    var lp=pol(st.lon, rOut+6+st.dr), c=Math.cos((180+(st.lon-ASC))*Math.PI/180);
    var anchor = c>0.25?"start":(c<-0.25?"end":"middle");
    s+=txt(lp[0],lp[1], st.nm, 6.4, "var(--ink-faint)", anchor);
  });
  // planetas (espalhar sobrepostos)
  var order = PT.slice().sort(function(x,y){return x.lon-y.lon;});
  var placed=[];
  order.forEach(function(p){
    var rr=rPl, k;
    for(k=0;k<placed.length;k++){
      if(Math.abs(fold(p.lon-placed[k].lon))<9 && Math.abs(rr-placed[k].r)<15){ rr=placed[k].r-17; }
    }
    if(rr<rHub+16) rr=rPl+17;
    placed.push({lon:p.lon,r:rr});
    s+=line(p.lon, rZi, rZi-9, "var(--orange-lite)", 1);
    var gp=pol(p.lon, rr);
    s+=txt(gp[0],gp[1], P[p.k].gl, 16, p.k==="sol"||p.k==="lua"?"var(--orange)":"var(--ink)", "middle");
    var dp=pol(p.lon, rr-13);
    s+=txt(dp[0],dp[1], p.d+"°"+(p.rx?" ℞":""), 6.6, "var(--ink-faint)", "middle");
  });
  s+='</svg>';
  return s;
}
function fold(x){ x=((x%360)+360)%360; return x>180?x-360:x; }
function line2(la,lb,r,stroke,w,dash,op){ var a=pol(la,r),b=pol(lb,r);
  return '<line x1="'+a[0].toFixed(1)+'" y1="'+a[1].toFixed(1)+'" x2="'+b[0].toFixed(1)+'" y2="'+b[1].toFixed(1)+'" stroke="'+stroke+'" stroke-width="'+w+'" stroke-opacity="'+op+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>'; }

/* ============================================================
   ASPECTOS  (A = aplicativo, S = separativo)
   ============================================================ */
var ASP_NM = {con:"Conjunção",sex:"Sextil",qua:"Quadratura",tri:"Trígono",opo:"Oposição"};
var ASP_DS = {
  con:"união e fusão das significações",
  sex:"concórdia amistosa, auxílio e oportunidade",
  qua:"tensão, obstáculo e esforço",
  tri:"harmonia e facilidade natural",
  opo:"confronto, polaridade e necessidade de equilíbrio"
};
var ASPECTS = [
  {a:"mer",b:"mar",tipo:"sex",orb:"1°39′",mov:"A"},
  {a:"jup",b:"sat",tipo:"tri",orb:"2°22′",mov:"A"},
  {a:"lua",b:"jup",tipo:"sex",orb:"2°44′",mov:"A"},
  {a:"sol",b:"mer",tipo:"con",orb:"4°29′",mov:"S"},
  {a:"lua",b:"mar",tipo:"opo",orb:"4°39′",mov:"S"},
  {a:"lua",b:"ven",tipo:"qua",orb:"5°02′",mov:"A"},
  {a:"lua",b:"sat",tipo:"sex",orb:"5°06′",mov:"A"},
  {a:"lua",b:"mer",tipo:"tri",orb:"6°18′",mov:"S"},
  {a:"mar",b:"jup",tipo:"tri",orb:"7°24′",mov:"A"}
];

/* ============================================================
   ESTRELAS FIXAS presentes na genitura
   ============================================================ */
var STARS = [
  {nm:"Porrima", con:"ven", orb:"0°00′", nat:"Mercúrio / Vênus",
   txt:"γ Virginis, a deusa da profecia. Confere dom profético e refinamento, cortesia, senso de justiça e a capacidade de prever e conciliar. Exata sobre Vênus, agracia o amor e o juízo estético com uma qualidade quase orácular — presságios do que agrada e do que fere."},
  {nm:"Vindemiatrix", con:"ven", orb:"0°12′", nat:"Saturno / Mercúrio",
   txt:"ε Virginis, “a que faz viúvas”. Inteligência aguda e engenhosa, mas melancolia, perdas afetivas e o risco de falar ou agir cedo demais. Sobre Vênus, e ao lado de Porrima, dá ao afeto profundidade reflexiva e uma lucidez triste: vê-se longe, e por isso também a ausência."},
  {nm:"Dubhe", con:"asc", orb:"0°09′", nat:"Marte",
   txt:"α Ursae Majoris, a Ursa Maior. Marca a própria imagem e o corpo com força, autoridade e combatividade — um olhar penetrante, quase destrutivo, segundo a tradição. Quase exata sobre o Ascendente em Leão, redobra o brilho e a vontade de reinar; dá presença dominante e coragem, ao preço do orgulho."},
  {nm:"Zuben Eschamali", con:"nn", orb:"0°16′", nat:"Júpiter / Mercúrio",
   txt:"β Librae, o Prato Norte da Balança — tida como a mais afortunada das duas conchas. Honra, ambição nobre e boa fortuna durável. Sobre o Nodo Norte, aponta o caminho de crescimento pela justiça, pela medida e pela elevação: subir sem desequilibrar a balança."},
  {nm:"Menkalinan", con:"mar", orb:"0°32′", nat:"Marte / Mercúrio",
   txt:"β Aurigae, o ombro do Cocheiro. Dá destreza para conduzir e manobrar, energia hábil e veloz — mas adverte contra a ruína por precipitação, por vento e por fogo. Sobre Marte na XI, reforça a pressa de chegar ao objetivo: tática brilhante quando há rédea, desastre quando não há."},
  {nm:"Algol", con:"mc", orb:"0°46′", nat:"Saturno / Júpiter",
   txt:"β Persei, a Cabeça da Medusa — a mais intensa das fixas. A tradição a liga à violência e à “perda da cabeça”, literal e figurada. Sobre o Meio-Céu, concentra enorme intensidade sobre a vocação e a imagem pública: poder de fascinação e perigo. O chamado é encarar o terror sem desviar o olhar e transmutar o caos em obra."},
  {nm:"Al Jabhah", con:"mer", orb:"0°53′", nat:"Saturno / Mercúrio",
   txt:"ζ Leonis, a fronte do Leão. Mente séria e estruturada, capaz de comando e de método, com risco de dureza, perdas e disputas quando a palavra se faz arma. Sobre Mercúrio em Leão na I, dá autoridade intelectual e voz de mando, temperada pela gravidade saturnina."},
  {nm:"Khambalia", con:"jup", orb:"0°54′", nat:"Mercúrio / Marte",
   txt:"λ Virginis, a garra. Argúcia veloz, argumentativa e mutável; disputa e engenho. Sobre Júpiter na III, aguça a palavra persuasiva do nativo — a confiança em convencer ganha fio cortante e rapidez, com o risco da controvérsia e da inconstância."}
];

/* ============================================================
   PLANETAS NAS CASAS  (Olavo de Carvalho, condensado + integração)
   ============================================================ */
var CASA_INTRO = {
  1:"A auto-imagem: o conjunto do que o indivíduo vê e compreende sobre si mesmo sem intermediários — a imagem arquitetônica de si.",
  2:"O conhecimento do real e do mundo físico — formas, cores, pesos, texturas; o confronto do indivíduo com o que o cerca, inclusive o próprio corpo como densidade e força.",
  3:"O pensamento e a linguagem — estabelecer relações e transformar a realidade em signo; é pela linguagem que o real (II) se distingue do sujeito (I).",
  5:"O conhecimento das próprias possibilidades de ação num momento — o domínio do que se pode conquistar ou perder; a consciência do poder pessoal.",
  7:"A apreensão do eu pelo outro — tudo o que se sabe de si a pretexto de outro; a definição mútua dos papéis, com as expectativas, direitos e deveres supostos.",
  11:"Os projetos futuros e os planos de vida — a imagem integral do personagem que se quer ser, os ideais da geração, o desejo de fazer algo extraordinário."
};

var CASAS = [
  { k:"sol", casa:1, titulo:"Inteligência Intuitiva Autônoma",
    p:["O primeiro dado seguro que o sujeito obtém é sobre si mesmo. Sua auto-imagem lhe parece óbvia e inquestionável, e tão natural que se acha transparente aos próprios olhos — e, por isso, aos demais. Não se preocupa de imediato em agradar: auto-refere-se o tempo todo, tomando a própria biografia como a chave para compreender o mundo.",
       "O traço fundamental de sua imagem é a liberdade: vê-se como um centro que irradia livremente, tendo por informação básica as próprias possibilidades. Quando não se percebe como o centro dos acontecimentos, precisa de esforço para captar o que o outro espera dele — a perspectiva alheia nunca lhe é imediata."],
    chave:"Intui primordialmente e toma a própria auto-imagem como modelo de toda percepção da realidade.",
    weave:"O Sol é o senhor do Ascendente (Leão) posto na própria Casa I, em domicílio: o senhor da genitura é o próprio nativo, e a carta é intensamente auto-referente. Conjunto a Mercúrio, funde mente e identidade. E, por <span class=\"lab\">contra-antiscia</span>, o Sol une-se a Júpiter (Casa III) a 2°01′ — sustento oculto e benéfico: a vitalidade é secretamente alimentada pela fé e pela palavra confiante.",
    src:"Olavo de Carvalho — Planetas nas Casas, Sol na I" },

  { k:"mer", casa:1, titulo:"A Mente como Espelho do Eu", trad:true,
    p:["Mercúrio na Casa I volta a inteligência sobre a própria imagem: o pensar identifica-se com a persona. Em Leão, isso dá fala expressiva e senhorial, e um raciocínio posto a serviço do brilho pessoal.",
       "A pouco mais de 4° do Sol, Mercúrio está combusto: as idéias são vividas como extensões de quem se é — pensa-se com a vontade, e o discurso serve à afirmação do eu, mais que à investigação desinteressada."],
    chave:"A palavra e o pensamento como afirmação e espelho do próprio eu.",
    weave:"Conjunto à estrela <span class=\"lab\">Al Jabhah</span> (a fronte do Leão): autoridade intelectual e voz de mando, com gravidade saturnina. Sextil a Marte (1°39′, o aspecto mais estreito do mapa) aguça a perícia; trígono à Lua (6°18′) faz a mente escoar com facilidade para o sentimento.",
    src:"Mercúrio não consta em “Planetas nas Casas”; leitura pela doutrina tradicional" },

  { k:"ven", casa:2, titulo:"Imaginação Harmônica das Sensações",
    p:["Guarda na memória os dados sensíveis agradáveis, abstraindo-se dos desagradáveis, e os utiliza para otimizar as sensações diárias. Vê no ambiente físico as possibilidades que estão de acordo com sua expectativa, para que satisfaçam o seu equilíbrio sensorial.",
       "Em contrapartida, um estado emocional invencivelmente depressivo, se se instala, exprime-se com muita nitidez numa imagem alterada do mundo físico: a sensação generalizada de feiúra torna-se o retrato do estado interior."],
    chave:"Imagina poder moldar em sentido gratificante tudo o que afete o seu equilíbrio sensorial.",
    weave:"Vênus está em Libra, seu domicílio, e rege o Meio-Céu (Touro): a vocação liga-se ao belo, ao gosto e à justiça. Exata sobre <span class=\"lab\">Porrima</span> (dom profético) e sobre <span class=\"lab\">Vindemiatrix</span> (melancolia lúcida), o afeto e o juízo estético ficam tocados pela vidência e pela perda. Em quadratura à Lua (5°02′): tensão entre agradar e a necessidade emocional.",
    src:"Olavo de Carvalho — Planetas nas Casas, Vênus na II" },

  { k:"jup", casa:3, titulo:"Confiança na Própria Palavra",
    p:["Autoconfiança ilimitada na própria capacidade de aprender e de associar idéias. Confia também em comunicar o que pensa e em persuadir o interlocutor de qualquer coisa que queira. Não se deixa abater por argumentações contrárias — ele mesmo é que tem de sentir-se o autor de suas mudanças de idéia; quer estar livre para pensar o que quiser.",
       "Essa confiança é espontânea, dogmática e independente de ser ou não fundamentada. Será a capacidade intelectual real que decidirá se ela resulta em eficácia no aprender e no falar, ou numa “inépcia verbosa”."],
    chave:"Age como se tivesse o poder de amoldar a seus propósitos o curso do raciocínio — seu ou alheio.",
    weave:"Júpiter recebe o Sol por <span class=\"lab\">contra-antiscia</span> (2°01′): a identidade alimenta essa confiança — o eu afirma-se pela fala. Conjunto a <span class=\"lab\">Khambalia</span> (Mercúrio/Marte), ganha fio cortante e rapidez argumentativa. O trígono a Saturno (2°22′) dá estrutura e método à mente confiante; o sextil à Lua e o trígono a Marte somam calor e prontidão ao discurso.",
    src:"Olavo de Carvalho — Planetas nas Casas, Júpiter na III" },

  { k:"lua", casa:5, titulo:"O Desafio como Motor",
    p:["Valoriza as situações de desafio porque acredita ser nelas que encontrará felicidade. Deseja a vitória e sente prazer no ato de conquistar. O estado emocional determina a capacidade de enfrentar os desafios — e vice-versa: está feliz ou infeliz conforme o próprio desempenho, e o desempenho depende de estar feliz ou infeliz.",
       "Alternadamente pode sentir-se muito capaz ou muito incapaz, independentemente dos motivos objetivos. A demonstração efetiva da capacidade depende, então, de coincidirem a oportunidade externa, a capacidade real e a motivação subjetiva."],
    chave:"Sente como principal fonte de motivação (ou desmotivação) qualquer fato que interprete como desafio à sua capacidade.",
    weave:"A Lua é o ponto mais aspectado da genitura — a vida emocional é o eixo secreto sobre o qual gira o brilho solar. Regida por Saturno (na VII), o humor depende do outro e da forma. A oposição a Marte (4°39′) faz o desafio virar confronto; a quadratura a Vênus (5°02′) opõe vencer e agradar. Mas o sextil a Júpiter e a Saturno, e o trígono a Mercúrio, trazem amparo, medida e clareza. Em Capricórnio, o sentimento é sóbrio e exigente consigo.",
    src:"Olavo de Carvalho — Planetas nas Casas, Lua na V" },

  { k:"sat", casa:7, titulo:"O Espelho Múltiplo do Outro",
    p:["O indivíduo focaliza sua atenção no outro e constata, perplexo, que cada pessoa o vê de forma diferente. Os outros funcionam como espelho, e com tantas imagens torna-se difícil obter uma imagem coerente de si. Compara incessantemente essas imagens, tentando uma síntese sempre problemática, o que dificulta as tomadas de posição.",
       "Os outros parecem reais, e ele se sente insubstancial, observado por espectadores; tenta julgar a conduta alheia para referenciar a sua e criar um código moral para si. Ao querer agradar a todos, torna-se vulnerável a que lhe “grudem” a máscara que desejarem. Só entende o outro por um esforço imaginativo, aprendido — e pode inventar uma constelação de seres ideais que usa como padrão de julgamento."],
    chave:"Constrói-se buscando no outro — espelho múltiplo — uma regra e uma imagem coerente de si.",
    weave:"Saturno é o senhor da Casa VII posto na própria VII (em Peixes, retrógrado): o tema do outro e da relação é central e interiorizado — a retrogradação volta a exigência para dentro. O trígono a Júpiter (2°22′) e o sextil à Lua (5°06′) abrandam a gravidade: a fé e o afeto ajudam a firmar a imagem que os espelhos dispersam.",
    src:"Olavo de Carvalho — Planetas nas Casas, Saturno na VII" },

  { k:"mar", casa:11, titulo:"A Pressa de Chegar ao Futuro",
    p:["Sente-se ameaçado por qualquer oposição ou questionamento a algo que se propõe a ser ou fazer, a qualquer coisa que se interponha entre ele e seus planos. Reage tentando remover prontamente o obstáculo: tem pressa, urgência em chegar ao objetivo. Não quer perder tempo pensando, negociando ou transigindo — quer agir logo.",
       "Isso tanto pode fazê-lo abandonar num repente projetos longamente acalentados, quanto dar-lhe a capacidade de adaptar de improviso uma situação fortuita, amoldando-a a seus planos. Se não for ambicioso, pode agir no sentido de destruir as próprias possibilidades futuras antes que outros o façam."],
    chave:"Reage de maneira pronta, exteriorizada e fugaz a qualquer coisa que afete a sua visão de futuro.",
    weave:"Marte está em Câncer, em queda — o ímpeto é abrandado e sujeito ao humor. Conjunto a <span class=\"lab\">Menkalinan</span> (o ombro do Cocheiro), ganha destreza para conduzir e manobrar, com risco de ruína por precipitação. A oposição à Lua (4°39′) faz a pressa colidir com a necessidade emocional; o sextil a Mercúrio (1°39′) e o trígono a Júpiter (7°24′) dão tática hábil e sorte quando a ação serve a um propósito maior.",
    src:"Olavo de Carvalho — Planetas nas Casas, Marte na XI" }
];

var RETRATO = {
  titulo:"Retrato geral da genitura",
  p:["O Ascendente ergue-se em Leão a 15°16′, tendo o Sol por senhor — e o Sol acha-se na própria Casa I, em Leão, seu domicílio. O senhor da genitura é, pois, o próprio nativo: a carta é intensamente solar e auto-referente.",
     "É uma carta noturna, e a Lua — luminar da seita — está em Capricórnio na Casa V, sendo o ponto mais aspectado do mapa: a vida emocional é o eixo secreto sobre o qual gira o brilho solar. Mercúrio, também na I e conjunto ao Sol, põe a inteligência a serviço da imagem; Saturno, senhor da VII, na própria VII, faz do outro um espelho central. E o Sol e Júpiter unem-se por contra-antiscia: a vitalidade sustenta, e é sustentada por, a confiança na palavra."]
};

/* ============================================================
   RENDERIZAÇÃO
   ============================================================ */
function esc(s){ return s; }
function el(id){ return document.getElementById(id); }

function renderPills(){
  el("pills").innerHTML =
    '<span class="pill">Carta <b>noturna</b></span>'+
    '<span class="pill">Asc <span class="gl">'+SIGN_GL[4]+'</span> Leão</span>'+
    '<span class="pill">Luminar <span class="gl">'+P.lua.gl+'</span> Lua</span>'+
    '<span class="pill">Senhor <span class="gl">'+P.sol.gl+'</span> Sol na I</span>';
}

function renderChips(){
  var html="";
  ["sol","lua","mer","ven","mar","jup","sat","nn","ns","for"].forEach(function(k){
    var p=ptByKey(k);
    html+='<div class="chip"><span class="g gl">'+P[k].gl+'</span><span class="n"><b>'+P[k].nm+(p.rx?' ℞':'')+'</b>'+fmtLonFull(p.lon)+'</span><span class="h">Casa '+p.casa+'</span></div>';
  });
  el("chips").innerHTML=html;
}

function renderCasas(){
  var html='<div class="card"><div class="card-h"><div class="badge gl">'+P.sol.gl+'</div><div class="t"><h3>'+RETRATO.titulo+'</h3><div class="sub">o senhor da genitura é o próprio nativo</div></div></div>'+
    RETRATO.p.map(function(x){return '<p>'+x+'</p>';}).join("")+'</div>';
  CASAS.forEach(function(c){
    var rom={1:"I",2:"II",3:"III",5:"V",7:"VII",11:"XI"}[c.casa];
    html+='<div class="card">'+
      '<div class="card-h"><div class="badge gl">'+P[c.k].gl+'</div><div class="t">'+
        '<h3>'+P[c.k].nm+' na Casa '+rom+'</h3><div class="sub">'+c.titulo+'</div></div></div>'+
      '<span class="pos"><span class="gl">'+P[c.k].gl+'</span> '+fmtLonFull(ptByKey(c.k).lon)+(ptByKey(c.k).rx?' ℞':'')+' · Casa '+rom+'</span>'+
      '<p class="lead">'+CASA_INTRO[c.casa]+'</p>'+
      c.p.map(function(x){return '<p>'+x+'</p>';}).join("")+
      '<div class="chave"><b>Chave</b>'+c.chave+'</div>'+
      '<div class="weave"><span class="lab">No mapa —</span> '+c.weave+'</div>'+
      '<div class="src">'+c.src+'</div>'+
    '</div>';
  });
  el("sub-casas").innerHTML=html;
}

function renderEstrelas(){
  var html='<div class="card tight"><p class="lead" style="margin:0">Oito estrelas fixas têm contato estreito (conjunção &lt; 1°) com pontos da genitura. Julga-se cada uma conforme a sua natureza planetária e o ponto que toca.</p></div>';
  STARS.forEach(function(s){
    var p=ptByKey(s.con);
    var alvo = s.con==="asc"?"Ascendente":(s.con==="mc"?"Meio-Céu":P[s.con].nm);
    var alvoGl = s.con==="asc"?"Asc":(s.con==="mc"?"MC":P[s.con].gl);
    html+='<div class="card">'+
      '<div class="card-h"><div class="badge" style="font-size:20px">✦</div><div class="t">'+
        '<h3>'+s.nm+'</h3><div class="sub">natureza de '+s.nat+'</div></div></div>'+
      '<span class="pos"><span class="gl">'+ASP_GL.con+'</span> conjunção a <span class="gl">'+alvoGl+'</span> '+alvo+' · orbe '+s.orb+'</span>'+
      '<p>'+s.txt+'</p>'+
    '</div>';
  });
  el("sub-estrelas").innerHTML=html;
}

function renderAspectos(){
  var html='<div class="card">';
  ASPECTS.forEach(function(a){
    var pa=P[a.a], pb=P[a.b];
    html+='<div class="asp-row">'+
      '<span class="asp-glyphs gl">'+pa.gl+' <span class="op">'+ASP_GL[a.tipo]+'</span> '+pb.gl+'</span>'+
      '<span class="asp-body"><span class="nm">'+pa.nm+' '+ASP_NM[a.tipo].toLowerCase()+' '+pb.nm+'</span><span class="ds">'+ASP_DS[a.tipo]+'</span></span>'+
      '<span class="asp-orb">'+a.orb+'<br><span class="ap">'+(a.mov==="A"?"aplicativo":"separativo")+'</span></span>'+
    '</div>';
  });
  html+='</div>';
  // antiscia
  html+='<div class="card">'+
    '<div class="card-h"><div class="badge" style="font-size:19px">⚢</div><div class="t"><h3>Antiscia</h3><div class="sub">o espelho solsticial oculto</div></div></div>'+
    '<p class="lead">Os antiscia são pontos-espelho em torno do eixo dos solstícios (0° Câncer / 0° Capricórnio). Onde o antiscion de um planeta toca outro, há uma conjunção oculta, que une em segredo as duas significações.</p>'+
    '<span class="pos"><span class="gl">'+P.sol.gl+'</span> Sol <span style="color:var(--orange-lite)">contra-antiscion</span> <span class="gl">'+P.jup.gl+'</span> Júpiter · orbe 2°01′</span>'+
    '<p>O contra-antiscion do Sol (em Leão 24°14′) cai em Escorpião 5°46′, a apenas 2° de Júpiter na Casa III. É uma união secreta entre a vitalidade e a identidade (Sol, na I) e a confiança expansiva do pensamento e da palavra (Júpiter, na III): o senso de si alimenta-se do entusiasmo e da fé, e o discurso confiante nutre-se, por baixo, do próprio brilho solar. Um amparo benéfico que não aparece na roda dos aspectos, mas opera como se o Sol e Júpiter estivessem unidos.</p>'+
  '</div>';
  el("sub-aspectos").innerHTML=html;
}

function renderDados(){
  var pos='<tr><th></th><th>Ponto</th><th>Longitude</th><th>Casa</th><th>Dignidade</th></tr>';
  PT.forEach(function(p){
    pos+='<tr><td class="gl">'+P[p.k].gl+'</td><td>'+P[p.k].nm+(p.rx?' <span class="rx">℞</span>':'')+'</td><td>'+fmtLonFull(p.lon)+'</td><td>'+p.casa+'</td><td>'+p.dig+'</td></tr>';
  });
  el("tblPos").innerHTML=pos;

  var rom=["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];
  var tit={1:"Vida e corpo",2:"Bens e sustento",3:"Irmãos e caminhos curtos",4:"Pai, lar e fundamentos",5:"Filhos e prazeres",6:"Enfermidades e serviço",7:"Matrimônio e sócios",8:"Morte e bens alheios",9:"Fé, estudos e viagens",10:"Ofício e honras",11:"Amigos e esperanças",12:"Inimigos ocultos"};
  var cu='<tr><th>Casa</th><th>Cúspide</th><th>Significado</th></tr>';
  for(var i=0;i<12;i++){ cu+='<tr><td>'+rom[i]+'</td><td>'+fmtLonFull(CUSP[i])+'</td><td>'+tit[i+1]+'</td></tr>'; }
  el("tblCusp").innerHTML=cu;

  el("tblSect").innerHTML=
    '<tr><th>Condição</th><th>Valor</th></tr>'+
    '<tr><td>Seita</td><td>Noturna (Lua como luminar)</td></tr>'+
    '<tr><td>Benéfico da seita</td><td>'+P.ven.gl+' Vênus · maléfico contrário: '+P.mar.gl+' Marte</td></tr>'+
    '<tr><td>Senhor da genitura</td><td>'+P.sol.gl+' Sol (regente do Asc), na Casa I</td></tr>'+
    '<tr><td>'+P.for.gl+' Parte da Fortuna</td><td>'+fmtLonFull(ptByKey("for").lon)+' · Casa 8</td></tr>';
}

/* ---------- abas ---------- */
var TABS = [
  {id:"mandala", gl:"◉", nm:"Mandala"},
  {id:"natal",   gl:"☉"+VS, nm:"Natal"},
  {id:"dados",   gl:"▤", nm:"Dados"}
];
var SUBTABS = [
  {id:"casas", nm:"Planetas nas Casas"},
  {id:"estrelas", nm:"Estrelas Fixas"},
  {id:"aspectos", nm:"Aspectos & Antiscia"}
];
function setTab(id){
  TABS.forEach(function(t){
    document.querySelector('.tab[data-tab="'+t.id+'"]').setAttribute("aria-selected", t.id===id);
    el("view-"+t.id).classList.toggle("hidden", t.id!==id);
  });
  window.scrollTo({top:0,behavior:"smooth"});
}
function setSub(id){
  SUBTABS.forEach(function(t){
    document.querySelector('.subtab[data-sub="'+t.id+'"]').setAttribute("aria-selected", t.id===id);
    el("sub-"+t.id).classList.toggle("hidden", t.id!==id);
  });
}
function buildTabs(){
  el("tabs").innerHTML=TABS.map(function(t){
    return '<button class="tab" role="tab" data-tab="'+t.id+'" aria-selected="'+(t.id==="mandala")+'"><span class="gl">'+t.gl+'</span>'+t.nm+'</button>';
  }).join("");
  el("subtabs").innerHTML=SUBTABS.map(function(t){
    return '<button class="subtab" role="tab" data-sub="'+t.id+'" aria-selected="'+(t.id==="casas")+'">'+t.nm+'</button>';
  }).join("");
  el("tabs").addEventListener("click",function(e){ var b=e.target.closest(".tab"); if(b) setTab(b.dataset.tab); });
  el("subtabs").addEventListener("click",function(e){ var b=e.target.closest(".subtab"); if(b) setSub(b.dataset.sub); });
}

/* ---------- init ---------- */
function init(){
  buildTabs();
  renderPills();
  el("mandala").innerHTML = buildWheel();
  renderChips();
  renderCasas();
  renderEstrelas();
  renderAspectos();
  renderDados();
  el("btnPrint").addEventListener("click", function(){ window.print(); });
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", init); else init();
