import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getJobById } from '../api/jobApi';
import { getCandidatesByJob } from '../api/resumeApi';
import { Loader2, ArrowLeft, Briefcase, MapPin, Clock, Calendar, Tag, Star, FileText, Users, Pencil, Trash2 } from 'lucide-react';
import JobDetails from '../components/jobs/JobDetails';

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  // Fetch job details
  const { data: jobData, isLoading: jobLoading, error: jobError } = useQuery(
    ['job', jobId],
    () => getJobById(jobId),
    { enabled: !!jobId }
  );

  // Fetch candidates count
  const { data: candidatesData, isLoading: candidatesLoading } = useQuery(
    ['candidates', jobId],
    () => getCandidatesByJob(jobId),
    { enabled: !!jobId }
  );

  const isLoading = jobLoading || candidatesLoading;
  const job = jobData?.job;
  const candidates = candidatesData?.candidates || [];
  const candidateCount = candidates.length;

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

  if (jobError || !job) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        Failed to load job details. Please try again.
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/jobs')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
              {job.jobTitle}
            </h1>
            <p className="text-gray-600 mt-1">
              {candidateCount} candidate{candidateCount !== 1 ? 's' : ''} for this position
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate(`/candidates/${jobId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Users className="w-4 h-4" />
            View Candidates
          </button>
          <button
            onClick={() => navigate(`/edit-job/${jobId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit Job
          </button>
        </div>
      </div>

      {/* Job Details Component */}
      <JobDetails job={job} candidateCount={candidateCount} />
    </div>
  );
};

export default JobDetailsPage;