/* ============================================================
   CONFIGURAÇÃO GERAL DA AVALIAÇÃO — sistema unificado
   Uma única página para as 4 turmas. O aluno seleciona a turma,
   o próprio nome na lista e digita o PIN da prova.
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
    url: "https://lxdbepmakabpcsstlcqa.supabase.co",
    key: "sb_publishable_irj05NAZHqNPY-JffHi0Mg_N7g1hcyO"
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
  ],

  /* ------------------------------------------------------------
     ALUNOS — listas por turma (extraídas dos relatórios).
     O aluno escolhe o próprio nome; não digita nada.
     ------------------------------------------------------------ */
  ALUNOS: {
    "6º ano B": [
      "ANDREIK BRITO AZEVEDO",
      "ANNA LAURA FAGUNDES RIBEIRO",
      "ARTHUR RIBEIRO REIS",
      "AYESSA GABRIELLE CARDOSO SOARES",
      "BERNARDO SANTOS GUIMARÃES",
      "DALISSON PEREIRA LOPES",
      "ISADORA PEREIRA ALVES",
      "JOÃO HENRIQUE SANTOS CARDOSO",
      "LAZARO EMANUEL ABREU TOLENTINO VASCONCELOS",
      "LUIZ HENRIQUE ALVES QUEIROZ",
      "LUIZ PHELIPY DE SOUZA GONÇALVES",
      "MARIA CLARA PEREIRA SANTOS",
      "MATHEUS ALVES BARBOSA",
      "SOFIA NEVES BATISTA",
      "THAYLA AYUMI COSTA CARDOSO"
    ],
    "7º ano": [
      "ADRYAN PEREIRA ROCHA",
      "ANA FRANCISCA OLIVEIRA SANTOS",
      "ARTHUR GONÇALVES PEREIRA",
      "CONRADO SOUZA BARBOSA",
      "GADIEL QUEIROZ NUNES",
      "ISMAEL CARLOS CARDOSO SANTOS",
      "KAYRON RUAN PEREIRA BRITO",
      "LAVINIA OLIVEIRA SILVA",
      "LEONARDO RAMOS DO NASCIMENTO",
      "MARIA ISABEL CARDOSO SANTOS",
      "MIGUEL ARTHUR AZEVEDO SILVA",
      "PALOMA CRISTINA DE BRITO AZEVEDO",
      "SARAH ELISA PEREIRA PRATES",
      "TAIS NEVES BARBOSA",
      "VITHOR EMANUEL RAMOS SANTOS"
    ],
    "8º ano": [
      "ANA JULIA MARTINS SANTOS",
      "ARTHUR PEREIRA ROCHA",
      "ARTUR MARTINS PEREIRA",
      "CARMEN ALVES SILVA",
      "CATARINA VELOSO MOTA",
      "CRISTIAN LUIZ CRISÓSTOMO AZEVEDO",
      "DAVI ASAFE ALVES QUEIROZ",
      "DAVI LUIZ SOARES BATISTA",
      "ESTEFANY CAROLINE ABREU TOLENTINO VASCONCELOS",
      "FABRICIO ARAUJO NEVES",
      "HEITOR FILIPE GOMES LOPES",
      "HEITOR SANTOS DE JESUS",
      "HENRIQUE GABRIEL FERREIRA ROCHA",
      "LAISA SOARES RODRIGUES",
      "LUIZA LOPES AZEVEDO",
      "MARIA ALICE ROCHA DIAS",
      "MARIA FERNANDA QUEIROZ SANTOS",
      "MATEUS ALVES DE JESUS",
      "PEDRO ANTONIO BASTOS ROSA",
      "VICTOR PEDRO MAGALHAES ROCHA",
      "WALIFI DAVI CARDOSO PEREIRA",
      "YANA FONSECA TORRES",
      "YASMIN QUEIROZ CARDOSO",
      "IAGO RENAN CAMPOS FERREIRA",
      "YURI GABRIEL DOS SANTOS RODRIGUES"
    ],
    "9º ano": [
      "ANA CLARA OLIVEIRA ALVES",
      "ANNA BEATRIZ NUNES CAUTELLA",
      "BRUNA THAIS ALVES SOARES",
      "CATARINA CARVALHO SANTOS",
      "CRISTIAN MIGUEL LOPES PEREIRA",
      "DAVID LOPES SANTOS",
      "HIGOR OLIVEIRA ROCHA",
      "JACKSON GABRIEL PEREIRA FONSECA",
      "JANNY CARDOSO BARBOSA",
      "JOÃO RIVELINO GONÇALVES BARBOSA",
      "JOSE MIGUEL RAMOS CARDOSO",
      "KAYANE BRITO PEREIRA",
      "LARISSA ÈLOA CARDOSO SANTOS",
      "LUCAS BARBOSA LEITE",
      "MARIA CECÍLIA OLIVEIRA SANTOS",
      "MATHEUS DUARTE OLIVEIRA",
      "MIGUEL ARAÚJO RIBEIRO OLIVEIRA",
      "PÂMELA FERREIRA BARBOSA",
      "POLIANE MARTINS PEREIRA",
      "SANZIO GONÇALVES COSTA",
      "THIAGO DUARTE OLIVEIRA",
      "YESSA JENNIFER SILVA CARDOSO"
    ]
  }
};

/* Registro de bancos de questões: turma -> { categorias, questoes }.
   Cada arquivo js/banco*.js adiciona a sua entrada aqui. */
const BANCOS = {};