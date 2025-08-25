import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar, Clock, FileText } from "lucide-react";

export const PatientDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const conversations = [
    { id: 1, channel: "WhatsApp", lastMessage: "Consulta agendada para amanhã", time: "10:30", status: "respondido" },
    { id: 2, channel: "Instagram", lastMessage: "Resultado do exame disponível", time: "09:15", status: "novo" },
  ];

  const appointments = [
    { id: 1, doctor: "Dr. Silva", specialty: "Cardiologia", date: "26/08/2025", time: "14:00" },
    { id: 2, doctor: "Dra. Santos", specialty: "Dermatologia", date: "28/08/2025", time: "10:30" },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Portal do Paciente</h1>
          <Button variant="outline" onClick={onLogout}>
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Conversas Recentes
              </CardTitle>
              <CardDescription>Suas mensagens com a clínica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {conversations.map((conv) => (
                <div key={conv.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{conv.channel}</span>
                      <Badge variant={conv.status === "novo" ? "default" : "secondary"}>
                        {conv.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{conv.lastMessage}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{conv.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximas Consultas
              </CardTitle>
              <CardDescription>Seus agendamentos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-3 border rounded-lg">
                  <div className="font-medium">{apt.doctor}</div>
                  <div className="text-sm text-muted-foreground">{apt.specialty}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{apt.date} às {apt.time}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Ações Rápidas
              </CardTitle>
              <CardDescription>O que você gostaria de fazer?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                Nova Mensagem
              </Button>
              <Button className="w-full" variant="outline">
                Agendar Consulta
              </Button>
              <Button className="w-full" variant="outline">
                Ver Resultados
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};