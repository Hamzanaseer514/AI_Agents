import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Check if company user is authenticated and has project manager or company_user role
 */
const isCompanyUserAuthenticated = () => {
  try {
    const companyUserStr = localStorage.getItem('company_user');
    if (!companyUserStr) return false;
    const companyUser = JSON.parse(companyUserStr);
    return companyUser && (companyUser.role === 'project_manager' || companyUser.role === 'company_user');
  } catch {
    return false;
  }
};

/**
 * Protected Route Component
 * Redirects to login if not authenticated
 * Checks for admin or project manager role if required
 * Also allows company users to access routes
 */
const ProtectedRoute = ({ children, requireAdmin = false, requireProjectManager = false }) => {
  const { isAuthenticated, loading, user, isAdmin, isProjectManager } = useAuth();
  const location = useLocation();
  
  // Check if user is authenticated (either regular user or company user)
  const companyUserAuth = isCompanyUserAuthenticated();
  const userIsAuthenticated = isAuthenticated || companyUserAuth;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userIsAuthenticated) {
    // Redirect to login page with return path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin()) {
    // User is authenticated but not an admin
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page. Admin access required.
          </p>
        </div>
      </div>
    );
  }

  if (requireProjectManager) {
    // Check if user is a project manager (regular user or company user)
    // companyUserAuth already checks if role === 'project_manager'
    const isPM = isProjectManager() || companyUserAuth;
    if (!isPM) {
      // User is authenticated but not a project manager
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this page. Project Manager access required.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Please log in with a company account that has project manager role.
            </p>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;

