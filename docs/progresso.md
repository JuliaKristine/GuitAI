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

---

## Etapa 14 — Níveis de velocidade

### Status

✅ Concluída

### Implementado

O controle técnico de BPM do modo de prática foi
transformado em níveis de velocidade mais fáceis
de compreender.

### Níveis

- 🐢 Bem devagar — 40 BPM
- 🌱 Aprendendo — 60 BPM
- 🎸 Normal — 80 BPM
- 🚀 Desafio — 100 BPM

### Funcionamento

O aluno escolhe um nível utilizando uma linguagem
simples enquanto o GuitAI converte internamente
essa escolha para BPM.

Durante a execução da prática, a alteração de
velocidade fica bloqueada para evitar mudanças
acidentais no ritmo.

### Objetivo pedagógico

Evitar que iniciantes precisem compreender conceitos
técnicos de velocidade logo no início do aprendizado.

O aluno escolhe uma dificuldade intuitiva e o sistema
gerencia o tempo correspondente.

### Próxima etapa

Criar diferentes padrões de batida para que o aluno
avance além das quatro batidas simples para baixo.

---

## Etapa 15 — Padrões de batida e ajustes no metrônomo

### Status

✅ Concluída

### Implementado

O modo de prática passou a permitir diferentes padrões de batida.

Padrões disponíveis:

- 🥁 Batida fácil — ↓ ↓ ↓ ↓
- 🎵 Pop — ↓ ↓ ↑ ↑
- 🤘 Rock — ↓ ↑ ↓ ↑

Também foram mantidos os níveis de velocidade:

- 🐢 Bem devagar — 40 BPM
- 🌱 Aprendendo — 60 BPM
- 🎸 Normal — 80 BPM
- 🚀 Desafio — 100 BPM

### Correções

Foi corrigido o metrônomo da página Aula.

O botão "Praticar ritmo" agora:

- inicia o metrônomo sonoro;
- sincroniza o som com as batidas visuais;
- destaca o primeiro tempo;
- permite parar e iniciar novamente;
- mantém o controle de BPM.

### Resultado

O GuitAI agora possui dois ambientes funcionais:

- Aula: ensino passo a passo com treinamento de ritmo.
- Prática: progressão automática de acordes com metrônomo,
  níveis de velocidade e diferentes padrões de batida.

### Próxima etapa

Criar níveis de dificuldade que combinem automaticamente
acordes, ritmo e velocidade.

---

## Etapa 16 — Dificuldade adaptativa

### Status

✅ Concluída

### Implementado

Foi criado o primeiro sistema de perfis de dificuldade
do GuitAI.

O sistema agora consegue adaptar automaticamente:

- acordes disponíveis;
- progressão de prática;
- velocidade inicial;
- padrão de batida.

### Níveis

#### 🧸 Iniciante absoluto

- G e Em
- 40 BPM
- Batida fácil

#### 🌱 Iniciante

- G, Em, C e D
- 60 BPM
- Batida fácil

#### 🎸 Em evolução

- G, Em, C e D
- 80 BPM
- Batida Pop

### Arquitetura

Foi criado:

`src/data/difficulty.ts`

Responsável por armazenar os perfis pedagógicos.

Também foi criado:

`DifficultySelector`

para permitir a escolha do nível na interface.

### Objetivo

Criar a base para que futuramente a Inteligência
Artificial consiga selecionar automaticamente uma
configuração adequada para cada aluno.

### Próxima etapa

Criar músicas de demonstração utilizando o motor
educacional existente.

---

## Etapa 17 — Músicas de demonstração

### Status

✅ Concluída

### Implementado

O GuitAI deixou de trabalhar apenas com uma aula fixa
e passou a possuir uma estrutura de músicas.

Foi criada a entidade `DemoSong`, contendo:

- título;
- artista;
- descrição;
- dificuldade;
- progressão de acordes;
- aula correspondente.

### Músicas disponíveis

#### 🌱 Primeiros Passos

Artista: GuitAI Demo

Progressão:

G → Em → C → D

#### 🚗 Estrada Aberta

Artista: The Purple Strings

Progressão:

Em → C → G → D

#### ⚡ Noite Elétrica

Artista: Neon Chords

Progressão:

G → D → Em → C

### Novo componente

Foi criado:

`SongSelector`

responsável por permitir que o aluno escolha
qual música deseja aprender.

### Integração

A música selecionada agora alimenta tanto:

- LessonPlayer;
- PracticeMode.

Ao trocar de música, os componentes educacionais
são reiniciados automaticamente.

### Arquitetura

```text
DemoSong
   │
   ├── informações da música
   │
   └── Lesson
         │
         ├── acordes
         ├── ritmo
         ├── BPM
         └── instruções
                │
        ┌───────┴────────┐
        ▼                ▼
  LessonPlayer      PracticeMode

  ---

## Etapa 18 — Busca de músicas

### Status

✅ Concluída

### Implementado

Foi criada uma interface de busca de músicas.

O aluno agora pode pesquisar utilizando:

- nome da música;
- nome do artista.

### Funcionamento atual da música;
- nome do artista.

### Funcionamento atual

A busca utiliza localmente as músicas de
demonstração disponíveis no GuitAI.

Os resultados apresentam:

- título;
- artista;
- nível;
- progressão de acordes;
- botão para iniciar o aprendizado.

### Novo componente

Foi criado:

`SongSearch`

Responsável pela interface e filtragem
dos resultados de busca.

### Fluxo

```text
Busca
  ↓
Resultados
  ↓
Música selecionada
  ↓
Lesson
  ↓
Aula / Prática

---

## Etapa 19 — Camada de serviço de músicas

### Status

✅ Concluída

### Implementado

Foi criada uma camada de serviço responsável
pelo acesso às músicas do GuitAI.

Arquivo criado:

`src/services/songService.ts`

### Responsabilidades

O serviço possui atualmente as operações:

- listar músicas;
- encontrar uma música por ID;
- pesquisar músicas;
- filtrar por título;
- filtrar por artista.

### Arquitetura anterior

```text
Interface
   ↓
demoSongs

---

## Etapa 20 — Busca assíncrona

### Status

✅ Concluída

### Implementado

A busca de músicas passou a funcionar de forma
assíncrona, simulando o comportamento de uma API.

### Novos estados

A interface agora suporta:

- carregamento;
- resultado;
- nenhum resultado;
- erro;
- tentativa novamente.

### Debounce

Foi adicionada uma pequena espera após a digitação
antes de executar a busca.

Isso evita executar uma nova operação para cada
tecla pressionada.

### Proteção contra respostas antigas

Foi criado um controle de identificação das buscas.

Caso duas pesquisas sejam executadas em sequência,
uma resposta antiga não pode sobrescrever o
resultado da pesquisa mais recente.

### Normalização da pesquisa

A busca também passou a ignorar diferenças de:

- letras maiúsculas e minúsculas;
- acentos.

Exemplo:

`eletrica`

pode encontrar:

`Noite Elétrica`

### Arquitetura

```text
SongSearch
   ↓
debounce
   ↓
loading
   ↓
songService
   ↓
Promise
   ↓
sucesso / erro

---

## Etapa 21 — Backend inicial com FastAPI

### Status

✅ Concluída

### Implementado

Foi criado o primeiro backend do GuitAI utilizando
Python e FastAPI.

### Estrutura

`backend/app/main.py`

`backend/requirements.txt`

### Endpoints

#### GET /health

Permite verificar se a API está funcionando.

#### GET /songs/search

Permite pesquisar músicas por:

- título;
- artista.

### Integração

O frontend React passou a realizar uma requisição
HTTP real para o backend.

Fluxo atual:

```text
SongSearch
   ↓
songService
   ↓
HTTP
   ↓
FastAPI
   ↓
busca
   ↓
resultado

---

## Etapa 22 — Organização do backend

### Status

✅ Concluída

### Objetivo

Organizar o backend FastAPI em camadas,
evitando concentrar todas as responsabilidades
no arquivo `main.py`.

### Nova estrutura

```text
backend/app/
├── main.py
├── routes/
│   ├── health.py
│   └── songs.py
├── services/
│   └── song_service.py
├── schemas/
│   └── song.py
└── data/
    └── songs.py

---

## Etapa 23 — Configuração segura do backend

### Status

✅ Concluída

### Objetivo

Preparar o backend para trabalhar com
configurações externas e credenciais privadas.

### Implementado

Foi criada uma camada de configuração utilizando
Pydantic Settings.

Arquivo:

`backend/app/config.py`

### Variáveis configuráveis

Atualmente o backend suporta:

- APP_NAME
- APP_DESCRIPTION
- APP_VERSION
- APP_ENV
- CORS_ORIGINS
- SPOTIFY_CLIENT_ID
- SPOTIFY_CLIENT_SECRET

### Arquivos de ambiente

Foi criado:

`backend/.env.example`

Esse arquivo documenta quais configurações são
necessárias e pode ser versionado no GitHub.

Também é utilizado localmente:

`backend/.env`

O arquivo `.env` não deve ser versionado.

### Segurança

Credenciais de serviços externos não serão
armazenadas diretamente no código-fonte.

O Client Secret do Spotify deverá existir apenas
na configuração privada do ambiente.

### Endpoint de diagnóstico

Foi criado:

`GET /config/status`

A rota informa se a integração do Spotify está
configurada sem expor as credenciais.

### Arquitetura

```text
.env
  ↓
Settings
  ↓
config.py
  ↓
┌──────────────┬───────────────┐
▼              ▼               ▼
FastAPI       CORS        Serviços externos
                              ↓
                           Spotify---

## Etapa 23 — Configuração segura do backend

### Status

✅ Concluída

### Objetivo

Preparar o backend para trabalhar com
configurações externas e credenciais privadas.

### Implementado

Foi criada uma camada de configuração utilizando
Pydantic Settings.

Arquivo:

`backend/app/config.py`

### Variáveis configuráveis

Atualmente o backend suporta:

- APP_NAME
- APP_DESCRIPTION
- APP_VERSION
- APP_ENV
- CORS_ORIGINS
- SPOTIFY_CLIENT_ID
- SPOTIFY_CLIENT_SECRET

### Arquivos de ambiente

Foi criado:

`backend/.env.example`

Esse arquivo documenta quais configurações são
necessárias e pode ser versionado no GitHub.

Também é utilizado localmente:

`backend/.env`

O arquivo `.env` não deve ser versionado.

### Segurança

Credenciais de serviços externos não serão
armazenadas diretamente no código-fonte.

O Client Secret do Spotify deverá existir apenas
na configuração privada do ambiente.

### Endpoint de diagnóstico

Foi criado:

`GET /config/status`

A rota informa se a integração do Spotify está
configurada sem expor as credenciais.

### Arquitetura

```text
.env
  ↓
Settings
  ↓
config.py
  ↓
┌──────────────┬───────────────┐
▼              ▼               ▼
FastAPI       CORS        Serviços externos
                              ↓
                           Spotify

---

## Etapa 24 — Autenticação com Spotify

### Status

✅ Concluída

### Implementado

Foi criada a primeira integração real entre
o backend do GuitAI e o Spotify Web API.

### Autenticação

Foi utilizado o fluxo:

Client Credentials

Esse fluxo permite que o backend se autentique
como aplicação sem expor as credenciais ao frontend.

### Segurança

As credenciais ficam armazenadas somente em:

`backend/.env`

As seguintes informações não são enviadas ao React:

- Spotify Client ID
- Spotify Client Secret
- Access Token

### Serviço criado

`backend/app/services/spotify_service.py`

Responsabilidades:

- solicitar access token;
- reutilizar token ainda válido;
- controlar expiração;
- tratar erros de autenticação.

### Endpoint criado

`GET /spotify/status`

Permite verificar se a comunicação com o Spotify
está funcionando sem expor o access token.

### Arquitetura

```text
React
  ↓
GuitAI Backend
  ↓
Spotify Service
  ↓
Spotify Accounts
  ↓
Access Token

---

## Etapa 25 — Busca real do Spotify

### Status

✅ Concluída

### Implementado

O GuitAI passou a pesquisar músicas reais
utilizando o catálogo do Spotify Web API.

### Backend

Foi criado o endpoint:

`GET /spotify/search`

A rota recebe uma pesquisa e solicita
resultados ao Spotify utilizando o token
obtido pelo backend.

### Informações retornadas

Cada resultado inclui:

- Spotify ID;
- título;
- artista;
- álbum;
- capa;
- URL no Spotify;
- duração;
- indicação de conteúdo explícito.

### Mercado

A busca inicial utiliza:

`BR`

como mercado configurável.

A variável pode ser alterada através de:

`SPOTIFY_MARKET`

### Segurança

O frontend não recebe:

- Client ID;
- Client Secret;
- Access Token.

Todo acesso ao Spotify é realizado pelo
backend.

### Fluxo

```text
SongSearch
    ↓
spotifyService
    ↓
FastAPI
    ↓
Spotify Service
    ↓
Spotify Web API
    ↓
Resultados

---

## Etapa 26 — Faixa Spotify para GuitAISong

### Status

✅ Concluída

### Implementado

O GuitAI passou a permitir a seleção de uma
faixa real encontrada no Spotify.

Foi adicionado o botão:

`🎸 Aprender esta música`

### Pipeline

A seleção agora segue o fluxo:

```text
SpotifyTrack
    ↓
POST /songs/prepare
    ↓
GuitAISong
    ↓
waiting_for_lesson

---

## Etapa 27 — Contrato de geração de aula

### Status

✅ Concluída

### Implementado

Foi criado o primeiro pipeline estruturado
para geração de aulas do GuitAI.

### Estados

Uma geração pode possuir os estados:

- pending
- processing
- completed
- failed

### Entrada

A geração recebe:

- música interna do GuitAI;
- nível de dificuldade.

### Níveis

- Iniciante absoluto
- Iniciante
- Em evolução

### Saída planejada

Quando uma geração for concluída, o contrato
permite retornar:

- acordes;
- acordes simplificados;
- ritmo;
- BPM;
- sequência de batidas;
- passos da aula;
- instruções;
- dicas;
- notas de simplificação.

### Segurança pedagógica

Nenhum acorde é inventado nesta etapa.

O processo chega ao estado `processing`,
mas só poderá produzir uma aula quando
uma fonte de análise musical apropriada
for conectada.

### Backend

Foram criados:

`schemas/lesson_generation.py`

`services/lesson_generation_service.py`

`routes/lesson_generations.py`

### Endpoints

`POST /lesson-generations`

`GET /lesson-generations/{id}`

`POST /lesson-generations/{id}/start`

### Frontend

Foram criados:

`types/lessonGeneration.ts`

`services/lessonGenerationService.ts`

`components/LessonGeneration`

### Fluxo

```text
Spotify Track
     ↓
GuitAISong
     ↓
LessonGeneration
     ↓
pending
     ↓
processing
     ↓
futuro motor musical
     ↓
completed / failed

---

## Etapa 28 — MusicAnalysisProvider

### Status

✅ Concluída

### Objetivo

Separar a descoberta de músicas da análise musical.

O Spotify continua responsável por identificar
músicas e fornecer metadados.

A análise de acordes, ritmo, BPM e estrutura
passa a possuir uma camada independente.

### Interface criada

Foi criada:

`MusicAnalysisProvider`

Todo provedor de análise musical deverá implementar
essa interface.

### Contrato de análise

Uma análise poderá fornecer:

- BPM;
- tonalidade;
- compasso;
- acordes;
- posição dos acordes na música;
- nível de confiança.

### Arquivos

Foram criados:

`schemas/music_analysis.py`

`providers/music_analysis_base.py`

`providers/unavailable_music_analysis.py`

`services/music_analysis_service.py`

`routes/music_analysis.py`

### Provider atual

O provider inicial é:

`unavailable`

Ele não inventa dados musicais.

Quando nenhuma fonte confiável estiver configurada,
a API retorna:

`status: unavailable`

### Endpoints

`GET /music-analysis/status`

`POST /music-analysis/{song_id}`

### Arquitetura

```text
Spotify
   ↓
GuitAISong
   ↓
MusicAnalysisProvider
   ↓
MusicAnalysis
   ↓
Motor pedagógico
   ↓
Lesson

---

## Etapa 29 — Integração entre geração e análise musical

### Status

✅ Concluída

### Implementado

O processo de geração de aulas passou a consultar
diretamente a camada `MusicAnalysisProvider`.

### Novo fluxo

```text
LessonGeneration
    ↓
processing
    ↓
MusicAnalysisProvider
    ↓
MusicAnalysisResult

---

## Etapa 30 — DemoMusicAnalysisProvider

### Status

✅ Concluída

### Objetivo

Criar uma primeira fonte controlada de dados
musicais para desenvolver o motor pedagógico
sem atribuir dados inventados a músicas reais.

### Provider

Foi criado:

`DemoMusicAnalysisProvider`

O provider utiliza exclusivamente dados das
músicas fictícias do GuitAI.

### Dados disponíveis

#### Primeiros Passos

- G
- Em
- C
- D
- 60 BPM
- 4/4

#### Estrada Aberta

- Em
- C
- G
- D
- 70 BPM
- 4/4

#### Noite Elétrica

- G
- D
- Em
- C
- 80 BPM
- 4/4

### Segurança

O provider demo não fornece análises para
faixas reais do Spotify.

Caso receba um Spotify ID, retorna:

`status: unavailable`

### Configuração

Em desenvolvimento pode ser utilizado:

`MUSIC_ANALYSIS_PROVIDER=demo`

O padrão seguro continua sendo:

`MUSIC_ANALYSIS_PROVIDER=unavailable`

### Pipeline validado

Uma música demo agora pode seguir:

```text
LessonGeneration
    ↓
pending
    ↓
processing
    ↓
DemoMusicAnalysisProvider
    ↓
ready
    ↓
analysis_ready

