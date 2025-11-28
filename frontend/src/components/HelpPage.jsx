import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const faqs = [
  { q: "Como retomar o wizard de um projeto?", a: "Use a rota #contexto-problema ou abra via dashboard. O backend guarda o passo atual." },
  { q: "Onde ficam as versões dos documentos?", a: "Em #documents você abre um documento e navega por versões." },
  { q: "Posso convidar colaboradores?", a: "Sim, em #collaboration ou na página de workspace. Convites são emitidos pelo backend." },
];

const HelpPage = () => (
  <div className="p-6 space-y-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Ajuda</p>
        <h2 className="text-2xl font-bold text-gray-900">Central de ajuda e documentação</h2>
        <p className="text-sm text-gray-600">Guia rápido e links para docs futuras.</p>
      </div>
      <Button className="gap-2">
        <MessageCircle className="w-4 h-4" />
        Falar com suporte
      </Button>
    </div>

    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, idx) => (
          <AccordionItem key={idx} value={`faq-${idx}`}>
            <AccordionTrigger className="text-sm font-semibold text-gray-900">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-gray-700">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {["Documentação da API", "Guia do Wizard", "Playbook de IA"].map((item) => (
        <div key={item} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">{item}</h3>
          <p className="text-sm text-gray-600 mt-1">Conteúdo em preparação.</p>
          <Button variant="outline" className="mt-3">Abrir</Button>
        </div>
      ))}
    </div>
  </div>
);

export default HelpPage;
