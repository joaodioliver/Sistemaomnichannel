import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/components/auth/LoginForm";
import { PatientDashboard } from "@/components/dashboards/PatientDashboard";
import { AttendantDashboard } from "@/components/dashboards/AttendantDashboard";
import { ManagerDashboard } from "@/components/dashboards/ManagerDashboard";

const Index = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <LoginForm />;
  }

  return (
    <>
      {profile.role === "paciente" && <PatientDashboard />}
      {profile.role === "atendente" && <AttendantDashboard />}
      {profile.role === "gerente" && <ManagerDashboard />}
    </>
  );
};

export default Index;
