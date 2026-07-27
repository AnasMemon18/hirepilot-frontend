import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getAllJobs } from '../api/jobApi';
import { getCandidatesByJob } from '../api/resumeApi';
import { Loader2, Trophy, Users, TrendingUp, Award, Crown, Sparkles } from 'lucide-react';
import CandidateCard from '../components/candidates/CandidateCard';

const TopPerformersPage = () => {
  const navigate = useNavigate();

  // Fetch all jobs
  const { data: jobsData, isLoading: jobsLoading } = useQuery('jobs', getAllJobs);
  const jobs = jobsData?.jobs || [];

  // Fetch all candidates for each job
  const { data: allCandidates, isLoading: candidatesLoading } = useQuery(
    ['allCandidates', jobs.map(j => j._id).join(',')],
    async () => {
      const allResults = [];
      for (const job of jobs) {
        try {
          const response = await getCandidatesByJob(job._id);
          if (response.success) {
            const candidatesWithJob = response.candidates.map(c => ({
              ...c,
              jobTitle: job.jobTitle,
              jobId: job._id
            }));
            allResults.push(...candidatesWithJob);
          }
        } catch (error) {
          console.error(`Failed to fetch candidates for job ${job._id}:`, error);
        }
      }
      return allResults;
    },
    { enabled: jobs.length > 0 }
  );

  const isLoading = jobsLoading || candidatesLoading;
  const candidates = allCandidates || [];

  // ✅ Filter only top performers 60%+)
  const topPerformers = candidates
    .filter(c => c.matchResult && c.matchResult.overallScore >= 60)
    .sort((a, b) => (b.matchResult?.overallScore || 0) - (a.matchResult?.overallScore || 0));

  // Stats
  const totalTopPerformers = topPerformers.length;
  const avgTopScore = totalTopPerformers > 0 
    ? Math.round(topPerformers.reduce((sum, c) => sum + (c.matchResult?.overallScore || 0), 0) / totalTopPerformers)
    : 0;
  const highestScore = totalTopPerformers > 0 ? topPerformers[0].matchResult?.overallScore || 0 : 0;

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

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Top Performers
        </h1>
        <p className="text-gray-600 mt-1">
          Candidates with 60%+ match score across all jobs
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl shadow-sm border border-yellow-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-200 rounded-lg">
              <Crown className="w-5 h-5 text-yellow-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalTopPerformers}</p>
              <p className="text-sm text-gray-600">Top Performers</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-200 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalTopPerformers > 0 ? `${avgTopScore}%` : '—'}</p>
              <p className="text-sm text-gray-600">Average Score</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-200 rounded-lg">
              <Award className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalTopPerformers > 0 ? `${highestScore}%` : '—'}</p>
              <p className="text-sm text-gray-600">Highest Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers Grid */}
      {totalTopPerformers === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No top performers yet</h3>
          <p className="text-gray-500 mt-2">
            Candidates need a match score of 80% or higher to appear here.
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
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-gray-700">
              🎉 Found <strong>{totalTopPerformers}</strong> top performer{totalTopPerformers > 1 ? 's' : ''} across all jobs
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {topPerformers.map((candidate, index) => {
              const rank = index + 1;
              return (
                <div key={candidate._id} className="relative">
                  <CandidateCard
                    candidate={candidate}
                    rank={rank}
                    onClick={() => navigate(`/candidate/${candidate._id}`)}
                  />
                  {/* Job Title Badge */}
                  <div className="absolute top-2 right-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    {candidate.jobTitle || 'Unknown Job'}
                  </div>
                  {/* Score Badge */}
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    ★ {candidate.matchResult?.overallScore}%
                  </div>
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