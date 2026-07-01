<div align="center">

# 🌙 Lunar Cycle

### Bem-estar, autoconhecimento e o ciclo menstrual sob a luz das fases da lua

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
![GitHub last commit](https://img.shields.io/github/last-commit/kaylannesatiro/lunar-cycle?style=flat-square)
![GitHub License](https://img.shields.io/github/license/kaylannesatiro/lunar-cycle?style=flat-square&color=blue)
![GitHub Repo stars](https://img.shields.io/github/stars/kaylannesatiro/lunar-cycle?style=flat-square&color=gold)

</div>

<br>

---

## 📝 Descrição

**Lunar Cycle** é uma plataforma web de bem-estar pessoal que une três dimensões em uma única experiência: o **rastreamento fisiológico do ciclo menstrual**, a **observação astronômica das fases da lua** e o **registro introspectivo de um diário de sonhos**.

Diferente dos aplicativos de rastreamento convencionais — que tratam o corpo de forma estritamente clínica e biométrica — o Lunar Cycle adota uma abordagem holística e mística, reconhecendo a correlação histórica e cultural entre o ciclo menstrual e as fases lunares.

**Problema que resolve:** ferramentas de rastreamento tradicionais costumam ser impessoais e ignoram a dimensão simbólica do ciclo. O Lunar Cycle centraliza, em um único espaço privado, o histórico menstrual, lunar e onírico da usuária, cruzando essas informações em mensagens contextuais que favorecem o autoconhecimento.

**Público-alvo:** pessoas que menstruam e buscam uma experiência de autoconhecimento mais profunda — unindo saúde, espiritualidade e introspecção — em uma plataforma de uso **individual e privado**.

**Objetivo:** prover uma plataforma contínua e imersiva que correlacione automaticamente o ciclo da usuária às fases da lua, ofereça previsões de ciclos futuros baseadas no histórico e disponibilize um diário de sonhos completo, com tags e filtros dinâmicos.

> 🎓 **Contexto acadêmico:** projeto desenvolvido no curso de Engenharia de Software da **Universidade Federal do Ceará (UFC) — Campus Quixadá**

---

## ✨ Funcionalidades

### 🔑 Autenticação e Conta
- Criação de conta com nome, e-mail, duração do ciclo, duração da menstruação, signo e senha
- Login com e-mail e senha, com proteção de rotas para visitantes não autenticados
- Recuperação de senha por e-mail, com link/token de validade de 60 minutos
- Edição de dados pessoais e troca de senha a qualquer momento, sem depender de suporte técnico
- Logout com invalidação imediata do token de sessão

### 🌙 Ciclo Menstrual e Calendário Lunar
- Tela Home com o dia atual do ciclo, a fase lunar do dia e uma mensagem contextual personalizada
- Marcação rápida do dia de menstruação direto pela Home, sem precisar abrir o Calendário
- Calendário mensal com ícone de fase lunar em cada dia, além de dias registrados, dias previstos e o dia atual destacados visualmente
- Previsão automática do próximo ciclo, recalculada a cada novo registro ou remoção

### 📖 Diário de Sonhos
- Criação de registros com título, data, descrição (até 5.000 caracteres) e até 10 tags por entrada
- Cálculo e associação automática da fase lunar correspondente à noite de cada sonho
- Visualização completa de cada registro, com edição e exclusão (mediante confirmação)
- Listagem cronológica com indicadores visuais (fase lunar e tags)
- Filtros combináveis por tag e por período de datas

---

## 🏗️ Arquitetura

O frontend segue uma **arquitetura baseada em componentes**, com separação explícita entre componentes puramente visuais e componentes com regra de negócio, uma camada de serviços dedicada à comunicação com a API, e um padrão de layout fixo que evita recriar menu/rodapé a cada navegação. O backend expõe uma API consumida pelo frontend, persistindo os dados em um banco PostgreSQL.

### Visão geral do sistema

```mermaid
flowchart TD
    A["👩 Usuária<br/>Navegador"] --> B["Frontend — React + Vite<br/>porta 5173"]
    B -->|"HTTP/JSON<br/>+ Token de Sessão"| C["Backend — Node.js<br/>porta 3000"]
    C --> D[("PostgreSQL 16")]
    D --> C
    C -->|"Resposta JSON"| B
    B --> A
```

---

## 🛠️ Tecnologias

| Tecnologia | Finalidade |
|---|---|
| **React** | Biblioteca para construção da interface via componentes |
| **Vite** | Build tool e servidor de desenvolvimento do frontend (HMR rápido) |
| **JavaScript (JSX)** | Linguagem principal do frontend — não há uso de TypeScript |
| **CSS3** | Estilização das telas e componentes |
| **Node.js** | Runtime do backend |
| **PostgreSQL 16** | Banco de dados relacional (`postgres:16-alpine`) |
| **Docker / Docker Compose** | Orquestração dos três serviços (frontend, backend, banco) |
| **ESLint** | Padronização e qualidade do código JavaScript |

---

## 📦 Bibliotecas

| Biblioteca | Finalidade |
|---|---|
| **Framer Motion** | Animações de interface |
| **React Router DOM** | Sistema de rotas e o componente `<Outlet />` usado pelo `MainLayout` |

---

## ✅ Pré-requisitos

| Requisito | Versão | Observação |
|---|---|---|
| Node.js | ⚠ não especificada (recomenda-se a versão LTS) | necessário para rodar frontend e backend fora do Docker |
| npm | distribuído com o Node.js | gerenciador de pacotes do projeto |
| Docker e Docker Compose | ⚠ versão não especificada (`docker-compose.yml` usa a sintaxe `3.8`) | necessário apenas para o fluxo via Docker |
| Git | qualquer versão recente | para clonar o repositório |
| PostgreSQL | 16 | apenas se for rodar **sem** Docker (versão usada na imagem `postgres:16-alpine`) |

---

## ⚙️ Instalação

### Opção 1 — Usando Docker (recomendado)

```bash
# 1. Clone o repositório
git clone https://github.com/kaylannesatiro/lunar-cycle.git
cd lunar-cycle

# 2. Suba os três serviços (banco de dados, backend e frontend)
docker compose up --build
```

### Opção 2 — Instalação manual (sem Docker)

```bash
# 1. Clone o repositório
git clone https://github.com/kaylannesatiro/lunar-cycle.git
cd lunar-cycle

# 2. Instale as dependências do backend
cd backend
npm install

# 3. Em outro terminal, instale as dependências do frontend
cd frontend
npm install
```

Para a instalação manual, é necessário também ter um PostgreSQL 16 rodando localmente, com um banco e usuário equivalentes aos definidos no `docker-compose.yml` (ver seção [Configuração](#configuração)).

---

## 🔧 Configuração

O projeto utiliza variáveis de ambiente para apontar o frontend ao backend e o backend ao banco de dados. Os valores abaixo são exatamente os declarados no `docker-compose.yml` do repositório.

#### `backend/.env`
```env
PORT=3000
DATABASE_URL=postgresql://lunar_user:lunar_password@localhost:5432/lunar_cycle
```

#### `frontend/.env`
```env
VITE_API_URL=http://localhost:3000
```

> 💡 Caso utilize Docker, **não é necessário criar esses arquivos `.env` manualmente**: o `docker-compose.yml` já injeta essas variáveis diretamente nos containers.

---

## ▶️ Executando

#### Modo desenvolvimento (manual)
```bash
# Backend
cd backend
node index.js 

# Frontend (em outro terminal)
cd frontend
npm run dev
```
O frontend ficará disponível em **http://localhost:5173**; o backend, em **http://localhost:3000**.

#### Com Docker
```bash
docker compose up
```

#### Build de produção (frontend)
```bash
cd frontend
npm run build
npm run preview
```

---

## 🧪 Como Testar

Um passo a passo pensado para quem nunca viu o projeto:

1. Suba o ambiente seguindo a seção [Instalação](#instalação) — Docker é o caminho mais rápido.
2. Acesse **http://localhost:5173** no navegador.
3. Você verá a tela de **Login**. Como ainda não tem conta, use o link para **Criar Conta**.
4. Preencha nome, e-mail, duração do ciclo, duração da menstruação, signo e senha, e confirme — você será autenticada automaticamente e redirecionada para a **Home**.
5. Na Home, observe a fase lunar do dia e a mensagem contextual; use o controle rápido para marcar o dia atual como dia de menstruação.
6. Acesse o **Calendário** para ver o mês completo, com fases lunares, dias registrados e dias previstos.
7. Vá ao **Diário de Sonhos** e crie um novo registro (título, data, descrição e tags); em seguida, visualize, edite e por fim exclua-o, para testar o fluxo completo.
8. Use os filtros do Diário (por tag e por período) para testar a busca.
9. Acesse **Configurações da Conta** para editar dados ou trocar a senha.
10. Use o **Logout** para encerrar a sessão e confirme o redirecionamento para o Login.

---

## 🔄 Fluxo da Aplicação

```
Usuária
   ↓
Rotas (React Router)
   ↓
Layout (MainLayout / AuthLayout)
   ↓
Página (pages/)
   ↓
Componentes (common/ e features/)
   ↓
Serviços (api/services)
   ↓
api.js (configuração + token)
   ↓
API do Backend (Node.js)
   ↓
PostgreSQL
   ↓
Resposta (JSON) → interface atualizada
```

```mermaid
sequenceDiagram
    actor U as Usuária
    participant R as Rotas
    participant P as Página
    participant C as Componente
    participant S as Service
    participant A as Backend
    participant D as PostgreSQL

    U->>R: Acessa uma URL
    R->>P: Resolve e renderiza a Página
    P->>C: Distribui os dados para os Componentes
    C->>S: Dispara uma ação (ex.: salvar registro)
    S->>A: Requisição HTTP + token
    A->>D: Consulta ou persiste dados
    D-->>A: Retorna os dados
    A-->>S: Resposta em JSON
    S-->>C: Atualiza o estado local
    C-->>U: Interface atualizada
```

---

## 📐 Padrões Utilizados

| Padrão | Como é aplicado |
|---|---|
| **Componentização (Smart/Dumb)** | `components/common` reúne componentes "burros" (puramente visuais, sem regra de negócio); `components/features` reúne componentes "inteligentes" (com lógica e regras do domínio) |
| **Separação de Responsabilidades** | Páginas buscam e distribuem dados; componentes exibem; `services/` conversam com a API; `utils/` concentra cálculos puros |
| **Layout Pattern (`<Outlet />`)** | `MainLayout.jsx` mantém Menu, Footer e fundo fixos, injetando a página atual via `<Outlet />` |
| **Camada de Serviços (Service Layer)** | `api/api.js` centraliza a configuração HTTP e o token; `api/services/*.js` isola as chamadas por domínio |

---

## 👥 Equipe

Projeto acadêmico do curso de Engenharia de Software — UFC Campus Quixadá.

| Nome | Função | GitHub |
|---|---|---|
| Kaylanne Sátiro | Desenvolvimento Frontend / Líder do Projeto | [@kaylannesatiro](https://github.com/kaylannesatiro) |
| Carla Cristina |  Desenvolvimento Frontend / Documentação | [@CarlaCristinaSA](https://github.com/CarlaCristinaSA) |
| Clidenor Filho | Desenvolvedor Backend | [@ClidenorFilho](https://github.com/ClidenorFilho) |

---

## 📄 Licença

Este projeto está sob a licença **MIT** — veja o arquivo [LICENSE](https://github.com/kaylannesatiro/lunar-cycle/blob/main/LICENSE) para o texto completo.

```
MIT License
Copyright (c) 2026 Kaylanne Sátiro
```

---

<div align="center">

Feito com 🌙 para quem busca se conhecer um pouco mais a cada ciclo.

</div>
