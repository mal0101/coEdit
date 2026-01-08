/**
 * AppRoutes.jsx
 *
 * Description: Main application routing configuration using React Router.
 * Handles public and protected routes with lazy loading.
 *
 * Usage:
 *   <AppRoutes />
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../utils/constants";

// Pages
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import DocumentEditor from "../pages/DocumentEditor";
import Profile from "../pages/Profile";
import SharedDocs from "../pages/SharedDocs";
import NotFound from "../pages/NotFound";

// Components
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Navbar from "../components/layout/Navbar";

/**
 * Layout wrapper for pages with navbar
 */
function LayoutWithNavbar({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

/**
 * Public route wrapper - redirects to dashboard if authenticated
 */
function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
}

/**
 * Main application routes configuration
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path={ROUTES.HOME}
        element={
          <PublicOnlyRoute>
            <Landing />
          </PublicOnlyRoute>
        }
      />
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path={ROUTES.REGISTER}
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      {/* Protected routes with navbar */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <LayoutWithNavbar>
              <Dashboard />
            </LayoutWithNavbar>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.PROFILE}
        element={
          <ProtectedRoute>
            <LayoutWithNavbar>
              <Profile />
            </LayoutWithNavbar>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.SHARED}
        element={
          <ProtectedRoute>
            <LayoutWithNavbar>
              <SharedDocs />
            </LayoutWithNavbar>
          </ProtectedRoute>
        }
      />

      {/* Document editor - full screen without navbar */}
      <Route
        path={`${ROUTES.DOCUMENT}/:id`}
        element={
          <ProtectedRoute>
            <DocumentEditor />
          </ProtectedRoute>
        }
      />

      {/* Catch all - 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
