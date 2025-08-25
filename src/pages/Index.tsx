import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { PatientDashboard } from "@/components/dashboards/PatientDashboard";
import { AttendantDashboard } from "@/components/dashboards/AttendantDashboard";
import { ManagerDashboard } from "@/components/dashboards/ManagerDashboard";

const Index = () => {
  const [user, setUser] = useState<string | null>(null);

  const handleLogin = (userType: string) => {
    setUser(userType);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <>
      {user === "paciente" && <PatientDashboard onLogout={handleLogout} />}
      {user === "atendente" && <AttendantDashboard onLogout={handleLogout} />}
      {user === "gerente" && <ManagerDashboard onLogout={handleLogout} />}
    </>
  );
};

export default Index;
