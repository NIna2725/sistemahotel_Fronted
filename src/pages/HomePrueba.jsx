import React from "react";
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";

const HomePrueba = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Bienvenido al sistema 🏨</h1>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default HomePrueba;
