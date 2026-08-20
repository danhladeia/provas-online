# Avaliação 2º Trimestre — Educação Física
### Escola Jesuzinha • 4 turmas: 6º, 7º, 8º e 9º ano

Prova interativa e gamificada em HTML/CSS/JavaScript puro (sem instalação, sem nuvem).
Funciona como **PWA** (instalável, offline): o aluno escolhe a turma e o nome — sem PIN,
sem senha — e o resultado fica salvo só no aparelho.

---

## 1. Como abrir a prova

Dê dois cliques em **`ABRIR PROVA.bat`**. Ele sobe um servidor local e abre o navegador em
`http://localhost:8123`. Para os alunos usarem os próprios aparelhos na mesma rede Wi-Fi,
use `http://SEU-IP:8123` (o `.bat` mostra o IP).

**Fluxo do aluno:** escolhe a **turma** → escolhe o **nome na lista** → lê as regras →
faz a prova.

**Jeito simples (sem servidor):** dois cliques em `index.html`. Funciona igual — tudo roda
e é salvo no navegador do próprio aparelho.

**Instalar como app (PWA):** no navegador do celular/computador, use a opção "Instalar
app" / "Adicionar à tela inicial". Depois de instalado, a prova abre em tela cheia como um
aplicativo e continua funcionando sem internet.

> Área do professor: `professor.html` — sem login, abre direto.

---

## 2. Como a prova funciona

### Sorteio das questões (anti-repetição no aparelho)
- **4 bancos de 30 questões** (`js/banco.js`, `banco7.js`, `banco8.js`, `banco9.js`):
  10 fáceis, 10 médias, 10 difíceis, temas do 2º trimestre de cada turma.
- Cada aluno responde **10** (4 nível 1, 3 nível 2, 3 nível 3), escolhidas como as
  **menos usadas** entre as provas já feitas nesse mesmo aparelho, com sobreposição mínima.
- Ordem das questões e das alternativas embaralhadas a cada prova.

### Tempo e nota
- Cada questão tem **área salva** (leitura) valendo 100%; depois o valor cai até o piso de 40%.
- **Tempo total** por turma (25 min em `config.js`).
- **Nota final** = 10 × (soma peso × acerto × fator tempo) ÷ soma dos pesos. Pesos: 1,0 / 1,2 / 1,5.
- Questões com várias partes (V/F, sequência, ligar, classificar, lacunas) dão acerto parcial.

### Tipos de questão
Múltipla escolha · Verdadeiro ou falso · Monte a sequência · Ligue os pontos ·
Arraste e classifique · Complete a frase. Depois de confirmar, o aluno vê o gabarito e a explicação.

### Sessão e resultado
- Prova interrompida (página fechada sem querer) retoma do ponto exato pelo botão
  "Continuar prova", enquanto for no mesmo aparelho.
- Ao terminar, o resultado é salvo só **neste aparelho** (localStorage) — não há envio para
  nenhum servidor.

### Relatório final
Ao terminar, o aluno vê a nota e um **relatório questão a questão**: o enunciado, a resposta
que ele deu, o gabarito, a explicação, o tempo gasto e o valor obtido em cada questão.

---

## 3. Área do professor (`professor.html`)

- Abre direto, sem login.
- **Turma** selecionável no topo (6º, 7º, 8º ou 9º ano) — notas e estatísticas por turma,
  lidas do **mesmo aparelho** em que os alunos fizeram a prova.
- Média, provas entregues, notas ≥ 6,0, maior nota, tempo médio; tabela com busca/ordenação
  e botão "ver" (quais questões caíram, tempo, valor obtido em cada uma).
- **Desempenho por questão** (da mais difícil para a mais fácil) — o que retomar em aula.
- **Baixar CSV** e **Imprimir**.

> Como os dados ficam no aparelho, para consolidar notas de várias turmas/aparelhos, use o
> **Baixar CSV** em cada um e junte as planilhas depois.

---

## 4. Arquivos

```
index.html            prova unificada (turma → nome → prova → resultado)
professor.html        área do professor (turma, notas, estatísticas)
manifest.webmanifest  metadados do PWA (nome, ícone, cor)
sw.js                 service worker: cache do app para uso offline
ABRIR PROVA.bat        sobe o servidor local e abre o navegador
css/estilo.css        visual
js/config.js           turmas, listas de alunos, pesos
js/banco.js            banco do 6º ano (30 questões)
js/banco7.js            banco do 7º ano (30 questões)
js/banco8.js            banco do 8º ano (30 questões)
js/banco9.js            banco do 9º ano (30 questões)
js/dados.js             armazenamento local (localStorage): sorteio, sessão e resultado
js/app.js               motor: sorteio, cronômetro, correção, nota
js/professor.js         notas, estatísticas e CSV
assets/sprites/         64 ilustrações com fundo transparente
```

### Ajustes rápidos (`js/config.js`)
- `TURMAS` — temas, `distribuicao`, `pesos`, `fatorMinimo`, `multiplicadorTempo`,
  `tempoTotal` (segundos) por turma.
- `ALUNOS` — listas de nomes por turma (o aluno escolhe o próprio nome).

### Deixar a prova mais longa
Em `config.js`, na turma desejada:

```js
multiplicadorTempo: 1.5,   // 50% mais tempo em todas as questões
```

| Valor | Efeito | Duração estimada |
|---|---|---|
| `1.0` | tempos originais | ~8 a 12 min |
| `1.5` | 50% mais tempo | ~12 a 18 min |
| `2.0` | dobro do tempo | ~16 a 24 min |

Outras formas: mais questões em `distribuicao` (`{1:5, 2:4, 3:3}` = 12), subir `fatorMinimo`
para `0.6` (pune menos a demora).
