/* ============================================================
   OFFICINA ASTROLOGICA — Genitura de Lucas
   Mandala fiel à roda de referência · planetas nas casas
   (Olavo de Carvalho, em síntese) · regências · estrelas fixas
   · aspectos · antiscia.  Glifos reais (U+FE0E), sem emojis.
   ============================================================ */
"use strict";
var VS = "︎"; // seletor de variação textual: impede renderização como emoji

/* ---------- glifos e nomes ---------- */
var SIGN_GL = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"].map(function(g){return g+VS;});
var SIGN_NM = ["Áries","Touro","Gêmeos","Câncer","Leão","Virgem","Libra","Escorpião","Sagitário","Capricórnio","Aquário","Peixes"];
var ELEM    = ["fogo","terra","ar","agua","fogo","terra","ar","agua","fogo","terra","ar","agua"];

/* cores da roda (fiéis à referência) */
var C_ELEM = {fogo:"#E8583A", terra:"#D2A33C", ar:"#7FA8E8", agua:"#4FC0D6"};
var C_PLAN = {sol:"#F0A030", lua:"#EDEDF2", mer:"#E8D44D", ven:"#58C463",
              mar:"#E5493A", jup:"#8385E6", sat:"#D2A33C",
              nn:"#D8D8E0", ns:"#D8D8E0", for:"#E8E8F0"};
var C_RING="#8A8A96", C_TICK="#5F5F6B", C_TICKM="#9A9AA8", C_CUSP="#4E4E58",
    C_ANG="#B9B9C6", C_NUM="#6F6F7C", C_STAR="#C9A227",
    C_HARD="#E2593F", C_SOFT="#4A8FD6", C_BG="#07070C";

var P = {
  sol:{gl:"☉"+VS, nm:"Sol"},   lua:{gl:"☽"+VS, nm:"Lua"},
  mer:{gl:"☿"+VS, nm:"Mercúrio"}, ven:{gl:"♀"+VS, nm:"Vênus"},
  mar:{gl:"♂"+VS, nm:"Marte"}, jup:{gl:"♃"+VS, nm:"Júpiter"},
  sat:{gl:"♄"+VS, nm:"Saturno"}, nn:{gl:"☊"+VS, nm:"Nodo Norte"},
  ns:{gl:"☋"+VS, nm:"Nodo Sul"}, for:{gl:"⊗"+VS, nm:"Parte da Fortuna"}
};
var ASP_GL = {con:"☌"+VS, sex:"⚹"+VS, qua:"□"+VS, tri:"△"+VS, opo:"☍"+VS};

/* ---------- posições ---------- */
function abs(si,d,m){ return si*30 + d + (m||0)/60; }
var PT = [
  {k:"sol", si:4,  d:24, m:14, casa:1,  dig:"Domicílio", rx:false},
  {k:"lua", si:9,  d:5,  m:2,  casa:5,  dig:"Detrimento · triplicidade", rx:false},
  {k:"mer", si:4,  d:28, m:43, casa:1,  dig:"Peregrino · combusto", rx:false},
  {k:"ven", si:6,  d:10, m:4,  casa:2,  dig:"Domicílio", rx:false},
  {k:"mar", si:3,  d:0,  m:22, casa:11, dig:"Queda · triplicidade", rx:false},
  {k:"jup", si:7,  d:7,  m:46, casa:3,  dig:"Peregrino", rx:false},
  {k:"sat", si:11, d:10, m:9,  casa:7,  dig:"Peregrino", rx:true},
  {k:"nn",  si:7,  d:19, m:1,  casa:3,  dig:"—", rx:true},
  {k:"ns",  si:1,  d:19, m:1,  casa:9,  dig:"—", rx:true},
  {k:"for", si:0,  d:4,  m:28, casa:8,  dig:"—", rx:false}
];
PT.forEach(function(p){ p.lon = abs(p.si,p.d,p.m); });
function ptByKey(k){ for(var i=0;i<PT.length;i++) if(PT[i].k===k) return PT[i]; return null; }

var CUSP = [abs(4,15,16), abs(5,23,18), abs(6,28,3),  abs(7,26,52), abs(8,21,55), abs(9,16,42),
            abs(10,15,16),abs(11,23,18),abs(0,28,3),  abs(1,26,52), abs(2,21,55), abs(3,16,42)];
var ASC = CUSP[0], MC = CUSP[9];
var ROM = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];

function dms(lon){ lon=((lon%360)+360)%360; var si=Math.floor(lon/30), g=lon-si*30,
  d=Math.floor(g), m=Math.round((g-d)*60); if(m===60){m=0;d++;} return {si:si,d:d,m:m}; }
function fmtLonFull(lon){ var t=dms(lon); return t.d+"°"+String(t.m).padStart(2,"0")+"′ "+SIGN_NM[t.si]; }
function fold(x){ x=((x%360)+360)%360; return x>180?x-360:x; }

/* ============================================================
   ASPECTOS
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
   ESTRELAS FIXAS (longitude real na época do nascimento)
   ============================================================ */
var STARS = [
  {nm:"Porrima", lon:abs(6,10,4),  con:"ven", orb:"0°00′", nat:"Mercúrio / Vênus", dr:0,
   txt:"γ Virginis, a deusa da profecia. Confere dom profético e refinamento, cortesia, senso de justiça e a capacidade de prever e conciliar. Exata sobre Vênus, agracia o amor e o juízo estético com uma qualidade quase oracular — presságios do que agrada e do que fere."},
  {nm:"Vindemiatrix", lon:abs(6,9,52), con:"ven", orb:"0°12′", nat:"Saturno / Mercúrio", dr:13,
   txt:"ε Virginis, “a que faz viúvas”. Inteligência aguda e engenhosa, mas melancolia, perdas afetivas e o risco de falar ou agir cedo demais. Sobre Vênus, e ao lado de Porrima, dá ao afeto profundidade reflexiva e uma lucidez triste: vê-se longe, e por isso também a ausência."},
  {nm:"Dubhe", lon:abs(4,15,7), con:"asc", orb:"0°09′", nat:"Marte", dr:0,
   txt:"α Ursae Majoris, a Ursa Maior. Marca a própria imagem e o corpo com força, autoridade e combatividade — um olhar penetrante, quase destrutivo, segundo a tradição. Quase exata sobre o Ascendente em Leão, redobra o brilho e a vontade de reinar; dá presença dominante e coragem, ao preço do orgulho."},
  {nm:"Zuben Eschamali", lon:abs(7,19,17), con:"nn", orb:"0°16′", nat:"Júpiter / Mercúrio", dr:13,
   txt:"β Librae, o Prato Norte da Balança — tida como a mais afortunada das duas conchas. Honra, ambição nobre e boa fortuna durável. Sobre o Nodo Norte, aponta o caminho de crescimento pela justiça, pela medida e pela elevação: subir sem desequilibrar a balança."},
  {nm:"Menkalinan", lon:abs(2,29,51), con:"mar", orb:"0°32′", nat:"Marte / Mercúrio", dr:0,
   txt:"β Aurigae, o ombro do Cocheiro. Dá destreza para conduzir e manobrar, energia hábil e veloz — mas adverte contra a ruína por precipitação, por vento e por fogo. Sobre Marte na XI, reforça a pressa de chegar ao objetivo: tática brilhante quando há rédea, desastre quando não há."},
  {nm:"Algol", lon:abs(1,26,10), con:"mc", orb:"0°46′", nat:"Saturno / Júpiter", dr:0,
   txt:"β Persei, a Cabeça da Medusa — a mais intensa das fixas. A tradição a liga à violência e à “perda da cabeça”, literal e figurada. Sobre o Meio-Céu, concentra enorme intensidade sobre a vocação e a imagem pública: poder de fascinação e perigo. O chamado é encarar o terror sem desviar o olhar e transmutar o caos em obra."},
  {nm:"Al Jabhah", lon:abs(4,27,50), con:"mer", orb:"0°53′", nat:"Saturno / Mercúrio", dr:0,
   txt:"ζ Leonis, a fronte do Leão. Mente séria e estruturada, capaz de comando e de método, com risco de dureza, perdas e disputas quando a palavra se faz arma. Sobre Mercúrio em Leão na I, dá autoridade intelectual e voz de mando, temperada pela gravidade saturnina."},
  {nm:"Khambalia", lon:abs(7,6,52), con:"jup", orb:"0°54′", nat:"Mercúrio / Marte", dr:0,
   txt:"λ Virginis, a garra. Argúcia veloz, argumentativa e mutável; disputa e engenho. Sobre Júpiter na III, aguça a palavra persuasiva do nativo — a confiança em convencer ganha fio cortante e rapidez, com o risco da controvérsia e da inconstância."}
];

/* ============================================================
   MANDALA — reprodução fiel da roda de referência
   ============================================================ */
var CX=320, R_OUT=300, R_SIGN_I=252, R_SIGNGL=278, R_STAR=259,
    R_PL=230, R_DEG=202, R_SGN=184, R_MIN=168, R_NUM=133, R_IN=122;

function pol(lon,r){ var a=(180+(lon-ASC))*Math.PI/180; return [CX+r*Math.cos(a), CX-r*Math.sin(a)]; }
function ln(lon,r1,r2,stroke,w,op){
  var a=pol(lon,r1), b=pol(lon,r2);
  return '<line x1="'+a[0].toFixed(1)+'" y1="'+a[1].toFixed(1)+'" x2="'+b[0].toFixed(1)+'" y2="'+b[1].toFixed(1)+
         '" stroke="'+stroke+'" stroke-width="'+w+'"'+(op?' stroke-opacity="'+op+'"':'')+'/>';
}
function tx(x,y,s,size,fill,extra){
  return '<text x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" font-size="'+size+'" fill="'+fill+
         '" text-anchor="middle" dominant-baseline="central"'+(extra||"")+'>'+s+'</text>';
}
function txAt(lon,r,s,size,fill,extra){ var p=pol(lon,r); return tx(p[0],p[1],s,size,fill,extra); }

function buildWheel(){
  var s='<svg class="mandala" viewBox="0 0 640 640" role="img" aria-label="Mandala natal de Lucas">', i;

  /* seita e hora planetária (canto superior esquerdo, como na referência) */
  s+='<text x="10" y="20" font-size="15" fill="#EDEDF2" font-weight="700">Night: '+
     '<tspan fill="'+C_PLAN.sat+'">'+P.sat.gl+'</tspan>  Hour: <tspan fill="'+C_PLAN.ven+'">'+P.ven.gl+'</tspan></text>';
  s+='<text x="10" y="42" font-size="12.5" fill="#7A7A88">-37/+27 mins</text>';

  /* anéis */
  s+='<circle cx="320" cy="320" r="'+R_OUT+'" fill="none" stroke="'+C_RING+'" stroke-width="1.2"/>';
  s+='<circle cx="320" cy="320" r="'+R_SIGN_I+'" fill="none" stroke="'+C_RING+'" stroke-width="1"/>';
  s+='<circle cx="320" cy="320" r="'+R_IN+'" fill="none" stroke="'+C_RING+'" stroke-width="1"/>';

  /* divisões dos signos + glifos coloridos por elemento */
  for(i=0;i<12;i++){
    s+=ln(i*30, R_SIGN_I, R_OUT, C_RING, 1);
    s+=txAt(i*30+15, R_SIGNGL, SIGN_GL[i], 22, C_ELEM[ELEM[i]]);
  }

  /* régua de graus (1° / 5° / 10°) */
  for(i=0;i<360;i++){
    var maj=(i%10===0), med=(i%5===0);
    s+=ln(i, R_SIGN_I, R_SIGN_I-(maj?13:(med?8:4)), maj?C_TICKM:C_TICK, maj?1:0.7);
  }

  /* cúspides + numeração das casas (no meio de cada casa) */
  for(i=0;i<12;i++){
    var ang=(i===0||i===3||i===6||i===9);
    s+=ln(CUSP[i], R_IN, R_SIGN_I, ang?C_ANG:C_CUSP, ang?1.4:0.8);
    var w=((CUSP[(i+1)%12]-CUSP[i])%360+360)%360;
    s+=txAt(CUSP[i]+w/2, R_NUM, ROM[i]==="I"||ROM[i]==="IV"||ROM[i]==="VII"||ROM[i]==="X"?String(i+1):String(i+1), 11, C_NUM);
  }

  /* aspectos no miolo */
  ASPECTS.forEach(function(a){
    if(a.tipo==="con") return;
    var pa=ptByKey(a.a), pb=ptByKey(a.b); if(!pa||!pb) return;
    var hard=(a.tipo==="qua"||a.tipo==="opo");
    var x=pol(pa.lon,R_IN), y=pol(pb.lon,R_IN);
    s+='<line x1="'+x[0].toFixed(1)+'" y1="'+x[1].toFixed(1)+'" x2="'+y[0].toFixed(1)+'" y2="'+y[1].toFixed(1)+
       '" stroke="'+(hard?C_HARD:C_SOFT)+'" stroke-width="1.5" stroke-opacity="0.95"/>';
  });

  /* estrelas fixas — nomes em dourado, tangentes ao anel */
  STARS.forEach(function(st){
    var a=180+(st.lon-ASC), rot=-a+90; rot=((rot+180)%360+360)%360-180;
    if(rot>90||rot<-90) rot+=180;
    var p=pol(st.lon, R_STAR-st.dr);
    s+='<text x="'+p[0].toFixed(1)+'" y="'+p[1].toFixed(1)+'" font-size="9.5" fill="'+C_STAR+
       '" text-anchor="middle" dominant-baseline="central" transform="rotate('+rot.toFixed(1)+' '+p[0].toFixed(1)+' '+p[1].toFixed(1)+')">'+st.nm+'</text>';
  });

  /* pontos: glifo → grau → signo → minuto (de fora para dentro) */
  function stack(lon, glyph, color, rx, isAngle){
    var t=dms(lon), o="";
    o+=ln(lon, R_SIGN_I, R_SIGN_I-16, color, 1.1);
    if(isAngle){
      var c=pol(lon,R_PL);
      o+='<ellipse cx="'+c[0].toFixed(1)+'" cy="'+c[1].toFixed(1)+'" rx="17" ry="11.5" fill="'+C_BG+'" stroke="#FFFFFF" stroke-width="1.1"/>';
      o+=tx(c[0],c[1],glyph,12,"#FFFFFF",' font-weight="700"');
    }else{
      o+=txAt(lon,R_PL,glyph+(rx?'<tspan font-size="9" dy="-5">℞</tspan>':""),19,color);
    }
    o+=txAt(lon,R_DEG,t.d+"°",13,"#DCDCE4");
    o+=txAt(lon,R_SGN,SIGN_GL[t.si],13,C_ELEM[ELEM[t.si]]);
    o+=txAt(lon,R_MIN,String(t.m).padStart(2,"0")+"′",11.5,"#9E9EAC");
    return o;
  }
  PT.forEach(function(p){ s+=stack(p.lon, P[p.k].gl, C_PLAN[p.k], p.rx, false); });
  s+=stack(ASC,"Asc",null,false,true);
  s+=stack(MC,"MC",null,false,true);
  s+=stack(ASC+180,"Dsc",null,false,true);
  s+=stack(MC+180,"IC",null,false,true);

  s+='</svg>';
  return s;
}

/* ============================================================
   REGÊNCIAS — que casas cada planeta rege (pelo signo na cúspide)
   ============================================================ */
var REGENCIA = {
  sol:[{n:"I", signo:"Leão", tema:"a vida, o corpo, a vitalidade e a própria pessoa do nativo"}],
  lua:[{n:"XII", signo:"Câncer", tema:"os inimigos ocultos, a reclusão, as aflições e o que obra em segredo"}],
  mer:[{n:"II", signo:"Virgem", tema:"os bens, o sustento e os recursos próprios"},
       {n:"XI", signo:"Gêmeos", tema:"os amigos, os patronos e as esperanças"}],
  ven:[{n:"III", signo:"Libra", tema:"os irmãos, os estudos menores e os caminhos curtos"},
       {n:"X", signo:"Touro", tema:"o ofício, as honras e a reputação"}],
  mar:[{n:"IV", signo:"Escorpião", tema:"o pai, o lar, as raízes e o fim das coisas"},
       {n:"IX", signo:"Áries", tema:"a fé, os estudos superiores e as longas viagens"}],
  jup:[{n:"V", signo:"Sagitário", tema:"os filhos, os prazeres e tudo o que se cria"},
       {n:"VIII", signo:"Peixes", tema:"a morte, as heranças e os bens alheios"}],
  sat:[{n:"VI", signo:"Capricórnio", tema:"as enfermidades, o serviço e o trabalho diário"},
       {n:"VII", signo:"Aquário", tema:"o matrimônio, os sócios e os inimigos declarados"}]
};

/* ============================================================
   PLANETAS NAS CASAS — Olavo de Carvalho, em síntese
   ============================================================ */
var CASA_INTRO = {
  1:"A auto-imagem: o conjunto do que o indivíduo vê e compreende sobre si mesmo sem intermediários.",
  2:"O conhecimento do real e do mundo físico — o confronto do indivíduo com o que o cerca, inclusive o próprio corpo como densidade e força.",
  3:"O pensamento e a linguagem — transformar a realidade em signo; é pela linguagem que o real se distingue do sujeito.",
  5:"O conhecimento das próprias possibilidades de ação — o domínio do que se pode conquistar ou perder; a consciência do poder pessoal.",
  7:"A apreensão do eu pelo outro — tudo o que se sabe de si a pretexto de outro; a definição mútua dos papéis.",
  11:"Os projetos futuros — a imagem integral do personagem que se quer ser, os ideais da geração, o desejo de fazer algo extraordinário."
};

var CASAS = [
  { k:"sol", casa:1, titulo:"Inteligência Intuitiva Autônoma",
    p:"O primeiro dado seguro que o sujeito obtém é sobre si mesmo: a auto-imagem lhe parece óbvia, inquestionável e transparente — e, por isso, supõe-se transparente também aos demais. Auto-refere-se o tempo todo, tomando a própria biografia como chave para compreender o mundo, e tem por traço fundamental a liberdade: vê-se como um centro que irradia. Quando não é o centro dos acontecimentos, precisa de esforço para captar o que o outro espera dele — a perspectiva alheia nunca lhe é imediata.",
    chave:"Intui primordialmente e toma a própria auto-imagem como modelo de toda percepção da realidade.",
    weave:"O Sol é o senhor do Ascendente posto na própria Casa I, em domicílio: o senhor da genitura é o próprio nativo, e regendo apenas a I, é significador puro de si mesmo — nada o divide. Por <span class=\"lab\">contra-antiscia</span>, une-se a Júpiter na III (2°01′): a vitalidade é secretamente alimentada pela fé e pela palavra confiante.",
    src:"Olavo de Carvalho — Planetas nas Casas, Sol na I" },

  { k:"mer", casa:1, titulo:"A Mente como Espelho do Eu", trad:true,
    p:"Mercúrio na Casa I volta a inteligência sobre a própria imagem: o pensar identifica-se com a persona, e em Leão dá fala expressiva e senhorial, com o raciocínio posto a serviço do brilho pessoal. A pouco mais de 4° do Sol, está combusto — as idéias são vividas como extensões de quem se é, e o discurso serve à afirmação do eu mais que à investigação desinteressada.",
    chave:"A palavra e o pensamento como afirmação e espelho do próprio eu.",
    weave:"Regendo a II e a XI, é ele quem responde pelo sustento e pelos amigos: o pão e a rede de alianças vêm pela palavra e pelo engenho — e ambos ficam sujeitos à combustão solar, isto é, ao quanto o nativo os põe a serviço da própria imagem. Conjunto a <span class=\"lab\">Al Jabhah</span>, ganha autoridade e voz de mando; o sextil a Marte (1°39′, o mais estreito do mapa) aguça a perícia.",
    src:"Mercúrio não consta em “Planetas nas Casas”; leitura pela doutrina tradicional" },

  { k:"ven", casa:2, titulo:"Imaginação Harmônica das Sensações",
    p:"Guarda na memória os dados sensíveis agradáveis, abstraindo-se dos desagradáveis, e os utiliza para otimizar as sensações diárias: vê no ambiente físico apenas as possibilidades que estão de acordo com sua expectativa, para que satisfaçam o seu equilíbrio sensorial. Em contrapartida, um estado emocional invencivelmente depressivo, se se instala, exprime-se com nitidez numa imagem alterada do mundo físico — a sensação generalizada de feiúra torna-se o retrato do estado interior.",
    chave:"Imagina poder moldar em sentido gratificante tudo o que afete o seu equilíbrio sensorial.",
    weave:"Em Libra, seu domicílio, e regendo a X: <b>é ela a significadora da vocação e das honras</b> — o ofício liga-se ao belo, ao gosto e à justiça. Regendo também a III, une a palavra e o ofício num mesmo fio. Exata sobre <span class=\"lab\">Porrima</span> e <span class=\"lab\">Vindemiatrix</span>, o juízo estético fica tocado pela vidência e pela perda.",
    src:"Olavo de Carvalho — Planetas nas Casas, Vênus na II" },

  { k:"jup", casa:3, titulo:"Confiança na Própria Palavra",
    p:"Autoconfiança ilimitada na própria capacidade de aprender, de associar idéias e de persuadir o interlocutor de qualquer coisa que queira. Não se deixa abater por argumentações contrárias — ele mesmo é que tem de sentir-se o autor de suas mudanças de idéia, e quer estar livre para pensar o que quiser. A confiança é espontânea, dogmática e independente de ser fundamentada: caberá à capacidade intelectual real decidir se resulta em eficácia no aprender e no falar, ou numa “inépcia verbosa”.",
    chave:"Age como se tivesse o poder de amoldar a seus propósitos o curso do raciocínio — seu ou alheio.",
    weave:"Regendo a V e a VIII, essa confiança na palavra é o mesmo instrumento pelo qual se criam os filhos da obra e pelo qual se lida com heranças, crises e bens alheios — falar é, para ele, gerar e também atravessar mortes. Recebe o Sol por <span class=\"lab\">contra-antiscia</span> (2°01′): o eu afirma-se pela fala. O trígono a Saturno (2°22′) dá-lhe estrutura; <span class=\"lab\">Khambalia</span> dá-lhe fio cortante.",
    src:"Olavo de Carvalho — Planetas nas Casas, Júpiter na III" },

  { k:"lua", casa:5, titulo:"O Desafio como Motor",
    p:"Valoriza as situações de desafio porque acredita que é nelas que encontrará felicidade: deseja a vitória e sente prazer no ato de conquistar. O estado emocional determina a capacidade de enfrentar os desafios — e vice-versa: está feliz ou infeliz conforme o próprio desempenho, e o desempenho depende de estar feliz ou infeliz. Alternadamente pode sentir-se muito capaz ou muito incapaz, independentemente dos motivos objetivos.",
    chave:"Sente como principal fonte de motivação (ou desmotivação) qualquer fato que interprete como desafio à sua capacidade.",
    weave:"Luminar da seita e ponto mais aspectado do mapa — a vida emocional é o eixo secreto sobre o qual gira o brilho solar. Regendo a XII, o humor é também a porta dos inimigos ocultos e da reclusão: o que adoece por dentro chega pelo sentimento. A oposição a Marte (4°39′) faz do desafio um confronto; a quadratura a Vênus (5°02′) opõe vencer e agradar; mas os sextis a Júpiter e a Saturno trazem amparo e medida.",
    src:"Olavo de Carvalho — Planetas nas Casas, Lua na V" },

  { k:"sat", casa:7, titulo:"O Espelho Múltiplo do Outro",
    p:"Focaliza a atenção no outro e constata, perplexo, que cada pessoa o vê de forma diferente: os outros funcionam como espelho, e com tantas imagens torna-se difícil obter uma imagem coerente de si. Compara-as incessantemente, tentando uma síntese sempre problemática e um código moral que lhe sirva de regra. Os outros parecem reais e ele, insubstancial — e, ao querer corresponder a todas as expectativas, fica vulnerável a que lhe “grudem” a máscara que desejarem. Só entende o outro por um esforço imaginativo, que precisa ser aprendido.",
    chave:"Constrói-se buscando no outro — espelho múltiplo — uma regra e uma imagem coerente de si.",
    weave:"Senhor da VII posto na própria VII, retrógrado: o tema do outro é central e volta-se para dentro. Regendo também a VI, o mesmo Saturno responde pelas enfermidades e pelo trabalho diário — o desgaste do corpo e da rotina nasce da mesma raiz que a relação. O trígono a Júpiter (2°22′) e o sextil à Lua (5°06′) abrandam a gravidade.",
    src:"Olavo de Carvalho — Planetas nas Casas, Saturno na VII" },

  { k:"mar", casa:11, titulo:"A Pressa de Chegar ao Futuro",
    p:"Sente-se ameaçado por qualquer oposição ou questionamento a algo que se propõe a ser ou fazer, a qualquer coisa que se interponha entre ele e seus planos. Reage tentando remover prontamente o obstáculo: tem pressa, urgência em chegar ao objetivo, e não quer perder tempo pensando, negociando ou transigindo. Isso tanto pode fazê-lo abandonar num repente projetos longamente acalentados, quanto dar-lhe a capacidade de amoldar de improviso uma situação fortuita a seus planos.",
    chave:"Reage de maneira pronta, exteriorizada e fugaz a qualquer coisa que afete a sua visão de futuro.",
    weave:"Em Câncer, em queda: o ímpeto é abrandado e fica sujeito ao humor. Regendo a IV e a IX, essa pressa é a mesma que agita as raízes, o pai e o fim das coisas, e que impele à fé e às longas viagens — o futuro é buscado tanto para longe quanto para trás. Conjunto a <span class=\"lab\">Menkalinan</span>, ganha destreza de cocheiro e risco de ruína por precipitação.",
    src:"Olavo de Carvalho — Planetas nas Casas, Marte na XI" }
];

var RETRATO = {
  titulo:"Retrato geral da genitura",
  p:["O Ascendente ergue-se em Leão a 15°16′, tendo o Sol por senhor — e o Sol acha-se na própria Casa I, em Leão, seu domicílio. O senhor da genitura é, pois, o próprio nativo: a carta é intensamente solar e auto-referente. E como o Sol rege somente a Casa I, ele é significador puro de si mesmo, sem outro assunto que o divida.",
     "É uma carta noturna, e a Lua — luminar da seita — está em Capricórnio na Casa V, sendo o ponto mais aspectado do mapa: a vida emocional é o eixo secreto sobre o qual gira o brilho solar. Vênus, em domicílio na Libra, rege o Meio-Céu e responde pela vocação; Saturno, senhor da VII, está na própria VII, fazendo do outro um espelho central. E o Sol e Júpiter unem-se por contra-antiscia: a vitalidade sustenta, e é sustentada por, a confiança na palavra."]
};

/* ============================================================
   TERMOS EGÍPCIOS  (Culpeper julga a enfermidade também pelos termos)
   ============================================================ */
var TERMOS = [
  [[6,"jup"],[12,"ven"],[20,"mer"],[25,"mar"],[30,"sat"]],  /* Áries */
  [[8,"ven"],[14,"mer"],[22,"jup"],[27,"sat"],[30,"mar"]],  /* Touro */
  [[6,"mer"],[12,"jup"],[17,"ven"],[24,"mar"],[30,"sat"]],  /* Gêmeos */
  [[7,"mar"],[13,"ven"],[19,"mer"],[26,"jup"],[30,"sat"]],  /* Câncer */
  [[6,"jup"],[11,"ven"],[18,"sat"],[24,"mer"],[30,"mar"]],  /* Leão */
  [[7,"mer"],[17,"ven"],[21,"jup"],[28,"mar"],[30,"sat"]],  /* Virgem */
  [[6,"sat"],[14,"mer"],[21,"jup"],[28,"ven"],[30,"mar"]],  /* Libra */
  [[7,"mar"],[11,"ven"],[19,"mer"],[24,"jup"],[30,"sat"]],  /* Escorpião */
  [[12,"jup"],[17,"ven"],[21,"mer"],[26,"sat"],[30,"mar"]], /* Sagitário */
  [[7,"mer"],[14,"jup"],[22,"ven"],[26,"sat"],[30,"mar"]],  /* Capricórnio */
  [[7,"mer"],[13,"ven"],[20,"jup"],[25,"mar"],[30,"sat"]],  /* Aquário */
  [[12,"ven"],[16,"jup"],[19,"mer"],[28,"mar"],[30,"sat"]]  /* Peixes */
];
function termoDe(lon){
  var t=dms(lon), tab=TERMOS[t.si], g=t.d+t.m/60;
  for(var i=0;i<tab.length;i++) if(g<tab[i][0]) return tab[i][1];
  return tab[tab.length-1][1];
}

/* ============================================================
   TEMPERAMENTO  (método clássico: Asc, seu senhor, Lua, estação, aspectos)
   ============================================================ */
var HUMOR = {
  col:{nm:"Colérico",   qual:"quente e seco",  hum:"bile amarela", el:"fogo",  cor:"#d95926"},
  mel:{nm:"Melancólico",qual:"frio e seco",    hum:"bile negra",   el:"terra", cor:"#9085e9"},
  san:{nm:"Sanguíneo",  qual:"quente e úmido", hum:"sangue",       el:"ar",    cor:"#e66767"},
  fle:{nm:"Fleumático", qual:"frio e úmido",   hum:"fleuma",       el:"água",  cor:"#3987e5"}
};
var TESTEMUNHOS = [
  {h:"col", w:3,   t:"Ascendente em Leão — signo de fogo, quente e seco"},
  {h:"col", w:3,   t:"Sol, senhor do Ascendente, em domicílio na Casa I — quente e seco, e forte"},
  {h:"col", w:2,   t:"Estação do Sol: Leão, o pino do verão tropical"},
  {h:"col", w:1.5, t:"Marte (quente e seco) em oposição à Lua"},
  {h:"mel", w:3,   t:"Lua em Capricórnio — signo de terra, frio e seco, e em detrimento"},
  {h:"mel", w:2,   t:"Mercúrio (frio e seco) na Casa I, junto ao Ascendente"},
  {h:"mel", w:1.5, t:"Saturno (frio e seco) em sextil à Lua"},
  {h:"mel", w:1.5, t:"Mercúrio em trígono à Lua"},
  {h:"san", w:2,   t:"Fase da Lua: gibosa crescente — quente e úmida"},
  {h:"san", w:1.5, t:"Júpiter (quente e úmido) em sextil à Lua"},
  {h:"fle", w:1.5, t:"Vênus (fria e úmida) em quadratura à Lua"}
];
function vetorTemperamento(){
  var acc={col:0,mel:0,san:0,fle:0}, tot=0;
  TESTEMUNHOS.forEach(function(x){ acc[x.h]+=x.w; tot+=x.w; });
  var keys=["col","mel","san","fle"];
  /* percentuais por maior resto — garantem soma 100 */
  var raw=keys.map(function(k){return acc[k]/tot*100;});
  var pct=raw.map(Math.floor), falta=100-pct.reduce(function(a,b){return a+b;},0);
  var ord=raw.map(function(v,i){return {i:i, r:v-Math.floor(v), w:acc[keys[i]]};})
             .sort(function(a,b){ return (b.r-a.r) || (b.w-a.w); });
  for(var j=0;j<falta;j++) pct[ord[j].i]++;
  return keys.map(function(k,i){ return {k:k, w:acc[k], pct:pct[i]}; })
             .sort(function(a,b){ return b.w-a.w; });
}

/* ============================================================
   ENFERMIDADES — significadores da Casa VI (Culpeper)
   ============================================================ */
var SIGNIFICADORES = [
  {t:"Cúspide da Casa VI", v:"Capricórnio 16°42′ — signo frio e seco, cardinal, de terra",
   n:"Rege joelhos, juntas, ossos e pele. Culpeper atribui a Capricórnio “a lepra, a sarna e todos os males dos joelhos”."},
  {t:"Senhor da Casa VI", v:"Saturno em Peixes 10°09′ ℞, na Casa VII, peregrino",
   n:"Saturno é frio e seco — o autor da melancolia. Sem dignidade e retrógrado, opera por obstrução, retardo e cronicidade, e não por crise aguda."},
  {t:"Planetas na Casa VI", v:"Nenhum",
   n:"O juízo recai inteiramente sobre o senhor da casa e sobre os signos — não há corpo assentado sobre a enfermidade."},
  {t:"Termo da cúspide da VI", v:"Termo de Vênus (Capricórnio 14°–22°)",
   n:"Vênus é fria e úmida: tempera a secura saturnina com fleuma, inclinando a males de humor frio e úmido — rheumas, catarros, retenções."},
  {t:"Termo de Saturno", v:"Termo de Vênus (Peixes 0°–12°)",
   n:"O senhor da enfermidade cai também em termo venéreo: confirma a mistura de melancolia com fleuma, e aponta os pés e as extremidades."},
  {t:"Termo do Ascendente", v:"Termo de Saturno (Leão 11°–18°)",
   n:"O corpo mesmo traz assinatura saturnina, ainda que o Ascendente seja de fogo — a secura é a marca comum a ambos."},
  {t:"Lua e a Casa XII", v:"Lua em Capricórnio, em detrimento, regendo a XII",
   n:"A Lua governa os humores do corpo. Em detrimento e no signo da VI, e senhora da casa das enfermidades ocultas, indica males que se ocultam e se arrastam."}
];

var ZONAS = [
  {gl:"♑", z:"Joelhos, juntas, ossos e pele", s:9,
   p:"Capricórnio na cúspide da VI e a Lua no mesmo signo — dupla assinatura. Frio e seco: rigidez, artrites, males da pele, dos dentes e dos ossos."},
  {gl:"♓", z:"Pés e extremidades", s:7,
   p:"Saturno, senhor da VI, em Peixes e retrógrado. Culpeper dá a Saturno “a gota dos pés e das mãos” e as obstruções por humor frio e úmido."},
  {gl:"♋", z:"Estômago e peito", s:6,
   p:"Marte em queda em Câncer, opondo a Lua: cólera quente lançada em matéria úmida — indigestões súbitas, ardores e febres do estômago."},
  {gl:"♌", z:"Coração, costas e espinha", s:5,
   p:"Signo do Ascendente, do Sol e de Mercúrio combusto, e o Ascendente em termo de Saturno: sede da vitalidade — mas também onde o excesso de calor e a tensão se acumulam."},
  {gl:"♒", z:"Pernas, tornozelos e sangue", s:4,
   p:"Aquário, a outra casa de Saturno, na cúspide da VII: o mesmo senhor da enfermidade governa também esta região."},
  {gl:"♎", z:"Rins e lombo", s:3,
   p:"Vênus em Libra, em quadratura à Lua, e senhora dos termos da VI e de Saturno — a fleuma que ela introduz busca as vias dos rins."},
  {gl:"♍", z:"Ventre e intestinos", s:2,
   p:"Virgem na cúspide da II, regida por Mercúrio combusto e frio e seco: ventre seco, e a melancolia que Culpeper faz nascer do baço."}
];

var REGIME = [
  {n:"Ar", t:"Fugir dos ares secos e dos ventos; buscar ambientes temperados e úmidos. A secura é a qualidade que este corpo tem em excesso."},
  {n:"Dieta", t:"Umedecer e refrescar: caldos, azeite, frutas aquosas, leite. Moderar os assados, os condimentos fortes, o vinho e tudo o que aquece e resseca — que é justamente o que o colérico apetece."},
  {n:"Exercício e repouso", t:"Exercício moderado e constante. O colérico ama os “exercícios violentos” e o melancólico foge de todo movimento: nem um nem outro serve — a regra é a medida."},
  {n:"Sono e vigília", t:"O sono é o principal umectante do corpo. O colérico dorme pouco e o melancólico tem sono leve e agitado: aqui a hora fixa vale mais que a quantidade."},
  {n:"Retenção e evacuação", t:"A melancolia é humor que retém e obstrui. Atenção ao ventre e às obstruções — e à retenção da ira, que Culpeper diz ser o vício próprio deste humor."},
  {n:"Perturbações da mente", t:"A ira súbita do colérico acende e apaga depressa; o rancor do melancólico dura. A “cogitação profunda” que é a virtude deste temperamento é também o que o fixa e o adoece."}
];

var REMEDIOS = {
  t:"Cura por antipatia",
  p:"A regra de Culpeper: cura-se a enfermidade pela erva do planeta contrário ao que a causa. Sendo Saturno o senhor da VI e o autor da melancolia — frio e seco — o remédio próprio é <b>Júpiter</b>, quente e úmido: borragem, buglossa, dente-de-leão, sálvia, hissopo, betônica. E há nesta genitura uma confirmação notável: <b>Júpiter está em trígono a Saturno com apenas 2°22′ de orbe</b> — o remédio já vem inscrito na própria carta, e é o mesmo planeta que, na Casa III, lhe dá a confiança na palavra. Para o excesso colérico do estômago (Marte em Câncer), a antipatia é de Vênus e da Lua, frias e úmidas: violeta, rosa, tanchagem, alface."
};

/* ============================================================
   RENDER
   ============================================================ */
function el(id){ return document.getElementById(id); }

function barras(itens){
  var max=0; itens.forEach(function(x){ if(x.val>max) max=x.val; });
  return '<div class="chart">'+itens.map(function(x){
    return '<div class="bar-row">'+
      '<div class="bar-top"><span class="bar-name">'+x.nome+'</span><span class="bar-val">'+x.rot+'</span></div>'+
      '<div class="bar-track"><div class="bar-fill" style="width:'+Math.max(3,Math.round(x.val/max*100))+'%;background:'+x.cor+'"></div></div>'+
      (x.why?'<div class="bar-why">'+x.why+'</div>':"")+
    '</div>';
  }).join("")+'</div>';
}

function renderSaude(){
  var vet=vetorTemperamento(), pri=HUMOR[vet[0].k], sec=HUMOR[vet[1].k];
  var porHumor={};
  TESTEMUNHOS.forEach(function(x){ (porHumor[x.h]=porHumor[x.h]||[]).push(x.t); });

  /* --- 1. temperamento --- */
  var html='<div class="card">'+
    '<div class="card-h"><div class="badge" style="font-size:20px">◐</div><div class="t">'+
      '<h3>Temperamento</h3><div class="sub">a compleição, medida pelos testemunhos</div></div></div>'+
    '<p class="lead">Da mistura do Ascendente e seu senhor, do signo e da fase da Lua, da estação do Sol e dos planetas que os aspectam, resulta a compleição do nativo — e dela, as enfermidades a que tende.</p>'+
    barras(vet.map(function(v){
      var h=HUMOR[v.k];
      return {nome:h.nm+' <span style="color:var(--ink-faint)">· '+h.qual+'</span>', rot:v.pct+"%",
              val:v.w, cor:h.cor, why:(porHumor[v.k]||[]).join(" · ")};
    }))+
    '<div class="chart-legend">'+["col","mel","san","fle"].map(function(k){
      return '<span><i style="background:'+HUMOR[k].cor+'"></i>'+HUMOR[k].nm+' ('+HUMOR[k].hum+')</span>';
    }).join("")+'</div>'+
    '<div class="chave"><b>Compleição</b>'+pri.nm.toUpperCase()+'-'+sec.nm.toUpperCase()+
      ' — um dos oito compostos que Culpeper admite. A qualidade que ambos partilham é a <b>secura</b>: eis a marca deste corpo.</div>'+
    '<p style="margin-top:12px">O colérico, em Culpeper, é agudo de espírito, audaz, apressado e eloquente, de coração firme e sono curto, com a ira que acende e apaga depressa. O melancólico é o seu contrapeso: solitário, cuidadoso, obstinado de opinião, de cogitação profunda — e retém a ira por muito tempo. Deste par nasce um temperamento que age com ímpeto e depois se recolhe a ruminar o que fez; que fala com autoridade e desconfia do que falou.</p>'+
    '<p>A ressalva renascentista vale aqui: a melancolia é o humor menos estimado e, ao mesmo tempo, a chave da contemplação — conhecimento profundo e sensibilidade elevada. O regime de Cícero para ela é “abastecer de óleo as lâmpadas da mente”.</p>'+
    '<div class="nota">Compleições inclinam, não obrigam — doutrina expressa da Escola de Salerno: “as compleições não podem gerar virtude nem vício, mas podem dar inclinação a ambos”.</div>'+
    '<div class="src">Culpeper · Tobyn, Culpeper’s Medicine · Regimen of Health, Salerno</div>'+
  '</div>';

  /* --- 2. significadores --- */
  html+='<div class="card">'+
    '<div class="card-h"><div class="badge" style="font-size:19px">♄</div><div class="t">'+
      '<h3>Significadores da enfermidade</h3><div class="sub">a Casa VI e o que a governa</div></div></div>'+
    SIGNIFICADORES.map(function(s){
      return '<div class="rege" style="margin-bottom:10px"><b>'+s.t+'</b>'+
        '<div class="reg-item"><span class="reg-txt"><span class="reg-signo">'+s.v+'</span>'+s.n+'</span></div></div>';
    }).join("")+
  '</div>';

  /* --- 3. regiões do corpo --- */
  html+='<div class="card">'+
    '<div class="card-h"><div class="badge" style="font-size:19px">☩</div><div class="t">'+
      '<h3>Regiões do corpo assinaladas</h3><div class="sub">melotesia — o corpo repartido pelos signos</div></div></div>'+
    '<p class="lead">Cada signo governa uma parte do corpo. Pesam mais as regiões tocadas pela cúspide da VI, pelo seu senhor e pelos planetas afligidos.</p>'+
    barras(ZONAS.map(function(z){
      return {nome:'<span class="gl">'+z.gl+VS+'</span>'+z.z, rot:z.s+"/9", val:z.s, cor:"#E2593F", why:z.p};
    }))+
    '<div class="src">Escala relativa de testemunhos, não de gravidade</div>'+
  '</div>';

  /* --- 4. remédios --- */
  html+='<div class="card">'+
    '<div class="card-h"><div class="badge" style="font-size:20px">♃</div><div class="t">'+
      '<h3>'+REMEDIOS.t+'</h3><div class="sub">o remédio inscrito na própria carta</div></div></div>'+
    '<p>'+REMEDIOS.p+'</p>'+
  '</div>';

  /* --- 5. regime --- */
  html+='<div class="card">'+
    '<div class="card-h"><div class="badge" style="font-size:18px">✦</div><div class="t">'+
      '<h3>Regime</h3><div class="sub">os seis não-naturais de Galeno</div></div></div>'+
    '<p class="lead">Saúde e caráter regulam-se por seis coisas; o desregramento em qualquer uma é causa de doença. Corrige-se o excesso do temperamento pelas qualidades contrárias — aqui, umedecendo o que é seco.</p>'+
    REGIME.map(function(r,i){
      return '<div class="reg-item" style="margin-top:10px"><span class="reg-casa">'+(i+1)+'</span>'+
        '<span class="reg-txt"><span class="reg-signo">'+r.n+'</span>'+r.t+'</span></div>';
    }).join("")+
    '<div class="nota">Este módulo expõe doutrina astrológica tradicional (séc. XVII) e tem valor histórico e simbólico. Não é diagnóstico nem conselho médico.</div>'+
  '</div>';

  el("sub-saude").innerHTML=html;
}

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
    html+='<div class="chip"><span class="g gl">'+P[k].gl+'</span><span class="n"><b>'+P[k].nm+(p.rx?' ℞':'')+
          '</b>'+fmtLonFull(p.lon)+'</span><span class="h">Casa '+p.casa+'</span></div>';
  });
  el("chips").innerHTML=html;
}

function blocoRegencia(k){
  var r=REGENCIA[k]; if(!r) return "";
  var lista=r.map(function(c){
    return '<div class="reg-item"><span class="reg-casa">Casa '+c.n+'</span>'+
           '<span class="reg-txt"><span class="reg-signo">'+c.signo+' na cúspide</span>'+c.tema+'</span></div>';
  }).join("");
  var nomes=r.map(function(c){return "Casa "+c.n;}).join(" e ");
  return '<div class="rege"><b>Rege '+nomes+' — significador de:</b>'+lista+'</div>';
}

function renderCasas(){
  var html='<div class="card"><div class="card-h"><div class="badge gl">'+P.sol.gl+
    '</div><div class="t"><h3>'+RETRATO.titulo+'</h3><div class="sub">o senhor da genitura é o próprio nativo</div></div></div>'+
    RETRATO.p.map(function(x){return '<p>'+x+'</p>';}).join("")+'</div>';

  CASAS.forEach(function(c){
    var rom={1:"I",2:"II",3:"III",5:"V",7:"VII",11:"XI"}[c.casa], pt=ptByKey(c.k);
    html+='<div class="card">'+
      '<div class="card-h"><div class="badge gl">'+P[c.k].gl+'</div><div class="t">'+
        '<h3>'+P[c.k].nm+' na Casa '+rom+'</h3><div class="sub">'+c.titulo+'</div></div></div>'+
      '<span class="pos"><span class="gl">'+P[c.k].gl+'</span> '+fmtLonFull(pt.lon)+(pt.rx?' ℞':'')+' · Casa '+rom+' · '+pt.dig+'</span>'+
      blocoRegencia(c.k)+
      '<p class="lead">'+CASA_INTRO[c.casa]+'</p>'+
      '<p>'+c.p+'</p>'+
      '<div class="chave"><b>Síntese</b>'+c.chave+'</div>'+
      '<div class="weave"><span class="lab">No mapa —</span> '+c.weave+'</div>'+
      '<div class="src">'+c.src+'</div>'+
    '</div>';
  });
  el("sub-casas").innerHTML=html;
}

function renderEstrelas(){
  var html='<div class="card tight"><p class="lead" style="margin:0">Oito estrelas fixas têm contato estreito (conjunção &lt; 1°) com pontos da genitura. Julga-se cada uma conforme a sua natureza planetária e o ponto que toca.</p></div>';
  STARS.forEach(function(s){
    var alvo = s.con==="asc"?"Ascendente":(s.con==="mc"?"Meio-Céu":P[s.con].nm);
    var alvoGl = s.con==="asc"?"Asc":(s.con==="mc"?"MC":P[s.con].gl);
    html+='<div class="card">'+
      '<div class="card-h"><div class="badge" style="font-size:20px">✦</div><div class="t">'+
        '<h3>'+s.nm+'</h3><div class="sub">natureza de '+s.nat+'</div></div></div>'+
      '<span class="pos"><span class="gl">'+ASP_GL.con+'</span> conjunção a <span class="gl">'+alvoGl+'</span> '+alvo+
        ' · '+fmtLonFull(s.lon)+' · orbe '+s.orb+'</span>'+
      '<p>'+s.txt+'</p></div>';
  });
  el("sub-estrelas").innerHTML=html;
}

function renderAspectos(){
  var html='<div class="card">';
  ASPECTS.forEach(function(a){
    html+='<div class="asp-row">'+
      '<span class="asp-glyphs gl">'+P[a.a].gl+' <span class="op">'+ASP_GL[a.tipo]+'</span> '+P[a.b].gl+'</span>'+
      '<span class="asp-body"><span class="nm">'+P[a.a].nm+' '+ASP_NM[a.tipo].toLowerCase()+' '+P[a.b].nm+
        '</span><span class="ds">'+ASP_DS[a.tipo]+'</span></span>'+
      '<span class="asp-orb">'+a.orb+'<br><span class="ap">'+(a.mov==="A"?"aplicativo":"separativo")+'</span></span>'+
    '</div>';
  });
  html+='</div>';
  html+='<div class="card">'+
    '<div class="card-h"><div class="badge" style="font-size:19px">⚌</div><div class="t"><h3>Antiscia</h3><div class="sub">o espelho solsticial oculto</div></div></div>'+
    '<p class="lead">Os antiscia são pontos-espelho em torno do eixo dos solstícios. Onde o antiscion de um planeta toca outro, há uma conjunção oculta, que une em segredo as duas significações.</p>'+
    '<span class="pos"><span class="gl">'+P.sol.gl+'</span> Sol <span style="color:var(--orange-lite)">contra-antiscion</span> <span class="gl">'+P.jup.gl+'</span> Júpiter · orbe 2°01′</span>'+
    '<p>O contra-antiscion do Sol (Leão 24°14′) cai em Escorpião 5°46′, a apenas 2° de Júpiter na Casa III. É uma união secreta entre a vitalidade e a identidade (Sol, senhor e ocupante da I) e a confiança expansiva do pensamento (Júpiter, na III, senhor da V e da VIII): o senso de si alimenta-se do entusiasmo e da fé, e o discurso confiante nutre-se, por baixo, do próprio brilho solar. Um amparo benéfico que não aparece na roda dos aspectos, mas opera como se ambos estivessem unidos.</p>'+
  '</div>';
  el("sub-aspectos").innerHTML=html;
}

function renderDados(){
  var pos='<tr><th></th><th>Ponto</th><th>Longitude</th><th>Casa</th><th>Rege</th></tr>';
  PT.forEach(function(p){
    var r=REGENCIA[p.k];
    pos+='<tr><td class="gl">'+P[p.k].gl+'</td><td>'+P[p.k].nm+(p.rx?' <span class="rx">℞</span>':'')+
         '</td><td>'+fmtLonFull(p.lon)+'</td><td>'+p.casa+'</td><td>'+
         (r?r.map(function(c){return c.n;}).join(", "):"—")+'</td></tr>';
  });
  el("tblPos").innerHTML=pos;

  var tit={1:"Vida e corpo",2:"Bens e sustento",3:"Irmãos e caminhos curtos",4:"Pai, lar e fundamentos",
           5:"Filhos e prazeres",6:"Enfermidades e serviço",7:"Matrimônio e sócios",8:"Morte e bens alheios",
           9:"Fé, estudos e viagens",10:"Ofício e honras",11:"Amigos e esperanças",12:"Inimigos ocultos"};
  var regs=["Sol","Mercúrio","Vênus","Marte","Júpiter","Saturno","Saturno","Júpiter","Marte","Vênus","Mercúrio","Lua"];
  var cu='<tr><th>Casa</th><th>Cúspide</th><th>Regente</th><th>Assunto</th></tr>';
  for(var i=0;i<12;i++){
    cu+='<tr><td>'+ROM[i]+'</td><td>'+fmtLonFull(CUSP[i])+'</td><td>'+regs[i]+'</td><td>'+tit[i+1]+'</td></tr>';
  }
  el("tblCusp").innerHTML=cu;

  el("tblSect").innerHTML=
    '<tr><th>Condição</th><th>Valor</th></tr>'+
    '<tr><td>Seita</td><td>Noturna (Lua como luminar)</td></tr>'+
    '<tr><td>Regente da noite</td><td>'+P.sat.gl+' Saturno · hora planetária: '+P.ven.gl+' Vênus</td></tr>'+
    '<tr><td>Benéfico da seita</td><td>'+P.ven.gl+' Vênus · maléfico contrário: '+P.mar.gl+' Marte</td></tr>'+
    '<tr><td>Senhor da genitura</td><td>'+P.sol.gl+' Sol (regente do Asc), na Casa I</td></tr>'+
    '<tr><td>Senhor do Meio-Céu</td><td>'+P.ven.gl+' Vênus (Touro no MC), na Casa II em domicílio</td></tr>'+
    '<tr><td>'+P.for.gl+' Parte da Fortuna</td><td>'+fmtLonFull(ptByKey("for").lon)+' · Casa 8</td></tr>';
}

/* ---------- abas ---------- */
var TABS = [{id:"mandala",gl:"◉",nm:"Mandala"},{id:"natal",gl:"☉"+VS,nm:"Natal"},{id:"dados",gl:"▤",nm:"Dados"}];
var SUBTABS = [{id:"casas",nm:"Planetas nas Casas"},{id:"estrelas",nm:"Estrelas Fixas"},
               {id:"aspectos",nm:"Aspectos & Antiscia"},{id:"saude",nm:"Corpo & Saúde"}];
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

function init(){
  buildTabs();
  renderPills();
  el("mandala").innerHTML = buildWheel();
  renderChips();
  renderCasas();
  renderEstrelas();
  renderAspectos();
  renderSaude();
  renderDados();
  el("btnPrint").addEventListener("click", function(){ window.print(); });
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", init); else init();
