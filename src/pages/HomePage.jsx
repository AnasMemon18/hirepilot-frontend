import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Briefcase, Users, FileText, TrendingUp, Loader2 } from 'lucide-react';
import { getDashboardStats } from '../api/dashboardApi';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ✅ ONE SINGLE QUERY for everything!
  const { data, isLoading, error } = useQuery(
    'dashboardStats',
    getDashboardStats,
    {
      staleTime: 60000, // Cache for 1 minute
      refetchOnWindowFocus: false,
    }
  );

  const dashboardData = data?.data;
  const stats = dashboardData?.stats || {};
  const recentJobs = dashboardData?.recentJobs || [];
  const recentCandidates = dashboardData?.recentCandidates || [];

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

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        Failed to load dashboard. Please refresh the page.
      </div>
    );
  }

  // ✅ Stats array for display
  const statCards = [
    {
      icon: Briefcase,
      label: 'Total Jobs',
      value: stats.totalJobs || 0,
      color: 'bg-blue-500',
      subtext: stats.totalJobs > 0 ? `${stats.totalJobs} active job${stats.totalJobs > 1 ? 's' : ''}` : 'No jobs yet'
    },
    {
      icon: Users,
      label: 'Candidates',
      value: stats.totalCandidates || 0,
      color: 'bg-green-500',
      subtext: stats.totalCandidates > 0 ? `Across ${stats.totalJobs || 0} job${stats.totalJobs > 1 ? 's' : ''}` : 'No candidates yet'
    },
    {
      icon: FileText,
      label: 'Resumes',
      value: stats.totalResumes || 0,
      color: 'bg-purple-500',
      subtext: stats.totalResumes > 0 ? `${stats.totalResumes} PDF${stats.totalResumes > 1 ? 's' : ''} uploaded` : 'No resumes yet'
    },
    {
      icon: TrendingUp,
      label: 'Avg Match Rate',
      value: stats.avgMatchRate > 0 ? `${stats.avgMatchRate}%` : '—',
      color: 'bg-orange-500',
      subtext: stats.avgMatchRate > 0 ? `Based on ${stats.totalCandidates || 0} candidates` : 'No data yet'
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, <span className="font-semibold text-gray-800">{user?.firstName || 'User'}!</span>{' '}
          Here's what's happening with your jobs.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
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
            {stats.totalJobs > 0 && (
              <button
                onClick={() => navigate('/jobs')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View All →
              </button>
            )}
          </div>
          {recentJobs.length === 0 ? (
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
              {recentJobs.map((job) => (
                <div key={job._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => navigate(`/job/${job._id}`)}>
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
            {stats.totalCandidates > 0 && (
              <button
                onClick={() => navigate('/all-candidates')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View All →
              </button>
            )}
          </div>
          {recentCandidates.length === 0 ? (
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
              {recentCandidates.map((candidate) => (
                <div key={candidate._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => navigate(`/candidate/${candidate._id}`)}>
                  <div>
                    <p className="font-medium text-gray-900">{candidate.candidateName}</p>
                    <p className="text-xs text-gray-500">
                      {candidate.email || 'No email'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {candidate.matchScore && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        candidate.matchScore >= 80 ? 'bg-green-100 text-green-700' :
                        candidate.matchScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {candidate.matchScore}%
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      candidate.status === 'parsed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {candidate.status || 'uploaded'}
                    </span>
                  </div>
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
            onClick={() => navigate('/upload')}
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