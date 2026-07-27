import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
import AllCandidatesPage from './pages/AllCandidatesPage'; // ✅ NEW
import TopPerformersPage from './pages/TopPerformersPage'; // ✅ NEW

const queryClient = new QueryClient();

function App() {
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
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-gray-50">
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <Sidebar isOpen={sidebarOpen} />
          
          <main className={`
            transition-all duration-300 pt-16
            ${sidebarOpen ? 'lg:ml-64' : ''}
            px-4 sm:px-6 lg:px-8 py-8
          `}>
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create-job" element={<CreateJobPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/candidates/:jobId" element={<CandidatesPage />} />
                <Route path="/candidate/:candidateId" element={<CandidateDetailsPage />} />
                <Route path="/edit-job/:jobId" element={<EditJobPage />} />
                <Route path="/job/:jobId" element={<JobDetailsPage />} />
                <Route path="/all-candidates" element={<AllCandidatesPage />} /> {/* ✅ NEW */}
                <Route path="/top-performers" element={<TopPerformersPage />} /> {/* ✅ NEW */}
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;