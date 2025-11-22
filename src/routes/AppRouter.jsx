/*import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import HomePrueba from "../pages/HomePrueba";

//const AppRouter = () => {
  return (
    <Routes>
//      {/* <Route path="/" element={<Login/>} /> *///}
 //     <Route path="/" element={<HomePrueba />} />
//    </Routes>
// );
//};

//export default AppRouter;

import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import HomePrueba from "../pages/HomePrueba";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRouter = () => {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePrueba />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;
