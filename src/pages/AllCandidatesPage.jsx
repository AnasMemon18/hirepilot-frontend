import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getAllJobs } from '../api/jobApi';
import { getCandidatesByJob } from '../api/resumeApi';
import {
  Loader2,
  Users,
  Briefcase,
  TrendingUp,
  Filter,
} from 'lucide-react';
import CandidateCard from '../components/candidates/CandidateCard';

const AllCandidatesPage = () => {
  const navigate = useNavigate();

  // Fetch all jobs
  const { data: jobsData, isLoading: jobsLoading } = useQuery(
    'jobs',
    getAllJobs
  );

  const jobs = jobsData?.jobs || [];

  // Fetch all candidates
  const { data: allCandidates, isLoading: candidatesLoading } = useQuery(
    ['allCandidates', jobs.map((j) => j._id).join(',')],
    async () => {
      const allResults = [];

      for (const job of jobs) {
        try {
          const response = await getCandidatesByJob(job._id);

          if (response.success) {
            const candidatesWithJob = response.candidates.map((c) => ({
              ...c,
              jobTitle: job.jobTitle,
              jobId: job._id,
            }));

            allResults.push(...candidatesWithJob);
          }
        } catch (error) {
          console.error(
            `Failed to fetch candidates for job ${job._id}:`,
            error
          );
        }
      }

      return allResults;
    },
    {
      enabled: jobs.length > 0,
    }
  );

  const isLoading = jobsLoading || candidatesLoading;

  const candidates = allCandidates || [];

  // Sort candidates by score
  const sortedCandidates = [...candidates].sort((a, b) => {
    const scoreA = a.matchResult?.overallScore || -1;
    const scoreB = b.matchResult?.overallScore || -1;
    return scoreB - scoreA;
  });

  const scoredCount = sortedCandidates.filter(
    (c) => c.matchResult
  ).length;

  const avgScore =
    scoredCount > 0
      ? Math.round(
          sortedCandidates.reduce(
            (sum, c) => sum + (c.matchResult?.overallScore || 0),
            0
          ) / scoredCount
        )
      : 0;

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

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          All Candidates
        </h1>

        <p className="text-gray-600 mt-1">
          View all candidates across all job postings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900">
                {candidates.length}
              </p>

              <p className="text-sm text-gray-600">
                Total Candidates
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900">
                {scoredCount}
              </p>

              <p className="text-sm text-gray-600">
                Scored
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900">
                {scoredCount > 0 ? `${avgScore}%` : '—'}
              </p>

              <p className="text-sm text-gray-600">
                Average Score
              </p>
            </div>
          </div>
        </div>
      </div>

      {candidates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />

          <h3 className="text-lg font-semibold text-gray-900">
            No candidates found
          </h3>

          <p className="text-gray-500 mt-2">
            Upload resumes to see candidates here.
          </p>

          <button
            onClick={() => navigate('/upload')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Resumes →
          </button>
        </div>
      ) : (
        <>
          {/* Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-4 flex items-center gap-3">
            <Filter className="w-4 h-4 text-gray-400" />

            <span className="text-sm text-gray-600">
              Showing all {candidates.length} candidates from{' '}
              {jobs.length} job{jobs.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedCandidates.map((candidate, index) => {
              const rank = candidate.matchResult ? index + 1 : null;

              return (
                <CandidateCard
                  key={candidate._id}
                  candidate={candidate}
                  rank={rank}
                  onClick={() =>
                    navigate(`/candidate/${candidate._id}`)
                  }
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default AllCandidatesPage;