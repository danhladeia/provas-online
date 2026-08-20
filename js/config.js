/* ============================================================
   CONFIGURAÇÃO GERAL DA AVALIAÇÃO — sistema unificado
   Uma única página para as 4 turmas. O aluno seleciona a turma
   e digita o próprio nome.

   Este arquivo fica em um repositório PÚBLICO no GitHub — por isso
   não guardamos aqui nenhuma lista com nomes de alunos (dado pessoal
   de menores). O aluno digita o nome na hora, e ele só fica salvo
   no próprio aparelho (localStorage), nunca no código-fonte.
   ============================================================ */
const CONFIG = {
  escola:    "Escola Jesuzinha",
  professor: "Danilo H. Ladeia",
  titulo:  "Avaliação 2º Trimestre",
  materia: "Educação Física",

  // Sem PIN e sem senha: o aluno escolhe a turma e o nome e já começa.
  // Tudo fica salvo no aparelho (localStorage), sem nuvem — o app funciona
  // como PWA instalável e 100% offline.

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
      id: "6º ano B", rotulo: "6º ano",
      tema: "Classificação dos Esportes — invasão, precisão, marca e técnico-combinatórios.",
      distribuicao: { 1: 4, 2: 3, 3: 3 },
      pesos: { 1: 1.0, 2: 1.2, 3: 1.5 },
      fatorMinimo: 0.4,
      multiplicadorTempo: 1.0,
      tempoTotal: 1500
    },
    {
      id: "7º ano", rotulo: "7º ano",
      tema: "Jogos eletrônicos e cultura corporal · Danças urbanas.",
      distribuicao: { 1: 4, 2: 3, 3: 3 },
      pesos: { 1: 1.0, 2: 1.2, 3: 1.5 },
      fatorMinimo: 0.4,
      multiplicadorTempo: 1.0,
      tempoTotal: 1500
    },
    {
      id: "8º ano", rotulo: "8º ano",
      tema: "Brincadeiras e jogos tradicionais (patrimônio cultural) · Danças de salão.",
      distribuicao: { 1: 4, 2: 3, 3: 3 },
      pesos: { 1: 1.0, 2: 1.2, 3: 1.5 },
      fatorMinimo: 0.4,
      multiplicadorTempo: 1.0,
      tempoTotal: 1500
    },
    {
      id: "9º ano", rotulo: "9º ano",
      tema: "Esportes de rede/parede, campo e taco, invasão e combate · Esporte e sociedade.",
      distribuicao: { 1: 4, 2: 3, 3: 3 },
      pesos: { 1: 1.0, 2: 1.2, 3: 1.5 },
      fatorMinimo: 0.4,
      multiplicadorTempo: 1.0,
      tempoTotal: 1500
    }
  ]
};

/* Registro de bancos de questões: turma -> { categorias, questoes }.
   Cada arquivo js/banco*.js adiciona a sua entrada aqui. */
const BANCOS = {};