# Avaliação 2º Trimestre — Educação Física
### Escola Jesuzinha • 4 turmas: 6º, 7º, 8º e 9º ano

Prova interativa e gamificada em HTML/CSS/JavaScript puro (sem instalação), com banco no
Supabase, PIN por aluno, tela cheia vigiada, recuperação de sessão e funcionamento offline
de emergência.

---

## 1. Como abrir a prova

**Jeito recomendado (com nuvem):** dê dois cliques em **`ABRIR PROVA.bat`**. Ele sobe um
servidor local e abre o navegador em `http://localhost:8123`. Para os alunos usarem os
próprios aparelhos na mesma rede Wi-Fi, use `http://SEU-IP:8123` (o `.bat` mostra o IP).

**Fluxo do aluno:** escolhe a **turma** → escolhe o **nome na lista** → digita o **PIN**
(o professor emite na área do professor) → lê as regras → faz a prova em **tela cheia**.

**Jeito simples (sem servidor):** dois cliques em `index.html`. Funciona, mas alguns
navegadores bloqueiam o envio para a nuvem — o resultado fica no aparelho.

> Área do professor: `professor.html` — senha **`L4deiahd93#`** (validada no banco).

---

## 2. Ligar o banco de dados (uma única vez)

1. Painel do Supabase → projeto `lxdbepmakabpcsstlcqa` → **SQL Editor**.
2. Cole todo o conteúdo do **`supabase.sql`** e clique em **Run**.
3. Cria as tabelas `sorteios`, `avaliacoes`, `provas` (uma por turma), `tentativas`,
   `alunos_extra` (PEI/laudo), `infracoes` e `admin`, além das funções seguras
   (`definir_pin`, `validar_pin`, `set_prova_aberta`, `concluir_prova`, …).

O PIN fica com **bcrypt** (pgcrypto); o navegador nunca lê hashes — tudo passa por funções
`SECURITY DEFINER`. Sem executar o script, a prova ainda funciona com o **espelho local**
(PIN e estado guardados no aparelho).

---

## 3. Como a prova funciona

### Sorteio das questões (anti-repetição por turma)
- **4 bancos de 30 questões** (`js/banco.js`, `banco7.js`, `banco8.js`, `banco9.js`):
  10 fáceis, 10 médias, 10 difíceis, temas do 2º trimestre de cada turma.
- Cada aluno responde **10** (4 nível 1, 3 nível 2, 3 nível 3), escolhidas como as
  **menos usadas** entre os colegas da própria turma, com sobreposição mínima.
- Ordem das questões e das alternativas embaralhadas a cada prova.

### Tempo e nota
- Cada questão tem **área salva** (leitura) valendo 100%; depois o valor cai até o piso de 40%.
- **Tempo total** por turma (25 min em `config.js`) + **tempo extra** para PEI/laudo
  (o professor soma +5/+10/+15 min ao emitir o PIN).
- **Nota final** = 10 × (soma peso × acerto × fator tempo) ÷ soma dos pesos. Pesos: 1,0 / 1,2 / 1,5.
- Questões com várias partes (V/F, sequência, ligar, classificar, lacunas) dão acerto parcial.

### Tipos de questão
Múltipla escolha · Verdadeiro ou falso · Monte a sequência · Ligue os pontos ·
Arraste e classifique · Complete a frase. Depois de confirmar, o aluno vê o gabarito e a explicação.

### Segurança e vigilância
- **PIN por turma**: o professor define UM PIN e abre a prova; todos os alunos da turma usam
  o mesmo PIN. Enquanto a prova está **fechada**, nenhum aluno entra.
- Cada aluno tem uma **tentativa** (não pode refazer com o mesmo nome). Prova interrompida
  retoma do ponto exato pelo botão "Continuar prova".
- A prova abre em **tela cheia**. Sair da tela cheia ou trocar de aba é tolerado por
  `toleranciaSaida` (700 ms) e depois **registrado como infração** na tabela `infracoes`.
  Um bloqueio cobre a tela até o aluno voltar.
- **Tempo extra**: padrão por turma (na definição do PIN) e/ou individual para PEI/laudo
  (na área do professor, por aluno). Tempo esgotado corrige automaticamente o que foi respondido.

### Relatório final
Ao terminar, o aluno vê a nota e um **relatório questão a questão**: o enunciado, a resposta
que ele deu, o gabarito, a explicação, o tempo gasto e o valor obtido em cada questão.

---

## 4. Área do professor (`professor.html`)

- **Turma** selecionável no topo (6º, 7º, 8º ou 9º ano) — notas e estatísticas por turma.
- Média, provas entregues, notas ≥ 6,0, maior nota, tempo médio; tabela com busca/ordenação
  e botão "ver" (quais questões caíram, tempo, valor, saídas de tela).
- **Desempenho por questão** (da mais difícil para a mais fácil) — o que retomar em aula.
- **PINs**: selecione o aluno, defina o PIN e o tempo extra (PEI/laudo) e clique em
  "+ Emitir PIN". A lista mostra status (ativa / em andamento / concluída).
- **Saídas de tela / trocas de aba**: registro automático por aluno.
- **Baixar CSV**, **Imprimir** e **☁ Reenviar pendentes**.

---

## 5. Arquivos

```
index.html          prova unificada (turma → nome → PIN → prova → resultado)
professor.html      área do professor (turma, PINs, infrações, notas)
supabase.sql        script das tabelas + funções seguras (rodar uma vez)
ABRIR PROVA.bat     sobe o servidor local e abre o navegador
css/estilo.css      visual
js/config.js        turmas, listas de alunos, pesos, chaves do Supabase
js/banco.js         banco do 6º ano (30 questões)
js/banco7.js        banco do 7º ano (30 questões)
js/banco8.js        banco do 8º ano (30 questões)
js/banco9.js        banco do 9º ano (30 questões)
js/nuvem.js         Supabase + funções de PIN/infrações/sessão + plano B offline
js/app.js           motor: sorteio, PIN, tela cheia, cronômetro, correção, nota
js/professor.js     notas, PINs, infrações, estatísticas e CSV
assets/sprites/     64 ilustrações com fundo transparente
```

### Ajustes rápidos (`js/config.js`)
- `TURMAS` — temas, `distribuicao`, `pesos`, `fatorMinimo`, `multiplicadorTempo`,
  `tempoTotal` (segundos) por turma.
- `ALUNOS` — listas de nomes por turma (o aluno escolhe o próprio nome).
- A **senha do professor não fica no código**: ela é validada no banco por `validar_admin`
  (hash bcrypt criado no `supabase.sql`). Para trocar, rode `supabase.sql` com a nova senha.
- `toleranciaSaida` — tolerância em ms antes de registrar uma saída de tela.
- `multiplicadorTempo` — estica o tempo das questões de uma turma inteira.

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
para `0.6` (pune menos a demora) ou usar tempo extra (PEI) na emissão do PIN.