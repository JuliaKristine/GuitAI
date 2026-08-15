# 🎸 GuitAI

> Sua música vira aula.

O GuitAI é uma aplicação educacional que tem como objetivo transformar músicas em aulas visuais e simplificadas de guitarra.

A proposta é permitir que uma pessoa escolha uma música que deseja aprender e receba uma versão adaptada ao seu nível de experiência, com acordes simplificados, diagramas visuais, posicionamento dos dedos, indicação das cordas e instruções passo a passo.

## 🎯 Objetivo

Tornar o aprendizado de guitarra mais simples, visual e acessível, especialmente para iniciantes.

Em vez de apresentar apenas cifras tradicionais, o GuitAI pretende ensinar como executar cada acorde e, futuramente, transformar músicas em aulas personalizadas.

## 🎸 Experiência planejada

Para cada acorde, o sistema deverá apresentar:

- nome do acorde;
- desenho do braço da guitarra;
- posição dos dedos;
- número das casas;
- cordas que devem ser tocadas;
- cordas que não devem ser tocadas;
- instruções simples;
- sequência de acordes;
- padrão de ritmo.

## 🚀 MVP

A primeira versão do GuitAI será focada no ensino visual de acordes básicos.

Acordes iniciais:

- G
- C
- D
- Em
- Am

O primeiro marco funcional será fazer o sistema receber um acorde e gerar automaticamente seu diagrama visual.

## 🛠️ Tecnologias

### Atualmente

- React
- TypeScript
- Vite
- CSS
- Git
- GitHub

### Planejadas

- Python
- FastAPI
- PostgreSQL
- Inteligência Artificial
- Spotify Web API
- Processamento de áudio

## 📌 Status

🚧 Projeto em desenvolvimento.

### Concluído

- [x] Configuração inicial
- [x] React + TypeScript + Vite
- [x] Estrutura de documentação
- [x] Primeira interface do GuitAI
- [x] Estrutura de dados dos acordes
- [x] Primeiro diagrama visual
- [x] Acorde G (Sol maior)
- [x] Posicionamento dos dedos

## 🗺️ Roadmap

### Fase 1 — Visualizador de acordes

- [x] Criar interface inicial
- [x] Criar estrutura de dados dos acordes
- [x] Criar componente de diagrama
- [x] Indicar dedos
- [x] Indicar cordas abertas
- [x] Indicar cordas que não devem ser tocadas
- [x] Criar instruções para iniciantes
- [x] Implementar G (Sol maior)
- [x] Implementar C (Dó maior)
- [x] Implementar D (Ré maior)
- [x] Implementar Em (Mi menor)
- [x] Implementar Am (Lá menor)
- [x] Criar seletor automático de acordes

### Fase 2 — Aula de guitarra

- [x] Criar sequência de acordes
- [x] Criar botão próximo acorde
- [x] Criar botão acorde anterior
- [x] Mostrar progresso da aula
- [x] Criar tela de conclusão
- [x] Ensinar troca entre acordes
- [x] Adicionar padrão de batida
- [x] Adicionar controle de BPM
- [x] Adicionar metrônomo
- [x] Criar modo de prática
- [x] Sincronizar troca de acordes com o ritmo

### Fase 3 — Inteligência Artificial

- [x] Avisar antecipadamente a próxima troca
- [x] Criar contagem regressiva para troca
- [x] Criar contagem antes da prática
- [x] Criar níveis de velocidade
- [x] Criar diferentes padrões de batida
- [x] Corrigir metrônomo do modo Aula
- [x] Adaptar dificuldade automaticamente
- [x] Criar músicas de demonstração

### Fase 4 — Spotify

- [x] Criar músicas de demonstração
- [x] Criar busca de músicas
- [x] Criar camada de serviço de músicas
- [x] Preparar estados de carregamento e erro
- [x] Criar backend inicial com FastAPI
- [x] Estruturar backend em serviços e rotas
- [x] Preparar configuração segura do backend
- [x] Configurar aplicação Spotify
- [x] Criar autenticação do backend com Spotify
- [x] Integrar busca real do Spotify
- [x] Selecionar uma faixa real
- [x] Criar representação interna GuitAISong
- [ ] Criar contrato de geração de aula
- [ ] Criar motor de geração de aula

### Fase 5 — Reconhecimento do instrumento

- [x] Criar GuitAISong
- [x] Criar contrato de geração de aula
- [x] Criar estados de geração
- [x] Criar interface MusicAnalysisProvider
- [x] Criar contrato de análise musical
- [x] Conectar geração à análise musical
- [x] Criar DemoMusicAnalysisProvider
- [x] Criar ChordSimplifier
- [x] Preservar acordes originais
- [ ] Criar motor pedagógico
- [ ] Gerar Lesson automaticamente
- [ ] Gerar dicas de troca de acordes
- [ ] Conectar Lesson ao modo Aula
- [ ] Conectar Lesson ao modo Prática