/* ============================================================
   BANCO DE QUESTÕES — 30 questões (10 por nível)
   Tema: Classificação dos Esportes (invasão, precisão, marca,
   técnico-combinatórios)

   tipos: mc | vf | ordenar | ligar | classificar | lacuna
   leitura = tempo de ÁREA SALVA (ler sem perder nota), em segundos
   decay   = janela de queda da nota depois da área salva
   ============================================================ */
const CATEGORIAS = ["Invasão", "Precisão", "Marca", "Técnico-combinatório"];

const BANCO = [
/* ---------------------------------------------------------- NÍVEL 1 */
{
  id:"n1-01", nivel:1, tipo:"mc", sprite:"brasao_invasao", leitura:15, decay:25,
  enunciado:"Qual é o objetivo principal dos esportes de invasão?",
  alternativas:[
    {t:"Invadir o território adversário para pontuar e proteger o próprio campo.", ok:true},
    {t:"Acertar um alvo fixo sem interferência do adversário.", ok:false},
    {t:"Superar marcas de tempo, distância ou peso.", ok:false},
    {t:"Receber notas de uma banca de juízes.", ok:false}],
  explicacao:"Nos esportes de invasão as duas equipes atacam e defendem ao mesmo tempo: ataque ao campo adversário x defesa do próprio campo."
},
{
  id:"n1-02", nivel:1, tipo:"mc", sprite:"arco_flecha", leitura:12, decay:25,
  enunciado:"O arco e flecha faz parte de qual categoria?",
  alternativas:[
    {t:"Esportes de precisão", ok:true},
    {t:"Esportes de invasão", ok:false},
    {t:"Esportes de marca", ok:false},
    {t:"Esportes técnico-combinatórios", ok:false}],
  explicacao:"Precisão: o objetivo é acertar um alvo específico usando pontaria e controle do movimento."
},
{
  id:"n1-03", nivel:1, tipo:"mc", sprite:"cronometro", leitura:14, decay:25,
  enunciado:"Nos esportes de marca, como o resultado é medido?",
  alternativas:[
    {t:"Por marcas quantificáveis: tempo, distância ou peso.", ok:true},
    {t:"Pela quantidade de gols marcados.", ok:false},
    {t:"Pela beleza e pela dificuldade do movimento.", ok:false},
    {t:"Pela proximidade da bola em relação ao alvo.", ok:false}],
  explicacao:"Marca = número: quem foi mais rápido, foi mais longe ou mais alto, ou levantou mais peso."
},
{
  id:"n1-04", nivel:1, tipo:"mc", sprite:"ginastica_ritmica", leitura:14, decay:25,
  enunciado:"Nos esportes técnico-combinatórios, quem define o resultado?",
  alternativas:[
    {t:"Uma banca de juízes, que dá notas para a performance.", ok:true},
    {t:"O cronômetro, sempre.", ok:false},
    {t:"O placar de gols e cestas.", ok:false},
    {t:"A trena que mede a distância.", ok:false}],
  explicacao:"Os juízes avaliam a dificuldade técnica, a precisão da execução e a estética (beleza e ritmo)."
},
{
  id:"n1-05", nivel:1, tipo:"vf", sprite:"prancheta", leitura:18, decay:30,
  enunciado:"Marque V para verdadeiro e F para falso:",
  afirmacoes:[
    {t:"O futsal é um esporte de invasão.", v:true},
    {t:"A natação é um esporte de precisão.", v:false},
    {t:"O boliche é um esporte de precisão.", v:true}],
  explicacao:"A natação é de MARCA (vence quem faz o menor tempo). O futsal invade o campo adversário; o boliche mira nos pinos."
},
{
  id:"n1-06", nivel:1, tipo:"ligar", leitura:20, decay:30,
  enunciado:"Ligue cada esporte à sua categoria:",
  pares:[
    {a:"Futebol",             sprite:"bola_futebol",        b:"Invasão"},
    {a:"Boliche",             sprite:"boliche",             b:"Precisão"},
    {a:"Natação",             sprite:"natacao",             b:"Marca"},
    {a:"Ginástica artística", sprite:"ginastica_artistica", b:"Técnico-combinatório"}],
  explicacao:"Repare na lógica de cada um: invadir o campo, acertar o alvo, bater a marca, receber notas."
},
{
  id:"n1-07", nivel:1, tipo:"mc", sprite:"golfe", leitura:13, decay:25,
  enunciado:"Qual destes NÃO é um esporte de invasão?",
  alternativas:[
    {t:"Golfe", ok:true},
    {t:"Basquetebol", ok:false},
    {t:"Handebol", ok:false},
    {t:"Rugby", ok:false}],
  explicacao:"No golfe você joga a sua vez mirando um alvo (o buraco), sem invadir território — é precisão."
},
{
  id:"n1-08", nivel:1, tipo:"lacuna", sprite:"alvo", leitura:16, decay:28,
  enunciado:"Complete a frase com as palavras do banco:",
  frase:"Nos esportes de {0}, o objetivo é acertar um {1} usando pontaria e controle do movimento.",
  banco:["precisão","alvo","invasão","tempo"],
  respostas:["precisão","alvo"],
  explicacao:"Precisão + alvo: a lógica principal é a pontaria contra um alvo fixo ou móvel."
},
{
  id:"n1-09", nivel:1, tipo:"mc", sprite:"defensora_vermelha", leitura:15, decay:25,
  enunciado:"Numa partida de futebol, enquanto a equipe azul ataca, o que a equipe vermelha tenta fazer?",
  alternativas:[
    {t:"Proteger o próprio território e impedir a equipe azul de pontuar.", ok:true},
    {t:"Ganhar notas dos juízes pela beleza da defesa.", ok:false},
    {t:"Correr contra o cronômetro para bater um recorde.", ok:false},
    {t:"Acertar um alvo colocado no meio do campo.", ok:false}],
  explicacao:"É a dupla lógica da invasão: uma equipe ataca o campo adversário e a outra defende o seu."
},
{
  id:"n1-10", nivel:1, tipo:"mc", sprite:"halterofilismo", leitura:13, decay:25,
  enunciado:"O halterofilismo é um esporte de marca porque…",
  alternativas:[
    {t:"vence quem levanta a maior quantidade de peso.", ok:true},
    {t:"os juízes dão notas para a beleza do movimento.", ok:false},
    {t:"o atleta precisa invadir a área do adversário.", ok:false},
    {t:"o atleta precisa acertar um alvo à sua frente.", ok:false}],
  explicacao:"Peso é uma marca quantificável, assim como tempo e distância."
},

/* ---------------------------------------------------------- NÍVEL 2 */
{
  id:"n2-01", nivel:2, tipo:"mc", sprite:"handebol", leitura:30, decay:40,
  texto:"A turma jogou handebol. A equipe azul pegou a bola, avançou pela quadra e fez o gol. A equipe verde correu para trás para defender a sua área.",
  enunciado:"Esse jogo é de qual categoria?",
  alternativas:[
    {t:"Invasão — uma equipe ataca o campo da outra, que defende o seu.", ok:true},
    {t:"Precisão — porque a equipe azul mirou o gol.", ok:false},
    {t:"Marca — porque a equipe azul correu mais rápido.", ok:false},
    {t:"Técnico-combinatório — porque o gol foi bonito.", ok:false}],
  explicacao:"Mirar o gol e correr rápido acontecem no jogo, mas a ideia principal é invadir o campo do adversário para pontuar."
},
{
  id:"n2-02", nivel:2, tipo:"ordenar", sprite:"atacante_azul", leitura:25, decay:40,
  enunciado:"Coloque na ordem a sequência de uma jogada de ataque num esporte de invasão:",
  itens:[
    {t:"Recuperar a posse de bola", ordem:1},
    {t:"Progredir em direção ao campo adversário", ordem:2},
    {t:"Criar espaço livre com passes e movimentação", ordem:3},
    {t:"Finalizar para marcar o ponto", ordem:4}],
  explicacao:"Posse → progressão → criação de espaço → finalização: é o ciclo do ataque nos esportes de invasão."
},
{
  id:"n2-03", nivel:2, tipo:"classificar", leitura:30, decay:45,
  enunciado:"Arraste cada esporte para a sua categoria:",
  categorias:CATEGORIAS,
  itens:[
    {t:"Rugby",              sprite:"rugby",        cat:"Invasão"},
    {t:"Dardos",             sprite:"dardos",       cat:"Precisão"},
    {t:"Ciclismo",           sprite:"ciclismo",     cat:"Marca"},
    {t:"Patinação artística", sprite:"patinacao",   cat:"Técnico-combinatório"},
    {t:"Basquetebol",        sprite:"basquete",     cat:"Invasão"},
    {t:"Salto em altura",    sprite:"salto_altura", cat:"Marca"}],
  explicacao:"Pergunte sempre: invade o campo? mira um alvo? bate uma marca? recebe notas?"
},
{
  id:"n2-04", nivel:2, tipo:"mc", sprite:"mira_menino", leitura:26, decay:40,
  texto:"DICA: nos esportes de precisão você joga na sua vez, sem o adversário te atrapalhar. Toda a sua atenção fica no alvo.",
  enunciado:"Qual situação combina com a dica?",
  alternativas:[
    {t:"No boliche, um jogador lança a bola enquanto o outro espera a vez.", ok:true},
    {t:"O zagueiro dá o carrinho para tirar a bola do atacante.", ok:false},
    {t:"Dois nadadores disputam a prova lado a lado.", ok:false},
    {t:"O jogador de rugby derruba o adversário.", ok:false}],
  explicacao:"Na precisão o duelo é contra o alvo, e não corpo a corpo com o adversário."
},
{
  id:"n2-05", nivel:2, tipo:"ligar", leitura:28, decay:40,
  enunciado:"Ligue cada esporte à forma como o resultado é decidido:",
  pares:[
    {a:"Corrida de 100m",  sprite:"corrida",          b:"Menor tempo no cronômetro"},
    {a:"Bocha",            sprite:"bocha",            b:"Bola mais perto do alvo"},
    {a:"Futsal",           sprite:"futsal",           b:"Maior número de gols"},
    {a:"Salto ornamental", sprite:"salto_ornamental", b:"Maior nota dos juízes"}],
  explicacao:"Cada categoria tem o seu 'juiz': o cronômetro, o alvo, o placar ou a banca de notas."
},
{
  id:"n2-06", nivel:2, tipo:"vf", sprite:"juizes", leitura:30, decay:45,
  enunciado:"Marque V para verdadeiro e F para falso:",
  afirmacoes:[
    {t:"Nos esportes de marca o atleta compete contra o relógio ou contra as marcas dos colegas.", v:true},
    {t:"Na ginástica rítmica os juízes avaliam a dificuldade e a beleza dos movimentos.", v:true},
    {t:"No frisbee as equipes não disputam território.", v:false},
    {t:"O tiro esportivo é um esporte de invasão.", v:false}],
  explicacao:"O frisbee (ultimate) é de invasão: as equipes avançam para a zona final adversária. O tiro esportivo é de precisão."
},
{
  id:"n2-07", nivel:2, tipo:"ordenar", sprite:"natacao", leitura:28, decay:40,
  texto:"Prova de 50 metros livres. Tempos: Bia 32s • Caio 29s • Dani 35s • Enzo 30s.",
  enunciado:"Coloque em ordem de classificação, do 1º ao 4º lugar:",
  itens:[
    {t:"Caio (29s)", ordem:1},
    {t:"Enzo (30s)", ordem:2},
    {t:"Bia (32s)",  ordem:3},
    {t:"Dani (35s)", ordem:4}],
  explicacao:"Em provas de tempo, vence a MENOR marca: quem gastou menos segundos."
},
{
  id:"n2-08", nivel:2, tipo:"mc", sprite:"bocha", leitura:26, decay:40,
  enunciado:"Qual é a maior diferença entre a bocha e o basquete?",
  alternativas:[
    {t:"Na bocha cada um joga na sua vez mirando o alvo; no basquete as equipes disputam o mesmo espaço.", ok:true},
    {t:"Na bocha existem juízes e no basquete não existem.", ok:false},
    {t:"O basquete é medido em metros e a bocha em segundos.", ok:false},
    {t:"Os dois são de precisão, só muda a bola.", ok:false}],
  explicacao:"O que separa as categorias é o jeito de jogar, e não o material usado."
},
{
  id:"n2-09", nivel:2, tipo:"lacuna", sprite:"fita_metrica", leitura:28, decay:40,
  enunciado:"Complete o texto sobre os esportes de marca:",
  frase:"Nos esportes de {0}, o desafio é bater uma medida. O resultado pode ser em tempo, em {1} ou em peso.",
  banco:["marca","distância","notas","território"],
  respostas:["marca","distância"],
  explicacao:"Tempo, distância e peso: as três marcas quantificáveis dessa categoria."
},
{
  id:"n2-10", nivel:2, tipo:"mc", sprite:"alvo_flecha", leitura:30, decay:40,
  texto:"O professor espalhou alvos no chão. Cada aluno, na sua vez, jogava um saquinho tentando parar dentro do círculo do meio. Ninguém podia atrapalhar o colega.",
  enunciado:"Essa atividade é de qual categoria?",
  alternativas:[
    {t:"Precisão", ok:true},
    {t:"Invasão", ok:false},
    {t:"Marca", ok:false},
    {t:"Técnico-combinatório", ok:false}],
  explicacao:"Alvo + vez de cada um + sem interferência do oponente = esportes de precisão."
},

/* ---------------------------------------------------------- NÍVEL 3 */
{
  id:"n3-01", nivel:3, tipo:"mc", sprite:"frisbee", leitura:45, decay:55,
  texto:"O RINGOAL é um esporte novo. Duas equipes jogam na mesma quadra. Para pontuar, a equipe leva um disco até a zona final do adversário. Quem está sem o disco tenta roubar o passe. Vence quem fizer mais pontos em 20 minutos.",
  enunciado:"O Ringoal é de qual categoria?",
  alternativas:[
    {t:"Invasão — as duas equipes disputam o mesmo espaço, atacando e defendendo.", ok:true},
    {t:"Marca — porque a partida tem tempo cronometrado.", ok:false},
    {t:"Precisão — porque é preciso mirar o passe.", ok:false},
    {t:"Técnico-combinatório — porque os passes precisam ser bonitos.", ok:false}],
  explicacao:"O cronômetro só organiza a partida; ele não é o resultado. O que vale aqui é a disputa pelo espaço."
},
{
  id:"n3-02", nivel:3, tipo:"ordenar", sprite:"salto_distancia", leitura:40, decay:55,
  enunciado:"Coloque na ordem correta as etapas de uma prova de salto em distância:",
  itens:[
    {t:"Corrida de aproximação", ordem:1},
    {t:"Impulsão na tábua de batida", ordem:2},
    {t:"Voo (fase aérea)", ordem:3},
    {t:"Queda na caixa de areia", ordem:4},
    {t:"Medição da marca alcançada", ordem:5}],
  explicacao:"Tudo termina na MEDIÇÃO: é ela que transforma o salto em uma marca quantificável."
},
{
  id:"n3-03", nivel:3, tipo:"ligar", leitura:40, decay:55,
  enunciado:"Estes esportes costumam gerar dúvida. Ligue cada um à sua categoria:",
  pares:[
    {a:"Surfe",   sprite:"surfe",   b:"Técnico-combinatório"},
    {a:"Frisbee", sprite:"frisbee", b:"Invasão"},
    {a:"Remo",    sprite:"remo",    b:"Marca"},
    {a:"Boliche", sprite:"boliche", b:"Precisão"}],
  explicacao:"No surfe, juízes dão notas para as manobras. No remo, vence o menor tempo. O frisbee disputa território."
},
{
  id:"n3-04", nivel:3, tipo:"mc", sprite:"surfe", leitura:45, decay:55,
  texto:"Numa bateria de surfe, os atletas têm 30 minutos de água. No fim, os juízes dão notas para as melhores ondas de cada um.",
  enunciado:"Por que o surfe é técnico-combinatório, e não de marca?",
  alternativas:[
    {t:"O tempo só limita a bateria. Quem decide são as notas das manobras.", ok:true},
    {t:"Porque a onda é um alvo para acertar.", ok:false},
    {t:"Porque o surfista invade a onda do adversário.", ok:false},
    {t:"Porque vence quem for mais longe na onda.", ok:false}],
  explicacao:"Ter cronômetro não faz o esporte ser de marca. O que vale é quem decide o resultado — aqui, os juízes."
},
{
  id:"n3-05", nivel:3, tipo:"vf", sprite:"mascote_pensa", leitura:45, decay:55,
  enunciado:"Cuidado com as pegadinhas! Marque V ou F:",
  afirmacoes:[
    {t:"Na ginástica artística vence quem executa o movimento mais rápido.", v:false},
    {t:"Um esporte de invasão sempre tem ataque e defesa acontecendo ao mesmo tempo.", v:true},
    {t:"No arremesso de peso, quanto maior a distância, melhor a marca.", v:true},
    {t:"Nos esportes de precisão o adversário pode empurrar você durante a jogada.", v:false}],
  explicacao:"Na ginástica valem dificuldade, execução e estética. Na precisão, o duelo é com o alvo, não com o corpo do adversário."
},
{
  id:"n3-06", nivel:3, tipo:"classificar", leitura:50, decay:60,
  enunciado:"Desafio final: arraste os OITO esportes para as categorias certas.",
  categorias:CATEGORIAS,
  itens:[
    {t:"Tiro esportivo",    sprite:"tiro_esportivo",   cat:"Precisão"},
    {t:"Nado artístico",    sprite:"nado_artistico",   cat:"Técnico-combinatório"},
    {t:"Rugby",             sprite:"rugby",            cat:"Invasão"},
    {t:"Arremesso de peso", sprite:"arremesso_peso",   cat:"Marca"},
    {t:"Golfe",             sprite:"golfe",            cat:"Precisão"},
    {t:"Ginástica rítmica", sprite:"ginastica_ritmica", cat:"Técnico-combinatório"},
    {t:"Futebol",           sprite:"bola_futebol",     cat:"Invasão"},
    {t:"Ciclismo",          sprite:"ciclismo",         cat:"Marca"}],
  explicacao:"Duas de cada categoria. A pergunta-chave continua a mesma: o que decide o resultado?"
},
{
  id:"n3-07", nivel:3, tipo:"mc", sprite:"juizes", leitura:45, decay:55,
  texto:"Na ginástica artística a nota tem duas partes: a nota de dificuldade, que sobe quando os movimentos são mais difíceis, e a nota de execução, que perde pontos a cada erro de equilíbrio ou postura.",
  enunciado:"O que isso mostra sobre os esportes técnico-combinatórios?",
  alternativas:[
    {t:"O resultado vem da qualidade do movimento, avaliada pelos juízes.", ok:true},
    {t:"O resultado vem de uma medida, como tempo ou distância.", ok:false},
    {t:"O resultado vem de invadir a área da adversária.", ok:false},
    {t:"O resultado depende só do gosto de quem assiste.", ok:false}],
  explicacao:"Existem regras claras: dificuldade, execução e beleza do movimento. Não é só questão de gosto."
},
{
  id:"n3-08", nivel:3, tipo:"ordenar", sprite:"arremesso_peso", leitura:40, decay:55,
  texto:"Competição escolar de arremesso de peso. Marcas: Léo 6,80 m • Ana 7,15 m • Tiago 5,90 m • Mel 7,02 m.",
  enunciado:"Coloque em ordem de classificação, do 1º ao 4º lugar:",
  itens:[
    {t:"Ana (7,15 m)",   ordem:1},
    {t:"Mel (7,02 m)",   ordem:2},
    {t:"Léo (6,80 m)",   ordem:3},
    {t:"Tiago (5,90 m)", ordem:4}],
  explicacao:"Em provas de distância vence a MAIOR marca — o contrário das provas de tempo, onde vence a menor."
},
{
  id:"n3-09", nivel:3, tipo:"mc", sprite:"prancheta", leitura:45, decay:55,
  texto:"O professor propôs dois jogos. No JOGO A, duas equipes tentam levar a bola até a linha de fundo do adversário, que tenta impedir. No JOGO B, cada aluno, na sua vez, tenta parar a bola bem perto de um cone.",
  enunciado:"Como classificar os dois jogos?",
  alternativas:[
    {t:"Jogo A: invasão | Jogo B: precisão", ok:true},
    {t:"Jogo A: precisão | Jogo B: invasão", ok:false},
    {t:"Jogo A: marca | Jogo B: técnico-combinatório", ok:false},
    {t:"Os dois são de invasão, porque usam bola.", ok:false}],
  explicacao:"O material (bola) não classifica nada. A lógica sim: disputa de território x pontaria em alvo."
},
{
  id:"n3-10", nivel:3, tipo:"lacuna", sprite:"brasao_tecnico", leitura:42, decay:55,
  enunciado:"Complete o resumo comparando as categorias:",
  frase:"Nos esportes de {0}, o resultado é um número medido pelo cronômetro ou pela trena. Já nos esportes {1}, o resultado vem das {2} dadas pelos juízes.",
  banco:["marca","técnico-combinatórios","notas","de invasão","gols"],
  respostas:["marca","técnico-combinatórios","notas"],
  explicacao:"Marca = medida objetiva. Técnico-combinatório = avaliação da qualidade do movimento."
}
];

/* Registra o banco do 6º ano no sistema unificado */
BANCOS["6º ano B"] = { categorias: CATEGORIAS, questoes: BANCO };
