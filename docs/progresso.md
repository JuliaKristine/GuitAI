# 📈 Progresso do GuitAI

Este documento registra a evolução do desenvolvimento do GuitAI.

---

## Etapa 1 — Inicialização do projeto

### Status

✅ Concluída

### Implementado

- Projeto criado com Vite e TypeScript.
- React adicionado ao projeto.
- Configuração do React realizada com `@vitejs/plugin-react`.
- Arquivos principais convertidos para TSX.
- Git inicializado.
- Estrutura inicial de documentação criada.

### Objetivo

Preparar a base técnica para o desenvolvimento da aplicação.

---

## Etapa 2 — Interface inicial

### Status

✅ Concluída

### Implementado

- Remoção da interface padrão do Vite.
- Criação da identidade inicial do GuitAI.
- Criação da tela inicial da aplicação.
- Apresentação da proposta do produto.
- Criação do card da primeira aula.
- Identificação do nível iniciante.
- Espaço reservado para o diagrama de acordes.
- Layout responsivo.

### Tecnologias utilizadas

- React
- TypeScript
- Vite
- CSS

### Resultado

O GuitAI agora possui sua primeira interface própria.

A aplicação apresenta sua proposta educacional e já possui a estrutura visual que futuramente mostrará os acordes e as instruções de guitarra.

O diagrama atual ainda é apenas um espaço reservado.

---

## Próxima etapa

### Etapa 3 — Estrutura de dados dos acordes

O próximo objetivo será ensinar ao sistema como representar um acorde.

O primeiro acorde implementado será:

**G — Sol maior**

O sistema deverá conhecer:

- quais dedos utilizar;
- em quais cordas posicioná-los;
- em quais casas posicioná-los;
- quais cordas devem ser tocadas;
- quais cordas devem ser evitadas.

---

## Etapa 3 — Primeiro acorde e diagrama visual

### Status

✅ Concluída

### Implementado

- Criação da estrutura de dados dos acordes.
- Criação do tipo `FingerPosition`.
- Criação do tipo `Chord`.
- Cadastro do primeiro acorde: G (Sol maior).
- Criação do componente `ChordDiagram`.
- Renderização dinâmica das cordas e casas.
- Exibição visual da posição dos dedos.
- Exibição das instruções de posicionamento.

### Primeiro acorde

O primeiro acorde implementado foi o G (Sol maior).

Posições utilizadas:

- Dedo 1 → corda 5, casa 2
- Dedo 2 → corda 6, casa 3
- Dedo 3 → corda 1, casa 3

Todas as seis cordas podem ser tocadas.

### Arquitetura

Os dados musicais ficam separados da interface.

```text
chords.ts
    ↓
ChordDiagram.tsx
    ↓
App.tsx
    ↓
Interface

---

## Etapa 4 — Melhorias didáticas no diagrama

### Status

✅ Concluída

### Implementado

- Adição da numeração das cordas.
- Adição da numeração das casas.
- Identificação visual de cordas soltas.
- Preparação para identificação de cordas que não devem ser tocadas.
- Criação de legenda para os símbolos do diagrama.
- Identificação dos dedos pelo nome:
  - Indicador
  - Médio
  - Anelar
  - Mindinho
- Melhoria da apresentação das instruções.
- Adição da orientação de palhetada.
- Melhoria do espaçamento e legibilidade do diagrama.

### Convenções visuais

O GuitAI utiliza:

- `○` para indicar uma corda que deve ser tocada solta.
- `×` para indicar uma corda que não deve ser tocada.
- Números de `1` a `4` para representar os dedos da mão.

### Resultado

O diagrama do acorde G agora apresenta informações suficientes
para que um usuário iniciante consiga identificar as cordas,
as casas e a posição correta dos dedos.

### Próxima etapa

Adicionar novos acordes para validar se o componente consegue
representar diferentes formações automaticamente.

O próximo acorde será C (Dó maior).

---

## Etapa 5 — Múltiplos acordes e seleção dinâmica

### Status

✅ Concluída

### Implementado

- Adição do acorde C (Dó maior).
- Criação da seleção dinâmica de acordes.
- Alternância entre G e C sem recarregar a aplicação.
- Validação da reutilização do componente `ChordDiagram`.
- Implementação do símbolo `×` para cordas que não devem ser tocadas.
- Geração automática da instrução de palhetada.
- Identificação automática da primeira corda que deve ser tocada.

### Acorde C — Dó maior

Posições:

- Dedo 1 — Indicador → corda 2, casa 1
- Dedo 2 — Médio → corda 4, casa 2
- Dedo 3 — Anelar → corda 5, casa 3
- Corda 6 → não tocar
- Cordas 3 e 1 → tocar soltas

### Validação da arquitetura

O componente `ChordDiagram` não precisou possuir uma versão específica
para cada acorde.

Os dados são armazenados em `chords.ts` e o componente utiliza essas
informações para gerar o diagrama automaticamente.

```text
chords.ts
   │
   ├── G
   └── C
        │
        ▼
ChordDiagram
        │
        ▼
Diagrama visual

---

## Etapa 6 — Biblioteca inicial de acordes

### Status

✅ Concluída

### Implementado

Foi criado o primeiro conjunto de acordes destinado a iniciantes.

Acordes disponíveis:

- G — Sol maior
- C — Dó maior
- D — Ré maior
- Em — Mi menor
- Am — Lá menor

Também foi implementada a geração dinâmica dos botões de seleção.

Os botões agora são criados automaticamente a partir dos acordes
cadastrados no arquivo `chords.ts`.

### Arquitetura

```text
chords.ts
    ↓
lista de acordes
    ↓
seletor automático
    ↓
ChordDiagram
    ↓
diagrama visual

---

## Etapa 7 — Primeira aula interativa

### Status

✅ Concluída

### Implementado

O GuitAI passou a possuir uma estrutura de aula passo a passo.

Foi criada a primeira aula para iniciantes com a sequência:

G → Em → C → D

### Funcionalidades

- Navegação entre os acordes.
- Botão para avançar.
- Botão para retornar.
- Indicação da etapa atual.
- Barra de progresso.
- Instruções específicas para cada acorde.
- Dicas didáticas.
- Tela de conclusão.
- Opção de repetir a aula.

### Arquitetura

Foi criado o arquivo:

`src/data/lessons.ts`

Ele contém os dados pedagógicos das aulas.

Também foi criado:

`src/components/LessonPlayer/LessonPlayer.tsx`

Responsável por controlar a execução da aula.

```text
lessons.ts
     ↓
LessonPlayer
     ↓
ChordDiagram
     ↓
Aula visual

---

## Etapa 8 — Ensino de troca entre acordes

### Status

✅ Concluída

### Implementado

O GuitAI passou a ensinar não apenas a formação dos acordes,
mas também a movimentação necessária para trocar entre eles.

Foram adicionadas orientações específicas para as transições:

- G → Em
- Em → C
- C → D

### Componente criado

Foi criado:

`src/components/ChordTransition/ChordTransition.tsx`

O componente apresenta visualmente as instruções necessárias
para realizar uma troca de acorde.

### Orientações utilizadas

A interface utiliza símbolos simples:

- 🟢 dedo pode permanecer;
- 🟡 dedo deve ser movimentado;
- ⚪ dedo deve ser retirado;
- ➕ dedo deve ser adicionado;
- 🚫 corda que não deve ser tocada.

### Arquitetura

```text
lessons.ts
     ↓
ChordTransition
     ↓
LessonPlayer
     ↓
Aluno

---

## Etapa 9 — Ritmo visual e controle de BPM

### Status

✅ Concluída

### Implementado

Foi criado o primeiro sistema de treinamento de ritmo do GuitAI.

A primeira aula agora possui um padrão simples de quatro
batidas para baixo.

Padrão:

1 → ↓  
2 → ↓  
3 → ↓  
4 → ↓

### Componente criado

`src/components/RhythmTrainer/RhythmTrainer.tsx`

O componente é responsável por:

- apresentar o padrão de batida;
- destacar visualmente cada tempo;
- controlar a execução da prática;
- permitir alterar a velocidade;
- apresentar o valor atual de BPM.

### BPM

A velocidade pode ser ajustada entre:

40 BPM e 120 BPM.

O valor inicial da primeira aula é:

60 BPM.

### Arquitetura

```text
lessons.ts
     ↓
RhythmPattern
     ↓
RhythmTrainer
     ↓
animação das batidas

---

## Etapa 11 — Modo Prática

### Status

✅ Concluída

### Implementado

Foi criado o primeiro modo de prática do GuitAI.

O aluno agora pode praticar uma progressão
completa de acordes acompanhando o metrônomo.

### Progressão inicial

G → Em → C → D

Cada acorde permanece ativo durante um ciclo
de quatro batidas.

Após o quarto tempo, o sistema seleciona
automaticamente o próximo acorde.

### Funcionalidades

- Modo Aula.
- Modo Prática.
- Alternância entre os dois modos.
- Progressão automática de acordes.
- Destaque do acorde atual.
- Visualização do próximo acorde.
- Diagrama atualizado automaticamente.
- Metrônomo sincronizado.
- Indicador visual das batidas.
- Controle de BPM.
- Início e interrupção da prática.

### Componente criado

`src/components/PracticeMode/PracticeMode.tsx`

### Arquitetura

```text
Lesson
   ↓
Progressão
   ↓
PracticeMode
   │
   ├── ChordDiagram
   ├── RhythmPattern
   ├── BPM
   └── Web Audio
          ↓
        aluno

---

## Etapa 12 — Preparação antecipada para troca de acordes

### Status

✅ Concluída

### Implementado

O modo de prática passou a avisar o aluno antes
da próxima troca de acorde.

Durante os últimos tempos de cada acorde, o GuitAI
mostra qual acorde será tocado em seguida e apresenta
uma contagem regressiva.

### Exemplo

G → Em

Durante a execução do G:

- 3 tempos restantes → preparar Em
- 2 tempos restantes → preparar Em
- 1 tempo restante → preparar Em
- próximo tempo → Em

### Funcionalidades

- Identificação automática do próximo acorde.
- Aviso visual antecipado.
- Contagem regressiva 3, 2, 1.
- Aviso especial na última batida.
- Sincronização com BPM.
- Funcionamento contínuo durante toda a progressão.

### Objetivo pedagógico

Dar tempo para o iniciante visualizar e preparar
mentalmente a próxima posição antes que a troca
realmente aconteça.

Isso reduz a sensação de surpresa durante a prática
e aproxima o comportamento do GuitAI de um professor
guiando o aluno em tempo real.

### Próxima etapa

Criar uma contagem inicial antes do metrônomo começar:

3 → 2 → 1 → tocar.

---

## Etapa 13 — Contagem inicial da prática

### Status

✅ Concluída

### Implementado

Foi adicionada uma contagem inicial antes do início
do modo de prática.

A sequência apresentada ao aluno é:

3 → 2 → 1 → VAI!

Somente após a contagem o metrônomo começa a tocar.

### Funcionalidades

- Contagem regressiva antes da prática.
- Preparação visual para o primeiro acorde.
- Indicação do acorde inicial.
- Mensagem "VAI!" sincronizada com o início.
- Possibilidade de cancelar a contagem.
- Início do metrônomo somente após a preparação.

### Objetivo pedagógico

Dar ao aluno tempo suficiente para posicionar
corretamente os dedos antes que o ritmo comece.

Isso evita que o iniciante tenha que montar o
primeiro acorde enquanto o metrônomo já está tocando.

### Fluxo

3  
↓  
2  
↓  
1  
↓  
VAI!  
↓  
G  
↓ ↓ ↓ ↓  
↓  
Em  
↓ ↓ ↓ ↓

### Próxima etapa

Criar níveis de velocidade para que o aluno
não precise entender BPM logo no início.

