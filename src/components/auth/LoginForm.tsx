import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export const LoginForm = ({ onLogin }: { onLogin: (userType: string) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("atendente");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação de login para demo
    if (email && password) {
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo como ${userType}`,
      });
      onLogin(userType);
    } else {
      toast({
        title: "Erro no login",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sistema Omnichannel</CardTitle>
          <CardDescription>Clínica Médica - Faça seu login</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userType">Tipo de Usuário</Label>
              <Select value={userType} onValueChange={setUserType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paciente">Paciente</SelectItem>
                  <SelectItem value="atendente">Atendente</SelectItem>
                  <SelectItem value="gerente">Gerente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};