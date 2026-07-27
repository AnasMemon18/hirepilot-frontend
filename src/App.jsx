import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import HomePage from './pages/HomePage';
import CreateJobPage from './pages/CreateJobPage';
import JobsPage from './pages/JobsPage';
import UploadPage from './pages/UploadPage';
import CandidatesPage from './pages/CandidatesPage';
import CandidateDetailsPage from './pages/CandidateDetailsPage';
import EditJobPage from './pages/EditJobPage';
import JobDetailsPage from './pages/JobDetailsPage';
import AllCandidatesPage from './pages/AllCandidatesPage';
import TopPerformersPage from './pages/TopPerformersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const queryClient = new QueryClient();

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

// ✅ App Content with Routes
const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* ✅ Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

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
      </Route>

      {/* ✅ Admin & HR Only Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'hr']} />}>
        <Route
          path="/create-job"
          element={
            <AppLayout>
              <CreateJobPage />
            </AppLayout>
          }
        />
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