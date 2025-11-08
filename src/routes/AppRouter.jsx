import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import HomePrueba from "../pages/HomePrueba";

const AppRouter = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Login/>} /> */}
      <Route path="/" element={<HomePrueba />} />
    </Routes>
  );
};

export default AppRouter;
