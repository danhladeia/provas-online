-- ============================================================
--  EXECUTE ESTE SCRIPT NO SQL EDITOR DO SUPABASE (uma vez só)
--  Projeto: kqjzupqutwvysrcqcuog
--  Sistema unificado de provas digitais (4 turmas)
--
--  PIN por TURMA (não por aluno): o professor define um PIN para
--  a turma e abre a prova; todos os alunos usam o mesmo PIN.
--  O PIN fica com bcrypt (pgcrypto); nada passa direto pelo
--  navegador — todas as operações são funções SECURITY DEFINER.
-- ============================================================

create extension if not exists pgcrypto schema extensions;

-- ------------------------------------------------------------
-- 1) Sorteios: quais questões cada aluno recebeu (anti-repetição)
-- ------------------------------------------------------------
create table if not exists public.sorteios (
  id         bigserial primary key,
  aluno      text not null,
  turma      text not null,
  questoes   text[] not null,
  criado_em  timestamptz not null default now()
);
create index if not exists sorteios_turma_idx on public.sorteios (turma);

-- ------------------------------------------------------------
-- 2) Avaliações: resultado final de cada aluno
-- ------------------------------------------------------------
create table if not exists public.avaliacoes (
  id            bigserial primary key,
  aluno         text not null,
  turma         text not null,
  nota          numeric(4,2) not null,
  acertos       numeric(5,2) not null,
  total         int not null,
  tempo_total   int not null,          -- segundos
  detalhes      jsonb not null,        -- resposta questão a questão
  criado_em     timestamptz not null default now()
);
create index if not exists avaliacoes_turma_idx on public.avaliacoes (turma);

-- ------------------------------------------------------------
-- 3) Prova por TURMA: um PIN para a turma inteira
--    aberta = o professor liberou o início (abrir/fechar)
-- ------------------------------------------------------------
create table if not exists public.provas (
  id          bigserial primary key,
  turma       text unique not null,
  pin_hash    text not null,           -- bcrypt do PIN da turma
  aberta      boolean not null default false,
  tempo_extra int not null default 0,  -- tempo extra padrão da turma (segundos)
  created_at  timestamptz not null default now()
);

-- tentativas: um registro por aluno que entrou com o PIN da turma
create table if not exists public.tentativas (
  id           bigserial primary key,
  prova_id     bigint not null references public.provas(id) on delete cascade,
  aluno        text not null,
  status       text not null default 'ativa',   -- ativa | concluida
  criado_em    timestamptz not null default now(),
  concluido_em timestamptz,
  unique (prova_id, aluno)
);
create index if not exists tentativas_prova_idx on public.tentativas (prova_id);

-- tempo extra por aluno (PEI / laudo) — soma-se ao padrão da turma
create table if not exists public.alunos_extra (
  id          bigserial primary key,
  turma       text not null,
  aluno       text not null,
  tempo_extra int not null default 0,
  unique (turma, aluno)
);

-- infrações: saídas de tela / trocas de aba durante a tentativa
create table if not exists public.infracoes (
  id            bigserial primary key,
  tentativa_id  bigint not null references public.tentativas(id) on delete cascade,
  tipo          text not null,
  segundos_fora int not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists infracoes_tentativa_idx on public.infracoes (tentativa_id);

-- ------------------------------------------------------------
-- 4) Credencial do professor (hash em vez de senha em texto)
-- ------------------------------------------------------------
create table if not exists public.admin (
  id         int primary key default 1 check (id = 1),
  senha_hash text not null
);
insert into public.admin (id, senha_hash)
values (1, extensions.crypt('L4deiahd93#', extensions.gen_salt('bf', 10)))
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 5) RLS: navegador só lê/insere sorteios e avaliacoes.
--    provas, tentativas, alunos_extra, infracoes e admin
--    ficam SEM políticas — só as funções os acessam.
-- ------------------------------------------------------------
alter table public.sorteios     enable row level security;
alter table public.avaliacoes   enable row level security;
alter table public.provas       enable row level security;
alter table public.tentativas   enable row level security;
alter table public.alunos_extra enable row level security;
alter table public.infracoes    enable row level security;
alter table public.admin        enable row level security;

drop policy if exists sorteios_insert on public.sorteios;
drop policy if exists sorteios_select on public.sorteios;
drop policy if exists avaliacoes_insert on public.avaliacoes;
drop policy if exists avaliacoes_select on public.avaliacoes;

create policy sorteios_insert   on public.sorteios   for insert to anon with check (true);
create policy sorteios_select   on public.sorteios   for select to anon using (true);
create policy avaliacoes_insert on public.avaliacoes for insert to anon with check (true);
create policy avaliacoes_select on public.avaliacoes for select to anon using (true);

-- ------------------------------------------------------------
-- 6) Funções SECURITY DEFINER (validam a senha no banco)
--    Permissões ficam no FINAL do script, depois das funções
--    existirem (revoke/grant em função inexistente quebra o SQL).
-- ------------------------------------------------------------

-- confere a senha do professor
create or replace function public.validar_admin(p_senha text)
returns boolean language sql security definer set search_path = public, extensions as $$
  select exists (
    select 1 from public.admin
    where id = 1 and senha_hash = crypt(p_senha, senha_hash)
  );
$$;

-- define/substitui o PIN da turma e abre a prova
create or replace function public.definir_pin(
  p_senha text, p_turma text, p_pin text, p_tempo_extra int default 0
) returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.validar_admin(p_senha) then
    raise exception 'senha inválida';
  end if;
  if length(coalesce(p_pin, '')) < 4 then
    raise exception 'PIN muito curto';
  end if;
  insert into public.provas (turma, pin_hash, aberta, tempo_extra)
  values (p_turma, crypt(p_pin, gen_salt('bf', 10)), true, coalesce(p_tempo_extra, 0))
  on conflict (turma) do update set
    pin_hash  = crypt(p_pin, gen_salt('bf', 10)),
    aberta    = true,
    tempo_extra = coalesce(p_tempo_extra, 0);
end $$;

-- abre ou fecha a prova da turma (alunos não entram enquanto fechada)
create or replace function public.set_prova_aberta(
  p_senha text, p_turma text, p_aberta boolean
) returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.validar_admin(p_senha) then
    raise exception 'senha inválida';
  end if;
  update public.provas set aberta = p_aberta where turma = p_turma;
end $$;

-- tempo extra individual (PEI / laudo); 0 ou negativo remove
create or replace function public.set_tempo_extra_aluno(
  p_senha text, p_turma text, p_aluno text, p_tempo_extra int
) returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.validar_admin(p_senha) then
    raise exception 'senha inválida';
  end if;
  if coalesce(p_tempo_extra, 0) <= 0 then
    delete from public.alunos_extra where turma = p_turma and aluno = p_aluno;
  else
    insert into public.alunos_extra (turma, aluno, tempo_extra)
    values (p_turma, p_aluno, p_tempo_extra)
    on conflict (turma, aluno) do update set tempo_extra = p_tempo_extra;
  end if;
end $$;

-- aluno digita o PIN da turma -> cria/retoma a tentativa dele
create or replace function public.validar_pin(p_pin text, p_turma text, p_aluno text)
returns table(tentativa_id bigint, prova_id bigint, aluno text, turma text, tempo_extra int)
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_prova     public.provas;
  v_tentativa public.tentativas;
  v_extra     int;
begin
  select * into v_prova
  from public.provas pr
  where pr.turma = p_turma and pr.pin_hash = crypt(p_pin, pr.pin_hash);

  if v_prova.id is null then
    raise exception 'PIN inválido para esta turma';
  end if;
  if not v_prova.aberta then
    raise exception 'A prova ainda não foi aberta pelo professor';
  end if;

  select * into v_tentativa
  from public.tentativas t
  where t.prova_id = v_prova.id and t.aluno = p_aluno;

  if v_tentativa.id is not null and v_tentativa.status = 'concluida' then
    raise exception 'Você já concluiu esta prova';
  end if;

  if v_tentativa.id is null then
    insert into public.tentativas (prova_id, aluno)
    values (v_prova.id, p_aluno)
    returning * into v_tentativa;
  end if;

  select coalesce(
    (select ae.tempo_extra from public.alunos_extra ae
     where ae.turma = p_turma and ae.aluno = p_aluno),
    v_prova.tempo_extra, 0) into v_extra;

  return query select v_tentativa.id, v_prova.id, p_aluno, p_turma, v_extra;
end $$;

-- registra saída de tela / troca de aba
create or replace function public.registrar_infracao(
  p_tentativa_id bigint, p_tipo text, p_segundos_fora int default 0
) returns void language sql security definer set search_path = public, extensions as $$
  insert into public.infracoes (tentativa_id, tipo, segundos_fora)
  values (p_tentativa_id, p_tipo, coalesce(p_segundos_fora, 0));
$$;

-- ao terminar a prova
create or replace function public.concluir_prova(p_tentativa_id bigint)
returns void language sql security definer set search_path = public, extensions as $$
  update public.tentativas
  set status = 'concluida', concluido_em = now()
  where id = p_tentativa_id;
$$;

-- estado das provas de todas as turmas (sem expor o PIN)
create or replace function public.listar_provas(p_senha text)
returns table(turma text, aberta boolean, tempo_extra int, tentativas int, created_at timestamptz)
language sql security definer set search_path = public, extensions as $$
  select p.turma, p.aberta, p.tempo_extra,
         (select count(*)::int from public.tentativas t where t.prova_id = p.id),
         p.created_at
  from public.provas p
  where public.validar_admin(p_senha)
  order by p.turma;
$$;

-- tentativas (alunos) de uma turma
create or replace function public.listar_tentativas(p_senha text, p_turma text)
returns table(id bigint, aluno text, status text, tempo_extra int, criado_em timestamptz,
              concluido_em timestamptz, infracoes int)
language sql security definer set search_path = public, extensions as $$
  select t.id, t.aluno, t.status,
         coalesce((select ae.tempo_extra from public.alunos_extra ae
                   where ae.turma = p_turma and ae.aluno = t.aluno), p.tempo_extra, 0),
         t.criado_em, t.concluido_em,
         (select count(*)::int from public.infracoes i where i.tentativa_id = t.id)
  from public.tentativas t
  join public.provas p on p.id = t.prova_id
  where public.validar_admin(p_senha) and p.turma = p_turma
  order by t.criado_em desc;
$$;

-- tempo extra por aluno de uma turma
create or replace function public.listar_alunos_extra(p_senha text, p_turma text)
returns table(aluno text, tempo_extra int)
language sql security definer set search_path = public, extensions as $$
  select aluno, tempo_extra
  from public.alunos_extra
  where public.validar_admin(p_senha) and turma = p_turma
  order by aluno;
$$;

-- infrações por turma
create or replace function public.listar_infracoes(p_senha text, p_turma text)
returns table(id bigint, tentativa_id bigint, aluno text, turma text, tipo text,
              segundos_fora int, created_at timestamptz)
language sql security definer set search_path = public, extensions as $$
  select i.id, i.tentativa_id, t.aluno, p.turma, i.tipo, i.segundos_fora, i.created_at
  from public.infracoes i
  join public.tentativas t on t.id = i.tentativa_id
  join public.provas p on p.id = t.prova_id
  where public.validar_admin(p_senha) and p.turma = p_turma
  order by i.created_at desc;
$$;

-- ------------------------------------------------------------
-- 7) Permissões (DEPOIS das funções existirem)
--    Só anon/authenticated podem chamar; o resto do public fica
--    sem acesso — o navegador nunca vê hashes nem tabelas internas.
-- ------------------------------------------------------------
revoke all on function public.validar_admin, public.definir_pin, public.set_prova_aberta,
  public.set_tempo_extra_aluno, public.validar_pin, public.registrar_infracao,
  public.concluir_prova, public.listar_provas, public.listar_tentativas,
  public.listar_alunos_extra, public.listar_infracoes from public;
grant execute on function public.validar_admin, public.definir_pin, public.set_prova_aberta,
  public.set_tempo_extra_aluno, public.validar_pin, public.registrar_infracao,
  public.concluir_prova, public.listar_provas, public.listar_tentativas,
  public.listar_alunos_extra, public.listar_infracoes to anon, authenticated;

-- ============================================================
-- 8) Acompanhamento ao vivo (Ensino Médio) — ajuste de tempo,
--    penalidade manual do professor e progresso em tempo real.
--    Migração: add_live_monitoring_and_manual_adjustments
-- ============================================================
alter table public.tentativas
  add column if not exists ajuste_tempo int not null default 0,
  add column if not exists penalidade_manual numeric(5,2) not null default 0,
  add column if not exists idx_atual int not null default 0,
  add column if not exists pontos_atual int not null default 0,
  add column if not exists total_questoes int not null default 0,
  add column if not exists ultima_atividade timestamptz not null default now();

-- aluno atualiza o próprio progresso periodicamente (sem senha; só grava na própria tentativa)
create or replace function public.atualizar_progresso(
  p_tentativa_id bigint, p_idx int, p_pontos int, p_total int
) returns void language sql security definer set search_path = public, extensions as $$
  update public.tentativas
  set idx_atual = p_idx, pontos_atual = p_pontos, total_questoes = p_total,
      ultima_atividade = now()
  where id = p_tentativa_id and status = 'ativa';
$$;

-- aluno consulta se o professor mexeu no tempo/penalidade da própria tentativa
create or replace function public.consultar_ajuste(p_tentativa_id bigint)
returns table(ajuste_tempo int, penalidade_manual numeric)
language sql security definer set search_path = public, extensions as $$
  select t.ajuste_tempo, t.penalidade_manual
  from public.tentativas t
  where t.id = p_tentativa_id;
$$;

-- professor soma/subtrai tempo (segundos, pode ser negativo) de uma tentativa em andamento
create or replace function public.ajustar_tempo_tentativa(
  p_senha text, p_tentativa_id bigint, p_delta_segundos int
) returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.validar_admin(p_senha) then
    raise exception 'senha inválida';
  end if;
  update public.tentativas
  set ajuste_tempo = ajuste_tempo + p_delta_segundos
  where id = p_tentativa_id;
end $$;

-- professor aplica/retira penalidade manual (pontos na escala 0-10) de uma tentativa
create or replace function public.aplicar_penalidade_tentativa(
  p_senha text, p_tentativa_id bigint, p_pontos numeric
) returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.validar_admin(p_senha) then
    raise exception 'senha inválida';
  end if;
  update public.tentativas
  set penalidade_manual = greatest(0, penalidade_manual + p_pontos)
  where id = p_tentativa_id;
end $$;

-- professor reinicia a tentativa de um aluno (apaga o registro para ele poder refazer)
create or replace function public.reiniciar_tentativa(
  p_senha text, p_tentativa_id bigint
) returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.validar_admin(p_senha) then
    raise exception 'senha inválida';
  end if;
  delete from public.tentativas where id = p_tentativa_id;
end $$;

-- tentativas ATIVAS de uma turma, para o painel "ao vivo" do professor
create or replace function public.listar_tentativas_ativas(p_senha text, p_turma text)
returns table(id bigint, aluno text, idx_atual int, total_questoes int, pontos_atual int,
              ajuste_tempo int, penalidade_manual numeric, criado_em timestamptz, ultima_atividade timestamptz)
language sql security definer set search_path = public, extensions as $$
  select t.id, t.aluno, t.idx_atual, t.total_questoes, t.pontos_atual,
         t.ajuste_tempo, t.penalidade_manual, t.criado_em, t.ultima_atividade
  from public.tentativas t
  join public.provas p on p.id = t.prova_id
  where public.validar_admin(p_senha) and p.turma = p_turma and t.status = 'ativa'
  order by t.ultima_atividade desc;
$$;

revoke all on function public.atualizar_progresso, public.consultar_ajuste,
  public.ajustar_tempo_tentativa, public.aplicar_penalidade_tentativa,
  public.reiniciar_tentativa, public.listar_tentativas_ativas from public;
grant execute on function public.atualizar_progresso, public.consultar_ajuste,
  public.ajustar_tempo_tentativa, public.aplicar_penalidade_tentativa,
  public.reiniciar_tentativa, public.listar_tentativas_ativas to anon, authenticated;

-- ============================================================
-- 9) Alunos por turma — PRIVADO. Este repositório é público no
--    GitHub, então os nomes dos alunos (dado pessoal de menor de
--    idade) NUNCA ficam no código-fonte. Eles moram só aqui, e só
--    saem via função que exige o PIN certo da turma (aluno) ou a
--    senha do professor (painel).
--
--    Depois de rodar este script, popule a tabela manualmente no
--    SQL Editor, por turma, por exemplo:
--
--    insert into public.alunos (turma, aluno) values
--      ('6º ano B', 'NOME DO ALUNO 1'),
--      ('6º ano B', 'NOME DO ALUNO 2')
--    on conflict (turma, aluno) do nothing;
-- ============================================================
create table if not exists public.alunos (
  id     bigserial primary key,
  turma  text not null,
  aluno  text not null,
  unique (turma, aluno)
);
create index if not exists alunos_turma_idx on public.alunos (turma);

alter table public.alunos enable row level security;
-- sem policies: só as funções abaixo (SECURITY DEFINER) leem esta tabela.

-- aluno: só vê os nomes da turma depois de acertar o PIN daquela turma
create or replace function public.listar_nomes_turma(p_pin text, p_turma text)
returns table(aluno text)
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_prova public.provas;
begin
  select * into v_prova from public.provas
  where turma = p_turma and pin_hash = crypt(p_pin, pin_hash);
  if v_prova.id is null then
    raise exception 'PIN inválido para esta turma';
  end if;
  if not v_prova.aberta then
    raise exception 'A prova ainda não foi aberta pelo professor';
  end if;
  return query select a.aluno from public.alunos a where a.turma = p_turma order by a.aluno;
end $$;

-- professor: lista de nomes da turma para o formulário de tempo extra individual
create or replace function public.listar_alunos_admin(p_senha text, p_turma text)
returns table(aluno text)
language sql security definer set search_path = public, extensions as $$
  select a.aluno from public.alunos a
  where public.validar_admin(p_senha) and a.turma = p_turma
  order by a.aluno;
$$;

revoke all on function public.listar_nomes_turma, public.listar_alunos_admin from public;
grant execute on function public.listar_nomes_turma, public.listar_alunos_admin to anon, authenticated;