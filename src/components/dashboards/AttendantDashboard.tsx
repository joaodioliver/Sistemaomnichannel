import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Clock, User, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";
import { supabase, QuickReply } from "@/lib/supabase";

export const AttendantDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const { conversations, loading: conversationsLoading } = useConversations(profile?.role, user?.id);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const { messages, sendMessage, loading: messagesLoading } = useMessages(selectedConversation || undefined);
  const [message, setMessage] = useState("");
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);

  useEffect(() => {
    fetchQuickReplies();
  }, []);

  const fetchQuickReplies = async () => {
    try {
      const { data, error } = await supabase
        .from('quick_replies')
        .select('*')
        .or(`attendant_id.eq.${user?.id},is_global.eq.true`)
        .order('usage_count', { ascending: false });

      if (error) throw error;
      setQuickReplies(data || []);
    } catch (error) {
      console.error('Error fetching quick replies:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !user?.id) return;

    await sendMessage(user.id, message);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Central de Atendimento</h1>
            <p className="text-muted-foreground">Bem-vindo, {profile?.full_name}</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
          {/* Lista de Conversas */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Conversas Ativas
              </CardTitle>
              <CardDescription>Filas de atendimento</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 max-h-[500px] overflow-y-auto">
                {conversationsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : conversations.length > 0 ? (
                  conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`p-4 cursor-pointer border-b hover:bg-accent ${
                        selectedConversation === conv.id ? "bg-accent" : ""
                      }`}
                      onClick={() => setSelectedConversation(conv.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium">
                            {conv.patient?.user_profile?.full_name || "Paciente"}
                          </span>
                          <Badge variant={conv.status === "aberta" ? "default" : "secondary"}>
                            {conv.status}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(conv.last_message_at).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.subject || "Conversa ativa"}
                        </p>
                        <Badge variant="outline">{conv.channel}</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma conversa disponível
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Ativo */}
          <Card className="col-span-8 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {selectedConversation && conversations.find(c => c.id === selectedConversation)
                  ? `${conversations.find(c => c.id === selectedConversation)?.patient?.user_profile?.full_name || "Paciente"} - ${conversations.find(c => c.id === selectedConversation)?.channel}`
                  : "Selecione uma conversa"
                }
              </CardTitle>
              <CardDescription>
                {selectedConversation ? "Conversa ativa" : "Escolha uma conversa da lista"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Mensagens */}
                  <div className="flex-1 space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                    {messagesLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : messages.length > 0 ? (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              msg.sender_id === user?.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <span className="text-xs opacity-70">
                              {new Date(msg.created_at).toLocaleTimeString('pt-BR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        Nenhuma mensagem ainda
                      </p>
                    )}
                  </div>

                  {/* Respostas Rápidas */}
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Respostas Rápidas:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.slice(0, 4).map((reply, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => setMessage(reply.content)}
                        >
                          {reply.title}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Campo de Mensagem */}
                  <div className="flex gap-2">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="flex-1 min-h-[60px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button className="self-end" onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-muted-foreground">Selecione uma conversa para começar</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};