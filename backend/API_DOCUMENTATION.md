# 📚 Documentação das APIs - GenesiX Backend

**Versão:** 1.0.0  
**Base URL:** `http://localhost:3001/api`  
**Autenticação:** Bearer Token (JWT)

---

## 📋 Índice

1. [Autenticação](#autenticação)
2. [Usuários](#usuários)
3. [Documentos](#documentos)
4. [Colaboradores](#colaboradores)
5. [Configurações](#configurações)
6. [Códigos de Status](#códigos-de-status)
7. [Estruturas de Dados](#estruturas-de-dados)

---

## 🔐 Autenticação

### POST `/auth/register`
Cadastra um novo usuário no sistema.

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "senha": "minhasenha123"
}
```

**Resposta (201):**
```json
{
  "success": true,
  "message": "✨ Cadastro concluído! Faça a sua primeira GENESI de produtos.",
  "data": {
    "user": {
      "id": "uuid",
      "nome": "João Silva",
      "email": "joao@exemplo.com",
      "avatar_url": null,
      "created_at": "2025-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here",
    "refresh_token": "refresh_token_here"
  }
}
```

### POST `/auth/login`
Autentica um usuário existente.

**Body:**
```json
{
  "email": "joao@exemplo.com",
  "senha": "minhasenha123"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "🔥 Bem-vindo de volta CRIADOR! Sua criação está à sua espera.",
  "data": {
    "user": { /* dados do usuário */ },
    "token": "jwt_token_here",
    "refresh_token": "refresh_token_here"
  }
}
```

### GET `/auth/me`
Obtém dados do usuário autenticado.

**Headers:** `Authorization: Bearer {token}`

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "nome": "João Silva",
      "email": "joao@exemplo.com",
      "avatar_url": "https://...",
      "profile": {
        "area_atuacao": "tecnologia",
        "bio": "Desenvolvedor apaixonado por produtos",
        "linkedin": "https://linkedin.com/in/joao"
      }
    }
  }
}
```

### POST `/auth/refresh`
Renova o token de acesso.

**Body:**
```json
{
  "refresh_token": "refresh_token_here"
}
```

### POST `/auth/logout`
Invalida o token atual.

**Headers:** `Authorization: Bearer {token}`

### POST `/auth/forgot-password`
Solicita reset de senha.

**Body:**
```json
{
  "email": "joao@exemplo.com"
}
```

### POST `/auth/reset-password`
Confirma reset de senha.

**Body:**
```json
{
  "token": "reset_token",
  "nova_senha": "novasenha123",
  "confirmar_nova_senha": "novasenha123"
}
```

### OAuth Routes
- `GET /auth/google` - Inicia OAuth com Google
- `GET /auth/github` - Inicia OAuth com GitHub  
- `GET /auth/linkedin` - Inicia OAuth com LinkedIn
- `GET /auth/google/callback` - Callback do Google
- `GET /auth/github/callback` - Callback do GitHub
- `GET /auth/linkedin/callback` - Callback do LinkedIn

---

## 👥 Usuários

### GET `/users/:id`
Obtém dados de um usuário específico.

**Parâmetros:**
- `id` (UUID) - ID do usuário

**Query Parameters:**
- `include_private` (boolean) - Incluir dados privados (apenas próprio usuário)

**Headers:** `Authorization: Bearer {token}`

### PUT `/users/:id`
Atualiza dados básicos do usuário.

**Body:**
```json
{
  "nome": "João Silva Santos",
  "email": "joao.novo@exemplo.com"
}
```

### PUT `/users/:id/profile`
Atualiza perfil detalhado do usuário.

**Body:**
```json
{
  "area_atuacao": "produto",
  "bio": "Product Manager com 5 anos de experiência",
  "linkedin": "https://linkedin.com/in/joao",
  "github": "https://github.com/joao",
  "website": "https://joao.dev",
  "localizacao": "São Paulo, SP",
  "empresa": "TechCorp",
  "cargo": "Product Manager"
}
```

### PUT `/users/:id/avatar`
Atualiza avatar do usuário.

**Body:**
```json
{
  "avatar_url": "https://exemplo.com/avatar.jpg"
}
```

### GET `/users/search`
Busca usuários no sistema.

**Query Parameters:**
- `q` (string) - Termo de busca
- `page` (number) - Página (padrão: 1)
- `limit` (number) - Itens por página (padrão: 10)

### GET `/users/:id/stats`
Obtém estatísticas do usuário.

**Resposta:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_projetos": 5,
      "projetos_concluidos": 2,
      "total_documentos": 15,
      "colaboracoes_ativas": 3,
      "data_ultimo_acesso": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

---

## 📄 Documentos

### GET `/documents`
Lista documentos do usuário.

**Query Parameters:**
- `projeto_id` (UUID) - Filtrar por projeto
- `etapa` (string) - Filtrar por etapa
- `status` (string) - Filtrar por status
- `busca` (string) - Buscar no título/conteúdo
- `page` (number) - Página
- `limit` (number) - Itens por página

### POST `/documents`
Cria um novo documento.

**Body:**
```json
{
  "projeto_id": "uuid",
  "etapa": "contexto-problema",
  "titulo": "Análise do Problema",
  "conteudo": {
    "problema_principal": "Usuários têm dificuldade...",
    "contexto_mercado": "O mercado atual...",
    "dor_usuario": "A principal dor é..."
  },
  "conteudo_texto": "Versão em texto do conteúdo...",
  "formato": "json",
  "tags": ["problema", "contexto", "mercado"]
}
```

### GET `/documents/:id`
Obtém documento específico.

### PUT `/documents/:id`
Atualiza documento existente.

**Body:** (mesma estrutura do POST)

### DELETE `/documents/:id`
Exclui documento (soft delete).

### POST `/documents/:id/approve`
Aprova documento para avançar etapa.

### GET `/documents/project/:project_id`
Lista todos os documentos de um projeto.

---

## 🤝 Colaboradores

### GET `/collaborators/:project_id`
Lista colaboradores de um projeto.

**Query Parameters:**
- `status` (string) - Filtrar por status
- `role` (string) - Filtrar por role
- `page` (number) - Página
- `limit` (number) - Itens por página

### POST `/collaborators`
Convida um colaborador.

**Body:**
```json
{
  "project_id": "uuid",
  "email": "colaborador@exemplo.com",
  "nome": "Maria Silva",
  "role": "editor",
  "permissoes": {
    "pode_criar": true,
    "pode_editar": true,
    "pode_excluir": false,
    "pode_aprovar": false
  }
}
```

**Roles disponíveis:**
- `admin` - Administrador do projeto
- `editor` - Pode criar e editar documentos
- `viewer` - Apenas visualização
- `comentarista` - Pode comentar documentos

### PUT `/collaborators/:id`
Atualiza colaborador.

**Body:**
```json
{
  "role": "admin",
  "status": "ativo",
  "permissoes": { /* novas permissões */ }
}
```

### DELETE `/collaborators/:id`
Remove colaborador do projeto.

### POST `/collaborators/accept/:token`
Aceita convite de colaboração.

**Headers:** `Authorization: Bearer {token}`

### GET `/collaborators/invite/:token`
Obtém detalhes de um convite (público).

### GET `/collaborators/my-collaborations`
Lista colaborações do usuário autenticado.

---

## ⚙️ Configurações

### GET `/settings`
Obtém configurações do usuário.

**Resposta:**
```json
{
  "success": true,
  "data": {
    "settings": {
      "tema": "light",
      "idioma": "pt-BR",
      "timezone": "America/Sao_Paulo",
      "notificacoes_email": true,
      "notificacoes_push": true,
      "notificacoes_colaboracao": true,
      "notificacoes_marketing": false,
      "auto_save": true,
      "auto_save_interval": 60,
      "layout_sidebar": "expanded",
      "densidade_interface": "comfortable",
      "mostrar_dicas": true,
      "analytics_usage": true,
      "configuracoes_personalizadas": {}
    }
  }
}
```

### PUT `/settings`
Atualiza múltiplas configurações.

**Body:** (qualquer combinação dos campos de configuração)

### PATCH `/settings/:key`
Atualiza configuração específica.

**Parâmetros:**
- `key` - Chave da configuração

**Body:**
```json
{
  "value": "dark"
}
```

### POST `/settings/reset`
Reseta configurações para padrão.

### GET `/settings/defaults`
Obtém configurações padrão do sistema.

---

## 📊 Códigos de Status

| Código | Significado | Descrição |
|--------|-------------|-----------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 400 | Bad Request | Dados inválidos ou malformados |
| 401 | Unauthorized | Token inválido ou expirado |
| 403 | Forbidden | Sem permissão para acessar recurso |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Conflito (ex: email já existe) |
| 422 | Unprocessable Entity | Erro de validação |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Server Error | Erro interno do servidor |

---

## 🏗️ Estruturas de Dados

### User
```json
{
  "id": "uuid",
  "nome": "string",
  "email": "string",
  "avatar_url": "string|null",
  "email_verificado": "boolean",
  "provider": "local|google|github|linkedin",
  "provider_id": "string|null",
  "status": "ativo|inativo|suspenso",
  "ultimo_acesso": "datetime",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### UserProfile
```json
{
  "user_id": "uuid",
  "area_atuacao": "string",
  "bio": "text|null",
  "linkedin": "string|null",
  "github": "string|null",
  "website": "string|null",
  "localizacao": "string|null",
  "empresa": "string|null",
  "cargo": "string|null",
  "experiencia_anos": "integer|null",
  "especializacoes": "array|null",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Project
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "nome": "string",
  "descricao": "text|null",
  "status": "rascunho|ativo|pausado|concluido|arquivado",
  "etapa_atual": "string",
  "progresso": "integer",
  "data_inicio": "date|null",
  "data_conclusao": "date|null",
  "configuracoes": "json",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Document
```json
{
  "id": "uuid",
  "projeto_id": "uuid",
  "user_id": "uuid",
  "etapa": "string",
  "titulo": "string",
  "conteudo": "json",
  "conteudo_texto": "text|null",
  "formato": "json|markdown|html|pdf",
  "status": "rascunho|revisao|aprovado|rejeitado",
  "versao": "integer",
  "tags": "array|null",
  "feedback": "text|null",
  "aprovado_por": "uuid|null",
  "aprovado_em": "datetime|null",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Collaborator
```json
{
  "id": "uuid",
  "project_id": "uuid",
  "user_id": "uuid|null",
  "email": "string",
  "nome": "string|null",
  "role": "admin|editor|viewer|comentarista",
  "status": "pendente|ativo|inativo|removido",
  "permissoes": "json",
  "convidado_por": "uuid",
  "data_convite": "datetime",
  "convite_token": "string|null",
  "convite_expira_em": "datetime|null",
  "data_aceite": "datetime|null",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Settings
```json
{
  "user_id": "uuid",
  "tema": "light|dark|auto",
  "idioma": "pt-BR|en-US|es-ES",
  "timezone": "string",
  "notificacoes_email": "boolean",
  "notificacoes_push": "boolean",
  "notificacoes_colaboracao": "boolean",
  "notificacoes_marketing": "boolean",
  "auto_save": "boolean",
  "auto_save_interval": "integer",
  "layout_sidebar": "collapsed|expanded|auto",
  "densidade_interface": "compact|comfortable|spacious",
  "mostrar_dicas": "boolean",
  "analytics_usage": "boolean",
  "configuracoes_personalizadas": "json",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

---

## 🔧 Configuração e Uso

### Variáveis de Ambiente
```env
# Banco de dados
DATABASE_URL=postgresql://user:password@localhost:5432/genesix
DB_HOST=localhost
DB_PORT=5432
DB_NAME=genesix
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=seu_jwt_secret_muito_seguro
JWT_REFRESH_SECRET=seu_refresh_secret_muito_seguro
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# OAuth
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret
GITHUB_CLIENT_ID=seu_github_client_id
GITHUB_CLIENT_SECRET=seu_github_client_secret
LINKEDIN_CLIENT_ID=seu_linkedin_client_id
LINKEDIN_CLIENT_SECRET=seu_linkedin_client_secret

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app
```

### Headers Padrão
```
Content-Type: application/json
Authorization: Bearer {jwt_token}
```

### Rate Limiting
- **Geral:** 100 requisições por 15 minutos por IP
- **Auth:** 5 tentativas de login por 15 minutos por IP
- **Upload:** 10 uploads por hora por usuário

---

## 🚀 Exemplos de Uso

### Fluxo Completo de Autenticação
```javascript
// 1. Registrar usuário
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'João Silva',
    email: 'joao@exemplo.com',
    senha: 'minhasenha123'
  })
});

// 2. Usar token retornado
const { token } = registerResponse.data;
localStorage.setItem('token', token);

// 3. Fazer requisições autenticadas
const userResponse = await fetch('/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Criar e Gerenciar Documento
```javascript
// 1. Criar documento
const docResponse = await fetch('/api/documents', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    projeto_id: 'uuid-do-projeto',
    etapa: 'contexto-problema',
    titulo: 'Análise do Problema',
    conteudo: {
      problema_principal: 'Descrição do problema...',
      contexto_mercado: 'Análise do mercado...'
    },
    tags: ['problema', 'contexto']
  })
});

// 2. Aprovar documento
await fetch(`/api/documents/${docId}/approve`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

**Desenvolvido com ❤️ pela equipe GenesiX**  
**Documentação atualizada em:** Janeiro 2025
