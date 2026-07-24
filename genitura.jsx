import { useState, useMemo, useRef } from "react";

/* ============================================================
   GENITURA — estúdio de mapas natais à moda tradicional
   Sete planetas · dignidades · aspectos ptolomaicos · estrelas
   fixas · antiscia. Exportação ABNT em HTML e PDF.
   ============================================================ */

/* ---------- dados tradicionais ---------- */

const SIGNS = [
  { key: "aries", nome: "Áries", glifo: "♈", regente: "marte", elemento: "Fogo" },
  { key: "touro", nome: "Touro", glifo: "♉", regente: "venus", elemento: "Terra" },
  { key: "gemeos", nome: "Gêmeos", glifo: "♊", regente: "mercurio", elemento: "Ar" },
  { key: "cancer", nome: "Câncer", glifo: "♋", regente: "lua", elemento: "Água" },
  { key: "leao", nome: "Leão", glifo: "♌", regente: "sol", elemento: "Fogo" },
  { key: "virgem", nome: "Virgem", glifo: "♍", regente: "mercurio", elemento: "Terra" },
  { key: "libra", nome: "Libra", glifo: "♎", regente: "venus", elemento: "Ar" },
  { key: "escorpiao", nome: "Escorpião", glifo: "♏", regente: "marte", elemento: "Água" },
  { key: "sagitario", nome: "Sagitário", glifo: "♐", regente: "jupiter", elemento: "Fogo" },
  { key: "capricornio", nome: "Capricórnio", glifo: "♑", regente: "saturno", elemento: "Terra" },
  { key: "aquario", nome: "Aquário", glifo: "♒", regente: "saturno", elemento: "Ar" },
  { key: "peixes", nome: "Peixes", glifo: "♓", regente: "jupiter", elemento: "Água" },
];

const EXALTACOES = { sol: "aries", lua: "touro", mercurio: "virgem", venus: "peixes", marte: "capricornio", jupiter: "cancer", saturno: "libra" };
const DOMICILIOS = { sol: ["leao"], lua: ["cancer"], mercurio: ["gemeos", "virgem"], venus: ["touro", "libra"], marte: ["aries", "escorpiao"], jupiter: ["sagitario", "peixes"], saturno: ["capricornio", "aquario"] };

const PONTOS = [
  { key: "sol", nome: "Sol", glifo: "☉", planeta: true },
  { key: "lua", nome: "Lua", glifo: "☽", planeta: true },
  { key: "mercurio", nome: "Mercúrio", glifo: "☿", planeta: true },
  { key: "venus", nome: "Vênus", glifo: "♀", planeta: true },
  { key: "marte", nome: "Marte", glifo: "♂", planeta: true },
  { key: "jupiter", nome: "Júpiter", glifo: "♃", planeta: true },
  { key: "saturno", nome: "Saturno", glifo: "♄", planeta: true },
  { key: "asc", nome: "Ascendente", glifo: "AC", planeta: false },
  { key: "mc", nome: "Meio-Céu", glifo: "MC", planeta: false },
  { key: "nodonorte", nome: "Nodo Norte", glifo: "☊", planeta: false },
  { key: "nodosul", nome: "Nodo Sul", glifo: "☋", planeta: false },
  { key: "fortuna", nome: "Lote da Fortuna", glifo: "⊗", planeta: false },
];

const ALIASES = {
  sol: ["sol", "sun", "☉"],
  lua: ["lua", "moon", "☽", "luna"],
  mercurio: ["mercúrio", "mercurio", "mercury", "☿"],
  venus: ["vênus", "venus", "♀"],
  marte: ["marte", "mars", "♂"],
  jupiter: ["júpiter", "jupiter", "♃"],
  saturno: ["saturno", "saturn", "♄"],
  asc: ["asc", "ascendente", "ascendant", "ac", "asc."],
  mc: ["mc", "meio-céu", "meio-ceu", "midheaven", "medium coeli"],
  nodonorte: ["nodo norte", "nó norte", "no norte", "north node", "cabeça do dragão", "cabeca do dragao", "caput", "☊", "true node", "nodo lunar"],
  nodosul: ["nodo sul", "nó sul", "no sul", "south node", "cauda do dragão", "cauda do dragao", "cauda", "☋"],
  fortuna: ["fortuna", "lote da fortuna", "parte da fortuna", "pars fortunae", "part of fortune", "fortune", "⊗", "pof"],
};

const MODERNOS = ["urano", "uranus", "netuno", "neptune", "plutão", "plutao", "pluto", "quíron", "quiron", "chiron", "ceres", "palas", "pallas", "juno", "vesta", "lilith", "eris", "sedna"];

const SIGN_ALIASES = {
  aries: ["áries", "aries", "ari", "♈"],
  touro: ["touro", "taurus", "tau", "♉"],
  gemeos: ["gêmeos", "gemeos", "gemini", "gem", "♊"],
  cancer: ["câncer", "cancer", "can", "cnc", "♋"],
  leao: ["leão", "leao", "leo", "♌"],
  virgem: ["virgem", "virgo", "vir", "♍"],
  libra: ["libra", "lib", "♎"],
  escorpiao: ["escorpião", "escorpiao", "scorpio", "sco", "scorpius", "♏"],
  sagitario: ["sagitário", "sagitario", "sagittarius", "sag", "♐"],
  capricornio: ["capricórnio", "capricornio", "capricorn", "cap", "♑"],
  aquario: ["aquário", "aquario", "aquarius", "aqu", "♒"],
  peixes: ["peixes", "pisces", "pis", "♓"],
};

const ASPECTOS = [
  { key: "conjuncao", nome: "conjunção", simbolo: "☌", angulo: 0, aliases: ["conjunção", "conjuncao", "conjunction", "con", "cnj", "conj", "☌"] },
  { key: "sextil", nome: "sextil", simbolo: "⚹", angulo: 60, aliases: ["sextil", "sextile", "sex", "sxt", "⚹"] },
  { key: "quadratura", nome: "quadratura", simbolo: "□", angulo: 90, aliases: ["quadratura", "square", "squ", "sqr", "qua", "□"] },
  { key: "trigono", nome: "trígono", simbolo: "△", angulo: 120, aliases: ["trígono", "trigono", "trine", "tri", "trin", "△"] },
  { key: "oposicao", nome: "oposição", simbolo: "☍", angulo: 180, aliases: ["oposição", "oposicao", "opposition", "opp", "opo", "☍"] },
];

const ESTRELAS = ["regulus", "spica", "algol", "aldebaran", "antares", "sirius", "sírius", "fomalhaut", "vega", "rigel", "betelgeuse", "alcyone", "plêiades", "pleiades", "arcturus", "procyon", "canopus", "alphard", "denebola", "altair", "capella", "pollux", "castor", "bellatrix", "vindemiatrix", "zosma", "alphecca", "achernar", "deneb", "markab", "scheat", "hamal", "zuben", "acrux", "alcíone"];

/* ---------- utilidades ---------- */

const signByKey = (k) => SIGNS.find((s) => s.key === k);
const pontoByKey = (k) => PONTOS.find((p) => p.key === k);

function normalizar(txt) {
  return (txt || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function acharToken(texto, dicionario) {
  const t = " " + normalizar(texto) + " ";
  for (const [key, aliases] of Object.entries(dicionario)) {
    for (const a of aliases) {
      const an = normalizar(a);
      if (an.length <= 2 || /[^a-z]/.test(an)) {
        if (texto.includes(a) || new RegExp(`(^|[^a-z])${an}([^a-z]|$)`, "i").test(t)) return key;
      } else if (t.includes(an)) return key;
    }
  }
  return null;
}

function longitudeAbs(pos) {
  if (!pos || !pos.signo) return null;
  const idx = SIGNS.findIndex((s) => s.key === pos.signo);
  if (idx < 0) return null;
  return idx * 30 + (Number(pos.grau) || 0) + (Number(pos.minuto) || 0) / 60;
}

function absParaPos(abs) {
  const a = ((abs % 360) + 360) % 360;
  const idx = Math.floor(a / 30);
  const dentro = a - idx * 30;
  const grau = Math.floor(dentro);
  const minuto = Math.round((dentro - grau) * 60);
  return { signo: SIGNS[idx].key, grau, minuto: minuto === 60 ? 59 : minuto };
}

function fmtPos(pos) {
  if (!pos || !pos.signo) return "—";
  const s = signByKey(pos.signo);
  const g = pos.grau ?? 0;
  const m = pos.minuto ?? 0;
  return `${g}°${String(m).padStart(2, "0")}′ ${s.nome}`;
}

function dignidade(planetaKey, signoKey) {
  if (!DOMICILIOS[planetaKey] || !signoKey) return null;
  const oposto = SIGNS[(SIGNS.findIndex((s) => s.key === signoKey) + 6) % 12].key;
  if (DOMICILIOS[planetaKey].includes(signoKey)) return "domicílio";
  if (EXALTACOES[planetaKey] === signoKey) return "exaltação";
  if (DOMICILIOS[planetaKey].includes(oposto)) return "exílio";
  if (EXALTACOES[planetaKey] === oposto) return "queda";
  return "peregrino";
}

const FRASE_DIGNIDADE = {
  "domicílio": "em seu domicílio, fortalecido, agindo conforme a própria natureza",
  "exaltação": "em exaltação, operando com eminência e distinção",
  "exílio": "em exílio, agindo com dificuldade e de modo desviado de sua natureza",
  "queda": "em queda, debilitado em suas significações",
  "peregrino": "peregrino, dependente da condição de seu dispositor",
};

/* ---------- parser do aspectarian ---------- */

function parseAspectarian(texto) {
  const linhas = texto.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const posicoes = {};
  const aspectos = [];
  const estrelas = [];
  const cuspides = {};
  const ignorados = new Set();

  const reGrau = /(\d{1,2})\s*[°º]\s*(\d{1,2})?\s*['′]?/;
  const reGrauAlt = /(?:^|\s)(\d{1,2})\s+([A-Za-zÀ-ú♈-♓]{3,})\s+(\d{1,2})(?:\s|$)/;

  for (const linha of linhas) {
    const norm = normalizar(linha);

    // planetas modernos → ignorar
    const moderno = MODERNOS.find((m) => new RegExp(`(^|[^a-z])${normalizar(m)}([^a-z]|$)`).test(" " + norm + " "));
    if (moderno) { ignorados.add(moderno); continue; }

    // estrelas fixas
    const estrela = ESTRELAS.find((e) => norm.includes(normalizar(e)));
    if (estrela) {
      const ponto = acharToken(linha, ALIASES);
      estrelas.push({ estrela: estrela.charAt(0).toUpperCase() + estrela.slice(1), ponto: ponto || "", nota: linha });
      continue;
    }

    // cúspides de casa: "casa 3", "cúspide 3", "house 3"
    const mCasa = norm.match(/(?:casa|cuspide|house|cusp)\s*(\d{1,2})/);
    const mCasaRoman = null;

    // aspectos: duas menções de pontos + nome de aspecto
    const aspKey = acharToken(linha, Object.fromEntries(ASPECTOS.map((a) => [a.key, a.aliases])));
    const pontosNaLinha = [];
    {
      // varredura ordenada por posição na linha
      const t = normalizar(linha);
      const hits = [];
      for (const [key, aliases] of Object.entries(ALIASES)) {
        for (const a of aliases) {
          const an = normalizar(a);
          if (an.length < 2 && !/[☉☽☿♀♂♃♄☊☋⊗]/.test(a)) continue;
          const idx = an.match(/^[a-z]/) ? t.search(new RegExp(`(^|[^a-z])${an}([^a-z]|$)`)) : linha.indexOf(a);
          if (idx >= 0) { hits.push({ key, idx }); break; }
        }
      }
      hits.sort((x, y) => x.idx - y.idx);
      for (const h of hits) if (!pontosNaLinha.includes(h.key)) pontosNaLinha.push(h.key);
    }

    if (aspKey && pontosNaLinha.length >= 2 && !mCasa) {
      const orbe = (linha.match(/(\d{1,2})\s*[°º]\s*(\d{1,2})?\s*['′]?\s*$/) || [])[1];
      const mOrbe = linha.match(/orbe?\s*:?\s*(\d{1,2}(?:[.,]\d+)?)/i) || linha.match(/(\d{1,2}(?:[.,]\d+)?)\s*[°º]\s*(?:orb)?\s*$/i);
      aspectos.push({ a: pontosNaLinha[0], tipo: aspKey, b: pontosNaLinha[1], orbe: mOrbe ? mOrbe[1].replace(",", ".") : "" });
      continue;
    }

    // posição: ponto + grau + signo
    const signo = acharToken(linha, SIGN_ALIASES);
    const ponto = pontosNaLinha[0];
    let grau = null, minuto = 0;
    const g1 = linha.match(reGrau);
    if (g1) { grau = parseInt(g1[1]); minuto = g1[2] ? parseInt(g1[2]) : 0; }
    else {
      const g2 = linha.match(reGrauAlt);
      if (g2) { grau = parseInt(g2[1]); minuto = parseInt(g2[3]); }
    }

    if (mCasa && signo && grau !== null && !ponto) {
      cuspides[mCasa[1]] = { signo, grau, minuto };
      continue;
    }

    if (ponto && signo && grau !== null) {
      const casaM = norm.match(/(?:casa|house)\s*(\d{1,2})/);
      const retro = /(^|[^a-z])(r|rx|retro|retrógrado|retrogrado)([^a-z]|$)/.test(norm) && ponto !== "asc" && ponto !== "mc";
      posicoes[ponto] = { signo, grau, minuto, casa: casaM ? casaM[1] : "", retro };
      continue;
    }

    if (mCasa && signo && grau !== null) {
      cuspides[mCasa[1]] = { signo, grau, minuto };
    }
  }

  return { posicoes, aspectos, estrelas, cuspides, ignorados: [...ignorados] };
}

/* ---------- antiscia ---------- */

function calcularAntiscia(posicoes) {
  const tabela = [];
  const contatos = [];
  const entradas = Object.entries(posicoes).filter(([k, v]) => v && v.signo && pontoByKey(k));
  for (const [k, pos] of entradas) {
    const abs = longitudeAbs(pos);
    if (abs === null) continue;
    const anti = absParaPos(180 - abs);
    const contra = absParaPos(360 - abs);
    tabela.push({ ponto: k, antiscion: anti, contra });
  }
  // contatos: antiscion de A sobre corpo de B (orbe 1,5°)
  for (const t of tabela) {
    const absAnti = longitudeAbs(t.antiscion);
    for (const [k2, pos2] of entradas) {
      if (k2 === t.ponto) continue;
      const d = Math.abs((((longitudeAbs(pos2) - absAnti) % 360) + 540) % 360 - 180);
      if (d <= 1.5) contatos.push({ de: t.ponto, sobre: k2, onde: t.antiscion });
    }
  }
  return { tabela, contatos };
}

/* ---------- geração dos cartões (pré-textos) ---------- */

function gerarCartoes(dados) {
  const { nativo, posicoes, aspectos, estrelas } = dados;
  const cards = [];
  let id = 1;
  const add = (titulo, corpo) => cards.push({ id: `c${id++}-${Date.now()}`, titulo, corpo });

  add(
    "Apresentação",
    `Mapa natal de ${nativo.nome || "[nome do nativo]"}, nascido(a) em ${nativo.data || "[data]"} às ${nativo.hora || "[hora]"}, em ${nativo.local || "[local]"}.\n\nO presente estudo segue os princípios da astrologia tradicional: consideram-se os sete planetas visíveis, suas dignidades essenciais e acidentais, os aspectos ptolomaicos, as estrelas fixas de primeira grandeza e os antiscia. Nada se julga por corpos alheios à tradição.`
  );

  add(
    "Temperamento",
    `Da mistura do Ascendente e seu regente, da estação do Sol, da fase da Lua e dos planetas que aspectam o horoscopo, resulta a compleição do nativo.\n\n[Indique aqui a mistura: quente/frio, úmido/seco — e o temperamento predominante: colérico, sanguíneo, fleumático ou melancólico — com suas manifestações no corpo e nos costumes.]`
  );

  const asc = posicoes.asc;
  if (asc && asc.signo) {
    const sAsc = signByKey(asc.signo);
    const regKey = sAsc.regente;
    const reg = pontoByKey(regKey);
    const posReg = posicoes[regKey];
    const dig = posReg ? dignidade(regKey, posReg.signo) : null;
    add(
      "Ascendente e seu regente",
      `O Ascendente ergue-se em ${fmtPos(asc)}, signo de ${sAsc.elemento.toLowerCase()}, tendo por senhor ${reg.nome}${posReg && posReg.signo ? `, que se acha em ${fmtPos(posReg)}${posReg.casa ? `, na casa ${posReg.casa}` : ""}${posReg.retro ? ", retrógrado" : ""}${dig ? `, ${FRASE_DIGNIDADE[dig]}` : ""}` : ""}.\n\n[Julgue a compleição, a índole e a direção da vida conforme a condição do senhor do Ascendente: sua dignidade, casa, aspectos e velocidade.]`
    );
  }

  for (const p of PONTOS.filter((p) => p.planeta)) {
    const pos = posicoes[p.key];
    if (!pos || !pos.signo) continue;
    const dig = dignidade(p.key, pos.signo);
    const disp = pontoByKey(signByKey(pos.signo).regente);
    add(
      `${p.glifo} ${p.nome}`,
      `${p.nome} encontra-se em ${fmtPos(pos)}${pos.casa ? `, na casa ${pos.casa}` : ""}${pos.retro ? ", retrógrado" : ""} — ${FRASE_DIGNIDADE[dig] || ""}${dig === "peregrino" ? ` (${disp.nome})` : ""}.\n\n[Julgue suas significações naturais e acidentais: o que promete pela casa que ocupa e pelas casas que rege, e como o cumpre segundo sua força e seus aspectos.]`
    );
  }

  if (aspectos.length) {
    const linhas = aspectos
      .map((a) => {
        const A = pontoByKey(a.a), B = pontoByKey(a.b), asp = ASPECTOS.find((x) => x.key === a.tipo);
        if (!A || !B || !asp) return null;
        return `${A.glifo} ${A.nome} ${asp.simbolo} ${asp.nome} ${B.glifo} ${B.nome}${a.orbe ? ` (orbe ${a.orbe}°)` : ""}`;
      })
      .filter(Boolean)
      .join("\n");
    add(
      "Aspectos ptolomaicos",
      `Configuram-se no céu da genitura os seguintes aspectos:\n\n${linhas}\n\n[Comente os mais estreitos e os que envolvem os luminares e o senhor do Ascendente, distinguindo aplicação de separação, recepções e traduções de luz.]`
    );
  }

  const anti = calcularAntiscia(posicoes);
  if (anti.tabela.length) {
    const tab = anti.tabela
      .map((t) => {
        const P = pontoByKey(t.ponto);
        return `${P.glifo} ${P.nome}: antiscion em ${fmtPos(t.antiscion)} · contra-antiscion em ${fmtPos(t.contra)}`;
      })
      .join("\n");
    const cont = anti.contatos
      .map((c) => `— O antiscion de ${pontoByKey(c.de).nome} cai sobre ${pontoByKey(c.sobre).nome} (${fmtPos(c.onde)}), unindo em segredo suas significações.`)
      .join("\n");
    add(
      "Antiscia",
      `Espelhos solsticiais dos pontos da genitura:\n\n${tab}${cont ? `\n\nContatos por antiscion:\n${cont}` : ""}\n\n[Os antiscia operam como conjunções ocultas; pese-os sobretudo quando tocam luminares e ângulos.]`
    );
  }

  if (estrelas.length) {
    add(
      "Estrelas fixas",
      `Estrelas fixas em contato com a genitura:\n\n${estrelas.map((e) => `— ${e.estrela}${e.ponto ? ` junto a ${pontoByKey(e.ponto)?.nome || e.ponto}` : ""}${e.nota && e.nota !== e.estrela ? ` · ${e.nota}` : ""}`).join("\n")}\n\n[Julgue conforme a natureza planetária de cada estrela e a eminência que confere quando angular ou unida aos luminares.]`
    );
  }

  add(
    "Síntese e juízo final",
    `Pesadas as dignidades, os aspectos e os testemunhos das estrelas, conclui-se:\n\n[Redija aqui o juízo geral da genitura — o senhor da genitura, a fortuna do nativo, os capítulos de vida mais assinalados — e os conselhos que a arte permite oferecer.]`
  );

  return cards;
}

const MODELOS_EXTRAS = [
  { titulo: "Riqueza e bens (casa 2)", corpo: `Da casa 2, seu senhor, os planetas nela postos e o Lote da Fortuna, julga-se a substância do nativo.\n\n[Examine a condição do senhor da 2, sua dignidade e aspectos com os benéficos e maléficos; considere a Fortuna e seu dispositor.]` },
  { titulo: "Irmãos e vizinhança (casa 3)", corpo: `Da casa 3 e de seu senhor julgam-se os irmãos, as jornadas curtas e os estudos menores.\n\n[Complete o juízo.]` },
  { titulo: "Pais e patrimônio (casa 4)", corpo: `Da casa 4, do Sol de dia e de Saturno de noite, julga-se o pai; da casa e de seus testemunhos, as heranças e o fim das coisas.\n\n[Complete o juízo.]` },
  { titulo: "Filhos (casa 5)", corpo: `Da casa 5, de seu senhor e de Júpiter, julgam-se os filhos e os prazeres.\n\n[Signos fecundos ou estéreis no cúspide? Benéficos ou maléficos a testemunhar?]` },
  { titulo: "Saúde e enfermidades (casa 6)", corpo: `Da casa 6, de seu senhor e dos aflitores dos luminares julgam-se as enfermidades.\n\n[Aponte as partes do corpo regidas pelos signos afligidos e a natureza — quente, fria, úmida, seca — dos males indicados.]` },
  { titulo: "Casamento e uniões (casa 7)", corpo: `Da casa 7, de seu senhor, de Vênus na genitura do homem e do Sol na da mulher, julgam-se as núpcias.\n\n[Complete o juízo sobre o cônjuge, o tempo e a qualidade das uniões.]` },
  { titulo: "Profissão e honras (casa 10)", corpo: `Do Meio-Céu, de seu senhor e do planeta da profissão — Mercúrio, Vênus ou Marte, conforme a doutrina — julgam-se o ofício e as honras.\n\n[Determine o significador do ofício e a eminência prometida.]` },
  { titulo: "Amigos e esperanças (casa 11)", corpo: `Da casa 11 e de seu senhor julgam-se os amigos, os patronos e as esperanças.\n\n[Complete o juízo.]` },
  { titulo: "Inimigos ocultos (casa 12)", corpo: `Da casa 12 e de seu senhor julgam-se os inimigos ocultos, as aflições e os cativeiros.\n\n[Complete o juízo.]` },
  { titulo: "Cartão em branco", corpo: `` },
];

/* ---------- exportação ABNT ---------- */

function escaparHTML(s) {
  return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function construirHTMLExport(dados, cards) {
  const { nativo, posicoes } = dados;
  const linhasTabela = PONTOS.filter((p) => posicoes[p.key] && posicoes[p.key].signo)
    .map((p) => {
      const pos = posicoes[p.key];
      const dig = p.planeta ? dignidade(p.key, pos.signo) : "—";
      return `<tr><td>${p.glifo} ${p.nome}</td><td>${fmtPos(pos)}${pos.retro ? " ℞" : ""}</td><td>${pos.casa || "—"}</td><td>${dig || "—"}</td></tr>`;
    })
    .join("");

  const secoes = cards
    .map((c, i) => `<section><h2>${i + 1}&ensp;${escaparHTML(c.titulo).toUpperCase()}</h2>${c.corpo.split(/\n\n+/).map((par) => `<p>${escaparHTML(par).replace(/\n/g, "<br/>")}</p>`).join("")}</section>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"/>
<title>Mapa natal — ${escaparHTML(nativo.nome || "Genitura")}</title>
<style>
  :root { --tinta:#141210; --linha:#1a1a1a; --sol:#e0641f; --fumo:#8a8580; }
  * { box-sizing: border-box; }
  body { font-family: "Times New Roman", Times, serif; font-size: 12pt; color: var(--tinta);
         background: #fbfaf7; margin: 0; }
  .folha { max-width: 21cm; margin: 0 auto; background: #fff; padding: 3cm 2cm 2cm 3cm; min-height: 29.7cm;
           box-shadow: 0 12px 60px rgba(20,18,16,.10); }
  header.capa { text-align: center; padding-bottom: 1.2cm; margin-bottom: 1cm;
                border-bottom: 2.5pt solid var(--linha); position: relative; }
  header.capa::after { content:""; position:absolute; left:20%; right:20%; bottom:-6pt; height:2pt;
                       background: linear-gradient(90deg, transparent, var(--sol), transparent); }
  .glifos { letter-spacing: .9em; font-size: 14pt; color: var(--sol); margin-bottom: .6cm; }
  h1 { font-size: 17pt; letter-spacing: .18em; font-weight: normal; margin: 0 0 .3cm; text-transform: uppercase; }
  .sub { font-size: 11pt; color: var(--fumo); font-style: italic; }
  .dados { margin: .5cm 0 0; font-size: 11pt; }
  h2 { font-size: 12pt; font-weight: bold; letter-spacing: .06em; margin: 1cm 0 .35cm;
       padding-bottom: 3pt; border-bottom: .75pt solid var(--linha); }
  h2::first-letter { color: var(--sol); }
  p { text-align: justify; line-height: 1.5; text-indent: 1.25cm; margin: 0 0 .3cm; }
  table { width: 100%; border-collapse: collapse; font-size: 11pt; margin: .4cm 0 .6cm; }
  th { text-align: left; border-top: 1.5pt solid var(--linha); border-bottom: .75pt solid var(--linha);
       padding: 4pt 6pt; font-weight: bold; letter-spacing: .04em; }
  td { padding: 4pt 6pt; border-bottom: .5pt solid #dedad4; }
  tr:last-child td { border-bottom: 1.5pt solid var(--linha); }
  footer { margin-top: 1.2cm; padding-top: .3cm; border-top: .75pt solid var(--linha);
           font-size: 9.5pt; color: var(--fumo); display:flex; justify-content: space-between; }
  footer b { color: var(--sol); font-weight: normal; }
  @page { size: A4; margin: 3cm 2cm 2cm 3cm; }
  @media print { body { background:#fff; } .folha { box-shadow:none; padding: 0; max-width:none; min-height:0; } }
</style>
</head>
<body>
<div class="folha">
  <header class="capa">
    <div class="glifos">☉ ☽ ☿ ♀ ♂ ♃ ♄</div>
    <h1>Mapa Natal</h1>
    <div class="sub">Estudo segundo a astrologia tradicional</div>
    <div class="dados">${escaparHTML(nativo.nome || "[Nome do nativo]")}<br/>
    ${escaparHTML(nativo.data || "[data]")} · ${escaparHTML(nativo.hora || "[hora]")} · ${escaparHTML(nativo.local || "[local]")}</div>
  </header>
  ${linhasTabela ? `<table><thead><tr><th>Ponto</th><th>Posição</th><th>Casa</th><th>Dignidade</th></tr></thead><tbody>${linhasTabela}</tbody></table>` : ""}
  ${secoes}
  <footer><span>${escaparHTML(nativo.astrologo || "")}</span><span><b>☉</b> Genitura</span></footer>
</div>
</body>
</html>`;
}

/* ---------- fita zodiacal (assinatura visual) ---------- */

function FitaZodiacal({ posicoes }) {
  const W = 720, H = 92;
  const pontos = PONTOS.filter((p) => posicoes[p.key] && posicoes[p.key].signo).map((p) => ({
    ...p,
    abs: longitudeAbs(posicoes[p.key]),
  }));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="fita" role="img" aria-label="Fita zodiacal com os pontos da genitura">
      <defs>
        <linearGradient id="sol" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f2a65a" /><stop offset=".55" stopColor="#e0641f" /><stop offset="1" stopColor="#b53a17" />
        </linearGradient>
      </defs>
      <line x1="10" y1="58" x2={W - 10} y2="58" stroke="#141210" strokeWidth="1" />
      {SIGNS.map((s, i) => {
        const x = 10 + (i * 30 / 360) * (W - 20);
        return (
          <g key={s.key}>
            <line x1={x} y1="52" x2={x} y2="64" stroke="#141210" strokeWidth="1" />
            <text x={x + ((W - 20) / 24)} y="82" textAnchor="middle" fontSize="12" fill="#8a8580">{s.glifo}</text>
          </g>
        );
      })}
      <line x1={W - 10} y1="52" x2={W - 10} y2="64" stroke="#141210" strokeWidth="1" />
      {pontos.map((p) => {
        const x = 10 + (p.abs / 360) * (W - 20);
        return (
          <g key={p.key}>
            <line x1={x} y1="34" x2={x} y2="58" stroke="url(#sol)" strokeWidth="1.5" />
            <circle cx={x} cy="58" r="2.4" fill="url(#sol)" />
            <text x={x} y="26" textAnchor="middle" fontSize="14" fill="#141210">{p.glifo}</text>
          </g>
        );
      })}
      {pontos.length === 0 && (
        <text x={W / 2} y="30" textAnchor="middle" fontSize="12" fill="#8a8580" fontStyle="italic">
          Os pontos da genitura aparecerão aqui quando o mapa for preenchido ou importado
        </text>
      )}
    </svg>
  );
}

/* ---------- componente principal ---------- */

const EXEMPLO = `Sol 15°32' Leão casa 10
Lua 3°10' Câncer casa 9
Mercúrio 2°44' Virgem casa 11 R
Vênus 28°05' Câncer casa 9
Marte 11°50' Escorpião casa 1
Júpiter 9°21' Peixes casa 5
Saturno 22°40' Libra casa 12
ASC 4°15' Escorpião
MC 12°30' Leão
Nodo Norte 18° Gêmeos casa 8
Lote da Fortuna 21°53' Peixes casa 5
Sol trígono Júpiter orbe 6.1
Lua oposição Saturno orbe 2
Marte quadratura Sol orbe 3.7
Mercúrio sextil Marte orbe 1.2
Regulus conjunta ao MC
Spica junto a Saturno
Plutão 26° Libra casa 12`;

export default function Genitura() {
  const [aba, setAba] = useState("mapa");
  const [nativo, setNativo] = useState({ nome: "", data: "", hora: "", local: "", astrologo: "" });
  const [posicoes, setPosicoes] = useState({});
  const [aspectos, setAspectos] = useState([]);
  const [estrelas, setEstrelas] = useState([]);
  const [ignorados, setIgnorados] = useState([]);
  const [textoImport, setTextoImport] = useState("");
  const [cards, setCards] = useState([]);
  const [modeloSel, setModeloSel] = useState("0");
  const [novoAsp, setNovoAsp] = useState({ a: "sol", tipo: "trigono", b: "lua", orbe: "" });
  const [novaEstrela, setNovaEstrela] = useState({ estrela: "", ponto: "sol" });
  const [aviso, setAviso] = useState("");
  const printRef = useRef(null);

  const dados = { nativo, posicoes, aspectos, estrelas };
  const temMapa = Object.values(posicoes).some((p) => p && p.signo);

  function importar() {
    const r = parseAspectarian(textoImport);
    setPosicoes((prev) => ({ ...prev, ...r.posicoes }));
    setAspectos((prev) => [...prev, ...r.aspectos]);
    setEstrelas((prev) => [...prev, ...r.estrelas]);
    setIgnorados(r.ignorados);
    const nPos = Object.keys(r.posicoes).length;
    setAviso(`Importados: ${nPos} pontos, ${r.aspectos.length} aspectos, ${r.estrelas.length} estrelas fixas.` + (r.ignorados.length ? ` Ignorados por serem alheios à tradição: ${r.ignorados.join(", ")}.` : ""));
  }

  function editarPos(key, campo, valor) {
    setPosicoes((prev) => ({ ...prev, [key]: { ...(prev[key] || {}), [campo]: campo === "retro" ? valor : valor } }));
  }

  function gerarPretextos() {
    setCards(gerarCartoes(dados));
    setAba("cartoes");
  }

  function addModelo() {
    const m = MODELOS_EXTRAS[Number(modeloSel)];
    setCards((c) => [...c, { id: `x${Date.now()}`, titulo: m.titulo, corpo: m.corpo }]);
  }

  function mover(i, dir) {
    setCards((c) => {
      const n = [...c];
      const j = i + dir;
      if (j < 0 || j >= n.length) return c;
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
  }

  function baixarHTML() {
    const html = construirHTMLExport(dados, cards);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mapa-natal-${(nativo.nome || "genitura").toLowerCase().replace(/\s+/g, "-")}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function imprimirPDF() {
    const html = construirHTMLExport(dados, cards);
    let iframe = printRef.current;
    if (iframe) iframe.remove();
    iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);
    printRef.current = iframe;
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 350);
  }

  const previewHTML = useMemo(() => (aba === "exportar" ? construirHTMLExport(dados, cards) : ""), [aba, dados, cards]);

  return (
    <div className="app">
      <style>{CSS}</style>

      <header className="topo">
        <div className="marca">
          <span className="marca-glifo">☉</span>
          <div>
            <h1>Genitura</h1>
            <p>mapas natais à moda tradicional</p>
          </div>
        </div>
        <nav className="abas" role="tablist">
          {[
            ["mapa", "I · O mapa"],
            ["cartoes", "II · Cartões"],
            ["exportar", "III · Exportar"],
          ].map(([k, label]) => (
            <button key={k} role="tab" aria-selected={aba === k} className={aba === k ? "aba ativa" : "aba"} onClick={() => setAba(k)}>
              {label}
            </button>
          ))}
        </nav>
      </header>

      <FitaZodiacal posicoes={posicoes} />

      {/* ============ ABA I — O MAPA ============ */}
      {aba === "mapa" && (
        <main className="painel">
          <section className="bloco">
            <h2>Nativo</h2>
            <div className="grade-nativo">
              <label>Nome<input value={nativo.nome} onChange={(e) => setNativo({ ...nativo, nome: e.target.value })} placeholder="Nome completo" /></label>
              <label>Data<input value={nativo.data} onChange={(e) => setNativo({ ...nativo, data: e.target.value })} placeholder="dd/mm/aaaa" /></label>
              <label>Hora<input value={nativo.hora} onChange={(e) => setNativo({ ...nativo, hora: e.target.value })} placeholder="hh:mm" /></label>
              <label>Local<input value={nativo.local} onChange={(e) => setNativo({ ...nativo, local: e.target.value })} placeholder="Cidade, país" /></label>
              <label>Astrólogo<input value={nativo.astrologo} onChange={(e) => setNativo({ ...nativo, astrologo: e.target.value })} placeholder="Seu nome (rodapé do documento)" /></label>
            </div>
          </section>

          <section className="bloco">
            <h2>Importar do aspectarian</h2>
            <p className="nota">Cole o texto do seu programa ou das suas notas — uma informação por linha. O importador reconhece posições (planeta, grau, signo, casa, ℞), aspectos, cúspides e estrelas fixas, e descarta o que for alheio à tradição (Plutão, asteroides…).</p>
            <textarea value={textoImport} onChange={(e) => setTextoImport(e.target.value)} rows={9} placeholder={"Sol 15°32' Leão casa 10\nLua oposição Saturno orbe 2\nRegulus conjunta ao MC\n…"} />
            <div className="linha-botoes">
              <button className="btn sol" onClick={importar} disabled={!textoImport.trim()}>Importar mapa</button>
              <button className="btn" onClick={() => setTextoImport(EXEMPLO)}>Usar exemplo</button>
            </div>
            {aviso && <p className="aviso">{aviso}</p>}
          </section>

          <section className="bloco">
            <h2>Pontos da genitura</h2>
            <div className="tabela-rolagem">
              <table className="tabela">
                <thead>
                  <tr><th>Ponto</th><th>Grau</th><th>′</th><th>Signo</th><th>Casa</th><th>℞</th></tr>
                </thead>
                <tbody>
                  {PONTOS.map((p) => {
                    const pos = posicoes[p.key] || {};
                    const dig = p.planeta && pos.signo ? dignidade(p.key, pos.signo) : null;
                    return (
                      <tr key={p.key}>
                        <td><span className="glifo">{p.glifo}</span> {p.nome}{dig && <em className="dig"> · {dig}</em>}</td>
                        <td><input className="mini" inputMode="numeric" value={pos.grau ?? ""} onChange={(e) => editarPos(p.key, "grau", e.target.value.replace(/\D/g, "").slice(0, 2))} /></td>
                        <td><input className="mini" inputMode="numeric" value={pos.minuto ?? ""} onChange={(e) => editarPos(p.key, "minuto", e.target.value.replace(/\D/g, "").slice(0, 2))} /></td>
                        <td>
                          <select value={pos.signo || ""} onChange={(e) => editarPos(p.key, "signo", e.target.value)}>
                            <option value="">—</option>
                            {SIGNS.map((s) => <option key={s.key} value={s.key}>{s.glifo} {s.nome}</option>)}
                          </select>
                        </td>
                        <td><input className="mini" inputMode="numeric" value={pos.casa ?? ""} onChange={(e) => editarPos(p.key, "casa", e.target.value.replace(/\D/g, "").slice(0, 2))} /></td>
                        <td>{p.planeta && p.key !== "sol" && p.key !== "lua" ? <input type="checkbox" checked={!!pos.retro} onChange={(e) => editarPos(p.key, "retro", e.target.checked)} /> : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bloco duas-colunas">
            <div>
              <h2>Aspectos</h2>
              <ul className="lista">
                {aspectos.map((a, i) => {
                  const asp = ASPECTOS.find((x) => x.key === a.tipo);
                  return (
                    <li key={i}>
                      <span>{pontoByKey(a.a)?.glifo} {pontoByKey(a.a)?.nome} <b className="sol-txt">{asp?.simbolo}</b> {pontoByKey(a.b)?.glifo} {pontoByKey(a.b)?.nome}{a.orbe ? ` · ${a.orbe}°` : ""}</span>
                      <button className="x" aria-label="Remover aspecto" onClick={() => setAspectos(aspectos.filter((_, j) => j !== i))}>×</button>
                    </li>
                  );
                })}
                {aspectos.length === 0 && <li className="vazio">Nenhum aspecto registrado.</li>}
              </ul>
              <div className="form-inline">
                <select value={novoAsp.a} onChange={(e) => setNovoAsp({ ...novoAsp, a: e.target.value })}>{PONTOS.map((p) => <option key={p.key} value={p.key}>{p.nome}</option>)}</select>
                <select value={novoAsp.tipo} onChange={(e) => setNovoAsp({ ...novoAsp, tipo: e.target.value })}>{ASPECTOS.map((a) => <option key={a.key} value={a.key}>{a.nome}</option>)}</select>
                <select value={novoAsp.b} onChange={(e) => setNovoAsp({ ...novoAsp, b: e.target.value })}>{PONTOS.map((p) => <option key={p.key} value={p.key}>{p.nome}</option>)}</select>
                <input className="mini" placeholder="orbe" value={novoAsp.orbe} onChange={(e) => setNovoAsp({ ...novoAsp, orbe: e.target.value })} />
                <button className="btn" onClick={() => setAspectos([...aspectos, { ...novoAsp }])}>Adicionar</button>
              </div>
            </div>
            <div>
              <h2>Estrelas fixas</h2>
              <ul className="lista">
                {estrelas.map((e, i) => (
                  <li key={i}>
                    <span><b className="sol-txt">✶</b> {e.estrela}{e.ponto ? ` junto a ${pontoByKey(e.ponto)?.nome || e.ponto}` : ""}</span>
                    <button className="x" aria-label="Remover estrela" onClick={() => setEstrelas(estrelas.filter((_, j) => j !== i))}>×</button>
                  </li>
                ))}
                {estrelas.length === 0 && <li className="vazio">Nenhuma estrela registrada.</li>}
              </ul>
              <div className="form-inline">
                <input placeholder="Estrela (ex.: Regulus)" value={novaEstrela.estrela} onChange={(e) => setNovaEstrela({ ...novaEstrela, estrela: e.target.value })} />
                <select value={novaEstrela.ponto} onChange={(e) => setNovaEstrela({ ...novaEstrela, ponto: e.target.value })}>{PONTOS.map((p) => <option key={p.key} value={p.key}>{p.nome}</option>)}</select>
                <button className="btn" onClick={() => { if (novaEstrela.estrela.trim()) { setEstrelas([...estrelas, { ...novaEstrela, nota: "" }]); setNovaEstrela({ estrela: "", ponto: "sol" }); } }}>Adicionar</button>
              </div>
            </div>
          </section>

          <div className="rodape-acao">
            <button className="btn sol grande" onClick={gerarPretextos} disabled={!temMapa}>
              Gerar pré-textos dos cartões →
            </button>
            {!temMapa && <span className="nota">Preencha ou importe ao menos um ponto do mapa.</span>}
          </div>
        </main>
      )}

      {/* ============ ABA II — CARTÕES ============ */}
      {aba === "cartoes" && (
        <main className="painel">
          <div className="barra-cartoes">
            <div>
              <h2 className="titulo-secao">Cartões de interpretação</h2>
              <p className="nota">Pré-textos gerados a partir do mapa — edite livremente cada um. A ordem dos cartões é a ordem das seções no documento final.</p>
            </div>
            <div className="linha-botoes">
              <select value={modeloSel} onChange={(e) => setModeloSel(e.target.value)}>
                {MODELOS_EXTRAS.map((m, i) => <option key={i} value={i}>{m.titulo}</option>)}
              </select>
              <button className="btn" onClick={addModelo}>+ Cartão modelo</button>
              <button className="btn" onClick={() => setCards(gerarCartoes(dados))}>↻ Regerar do mapa</button>
            </div>
          </div>

          {cards.length === 0 && (
            <div className="vazio-grande">
              Nenhum cartão ainda. <button className="link" onClick={() => setCards(gerarCartoes(dados))}>Gerar pré-textos a partir do mapa</button> ou adicione um cartão modelo acima.
            </div>
          )}

          <div className="cartoes">
            {cards.map((c, i) => (
              <article className="cartao" key={c.id}>
                <div className="cartao-topo">
                  <span className="num">{String(i + 1).padStart(2, "0")}</span>
                  <input className="cartao-titulo" value={c.titulo} onChange={(e) => setCards(cards.map((x) => x.id === c.id ? { ...x, titulo: e.target.value } : x))} />
                  <div className="cartao-acoes">
                    <button onClick={() => mover(i, -1)} aria-label="Subir" title="Subir">↑</button>
                    <button onClick={() => mover(i, 1)} aria-label="Descer" title="Descer">↓</button>
                    <button className="x" onClick={() => setCards(cards.filter((x) => x.id !== c.id))} aria-label="Remover cartão" title="Remover">×</button>
                  </div>
                </div>
                <textarea value={c.corpo} rows={Math.min(14, Math.max(4, c.corpo.split("\n").length + 1))}
                  onChange={(e) => setCards(cards.map((x) => x.id === c.id ? { ...x, corpo: e.target.value } : x))} />
              </article>
            ))}
          </div>

          {cards.length > 0 && (
            <div className="rodape-acao">
              <button className="btn sol grande" onClick={() => setAba("exportar")}>Ver documento e exportar →</button>
            </div>
          )}
        </main>
      )}

      {/* ============ ABA III — EXPORTAR ============ */}
      {aba === "exportar" && (
        <main className="painel">
          <div className="barra-cartoes">
            <div>
              <h2 className="titulo-secao">Documento final</h2>
              <p className="nota">Formato ABNT: A4, Times 12 pt, margens 3 cm (sup./esq.) e 2 cm (inf./dir.), parágrafos justificados com entrelinha 1,5.</p>
            </div>
            <div className="linha-botoes">
              <button className="btn sol" onClick={imprimirPDF} disabled={cards.length === 0}>Exportar PDF</button>
              <button className="btn" onClick={baixarHTML} disabled={cards.length === 0}>Baixar HTML</button>
            </div>
          </div>
          {cards.length === 0 ? (
            <div className="vazio-grande">Gere os cartões na aba II antes de exportar.</div>
          ) : (
            <iframe className="preview" title="Pré-visualização do documento" srcDoc={previewHTML} />
          )}
        </main>
      )}

      <footer className="rodape">
        <span>☽ Nada além dos sete: Sol, Lua, Mercúrio, Vênus, Marte, Júpiter e Saturno.</span>
      </footer>
    </div>
  );
}

/* ---------- estilos ---------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600&display=swap');

:root {
  --papel: #fbfaf7;
  --tinta: #141210;
  --linha: #1a1a1a;
  --fumo: #8a8580;
  --neblina: #efece6;
  --sol1: #f2a65a;
  --sol2: #e0641f;
  --sol3: #b53a17;
  --serif: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  --ui: 'Inter', system-ui, sans-serif;
}
* { box-sizing: border-box; }
html, body, #root { margin: 0; }
.app {
  min-height: 100vh; color: var(--tinta); font-family: var(--ui); font-size: 14px;
  background:
    radial-gradient(1100px 480px at 85% -8%, rgba(242,166,90,.16), transparent 62%),
    radial-gradient(900px 520px at -10% 8%, rgba(138,133,128,.14), transparent 60%),
    radial-gradient(700px 420px at 50% 110%, rgba(224,100,31,.07), transparent 65%),
    var(--papel);
}
.topo {
  display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap;
  padding: 26px clamp(16px, 4vw, 44px) 14px; border-bottom: 1.5px solid var(--linha);
}
.marca { display: flex; align-items: center; gap: 14px; }
.marca-glifo {
  width: 46px; height: 46px; display: grid; place-items: center; font-size: 22px; color: #fff;
  background: linear-gradient(140deg, var(--sol1), var(--sol2) 55%, var(--sol3));
  border-radius: 50%; box-shadow: 0 6px 22px rgba(224,100,31,.35);
}
.marca h1 { font-family: var(--serif); font-weight: 500; font-size: 30px; letter-spacing: .14em; margin: 0; text-transform: uppercase; }
.marca p { margin: 0; color: var(--fumo); font-family: var(--serif); font-style: italic; font-size: 15px; }
.abas { display: flex; gap: 4px; }
.aba {
  font-family: var(--ui); font-size: 12.5px; letter-spacing: .08em; text-transform: uppercase;
  background: transparent; border: none; border-bottom: 2px solid transparent;
  padding: 10px 14px 12px; cursor: pointer; color: var(--fumo);
}
.aba:hover { color: var(--tinta); }
.aba.ativa { color: var(--tinta); border-bottom-color: var(--sol2); }
.aba:focus-visible, .btn:focus-visible, .x:focus-visible, .link:focus-visible { outline: 2px solid var(--sol2); outline-offset: 2px; }

.fita { display: block; width: min(1040px, calc(100% - 32px)); margin: 10px auto 0; }

.painel { width: min(1040px, calc(100% - 32px)); margin: 8px auto 40px; }
.bloco { border: 1px solid var(--linha); background: rgba(255,255,255,.72); backdrop-filter: blur(3px); padding: 20px 22px; margin-top: 18px; }
.bloco h2, .titulo-secao {
  font-family: var(--serif); font-weight: 600; font-size: 19px; letter-spacing: .05em; margin: 0 0 12px;
  padding-bottom: 6px; border-bottom: 1px solid var(--linha); display: block;
}
.bloco h2::first-letter, .titulo-secao::first-letter { color: var(--sol2); }

.grade-nativo { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
label { display: flex; flex-direction: column; gap: 5px; font-size: 11.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--fumo); }
input, select, textarea {
  font-family: var(--ui); font-size: 14px; color: var(--tinta);
  border: 1px solid #c9c4bc; background: #fff; padding: 8px 10px; border-radius: 2px;
}
input:focus, select:focus, textarea:focus { outline: none; border-color: var(--sol2); box-shadow: 0 0 0 2px rgba(224,100,31,.15); }
textarea { width: 100%; resize: vertical; line-height: 1.55; }
.nota { color: var(--fumo); font-size: 13px; line-height: 1.5; margin: 0 0 10px; }
.aviso { margin: 10px 0 0; font-size: 13px; color: var(--sol3); border-left: 3px solid var(--sol2); padding: 6px 10px; background: rgba(242,166,90,.10); }

.linha-botoes { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px; align-items: center; }
.btn {
  font-family: var(--ui); font-size: 12.5px; letter-spacing: .08em; text-transform: uppercase; cursor: pointer;
  border: 1px solid var(--linha); background: #fff; color: var(--tinta); padding: 9px 16px; border-radius: 2px;
  transition: transform .12s ease, box-shadow .12s ease;
}
.btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(20,18,16,.12); }
.btn:disabled { opacity: .45; cursor: not-allowed; }
.btn.sol { background: linear-gradient(140deg, var(--sol1), var(--sol2) 60%, var(--sol3)); color: #fff; border-color: transparent; }
.btn.grande { padding: 12px 22px; font-size: 13.5px; }
.link { background: none; border: none; color: var(--sol2); cursor: pointer; font-size: inherit; text-decoration: underline; padding: 0; }

.tabela-rolagem { overflow-x: auto; }
.tabela { width: 100%; border-collapse: collapse; min-width: 560px; }
.tabela th { text-align: left; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--fumo); font-weight: 600; padding: 6px 8px; border-bottom: 1.5px solid var(--linha); }
.tabela td { padding: 6px 8px; border-bottom: 1px solid #e4e0d9; }
.glifo { display: inline-block; width: 22px; color: var(--sol2); font-size: 15px; }
.dig { color: var(--fumo); font-size: 12px; font-style: italic; }
.mini { width: 58px; }
.tabela select { max-width: 150px; }

.duas-colunas { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
@media (max-width: 760px) { .duas-colunas { grid-template-columns: 1fr; } .topo { align-items: flex-start; } }
.lista { list-style: none; margin: 0 0 8px; padding: 0; }
.lista li { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 7px 2px; border-bottom: 1px dotted #d6d1c9; font-size: 14px; }
.lista .vazio { color: var(--fumo); font-style: italic; border: none; }
.sol-txt { color: var(--sol2); font-weight: 600; }
.x { background: none; border: none; color: var(--fumo); font-size: 17px; cursor: pointer; line-height: 1; padding: 2px 6px; }
.x:hover { color: var(--sol3); }
.form-inline { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.form-inline select, .form-inline input { flex: 0 1 auto; }

.rodape-acao { margin-top: 22px; display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }

.barra-cartoes { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; margin-top: 18px; }
.cartoes { display: grid; grid-template-columns: 1fr; gap: 16px; margin-top: 16px; }
.cartao { border: 1px solid var(--linha); background: rgba(255,255,255,.8); backdrop-filter: blur(3px); padding: 14px 16px 16px; position: relative; }
.cartao::before { content: ""; position: absolute; inset: 0 auto 0 0; width: 3px; background: linear-gradient(180deg, var(--sol1), var(--sol2), var(--sol3)); }
.cartao-topo { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.num { font-family: var(--serif); font-size: 15px; color: var(--fumo); min-width: 26px; }
.cartao-titulo { flex: 1; font-family: var(--serif); font-size: 19px; font-weight: 600; border: none; border-bottom: 1px solid transparent; background: transparent; padding: 4px 2px; }
.cartao-titulo:focus { border-bottom-color: var(--sol2); box-shadow: none; }
.cartao-acoes { display: flex; gap: 2px; }
.cartao-acoes button { background: none; border: 1px solid transparent; cursor: pointer; color: var(--fumo); font-size: 14px; padding: 4px 7px; }
.cartao-acoes button:hover { color: var(--tinta); border-color: #d6d1c9; }
.cartao textarea { font-family: Georgia, 'Times New Roman', serif; font-size: 15px; border-color: #ddd8d0; }

.vazio-grande { margin-top: 24px; padding: 40px; text-align: center; color: var(--fumo); border: 1px dashed #c9c4bc; font-family: var(--serif); font-size: 17px; font-style: italic; }

.preview { width: 100%; height: 76vh; border: 1px solid var(--linha); background: #fff; margin-top: 16px; }

.rodape { text-align: center; padding: 18px; color: var(--fumo); font-family: var(--serif); font-style: italic; font-size: 14px; border-top: 1px solid #ddd8d0; }

@media (prefers-reduced-motion: reduce) { .btn { transition: none; } }
`;
