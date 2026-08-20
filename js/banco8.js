/* ============================================================
   BANCO DE QUESTÕES — 8º ANO (30 questões: 10 por nível)
   Tema: Brincadeiras e jogos tradicionais (patrimônio cultural)
         · Danças de salão
   Baseado no texto da atividade avaliativa do 2º trimestre.

   tipos: mc | vf | ordenar | ligar | classificar | lacuna
   ============================================================ */
const CATEGORIAS_8 = ["Exige correr muito", "Exige mais raciocínio", "Só funciona em equipe"];

BANCOS["8º ano"] = { categorias: CATEGORIAS_8, questoes: [
/* ---------------------------------------------------------- NÍVEL 1 */
{
  id:"8n1-01", nivel:1, tipo:"mc", sprite:"cronometro", leitura:15, decay:25,
  enunciado:"O que forma o patrimônio imaterial de um povo?",
  alternativas:[
    {t:"Saberes, festas, receitas, músicas e brincadeiras.", ok:true},
    {t:"Apenas prédios e monumentos.", ok:false},
    {t:"Somente documentos e livros antigos.", ok:false},
    {t:"Apenas objetos de museu.", ok:false}],
  explicacao:"O patrimônio imaterial é feito de saberes, festas, receitas, músicas e brincadeiras — o que se transmite de geração em geração."
},
{
  id:"8n1-02", nivel:1, tipo:"mc", sprite:"mascote_explica", leitura:14, decay:25,
  enunciado:"O que forma o patrimônio material?",
  alternativas:[
    {t:"Prédios, objetos e monumentos.", ok:true},
    {t:"Receitas e festas.", ok:false},
    {t:"Brincadeiras e danças.", ok:false},
    {t:"Saberes e músicas.", ok:false}],
  explicacao:"Patrimônio material: prédios, objetos e monumentos. Imaterial: saberes, festas, músicas e brincadeiras."
},
{
  id:"8n1-03", nivel:1, tipo:"mc", sprite:"estrela", leitura:14, decay:25,
  enunciado:"Por que brincadeiras como amarelinha e queimada não têm autor conhecido?",
  alternativas:[
    {t:"Porque foram passadas de criança para criança, geração após geração.", ok:true},
    {t:"Porque foram criadas por um único inventor.", ok:false},
    {t:"Porque foram registradas em cartório.", ok:false},
    {t:"Porque têm uma versão oficial.", ok:false}],
  explicacao:"Ninguém registrou essas brincadeiras: elas chegaram até nós porque uma criança ensinou a outra."
},
{
  id:"8n1-04", nivel:1, tipo:"mc", sprite:"lampada", leitura:15, decay:25,
  enunciado:"O que a amarelinha ensina, segundo o texto?",
  alternativas:[
    {t:"Esperar a vez e admitir quando pisou na linha, mesmo sem ninguém ver.", ok:true},
    {t:"Puxar mais forte sozinho.", ok:false},
    {t:"Correr mais rápido que todos.", ok:false},
    {t:"Inventar uma regra nova a cada rodada.", ok:false}],
  explicacao:"A amarelinha ensina a esperar a vez e a ser honesto — valores que se aprendem sem aula sobre eles."
},
{
  id:"8n1-05", nivel:1, tipo:"mc", sprite:"podio", leitura:14, decay:25,
  enunciado:"Onde nasceu o forró, segundo o texto?",
  alternativas:[
    {t:"No Nordeste brasileiro, com passos marcados e sanfona.", ok:true},
    {t:"Na Europa, com giros amplos.", ok:false},
    {t:"Na Argentina e no Uruguai.", ok:false},
    {t:"Nos Estados Unidos.", ok:false}],
  explicacao:"O forró nasceu no Nordeste brasileiro, com passos marcados e sanfona."
},
{
  id:"8n1-06", nivel:1, tipo:"vf", sprite:"prancheta", leitura:18, decay:30,
  enunciado:"Marque V para verdadeiro e F para falso:",
  afirmacoes:[
    {t:"A valsa veio da Europa e se organiza em giros amplos e postura ereta.", v:true},
    {t:"O tango é uma dança brasileira.", v:false},
    {t:"O samba de gafieira é uma criação brasileira cheia de gingado.", v:true}],
  explicacao:"O tango é argentino e uruguaio. A valsa é europeia. O samba de gafieira é brasileiro."
},
{
  id:"8n1-07", nivel:1, tipo:"mc", sprite:"estrela", leitura:14, decay:25,
  enunciado:"Nas danças de salão, o que é a condução?",
  alternativas:[
    {t:"Um dos dois indica para onde o par vai, e o outro responde.", ok:true},
    {t:"Uma forma de mandar no outro.", ok:false},
    {t:"A música que toca na pista.", ok:false},
    {t:"O lugar onde o par dança.", ok:false}],
  explicacao:"Condução é um convite feito com o corpo: um indica, o outro responde. Não é mandar."
},
{
  id:"8n1-08", nivel:1, tipo:"mc", sprite:"mascote_explica", leitura:15, decay:25,
  enunciado:"O que a dança em cadeira de rodas mostra?",
  alternativas:[
    {t:"Que a condução e o ritmo se adaptam: o que muda é o caminho do movimento.", ok:true},
    {t:"Que só dá para dançar em pé.", ok:false},
    {t:"Que pessoas com deficiência não podem dançar.", ok:false},
    {t:"Que a dança de salão exclui pessoas.", ok:false}],
  explicacao:"A dança de salão é um espaço de inclusão: o par pode ser de cadeira + pé, ou duas cadeiras."
},
{
  id:"8n1-09", nivel:1, tipo:"lacuna", sprite:"mascote_explica", leitura:16, decay:28,
  enunciado:"Complete a frase com as palavras do banco:",
  frase:"Brincadeiras como o cabo de guerra ensinam que a força de um {0} depende de puxar ao mesmo tempo, e não de puxar mais forte {1}.",
  banco:["grupo","sozinho","equipe","rápido"],
  respostas:["grupo","sozinho"],
  explicacao:"No cabo de guerra, o que vence é a coordenação do grupo: puxar juntos, no mesmo momento."
},
{
  id:"8n1-10", nivel:1, tipo:"mc", sprite:"lampada", leitura:14, decay:25,
  enunciado:"Qual dessas é uma brincadeira tradicional citada no texto?",
  alternativas:[
    {t:"Queimada.", ok:true},
    {t:"Minecraft.", ok:false},
    {t:"Free fire.", ok:false},
    {t:"Xadrez eletrônico.", ok:false}],
  explicacao:"Rouba-bandeira, pega-pega, queimada, amarelinha, cabo de guerra, dama e xadrez são brincadeiras tradicionais."
},

/* ---------------------------------------------------------- NÍVEL 2 */
{
  id:"8n2-01", nivel:2, tipo:"mc", sprite:"mascote_pensa", leitura:28, decay:40,
  texto:"O texto diz que “conduzir não é mandar” na dança de salão.",
  enunciado:"O que acontece quando um dos dois força o movimento?",
  alternativas:[
    {t:"A dança trava, porque a condução exige escuta e resposta.", ok:true},
    {t:"A dança fica mais bonita.", ok:false},
    {t:"O par dança mais rápido.", ok:false},
    {t:"Nada muda na dança.", ok:false}],
  explicacao:"Conduzir é um convite feito com o corpo; se um dos dois força, a dança trava."
},
{
  id:"8n2-02", nivel:2, tipo:"mc", sprite:"lampada", leitura:28, decay:40,
  enunciado:"Quais fatores afastaram as crianças das brincadeiras de rua?",
  alternativas:[
    {t:"Telas, falta de espaços seguros, mudanças na moradia e rotina cheia.", ok:true},
    {t:"Somente o trânsito.", ok:false},
    {t:"Apenas a vontade das crianças.", ok:false},
    {t:"Nenhum fator: as crianças continuam brincando na rua como antes.", ok:false}],
  explicacao:"Nenhum fator age sozinho: telas, falta de espaços seguros, moradia e rotina se somam."
},
{
  id:"8n2-03", nivel:2, tipo:"mc", sprite:"mascote_explica", leitura:26, decay:40,
  enunciado:"Por que o taco também é chamado de bets ou bete?",
  alternativas:[
    {t:"Porque as brincadeiras mudam de nome conforme a região — variação não é erro.", ok:true},
    {t:"Porque foi criado com vários nomes de uma vez.", ok:false},
    {t:"Porque o nome oficial é bets.", ok:false},
    {t:"Porque cada criança inventa um nome.", ok:false}],
  explicacao:"A variação de nome e regra mostra que a brincadeira está viva, sendo recriada por quem brinca."
},
{
  id:"8n2-04", nivel:2, tipo:"classificar", leitura:32, decay:45,
  enunciado:"Arraste cada brincadeira para a coluna que melhor combina:",
  categorias:CATEGORIAS_8,
  itens:[
    {t:"Pega-pega",     cat:"Exige correr muito"},
    {t:"Dama",          cat:"Exige mais raciocínio"},
    {t:"Cabo de guerra",cat:"Só funciona em equipe"},
    {t:"Queimada",      cat:"Exige correr muito"},
    {t:"Xadrez",        cat:"Exige mais raciocínio"},
    {t:"Amarelinha",    cat:"Exige correr muito"}],
  explicacao:"Uma brincadeira pode caber em mais de uma coluna — o importante é justificar a escolha."
},
{
  id:"8n2-05", nivel:2, tipo:"ligar", leitura:28, decay:40,
  enunciado:"Ligue cada dança de salão à sua origem:",
  pares:[
    {a:"Forró", sprite:"Provas 7 a 9/assets/recortes/8ano/salao-01-forro.png", b:"Nordeste brasileiro"},
    {a:"Valsa", sprite:"Provas 7 a 9/assets/recortes/8ano/salao-03-valsa.png", b:"Europa"},
    {a:"Tango", sprite:"alvo", b:"Argentina e Uruguai"},
    {a:"Samba de gafieira", sprite:"Provas 7 a 9/assets/recortes/8ano/salao-02-samba-gafieira.png", b:"Brasil"}],
  explicacao:"Cada dança traz a sua história: forró nordestino, valsa europeia, tango rio-platense e samba de gafieira brasileiro."
},
{
  id:"8n2-06", nivel:2, tipo:"vf", sprite:"prancheta", leitura:30, decay:45,
  enunciado:"Marque V para verdadeiro e F para falso:",
  afirmacoes:[
    {t:"“Dançar é um dom” é um dos estereótipos que afastam as pessoas da dança de salão.", v:true},
    {t:"Dançar é uma habilidade que só nasce com a pessoa.", v:false},
    {t:"O salão comporta corpos de todas as idades, pesos e alturas.", v:true},
    {t:"A dança de salão é sempre competitiva e exclui quem erra.", v:false}],
  explicacao:"Dançar é habilidade aprendida, como andar de bicicleta — e o salão acolhe corpos variados."
},
{
  id:"8n2-07", nivel:2, tipo:"ordenar", sprite:"cronometro", leitura:25, decay:40,
  enunciado:"Coloque na ordem o caminho pelo qual as brincadeiras tradicionais chegam até nós:",
  itens:[
    {t:"Uma criança aprende a brincadeira", ordem:1},
    {t:"Ela ensina outra criança", ordem:2},
    {t:"A brincadeira passa de geração em geração", ordem:3},
    {t:"Chega até nós, mudando de nome e regra pelo caminho", ordem:4}],
  explicacao:"O caminho é simples e frágil: uma criança ensina a outra — basta uma geração parar para o elo se romper."
},
{
  id:"8n2-08", nivel:2, tipo:"mc", sprite:"mascote_pensa", leitura:28, decay:40,
  texto:"O texto afirma: “a tela preenche um tempo que, em muitos casos, já não tinha para onde ir — porque a rua deixou de ser um lugar possível”.",
  enunciado:"O que essa frase quer dizer?",
  alternativas:[
    {t:"A tela ocupa um tempo que antes ficaria vazio, porque a rua perdeu espaço como lugar de brincar.", ok:true},
    {t:"A tela é a única culpada pelo fim das brincadeiras de rua.", ok:false},
    {t:"As crianças não querem mais brincar na rua por vontade própria.", ok:false},
    {t:"A rua continua sendo um lugar seguro para brincar.", ok:false}],
  explicacao:"Entender a cadeia — rua que deixou de ser possível + tela que ocupa o tempo — é diferente de apontar um culpado."
},
{
  id:"8n2-09", nivel:2, tipo:"lacuna", sprite:"mascote_explica", leitura:28, decay:40,
  enunciado:"Complete a frase sobre as danças de salão:",
  frase:"A dança de salão é sempre citada como escola de {0}: ela não funciona sem {1}.",
  banco:["convivência","escuta","equilíbrio","companhia"],
  respostas:["convivência","escuta"],
  explicacao:"Sem escuta entre o par, a condução não acontece — por isso ela ensina a conviver."
},
{
  id:"8n2-10", nivel:2, tipo:"mc", sprite:"estrela", leitura:26, decay:40,
  enunciado:"O que o texto diz sobre a variação de regras das brincadeiras?",
  alternativas:[
    {t:"É sinal de que a brincadeira está viva, sendo recriada por quem brinca.", ok:true},
    {t:"É um erro que deve ser corrigido.", ok:false},
    {t:"Mostra que as pessoas esqueceram as regras.", ok:false},
    {t:"Só acontece no Brasil.", ok:false}],
  explicacao:"Queimada tem dezenas de variações e a amarelinha muda de desenho — isso é vida, não bagunça."
},

/* ---------------------------------------------------------- NÍVEL 3 */
{
  id:"8n3-01", nivel:3, tipo:"mc", sprite:"mascote_pensa", leitura:45, decay:55,
  texto:"O texto diz que o caminho das brincadeiras é “simples e frágil”.",
  enunciado:"Por que esse caminho é frágil?",
  alternativas:[
    {t:"Basta uma geração deixar de brincar para o elo se romper.", ok:true},
    {t:"Porque as brincadeiras dependem de material caro.", ok:false},
    {t:"Porque as regras mudam com o tempo.", ok:false},
    {t:"Porque ninguém gosta de brincar.", ok:false}],
  explicacao:"Como não há registro oficial, a transmissão depende de uma criança ensinar a outra — se uma geração para, o elo se rompe."
},
{
  id:"8n3-02", nivel:3, tipo:"mc", sprite:"mascote_explica", leitura:45, decay:55,
  texto:"O texto lista estereótipos: “dançar é um dom”; “homem que dança é motivo de piada”; “só dança bem quem tem determinado tipo de corpo”.",
  enunciado:"Por que nenhum desses estereótipos se sustenta?",
  alternativas:[
    {t:"Dançar é habilidade aprendida e o salão acolhe corpos variados.", ok:true},
    {t:"Porque todo mundo já nasce dançando.", ok:false},
    {t:"Porque só quem tem corpo de atleta dança.", ok:false},
    {t:"Porque a dança de salão é só para homens.", ok:false}],
  explicacao:"Dançar é como andar de bicicleta: leva tempo, erra-se no começo e melhora com prática."
},
{
  id:"8n3-03", nivel:3, tipo:"mc", sprite:"podio", leitura:45, decay:55,
  texto:"A dança em cadeira de rodas é praticada em competições no Brasil e no mundo.",
  enunciado:"O que muda e o que permanece nessa dança?",
  alternativas:[
    {t:"Muda o caminho do movimento; permanece o sentido de dançar junto.", ok:true},
    {t:"Muda tudo: deixa de ser dança de salão.", ok:false},
    {t:"Muda o ritmo; permanece o preconceito.", ok:false},
    {t:"Não muda nada e nem é possível adaptar.", ok:false}],
  explicacao:"O par pode ser cadeira + pé ou duas cadeiras: muda o caminho do movimento, não o sentido de dançar junto."
},
{
  id:"8n3-04", nivel:3, tipo:"mc", sprite:"mascote_pensa", leitura:45, decay:55,
  texto:"O texto conclui: brincadeiras tradicionais e danças de salão “têm o mesmo funcionamento”.",
  enunciado:"Qual é a semelhança apontada entre elas?",
  alternativas:[
    {t:"As duas se aprendem com outra pessoa, mudam conforme a região e somem se uma geração parar.", ok:true},
    {t:"As duas dependem de internet.", ok:false},
    {t:"As duas são práticas competitivas de alto rendimento.", ok:false},
    {t:"As duas foram criadas por um inventor único.", ok:false}],
  explicacao:"Ambas se transmitem de pessoa para pessoa, variam pela região e dependem de novas gerações para continuar vivas."
},
{
  id:"8n3-05", nivel:3, tipo:"classificar", leitura:50, decay:60,
  enunciado:"Desafio final: arraste os OITO itens para a coluna que melhor combina.",
  categorias:CATEGORIAS_8,
  itens:[
    {t:"Pega-pega",     cat:"Exige correr muito"},
    {t:"Dama",          cat:"Exige mais raciocínio"},
    {t:"Cabo de guerra",cat:"Só funciona em equipe"},
    {t:"Queimada",      cat:"Exige correr muito"},
    {t:"Xadrez",        cat:"Exige mais raciocínio"},
    {t:"Rouba-bandeira",cat:"Exige correr muito"},
    {t:"Amarelinha",    cat:"Exige mais raciocínio"},
    {t:"Jogo da velha", cat:"Exige mais raciocínio"}],
  explicacao:"Lembre da regra principal de cada uma: o que ela exige para existir?"
},
{
  id:"8n3-06", nivel:3, tipo:"vf", sprite:"mascote_pensa", leitura:45, decay:55,
  enunciado:"Cuidado com as pegadinhas! Marque V ou F:",
  afirmacoes:[
    {t:"Todo patrimônio é feito de pedra.", v:false},
    {t:"A queimada tem dezenas de variações de regras.", v:true},
    {t:"A falta de espaços seguros é um dos motivos da queda das brincadeiras de rua.", v:true},
    {t:"Na dança de salão, a condução é uma forma de mandar.", v:false}],
  explicacao:"Há patrimônio material e imaterial; conduzir não é mandar — é convidar com o corpo."
},
{
  id:"8n3-07", nivel:3, tipo:"ordenar", sprite:"cronometro", leitura:40, decay:55,
  enunciado:"Coloque na ordem o que acontece na condução de uma dança de salão:",
  itens:[
    {t:"Um dos dois indica o movimento com o corpo", ordem:1},
    {t:"A leve pressão na mão ou nas costas sugere o passo", ordem:2},
    {t:"O outro escuta e responde", ordem:3},
    {t:"O par completa o passo junto", ordem:4}],
  explicacao:"Condução é escuta: um convida, o outro responde e o par completa o movimento."
},
{
  id:"8n3-08", nivel:3, tipo:"mc", sprite:"mascote_erro", leitura:45, decay:55,
  texto:"Parte dos adultos passou a enxergar o brincar como perda de tempo, menos importante do que estudar.",
  enunciado:"Qual visão o texto propõe em contraponto?",
  alternativas:[
    {t:"Brincar é patrimônio cultural e transmite valores que nenhuma aula explica.", ok:true},
    {t:"Brincar deve ser abandonado na adolescência.", ok:false},
    {t:"Só estudar forma uma pessoa completa.", ok:false},
    {t:"Brincadeiras são apenas para as férias.", ok:false}],
  explicacao:"Ao brincar se aprende cooperação, respeito às regras, honestidade e paciência — patrimônio que se transmite."
},
{
  id:"8n3-09", nivel:3, tipo:"lacuna", sprite:"mascote_explica", leitura:42, decay:55,
  enunciado:"Complete o resumo sobre o patrimônio:",
  frase:"O patrimônio {0} é formado por prédios e monumentos. O patrimônio {1} é formado por saberes, festas e {2}.",
  banco:["material","imaterial","brincadeiras","oficial","escolar"],
  respostas:["material","imaterial","brincadeiras"],
  explicacao:"Material: prédios e objetos. Imaterial: saberes, festas, músicas e brincadeiras."
},
{
  id:"8n3-10", nivel:3, tipo:"mc", sprite:"lampada", leitura:45, decay:55,
  texto:"O texto diz que o bolero é “lento e próximo”, enquanto a valsa tem “giros amplos e postura ereta”.",
  enunciado:"O que essas diferenças mostram sobre as danças de salão?",
  alternativas:[
    {t:"Cada dança tem seus gestos, sua distância e sua musicalidade próprias.", ok:true},
    {t:"Todas as danças de salão são iguais.", ok:false},
    {t:"Só o ritmo importa, os gestos não.", ok:false},
    {t:"As danças de salão não variam entre si.", ok:false}],
  explicacao:"Forró, valsa, tango, bolero e samba de gafieira: cada um com sua história, seus gestos e sua musicalidade."
}
]};