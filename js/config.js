/* ============================================================
   CONFIGURAÇÃO GERAL DA AVALIAÇÃO — sistema unificado
   O aluno seleciona a turma, digita o PIN e só depois vê a lista
   de nomes (ela vem do Supabase, liberada pela função
   listar_nomes_turma só quando o PIN da turma está correto).

   Este arquivo fica em um repositório PÚBLICO no GitHub — por isso
   NENHUM nome de aluno (dado pessoal de menor de idade) fica aqui.
   Os nomes moram só na tabela public.alunos do Supabase.
   ============================================================ */
const CONFIG = {
  escola:    "Escola Jesuzinha",
  professor: "Danilo H. Ladeia",
  titulo:  "Avaliação 2º Trimestre",
  materia: "Educação Física",

  // A senha do professor NÃO fica aqui: o login é validado no banco
  // pela função SECURITY DEFINER validar_admin (hash bcrypt em supabase.sql).
  // Sem internet, a área do professor não abre — segurança em primeiro lugar.

  // tolerância (ms) antes de contar uma saída de tela
  toleranciaSaida: 700,

  supabase: {
    url: "https://kqjzupqutwvysrcqcuog.supabase.co",
    key: "sb_publishable_-fTpJykDg8e51iFTkRMdcw_KyAB3pWk"
  },

  /* ------------------------------------------------------------
     TURMAS — uma entrada por turma.
     id       : chave interna (o mesmo valor usado no banco)
     rotulo   : como aparece para o aluno
     tema     : título do tema da avaliação
     distribuicao / pesos / fatorMinimo / multiplicadorTempo:
               valem por turma (padrão igual ao do 6º ano)
     ------------------------------------------------------------ */
  TURMAS: [
    {
      id: "6º ano B", rotulo: "6º ano", nivel: "fundamental", materia: "Educação Física",
      tema: "Classificação dos Esportes — invasão, precisão, marca e técnico-combinatórios.",
      distribuicao: { 1: 4, 2: 3, 3: 3 },
      pesos: { 1: 1.0, 2: 1.2, 3: 1.5 },
      fatorMinimo: 0.4,
      multiplicadorTempo: 1.0,
      tempoTotal: 1500
    },
    {
      id: "7º ano", rotulo: "7º ano", nivel: "fundamental", materia: "Educação Física",
      tema: "Jogos eletrônicos e cultura corporal · Danças urbanas.",
      distribuicao: { 1: 4, 2: 3, 3: 3 },
      pesos: { 1: 1.0, 2: 1.2, 3: 1.5 },
      fatorMinimo: 0.4,
      multiplicadorTempo: 1.0,
      tempoTotal: 1500
    },
    {
      id: "8º ano", rotulo: "8º ano", nivel: "fundamental", materia: "Educação Física",
      tema: "Brincadeiras e jogos tradicionais (patrimônio cultural) · Danças de salão.",
      distribuicao: { 1: 4, 2: 3, 3: 3 },
      pesos: { 1: 1.0, 2: 1.2, 3: 1.5 },
      fatorMinimo: 0.4,
      multiplicadorTempo: 1.0,
      tempoTotal: 1500
    },
    {
      id: "9º ano", rotulo: "9º ano", nivel: "fundamental", materia: "Educação Física",
      tema: "Esportes de rede/parede, campo e taco, invasão e combate · Esporte e sociedade.",
      distribuicao: { 1: 4, 2: 3, 3: 3 },
      pesos: { 1: 1.0, 2: 1.2, 3: 1.5 },
      fatorMinimo: 0.4,
      multiplicadorTempo: 1.0,
      tempoTotal: 1500
    },
    {
      id: "1º Agro", rotulo: "1º Agronegócio", nivel: "medio", materia: "Cultura Digital e Fundamentos de IA",
      tema: "Uso ético da IA, mitos e verdades, Inteligência Humana x Artificial, arquitetura e aprendizado de máquina.",
      distribuicao: { 1: 6, 2: 10, 3: 4 },
      pesos: { 1: 1.0, 2: 1.2, 3: 1.5 },
      fatorMinimo: 0.4,
      multiplicadorTempo: 1.0,
      tempoTotal: 1800,
      penalidadeInfracao: 1
    },
    {
      id: "3º A", rotulo: "3º Ano A", nivel: "medio", materia: "Educação Digital",
      tema: "Uso ético da IA, mitos e verdades, Inteligência Humana x Artificial, arquitetura e aprendizado de máquina.",
      distribuicao: { 1: 6, 2: 10, 3: 4 },
      pesos: { 1: 1.0, 2: 1.2, 3: 1.5 },
      fatorMinimo: 0.4,
      multiplicadorTempo: 1.0,
      tempoTotal: 1800,
      penalidadeInfracao: 1
    }
  ]
};

/* Registro de bancos de questões: turma -> { categorias, questoes }.
   Cada arquivo js/banco*.js adiciona a sua entrada aqui. */
const BANCOS = {};