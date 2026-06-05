# 🛰️ AgroSat Sentinel
AgroSat Sentinel é uma solução tecnológica focada na proteção e monitoramento inteligente de propriedades agrícolas. Utilizando dados orbitais, o aplicativo entrega telemetria de precisão na palma da mão do produtor rural.

⚠️ Status do Projeto: Protótipo Conceitual / MVP (Minimum Viable Product).

Nota: Este aplicativo é um protótipo. Funcionalidades centrais como telemetria orbital, autenticação e navegação estão ativas. No entanto, algumas opções (como as configurações de conta na tela de perfil e telas de ajuda) são apenas demonstrações visuais (mockups) que ilustram o potencial de expansão futura da plataforma.

## 🌌 Conexão com o Tema Espacial
O AgroSat Sentinel traz o poder do espaço para a terra. A solução se conecta ao tema espacial ao utilizar o conceito de sensoriamento remoto orbital.

Em vez de depender apenas de sensores físicos caros espalhados pela fazenda, o aplicativo simula a interceptação e o processamento de dados de satélites (como o Sentinel-2 e o sistema NASA FIRMS). Com isso, extraímos índices biofísicos complexos usando imagens infravermelhas e espectrais coletadas da órbita terrestre, traduzindo dados espaciais brutos em informações vitais para a agricultura.

# ✨ Funcionalidades
O aplicativo foi desenhado para ser fluido, seguro e informativo:

Monitoramento de NDVI: Leitura em tempo real do Índice de Vegetação, permitindo avaliar a saúde e densidade das plantações através de dados espectrais.

Mapeamento Térmico: Detecção de anomalias térmicas de superfície (Canal Térmico) para identificação precoce de focos de incêndio e áreas de estresse hídrico.

Gestão de Propriedades: Alternância rápida entre diferentes fazendas/áreas monitoradas.

Sistema de Autenticação Seguro: Fluxo completo de Login e Registro, com gerenciamento inteligente de token e persistência de sessão (o app lembra de você, mas desloga com segurança quando a sessão expira).

Navegação e UX: Animações suaves de transição entre telas (slide_from_right), estrutura em abas (Bottom Tabs) e estado de carregamento imersivos.

Cache Inteligente: Gerenciamento local de dados para economia de rede e uso otimizado.

# 🛠️ Tecnologias Utilizadas

### O projeto foi dividido em duas frentes independentes:

### Mobile (Frontend)

React Native & Expo

TypeScript

Context API (Gerenciamento de Estado de Auth e Alertas)

React Navigation (Stack & Bottom Tabs)

AsyncStorage (Cache local)

### Backend (API)

Node.js

TypeScript

Banco de Dados SQLite (Estruturado com Migrations)

Arquitetura baseada em rotas, controllers e serviços.

# 🚀 Como Instalar e Executar
Siga os passos abaixo para rodar a aplicação localmente na sua máquina.

### 1. Clonando o repositório
Bash
git clone https://github.com/SEU_USUARIO/agrosat-sentinel.git

### 2. Rodando o Backend
Abra um terminal, acesse a pasta do backend e inicie o servidor local:

Bash
cd Backend
npm install
npm run dev
O backend usará o banco SQLite local (database.sqlite) para gerenciar as propriedades e os usuários.

### 3. Rodando o Mobile
Abra outro terminal, acesse a pasta do mobile e inicie o Expo:

Bash
cd Mobile
npm install
npx expo start
Após rodar o comando do Expo, escaneie o QR Code com o aplicativo Expo Go no seu celular (iOS/Android) ou pressione a para rodar no emulador Android, ou i para o simulador iOS.

# 📁 Estrutura do Projeto
O repositório é um monorepo simples com a seguinte organização:

/Backend: Contém a API REST, o banco de dados SQLite e a lógica de negócios (Services, Models, Controllers).

/Mobile: Contém o aplicativo React Native, os componentes de UI, telas e integrações de consumo da API (api.ts, nasaService.ts, etc).
