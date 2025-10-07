import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import useSesionStore from "@/stores/sesionStore";
import useLoading from "./useLoading";
import axios from "axios";

// Variable global para evitar múltiples validaciones simultáneas
let isValidating = false;

export default function useAuth() {
  const navigate = useNavigate();
  const loading = useLoading();
  const sesion = useSesionStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is authenticated
  useEffect(() => {
    checkLocalAuth();
  }, []);

  const checkLocalAuth = useCallback(() => {
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("user");

    if (token && user) {
      setIsAuthenticated(true);
      sesion.set(JSON.parse(user));
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  // Validar con servidor (para rutas protegidas)
  const validateWithServer = useCallback(async () => {
    if (isValidating) return;

    try {
      isValidating = true;
      setIsLoading(true);

      const token = sessionStorage.getItem("token");
      const storedUser = sessionStorage.getItem("user");

      if (!token || !storedUser) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Validar token con el servidor
      try {
        const userData = JSON.parse(storedUser);
        const response = await axios.post("/login/token", {
          user: { userId: userData.id },
        });

        if (response.data) {
          const user = response.data;
          sesion.set(user);
          sessionStorage.setItem("user", JSON.stringify(user));
          setIsAuthenticated(true);
        } else {
          throw new Error("Respuesta vacía del servidor");
        }
      } catch (error) {
        console.error("Error validando token:", error);
        // Token inválido, limpiar sesión
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sesion.clear();
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error en validación:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
      isValidating = false;
    }
  }, []);

  async function login(email: string, password: string) {
    if (!email || !password) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    try {
      loading.open();
      const response = await axios.post("/login", { email, password });
      if (!response) throw new Error("Error desconocido al loguearse");

      const user = response.data.usuario;
      const token = response.data.token;

      if (!user) throw new Error("user not provided");
      if (!token) throw new Error("token not provided");

      // Guardar en sessionStorage
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      // Actualizar estado
      sesion.set(user);
      setIsAuthenticated(true);

      toast.success("Inicio de sesión exitoso");
      navigate("/panel/usuarios");
      loading.close();
    } catch (error) {
      loading.close();
      console.error("Error:", error);
      toast.error("Error al iniciar sesión. Verifica tus credenciales.");
    }
  }

  function logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sesion.clear();
    setIsAuthenticated(false);
    toast.success("Sesión cerrada correctamente");
    navigate("/panel/login");
  }

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkLocalAuth,
    validateWithServer, // Para usar en ProtectedRoute
  };
}
