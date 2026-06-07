# 🛰️ AgroSat Sentinel
AgroSat Sentinel é uma solução tecnológica focada na proteção e monitoramento inteligente de propriedades agrícolas. Utilizando dados orbitais, o aplicativo entrega telemetria de precisão na palma da mão do produtor rural.

Nota: Este aplicativo é um protótipo. Funcionalidades centrais como telemetria orbital, autenticação e navegação estão ativas. No entanto, algumas opções (tela de mapa, configurações de conta na tela de perfil e telas de ajuda) são apenas demonstrações visuais que ilustram o potencial de expansão futura da plataforma. Os alertas atualmente na tela de alertas são mocks para ilustrar como alertas reais aparecem, já que em situais normais, não aparecem alertas.

Link de demonstração no YouTube: https://youtube.com/shorts/NkbIHHaAHWQ?si=T9onfnnP5N0OlfDL

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

# demonstração de Telas

### Login
<img width="376" height="560" alt="image" src="https://github.com/user-attachments/assets/02c4ffa3-e120-4a27-956e-ff82fbbba026" />
<img width="378" height="558" alt="image" src="https://github.com/user-attachments/assets/d07fd5dc-ebf7-4ab9-a939-ce08ebc7ad0a" />

### Registro
<img width="376" height="569" alt="image" src="https://github.com/user-attachments/assets/604c04ca-16f7-48e6-b65b-aceb3a474a88" />
<img width="382" height="566" alt="image" src="https://github.com/user-attachments/assets/6b3b31b2-b160-4f1f-8952-d9d9ff8796d3" />

### Dashboard
<img width="499" height="857" alt="image" src="https://github.com/user-attachments/assets/e1e94d93-52b7-4aa2-9a72-ee137c293348" />
<img width="501" height="860" alt="image" src="https://github.com/user-attachments/assets/7277ffb2-d7fa-4e49-a05a-70360674338b" />

### Alertas
<img width="502" height="856" alt="image" src="https://github.com/user-attachments/assets/ff18f3f9-0ded-4005-9aeb-6025fc865526" />

### Mapas
<img width="497" height="860" alt="image" src="https://github.com/user-attachments/assets/b611663e-13b7-48c4-8abc-f8ae3c103ed5" />
<img width="499" height="856" alt="image" src="https://github.com/user-attachments/assets/04f64197-a55b-4c36-9749-ef25137704a0" />
<img width="500" height="856" alt="image" src="https://github.com/user-attachments/assets/79a61d68-c32b-4154-a960-79fcd64f9fa7" />
<img width="498" height="826" alt="image" src="https://github.com/user-attachments/assets/bdf5ecec-767b-4392-baef-a3476e394fa1" />

### Perfil
<img width="500" height="861" alt="image" src="https://github.com/user-attachments/assets/17555cde-62d7-4c5f-acbb-5f5ef3eed84f" />
<img width="503" height="858" alt="image" src="https://github.com/user-attachments/assets/be51da54-27a9-4bd4-b13e-64b6f5ad2172" />


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
