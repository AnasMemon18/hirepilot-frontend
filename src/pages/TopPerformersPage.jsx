import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getTopPerformersOptimized } from '../api/resumeApi';
import { Loader2, Trophy, Users, TrendingUp, Award, Crown, Sparkles } from 'lucide-react';
import CandidateCard from '../components/candidates/CandidateCard';

const TopPerformersPage = () => {
  const navigate = useNavigate();

  // ✅ OPTIMIZED: Single query for top performers
  const { data, isLoading, error } = useQuery(
    'topPerformersOptimized',
    () => getTopPerformersOptimized(60), // 60%+ threshold
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const candidates = data?.candidates || [];

  // ✅ useMemo for stats (only runs when candidates change)
  const { totalTopPerformers, avgTopScore, highestScore } = useMemo(() => {
    const total = candidates.length;
    const avg = total > 0 
      ? Math.round(candidates.reduce((sum, c) => sum + (c.matchResult?.overallScore || 0), 0) / total)
      : 0;
    const highest = total > 0 ? candidates[0]?.matchResult?.overallScore || 0 : 0;
    return { 
      totalTopPerformers: total, 
      avgTopScore: avg, 
      highestScore: highest 
    };
  }, [candidates]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span>Loading top performers...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        Failed to load top performers. Please refresh the page.
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
          Top Performers
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Candidates with 60%+ match score across all jobs
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl shadow-sm border border-yellow-200 p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-yellow-200 rounded-lg">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-700" />
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{totalTopPerformers}</p>
              <p className="text-[10px] sm:text-sm text-gray-600">Top Performers</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-200 rounded-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{totalTopPerformers > 0 ? `${avgTopScore}%` : '—'}</p>
              <p className="text-[10px] sm:text-sm text-gray-600">Average Score</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-purple-200 rounded-lg">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-700" />
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{totalTopPerformers > 0 ? `${highestScore}%` : '—'}</p>
              <p className="text-[10px] sm:text-sm text-gray-600">Highest Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers Grid */}
      {totalTopPerformers === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
          <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No top performers yet</h3>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Candidates need a match score of 60% or higher to appear here.
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Resumes
          </button>
        </div>
      ) : (
        <>
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-2.5 sm:p-3 mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            <span className="text-xs sm:text-sm text-gray-700">
              🎉 Found <strong>{totalTopPerformers}</strong> top performer{totalTopPerformers > 1 ? 's' : ''} across all jobs
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {candidates.map((candidate, index) => {
              const rank = index + 1;
              return (
                <div key={candidate._id} className="relative">
                  <CandidateCard
                    candidate={candidate}
                    rank={rank}
                    onClick={() => navigate(`/candidate/${candidate._id}`)}
                  />
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

export default TopPerformersPage;