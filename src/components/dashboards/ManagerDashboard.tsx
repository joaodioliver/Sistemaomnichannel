import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, MessageCircle, Clock, TrendingUp, Eye } from "lucide-react";

export const ManagerDashboard = ({ onLogout }: { onLogout: () => void }) => {
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

  const attendants = [
    { 
      id: 1, 
      name: "Ana Silva", 
      status: "online", 
      activeChats: 3, 
      avgResponse: "2m 30s",
      satisfaction: 95,
      todayCount: 12
    },
    { 
      id: 2, 
      name: "Carlos Santos", 
      status: "busy", 
      activeChats: 5, 
      avgResponse: "1m 45s",
      satisfaction: 92,
      todayCount: 18
    },
    { 
      id: 3, 
      name: "Maria Costa", 
      status: "online", 
      activeChats: 2, 
      avgResponse: "3m 15s",
      satisfaction: 88,
      todayCount: 8
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard Gerencial</h1>
          <Button variant="outline" onClick={onLogout}>
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
                        attendant.status === "online" ? "bg-green-500" : "bg-yellow-500"
                      }`} />
                      <span className="font-medium">{attendant.name}</span>
                    </div>
                    <Badge variant="outline">{attendant.activeChats} chats ativos</Badge>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-sm font-medium">{attendant.avgResponse}</div>
                      <div className="text-xs text-muted-foreground">Tempo médio</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm font-medium">{attendant.todayCount}</div>
                      <div className="text-xs text-muted-foreground">Hoje</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm font-medium">{attendant.satisfaction}%</div>
                      <div className="text-xs text-muted-foreground">Satisfação</div>
                      <Progress value={attendant.satisfaction} className="w-16 h-1 mt-1" />
                    </div>
                    
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};