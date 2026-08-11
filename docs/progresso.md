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