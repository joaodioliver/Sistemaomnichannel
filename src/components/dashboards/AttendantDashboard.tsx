import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Clock, User, Send } from "lucide-react";
import { useState } from "react";

export const AttendantDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState("");

  const chats = [
    { 
      id: 1, 
      patient: "Maria Silva", 
      channel: "WhatsApp", 
      lastMessage: "Preciso remarcar minha consulta", 
      time: "10:30", 
      status: "aguardando",
      unread: 2
    },
    { 
      id: 2, 
      patient: "João Santos", 
      channel: "Instagram", 
      lastMessage: "Resultado do exame saiu?", 
      time: "09:15", 
      status: "respondido",
      unread: 0
    },
    { 
      id: 3, 
      patient: "Ana Costa", 
      channel: "E-mail", 
      lastMessage: "Dúvida sobre medicação", 
      time: "08:45", 
      status: "novo",
      unread: 1
    },
  ];

  const messages = [
    { id: 1, sender: "patient", text: "Oi, boa tarde!", time: "14:20" },
    { id: 2, sender: "attendant", text: "Boa tarde! Como posso ajudá-la?", time: "14:21" },
    { id: 3, sender: "patient", text: "Preciso remarcar minha consulta de amanhã", time: "14:22" },
  ];

  const quickReplies = [
    "Vou verificar as opções de horário para você",
    "Seu resultado já está disponível",
    "Aguarde um momento, por favor",
    "Consulta confirmada com sucesso"
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Central de Atendimento</h1>
          <Button variant="outline" onClick={onLogout}>
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
          {/* Lista de Chats */}
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
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-4 cursor-pointer border-b hover:bg-accent ${
                      selectedChat === chat.id ? "bg-accent" : ""
                    }`}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{chat.patient}</span>
                        {chat.unread > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{chat.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                      <Badge variant={chat.status === "novo" ? "default" : "secondary"}>
                        {chat.channel}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Ativo */}
          <Card className="col-span-8 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Maria Silva - WhatsApp
              </CardTitle>
              <CardDescription>Conversa iniciada às 14:20</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Mensagens */}
              <div className="flex-1 space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "attendant" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.sender === "attendant"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <span className="text-xs opacity-70">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Respostas Rápidas */}
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Respostas Rápidas:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setMessage(reply)}
                    >
                      {reply}
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
                />
                <Button className="self-end">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};