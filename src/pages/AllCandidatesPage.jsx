import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getAllCandidatesOptimized } from '../api/resumeApi';
import { Loader2, Users, Briefcase, TrendingUp, Filter } from 'lucide-react';
import CandidateCard from '../components/candidates/CandidateCard';

const AllCandidatesPage = () => {
  const navigate = useNavigate();

  // ✅ OPTIMIZED: Single query for all candidates
  const { data, isLoading, error } = useQuery(
    'allCandidatesOptimized',
    getAllCandidatesOptimized,
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const candidates = data?.candidates || [];

  // ✅ useMemo for sorting (only runs when candidates change)
  const sortedCandidates = useMemo(() => {
    return [...candidates].sort((a, b) => {
      const scoreA = a.matchResult?.overallScore || -1;
      const scoreB = b.matchResult?.overallScore || -1;
      return scoreB - scoreA;
    });
  }, [candidates]);

  // ✅ useMemo for stats (only runs when sortedCandidates changes)
  const { scoredCount, avgScore } = useMemo(() => {
    const scored = sortedCandidates.filter(c => c.matchResult);
    const avg = scored.length > 0 
      ? Math.round(scored.reduce((sum, c) => sum + (c.matchResult?.overallScore || 0), 0) / scored.length)
      : 0;
    return { scoredCount: scored.length, avgScore: avg };
  }, [sortedCandidates]);

  // Count unique jobs
  const uniqueJobs = useMemo(() => {
    const jobIds = new Set(candidates.map(c => c.jobId?.toString()));
    return jobIds.size;
  }, [candidates]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span>Loading candidates...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        Failed to load candidates. Please refresh the page.
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          All Candidates
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          View all candidates across all job postings
        </p>
      </div>

      {/* Stats - Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{candidates.length}</p>
              <p className="text-[10px] sm:text-sm text-gray-600">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{scoredCount}</p>
              <p className="text-[10px] sm:text-sm text-gray-600">Scored</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-purple-50 rounded-lg">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {uniqueJobs > 0 ? uniqueJobs : '—'}
              </p>
              <p className="text-[10px] sm:text-sm text-gray-600">Jobs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-orange-50 rounded-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{scoredCount > 0 ? `${avgScore}%` : '—'}</p>
              <p className="text-[10px] sm:text-sm text-gray-600">Average</p>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      {candidates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
          <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No candidates found</h3>
          <p className="text-gray-500 mt-2">Upload resumes to see candidates here.</p>
          <button
            onClick={() => navigate('/upload')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Resumes →
          </button>
        </div>
      ) : (
        <>
          {/* Filter Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2.5 sm:p-3 mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
            <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
            <span className="text-xs sm:text-sm text-gray-600">
              Showing {candidates.length} candidates from {uniqueJobs} job{uniqueJobs > 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {sortedCandidates.map((candidate, index) => {
              const rank = candidate.matchResult ? index + 1 : null;
              return (
                <div key={candidate._id} className="relative">
                  <CandidateCard
                    candidate={candidate}
                    rank={rank}
                    onClick={() => navigate(`/candidate/${candidate._id}`)}
                  />
                  {/* Job Title Badge */}
                  {/* {candidate.jobTitle && (
                    <div className="absolute top-2 right-2 bg-gray-100 text-gray-600 text-[8px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full truncate max-w-[80px] sm:max-w-[100px]">
                      {candidate.jobTitle}
                    </div>
                  )} */}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default AllCandidatesPage;