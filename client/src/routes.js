import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AuthPage } from "./pages/AuthPage";
import { EventList } from "./pages/EventList";
import { CreateEvent } from "./pages/CreateEvent";

import { UserProfile } from "./pages/UserProfile";
import { RulesPage } from "./pages/RulesPage";

export const useRoutes = (isAuthenticated) => {
  console.log(isAuthenticated);
  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/home" element={<HomePage />} />

        <Route path="/create" element={<CreateEvent />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/rules" element={<RulesPage />} />
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
