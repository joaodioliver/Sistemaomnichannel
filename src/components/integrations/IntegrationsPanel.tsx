import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Instagram, Facebook, Mail, Link2, Check, X } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected';
  color: string;
}

export const IntegrationsPanel = () => {
  const { toast } = useToast();
  const [whatsappKey, setWhatsappKey] = useState("");
  const [instagramKey, setInstagramKey] = useState("");
  const [facebookKey, setFacebookKey] = useState("");

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'Conecte sua conta do WhatsApp Business',
      icon: <MessageCircle className="h-5 w-5" />,
      status: 'disconnected',
      color: 'text-green-600',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Integre com Instagram Direct Messages',
      icon: <Instagram className="h-5 w-5" />,
      status: 'disconnected',
      color: 'text-pink-600',
    },
    {
      id: 'facebook',
      name: 'Facebook Messenger',
      description: 'Conecte com Facebook Messenger',
      icon: <Facebook className="h-5 w-5" />,
      status: 'disconnected',
      color: 'text-blue-600',
    },
    {
      id: 'email',
      name: 'E-mail',
      description: 'Configure integração com e-mail',
      icon: <Mail className="h-5 w-5" />,
      status: 'disconnected',
      color: 'text-gray-600',
    },
  ]);

  const handleConnect = (integrationId: string) => {
    // Validação simples de API key
    let apiKey = '';
    if (integrationId === 'whatsapp') apiKey = whatsappKey;
    if (integrationId === 'instagram') apiKey = instagramKey;
    if (integrationId === 'facebook') apiKey = facebookKey;

    if (!apiKey && integrationId !== 'email') {
      toast({
        title: "API Key necessária",
        description: "Por favor, insira a API Key para conectar.",
        variant: "destructive",
      });
      return;
    }

    setIntegrations(prev => 
      prev.map(int => 
        int.id === integrationId 
          ? { ...int, status: 'connected' as const } 
          : int
      )
    );

    toast({
      title: "Integração conectada!",
      description: `${integrations.find(i => i.id === integrationId)?.name} foi conectado com sucesso.`,
    });

    // Limpar campos
    if (integrationId === 'whatsapp') setWhatsappKey("");
    if (integrationId === 'instagram') setInstagramKey("");
    if (integrationId === 'facebook') setFacebookKey("");
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(int => 
        int.id === integrationId 
          ? { ...int, status: 'disconnected' as const } 
          : int
      )
    );

    toast({
      title: "Integração desconectada",
      description: `${integrations.find(i => i.id === integrationId)?.name} foi desconectado.`,
    });
  };

  const getApiKeyField = (integrationId: string) => {
    switch (integrationId) {
      case 'whatsapp':
        return { value: whatsappKey, onChange: setWhatsappKey };
      case 'instagram':
        return { value: instagramKey, onChange: setInstagramKey };
      case 'facebook':
        return { value: facebookKey, onChange: setFacebookKey };
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          Integrações
        </CardTitle>
        <CardDescription>
          Conecte plataformas de mensagens para centralizar o atendimento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {integrations.map((integration) => {
          const apiKeyField = getApiKeyField(integration.id);
          
          return (
            <Card key={integration.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={integration.color}>
                      {integration.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{integration.name}</h4>
                        <Badge variant={integration.status === 'connected' ? 'default' : 'outline'}>
                          {integration.status === 'connected' ? (
                            <><Check className="h-3 w-3 mr-1" /> Conectado</>
                          ) : (
                            <><X className="h-3 w-3 mr-1" /> Desconectado</>
                          )}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {integration.description}
                      </p>

                      {integration.status === 'disconnected' && apiKeyField && (
                        <div className="space-y-2 mb-3">
                          <Label htmlFor={`${integration.id}-key`}>API Key</Label>
                          <Input
                            id={`${integration.id}-key`}
                            type="password"
                            placeholder="Cole sua API Key aqui"
                            value={apiKeyField.value}
                            onChange={(e) => apiKeyField.onChange(e.target.value)}
                          />
                        </div>
                      )}

                      <Button
                        variant={integration.status === 'connected' ? 'outline' : 'default'}
                        size="sm"
                        onClick={() => 
                          integration.status === 'connected'
                            ? handleDisconnect(integration.id)
                            : handleConnect(integration.id)
                        }
                      >
                        {integration.status === 'connected' ? 'Desconectar' : 'Conectar'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            <strong>Nota:</strong> Para conectar as integrações, você precisa das API Keys das respectivas plataformas. 
            Configure as credenciais de desenvolvedor em cada plataforma antes de conectar.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
