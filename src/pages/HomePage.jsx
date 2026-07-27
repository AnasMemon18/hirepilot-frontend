import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Briefcase, Users, FileText, TrendingUp, Loader2 } from 'lucide-react';
import { getAllJobs } from '../api/jobApi';
import { getCandidatesByJob } from '../api/resumeApi';

const HomePage = () => {
  const navigate = useNavigate();

  // Fetch all jobs
  const { data: jobsData, isLoading: jobsLoading } = useQuery('jobs', getAllJobs);
  const jobs = jobsData?.jobs || [];

  // Fetch all candidates (we'll combine across jobs)
  // Note: This is simplified - in production you'd have a dedicated endpoint
  const { data: candidatesData, isLoading: candidatesLoading } = useQuery(
    'allCandidates',
    async () => {
      // Fetch candidates for each job and combine
      const allCandidates = [];
      for (const job of jobs) {
        try {
          const response = await getCandidatesByJob(job._id);
          if (response.success) {
            allCandidates.push(...response.candidates);
          }
        } catch (error) {
          console.error(`Failed to fetch candidates for job ${job._id}:`, error);
        }
      }
      return allCandidates;
    },
    {
      enabled: jobs.length > 0, // Only run when jobs are loaded
    }
  );

  const candidates = candidatesData || [];
  const isLoading = jobsLoading || candidatesLoading;

  // Calculate real stats
  const totalJobs = jobs.length;
  const totalCandidates = candidates.length;
  const totalResumes = candidates.filter(c => c.resumeFileName).length;

  // Calculate average match score (if available in future)
  const avgMatchRate = candidates.length > 0
    ? Math.round(candidates.reduce((sum, c) => sum + (c.matchResult?.overallScore || 0), 0) / candidates.length)
    : 0;

  // Find latest activity
  const latestJob = jobs.length > 0 ? jobs[0] : null;
  const latestCandidate = candidates.length > 0 ? candidates[0] : null;

  const stats = [
    { 
      icon: Briefcase, 
      label: 'Total Jobs', 
      value: totalJobs, 
      color: 'bg-blue-500',
      subtext: totalJobs > 0 ? `${totalJobs} active job${totalJobs > 1 ? 's' : ''}` : 'No jobs yet'
    },
    { 
      icon: Users, 
      label: 'Candidates', 
      value: totalCandidates, 
      color: 'bg-green-500',
      subtext: totalCandidates > 0 ? `Across ${totalJobs} job${totalJobs > 1 ? 's' : ''}` : 'No candidates yet'
    },
    { 
      icon: FileText, 
      label: 'Resumes', 
      value: totalResumes, 
      color: 'bg-purple-500',
      subtext: totalResumes > 0 ? `${totalResumes} PDF${totalResumes > 1 ? 's' : ''} uploaded` : 'No resumes yet'
    },
    { 
      icon: TrendingUp, 
      label: 'Avg Match Rate', 
      value: totalCandidates > 0 ? `${avgMatchRate}%` : '—', 
      color: 'bg-orange-500',
      subtext: totalCandidates > 0 ? `Based on ${totalCandidates} candidates` : 'No data yet'
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! {totalJobs > 0 ? `You have ${totalJobs} active job${totalJobs > 1 ? 's' : ''} with ${totalCandidates} candidate${totalCandidates > 1 ? 's' : ''}.` : 'Start by creating your first job!'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.subtext}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Jobs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Jobs</h3>
            {totalJobs > 0 && (
              <button
                onClick={() => navigate('/jobs')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View All →
              </button>
            )}
          </div>
          {totalJobs === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No jobs created yet</p>
              <button
                onClick={() => navigate('/create-job')}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700"
              >
                Create your first job →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 3).map((job) => (
                <div key={job._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{job.jobTitle}</p>
                    <p className="text-xs text-gray-500">
                      {job.location || 'Remote'} • {job.employmentType || 'Full-time'}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                    Active
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Candidates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Candidates</h3>
            {totalCandidates > 0 && (
              <button
                onClick={() => navigate('/upload')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View All →
              </button>
            )}
          </div>
          {totalCandidates === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No candidates yet</p>
              <button
                onClick={() => navigate('/upload')}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700"
              >
                Upload your first resume →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {candidates.slice(0, 3).map((candidate) => (
                <div key={candidate._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">
                      {candidate.candidateName || 'Unnamed Candidate'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {candidate.email || 'No email'} • {candidate.resumeFileName || 'No resume'}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                    {candidate.status || 'uploaded'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold">Create New Job</h3>
          <p className="text-blue-100 mt-1">Post a new job and let AI find the best candidates</p>
          <button
            onClick={() => navigate('/create-job')}
            className="mt-4 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Create Job →
          </button>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold">Upload Resumes</h3>
          <p className="text-purple-100 mt-1">Upload and let AI parse resumes automatically</p>
          <button
            onClick={() => navigate('/upload')} // ✅ Changed to navigate
            className="mt-4 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Upload Resumes →
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;