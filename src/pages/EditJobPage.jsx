import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getJobById } from '../api/jobApi';
import { Loader2, ArrowLeft } from 'lucide-react';
import EditJob from '../components/jobs/EditJob';

const EditJobPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery(
    ['job', jobId],
    () => getJobById(jobId),
    { enabled: !!jobId }
  );

  const job = data?.job;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span>Loading job details...</span>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        Failed to load job details. Please try again.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/jobs')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
          <p className="text-gray-600 mt-1">Update job details and re-analyze candidates</p>
        </div>
      </div>

      <EditJob job={job} />
    </div>
  );
};

export default EditJobPage;