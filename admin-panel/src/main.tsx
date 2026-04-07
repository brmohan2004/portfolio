import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { ToastProvider } from '@/hooks/useToast';
import { Login } from '@/pages/Login';
import { DashboardLayout } from '@/pages/DashboardLayout';
import { DashboardHome } from '@/pages/dashboard/Home';
import { ProjectsList } from '@/pages/dashboard/projects/List';
import { ProjectForm } from '@/pages/dashboard/projects/Form';
import { SkillsManager } from '@/pages/dashboard/skills/Page';
import { ProfileManager } from '@/pages/dashboard/profile/Page';
import './index.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="projects" element={<ProjectsList />} />
              <Route path="projects/new" element={<ProjectForm />} />
              <Route path="projects/:id" element={<ProjectForm />} />
              <Route path="skills" element={<SkillsManager />} />
              <Route path="profile" element={<ProfileManager />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
