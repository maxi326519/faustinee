import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "sonner";
import useLoading from "./hooks/useLoading";
import useAuth from "./hooks/useAuth";
import axios from "axios";
import AOS from "aos";

import Login from "./pages/Dashboard/login";
import UsersTable from "./pages/Dashboard/users";
import Home from "./pages/Home";
import NewByCategory from "./pages/NewByCategory";
import MakeupInterview from "./pages/Nota";
import PostTable from "./pages/Dashboard/posts";
import CoversTable from "./pages/Dashboard/covers";
import Loading from "./components/Loading";

import "react-quill/dist/quill.snow.css";
import "./App.css";

axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;

// Configurar interceptor para incluir automáticamente el token
axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = "/panel/login";
    }
    return Promise.reject(error);
  }
);

function App() {
  const loading = useLoading();
  const { checkLocalAuth } = useAuth();

  useEffect(() => {
    AOS.init({
      offset: 30,
    });
 
    // Verificar autenticación local al cargar la app
    checkLocalAuth();
  }, [checkLocalAuth]);

  return (
    <div className="w-screen h-screen">
      {loading.state && <Loading label={loading.message} />}
      {/* Toaster para notificaciones globales */}
      <Toaster richColors position="top-center" />
      <Routes>
        {/* NEWS */}
        <Route path="/" element={<Home />} />

        <Route path="/:id" element={<NewByCategory />} />

        <Route path="/editorial/:id" element={<MakeupInterview />} />
        <Route path="/moda/:id" element={<MakeupInterview />} />
        <Route path="/estilo/:id" element={<MakeupInterview />} />
        <Route path="/belleza/:id" element={<MakeupInterview />} />
        <Route path="/tendencias/:id" element={<MakeupInterview />} />
        <Route path="/hombres/:id" element={<MakeupInterview />} />
        <Route path="/estilo-de-vida/:id" element={<MakeupInterview />} />
        <Route path="/entrevistas/:id" element={<MakeupInterview />} />
        <Route path="/lo-ultimo/:id" element={<MakeupInterview />} />
        <Route path="/noticias/:id" element={<MakeupInterview />} />
        <Route path="/viajes/:id" element={<MakeupInterview />} />

        {/* DASHBOARD */}
        <Route path="/panel/login" element={<Login />} />
        <Route path="/panel/usuarios" element={<UsersTable />} />
        <Route path="/panel/publicaciones" element={<PostTable />} />
        <Route path="/panel/portadas" element={<CoversTable />} />
      </Routes>
    </div>
  );
}

export default App;
