/* ============================================================
   DADOS — armazenamento 100% local (localStorage), sem nuvem.
   O app funciona como PWA offline: sorteio de questões, sessão
   em andamento e resultado final ficam só neste aparelho.
   ============================================================ */
const DADOS = (() => {
  const LS = {
    ler(chave, padrao) {
      try { return JSON.parse(localStorage.getItem(chave)) ?? padrao; }
      catch { return padrao; }
    },
    gravar(chave, valor) {
      try { localStorage.setItem(chave, JSON.stringify(valor)); } catch {}
    }
  };

  return {
    /* ---------- sorteio anti-repetição (só entre provas já feitas neste aparelho) ---------- */
    buscarSorteios(turma) {
      return LS.ler("sorteios_local", []).filter(s => s.turma === turma);
    },
    salvarSorteio(aluno, turma, questoes) {
      const local = LS.ler("sorteios_local", []);
      local.push({ aluno, turma, questoes, criado_em: new Date().toISOString() });
      LS.gravar("sorteios_local", local);
    },

    /* ---------- resultado final ---------- */
    salvarAvaliacao(reg) {
      const local = LS.ler("avaliacoes_local", []);
      local.push({ ...reg, criado_em: new Date().toISOString() });
      LS.gravar("avaliacoes_local", local);
    },
    listarAvaliacoes(turma) {
      return LS.ler("avaliacoes_local", []).filter(a => a.turma === turma);
    },

    /* ---------- sessão (recuperar prova interrompida) ---------- */
    salvarSessao(sessao) { LS.gravar("sessao_ativa", sessao); },
    recuperarSessao() { return LS.ler("sessao_ativa", null); },
    limparSessao() { localStorage.removeItem("sessao_ativa"); }
  };
})();
