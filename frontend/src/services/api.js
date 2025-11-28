// ConfiguraÃƒÂ§ÃƒÂ£o base da API
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Classe para gerenciar tokens
class TokenManager {
  static getToken() {
    return localStorage.getItem('genesix_token');
  }

  static setToken(token) {
    localStorage.setItem('genesix_token', token);
  }

  static getRefreshToken() {
    return localStorage.getItem('genesix_refresh_token');
  }

  static setRefreshToken(token) {
    localStorage.setItem('genesix_refresh_token', token);
  }

  static clearTokens() {
    localStorage.removeItem('genesix_token');
    localStorage.removeItem('genesix_refresh_token');
  }

  static isTokenExpired(token) {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}

// Classe principal da API
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  // MÃƒÂ©todo para fazer requisiÃƒÂ§ÃƒÂµes HTTP
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = TokenManager.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Adicionar token se disponÃƒÂ­vel e nÃƒÂ£o expirado
    if (token && !TokenManager.isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Se token expirou, tentar renovar
      if (response.status === 401 && token) {
        return this.handleTokenRefresh(endpoint, options);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || errorData.error || 'Erro na requisiÃƒÂ§ÃƒÂ£o',
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Erro de rede ou outros
      throw new ApiError(
        'Erro de conexÃƒÂ£o. Verifique sua internet.',
        0,
        { originalError: error }
      );
    }
  }

  // Renovar token automaticamente
  async handleTokenRefresh(originalEndpoint, originalOptions) {
    if (this.isRefreshing) {
      // Se jÃƒÂ¡ estÃƒÂ¡ renovando, adicionar ÃƒÂ  fila
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject, endpoint: originalEndpoint, options: originalOptions });
      });
    }

    this.isRefreshing = true;
    const refreshToken = TokenManager.getRefreshToken();

    if (!refreshToken) {
      this.processQueue(new ApiError('SessÃƒÂ£o expirada', 401));
      TokenManager.clearTokens();
      window.location.href = '#login';
      return;
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Falha ao renovar token');
      }

      const data = await response.json();
      TokenManager.setToken(data.data.token);
      TokenManager.setRefreshToken(data.data.refresh_token);

      this.processQueue(null, data.data.token);
      
      // Repetir requisiÃƒÂ§ÃƒÂ£o original
      return this.request(originalEndpoint, originalOptions);
      
    } catch (error) {
      this.processQueue(new ApiError('SessÃƒÂ£o expirada', 401));
      TokenManager.clearTokens();
      window.location.href = '#login';
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Processar fila de requisiÃƒÂ§ÃƒÂµes pendentes
  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject, endpoint, options }) => {
      if (error) {
        reject(error);
      } else {
        resolve(this.request(endpoint, options));
      }
    });
    
    this.failedQueue = [];
  }

  // MÃƒÂ©todos HTTP convenientes
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Upload de arquivos
  async upload(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    const token = TokenManager.getToken();
    const headers = {};
    
    if (token && !TokenManager.isTokenExpired(token)) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    });
  }
}

// Classe de erro personalizada
class ApiError extends Error {
  constructor(message, status, data = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }

  get isNetworkError() {
    return this.status === 0;
  }

  get isServerError() {
    return this.status >= 500;
  }

  get isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isForbidden() {
    return this.status === 403;
  }

  get isNotFound() {
    return this.status === 404;
  }

  get isValidationError() {
    return this.status === 400 && this.data.details;
  }
}

// InstÃƒÂ¢ncia singleton da API
const api = new ApiService();

// ServiÃƒÂ§os especÃƒÂ­ficos por mÃƒÂ³dulo
export const authService = {
  // Login com email/senha
  async login(email, password) {
    const response = await api.post('/auth/login', {
      email,
      senha: password,
    });
    
    if (response.data.token) {
      TokenManager.setToken(response.data.token);
      TokenManager.setRefreshToken(response.data.refresh_token);
    }
    
    return response;
  },

  // Registro de usuÃƒÂ¡rio
  async register(userData) {
    const response = await api.post('/auth/register', {
      nome: userData.nome,
      email: userData.email,
      senha: userData.senha,
      confirmar_senha: userData.confirmar_senha || userData.senha,
    });
    
    if (response.data.token) {
      TokenManager.setToken(response.data.token);
      TokenManager.setRefreshToken(response.data.refresh_token);
    }
    
    return response;
  },

  // Logout
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignorar erros de logout
    } finally {
      TokenManager.clearTokens();
    }
  },

  // Obter dados do usuÃƒÂ¡rio logado
  async getMe() {
    return api.get('/auth/me');
  },

  // Alterar senha
  async changePassword(currentPassword, newPassword) {
    return api.post('/auth/change-password', {
      senha_atual: currentPassword,
      nova_senha: newPassword,
      confirmar_nova_senha: newPassword,
    });
  },

  // Solicitar reset de senha
  async forgotPassword(email) {
    return api.post('/auth/forgot-password', { email });
  },

  // Confirmar reset de senha
  async resetPassword(token, newPassword) {
    return api.post('/auth/reset-password', {
      token,
      nova_senha: newPassword,
      confirmar_nova_senha: newPassword,
    });
  },

  // Verificar se usuÃƒÂ¡rio estÃƒÂ¡ logado
  isAuthenticated() {
    const token = TokenManager.getToken();
    return token && !TokenManager.isTokenExpired(token);
  },
};

export const userService = {
  // Obter perfil do usuÃƒÂ¡rio
  async getProfile(userId) {
    return api.get(`/users/${userId}`);
  },

  // Atualizar dados bÃƒÂ¡sicos
  async updateProfile(userId, data) {
    return api.put(`/users/${userId}`, data);
  },

  // Atualizar perfil detalhado
  async updateDetailedProfile(userId, data) {
    return api.put(`/users/${userId}/profile`, data);
  },

  // Atualizar avatar
  async updateAvatar(userId, avatarUrl) {
    return api.put(`/users/${userId}/avatar`, { avatar_url: avatarUrl });
  },

  // Obter estatÃƒÂ­sticas do usuÃƒÂ¡rio
  async getStats(userId) {
    return api.get(`/users/${userId}/stats`);
  },

  // Buscar usuÃƒÂ¡rios
  async searchUsers(query, page = 1, limit = 10) {
    return api.get('/users/search', { q: query, page, limit });
  },
};

export const projectService = {
  // Listar projetos do usuÃ¡rio
  async getProjects(params = {}) {
    return api.get('/projects', params);
  },

  // Criar projeto
  async createProject(data) {
    return api.post('/projects', data);
  },

  // Obter projeto especÃ­fico
  async getProject(projectId) {
    return api.get(`/projects/${projectId}`);
  },

  // Atualizar projeto
  async updateProject(projectId, data) {
    return api.put(`/projects/${projectId}`, data);
  },

  // Excluir projeto
  async deleteProject(projectId) {
    return api.delete(`/projects/${projectId}`);
  },

  // Listar etapas do projeto
  async getProjectSteps(projectId) {
    return api.get(`/projects/${projectId}/steps`);
  },

  // Salvar etapa do projeto
  async saveProjectStep(projectId, stepId, data) {
    return api.put(`/projects/${projectId}/steps/${stepId}`, data);
  },
};
export const documentService = {
  // Listar documentos
  async getDocuments(params = {}) {
    return api.get('/documents', params);
  },

  // Criar documento
  async createDocument(data) {
    return api.post('/documents', data);
  },

  // Obter documento especÃƒÂ­fico
  async getDocument(documentId) {
    return api.get(`/documents/${documentId}`);
  },

  // Atualizar documento
  async updateDocument(documentId, data) {
    return api.put(`/documents/${documentId}`, data);
  },

  // Excluir documento
  async deleteDocument(documentId) {
    return api.delete(`/documents/${documentId}`);
  },

  // Aprovar documento
  async approveDocument(documentId) {
    return api.post(`/documents/${documentId}/approve`);
  },

  // Listar documentos de um projeto
  async getProjectDocuments(projectId) {
    return api.get(`/documents/project/${projectId}`);
  },

  // Listar versÃµes de um documento
  async getDocumentVersions(documentId) {
    return api.get(`/documents/${documentId}/versions`);
  },

  // Restaurar versÃ£o
  async restoreVersion(documentId, version) {
    return api.post(`/documents/${documentId}/restore`, { version });
  },
};

export const collaboratorService = {
  // Listar colaboradores do projeto
  async getCollaborators(projectId, params = {}) {
    return api.get(`/collaborators/${projectId}`, params);
  },

  // Convidar colaborador
  async inviteCollaborator(data) {
    return api.post('/collaborators', data);
  },

  // Atualizar colaborador
  async updateCollaborator(collaboratorId, data) {
    return api.put(`/collaborators/${collaboratorId}`, data);
  },

  // Remover colaborador
  async removeCollaborator(collaboratorId) {
    return api.delete(`/collaborators/${collaboratorId}`);
  },

  // Aceitar convite
  async acceptInvite(token) {
    return api.post(`/collaborators/accept/${token}`);
  },

  // Obter detalhes do convite
  async getInviteDetails(token) {
    return api.get(`/collaborators/invite/${token}`);
  },

  // Listar minhas colaboraÃƒÂ§ÃƒÂµes
  async getMyCollaborations(params = {}) {
    return api.get('/collaborators/my-collaborations', params);
  },
};

export const planService = {
  // Listar planos
  async getPlans() {
    return api.get('/plans');
  },

  // Criar assinatura (placeholder)
  async createSubscription(planId) {
    return api.post('/subscriptions', { plan_id: planId });
  },

  // Obter assinatura
  async getSubscription(subscriptionId) {
    return api.get(`/subscriptions/${subscriptionId}`);
  },

  // Cancelar assinatura
  async cancelSubscription(subscriptionId) {
    return api.put(`/subscriptions/${subscriptionId}/cancel`);
  },
};

export const settingsService = {
  // Obter configuraÃƒÂ§ÃƒÂµes
  async getSettings() {
    return api.get('/settings');
  },

  // Atualizar configuraÃƒÂ§ÃƒÂµes
  async updateSettings(data) {
    return api.put('/settings', data);
  },

  // Atualizar configuraÃƒÂ§ÃƒÂ£o especÃƒÂ­fica
  async updateSetting(key, value) {
    return api.patch(`/settings/${key}`, { value });
  },

  // Resetar configuraÃƒÂ§ÃƒÂµes
  async resetSettings() {
    return api.post('/settings/reset');
  },

  // Obter configuraÃƒÂ§ÃƒÂµes padrÃƒÂ£o
  async getDefaultSettings() {
    return api.get('/settings/defaults');
  },
};

// UtilitÃƒÂ¡rios
export const utils = {
  // Formatar erros da API para exibiÃƒÂ§ÃƒÂ£o
  formatApiError(error) {
    if (error instanceof ApiError) {
      if (error.isValidationError) {
        return error.data.details.map(d => d.message).join(', ');
      }
      return error.message;
    }
    return 'Erro inesperado. Tente novamente.';
  },

  // Verificar se erro ÃƒÂ© de rede
  isNetworkError(error) {
    return error instanceof ApiError && error.isNetworkError;
  },

  // Verificar se erro ÃƒÂ© de autenticaÃƒÂ§ÃƒÂ£o
  isAuthError(error) {
    return error instanceof ApiError && (error.isUnauthorized || error.isForbidden);
  },
};

// ExportaÃƒÂ§ÃƒÂµes principais
export { api, ApiError, TokenManager };
export default api;


