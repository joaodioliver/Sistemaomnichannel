import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar, Clock, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useConversations } from "@/hooks/useConversations";
import { supabase, Appointment } from "@/lib/supabase";

export const PatientDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const { conversations, loading: conversationsLoading } = useConversations(profile?.role, user?.id);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    }
  }, [user?.id]);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', user?.id)
        .gte('scheduled_date', new Date().toISOString().split('T')[0])
        .order('scheduled_date', { ascending: true })
        .limit(5);

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoadingAppointments(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Portal do Paciente</h1>
            <p className="text-muted-foreground">Bem-vindo, {profile?.full_name}</p>
          </div>
          <Button variant="outline" onClick={signOut}>
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
              {conversationsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : conversations.length > 0 ? (
                conversations.slice(0, 3).map((conv) => (
                  <div key={conv.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{conv.channel}</span>
                        <Badge variant={conv.status === "aberta" ? "default" : "secondary"}>
                          {conv.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {conv.subject || "Conversa ativa"}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(conv.last_message_at).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Nenhuma conversa ativa
                </p>
              )}
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
              {loadingAppointments ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : appointments.length > 0 ? (
                appointments.map((apt) => (
                  <div key={apt.id} className="p-3 border rounded-lg">
                    <div className="font-medium">{apt.doctor_name}</div>
                    <div className="text-sm text-muted-foreground">{apt.specialty}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        {new Date(apt.scheduled_date).toLocaleDateString('pt-BR')} às {apt.scheduled_time}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Nenhuma consulta agendada
                </p>
              )}
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