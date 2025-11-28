import { useEffect, useMemo, useState } from "react";
import { planService } from "@/services/api";
import { notify } from "./GlobalToast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Receipt, Download, Loader2, Check } from "lucide-react";

const fallbackInvoices = [
  { id: "inv-1021", date: "2025-02-01", amount: "US", status: "Pago" },
  { id: "inv-1020", date: "2025-01-01", amount: "US", status: "Pago" },
  { id: "inv-1019", date: "2024-12-01", amount: "US", status: "Pago" },
];

const BillingPage = () => {
  const [subscription, setSubscription] = useState(null);
  const [planOptions, setPlanOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subscribing, setSubscribing] = useState(null);

  const currentPlan = useMemo(() => {
    if (!subscription) return null;
    return planOptions.find((p) => p.id === subscription.plan) || null;
  }, [subscription, planOptions]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const plansResp = await planService.getPlans();
        const plans = plansResp?.data?.plans || plansResp?.data?.data?.plans || [];
        setPlanOptions(plans);
        const storedId = localStorage.getItem("genesix_subscription_id");
        if (storedId) {
          try {
            const subResp = await planService.getSubscription(storedId);
            const sub = subResp?.data?.subscription || subResp?.data?.data?.subscription;
            if (sub) setSubscription(sub);
          } catch (e) {}
        }
      } catch (error) {
        notify.error("Erro ao carregar billing, usando fallback.");
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
        localStorage.setItem("genesix_subscription_id", sub.id);
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
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Billing</p>
          <h2 className="text-2xl font-bold text-gray-900">Cobranca e faturas</h2>
          <p className="text-sm text-gray-600">Estrutura pronta para conectar ao provider de pagamentos.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <CreditCard className="w-4 h-4" />
          Atualizar cartao
        </Button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          Carregando billing...
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Receipt className="w-5 h-5 text-blue-500" />
              Historico de faturas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(subscription?.invoices || fallbackInvoices).map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 bg-white"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{inv.id}</p>
                  <p className="text-xs text-gray-500">{inv.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">{inv.amount}</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-50 text-green-700">{inv.status}</span>
                  <Button size="sm" variant="ghost" className="gap-1">
                    <Download className="w-4 h-4" />
                    PDF
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm">Uso do plano</CardTitle>
            <CardDescription className="text-xs">
              Plano atual: {currentPlan?.name || subscription?.plan || "nao definido"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <span>Status</span>
              <span className="font-semibold">{subscription?.status || "ativo"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Renovacao</span>
              <span className="font-semibold">{subscription?.period || "mensal"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Plano</span>
              <span className="font-semibold">{subscription?.plan || "team"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {planOptions.map((plan) => {
          const isCurrent = plan.id === subscription?.plan;
          return (
            <div key={plan.id} className="rounded-2xl border p-5 shadow-sm bg-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <div className="flex items-center gap-2">
                  {isCurrent && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-600 font-semibold">
                      Atual
                    </span>
                  )}
                  {plan.highlight && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold">
                      Popular
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">{plan.price ?? "Custom"}</span>
                <span className="text-sm text-gray-500">{plan.period || "/mes"}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
              <Button
                className="w-full mt-4"
                variant={plan.highlight ? "default" : "outline"}
                disabled={!!subscribing || isCurrent}
                onClick={() => handleSubscribe(plan.id)}
              >
                {subscribing === plan.id && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isCurrent ? "Plano atual" : "Selecionar"}
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

export default BillingPage;
