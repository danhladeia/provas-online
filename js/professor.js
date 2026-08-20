/* ============================================================
   ÁREA DO PROFESSOR — notas e estatísticas por turma
   Sistema unificado (4 turmas) — sem PIN, sem senha, dados locais
   ============================================================ */
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let DADOS_TURMA = [];
let turmaSel = "6º ano B";

const cfgTurma = () => CONFIG.TURMAS.find(t => t.id === turmaSel);

const fmtTempo = s => {
  s = Math.floor(s || 0);
  return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
};
const fmtData = iso => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};
const classeNota = n => n >= 7 ? "n-alta" : n >= 5 ? "n-media" : "n-baixa";

/* ---------------------------------------------------- painel */
function abrirPainel() {
  const sel = $("#turma-painel");
  sel.innerHTML = CONFIG.TURMAS.map(t => `<option value="${t.id}">${t.rotulo}</option>`).join("");
  sel.value = sessionStorage.getItem("prof_turma") || "6º ano B";
  turmaSel = sel.value;
  sel.onchange = () => {
    turmaSel = sel.value;
    sessionStorage.setItem("prof_turma", turmaSel);
    carregar();
  };
  carregar();
}
abrirPainel();

/* ---------------------------------------------------- carregar dados */
function carregar() {
  DADOS_TURMA = DADOS.listarAvaliacoes(turmaSel);
  desenhar();
}
$("#btn-atualizar").onclick = carregar;
$("#busca").oninput = desenhar;
$("#ordem").onchange = desenhar;

/* ---------------------------------------------------- tabela de notas */
function filtrados() {
  const busca = $("#busca").value.trim().toLowerCase();
  let l = DADOS_TURMA.filter(a => a.aluno.toLowerCase().includes(busca));
  const ord = $("#ordem").value;
  l.sort((a, b) =>
    ord === "nota-desc" ? b.nota - a.nota :
    ord === "nota-asc"  ? a.nota - b.nota :
    ord === "nome"      ? a.aluno.localeCompare(b.aluno, "pt-BR") :
    new Date(b.criado_em) - new Date(a.criado_em));
  return l;
}

function desenhar() {
  const lista = filtrados();
  $("#vazio").style.display = lista.length ? "none" : "block";

  const notas = lista.map(a => +a.nota);
  const media = notas.length ? notas.reduce((s, n) => s + n, 0) / notas.length : 0;
  const acima = notas.filter(n => n >= 6).length;
  const tempoMedio = lista.length ? lista.reduce((s, a) => s + (a.tempo_total || 0), 0) / lista.length : 0;

  $("#resumo").innerHTML = `
    <div class="cartao-num"><b>${lista.length}</b><span>provas entregues</span></div>
    <div class="cartao-num"><b>${media.toFixed(2).replace(".", ",")}</b><span>média da turma</span></div>
    <div class="cartao-num"><b>${acima}</b><span>notas ≥ 6,0</span></div>
    <div class="cartao-num"><b>${notas.length ? Math.max(...notas).toFixed(1).replace(".", ",") : "—"}</b><span>maior nota</span></div>
    <div class="cartao-num"><b>${fmtTempo(tempoMedio)}</b><span>tempo médio</span></div>`;

  $("#corpo-notas").innerHTML = lista.map((a, i) => {
    const det = a.detalhes || {};
    return `
    <tr data-i="${i}">
      <td><b>${a.aluno}</b></td>
      <td><span class="nota-pill ${classeNota(+a.nota)}">${(+a.nota).toFixed(2).replace(".", ",")}</span></td>
      <td>${(+a.acertos).toFixed(1).replace(".", ",")} / ${a.total}</td>
      <td>${fmtTempo(a.tempo_total)}</td>
      <td>${det.pontos ?? "—"}</td>
      <td>${fmtData(a.criado_em)}</td>
      <td><button class="btn-sec" data-ver="${i}">ver</button></td>
    </tr>
    <tr class="detalhe-linha" id="det-${i}" style="display:none"><td colspan="7"></td></tr>`;
  }).join("");

  $$("[data-ver]").forEach(b => b.onclick = () => {
    const i = +b.dataset.ver, tr = $("#det-" + i);
    const aberto = tr.style.display !== "none";
    tr.style.display = aberto ? "none" : "table-row";
    b.textContent = aberto ? "ver" : "fechar";
    if (!aberto) tr.querySelector("td").innerHTML = detalheAluno(lista[i]);
  });

  desenharQuestoes();
}

function detalheAluno(a) {
  const qs = (a.detalhes && a.detalhes.questoes) || [];
  const banco = BANCOS[turmaSel]?.questoes || [];
  if (!qs.length) return "<i>Sem detalhamento salvo.</i>";
  return `<b>Questões sorteadas para ${a.aluno}:</b>
    <ol>${qs.map(r => {
      const q = banco.find(x => x.id === r.id);
      const pct = Math.round(r.fracao * 100);
      const cor = pct === 100 ? "var(--acerto)" : pct > 0 ? "#FB8C00" : "var(--erro)";
      return `<li>
        <b style="color:${cor}">${pct}%</b> — <code>${r.id}</code> (nível ${r.nivel}, ${r.tipo})
        · ${fmtTempo(r.segundos)} · valor ${Math.round(r.fator * 100)}%
        ${r.dentro_area_salva ? "· <span style='color:var(--acerto)'>dentro da área salva</span>" : ""}
        <br><span style="color:var(--cinza)">${q ? q.enunciado : ""}</span>
      </li>`;
    }).join("")}</ol>
    <p><b>Maior sequência de acertos:</b> ${a.detalhes.melhor_sequencia ?? 0} · <b>XP:</b> ${a.detalhes.pontos ?? 0}</p>`;
}

/* ---------------------------------------------------- estatística por questão */
function desenharQuestoes() {
  const banco = BANCOS[turmaSel]?.questoes || [];
  const est = {};
  banco.forEach(q => est[q.id] = { q, n: 0, soma: 0, tempo: 0 });
  DADOS_TURMA.forEach(a => ((a.detalhes && a.detalhes.questoes) || []).forEach(r => {
    if (!est[r.id]) return;
    est[r.id].n++; est[r.id].soma += r.fracao; est[r.id].tempo += r.segundos;
  }));
  const linhas = Object.values(est).sort((a, b) =>
    (a.n ? a.soma / a.n : 2) - (b.n ? b.soma / b.n : 2) || a.q.id.localeCompare(b.q.id));

  $("#corpo-questoes").innerHTML = linhas.map(e => {
    const aprov = e.n ? Math.round((e.soma / e.n) * 100) : null;
    const cor = aprov === null ? "var(--cinza)" : aprov >= 70 ? "var(--acerto)" : aprov >= 40 ? "#FB8C00" : "var(--erro)";
    return `<tr>
      <td><code>${e.q.id}</code><br><span style="color:var(--cinza); font-size:12px">${e.q.enunciado.slice(0, 70)}…</span></td>
      <td>${e.q.nivel}</td><td>${e.q.tipo}</td><td>${e.n || "—"}</td>
      <td style="color:${cor}; font-weight:bold">${aprov === null ? "—" : aprov + "%"}</td>
      <td>${e.n ? fmtTempo(e.tempo / e.n) : "—"}</td>
    </tr>`;
  }).join("");
}

/* ---------------------------------------------------- exportar / utilidades */
$("#btn-csv").onclick = () => {
  const linhas = [["Aluno", "Turma", "Nota", "Acertos", "Total", "TempoSegundos", "XP", "DataHora", "Questoes"]];
  filtrados().forEach(a => linhas.push([
    a.aluno, a.turma, String(a.nota).replace(".", ","),
    String(a.acertos).replace(".", ","), a.total, a.tempo_total,
    (a.detalhes && a.detalhes.pontos) || 0,
    fmtData(a.criado_em),
    ((a.detalhes && a.detalhes.questoes) || []).map(q => q.id + ":" + Math.round(q.fracao * 100) + "%").join(" ")
  ]));
  const csv = "﻿" + linhas.map(l => l.map(c => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "notas-" + turmaSel.replace(/\s+/g, "-").toLowerCase() + ".csv";
  a.click();
  URL.revokeObjectURL(url);
};
$("#btn-imprimir").onclick = () => window.print();
