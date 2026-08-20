/* ============================================================
   BANCO DE QUESTÕES — 9º ANO (30 questões: 10 por nível)
   Tema: Esportes de rede/parede, campo e taco, invasão e combate
         · Esporte e sociedade
   Baseado no texto da atividade avaliativa do 2º trimestre.

   tipos: mc | vf | ordenar | ligar | classificar | lacuna
   ============================================================ */
const CATEGORIAS_9 = ["Rede e parede", "Campo e taco", "Invasão", "Combate"];

BANCOS["9º ano"] = { categorias: CATEGORIAS_9, questoes: [
/* ---------------------------------------------------------- NÍVEL 1 */
{
  id:"9n1-01", nivel:1, tipo:"mc", sprite:"cronometro", leitura:13, decay:25,
  enunciado:"Em quantas categorias a classificação dos esportes divide as modalidades?",
  alternativas:[
    {t:"Quatro.", ok:true},
    {t:"Duas.", ok:false},
    {t:"Cinco.", ok:false},
    {t:"Dez.", ok:false}],
  explicacao:"São quatro categorias: rede/parede, campo e taco, invasão e combate."
},
{
  id:"9n1-02", nivel:1, tipo:"mc", sprite:"Provas 7 a 9/assets/recortes/9ano/rede-01-voleibol.png", leitura:14, decay:25,
  enunciado:"O voleibol é um exemplo de esporte de:",
  alternativas:[
    {t:"Rede e parede.", ok:true},
    {t:"Campo e taco.", ok:false},
    {t:"Invasão.", ok:false},
    {t:"Combate.", ok:false}],
  explicacao:"No voleibol a bola é rebatida por cima de uma rede, sem contato físico com o adversário."
},
{
  id:"9n1-03", nivel:1, tipo:"mc", sprite:"Provas 7 a 9/assets/recortes/9ano/campo-01-beisebol.png", leitura:14, decay:25,
  enunciado:"O beisebol é um exemplo de esporte de:",
  alternativas:[
    {t:"Campo e taco.", ok:true},
    {t:"Rede e parede.", ok:false},
    {t:"Invasão.", ok:false},
    {t:"Combate.", ok:false}],
  explicacao:"No beisebol o rebatedor bate a bola com o taco e corre pelas bases."
},
{
  id:"9n1-04", nivel:1, tipo:"mc", sprite:"Provas 7 a 9/assets/recortes/9ano/invasao-01-futsal.png", leitura:14, decay:25,
  enunciado:"O futsal é um exemplo de esporte de:",
  alternativas:[
    {t:"Invasão.", ok:true},
    {t:"Rede e parede.", ok:false},
    {t:"Campo e taco.", ok:false},
    {t:"Combate.", ok:false}],
  explicacao:"No futsal as equipes invadem o campo adversário para levar a bola até o gol."
},
{
  id:"9n1-05", nivel:1, tipo:"mc", sprite:"Provas 7 a 9/assets/recortes/9ano/combate-01-judo.png", leitura:14, decay:25,
  enunciado:"O judô é um exemplo de esporte de:",
  alternativas:[
    {t:"Combate.", ok:true},
    {t:"Invasão.", ok:false},
    {t:"Rede e parede.", ok:false},
    {t:"Campo e taco.", ok:false}],
  explicacao:"No judô os atletas duelam com derrubadas, contatos e imobilizações."
},
{
  id:"9n1-06", nivel:1, tipo:"mc", sprite:"mascote_explica", leitura:15, decay:25,
  enunciado:"O que marca os esportes de rede e parede?",
  alternativas:[
    {t:"Rebater o objeto por cima da rede ou contra a parede, sem contato físico.", ok:true},
    {t:"Invadir o campo adversário.", ok:false},
    {t:"Lutar com o adversário.", ok:false},
    {t:"Correr pelas bases com um taco.", ok:false}],
  explicacao:"Rede e parede: o foco é rebater a bola, mantendo distância física do adversário."
},
{
  id:"9n1-07", nivel:1, tipo:"mc", sprite:"lampada", leitura:15, decay:25,
  enunciado:"Qual é o objetivo dos esportes de campo e taco?",
  alternativas:[
    {t:"Rebater a bola o mais longe possível e correr pelas bases.", ok:true},
    {t:"Impedir o contato entre os jogadores.", ok:false},
    {t:"Marcar pontos por cima da rede.", ok:false},
    {t:"Imobilizar o adversário no chão.", ok:false}],
  explicacao:"Campo e taco: bater a bola longe e correr pelas bases antes de ser eliminado."
},
{
  id:"9n1-08", nivel:1, tipo:"mc", sprite:"lampada", leitura:15, decay:25,
  enunciado:"Qual é o objetivo dos esportes de invasão?",
  alternativas:[
    {t:"Invadir o campo adversário para levar a bola até a meta.", ok:true},
    {t:"Rebater a bola por cima da rede.", ok:false},
    {t:"Bater a bola o mais longe possível.", ok:false},
    {t:"Derrubar o adversário no chão.", ok:false}],
  explicacao:"Invasão: ocupar o espaço do adversário e chegar com a bola (ou o objeto) à sua meta."
},
{
  id:"9n1-09", nivel:1, tipo:"vf", sprite:"prancheta", leitura:18, decay:30,
  enunciado:"Marque V para verdadeiro e F para falso:",
  afirmacoes:[
    {t:"No voleibol o contato físico com o adversário é proibido.", v:true},
    {t:"O beisebol usa uma rede para separar os jogadores.", v:false},
    {t:"O handebol é um esporte de invasão.", v:true}],
  explicacao:"Rede/parede evita o contato; beisebol não usa rede; handebol invade o campo adversário."
},
{
  id:"9n1-10", nivel:1, tipo:"mc", sprite:"mascote_explica", leitura:15, decay:25,
  enunciado:"O que caracteriza o judô dentro dos esportes de combate?",
  alternativas:[
    {t:"Derrubadas, contatos e imobilizações do adversário.", ok:true},
    {t:"Socos com as mãos.", ok:false},
    {t:"Chutes giratórios.", ok:false},
    {t:"Uso de uma espada.", ok:false}],
  explicacao:"O judô usa derrubadas, contato e imobilização; o boxe usa socos, o taekwondo usa chutes e a esgrima usa arma."
},

/* ---------------------------------------------------------- NÍVEL 2 */
{
  id:"9n2-01", nivel:2, tipo:"classificar", leitura:32, decay:45,
  enunciado:"Arraste cada esporte para a categoria correta:",
  categorias:CATEGORIAS_9,
  itens:[
    {t:"Voleibol",   sprite:"Provas 7 a 9/assets/recortes/9ano/rede-01-voleibol.png",  cat:"Rede e parede"},
    {t:"Tênis",      sprite:"Provas 7 a 9/assets/recortes/9ano/rede-02-tenis.png",     cat:"Rede e parede"},
    {t:"Beisebol",   sprite:"Provas 7 a 9/assets/recortes/9ano/campo-01-beisebol.png", cat:"Campo e taco"},
    {t:"Criquete",   sprite:"Provas 7 a 9/assets/recortes/9ano/campo-02-criquete.png", cat:"Campo e taco"},
    {t:"Futsal",     sprite:"Provas 7 a 9/assets/recortes/9ano/invasao-01-futsal.png", cat:"Invasão"},
    {t:"Handebol",   sprite:"Provas 7 a 9/assets/recortes/9ano/invasao-03-handebol.png",cat:"Invasão"},
    {t:"Judô",       sprite:"Provas 7 a 9/assets/recortes/9ano/combate-01-judo.png",   cat:"Combate"},
    {t:"Boxe",       sprite:"Provas 7 a 9/assets/recortes/9ano/combate-02-boxe.png",   cat:"Combate"}],
  explicacao:"Duas modalidades de cada categoria: rede/parede, campo e taco, invasão e combate."
},
{
  id:"9n2-02", nivel:2, tipo:"mc", sprite:"mascote_pensa", leitura:28, decay:40,
  texto:"Nos esportes de rede e parede, o contato físico entre os adversários é evitado.",
  enunciado:"Por que isso acontece?",
  alternativas:[
    {t:"Porque o jogo se organiza em torno de rebater o objeto, não de disputar espaço com o corpo.", ok:true},
    {t:"Porque é proibido usar qualquer objeto.", ok:false},
    {t:"Porque as equipes são pequenas demais.", ok:false},
    {t:"Porque a quadra é pequena.", ok:false}],
  explicacao:"A disputa é pelo objeto, não pelo espaço do corpo — por isso a rede ou a parede separa os jogadores."
},
{
  id:"9n2-03", nivel:2, tipo:"mc", sprite:"estrela", leitura:28, decay:40,
  enunciado:"Qual é a diferença entre o voleibol e o tênis, ambos de rede?",
  alternativas:[
    {t:"No voleibol a bola não pode tocar o chão; no tênis ela pode quicar uma vez.", ok:true},
    {t:"No tênis a rede é mais alta.", ok:false},
    {t:"No voleibol se usa raquete.", ok:false},
    {t:"Não há diferença entre eles.", ok:false}],
  explicacao:"Voleibol: bola não toca o chão. Tênis: a bola quica e se rebate com raquete."
},
{
  id:"9n2-04", nivel:2, tipo:"mc", sprite:"mascote_pensa", leitura:28, decay:40,
  texto:"Nos esportes de combate, o adversário é o centro do jogo.",
  enunciado:"O que o texto destaca sobre esses esportes?",
  alternativas:[
    {t:"Que o respeito ao adversário e às regras é essencial.", ok:true},
    {t:"Que vale tudo para vencer.", ok:false},
    {t:"Que o contato deve ser sempre violento.", ok:false},
    {t:"Que não há regras para o contato.", ok:false}],
  explicacao:"Combate não é violência: o respeito ao adversário e às regras é o que permite o duelo existir."
},
{
  id:"9n2-05", nivel:2, tipo:"ligar", leitura:28, decay:40,
  enunciado:"Ligue cada esporte à sua categoria:",
  pares:[
    {a:"Peteca",     sprite:"Provas 7 a 9/assets/recortes/9ano/rede-03-peteca.png",      b:"Rede e parede"},
    {a:"Taco (bets)",sprite:"Provas 7 a 9/assets/recortes/9ano/campo-03-taco-bets.png", b:"Campo e taco"},
    {a:"Basquete",   sprite:"Provas 7 a 9/assets/recortes/9ano/invasao-02-basquete.png",b:"Invasão"},
    {a:"Esgrima",    sprite:"Provas 7 a 9/assets/recortes/9ano/combate-03-esgrima.png", b:"Combate"}],
  explicacao:"Peteca é rede/parede; taco é campo e taco; basquete é invasão; esgrima é combate."
},
{
  id:"9n2-06", nivel:2, tipo:"vf", sprite:"prancheta", leitura:30, decay:45,
  enunciado:"Marque V para verdadeiro e F para falso:",
  afirmacoes:[
    {t:"O badminton é um esporte de rede e parede.", v:true},
    {t:"O futebol é um esporte de campo e taco.", v:false},
    {t:"O taekwondo se destaca pelo uso dos chutes.", v:true},
    {t:"O criquete é um esporte de combate.", v:false}],
  explicacao:"Badminton é rede/parede; futebol é invasão; taekwondo usa chutes; criquete é campo e taco."
},
{
  id:"9n2-07", nivel:2, tipo:"mc", sprite:"lampada", leitura:28, decay:40,
  enunciado:"O que o esporte pode promover na sociedade, segundo o texto?",
  alternativas:[
    {t:"Saúde, convivência e inclusão social.", ok:true},
    {t:"Apenas competição e violência.", ok:false},
    {t:"Somente lucro para as empresas.", ok:false},
    {t:"Isolamento das pessoas.", ok:false}],
  explicacao:"O esporte é um fenômeno social: promove saúde, convivência e inclusão quando bem praticado."
},
{
  id:"9n2-08", nivel:2, tipo:"mc", sprite:"mascote_explica", leitura:26, decay:40,
  enunciado:"Por que o handebol é classificado como esporte de invasão?",
  alternativas:[
    {t:"Porque as equipes invadem o campo adversário para levar a bola à meta.", ok:true},
    {t:"Porque usa um taco para bater na bola.", ok:false},
    {t:"Porque os jogadores ficam atrás de uma rede.", ok:false},
    {t:"Porque os atletas lutam no chão.", ok:false}],
  explicacao:"No handebol a equipe ataca o campo adversário com a bola na mão — característica da invasão."
},
{
  id:"9n2-09", nivel:2, tipo:"lacuna", sprite:"mascote_explica", leitura:28, decay:40,
  enunciado:"Complete a frase sobre a classificação dos esportes:",
  frase:"Os esportes de {0} e taco têm o objetivo de rebater a bola o mais {1} possível e correr pelas bases.",
  banco:["campo","longe","rede","rápido","alto"],
  respostas:["campo","longe"],
  explicacao:"Campo e taco: rebater longe e correr pelas bases antes de ser eliminado."
},
{
  id:"9n2-10", nivel:2, tipo:"mc", sprite:"estrela", leitura:26, decay:40,
  enunciado:"O que aproxima todas as quatro categorias de esportes?",
  alternativas:[
    {t:"Ter regras, objetivos e formas de marcar pontos.", ok:true},
    {t:"Usar uma rede para separar os jogadores.", ok:false},
    {t:"Exigir contato físico entre os adversários.", ok:false},
    {t:"Serem praticados apenas por equipes grandes.", ok:false}],
  explicacao:"Todas têm regras, objetivos e pontuação — a classificação ajuda a entender o que cada uma exige."
},

/* ---------------------------------------------------------- NÍVEL 3 */
{
  id:"9n3-01", nivel:3, tipo:"classificar", leitura:55, decay:60,
  enunciado:"Desafio final: arraste os DEZESSEIS esportes para a categoria correta.",
  categorias:CATEGORIAS_9,
  itens:[
    {t:"Voleibol",  sprite:"Provas 7 a 9/assets/recortes/9ano/rede-01-voleibol.png",  cat:"Rede e parede"},
    {t:"Tênis",     sprite:"Provas 7 a 9/assets/recortes/9ano/rede-02-tenis.png",     cat:"Rede e parede"},
    {t:"Peteca",    sprite:"Provas 7 a 9/assets/recortes/9ano/rede-03-peteca.png",    cat:"Rede e parede"},
    {t:"Badminton", sprite:"Provas 7 a 9/assets/recortes/9ano/rede-04-badminton.png", cat:"Rede e parede"},
    {t:"Beisebol",  sprite:"Provas 7 a 9/assets/recortes/9ano/campo-01-beisebol.png", cat:"Campo e taco"},
    {t:"Criquete",  sprite:"Provas 7 a 9/assets/recortes/9ano/campo-02-criquete.png", cat:"Campo e taco"},
    {t:"Taco (bets)",sprite:"Provas 7 a 9/assets/recortes/9ano/campo-03-taco-bets.png",cat:"Campo e taco"},
    {t:"Beisebol (diamante)", sprite:"Provas 7 a 9/assets/recortes/9ano/campo-04-diamante.png", cat:"Campo e taco"},
    {t:"Futsal",    sprite:"Provas 7 a 9/assets/recortes/9ano/invasao-01-futsal.png", cat:"Invasão"},
    {t:"Basquete",  sprite:"Provas 7 a 9/assets/recortes/9ano/invasao-02-basquete.png",cat:"Invasão"},
    {t:"Handebol",  sprite:"Provas 7 a 9/assets/recortes/9ano/invasao-03-handebol.png",cat:"Invasão"},
    {t:"Futebol",   sprite:"Provas 7 a 9/assets/recortes/9ano/invasao-04-futebol.png", cat:"Invasão"},
    {t:"Judô",      sprite:"Provas 7 a 9/assets/recortes/9ano/combate-01-judo.png",   cat:"Combate"},
    {t:"Boxe",      sprite:"Provas 7 a 9/assets/recortes/9ano/combate-02-boxe.png",   cat:"Combate"},
    {t:"Esgrima",   sprite:"Provas 7 a 9/assets/recortes/9ano/combate-03-esgrima.png", cat:"Combate"},
    {t:"Taekwondo", sprite:"Provas 7 a 9/assets/recortes/9ano/combate-04-taekwondo.png",cat:"Combate"}],
  explicacao:"Quatro categorias, quatro esportes cada: este é o mapa completo da classificação."
},
{
  id:"9n3-02", nivel:3, tipo:"mc", sprite:"mascote_pensa", leitura:45, decay:55,
  texto:"O texto diz que classificar não é “colocar cada esporte em uma caixinha e esquecer”.",
  enunciado:"O que isso significa?",
  alternativas:[
    {t:"A classificação ajuda a entender, mas cada esporte tem suas particularidades.", ok:true},
    {t:"A classificação é inútil.", ok:false},
    {t:"Cada esporte pertence a todas as categorias ao mesmo tempo.", ok:false},
    {t:"A classificação define tudo que um esporte é.", ok:false}],
  explicacao:"A classificação é uma ferramenta para entender o que cada esporte exige, não um rótulo que esgota o esporte."
},
{
  id:"9n3-03", nivel:3, tipo:"mc", sprite:"mascote_pensa", leitura:45, decay:55,
  texto:"O texto afirma que o esporte pode incluir pessoas com deficiência por meio de adaptações.",
  enunciado:"Qual é um exemplo de adaptação para inclusão no esporte?",
  alternativas:[
    {t:"Adaptar regras, materiais e espaços para diferentes possibilidades de movimento.", ok:true},
    {t:"Exigir o mesmo padrão de todos sem nenhuma mudança.", ok:false},
    {t:"Limitar a participação a um único perfil de atleta.", ok:false},
    {t:"Transformar o esporte em competição apenas de alto rendimento.", ok:false}],
  explicacao:"Inclusão é adaptar o jogo às pessoas, e não obrigar as pessoas a se adaptarem a um único padrão."
},
{
  id:"9n3-04", nivel:3, tipo:"ordenar", sprite:"cronometro", leitura:40, decay:55,
  enunciado:"Coloque na ordem uma jogada típica de um esporte de campo e taco:",
  itens:[
    {t:"O rebatedor golpeia a bola com o taco", ordem:1},
    {t:"A bola voa o mais longe possível", ordem:2},
    {t:"O rebatedor corre em direção às bases", ordem:3},
    {t:"Ele tenta chegar antes que a bola retorne", ordem:4}],
  explicacao:"Bater longe e correr pelas bases antes que a defesa recupere a bola: essa é a lógica do campo e taco."
},
{
  id:"9n3-05", nivel:3, tipo:"mc", sprite:"lampada", leitura:45, decay:55,
  texto:"O texto fala que o esporte é um fenômeno social que pode gerar valores, mas também pode ser palco de problemas.",
  enunciado:"Qual problema o texto associa ao mundo do esporte?",
  alternativas:[
    {t:"Doping e violência.", ok:true},
    {t:"Falta de regras.", ok:false},
    {t:"Ausência de competição.", ok:false},
    {t:"Pouca atenção da mídia.", ok:false}],
  explicacao:"O esporte gera saúde e convivência, mas também pode ser palco de doping e violência — a escolha é social."
},
{
  id:"9n3-06", nivel:3, tipo:"vf", sprite:"mascote_pensa", leitura:45, decay:55,
  enunciado:"Cuidado com as pegadinhas! Marque V ou F:",
  afirmacoes:[
    {t:"A esgrima é um esporte de combate que usa uma arma.", v:true},
    {t:"A peteca é um esporte de invasão.", v:false},
    {t:"No badminton se rebate uma peteca com raquete por cima da rede.", v:true},
    {t:"O objetivo dos esportes de combate é fazer gol na meta adversária.", v:false}],
  explicacao:"Esgrima usa arma; peteca e badminton são rede/parede; combate não tem meta de gol."
},
{
  id:"9n3-07", nivel:3, tipo:"mc", sprite:"mascote_explica", leitura:45, decay:55,
  texto:"Dentro dos esportes de combate, o taekwondo e o boxe têm diferenças claras.",
  enunciado:"Qual é a principal diferença entre eles?",
  alternativas:[
    {t:"O taekwondo prioriza os chutes; o boxe prioriza os socos.", ok:true},
    {t:"O taekwondo usa taco e o boxe usa rede.", ok:false},
    {t:"O boxe prioriza os chutes.", ok:false},
    {t:"Não há diferença entre eles.", ok:false}],
  explicacao:"Taekwondo: chutes giratórios e precisos. Boxe: socos com as mãos."
},
{
  id:"9n3-08", nivel:3, tipo:"mc", sprite:"mascote_pensa", leitura:45, decay:55,
  texto:"O texto explica que nos esportes de invasão, a disputa é pelo espaço.",
  enunciado:"O que caracteriza a disputa pelo espaço nesses esportes?",
  alternativas:[
    {t:"A equipe precisa ocupar o campo adversário para chegar à meta com o objeto.", ok:true},
    {t:"A equipe precisa manter o objeto no próprio campo.", ok:false},
    {t:"A equipe precisa rebater o objeto por cima de uma rede.", ok:false},
    {t:"A equipe precisa imobilizar o adversário.", ok:false}],
  explicacao:"Invasão: conquistar o espaço do adversário e chegar à meta é o que define a categoria."
},
{
  id:"9n3-09", nivel:3, tipo:"lacuna", sprite:"mascote_explica", leitura:42, decay:55,
  enunciado:"Complete o resumo da classificação:",
  frase:"Os esportes de {0} e parede rebatem um objeto separado por uma rede. Os de invasão disputam o {1} do adversário. Os de combate duelam com o {2}.",
  banco:["rede","espaço","adversário","taco","tempo"],
  respostas:["rede","espaço","adversário"],
  explicacao:"Rede/parede rebate o objeto; invasão disputa o espaço; combate duela com o adversário."
},
{
  id:"9n3-10", nivel:3, tipo:"mc", sprite:"mascote_erro", leitura:45, decay:55,
  texto:"O texto conclui que conhecer as categorias ajuda a “olhar para qualquer esporte e entender o que ele exige”.",
  enunciado:"Por que isso é útil para quem vai praticar?",
  alternativas:[
    {t:"Ajuda a escolher modalidades que combinam com o próprio corpo e gosto.", ok:true},
    {t:"Serve apenas para provas escritas.", ok:false},
    {t:"Substitui a prática do esporte.", ok:false},
    {t:"É útil somente para treinadores profissionais.", ok:false}],
  explicacao:"Entender o que cada categoria exige (rebater, correr, invadir ou duelar) ajuda a escolher onde praticar."
}
]};