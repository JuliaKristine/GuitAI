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

