import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import Loading from "./Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/panel/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, validateWithServer } = useAuth();
  const navigate = useNavigate();

  // Validar con servidor cuando se monta el componente
  useEffect(() => {
    validateWithServer();
  }, [validateWithServer]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, navigate]);

  if (isLoading) {
    return <Loading label="Verificando autenticación..." />;
  }

  if (!isAuthenticated) {
    return null; // Se redirigirá automáticamente
  }

  return <>{children}</>;
}
