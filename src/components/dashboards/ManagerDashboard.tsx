import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, MessageCircle, Clock, TrendingUp, Eye } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Attendant, PerformanceMetric } from "@/types/supabase";

export const ManagerDashboard = () => {
  const { signOut, profile } = useAuth();
  const [attendants, setAttendants] = useState<Attendant[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch attendants with their profiles
      const { data: attendantsData } = await supabase
        .from('attendants')
        .select(`
          *,
          user_profile:user_profiles(*)
        `);

      setAttendants(attendantsData || []);

      // Fetch recent performance metrics
      const { data: metricsData } = await supabase
        .from('performance_metrics')
        .select('*')
        .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: true });

      setMetrics(metricsData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  const attendanceData = [
    { name: "WhatsApp", value: 45, color: "#25D366" },
    { name: "Instagram", value: 25, color: "#E4405F" },
    { name: "E-mail", value: 20, color: "#34495E" },
    { name: "Facebook", value: 10, color: "#1877F2" },
  ];

  const performanceData = [
    { name: "Seg", atendimentos: 45, tempo: 12 },
    { name: "Ter", atendimentos: 52, tempo: 8 },
    { name: "Qua", atendimentos: 38, tempo: 15 },
    { name: "Qui", atendimentos: 61, tempo: 10 },
    { name: "Sex", atendimentos: 55, tempo: 7 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Gerencial</h1>
            <p className="text-muted-foreground">Bem-vindo, {profile?.full_name}</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            Sair
          </Button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atendimentos Hoje</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">+12% em relação a ontem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio Resposta</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2m 18s</div>
              <p className="text-xs text-muted-foreground">-15% em relação a ontem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground">+3% em relação a ontem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfação Média</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">91%</div>
              <p className="text-xs text-muted-foreground">+2% em relação a ontem</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Semanal</CardTitle>
              <CardDescription>Atendimentos realizados por dia</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="atendimentos" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Canais */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Canal</CardTitle>
              <CardDescription>Percentual de atendimentos por canal</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Atendentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Equipe de Atendimento
            </CardTitle>
            <CardDescription>Monitoramento em tempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendants.map((attendant) => (
                <div key={attendant.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        attendant.is_online ? "bg-green-500" : "bg-gray-500"
                      }`} />
                      <span className="font-medium">
                        {attendant.user_profile?.full_name || "Atendente"}
                      </span>
                    </div>
                    <Badge variant="outline">
                      {attendant.department || "Atendimento Geral"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {attendant.last_activity 
                          ? new Date(attendant.last_activity).toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })
                          : "--:--"
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">Última atividade</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {attendant.is_online ? "Online" : "Offline"}
                      </div>
                      <div className="text-xs text-muted-foreground">Status</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm font-medium">85%</div>
                      <div className="text-xs text-muted-foreground">Performance</div>
                      <Progress value={85} className="w-16 h-1 mt-1" />
                    </div>
                    
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {attendants.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum atendente cadastrado
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};