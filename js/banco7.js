/* ============================================================
   BANCO DE QUESTÕES — 7º ANO (30 questões: 10 por nível)
   Tema: Jogos eletrônicos e cultura corporal · Danças urbanas
   Baseado no texto da atividade avaliativa do 2º trimestre.

   tipos: mc | vf | ordenar | ligar | classificar | lacuna
   ============================================================ */
const CATEGORIAS_7 = ["O que os jogos dão", "O que os jogos cobram"];

BANCOS["7º ano"] = { categorias: CATEGORIAS_7, questoes: [
/* ---------------------------------------------------------- NÍVEL 1 */
{
  id:"7n1-01", nivel:1, tipo:"mc", sprite:"cronometro", leitura:15, decay:25,
  enunciado:"Nos anos 1980, quem quisesse jogar precisava:",
  alternativas:[
    {t:"Ir até um fliperama, pagar uma ficha por partida e disputar a vez com outras pessoas.", ok:true},
    {t:"Baixar um aplicativo no celular.", ok:false},
    {t:"Jogar sentado no sofá com o controle na mão.", ok:false},
    {t:"Esperar o console doméstico ser inventado.", ok:false}],
  explicacao:"Nos anos 1980 o jogo ficava no fliperama: máquina grande, ficha por partida e vez disputada com outras pessoas."
},
{
  id:"7n1-02", nivel:1, tipo:"mc", sprite:"estrela", leitura:13, decay:25,
  enunciado:"O que são os chamados “jogos de movimento”?",
  alternativas:[
    {t:"Jogos que usam sensores ou câmeras e só funcionam se o jogador dançar, saltar ou agachar de verdade.", ok:true},
    {t:"Jogos que exigem apenas mover os polegares.", ok:false},
    {t:"Jogos de corrida de carro no console.", ok:false},
    {t:"Jogos de tabuleiro adaptados para o celular.", ok:false}],
  explicacao:"Os jogos de movimento mostram que a tecnologia não obriga à imobilidade: o corpo se movimenta de verdade."
},
{
  id:"7n1-03", nivel:1, tipo:"mc", sprite:"lampada", leitura:15, decay:25,
  enunciado:"Segundo o texto, os jogos eletrônicos fazem parte de qual ideia central do trimestre?",
  alternativas:[
    {t:"Da cultura corporal do movimento, do mesmo modo que esportes e danças.", ok:true},
    {t:"De uma cultura separada, que não tem relação com o corpo.", ok:false},
    {t:"Do mundo da tecnologia, sem ligação com a Educação Física.", ok:false},
    {t:"Da cultura escrita, como os livros e as histórias.", ok:false}],
  explicacao:"Os jogos eletrônicos transformaram a cultura corporal do movimento — eles não estão fora dela."
},
{
  id:"7n1-04", nivel:1, tipo:"mc", sprite:"mascote_explica", leitura:14, decay:25,
  enunciado:"O que os jogos eletrônicos ajudam a desenvolver, segundo o texto?",
  alternativas:[
    {t:"Raciocínio rápido, coordenação entre olhos e mãos e resolução de problemas sob pressão.", ok:true},
    {t:"Apenas força física e velocidade.", ok:false},
    {t:"Somente a memória de palavras.", ok:false},
    {t:"Nada: são apenas uma distração.", ok:false}],
  explicacao:"Além do lazer, os jogos desenvolvem raciocínio, coordenação e estratégia, entre outras habilidades."
},
{
  id:"7n1-05", nivel:1, tipo:"vf", sprite:"prancheta", leitura:18, decay:30,
  enunciado:"Marque V para verdadeiro e F para falso:",
  afirmacoes:[
    {t:"O breaking é o estilo mais associado ao hip hop.", v:true},
    {t:"As danças urbanas nasceram em academias e teatros.", v:false},
    {t:"No popping, o corpo parece travar por frações de segundo, dando impressão de movimento robótico.", v:true}],
  explicacao:"As danças urbanas nasceram nas ruas e nos bailes, não em academias. O popping cria o efeito robótico."
},
{
  id:"7n1-06", nivel:1, tipo:"ligar", leitura:20, decay:30,
  enunciado:"Ligue cada estilo de dança urbana à sua característica:",
  pares:[
    {a:"Breaking", sprite:"podio", b:"Passos no chão, giros e freezes"},
    {a:"Popping",  sprite:"estrela", b:"Contrações rápidas, efeito robótico"},
    {a:"Locking",  sprite:"trofeu", b:"Paradas exageradas e gestos de apontar"},
    {a:"House dance", sprite:"medalha_ouro", b:"Pés como protagonistas, passos rápidos e miúdos"}],
  explicacao:"Cada estilo tem uma marca própria: chão, contrações, paradas teatrais ou trabalho de pés."
},
{
  id:"7n1-07", nivel:1, tipo:"mc", sprite:"cronometro", leitura:14, decay:25,
  enunciado:"Quais são os quatro elementos constitutivos das danças urbanas?",
  alternativas:[
    {t:"Ritmo, expressão corporal, espaço e musicalidade.", ok:true},
    {t:"Força, velocidade, resistência e flexibilidade.", ok:false},
    {t:"Cabeça, tronco, braços e pernas.", ok:false},
    {t:"Música, letra, ritmo e harmonia.", ok:false}],
  explicacao:"Ritmo, expressão corporal, espaço e musicalidade organizam todos os estilos de dança urbana."
},
{
  id:"7n1-08", nivel:1, tipo:"mc", sprite:"lampada", leitura:15, decay:25,
  enunciado:"O que significa dizer que o jogo também é lazer?",
  alternativas:[
    {t:"Que jogar é um descanso legítimo, do mesmo jeito que assistir a um filme ou jogar bola.", ok:true},
    {t:"Que jogar é sempre perda de tempo.", ok:false},
    {t:"Que jogar só serve para competir.", ok:false},
    {t:"Que jogar não é uma atividade de lazer.", ok:false}],
  explicacao:"O lazer é uma parte legítima da vida — jogar pode ser descanso, como qualquer outra diversão."
},
{
  id:"7n1-09", nivel:1, tipo:"lacuna", sprite:"mascote_explica", leitura:16, decay:28,
  enunciado:"Complete a frase com as palavras do banco:",
  frase:"Muitas horas seguidas sentado levam ao {0}, que aumenta o risco de obesidade e problemas {1} na juventude.",
  banco:["sedentarismo","cardíacos","fadiga","musculares"],
  respostas:["sedentarismo","cardíacos"],
  explicacao:"O sedentarismo vem do tempo parado demais e aumenta riscos de saúde ainda na juventude."
},
{
  id:"7n1-10", nivel:1, tipo:"mc", sprite:"estrela", leitura:13, decay:25,
  enunciado:"As danças urbanas surgiram, principalmente, em quais lugares?",
  alternativas:[
    {t:"Nas ruas, festas de bairro e bailes de grandes cidades.", ok:true},
    {t:"Em academias famosas da Europa.", ok:false},
    {t:"Nos teatros municipais.", ok:false},
    {t:"Nas escolas de balé clássico.", ok:false}],
  explicacao:"Elas nasceram nas ruas e bailes, criadas por jovens das periferias — não em academias ou teatros."
},

/* ---------------------------------------------------------- NÍVEL 2 */
{
  id:"7n2-01", nivel:2, tipo:"mc", sprite:"mascote_pensa", leitura:26, decay:40,
  texto:"No fliperama o corpo ficava em pé e o movimento era amplo. No console o corpo sentou e o que se moveu foram os polegares. No celular, além de sentar, o pescoço se inclinou para a frente.",
  enunciado:"O que essa sequência mostra sobre a exigência corporal dos jogos?",
  alternativas:[
    {t:"Que cada mudança de lugar do jogo alterou o que o corpo faz enquanto joga.", ok:true},
    {t:"Que o corpo nunca muda, seja qual for o jogo.", ok:false},
    {t:"Que os jogos sempre exigiram o mesmo movimento.", ok:false},
    {t:"Que o fliperama era o único que mexia com o corpo.", ok:false}],
  explicacao:"Fliperama (pé e amplo), console (polegares), celular (pescoço inclinado): a exigência corporal mudou junto."
},
{
  id:"7n2-02", nivel:2, tipo:"ordenar", sprite:"cronometro", leitura:25, decay:40,
  enunciado:"Coloque na ordem a evolução do lugar do jogo descrita no texto:",
  itens:[
    {t:"Fliperama — em pé, com ficha e vez disputada", ordem:1},
    {t:"Console doméstico — sentado no sofá, controle na mão", ordem:2},
    {t:"Celular — no bolso, a qualquer hora, muitas vezes sozinho", ordem:3}],
  explicacao:"Do fliperama ao celular, o jogo foi do espaço público para a palma da mão."
},
{
  id:"7n2-03", nivel:2, tipo:"mc", sprite:"lampada", leitura:28, decay:40,
  enunciado:"Por que jogar tarde da noite atrapalha o sono?",
  alternativas:[
    {t:"A luz da tela atrasa o sinal que o corpo usa para entender que é hora de dormir.", ok:true},
    {t:"Porque o jogo sempre deixa a pessoa ansiosa demais para dormir.", ok:false},
    {t:"Porque os jogos são proibidos à noite.", ok:false},
    {t:"Porque a tela aquece o corpo e impede o sono.", ok:false}],
  explicacao:"A luz da tela engana o corpo: atrasa o sinal de “é hora de dormir”, e dormir mal reduz o rendimento no dia seguinte."
},
{
  id:"7n2-04", nivel:2, tipo:"vf", sprite:"prancheta", leitura:30, decay:45,
  enunciado:"Marque V para verdadeiro e F para falso:",
  afirmacoes:[
    {t:"A postura curvada ao jogar pode sobrecarregar o pescoço e a lombar.", v:true},
    {t:"A fadiga visual pode causar olhos secos, ardência e dor de cabeça.", v:true},
    {t:"Jogar muitas horas seguidas não tem nenhum efeito sobre a saúde.", v:false},
    {t:"Os jogos eletrônicos também podem aproximar pessoas que moram longe.", v:true}],
  explicacao:"O problema quase nunca é o jogo em si, e sim o tempo e o modo como se joga."
},
{
  id:"7n2-05", nivel:2, tipo:"classificar", leitura:32, decay:45,
  enunciado:"Arraste cada item para a coluna certa, segundo o texto:",
  categorias:CATEGORIAS_7,
  itens:[
    {t:"Raciocínio rápido",   cat:"O que os jogos dão"},
    {t:"Aproximam pessoas",   cat:"O que os jogos dão"},
    {t:"Sedentarismo",        cat:"O que os jogos cobram"},
    {t:"Fadiga visual",       cat:"O que os jogos cobram"},
    {t:"Coordenação olho-mão",cat:"O que os jogos dão"},
    {t:"Problemas de postura",cat:"O que os jogos cobram"}],
  explicacao:"Os jogos dão habilidades e aproximação; cobram quando o tempo e o modo são exagerados."
},
{
  id:"7n2-06", nivel:2, tipo:"mc", sprite:"mascote_pensa", leitura:28, decay:40,
  texto:"O texto afirma que “a saída não é abandonar os jogos, e sim equilibrar”.",
  enunciado:"Qual atitude representa esse equilíbrio?",
  alternativas:[
    {t:"Decidir quanto tempo jogar antes de começar, fazer pausas e cuidar da postura.", ok:true},
    {t:"Parar de jogar para sempre e nunca mais tocar em uma tela.", ok:false},
    {t:"Jogar só à noite para não perder o dia.", ok:false},
    {t:"Jogar mais horas para treinar o raciocínio.", ok:false}],
  explicacao:"Equilibrar é combinar tempo, pausas, postura e também práticas que movimentem o corpo."
},
{
  id:"7n2-07", nivel:2, tipo:"mc", sprite:"podio", leitura:28, decay:40,
  enunciado:"O que é a “roda” (cypher) nas danças urbanas?",
  alternativas:[
    {t:"Um círculo em que cada pessoa entra no centro para improvisar e responder ao que o anterior fez.", ok:true},
    {t:"Uma apresentação com coreografia ensaiada.", ok:false},
    {t:"Um tipo de música usada nas danças de salão.", ok:false},
    {t:"Um aparelho de ginástica para girar.", ok:false}],
  explicacao:"Na roda há improvisação, como numa conversa: quem entra responde ao dançarino anterior."
},
{
  id:"7n2-08", nivel:2, tipo:"ligar", leitura:28, decay:40,
  enunciado:"Ligue cada elemento constitutivo ao seu significado:",
  pares:[
    {a:"Ritmo",           sprite:"cronometro",  b:"Relação entre o movimento e a batida da música"},
    {a:"Expressão corporal", sprite:"mascote_explica", b:"O que o corpo comunica: atitude, intenção, personagem"},
    {a:"Espaço",          sprite:"nivel3",      b:"Uso dos níveis (chão, meio, alto) e das direções"},
    {a:"Musicalidade",    sprite:"estrela",     b:"Perceber camadas na música e escolher qual marcar"}],
  explicacao:"Os quatro elementos — ritmo, expressão, espaço e musicalidade — organizam todas as danças urbanas."
},
{
  id:"7n2-09", nivel:2, tipo:"lacuna", sprite:"mascote_pensa", leitura:28, decay:40,
  enunciado:"Complete a frase sobre as danças urbanas:",
  frase:"As danças urbanas surgiram como forma de {0} alguma coisa em um lugar onde faltava espaço para falar: eram identidade, {1} e disputa criativa.",
  banco:["dizer","resistência","dançar","competição"],
  respostas:["dizer","resistência"],
  explicacao:"Elas nasceram como fala, identidade e resistência nas periferias das grandes cidades."
},
{
  id:"7n2-10", nivel:2, tipo:"mc", sprite:"lampada", leitura:28, decay:40,
  enunciado:"O que a fadiga visual pode provocar?",
  alternativas:[
    {t:"Olhos secos, ardência e dor de cabeça.", ok:true},
    {t:"Aumento da força física.", ok:false},
    {t:"Melhora da memória.", ok:false},
    {t:"Nenhum sintoma visível.", ok:false}],
  explicacao:"Olhar a tela de perto por muito tempo provoca fadiga visual: olhos secos, ardência e dor de cabeça."
},

/* ---------------------------------------------------------- NÍVEL 3 */
{
  id:"7n3-01", nivel:3, tipo:"mc", sprite:"mascote_pensa", leitura:45, decay:55,
  texto:"O texto diz: “o problema quase nunca é o jogo em si; é o tempo e o modo”.",
  enunciado:"O que essa frase quer dizer?",
  alternativas:[
    {t:"O jogo pode ser saudável; o excesso de tempo e o jeito errado de jogar é que trazem problemas.", ok:true},
    {t:"Todos os jogos são sempre prejudiciais.", ok:false},
    {t:"O problema é o jogo, e o tempo não importa.", ok:false},
    {t:"Só jogar de manhã resolve todos os problemas.", ok:false}],
  explicacao:"O jogo em si não é o vilão: são o tempo (horas demais) e o modo (postura, horário, exagero) que fazem mal."
},
{
  id:"7n3-02", nivel:3, tipo:"ordenar", sprite:"podio", leitura:40, decay:55,
  enunciado:"Coloque na ordem o que acontece em uma roda de dança urbana:",
  itens:[
    {t:"As pessoas formam um círculo", ordem:1},
    {t:"Uma pessoa entra no centro", ordem:2},
    {t:"Ela improvisa naquele instante", ordem:3},
    {t:"O próximo entra e responde ao que o anterior fez", ordem:4}],
  explicacao:"A roda é conversa com o corpo: círculo, entrada, improviso e resposta ao anterior."
},
{
  id:"7n3-03", nivel:3, tipo:"mc", sprite:"mascote_erro", leitura:45, decay:55,
  texto:"O texto diz que as danças urbanas já foram chamadas de “bagunça” e de “coisa de rua”, e que esses julgamentos dizem mais sobre a origem social de quem as criou do que sobre o movimento em si.",
  enunciado:"O que isso significa?",
  alternativas:[
    {t:"O preconceito vem da origem social dos criadores, e não da qualidade da dança.", ok:true},
    {t:"As danças urbanas realmente não são danças.", ok:false},
    {t:"Só dança de rua é proibida.", ok:false},
    {t:"O julgamento se baseia na técnica do movimento.", ok:false}],
  explicacao:"Reconhecer as danças urbanas como cultura legítima é uma forma de combater a discriminação."
},
{
  id:"7n3-04", nivel:3, tipo:"classificar", leitura:50, decay:60,
  enunciado:"Desafio final: arraste os OITO itens para a coluna certa.",
  categorias:CATEGORIAS_7,
  itens:[
    {t:"Raciocínio rápido",    cat:"O que os jogos dão"},
    {t:"Estratégia e leitura de mapa", cat:"O que os jogos dão"},
    {t:"Amizades dentro do jogo", cat:"O que os jogos dão"},
    {t:"Lazer legítimo",       cat:"O que os jogos dão"},
    {t:"Sedentarismo",         cat:"O que os jogos cobram"},
    {t:"Competição agressiva", cat:"O que os jogos cobram"},
    {t:"Fadiga visual",        cat:"O que os jogos cobram"},
    {t:"Exclusão de quem joga pior", cat:"O que os jogos cobram"}],
  explicacao:"Quatro benefícios e quatro custos: o equilíbrio está em escolher o modo e o tempo de jogar."
},
{
  id:"7n3-05", nivel:3, tipo:"mc", sprite:"lampada", leitura:45, decay:55,
  texto:"O texto fala em “leitura de mapa” e “divisão de funções dentro de uma equipe” ao descrever o que os jogos desenvolvem.",
  enunciado:"Essas habilidades estão mais ligadas a:",
  alternativas:[
    {t:"Estratégia e cooperação dentro do jogo.", ok:true},
    {t:"Apenas agilidade dos dedos.", ok:false},
    {t:"Força física do jogador.", ok:false},
    {t:"Memorização de letras.", ok:false}],
  explicacao:"Muitos jogos exigem estratégia, leitura do espaço do jogo e trabalho em equipe."
},
{
  id:"7n3-06", nivel:3, tipo:"vf", sprite:"mascote_pensa", leitura:45, decay:55,
  enunciado:"Cuidado com as pegadinhas! Marque V ou F:",
  afirmacoes:[
    {t:"O vogue e o waacking trabalham linhas de braço, poses e movimentos rápidos das mãos.", v:true},
    {t:"As danças urbanas surgiram nos anos 2000, nas academias.", v:false},
    {t:"Na dança urbana, o espaço inclui os níveis chão, meio e alto.", v:true},
    {t:"Jogar videogame é sempre perda de tempo.", v:false}],
  explicacao:"Vogue/waacking usam muito os braços; as danças urbanas nasceram nos anos 1970 nas ruas; espaço tem níveis."
},
{
  id:"7n3-07", nivel:3, tipo:"mc", sprite:"podio", leitura:45, decay:55,
  texto:"No fliperama o corpo ficava em pé e o movimento era amplo. No console, o corpo sentou e o que se moveu foram os polegares.",
  enunciado:"Qual comparação está correta?",
  alternativas:[
    {t:"O fliperama exigia movimento mais amplo do corpo do que o console.", ok:true},
    {t:"O console exigia mais movimento do que o fliperama.", ok:false},
    {t:"Os dois exigiam exatamente o mesmo movimento.", ok:false},
    {t:"O fliperama não exigia nenhum movimento.", ok:false}],
  explicacao:"A mudança de suporte (fliperama → console → celular) reduziu e modificou a exigência corporal."
},
{
  id:"7n3-08", nivel:3, tipo:"mc", sprite:"mascote_explica", leitura:45, decay:55,
  texto:"O texto afirma que os jogos de movimento “mostram que a tecnologia não empurra o corpo para a imobilidade por obrigação: depende de qual jogo é escolhido e de como ele é usado”.",
  enunciado:"O que essa afirmação defende?",
  alternativas:[
    {t:"A tecnologia pode movimentar o corpo, dependendo do jogo e do uso.", ok:true},
    {t:"A tecnologia sempre imobiliza o corpo.", ok:false},
    {t:"Jogos de movimento não usam tecnologia.", ok:false},
    {t:"Todos os jogos eletrônicos são sedentários.", ok:false}],
  explicacao:"Os jogos de movimento provam que a escolha do jogo e a forma de usá-lo podem exigir o corpo de verdade."
},
{
  id:"7n3-09", nivel:3, tipo:"lacuna", sprite:"mascote_pensa", leitura:42, decay:55,
  enunciado:"Complete o resumo sobre as danças urbanas:",
  frase:"Nas danças urbanas, o {0} é a relação entre o movimento e a batida, e a {1} é a capacidade de perceber camadas na música e escolher qual {2} com o corpo.",
  banco:["ritmo","musicalidade","marcar","espaço","expressar"],
  respostas:["ritmo","musicalidade","marcar"],
  explicacao:"Ritmo liga o movimento à batida; musicalidade é escolher, dentro da música, o que marcar."
},
{
  id:"7n3-10", nivel:3, tipo:"mc", sprite:"mascote_erro", leitura:45, decay:55,
  texto:"O texto menciona que o mesmo jogo que gera cooperação pode gerar competição agressiva, xingamento e exclusão de quem joga pior.",
  enunciado:"Qual é a melhor forma de lidar com essa situação?",
  alternativas:[
    {t:"Equilibrar o uso e combinar um clima de respeito entre os jogadores.", ok:true},
    {t:"Proibir todos os jogos eletrônicos.", ok:false},
    {t:"Jogar apenas sozinho, sem nunca competir.", ok:false},
    {t:"Ignorar o que acontece dentro do jogo.", ok:false}],
  explicacao:"O equilíbrio e o respeito nas relações dentro do jogo são o caminho apontado pelo texto."
}
]};