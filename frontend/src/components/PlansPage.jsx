import { useEffect, useState } from "react";
import { planService } from "@/services/api";
import { notify } from "./GlobalToast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";

const fallbackPlans = [
  { id: "starter", name: "Starter", price: "US", period: "/mes", description: "Para criadores solo validarem ideias.", features: ["Projetos ilimitados", "Wizard completo", "Docs versionados"] },
  { id: "team", name: "Team", price: "US", period: "/mes", description: "Para squads com colaboracao em tempo real.", features: ["Tudo do Starter", "Colaboracao e convites", "Notificacoes e timeline", "Workspace e permissoes"], highlight: true },
  { id: "enterprise", name: "Enterprise", price: "Custom", period: "", description: "Governanca, SSO e limites sob medida.", features: ["SSO/SAML", "Suporte dedicado", "SLA e auditoria"] },
];

const PlansPage = () => {
  const [plans, setPlans] = useState(fallbackPlans);
  const [loading, setLoading] = useState(false);
  const [subscribing, setSubscribing] = useState(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const resp = await planService.getPlans();
        const remotePlans = resp?.data?.plans || resp?.data?.data?.plans;
        if (remotePlans?.length) setPlans(remotePlans);
        const subId = localStorage.getItem('genesix_subscription_id');
        if (subId) {
          try {
            const subResp = await planService.getSubscription(subId);
            const sub = subResp?.data?.subscription || subResp?.data?.data?.subscription;
            if (sub) setSubscription(sub);
          } catch (e) {}
        }
      } catch (error) {
        notify.error("Nao foi possivel carregar planos, usando fallback.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubscribe = async (planId) => {
    try {
      setSubscribing(planId);
      const resp = await planService.createSubscription(planId);
      const sub = resp?.data?.subscription || resp?.data?.data?.subscription;
      if (sub?.id) {
        localStorage.setItem('genesix_subscription_id', sub.id);
        setSubscription(sub);
        notify.success("Plano selecionado");
      }
    } catch (error) {
      notify.error("Erro ao selecionar plano");
    } finally {
      setSubscribing(null);
    }
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Planos</p>
          <h2 className="text-2xl font-bold text-gray-900">Escolha o plano ideal</h2>
          <p className="text-sm text-gray-600">Backend pronto para carregamento dinamico de ofertas.</p>
        </div>
        <Button variant="outline">Comparar planos</Button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          Carregando planos...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const isCurrent = plan.id === subscription?.plan;
          return (
            <div key={plan.id} className={ounded-2xl border p-5 shadow-sm bg-white }>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <div className="flex items-center gap-2">
                  {isCurrent && <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-600 font-semibold">Atual</span>}
                  {plan.highlight && <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold">Popular</span>}
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">{plan.price ?? 'Custom'}</span>
                <span className="text-sm text-gray-500">{plan.period || '/mes'}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
              <Button
                className="w-full mt-4"
                variant={plan.highlight ? "default" : "outline"}
                disabled={!!subscribing || isCurrent}
                onClick={() => handleSubscribe(plan.id)}
              >
                {subscribing === plan.id && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isCurrent ? 'Plano atual' : 'Selecionar'}
              </Button>
              <div className="mt-4 space-y-2">
                {plan.features?.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlansPage;
