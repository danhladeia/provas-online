/* ============================================================
   NUVEM — conversa direto com a API REST do Supabase (sem CDN,
   sem biblioteca externa: funciona offline com fallback local).
   ============================================================ */
const NUVEM = (() => {
  const URL = CONFIG.supabase.url.replace(/\/$/, "");
  const KEY = CONFIG.supabase.key;
  const H = {
    "apikey": KEY,
    "Authorization": "Bearer " + KEY,
    "Content-Type": "application/json"
  };
  let online = null;   // null = ainda não testado

  async function req(caminho, opcoes = {}) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    try {
      const r = await fetch(URL + "/rest/v1/" + caminho, {
        ...opcoes,
        headers: { ...H, ...(opcoes.headers || {}) },
        signal: ctrl.signal
      });
      if (!r.ok) throw new Error("HTTP " + r.status + " " + (await r.text()));
      online = true;
      const txt = await r.text();
      return txt ? JSON.parse(txt) : null;
    } finally {
      clearTimeout(t);
    }
  }

  /* ---------- armazenamento local (espelho / plano B) ---------- */
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
    get online() { return online; },

    /* quais questões já caíram para outros alunos desta turma */
    async buscarSorteios(turma) {
      const local = LS.ler("sorteios_local", []).filter(s => s.turma === turma);
      try {
        const dados = await req(
          "sorteios?select=aluno,questoes&turma=eq." + encodeURIComponent(turma) +
          "&order=criado_em.desc&limit=500");
        return dados.concat(local.filter(l =>
          !dados.some(d => d.aluno === l.aluno && d.questoes.join() === l.questoes.join())));
      } catch (e) {
        online = false;
        console.warn("[nuvem] sorteios offline:", e.message);
        return local;
      }
    },

    async salvarSorteio(aluno, turma, questoes) {
      const reg = { aluno, turma, questoes };
      const local = LS.ler("sorteios_local", []);
      local.push({ ...reg, criado_em: new Date().toISOString() });
      LS.gravar("sorteios_local", local);
      try { await req("sorteios", { method: "POST", body: JSON.stringify(reg) }); }
      catch (e) { online = false; console.warn("[nuvem] sorteio não enviado:", e.message); }
    },

    async salvarAvaliacao(reg) {
      const local = LS.ler("avaliacoes_local", []);
      local.push({ ...reg, criado_em: new Date().toISOString(), pendente: true });
      LS.gravar("avaliacoes_local", local);
      try {
        await req("avaliacoes", {
          method: "POST",
          headers: { "Prefer": "return=minimal" },
          body: JSON.stringify(reg)
        });
        const l2 = LS.ler("avaliacoes_local", []);
        const i = l2.findIndex(a => a.aluno === reg.aluno && a.nota === reg.nota && a.pendente);
        if (i >= 0) { l2[i].pendente = false; LS.gravar("avaliacoes_local", l2); }
        return true;
      } catch (e) {
        online = false;
        console.warn("[nuvem] avaliação guardada só no aparelho:", e.message);
        return false;
      }
    },

    /* usado pela área do professor */
    async listarAvaliacoes(turma) {
      const local = LS.ler("avaliacoes_local", []).filter(a => a.turma === turma)
                      .map(a => ({ ...a, origem: "aparelho" }));
      try {
        const dados = await req(
          "avaliacoes?select=*&turma=eq." + encodeURIComponent(turma) +
          "&order=criado_em.desc&limit=1000");
        const chave = a => a.aluno + "|" + a.criado_em.slice(0, 16);
        const vistos = new Set(dados.map(chave));
        return dados.map(d => ({ ...d, origem: "nuvem" }))
                    .concat(local.filter(l => !vistos.has(chave(l))));
      } catch (e) {
        online = false;
        console.warn("[nuvem] leitura offline:", e.message);
        return local;
      }
    },

    /* reenvia o que ficou preso no aparelho por falta de internet */
    async reenviarPendentes() {
      const local = LS.ler("avaliacoes_local", []);
      let enviados = 0;
      for (const a of local.filter(x => x.pendente)) {
        const { criado_em, pendente, origem, ...reg } = a;
        try {
          await req("avaliacoes", {
            method: "POST",
            headers: { "Prefer": "return=minimal" },
            body: JSON.stringify(reg)
          });
          a.pendente = false; enviados++;
        } catch { break; }
      }
      LS.gravar("avaliacoes_local", local);
      return enviados;
    },

    /* ---------- PROVAS / PIN / INFRAÇÕES / SESSÃO ---------- */

    /* chama uma função RPC no Postgres (SECURITY DEFINER).
       Retorna { ok, data } — ok:false significa rede/hTTP falhou. */
    async rpc(funcao, corpo = {}) {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 8000);
      try {
        const r = await fetch(URL + "/rest/v1/rpc/" + funcao, {
          method: "POST",
          headers: { ...H, "Prefer": "return=representation" },
          body: JSON.stringify(corpo),
          signal: ctrl.signal
        });
        if (!r.ok) throw new Error("HTTP " + r.status);
        online = true;
        const txt = await r.text();
        return { ok: true, data: txt ? JSON.parse(txt) : null };
      } catch (e) {
        online = false;
        console.warn("[nuvem] rpc " + funcao + " offline:", e.message);
        return { ok: false, data: null };
      } finally {
        clearTimeout(t);
      }
    },

    /* valida o PIN da TURMA para este aluno.
       Retorna { provaId, tentativaId, aluno, turma, tempo_extra } ou null.
       Com nuvem fora, usa o espelho local (provas_locais). */
    async validarPin(pin, turma, aluno) {
      const reg = await this.rpc("validar_pin", { p_pin: pin, p_turma: turma, p_aluno: aluno });
      if (reg.ok && reg.data) return {
        provaId: String(reg.data.prova_id), tentativaId: String(reg.data.tentativa_id),
        aluno: reg.data.aluno, turma: reg.data.turma, tempo_extra: Number(reg.data.tempo_extra || 0)
      };
      const pr = LS.ler("provas_locais", []).find(p => p.turma === turma && p.pin === pin && p.aberta);
      if (pr) {
        const jaFez = LS.ler("avaliacoes_local", []).some(a => a.turma === turma && a.aluno === aluno);
        if (jaFez) return null;
        const extra = LS.ler("alunos_extra_locais", [])
          .find(x => x.turma === turma && x.aluno === aluno)?.tempo_extra ?? pr.tempo_extra ?? 0;
        return { provaId: "local-" + turma, tentativaId: "local-" + turma + "|" + aluno,
                 aluno, turma, tempo_extra: Number(extra) };
      }
      return null;
    },

    /* registra uma infração (saída de tela, troca de aba...) */
    async registrarInfracao(tentativaId, tipo, segundosFora) {
      const reg = { tentativa_id: String(tentativaId).startsWith("local-") ? null : tentativaId,
                    tipo, segundos_fora: segundosFora || 0 };
      const local = LS.ler("infracoes_local", []);
      local.push({ ...reg, criado_em: new Date().toISOString() });
      LS.gravar("infracoes_local", local);
      await this.rpc("registrar_infracao", reg);
    },

    /* marca a tentativa como concluída */
    async concluirProva(tentativaId) {
      if (String(tentativaId).startsWith("local-")) return true;
      return (await this.rpc("concluir_prova", { p_tentativa_id: tentativaId })).ok;
    },

    /* ---------- sessão (recuperar prova interrompida) ---------- */
    salvarSessao(sessao) { LS.gravar("sessao_ativa", sessao); },
    recuperarSessao() { return LS.ler("sessao_ativa", null); },
    limparSessao() { localStorage.removeItem("sessao_ativa"); },

    /* ---------- área do professor ---------- */

    /* define/substitui o PIN da turma (abre a prova). Retorna true se foi à nuvem. */
    async definirPin(senha, turma, pin, tempoExtra) {
      const rpc = await this.rpc("definir_pin", { p_senha: senha, p_turma: turma, p_pin: pin, p_tempo_extra: tempoExtra || 0 });
      if (rpc.ok) return true;
      const locais = LS.ler("provas_locais", []);
      const nova = { turma, pin, aberta: true, tempo_extra: tempoExtra || 0, criado_em: new Date().toISOString() };
      const i = locais.findIndex(p => p.turma === turma);
      if (i >= 0) locais[i] = nova; else locais.push(nova);
      LS.gravar("provas_locais", locais);
      return false;
    },

    async setAberta(senha, turma, aberta) {
      const rpc = await this.rpc("set_prova_aberta", { p_senha: senha, p_turma: turma, p_aberta: aberta });
      if (rpc.ok) return true;
      const locais = LS.ler("provas_locais", []);
      const pr = locais.find(p => p.turma === turma);
      if (pr) { pr.aberta = aberta; LS.gravar("provas_locais", locais); }
      return false;
    },

    async setTempoExtraAluno(senha, turma, aluno, tempoExtra) {
      const rpc = await this.rpc("set_tempo_extra_aluno",
        { p_senha: senha, p_turma: turma, p_aluno: aluno, p_tempo_extra: tempoExtra });
      if (rpc.ok) return true;
      const locais = LS.ler("alunos_extra_locais", []);
      const i = locais.findIndex(x => x.turma === turma && x.aluno === aluno);
      if (tempoExtra <= 0) { if (i >= 0) locais.splice(i, 1); }
      else if (i >= 0) locais[i].tempo_extra = tempoExtra;
      else locais.push({ turma, aluno, tempo_extra: tempoExtra });
      LS.gravar("alunos_extra_locais", locais);
      return false;
    },

    /* estado das provas (uma por turma) — painel do professor */
    async listarProvas(senha) {
      try {
        return await req("rpc/listar_provas", {
          method: "POST", headers: { "Prefer": "return=representation" }, body: JSON.stringify({ p_senha: senha })
        });
      } catch (e) {
        online = false;
        return LS.ler("provas_locais", []).map(p => ({
          turma: p.turma, aberta: p.aberta, tempo_extra: p.tempo_extra || 0,
          tentativas: 0, created_at: p.criado_em || null
        }));
      }
    },

    async listarTentativas(senha, turma) {
      try {
        return await req("rpc/listar_tentativas", {
          method: "POST", headers: { "Prefer": "return=representation" }, body: JSON.stringify({ p_senha: senha, p_turma: turma })
        });
      } catch (e) {
        online = false;
        return LS.ler("avaliacoes_local", [])
          .filter(a => a.turma === turma)
          .map(a => ({ id: null, aluno: a.aluno, status: "concluida", tempo_extra: 0,
                       criado_em: a.criado_em, concluido_em: a.criado_em, infracoes: 0 }));
      }
    },

    async listarAlunosExtra(senha, turma) {
      try {
        return await req("rpc/listar_alunos_extra", {
          method: "POST", headers: { "Prefer": "return=representation" }, body: JSON.stringify({ p_senha: senha, p_turma: turma })
        });
      } catch (e) {
        online = false;
        return LS.ler("alunos_extra_locais", []).filter(x => x.turma === turma);
      }
    },

    async listarInfracoes(senha, turma) {
      try {
        return await req("rpc/listar_infracoes", {
          method: "POST", headers: { "Prefer": "return=representation" }, body: JSON.stringify({ p_senha: senha, p_turma: turma })
        });
      } catch (e) {
        online = false;
        return LS.ler("infracoes_local", []).filter(i => i.turma === turma);
      }
    }
  };
})();
