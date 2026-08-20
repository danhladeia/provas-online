-- ============================================================
--  EXECUTE ESTE SCRIPT NO SQL EDITOR DO SUPABASE (uma vez só)
--  Projeto: lxdbepmakabpcsstlcqa
--  Sistema unificado de provas digitais (4 turmas)
--
--  PIN por TURMA (não por aluno): o professor define um PIN para
--  a turma e abre a prova; todos os alunos usam o mesmo PIN.
--  O PIN fica com bcrypt (pgcrypto); nada passa direto pelo
--  navegador — todas as operações são funções SECURITY DEFINER.
-- ============================================================

create extension if not exists pgcrypto;

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
values (1, crypt('L4deiahd93#', gen_salt('bf', 10)))
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
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.admin
    where id = 1 and senha_hash = crypt(p_senha, senha_hash)
  );
$$;

-- define/substitui o PIN da turma e abre a prova
create or replace function public.definir_pin(
  p_senha text, p_turma text, p_pin text, p_tempo_extra int default 0
) returns void language plpgsql security definer set search_path = public as $$
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
) returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.validar_admin(p_senha) then
    raise exception 'senha inválida';
  end if;
  update public.provas set aberta = p_aberta where turma = p_turma;
end $$;

-- tempo extra individual (PEI / laudo); 0 ou negativo remove
create or replace function public.set_tempo_extra_aluno(
  p_senha text, p_turma text, p_aluno text, p_tempo_extra int
) returns void language plpgsql security definer set search_path = public as $$
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
language plpgsql security definer set search_path = public as $$
declare
  v_prova     public.provas;
  v_tentativa public.tentativas;
  v_extra     int;
begin
  select * into v_prova
  from public.provas
  where turma = p_turma and pin_hash = crypt(p_pin, pin_hash);

  if v_prova.id is null then
    raise exception 'PIN inválido para esta turma';
  end if;
  if not v_prova.aberta then
    raise exception 'A prova ainda não foi aberta pelo professor';
  end if;

  select * into v_tentativa
  from public.tentativas
  where prova_id = v_prova.id and aluno = p_aluno;

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
) returns void language sql security definer set search_path = public as $$
  insert into public.infracoes (tentativa_id, tipo, segundos_fora)
  values (p_tentativa_id, p_tipo, coalesce(p_segundos_fora, 0));
$$;

-- ao terminar a prova
create or replace function public.concluir_prova(p_tentativa_id bigint)
returns void language sql security definer set search_path = public as $$
  update public.tentativas
  set status = 'concluida', concluido_em = now()
  where id = p_tentativa_id;
$$;

-- estado das provas de todas as turmas (sem expor o PIN)
create or replace function public.listar_provas(p_senha text)
returns table(turma text, aberta boolean, tempo_extra int, tentativas int, created_at timestamptz)
language sql security definer set search_path = public as $$
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
language sql security definer set search_path = public as $$
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
language sql security definer set search_path = public as $$
  select aluno, tempo_extra
  from public.alunos_extra
  where public.validar_admin(p_senha) and turma = p_turma
  order by aluno;
$$;

-- infrações por turma
create or replace function public.listar_infracoes(p_senha text, p_turma text)
returns table(id bigint, tentativa_id bigint, aluno text, turma text, tipo text,
              segundos_fora int, created_at timestamptz)
language sql security definer set search_path = public as $$
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