import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AuthPage } from "./pages/AuthPage";

export const useRoutes = (isAuthenticated) => {
  //You can ADD new pages here, use same sctructure
  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/home" element={<HomePage />} />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
