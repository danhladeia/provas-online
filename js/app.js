/* ============================================================
   MOTOR DA AVALIAÇÃO GAMIFICADA — sistema unificado (4 turmas)
   Fluxo: selecionar turma → escolher nome → PIN → prova → resultado
   Recursos: PIN com bcrypt no banco, tela cheia + detecção de saída,
   recuperação de sessão e tempo extra (PEI/laudo).
   ============================================================ */
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const sp = n => n && n.indexOf("/") >= 0 ? n : "assets/sprites/" + n + ".png";
const LETRAS = ["A", "B", "C", "D", "E"];

function embaralhar(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------------------------------------------------- som */
const Som = (() => {
  let ctx = null;
  const on = () => ctx || (ctx = new (window.AudioContext || window.webkitAudioContext)());
  function toca(freqs, dur = 0.12, tipo = "sine", vol = 0.16) {
    try {
      const c = on();
      freqs.forEach((f, i) => {
        const o = c.createOscillator(), g = c.createGain();
        o.type = tipo; o.frequency.value = f;
        const t0 = c.currentTime + i * dur * 0.85;
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(vol, t0 + 0.015);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
        o.connect(g); g.connect(c.destination);
        o.start(t0); o.stop(t0 + dur + 0.02);
      });
    } catch {}
  }
  return {
    clique:  () => toca([520], 0.06, "triangle", 0.08),
    acerto:  () => toca([660, 880, 1180], 0.13, "sine", 0.15),
    erro:    () => toca([300, 200], 0.16, "sawtooth", 0.09),
    parcial: () => toca([560, 700], 0.12, "sine", 0.12),
    fim:     () => toca([523, 659, 784, 1046], 0.18, "sine", 0.16)
  };
})();

/* ---------------------------------------------------- estado */
const S = {
  turma: null, banco: null, cfg: null,
  aluno: "", questoes: [], idx: 0, registros: [],
  tQ0: 0, tick: null, tickTotal: null, prova0: 0,
  tempoTotal: 0, tempoExtra: 0, provaId: null, tentativaId: null,
  resposta: null, respondida: false, andamento: false,
  pontos: 0, sequencia: 0, melhorSequencia: 0, infracoes: 0
};

const cfgTurma = () => CONFIG.TURMAS.find(t => t.id === S.turma);

/* ====================================================================
   1. SORTEIO ANTI-REPETIÇÃO (por turma)
   ==================================================================== */
async function sortearQuestoes(aluno) {
  const anteriores = await NUVEM.buscarSorteios(S.turma);
  const provasAntigas = anteriores.map(s => s.questoes || []).filter(p => p.length);

  const uso = {};
  S.banco.questoes.forEach(q => uso[q.id] = 0);
  provasAntigas.forEach(p => p.forEach(id => { if (id in uso) uso[id]++; }));

  const gerarCandidato = () => {
    const fora = [];
    for (const nivel of [1, 2, 3]) {
      const k = S.cfg.distribuicao[nivel];
      const pool = S.banco.questoes.filter(q => q.nivel === nivel)
        .map(q => ({ q, peso: uso[q.id] + Math.random() * 0.9 }))
        .sort((a, b) => a.peso - b.peso);
      fora.push(...pool.slice(0, k).map(x => x.q));
    }
    return fora;
  };

  let escolhidas = null, melhorNota = Infinity;
  for (let t = 0; t < 40; t++) {
    const cand = gerarCandidato();
    const ids = cand.map(q => q.id);
    let maiorSobreposicao = 0, identica = false;
    for (const p of provasAntigas) {
      const ov = ids.filter(id => p.includes(id)).length;
      if (ov === ids.length) identica = true;
      if (ov > maiorSobreposicao) maiorSobreposicao = ov;
    }
    const somaUso = ids.reduce((s, id) => s + uso[id], 0);
    const nota = (identica ? 1000 : 0) + maiorSobreposicao * 10 + somaUso;
    if (nota < melhorNota) { melhorNota = nota; escolhidas = cand; }
    if (maiorSobreposicao <= 4 && !identica) break;
  }

  const questoes = embaralhar(escolhidas);
  NUVEM.salvarSorteio(aluno, S.turma, questoes.map(q => q.id));
  return questoes;
}

/* ====================================================================
   2. TEMPO E VALOR DA QUESTÃO
   ==================================================================== */
function tempos(q) {
  const m = S.cfg.multiplicadorTempo || 1;
  return { leitura: q.leitura * m, decay: q.decay * m };
}

function fatorTempo(q, seg) {
  const { leitura, decay } = tempos(q);
  if (seg <= leitura) return 1;
  const piso = S.cfg.fatorMinimo;
  return Math.max(piso, 1 - (1 - piso) * ((seg - leitura) / decay));
}

const fmtTempo = s => {
  s = Math.max(0, Math.floor(s));
  return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
};

function iniciarCronometro() {
  clearInterval(S.tick);
  S.tQ0 = Date.now();
  const q = S.questoes[S.idx];
  const leitura = tempos(q).leitura;
  const pinta = () => {
    if (S.respondida) return;
    const seg = (Date.now() - S.tQ0) / 1000;
    const f = fatorTempo(q, seg);
    const salvo = seg <= leitura;
    const barra = $("#valor-barra"), rot = $("#valor-rotulo"), cro = $("#cronometro");
    barra.style.width = (f * 100) + "%";
    barra.className = "barra-fill " + (f > 0.85 ? "ok" : f > 0.6 ? "meio" : "baixo");
    rot.textContent = salvo
      ? "Tempo de leitura • valor 100%"
      : "Valor da questão: " + Math.round(f * 100) + "%";
    rot.classList.toggle("salvo", salvo);
    cro.textContent = fmtTempo(seg);
    if (salvo) {
      const resta = Math.ceil(leitura - seg);
      cro.textContent = fmtTempo(seg) + " · área salva " + resta + "s";
    }
  };
  pinta();
  S.tick = setInterval(pinta, 200);
}

/* cronômetro geral da prova (com tempo extra somado) */
function iniciarTempoTotal() {
  clearInterval(S.tickTotal);
  const pinta = () => {
    if (!S.andamento) return;
    const restam = S.tempoTotal - (Date.now() - S.prova0) / 1000;
    const el = $("#hud-tempo-total");
    if (!el) return;
    if (restam <= 0) {
      el.textContent = "00:00";
      el.classList.add("esgotou");
      forcarFinalizar();
      return;
    }
    el.textContent = "⏳ " + fmtTempo(restam);
    el.classList.toggle("urgente", restam < 60);
  };
  pinta();
  S.tickTotal = setInterval(pinta, 500);
}

/* ---------------------------------------------------- ajustes ao vivo do professor
   (tempo extra / penalidade aplicados durante a prova, no painel do professor) */
function iniciarPolAjustes() {
  clearInterval(S.tickAjuste);
  if (String(S.tentativaId).startsWith("local-")) return;
  S.tickAjuste = setInterval(async () => {
    if (!S.andamento) return;
    const aj = await NUVEM.consultarAjuste(S.tentativaId);
    if (!aj) return;
    const novo = (aj.ajuste_tempo || 0) - S.ajusteAplicado;
    if (novo !== 0) {
      S.tempoTotal += novo;
      S.ajusteAplicado = aj.ajuste_tempo || 0;
      const el = $("#hud-tempo-total");
      if (el) {
        el.classList.add(novo > 0 ? "tempo-bonus" : "tempo-punido");
        setTimeout(() => el.classList.remove("tempo-bonus", "tempo-punido"), 2500);
      }
    }
  }, 12000);
}

async function forcarFinalizar() {
  if (!S.andamento || S.finalizando) return;
  S.finalizando = true;
  clearInterval(S.tick);
  clearInterval(S.tickTotal);
  const el = $("#painel-feedback");
  if (el) {
    el.className = "painel-feedback aberto ruim";
    el.innerHTML = `<img class="mascote" src="${sp("mascote_pensa")}" alt="">
      <div class="fb-texto"><h3>⏰ Tempo esgotado!</h3>
      <p class="fb-detalhe">O tempo total da prova acabou. Vamos corrigir o que você respondeu.</p></div>`;
  }
  await finalizar(true);
}

/* ====================================================================
   3. TELAS E FLUXO
   ==================================================================== */
function irPara(tela) {
  $$(".tela").forEach(t => t.classList.remove("ativa"));
  $("#" + tela).classList.add("ativa");
  window.scrollTo({ top: 0, behavior: "instant" });
}

/* escolheu a turma -> mostra lista de nomes + regras */
function selecionarTurma(id) {
  S.turma = id;
  S.cfg = cfgTurma();
  S.banco = BANCOS[id] || { categorias: [], questoes: [] };
  const turma = CONFIG.TURMAS.find(t => t.id === id);
  const d = turma.distribuicao || { 1: 4, 2: 3, 3: 3 };
  const total = d[1] + d[2] + d[3];
  $("#sel-turma-titulo").textContent = turma.rotulo;
  $("#sel-turma-tema").innerHTML =
    `<b>${turma.materia ? turma.materia + " — " : ""}Tema:</b> ${turma.tema} Você vai responder
     <b>${total} questões sorteadas</b>: ${d[1]} fáceis, ${d[2]} médias e ${d[3]} difíceis.
     Tempo total: <b>${fmtTempo(turma.tempoTotal || 1500)}</b>.`;
  S.pinAtual = "";
  $("#pin-aluno").value = "";
  $("#aviso-pin-primeiro").textContent = "";
  $("#aviso-nome").textContent = "";
  $("#form-pin-primeiro").style.display = "";
  $("#form-inicio").style.display = "none";
  const rec = NUVEM.recuperarSessao();
  const banner = $("#retomar-banner");
  if (rec && rec.turma === id && rec.tentativaId) {
    banner.style.display = "block";
    banner.querySelector("#retomar-info").textContent =
      `${rec.aluno} — questão ${(rec.idx || 0) + 1} de ${(rec.questoes || []).length}`;
    banner.querySelector("#btn-retomar").onclick = retomarSessao;
  } else {
    banner.style.display = "none";
  }
  irPara("tela-nome");
}

/* etapa 1: valida o PIN da turma e só então libera a lista de nomes
   (a lista nunca fica no código — vem do banco, liberada pelo PIN certo) */
async function validarPinEMostrarNomes(ev) {
  ev.preventDefault();
  const pin = $("#pin-aluno").value.trim();
  if (pin.length < 4) { $("#aviso-pin-primeiro").textContent = "Digite o PIN que o professor informou."; return; }

  const btn = $("#btn-validar-pin");
  btn.disabled = true;
  btn.textContent = "Validando…";

  const nomes = await NUVEM.listarNomesTurma(pin, S.turma);
  btn.disabled = false;
  btn.textContent = "Validar PIN";

  if (!nomes || !nomes.length) {
    $("#aviso-pin-primeiro").textContent = "PIN inválido, prova fechada ou sem conexão. Confira com o professor.";
    return;
  }

  S.pinAtual = pin;
  $("#nome-aluno").innerHTML =
    `<option value="">— Escolha o seu nome —</option>` +
    nomes.map(n => `<option value="${n}">${n}</option>`).join("");
  $("#form-pin-primeiro").style.display = "none";
  $("#form-inicio").style.display = "";
  $("#nome-aluno").focus();
}

async function comecarProva(ev) {
  ev.preventDefault();
  const nome = $("#nome-aluno").value;
  if (!nome) { $("#aviso-nome").textContent = "Escolha o seu nome na lista."; return; }
  const pin = S.pinAtual;

  const btn = $("#btn-comecar");
  btn.disabled = true;
  btn.textContent = "Validando PIN…";

  const reg = await NUVEM.validarPin(pin, S.turma, nome);
  if (!reg) {
    $("#aviso-nome").textContent = "PIN inválido, prova fechada ou você já a concluiu. Fale com o professor.";
    btn.disabled = false;
    btn.textContent = "🏁 Começar a avaliação";
    return;
  }

  S.aluno = nome;
  S.provaId = reg.provaId;
  S.tentativaId = reg.tentativaId;
  S.tempoExtra = reg.tempo_extra || 0;
  S.tempoTotal = (S.cfg.tempoTotal || 1500) + S.tempoExtra;

  btn.textContent = "Sorteando sua prova…";
  S.questoes = await sortearQuestoes(nome);
  S.idx = 0; S.registros = []; S.pontos = 0;
  S.sequencia = 0; S.melhorSequencia = 0; S.infracoes = 0; S.finalizando = false;
  S.ajusteAplicado = 0;

  btn.disabled = false;
  btn.textContent = "🏁 Começar a avaliação";
  abrirPortaoTelaCheia(iniciarProvaAgora);
}

/* a prova só começa depois que o aluno confirma a entrada em tela cheia
   (precisa ser um gesto direto do usuário — por isso fica numa tela própria,
   sem nenhum await entre o clique e o requestFullscreen). */
function abrirPortaoTelaCheia(aoConfirmar) {
  irPara("tela-gate");
  $("#btn-gate-tela-cheia").onclick = () => {
    const el = document.documentElement;
    const pedir = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen;
    const prossegue = () => aoConfirmar();
    try {
      const p = pedir ? pedir.call(el) : null;
      Promise.resolve(p).then(prossegue).catch(prossegue);
    } catch {
      prossegue();
    }
  };
}

function iniciarProvaAgora() {
  S.prova0 = Date.now();
  S.andamento = true;
  $("#hud-aluno").textContent = S.aluno;
  $("#hud-tempo-total").classList.remove("esgotou");
  irPara("tela-prova");
  mostrarQuestao();
  iniciarTempoTotal();
  iniciarPolAjustes();
  salvarProgresso();
  window.onbeforeunload = () => "Sua prova está em andamento. Sair agora perde tudo.";
}

/* recupera uma prova interrompida (se a página foi fechada sem querer) */
function retomarSessao() {
  const rec = NUVEM.recuperarSessao();
  if (!rec || rec.turma !== S.turma) return;
  S.turma = rec.turma; S.cfg = cfgTurma(); S.banco = BANCOS[S.turma];
  S.aluno = rec.aluno; S.provaId = rec.provaId; S.tentativaId = rec.tentativaId;
  S.tempoExtra = rec.tempoExtra || 0;
  S.tempoTotal = (S.cfg.tempoTotal || 1500) + S.tempoExtra;
  S.questoes = (rec.questoes || []).map(qid =>
    S.banco.questoes.find(q => q.id === qid)).filter(Boolean);
  S.idx = rec.idx || 0; S.registros = rec.registros || [];
  S.pontos = rec.pontos || 0; S.sequencia = rec.sequencia || 0;
  S.melhorSequencia = rec.melhorSequencia || 0; S.infracoes = rec.infracoes || 0;
  S.ajusteAplicado = 0;
  S.prova0 = Date.now() - (rec.tempoDecorrido || 0);
  S.finalizando = false;

  abrirPortaoTelaCheia(() => {
    S.andamento = true;
    $("#hud-aluno").textContent = S.aluno;
    $("#hud-tempo-total").classList.remove("esgotou");
    irPara("tela-prova");
    mostrarQuestao();
    iniciarTempoTotal();
    iniciarPolAjustes();
    window.onbeforeunload = () => "Sua prova está em andamento. Sair agora perde tudo.";
  });
}

function salvarProgresso() {
  if (!S.andamento) return;
  NUVEM.salvarSessao({
    turma: S.turma, aluno: S.aluno, provaId: S.provaId, tentativaId: S.tentativaId,
    tempoExtra: S.tempoExtra, tempoDecorrido: Date.now() - S.prova0,
    questoes: S.questoes.map(q => q.id), idx: S.idx,
    registros: S.registros, pontos: S.pontos,
    sequencia: S.sequencia, melhorSequencia: S.melhorSequencia, infracoes: S.infracoes
  });
  NUVEM.atualizarProgresso(S.tentativaId, S.idx, S.pontos, S.questoes.length);
}

/* ---------------------------------------------------- render questão */
function mostrarQuestao() {
  const q = S.questoes[S.idx];
  S.resposta = null; S.respondida = false;

  $("#hud-progresso").textContent = "Questão " + (S.idx + 1) + " de " + S.questoes.length;
  $("#hud-pontos").textContent = S.pontos;
  $("#hud-sequencia").textContent = S.sequencia;
  $("#trilha").innerHTML = S.questoes.map((qq, i) =>
    `<span class="passo ${i < S.idx ? "feito " + (S.registros[i]?.fracao === 1 ? "acertou" : S.registros[i]?.fracao > 0 ? "parcial" : "errou") : ""} ${i === S.idx ? "agora" : ""}"></span>`
  ).join("");

  const nivelNome = { 1: "Fácil", 2: "Médio", 3: "Difícil" }[q.nivel];
  const corpo = $("#questao");
  corpo.className = "cartao-questao nivel-" + q.nivel;
  corpo.innerHTML = `
    <div class="questao-topo">
      <div class="selo-nivel">
        <img src="${sp("nivel" + q.nivel)}" alt="">
        <div><b>Nível ${q.nivel}</b><span>${nivelNome}</span></div>
      </div>
      <div class="tipo-etiqueta">${rotuloTipo(q.tipo)}</div>
    </div>
    ${q.texto ? `<div class="texto-apoio"><img src="${sp("lampada")}" alt="" class="mini">
        <p>${q.texto}</p></div>` : ""}
    <div class="enunciado-linha">
      ${q.sprite ? `<img class="sprite-questao" src="${sp(q.sprite)}" alt="">` : ""}
      <h2 class="enunciado">${q.enunciado}</h2>
    </div>
    <div id="area-resposta" class="area-resposta"></div>`;

  ({ mc: renderMC, vf: renderVF, ordenar: renderOrdenar, ligar: renderLigar,
     classificar: renderClassificar, lacuna: renderLacuna })[q.tipo](q, $("#area-resposta"));

  $("#painel-feedback").innerHTML = "";
  $("#painel-feedback").className = "painel-feedback";
  const btn = $("#btn-confirmar");
  btn.textContent = "Confirmar resposta";
  btn.disabled = true;
  btn.onclick = confirmarResposta;
  iniciarCronometro();
}

const rotuloTipo = t => ({
  mc: "Múltipla escolha", vf: "Verdadeiro ou falso", ordenar: "Monte a sequência",
  ligar: "Ligue os pontos", classificar: "Arraste e classifique", lacuna: "Complete a frase"
}[t]);

function liberarConfirmar(ok) { $("#btn-confirmar").disabled = !ok; }

/* ---------------------------------------------------- tipo: múltipla escolha */
function renderMC(q, el) {
  const alts = embaralhar(q.alternativas.map((a, i) => ({ ...a, orig: i })));
  el.innerHTML = `<div class="alternativas">${alts.map((a, i) => `
    <button class="alternativa" data-i="${i}">
      <span class="letra">${LETRAS[i]}</span><span class="txt">${a.t}</span>
    </button>`).join("")}</div>`;
  el.querySelectorAll(".alternativa").forEach(b => b.onclick = () => {
    if (S.respondida) return;
    Som.clique();
    el.querySelectorAll(".alternativa").forEach(x => x.classList.remove("sel"));
    b.classList.add("sel");
    S.resposta = { escolha: +b.dataset.i, alts };
    liberarConfirmar(true);
  });
}

/* ---------------------------------------------------- tipo: verdadeiro/falso */
function renderVF(q, el) {
  const afs = embaralhar(q.afirmacoes);
  S.resposta = { afs, marcas: new Array(afs.length).fill(null) };
  el.innerHTML = `<div class="lista-vf">${afs.map((a, i) => `
    <div class="linha-vf" data-i="${i}">
      <p>${a.t}</p>
      <div class="vf-botoes">
        <button data-v="1">V</button><button data-v="0">F</button>
      </div>
    </div>`).join("")}</div>`;
  el.querySelectorAll(".linha-vf").forEach(linha => {
    linha.querySelectorAll("button").forEach(b => b.onclick = () => {
      if (S.respondida) return;
      Som.clique();
      linha.querySelectorAll("button").forEach(x => x.classList.remove("sel"));
      b.classList.add("sel");
      S.resposta.marcas[+linha.dataset.i] = b.dataset.v === "1";
      liberarConfirmar(S.resposta.marcas.every(m => m !== null));
    });
  });
}

/* ---------------------------------------------------- tipo: ordenar */
function renderOrdenar(q, el) {
  const itens = embaralhar(q.itens);
  S.resposta = { itens, seq: [] };
  el.innerHTML = `
    <p class="instrucao">Toque nos cartões na ordem certa. Toque de novo para tirar.</p>
    <div class="lista-ordenar">${itens.map((it, i) => `
      <button class="cartao-ordem" data-i="${i}">
        <span class="posicao"></span><span class="txt">${it.t}</span>
      </button>`).join("")}</div>`;
  const repinta = () => {
    el.querySelectorAll(".cartao-ordem").forEach(c => {
      const pos = S.resposta.seq.indexOf(+c.dataset.i);
      c.classList.toggle("posicionado", pos >= 0);
      c.querySelector(".posicao").textContent = pos >= 0 ? (pos + 1) + "º" : "";
    });
    liberarConfirmar(S.resposta.seq.length === itens.length);
  };
  el.querySelectorAll(".cartao-ordem").forEach(c => c.onclick = () => {
    if (S.respondida) return;
    Som.clique();
    const i = +c.dataset.i, at = S.resposta.seq.indexOf(i);
    if (at >= 0) S.resposta.seq.splice(at, 1); else S.resposta.seq.push(i);
    repinta();
  });
  repinta();
}

/* ---------------------------------------------------- tipo: ligar pontos */
function renderLigar(q, el) {
  const esq = embaralhar(q.pares.map((p, i) => ({ ...p, orig: i })));
  const dir = embaralhar(q.pares.map((p, i) => ({ b: p.b, orig: i })));
  S.resposta = { esq, dir, ligacoes: {} };
  el.innerHTML = `
    <p class="instrucao">Toque num item da esquerda e depois no par certo da direita.</p>
    <div class="ligar-area">
      <svg id="ligar-svg"></svg>
      <div class="coluna esq">${esq.map((p, i) => `
        <button class="ponto pesq" data-i="${i}">
          ${p.sprite ? `<img src="${sp(p.sprite)}" alt="">` : ""}<span>${p.a}</span>
          <i class="bolinha"></i>
        </button>`).join("")}</div>
      <div class="coluna dir">${dir.map((p, i) => `
        <button class="ponto pdir" data-i="${i}">
          <i class="bolinha"></i><span>${p.b}</span>
        </button>`).join("")}</div>
    </div>`;

  let sel = null;
  const svg = el.querySelector("#ligar-svg");
  const cores = ["#1F3C88", "#2E7D32", "#E8590C", "#6A1B9A", "#0288D1"];

  const desenhar = () => {
    const area = el.querySelector(".ligar-area").getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${area.width} ${area.height}`);
    svg.style.width = area.width + "px"; svg.style.height = area.height + "px";
    svg.innerHTML = Object.entries(S.resposta.ligacoes).map(([a, b], n) => {
      const pa = el.querySelector(`.pesq[data-i="${a}"] .bolinha`).getBoundingClientRect();
      const pb = el.querySelector(`.pdir[data-i="${b}"] .bolinha`).getBoundingClientRect();
      const x1 = pa.left + pa.width / 2 - area.left, y1 = pa.top + pa.height / 2 - area.top;
      const x2 = pb.left + pb.width / 2 - area.left, y2 = pb.top + pb.height / 2 - area.top;
      const mx = (x1 + x2) / 2;
      return `<path d="M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}"
                fill="none" stroke="${cores[n % cores.length]}" stroke-width="5"
                stroke-linecap="round" opacity=".85"/>`;
    }).join("");
    el.querySelectorAll(".ponto").forEach(p => p.classList.remove("ligado"));
    Object.entries(S.resposta.ligacoes).forEach(([a, b]) => {
      el.querySelector(`.pesq[data-i="${a}"]`).classList.add("ligado");
      el.querySelector(`.pdir[data-i="${b}"]`).classList.add("ligado");
    });
    liberarConfirmar(Object.keys(S.resposta.ligacoes).length === esq.length);
  };

  el.querySelectorAll(".pesq").forEach(b => b.onclick = () => {
    if (S.respondida) return;
    Som.clique();
    const i = +b.dataset.i;
    if (i in S.resposta.ligacoes) { delete S.resposta.ligacoes[i]; desenhar(); return; }
    sel = i;
    el.querySelectorAll(".pesq").forEach(x => x.classList.remove("sel"));
    b.classList.add("sel");
  });
  el.querySelectorAll(".pdir").forEach(b => b.onclick = () => {
    if (S.respondida || sel === null) return;
    Som.clique();
    const j = +b.dataset.i;
    for (const k in S.resposta.ligacoes) if (S.resposta.ligacoes[k] === j) delete S.resposta.ligacoes[k];
    S.resposta.ligacoes[sel] = j;
    sel = null;
    el.querySelectorAll(".pesq").forEach(x => x.classList.remove("sel"));
    desenhar();
  });
  setTimeout(desenhar, 60);
  window.addEventListener("resize", desenhar);
}

/* ---------------------------------------------------- tipo: classificar */
const ICONES_CAT = {
  "Invasão": "brasao_invasao", "Precisão": "brasao_precisao",
  "Marca": "brasao_marca", "Técnico-combinatório": "brasao_tecnico"
};

function renderClassificar(q, el) {
  const itens = embaralhar(q.itens.map((it, i) => ({ ...it, id: i })));
  S.resposta = { itens, destino: {} };
  el.innerHTML = `
    <p class="instrucao">Arraste cada item para a caixa certa (ou toque no item e depois na caixa).</p>
    <div class="bandeja" id="bandeja">${itens.map(it => `
      <div class="chip" draggable="true" data-id="${it.id}">
        ${it.sprite ? `<img src="${sp(it.sprite)}" alt="">` : ""}<span>${it.t}</span>
      </div>`).join("")}</div>
    <div class="caixas">${q.categorias.map((c, i) => `
      <div class="caixa cat-${i}" data-cat="${c}">
        <div class="caixa-titulo"><img src="${sp(ICONES_CAT[c] || "alvo")}" alt=""><span>${c}</span></div>
        <div class="caixa-itens"></div>
      </div>`).join("")}</div>`;

  let selecionado = null;
  const bandeja = el.querySelector("#bandeja");

  const colocar = (id, cat) => {
    const chip = el.querySelector(`.chip[data-id="${id}"]`);
    if (!chip) return;
    if (cat) { S.resposta.destino[id] = cat; el.querySelector(`.caixa[data-cat="${cat}"] .caixa-itens`).appendChild(chip); }
    else { delete S.resposta.destino[id]; bandeja.appendChild(chip); }
    chip.classList.remove("sel");
    selecionado = null;
    Som.clique();
    liberarConfirmar(Object.keys(S.resposta.destino).length === itens.length);
  };

  el.querySelectorAll(".chip").forEach(chip => {
    chip.onclick = () => {
      if (S.respondida) return;
      if (chip.parentElement.classList.contains("caixa-itens")) { colocar(+chip.dataset.id, null); return; }
      el.querySelectorAll(".chip").forEach(c => c.classList.remove("sel"));
      chip.classList.add("sel");
      selecionado = +chip.dataset.id;
      Som.clique();
    };
    chip.ondragstart = e => { selecionado = +chip.dataset.id; e.dataTransfer.setData("text/plain", chip.dataset.id); };
  });
  el.querySelectorAll(".caixa").forEach(caixa => {
    caixa.onclick = () => { if (!S.respondida && selecionado !== null) colocar(selecionado, caixa.dataset.cat); };
    caixa.ondragover = e => { e.preventDefault(); caixa.classList.add("sobre"); };
    caixa.ondragleave = () => caixa.classList.remove("sobre");
    caixa.ondrop = e => {
      e.preventDefault(); caixa.classList.remove("sobre");
      if (!S.respondida) colocar(+e.dataTransfer.getData("text/plain"), caixa.dataset.cat);
    };
  });
  bandeja.ondragover = e => e.preventDefault();
  bandeja.ondrop = e => {
    e.preventDefault();
    if (!S.respondida) colocar(+e.dataTransfer.getData("text/plain"), null);
  };
}

/* ---------------------------------------------------- tipo: completar lacunas */
function renderLacuna(q, el) {
  const nLac = (q.frase.match(/\{\d\}/g) || []).length;
  S.resposta = { preenchido: new Array(nLac).fill(null) };
  const frase = q.frase.replace(/\{(\d)\}/g, (_, i) => `<button class="lacuna" data-i="${i}">?</button>`);
  el.innerHTML = `
    <p class="frase-lacuna">${frase}</p>
    <p class="instrucao">Toque numa palavra do banco para preencher. Toque na lacuna para desfazer.</p>
    <div class="banco-palavras">${embaralhar(q.banco).map(p => `
      <button class="palavra" data-p="${p}">${p}</button>`).join("")}</div>`;

  const repinta = () => {
    el.querySelectorAll(".lacuna").forEach(l => {
      const v = S.resposta.preenchido[+l.dataset.i];
      l.textContent = v || "?";
      l.classList.toggle("cheia", !!v);
    });
    el.querySelectorAll(".palavra").forEach(p =>
      p.classList.toggle("usada", S.resposta.preenchido.includes(p.dataset.p)));
    liberarConfirmar(S.resposta.preenchido.every(v => v !== null));
  };
  el.querySelectorAll(".palavra").forEach(b => b.onclick = () => {
    if (S.respondida || S.resposta.preenchido.includes(b.dataset.p)) return;
    const vazia = S.resposta.preenchido.indexOf(null);
    if (vazia < 0) return;
    S.resposta.preenchido[vazia] = b.dataset.p;
    Som.clique(); repinta();
  });
  el.querySelectorAll(".lacuna").forEach(l => l.onclick = () => {
    if (S.respondida) return;
    S.resposta.preenchido[+l.dataset.i] = null;
    Som.clique(); repinta();
  });
  repinta();
}

/* ====================================================================
   4. CORREÇÃO
   ==================================================================== */
function corrigir(q) {
  const r = S.resposta;
  const el = $("#area-resposta");
  let fracao = 0, detalhe = "";

  if (q.tipo === "mc") {
    const alts = r.alts;
    fracao = alts[r.escolha].ok ? 1 : 0;
    el.querySelectorAll(".alternativa").forEach((b, i) => {
      if (alts[i].ok) b.classList.add("certa");
      else if (i === r.escolha) b.classList.add("errada");
      b.disabled = true;
    });
    detalhe = alts[r.escolha].t;
  }

  if (q.tipo === "vf") {
    let certos = 0;
    el.querySelectorAll(".linha-vf").forEach((linha, i) => {
      const ok = r.marcas[i] === r.afs[i].v;
      if (ok) certos++;
      linha.classList.add(ok ? "certa" : "errada");
      linha.querySelectorAll("button").forEach(b => {
        b.disabled = true;
        if ((b.dataset.v === "1") === r.afs[i].v) b.classList.add("gabarito");
      });
    });
    fracao = certos / r.afs.length;
    detalhe = certos + " de " + r.afs.length + " afirmações corretas";
  }

  if (q.tipo === "ordenar") {
    let certos = 0;
    r.seq.forEach((idxItem, pos) => { if (r.itens[idxItem].ordem === pos + 1) certos++; });
    fracao = certos / r.itens.length;
    el.querySelectorAll(".cartao-ordem").forEach(c => {
      const it = r.itens[+c.dataset.i], pos = r.seq.indexOf(+c.dataset.i);
      c.classList.add(it.ordem === pos + 1 ? "certa" : "errada");
      c.querySelector(".posicao").textContent = (pos + 1) + "º";
      c.insertAdjacentHTML("beforeend", `<span class="gab">certo: ${it.ordem}º</span>`);
      c.disabled = true;
    });
    detalhe = certos + " de " + r.itens.length + " posições corretas";
  }

  if (q.tipo === "ligar") {
    let certos = 0;
    Object.entries(r.ligacoes).forEach(([a, b]) => {
      const ok = r.esq[a].orig === r.dir[b].orig;
      if (ok) certos++;
      el.querySelector(`.pesq[data-i="${a}"]`).classList.add(ok ? "certa" : "errada");
      el.querySelector(`.pdir[data-i="${b}"]`).classList.add(ok ? "certa" : "errada");
    });
    fracao = certos / r.esq.length;
    el.querySelectorAll(".ponto").forEach(p => p.disabled = true);
    detalhe = certos + " de " + r.esq.length + " ligações corretas";
  }

  if (q.tipo === "classificar") {
    let certos = 0;
    r.itens.forEach(it => {
      const chip = el.querySelector(`.chip[data-id="${it.id}"]`);
      const ok = S.resposta.destino[it.id] === it.cat;
      if (ok) certos++;
      chip.classList.add(ok ? "certa" : "errada");
      if (!ok) chip.insertAdjacentHTML("beforeend", `<em class="gab">${it.cat}</em>`);
      chip.draggable = false;
    });
    fracao = certos / r.itens.length;
    detalhe = certos + " de " + r.itens.length + " classificações corretas";
  }

  if (q.tipo === "lacuna") {
    let certos = 0;
    el.querySelectorAll(".lacuna").forEach((l, i) => {
      const ok = r.preenchido[i] === q.respostas[i];
      if (ok) certos++;
      l.classList.add(ok ? "certa" : "errada");
      if (!ok) l.insertAdjacentHTML("afterend", `<em class="gab">${q.respostas[i]}</em>`);
      l.disabled = true;
    });
    el.querySelectorAll(".palavra").forEach(p => p.disabled = true);
    fracao = certos / q.respostas.length;
    detalhe = certos + " de " + q.respostas.length + " lacunas corretas";
  }

  return { fracao, detalhe };
}

/* texto legível da resposta do aluno e da correta, para o relatório final */
function resumoResposta(q) {
  const r = S.resposta;
  if (q.tipo === "mc") {
    const alts = r.alts;
    return { aluno: alts[r.escolha].t, certa: alts.find(a => a.ok).t };
  }
  if (q.tipo === "vf") {
    return { aluno: r.afs.map((a, i) => {
      const mar = r.marcas[i] === null ? "—" : r.marcas[i] ? "V" : "F";
      return mar + " · " + a.t + " <i>(correto: " + (a.v ? "V" : "F") + ")</i>";
    }).join("<br>"), certa: "" };
  }
  if (q.tipo === "ordenar") {
    const certa = q.itens.slice().sort((a, b) => a.ordem - b.ordem)
      .map(it => it.ordem + "º " + it.t).join(" → ");
    return { aluno: r.seq.map((idx, pos) => (pos + 1) + "º " + r.itens[idx].t).join(" → "), certa };
  }
  if (q.tipo === "ligar") {
    return {
      aluno: Object.entries(r.ligacoes).map(([a, b]) => r.esq[a].a + " → " + r.dir[b].b).join("<br>"),
      certa: q.pares.map(p => p.a + " → " + p.b).join("<br>")
    };
  }
  if (q.tipo === "classificar") {
    return {
      aluno: r.itens.map(it => it.t + " → " + (r.destino[it.id] || "?" )).join("<br>"),
      certa: r.itens.map(it => it.t + " → " + it.cat).join("<br>")
    };
  }
  if (q.tipo === "lacuna") {
    return { aluno: r.preenchido.join(" · "), certa: q.respostas.join(" · ") };
  }
  return { aluno: "", certa: "" };
}

/* ---------------------------------------------------- confirmar */
function confirmarResposta() {
  if (S.respondida) return;
  S.respondida = true;
  clearInterval(S.tick);

  const q = S.questoes[S.idx];
  const seg = (Date.now() - S.tQ0) / 1000;
  const fator = fatorTempo(q, seg);
  const { fracao, detalhe } = corrigir(q);
  const peso = S.cfg.pesos[q.nivel];
  const ganho = Math.round(peso * fracao * fator * 100);

  S.pontos += ganho;
  if (fracao === 1) { S.sequencia++; S.melhorSequencia = Math.max(S.melhorSequencia, S.sequencia); }
  else S.sequencia = 0;

  S.registros[S.idx] = {
    id: q.id, nivel: q.nivel, tipo: q.tipo, fracao: +fracao.toFixed(3),
    segundos: Math.round(seg), fator: +fator.toFixed(3), pontos: ganho,
    dentro_area_salva: seg <= tempos(q).leitura,
    resumo: resumoResposta(q)
  };
  salvarProgresso();

  fracao === 1 ? Som.acerto() : fracao > 0 ? Som.parcial() : Som.erro();

  const mascote = fracao === 1 ? "mascote_comemora" : fracao > 0 ? "mascote_pensa" : "mascote_erro";
  const titulo  = fracao === 1 ? "Mandou bem!" : fracao > 0 ? "Quase lá!" : "Não foi dessa vez";
  const pf = $("#painel-feedback");
  pf.className = "painel-feedback aberto " + (fracao === 1 ? "bom" : fracao > 0 ? "meio" : "ruim");
  pf.innerHTML = `
    <img class="mascote" src="${sp(mascote)}" alt="">
    <div class="fb-texto">
      <h3>${titulo}</h3>
      <p class="fb-detalhe">${detalhe}</p>
      <p class="fb-expl"><b>Por quê:</b> ${q.explicacao}</p>
      <p class="fb-conta">
        <span>Tempo: <b>${fmtTempo(seg)}</b></span>
        <span>Valor do tempo: <b>${Math.round(fator * 100)}%</b></span>
        <span class="ganho">+${ganho} pts</span>
      </p>
    </div>`;
  $("#hud-pontos").textContent = S.pontos;
  $("#hud-sequencia").textContent = S.sequencia;

  const btn = $("#btn-confirmar");
  btn.disabled = false;
  btn.textContent = S.idx === S.questoes.length - 1 ? "Ver meu resultado" : "Próxima questão →";
  btn.onclick = () => {
    if (S.idx === S.questoes.length - 1) finalizar();
    else { S.idx++; mostrarQuestao(); salvarProgresso(); }
  };
  pf.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* ====================================================================
   5. RESULTADO
   ==================================================================== */
async function finalizar(forcado = false) {
  if (!S.andamento) return;
  S.andamento = false;
  window.onbeforeunload = null;
  clearInterval(S.tick);
  clearInterval(S.tickTotal);
  clearInterval(S.tickAjuste);
  const tempoTotal = Math.round((Date.now() - S.prova0) / 1000);

  const somaPesos = S.questoes.reduce((s, q) => s + S.cfg.pesos[q.nivel], 0);
  const obtido = S.questoes.reduce((s, q, i) => {
    const r = S.registros[i];
    return s + S.cfg.pesos[q.nivel] * (r ? r.fracao : 0) * (r ? r.fator : 1);
  }, 0);
  const notaBase = (obtido / somaPesos) * 10;

  /* punição automática por saída de tela/aba + penalidade manual do professor */
  const aj = await NUVEM.consultarAjuste(S.tentativaId);
  const penalidadeManual = (aj && aj.penalidade_manual) || 0;
  const penalidadeAuto = S.infracoes * (S.cfg.penalidadeInfracao || 0);
  const nota = Math.round(Math.max(0, notaBase - penalidadeAuto - penalidadeManual) * 100) / 100;
  const acertos = S.registros.reduce((s, r) => s + (r ? r.fracao : 0), 0);

  const medalha = nota >= 8 ? "medalha_ouro" : nota >= 6 ? "medalha_prata" : nota >= 4 ? "medalha_bronze" : "mascote_erro";
  const recado = nota >= 8 ? "Excelente! Você domina o tema."
               : nota >= 6 ? "Bom trabalho! Revise os pontos abaixo e você chega lá."
               : nota >= 4 ? "Você está no caminho. Vale reler o material e tentar de novo."
               : "Precisamos estudar juntos essa parte. Não desanime!";

  irPara("tela-fim");
  Som.fim();
  confetes();

  $("#resultado").innerHTML = `
    <img class="medalhao" src="${sp(medalha)}" alt="">
    <p class="fim-aluno">${S.aluno}</p>
    <div class="nota-grande"><span>${nota.toFixed(2).replace(".", ",")}</span><small>nota final</small></div>
    <p class="fim-recado">${recado}</p>
    ${S.infracoes ? `<p class="fim-aviso">⚠️ Registradas ${S.infracoes} saída(s) de tela durante a prova.${penalidadeAuto ? ` Desconto automático: ${penalidadeAuto.toFixed(1).replace(".", ",")} ponto(s).` : ""}</p>` : ""}
    ${penalidadeManual ? `<p class="fim-aviso">⚠️ O professor aplicou uma penalidade manual de ${penalidadeManual.toFixed(1).replace(".", ",")} ponto(s).</p>` : ""}
    <div class="fim-numeros">
      <div><b>${acertos.toFixed(1).replace(".", ",")}</b><span>de ${S.questoes.length} questões</span></div>
      <div><b>${S.pontos}</b><span>pontos de XP</span></div>
      <div><b>${fmtTempo(tempoTotal)}</b><span>tempo total</span></div>
      <div><b>${S.melhorSequencia}</b><span>maior sequência</span></div>
    </div>
    <div class="relatorio">
      <h3>📋 Relatório questão a questão</h3>
      ${S.questoes.map((q, i) => {
        const r = S.registros[i] || { fracao: 0, segundos: 0, fator: 1, pontos: 0, resumo: {} };
        const pct = Math.round(r.fracao * 100);
        const classe = pct === 100 ? "ok" : pct > 0 ? "meio" : "nao";
        return `<div class="rel-item ${classe}">
          <div class="rel-cab">
            <span class="rel-num">Questão ${i + 1}</span>
            <span class="tag">Nível ${q.nivel} · ${rotuloTipo(q.tipo)}</span>
            <span class="rel-pts">${pct}% · ${r.pontos} pts</span>
          </div>
          <div class="rel-enunciado">
            ${q.sprite ? `<img class="rel-sprite" src="${sp(q.sprite)}" alt="">` : ""}
            <p>${q.enunciado}</p>
          </div>
          ${q.texto ? `<p class="rel-texto">${q.texto}</p>` : ""}
          <div class="rel-respostas">
            ${r.resumo.aluno ? `<div class="rel-aluno"><b>Sua resposta:</b> ${r.resumo.aluno}</div>` : `<div class="rel-aluno vazio"><b>Sua resposta:</b> não respondida</div>`}
            ${r.resumo.certa ? `<div class="rel-certa"><b>Gabarito:</b> ${r.resumo.certa}</div>` : ""}
          </div>
          <div class="rel-expl">💡 ${q.explicacao}</div>
          <div class="rel-meta">Tempo: ${fmtTempo(r.segundos)} · Valor do tempo: ${Math.round(r.fator * 100)}%</div>
        </div>`;
      }).join("")}
    </div>
    <p class="status-envio" id="status-envio">Enviando resultado para o professor…</p>`;

  const enviado = await NUVEM.salvarAvaliacao({
    aluno: S.aluno, turma: S.turma, nota, acertos: +acertos.toFixed(2),
    total: S.questoes.length, tempo_total: tempoTotal,
    detalhes: { pontos: S.pontos, melhor_sequencia: S.melhorSequencia,
                infracoes: S.infracoes, questoes: S.registros }
  });
  await NUVEM.concluirProva(S.tentativaId);
  NUVEM.limparSessao();
  $("#status-envio").innerHTML = enviado
    ? "✅ Resultado enviado para o professor."
    : "⚠️ Sem internet: o resultado ficou salvo <b>neste aparelho</b>. Avise o professor antes de fechar a página.";
  sairTelaCheia();
}

/* ---------------------------------------------------- confetes */
function confetes() {
  const cv = $("#confete"), ctx = cv.getContext("2d");
  cv.width = innerWidth; cv.height = innerHeight;
  const cores = ["#1F3C88", "#2E7D32", "#E8590C", "#6A1B9A", "#F4B400", "#D32F2F"];
  const ps = Array.from({ length: 140 }, () => ({
    x: Math.random() * cv.width, y: -20 - Math.random() * cv.height,
    r: 4 + Math.random() * 7, vy: 1.6 + Math.random() * 3.4, vx: -1 + Math.random() * 2,
    g: Math.random() * 360, c: cores[Math.floor(Math.random() * cores.length)]
  }));
  let frames = 0;
  (function anima() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    ps.forEach(p => {
      p.y += p.vy; p.x += p.vx; p.g += 4;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.g * Math.PI / 180);
      ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6); ctx.restore();
    });
    if (++frames < 320) requestAnimationFrame(anima);
    else ctx.clearRect(0, 0, cv.width, cv.height);
  })();
}

/* ====================================================================
   6. TELA CHEIA E VIGILÂNCIA (detecção de saída)
   ==================================================================== */
function entrarTelaCheia() {
  const el = document.documentElement;
  const p = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen;
  if (p && !document.fullscreenElement) p.call(el).catch(() => {});
}
function sairTelaCheia() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
}

let saidaInicio = 0;

function registrarInfracao(tipo) {
  S.infracoes++;
  NUVEM.registrarInfracao(S.tentativaId, tipo, Math.round((Date.now() - saidaInicio) / 1000));
}

function mostrarBloqueio() {
  const b = $("#bloqueio");
  b.classList.add("ativo");
  $("#bloqueio-contador").textContent = S.infracoes;
}
function esconderBloqueio() {
  $("#bloqueio").classList.remove("ativo");
}

function vigiarFoco() {
  const fora = () => {
    if (!S.andamento) return;
    if (document.hidden || !document.hasFocus()) {
      saidaInicio = Date.now();
      setTimeout(() => {
        if (S.andamento && (document.hidden || !document.hasFocus()) &&
            Date.now() - saidaInicio > CONFIG.toleranciaSaida) {
          registrarInfracao("trocou_de_aba");
          mostrarBloqueio();
          entrarTelaCheia();
        }
      }, CONFIG.toleranciaSaida + 150);
    }
  };
  document.addEventListener("visibilitychange", fora);
  window.addEventListener("blur", fora);
  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) { esconderBloqueio(); return; }
    if (!S.andamento) return;
    saidaInicio = Date.now();
    setTimeout(() => {
      if (!document.fullscreenElement && S.andamento &&
          Date.now() - saidaInicio > CONFIG.toleranciaSaida) {
        registrarInfracao("saida_de_tela");
        mostrarBloqueio();
        entrarTelaCheia();
      }
    }, CONFIG.toleranciaSaida + 150);
  });
}

/* ---------------------------------------------------- início */
document.addEventListener("DOMContentLoaded", () => {
  /* turmas, agrupadas por nível (Ensino Fundamental / Ensino Médio) */
  const grade = $("#grade-turmas");
  const NIVEL_ROTULO = { fundamental: "📘 Ensino Fundamental", medio: "🎓 Ensino Médio" };
  const grupos = {};
  CONFIG.TURMAS.forEach(t => (grupos[t.nivel || "fundamental"] ||= []).push(t));
  grade.innerHTML = Object.keys(grupos).map(nivel => `
    <section class="grupo-nivel">
      <h2 class="grupo-nivel-titulo">${NIVEL_ROTULO[nivel] || nivel}</h2>
      <div class="grade-turmas">${grupos[nivel].map(t => `
        <button class="card-turma" data-id="${t.id}">
          <span class="turma-nome">${t.rotulo}</span>
          ${t.materia ? `<span class="turma-materia">${t.materia}</span>` : ""}
          <span class="turma-tema">${t.tema}</span>
        </button>`).join("")}</div>
    </section>`).join("");
  grade.querySelectorAll(".card-turma").forEach(b =>
    b.onclick = () => { Som.clique(); selecionarTurma(b.dataset.id); });

  $("#btn-trocar-turma").onclick = () => irPara("tela-inicio");
  $("#form-pin-primeiro").addEventListener("submit", validarPinEMostrarNomes);
  $("#form-inicio").addEventListener("submit", comecarProva);
  $("#nome-aluno").addEventListener("change", () => $("#aviso-nome").textContent = "");
  $("#pin-aluno").addEventListener("input", () => $("#aviso-pin-primeiro").textContent = "");

  vigiarFoco();
});