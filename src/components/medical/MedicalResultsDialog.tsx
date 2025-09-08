import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download, Calendar, User, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MedicalResult {
  id: string;
  exam_type: string;
  exam_date: string;
  result_summary: string;
  file_url?: string;
  doctor_name?: string;
  status: string;
  created_at: string;
}

interface MedicalResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MedicalResultsDialog = ({ open, onOpenChange }: MedicalResultsDialogProps) => {
  const { user } = useAuth();
  const [results, setResults] = useState<MedicalResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (open && user?.id) {
      fetchMedicalResults();
    }
  }, [open, user?.id]);

  const fetchMedicalResults = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('medical_results')
        .select('*')
        .eq('patient_id', user!.id)
        .order('exam_date', { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar resultados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'disponivel':
        return 'default';
      case 'pendente':
        return 'secondary';
      case 'processando':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'disponivel':
        return 'Disponível';
      case 'pendente':
        return 'Pendente';
      case 'processando':
        return 'Processando';
      default:
        return status;
    }
  };

  const handleDownload = (result: MedicalResult) => {
    if (result.file_url) {
      window.open(result.file_url, '_blank');
    } else {
      toast({
        title: "Arquivo não disponível",
        description: "Este resultado não possui arquivo para download.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl lg:max-w-4xl h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            Meus Resultados de Exames
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando resultados...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result) => (
                <Card key={result.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {result.exam_type}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(result.exam_date).toLocaleDateString('pt-BR')}
                          </span>
                          {result.doctor_name && (
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {result.doctor_name}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusVariant(result.status)}>
                          {getStatusLabel(result.status)}
                        </Badge>
                        {result.file_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(result)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {result.result_summary && (
                    <CardContent>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Resumo do Resultado:</h4>
                        <p className="text-sm text-muted-foreground">
                          {result.result_summary}
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground">
                Você ainda não possui resultados de exames disponíveis.
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};