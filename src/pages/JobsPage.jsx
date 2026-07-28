import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import JobList from '../components/jobs/JobList';

const JobsPage = () => {
  const navigate = useNavigate();
  const { isHR, isAdmin } = useAuth();
  const canCreateJob = isHR || isAdmin;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Jobs</h1>
          <p className="text-gray-600 mt-1">Manage your job postings and track applications</p>
        </div>
        
        {/* ✅ Hide from viewer */}
        {canCreateJob && (
          <button
            onClick={() => navigate('/create-job')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
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