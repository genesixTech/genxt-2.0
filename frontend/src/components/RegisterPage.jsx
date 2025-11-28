import { useState } from 'react';
import { 
  Eye, EyeOff, Mail, Lock, User, ArrowRight, ArrowLeft, 
  Sparkles, Github, Linkedin, Check, Building, Target,
  Users, Lightbulb, TrendingUp, Briefcase
} from 'lucide-react';

const RegisterPage = ({ onNavigate, onRegister }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    // Etapa 1 - Dados básicos
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    
    // Etapa 2 - Perfil profissional
    areaAtuacao: '',
    tamanhoEmpresa: '',
    nivelConhecimento: '',
    
    // Etapa 3 - Objetivos
    objetivoPrincipal: '',
    origemConhecimento: '',
    whatsapp: '',
    
    // Etapa 4 - Finalização
    aceitaTermos: false,
    aceitaMarketing: false
  });

  const steps = [
    { id: 1, title: 'Dados Básicos', description: 'Informações pessoais' },
    { id: 2, title: 'Perfil Profissional', description: 'Sua área de atuação' },
    { id: 3, title: 'Objetivos', description: 'Como podemos ajudar' },
    { id: 4, title: 'Finalização', description: 'Últimos detalhes' }
  ];

  const areaAtuacaoOptions = [
    { value: 'tecnologia', label: 'Tecnologia', icon: '💻' },
    { value: 'marketing', label: 'Marketing', icon: '📈' },
    { value: 'vendas', label: 'Vendas', icon: '💰' },
    { value: 'produto', label: 'Produto', icon: '🚀' },
    { value: 'design', label: 'Design', icon: '🎨' },
    { value: 'financeiro', label: 'Financeiro', icon: '💼' },
    { value: 'recursos_humanos', label: 'Recursos Humanos', icon: '👥' },
    { value: 'operacoes', label: 'Operações', icon: '⚙️' },
    { value: 'consultoria', label: 'Consultoria', icon: '🎯' },
    { value: 'educacao', label: 'Educação', icon: '📚' },
    { value: 'saude', label: 'Saúde', icon: '🏥' },
    { value: 'outros', label: 'Outros', icon: '🌟' }
  ];

  const tamanhoEmpresaOptions = [
    { value: 'freelancer', label: 'Freelancer / Autônomo', description: 'Trabalho independente' },
    { value: 'startup_1_10', label: 'Startup (1-10 pessoas)', description: 'Empresa em estágio inicial' },
    { value: 'pequena_11_50', label: 'Pequena empresa (11-50)', description: 'Empresa estabelecida' },
    { value: 'media_51_200', label: 'Média empresa (51-200)', description: 'Empresa em crescimento' },
    { value: 'grande_201_1000', label: 'Grande empresa (201-1000)', description: 'Empresa consolidada' },
    { value: 'corporacao_1000_plus', label: 'Corporação (1000+)', description: 'Grande corporação' }
  ];

  const nivelConhecimentoOptions = [
    { value: 'iniciante', label: 'Iniciante', description: 'Começando agora com produtos digitais' },
    { value: 'intermediario', label: 'Intermediário', description: 'Já tenho alguma experiência' },
    { value: 'avancado', label: 'Avançado', description: 'Experiência sólida na área' },
    { value: 'especialista', label: 'Especialista', description: 'Sou referência no assunto' }
  ];

  const objetivoPrincipalOptions = [
    { value: 'criar_primeiro_produto', label: 'Criar meu primeiro produto', icon: '🚀' },
    { value: 'melhorar_produto_existente', label: 'Melhorar produto existente', icon: '⚡' },
    { value: 'validar_ideia', label: 'Validar uma ideia', icon: '💡' },
    { value: 'estruturar_processo', label: 'Estruturar processo de produto', icon: '📋' },
    { value: 'capacitar_equipe', label: 'Capacitar minha equipe', icon: '👥' },
    { value: 'consultoria_clientes', label: 'Consultoria para clientes', icon: '🎯' },
    { value: 'outros', label: 'Outros objetivos', icon: '🌟' }
  ];

  const origemConhecimentoOptions = [
    { value: 'google', label: 'Google / Busca', icon: '🔍' },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { value: 'instagram', label: 'Instagram', icon: '📸' },
    { value: 'youtube', label: 'YouTube', icon: '📺' },
    { value: 'indicacao', label: 'Indicação de amigo', icon: '👥' },
    { value: 'evento', label: 'Evento / Palestra', icon: '🎤' },
    { value: 'blog', label: 'Blog / Artigo', icon: '📝' },
    { value: 'podcast', label: 'Podcast', icon: '🎧' },
    { value: 'outros', label: 'Outros', icon: '🌟' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
        if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
        if (!formData.senha) newErrors.senha = 'Senha é obrigatória';
        else if (formData.senha.length < 8) newErrors.senha = 'Senha deve ter pelo menos 8 caracteres';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.senha)) newErrors.senha = 'Senha deve conter letra maiuscula, minuscula e numero';
        if (formData.senha !== formData.confirmarSenha) newErrors.confirmarSenha = 'Senhas não conferem';
        break;
        
      case 2:
        if (!formData.areaAtuacao) newErrors.areaAtuacao = 'Selecione sua área de atuação';
        if (!formData.tamanhoEmpresa) newErrors.tamanhoEmpresa = 'Selecione o tamanho da empresa';
        if (!formData.nivelConhecimento) newErrors.nivelConhecimento = 'Selecione seu nível de conhecimento';
        break;
        
      case 3:
        if (!formData.objetivoPrincipal) newErrors.objetivoPrincipal = 'Selecione seu objetivo principal';
        if (!formData.origemConhecimento) newErrors.origemConhecimento = 'Nos conte como conheceu o GenesiX';
        break;
        
      case 4:
        if (!formData.aceitaTermos) newErrors.aceitaTermos = 'Você deve aceitar os termos de uso';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(4)) return;
    
    setIsLoading(true);
    
    try {
      if (onRegister) {
        await onRegister({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          confirmar_senha: formData.confirmarSenha,
          perfil: {
            area_atuacao: formData.areaAtuacao,
            tamanho_empresa: formData.tamanhoEmpresa,
            nivel_conhecimento: formData.nivelConhecimento,
            objetivo_principal: formData.objetivoPrincipal,
            origem_conhecimento: formData.origemConhecimento,
            whatsapp: formData.whatsapp,
          },
          aceitaTermos: formData.aceitaTermos,
          aceitaMarketing: formData.aceitaMarketing,
        });
      }
    } catch (error) {
      if (error?.data?.details?.length) {
        const apiErrors = {};
        error.data.details.forEach(({ field, message }) => {
          if (!field) return;
          const normalizedField = field.replace('confirmar_senha', 'confirmarSenha');
          apiErrors[normalizedField] = message;
        });
        setErrors(prev => ({ ...prev, ...apiErrors, general: error?.message }));
      } else {
        setErrors({ general: error?.message || 'Erro ao criar conta. Tente novamente.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthRegister = (provider) => {
    window.location.href = `/api/auth/${provider}`;
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vamos começar!</h2>
        <p className="text-gray-600">Primeiro, precisamos de algumas informações básicas</p>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-3 mb-6">
        <button
          onClick={() => handleOAuthRegister('google')}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-gray-700 font-medium">Cadastrar com Google</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleOAuthRegister('github')}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
          >
            <Github className="w-5 h-5 text-gray-700" />
            <span className="text-gray-700 font-medium">GitHub</span>
          </button>
          
          <button
            onClick={() => handleOAuthRegister('linkedin')}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
          >
            <Linkedin className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700 font-medium">LinkedIn</span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">ou preencha manualmente</span>
        </div>
      </div>

      {/* Nome */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nome completo</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
              errors.nome ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            placeholder="Seu nome completo"
          />
        </div>
        {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
              errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            placeholder="seu@email.com"
          />
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      {/* Senha */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
              errors.senha ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            placeholder="Mínimo 8 caracteres"
          />
        </div>
        {errors.senha && <p className="mt-1 text-sm text-red-600">{errors.senha}</p>}
      </div>

      {/* Confirmar Senha */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar senha</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="password"
            name="confirmarSenha"
            value={formData.confirmarSenha}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
              errors.confirmarSenha ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            placeholder="Digite a senha novamente"
          />
        </div>
        {errors.confirmarSenha && <p className="mt-1 text-sm text-red-600">{errors.confirmarSenha}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Conte-nos sobre você</h2>
        <p className="text-gray-600">Vamos personalizar sua experiência no GenesiX</p>
      </div>

      {/* Área de Atuação */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Em qual área você atua?</label>
        <div className="grid grid-cols-2 gap-3">
          {areaAtuacaoOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, areaAtuacao: option.value }))}
              className={`p-3 border rounded-xl text-left transition-all duration-200 ${
                formData.areaAtuacao === option.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{option.icon}</span>
                <span className="font-medium text-sm">{option.label}</span>
              </div>
            </button>
          ))}
        </div>
        {errors.areaAtuacao && <p className="mt-1 text-sm text-red-600">{errors.areaAtuacao}</p>}
      </div>

      {/* Tamanho da Empresa */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Qual o tamanho da sua empresa?</label>
        <div className="space-y-2">
          {tamanhoEmpresaOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, tamanhoEmpresa: option.value }))}
              className={`w-full p-4 border rounded-xl text-left transition-all duration-200 ${
                formData.tamanhoEmpresa === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900">{option.label}</div>
              <div className="text-sm text-gray-600">{option.description}</div>
            </button>
          ))}
        </div>
        {errors.tamanhoEmpresa && <p className="mt-1 text-sm text-red-600">{errors.tamanhoEmpresa}</p>}
      </div>

      {/* Nível de Conhecimento */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Qual seu nível de conhecimento em produtos digitais?</label>
        <div className="space-y-2">
          {nivelConhecimentoOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, nivelConhecimento: option.value }))}
              className={`w-full p-4 border rounded-xl text-left transition-all duration-200 ${
                formData.nivelConhecimento === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900">{option.label}</div>
              <div className="text-sm text-gray-600">{option.description}</div>
            </button>
          ))}
        </div>
        {errors.nivelConhecimento && <p className="mt-1 text-sm text-red-600">{errors.nivelConhecimento}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Seus objetivos</h2>
        <p className="text-gray-600">Como podemos ajudar você a alcançar seus objetivos?</p>
      </div>

      {/* Objetivo Principal */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Qual seu objetivo principal com o GenesiX?</label>
        <div className="grid grid-cols-1 gap-3">
          {objetivoPrincipalOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, objetivoPrincipal: option.value }))}
              className={`p-4 border rounded-xl text-left transition-all duration-200 ${
                formData.objetivoPrincipal === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{option.icon}</span>
                <span className="font-medium text-gray-900">{option.label}</span>
              </div>
            </button>
          ))}
        </div>
        {errors.objetivoPrincipal && <p className="mt-1 text-sm text-red-600">{errors.objetivoPrincipal}</p>}
      </div>

      {/* Origem do Conhecimento */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Como você conheceu o GenesiX?</label>
        <div className="grid grid-cols-2 gap-3">
          {origemConhecimentoOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, origemConhecimento: option.value }))}
              className={`p-3 border rounded-xl text-left transition-all duration-200 ${
                formData.origemConhecimento === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{option.icon}</span>
                <span className="font-medium text-sm">{option.label}</span>
              </div>
            </button>
          ))}
        </div>
        {errors.origemConhecimento && <p className="mt-1 text-sm text-red-600">{errors.origemConhecimento}</p>}
      </div>

      {/* WhatsApp (opcional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          WhatsApp <span className="text-gray-500">(opcional)</span>
        </label>
        <input
          type="tel"
          name="whatsapp"
          value={formData.whatsapp}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          placeholder="(11) 99999-9999"
        />
        <p className="mt-1 text-sm text-gray-500">
          Para receber dicas exclusivas e atualizações importantes
        </p>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quase lá!</h2>
        <p className="text-gray-600">Últimos detalhes para finalizar seu cadastro</p>
      </div>

      {/* Resumo */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Resumo do seu perfil:</h3>
        <div className="space-y-2 text-sm">
          <div><span className="font-medium">Nome:</span> {formData.nome}</div>
          <div><span className="font-medium">Email:</span> {formData.email}</div>
          <div><span className="font-medium">Área:</span> {areaAtuacaoOptions.find(o => o.value === formData.areaAtuacao)?.label}</div>
          <div><span className="font-medium">Empresa:</span> {tamanhoEmpresaOptions.find(o => o.value === formData.tamanhoEmpresa)?.label}</div>
          <div><span className="font-medium">Nível:</span> {nivelConhecimentoOptions.find(o => o.value === formData.nivelConhecimento)?.label}</div>
          <div><span className="font-medium">Objetivo:</span> {objetivoPrincipalOptions.find(o => o.value === formData.objetivoPrincipal)?.label}</div>
        </div>
      </div>

      {/* Termos */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="aceitaTermos"
            name="aceitaTermos"
            checked={formData.aceitaTermos}
            onChange={handleInputChange}
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="aceitaTermos" className="text-sm text-gray-700">
            Eu aceito os{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Termos de Uso
            </a>
            {' '}e a{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Política de Privacidade
            </a>
            {' '}do GenesiX
          </label>
        </div>
        {errors.aceitaTermos && <p className="text-sm text-red-600">{errors.aceitaTermos}</p>}

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="aceitaMarketing"
            name="aceitaMarketing"
            checked={formData.aceitaMarketing}
            onChange={handleInputChange}
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="aceitaMarketing" className="text-sm text-gray-700">
            Quero receber dicas, novidades e conteúdos exclusivos sobre produtos digitais
            <span className="text-gray-500"> (opcional)</span>
          </label>
        </div>
      </div>

      {/* Benefícios */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3">🎉 Você terá acesso a:</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>Metodologia completa de criação de produtos</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>Templates e frameworks prontos para usar</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>Colaboração em tempo real com sua equipe</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>Suporte especializado para suas dúvidas</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Junte-se ao GenesiX
          </h1>
          <p className="text-gray-600">
            ✨ Transforme suas ideias em produtos incríveis
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900">
              {steps[currentStep - 1].title}
            </div>
            <div className="text-xs text-gray-500">
              {steps[currentStep - 1].description}
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {errors.general && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Criando conta...
                    </>
                  ) : (
                    <>
                      Criar conta
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Faça login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
