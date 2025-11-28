const express = require('express');

const router = express.Router();

// GET /api/plans - listar planos
router.get('/plans', (req, res) => {
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 19,
      period: 'month',
      features: ['Projetos ilimitados', 'Wizard completo', 'Docs versionados'],
      limits: { collaborators: 3, documents: 200 },
    },
    {
      id: 'team',
      name: 'Team',
      price: 49,
      period: 'month',
      features: ['Colaboracao em tempo real', 'Notificacoes', 'Workspaces dedicados'],
      limits: { collaborators: 20, documents: 2000 },
      highlight: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: null,
      period: 'month',
      features: ['SSO/SAML', 'Suporte dedicado', 'SLA'],
      limits: { collaborators: null, documents: null },
    },
  ];

  res.json({ data: { plans } });
});

// POST /api/subscriptions - criar/placeholder
router.post('/subscriptions', (req, res) => {
  res.status(201).json({
    data: {
      subscription: {
        id: 'sub_mock',
        plan: req.body.plan_id || 'team',
        status: 'active',
      },
    },
    message: 'Subscription placeholder criada',
  });
});

// GET /api/subscriptions/:id - obter assinatura
router.get('/subscriptions/:id', (req, res) => {
  res.json({
    data: {
      subscription: {
        id: req.params.id,
        plan: 'team',
        status: 'active',
      },
    },
  });
});

// PUT /api/subscriptions/:id/cancel - cancelar
router.put('/subscriptions/:id/cancel', (req, res) => {
  res.json({
    data: {
      subscription: {
        id: req.params.id,
        status: 'canceled',
      },
    },
    message: 'Assinatura cancelada (placeholder)',
  });
});

module.exports = router;
