import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  BarChart as BarChartIcon,
  TrendingUp,
  CheckCircle,
  Users,
  FileText,
  Target,
  Activity,
  Calendar,
  MousePointer,
} from "lucide-react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { analyticsService } from "@/services/api";
import GlobalLoader from "./GlobalLoader";
import { notify } from "./GlobalToast";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

const timeRangeOptions = [
  { value: "7d", label: "Ultimos 7 dias", days: 7 },
  { value: "30d", label: "Ultimos 30 dias", days: 30 },
  { value: "90d", label: "Ultimos 90 dias", days: 90 },
];

const AnalyticsPage = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [documentsData, setDocumentsData] = useState(null);
  const [collabData, setCollabData] = useState(null);
  const [timelineData, setTimelineData] = useState([]);

  const periodDays = useMemo(() => {
    const opt = timeRangeOptions.find((o) => o.value === selectedTimeRange);
    return opt ? opt.days : 30;
  }, [selectedTimeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [dashRes, docsRes, collabRes, timelineRes] = await Promise.all([
        analyticsService.getDashboard(periodDays),
        analyticsService.getDocuments(periodDays),
        analyticsService.getCollaboration(periodDays),
        analyticsService.getTimeline(periodDays, 30),
      ]);
      setDashboard(dashRes?.data);
      setDocumentsData(docsRes?.data);
      setCollabData(collabRes?.data);
      setTimelineData(timelineRes?.data?.timeline || []);
    } catch (error) {
      notify.error("Erro ao carregar analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodDays]);

  const overview = dashboard?.overview || {};
  const docsDist = documentsData?.distribution?.by_step || [];
  const docsStatus = documentsData?.distribution?.by_status || [];
  const dailyActivity = documentsData?.productivity?.daily_activity || [];
  const topTags = documentsData?.productivity?.top_tags || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics
          </h1>
          <p className="text-gray-600 mt-1">Metricas e insights do seu workspace</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            {timeRangeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm" onClick={fetchAnalytics}>
            <BarChartIcon className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <GlobalLoader label="Carregando analytics..." />
        </div>
      )}

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-700">
                  {overview.total_projects || 0}
                </p>
                <p className="text-sm text-blue-600">Projetos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-700">
                  {overview.total_documents || 0}
                </p>
                <p className="text-sm text-green-600">Documentos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-700">
                  {overview.total_collaborations || 0}
                </p>
                <p className="text-sm text-purple-600">Colaboracoes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-700">
                  {overview.approval_rate || 0}%
                </p>
                <p className="text-sm text-orange-600">Aprovacao docs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progresso e atividade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Progresso e Atividade
          </CardTitle>
          <CardDescription>Distribuicao de documentos por etapa e atividade diaria</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold mb-2">Docs por Etapa</h4>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={docsDist}
                  dataKey="count"
                  nameKey="etapa"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {docsDist.map((entry, index) => (
                    <Cell key={entry.etapa} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {docsDist.length === 0 && <p className="text-sm text-gray-500">Sem dados de distribuicao</p>}
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">Atividade diaria</h4>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#3B82F6" fill="#BFDBFE" />
              </AreaChart>
            </ResponsiveContainer>
            {dailyActivity.length === 0 && <p className="text-sm text-gray-500">Sem atividade no periodo.</p>}
          </div>
        </CardContent>
      </Card>

      {/* Status e tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Status dos Documentos
          </CardTitle>
          <CardDescription>Distribuicao por status e tags mais usadas</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={docsStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            {docsStatus.length === 0 && <p className="text-sm text-gray-500">Sem dados de status.</p>}
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-2">Top Tags</h4>
            <div className="flex flex-wrap gap-2">
              {topTags.length === 0 && <p className="text-sm text-gray-500">Sem tags registradas.</p>}
              {topTags.map((tag) => (
                <Badge key={tag.tag} variant="outline">
                  {tag.tag} ({tag.count})
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Colaboracao e timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Colaboracao e Timeline
          </CardTitle>
          <CardDescription>Convites, colaboracoes e eventos recentes</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <Card className="border border-purple-100">
              <CardContent className="p-4 flex items-center gap-3">
                <MousePointer className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-xl font-bold text-purple-700">
                    {collabData?.overview?.active_collaborations || 0}
                  </p>
                  <p className="text-sm text-purple-600">Colaboracoes ativas</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-blue-100">
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-xl font-bold text-blue-700">
                    {collabData?.overview?.invites_sent || 0}
                  </p>
                  <p className="text-sm text-blue-600">Convites enviados</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-green-100">
              <CardContent className="p-4 flex items-center gap-3">
                <Target className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-xl font-bold text-green-700">
                    {collabData?.overview?.acceptance_rate || 0}%
                  </p>
                  <p className="text-sm text-green-600">Taxa de aceite</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold mb-2">Timeline recente</h4>
            <div className="space-y-2 max-h-80 overflow-auto pr-2">
              {timelineData.length === 0 && <p className="text-sm text-gray-500">Sem eventos recentes.</p>}
              {timelineData.map((item) => (
                <div key={item.id} className="p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.type}</Badge>
                      <span className="font-semibold">{item.title}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
