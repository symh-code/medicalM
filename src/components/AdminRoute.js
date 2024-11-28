import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación

const AdminRoute = () => {
  const { user, isAdmin, loading } = useAuth(); // Obtén el usuario y su rol de admin

  if (loading) {
    return <div>Cargando...</div>; // Espera mientras se verifica el estado
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" />; // Redirige a la página principal si no es admin
  }

  return <Outlet />; // Si es admin, permite el acceso a las rutas hijas
};

export default AdminRoute;
