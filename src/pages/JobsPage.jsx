import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from 'react-query';
import { getAllJobs } from '../api/jobApi';
import { Loader2 } from 'lucide-react';
import JobList from '../components/jobs/JobList';

const JobsPage = () => {
  const navigate = useNavigate();
  const { isHR, isAdmin } = useAuth();
  const canCreateJob = isHR || isAdmin;

  // ✅ Optimized: Uses .select() to fetch only needed fields
  const { data, isLoading, error } = useQuery(
  'jobs',
  getAllJobs,
  {
    staleTime: 5 * 60 * 1000,   // 5 minutes
    cacheTime: 10 * 60 * 1000,  // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  }
);

  const jobs = data?.jobs || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span>Loading jobs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        Failed to load jobs. Please refresh the page.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Jobs</h1>
          <p className="text-gray-600 mt-1">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        {canCreateJob && (
          <button
            onClick={() => navigate('/create-job')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <span>+</span> Create New Job
          </button>
        )}
      </div>
      
      <JobList />
    </div>
  );
};

export default JobsPage;