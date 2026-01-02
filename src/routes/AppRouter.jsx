import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Reservas from "../pages/Reservas";
import ListaReservas from "../pages/ListaReservas";
import DashboardAdmin from "../pages/DashboardAdmin";
import AsignacionHabitaciones from "../pages/AsignacionHabitaciones";
import GestionHabitaciones from "../pages/GestionHabitaciones";
import GestionUsuarios from "../pages/GestionUsuarios";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleProtectedRoute from "../components/RoleProtectedRoute";
import RoleBasedHome from "../components/RoleBasedHome";

const AppRouter = () => {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Ruta raíz - redirige según rol */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RoleBasedHome />
          </ProtectedRoute>
        }
      />

      {/* Rutas para RECEPCIONISTA y ADMIN */}
      <Route
        path="/clientes/registro"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservas"
        element={
          <ProtectedRoute>
            <Reservas />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservas/lista"
        element={
          <ProtectedRoute>
            <ListaReservas />
          </ProtectedRoute>
        }
      />

      {/* Nueva ruta: Mapa de Habitaciones */}
      <Route
        path="/habitaciones/mapa"
        element={
          <ProtectedRoute>
            <AsignacionHabitaciones />
          </ProtectedRoute>
        }
      />

      {/* Rutas solo para ADMIN */}
      <Route
        path="/admin/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardAdmin />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/admin/habitaciones"
        element={
          <RoleProtectedRoute allowedRoles={["ADMIN"]}>
            <GestionHabitaciones />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/admin/usuarios"
        element={
          <RoleProtectedRoute allowedRoles={["ADMIN"]}>
            <GestionUsuarios />
          </RoleProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;
