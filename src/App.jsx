import React, { useState, useEffect, lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

// ✅ Lazy Loading for all pages
const HomePage = lazy(() => import('./pages/HomePage'));
const CreateJobPage = lazy(() => import('./pages/CreateJobPage'));
const JobsPage = lazy(() => import('./pages/JobsPage'));
const UploadPage = lazy(() => import('./pages/UploadPage'));
const CandidatesPage = lazy(() => import('./pages/CandidatesPage'));
const CandidateDetailsPage = lazy(() => import('./pages/CandidateDetailsPage'));
const EditJobPage = lazy(() => import('./pages/EditJobPage'));
const JobDetailsPage = lazy(() => import('./pages/JobDetailsPage'));
const AllCandidatesPage = lazy(() => import('./pages/AllCandidatesPage'));
const TopPerformersPage = lazy(() => import('./pages/TopPerformersPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// ✅ Global Caching Configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 minutes - data considered fresh
      cacheTime: 10 * 60 * 1000,  // 10 minutes - data stays in cache
      refetchOnWindowFocus: false, // No refetch on tab switch
      refetchOnReconnect: false,   // No refetch on network reconnect
      retry: 1,                    // Only retry once on failure
    },
  },
});

// ✅ Layout component with Navbar + Sidebar
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar isOpen={sidebarOpen} />
      
      <main className={`
        transition-all duration-300 pt-16
        ${sidebarOpen ? 'lg:ml-64' : ''}
        px-4 sm:px-6 lg:px-8 py-8
      `}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

// ✅ Loading Spinner Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-gray-600">Loading...</span>
    </div>
  </div>
);

// ✅ App Content with Routes
const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* ✅ Protected Routes (All Authenticated Users) */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <AppLayout>
                <HomePage />
              </AppLayout>
            }
          />
          <Route
            path="/jobs"
            element={
              <AppLayout>
                <JobsPage />
              </AppLayout>
            }
          />
          <Route
            path="/upload"
            element={
              <AppLayout>
                <UploadPage />
              </AppLayout>
            }
          />
          <Route
            path="/create-job"
            element={
              <AppLayout>
                <CreateJobPage />
              </AppLayout>
            }
          />
          <Route
            path="/candidates/:jobId"
            element={
              <AppLayout>
                <CandidatesPage />
              </AppLayout>
            }
          />
          <Route
            path="/candidate/:candidateId"
            element={
              <AppLayout>
                <CandidateDetailsPage />
              </AppLayout>
            }
          />
          <Route
            path="/job/:jobId"
            element={
              <AppLayout>
                <JobDetailsPage />
              </AppLayout>
            }
          />
          <Route
            path="/all-candidates"
            element={
              <AppLayout>
                <AllCandidatesPage />
              </AppLayout>
            }
          />
          <Route
            path="/top-performers"
            element={
              <AppLayout>
                <TopPerformersPage />
              </AppLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            }
          />
        </Route>

        {/* ✅ Admin & HR Only Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'hr']} />}>
          <Route
            path="/edit-job/:jobId"
            element={
              <AppLayout>
                <EditJobPage />
              </AppLayout>
            }
          />
        </Route>

        {/* ✅ Admin Only Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          {/* Add admin routes here later */}
        </Route>

        {/* ✅ Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

// ✅ Main App
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Toaster position="top-right" />
          <AppContent />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;