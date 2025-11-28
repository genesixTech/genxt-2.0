# 🎨 GenesiX Frontend

**Interface moderna e intuitiva para a plataforma GenesiX** - Sistema completo de criação e gestão de produtos digitais com metodologia estruturada.

[![React](https://img.shields.io/badge/React-19+-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6+-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4+-cyan.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Índice

1. [Características](#características)
2. [Tecnologias](#tecnologias)
3. [Instalação](#instalação)
4. [Configuração](#configuração)
5. [Uso](#uso)
6. [Estrutura do Projeto](#estrutura-do-projeto)
7. [Componentes](#componentes)
8. [Deploy](#deploy)
9. [Contribuição](#contribuição)

---

## ✨ Características

### 🎨 **Design Moderno**
- Interface responsiva e acessível
- Design system consistente com Shadcn/UI
- Gradientes e animações suaves
- Dark mode e temas personalizáveis

### 🔐 **Autenticação Completa**
- Login/cadastro com validação em tempo real
- OAuth integrado (Google, GitHub, LinkedIn)
- Multi-step form de cadastro
- Recuperação de senha

### 📱 **Experiência Mobile-First**
- Layout responsivo para todos os dispositivos
- Touch-friendly interactions
- Performance otimizada
- PWA ready

### 🚀 **Funcionalidades Avançadas**
- Roteamento baseado em hash
- Estado global com Context API
- Interceptadores de API automáticos
- Loading states e feedback visual

### 🎯 **Metodologia GenesiX**
- Wizard de criação de produtos
- Etapas estruturadas de desenvolvimento
- Colaboração em tempo real
- Analytics e métricas

---

## 🛠️ Tecnologias

| Categoria | Tecnologia | Versão | Descrição |
|-----------|------------|--------|-----------|
| **Framework** | React | 19+ | Biblioteca para interfaces |
| **Build Tool** | Vite | 6+ | Build tool moderna e rápida |
| **Styling** | Tailwind CSS | 4+ | Framework CSS utility-first |
| **UI Components** | Shadcn/UI | Latest | Componentes acessíveis |
| **Icons** | Lucide React | Latest | Ícones modernos e consistentes |
| **Charts** | Recharts | 2+ | Gráficos e visualizações |
| **HTTP Client** | Fetch API | Native | Cliente HTTP nativo |
| **State Management** | Context API | Native | Gerenciamento de estado |
| **Routing** | Hash Routing | Custom | Roteamento baseado em hash |
| **Forms** | React Hooks | Native | Gerenciamento de formulários |

---

## 🚀 Instalação

### Pré-requisitos
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** ou **yarn**
- **Backend GenesiX** rodando (opcional para desenvolvimento)

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/genesix-frontend.git
cd genesix-frontend
```

### 2. Instale as Dependências
```bash
# Com pnpm (recomendado)
pnpm install

# Ou com npm
npm install
```

### 3. Configure as Variáveis de Ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
# URL da API do backend
REACT_APP_API_URL=http://localhost:3001/api

# URL do frontend (para OAuth callbacks)
REACT_APP_FRONTEND_URL=http://localhost:3000

# Configurações de desenvolvimento
REACT_APP_ENV=development

# Configurações de debug (opcional)
REACT_APP_DEBUG=false
```

### 4. Inicie o Servidor de Desenvolvimento
```bash
# Com pnpm
pnpm dev

# Ou com npm
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

---

## ⚙️ Configuração

### Configuração do Backend
Para funcionalidade completa, configure a URL do backend no arquivo `.env`:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

### Configuração OAuth
As configurações OAuth são gerenciadas pelo backend. Certifique-se de que o backend esteja configurado com:

- Google OAuth
- GitHub OAuth  
- LinkedIn OAuth

### Configuração de Produção
Para produção, atualize as URLs:

```env
REACT_APP_API_URL=https://api.seudominio.com/api
REACT_APP_FRONTEND_URL=https://app.seudominio.com
REACT_APP_ENV=production
```

---

## 🎯 Uso

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint

# Formatação de código
npm run format

# Análise de bundle
npm run analyze
```

### Estrutura de Navegação

A aplicação usa roteamento baseado em hash:

- `#login` - Página de login
- `#register` - Página de cadastro
- `#forgot-password` - Recuperação de senha
- `#dashboard` - Dashboard principal
- `#documents` - Gestão de documentos
- `#collaboration` - Colaboradores
- `#analytics` - Analytics e métricas
- `#profile` - Perfil do usuário
- `#settings` - Configurações

### Fluxo de Autenticação

1. **Usuário não autenticado:** Redirecionado para `#login`
2. **Login/Cadastro:** Validação e autenticação
3. **Token armazenado:** localStorage com renovação automática
4. **Acesso liberado:** Redirecionamento para dashboard

---

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                      # Componentes base (Shadcn/UI)
│   │   ├── button.jsx
│   │   ├── input.jsx
│   │   ├── card.jsx
│   │   └── ...
│   ├── LoginPage.jsx            # Página de login
│   ├── RegisterPage.jsx         # Página de cadastro
│   ├── ForgotPasswordPage.jsx   # Recuperação de senha
│   ├── Dashboard.jsx            # Dashboard principal
│   ├── Header.jsx               # Cabeçalho da aplicação
│   ├── LeftSidebar.jsx          # Sidebar de navegação
│   ├── RightSidebar.jsx         # Sidebar de informações
│   ├── Wizard.jsx               # Wizard de criação
│   ├── StepPage.jsx             # Páginas de etapas
│   ├── DocumentsPage.jsx        # Gestão de documentos
│   ├── CollaboratorsPage.jsx    # Gestão de colaboradores
│   ├── AnalyticsPage.jsx        # Analytics e métricas
│   ├── UserProfilePage.jsx      # Perfil do usuário
│   ├── SettingsPage.jsx         # Configurações
│   └── NotificationOverlay.jsx  # Overlay de notificações
├── contexts/
│   └── AuthContext.jsx          # Contexto de autenticação
├── services/
│   └── api.js                   # Serviço de API
├── hooks/
│   └── use-mobile.js            # Hook para detecção mobile
├── lib/
│   └── utils.js                 # Utilitários gerais
├── App.jsx                      # Componente principal
├── main.jsx                     # Ponto de entrada
└── index.css                    # Estilos globais
```

---

## 🧩 Componentes

### Componentes de Autenticação

#### LoginPage
- Design responsivo com gradientes
- OAuth integrado (Google, GitHub, LinkedIn)
- Validação em tempo real
- Recuperação de senha

#### RegisterPage
- Multi-step form (4 etapas)
- Validação progressiva
- Coleta de dados profissionais
- Resumo antes da finalização

#### ForgotPasswordPage
- Interface intuitiva
- Feedback visual de email enviado
- Instruções claras

### Componentes Principais

#### Dashboard
- Visão geral dos projetos
- Métricas importantes
- Acesso rápido às funcionalidades
- Cards interativos

#### Wizard
- Criação guiada de produtos
- Etapas da metodologia GenesiX
- Progresso visual
- Validação por etapa

#### StepPage
- Interface para cada etapa
- Editor de conteúdo
- Tarefas e checklist
- Navegação entre etapas

### Componentes de UI

Baseados no **Shadcn/UI** para consistência e acessibilidade:

- **Button** - Botões com variantes
- **Input** - Campos de entrada
- **Card** - Containers de conteúdo
- **Dialog** - Modais e overlays
- **Tabs** - Navegação por abas
- **Form** - Formulários estruturados

---

## 🔧 Desenvolvimento

### Configuração do Ambiente

1. **Instale as dependências de desenvolvimento**
```bash
npm install --include=dev
```

2. **Configure o ESLint**
```bash
npm run lint
```

3. **Configure o Prettier**
```bash
npm run format
```

### Estrutura de Commits
Seguimos o padrão [Conventional Commits](https://conventionalcommits.org/):

```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: formatação de código
refactor: refatoração sem mudança de funcionalidade
test: adiciona ou corrige testes
chore: tarefas de manutenção
```

### Debugging

Para debug no navegador:
```bash
npm run dev
# Abra DevTools (F12)
# Use React Developer Tools
```

Para logs detalhados:
```bash
REACT_APP_DEBUG=true npm run dev
```

---

## 🎨 Design System

### Cores Principais
```css
/* Gradientes GenesiX */
--gradient-primary: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
--gradient-secondary: linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%);

/* Cores de Estado */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

### Tipografia
```css
/* Fontes */
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Tamanhos */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
```

### Espaçamentos
```css
/* Spacing Scale */
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-4: 1rem;
--space-6: 1.5rem;
--space-8: 2rem;
```

---

## 🚀 Deploy

### Deploy na Vercel

1. **Conecte seu repositório na [Vercel](https://vercel.com/)**
2. **Configure as variáveis de ambiente:**
   ```
   REACT_APP_API_URL=https://api.seudominio.com/api
   REACT_APP_FRONTEND_URL=https://app.seudominio.com
   REACT_APP_ENV=production
   ```
3. **Deploy automático configurado**

### Deploy na Netlify

1. **Conecte seu repositório na [Netlify](https://netlify.com/)**
2. **Configure o build:**
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Configure as variáveis de ambiente**
4. **Configure redirects para SPA:**
   ```
   # _redirects
   /*    /index.html   200
   ```

### Deploy no GitHub Pages

```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Adicionar script no package.json
"homepage": "https://seu-usuario.github.io/genesix-frontend",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

### Docker (Opcional)

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🧪 Testes

### Executar Testes
```bash
# Testes unitários
npm run test

# Testes com coverage
npm run test:coverage

# Testes E2E (se configurado)
npm run test:e2e
```

### Estrutura de Testes
```
tests/
├── unit/
│   ├── components/
│   ├── services/
│   └── utils/
├── integration/
│   ├── auth.test.js
│   └── navigation.test.js
└── e2e/
    ├── login.spec.js
    └── wizard.spec.js
```

---

## 📱 PWA (Progressive Web App)

### Configuração PWA
O projeto está configurado para ser uma PWA:

- **Service Worker** para cache offline
- **Manifest** para instalação
- **Icons** para diferentes dispositivos
- **Splash screens** personalizadas

### Instalação como App
Os usuários podem instalar a aplicação:

1. **Chrome/Edge:** Botão "Instalar app"
2. **Safari:** "Adicionar à tela inicial"
3. **Firefox:** "Instalar"

---

## 🔒 Segurança

### Medidas Implementadas

- **CSP** (Content Security Policy)
- **HTTPS** obrigatório em produção
- **Sanitização** de dados de entrada
- **Tokens JWT** com expiração
- **Renovação automática** de tokens
- **Logout automático** em inatividade

### Auditoria de Segurança
```bash
# Verificar vulnerabilidades
npm audit

# Corrigir automaticamente
npm audit fix
```

---

## 📊 Performance

### Otimizações Implementadas

- **Code Splitting** automático
- **Lazy Loading** de componentes
- **Tree Shaking** para bundle menor
- **Compressão** de assets
- **Cache** de recursos estáticos

### Métricas de Performance
- **First Contentful Paint** < 1.5s
- **Largest Contentful Paint** < 2.5s
- **Cumulative Layout Shift** < 0.1
- **First Input Delay** < 100ms

### Análise de Bundle
```bash
npm run analyze
```

---

## 🤝 Contribuição

### Como Contribuir

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. **Abra** um Pull Request

### Diretrizes de Código

- Use **TypeScript** quando possível
- Siga o **ESLint** e **Prettier**
- Escreva **testes** para novas funcionalidades
- Mantenha **componentes pequenos** e reutilizáveis
- Use **Tailwind CSS** para estilização
- Documente **props** e **hooks** customizados

### Reportar Bugs

Use as [Issues do GitHub](https://github.com/seu-usuario/genesix-frontend/issues) para reportar bugs, incluindo:

- Descrição detalhada do problema
- Passos para reproduzir
- Screenshots ou vídeos
- Informações do navegador/dispositivo
- Console logs (se aplicável)

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👥 Equipe

- **Desenvolvedor Frontend:** [Seu Nome](https://github.com/seu-usuario)
- **UI/UX Design:** Equipe GenesiX
- **Arquitetura:** Manus AI

---

## 🙏 Agradecimentos

- [React](https://reactjs.org/) - Biblioteca para interfaces
- [Vite](https://vitejs.dev/) - Build tool moderna
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Shadcn/UI](https://ui.shadcn.com/) - Componentes acessíveis
- [Lucide](https://lucide.dev/) - Ícones modernos
- Comunidade open source

---

## 📞 Suporte

- **Documentação:** Este README
- **Issues:** [GitHub Issues](https://github.com/seu-usuario/genesix-frontend/issues)
- **Email:** suporte@genesix.com
- **Discord:** [Servidor da Comunidade](https://discord.gg/genesix)

---

**Desenvolvido com ❤️ para criadores de produtos digitais**

[![Made with ❤️](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com/seu-usuario/genesix-frontend)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/seu-usuario/genesix-frontend/pulls)
