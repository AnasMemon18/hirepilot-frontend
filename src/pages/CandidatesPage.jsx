import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getCandidatesByJob } from '../api/resumeApi';
import { getJobById } from '../api/jobApi';
import { matchAllCandidates } from '../api/resumeApi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { 
  Loader2, ArrowLeft, User, Briefcase, 
  GraduationCap, FileText, Zap, TrendingUp, Users,
  CheckCircle, XCircle, Award, Trophy, Crown  
} from 'lucide-react';
import CandidateCard from '../components/candidates/CandidateCard';

const CandidatesPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isMatchingAll, setIsMatchingAll] = useState(false);
  const { isHR, isAdmin } = useAuth();
const canMatch = isHR || isAdmin;

  // Fetch job details
  const { data: jobData, isLoading: jobLoading } = useQuery(
    ['job', jobId],
    () => getJobById(jobId),
    { enabled: !!jobId }
  );

  // Fetch candidates for this job
  const { data: candidatesData, isLoading: candidatesLoading, refetch } = useQuery(
    ['candidates', jobId],
    () => getCandidatesByJob(jobId),
    { enabled: !!jobId }
  );

  // Mutation for matching all candidates
  const matchAllMutation = useMutation(matchAllCandidates, {
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`✅ ${data.message || 'All candidates matched successfully!'}`);
        refetch();
        queryClient.invalidateQueries(['candidates', jobId]);
      } else {
        toast.error('Failed to match all candidates');
      }
      setIsMatchingAll(false);
    },
    onError: (error) => {
      toast.error(`❌ ${error.response?.data?.error || 'Failed to match candidates'}`);
      setIsMatchingAll(false);
    },
  });

  const isLoading = jobLoading || candidatesLoading;
  const job = jobData?.job;
  const candidates = candidatesData?.candidates || [];

  const sortedCandidates = [...candidates].sort((a, b) => {
  const scoreA = a.matchResult?.overallScore || -1;
  const scoreB = b.matchResult?.overallScore || -1;
  return scoreB - scoreA;
});
  // Count candidates with match scores
  const matchedCandidates = candidates.filter(c => c.matchResult);
  const matchedCount = matchedCandidates.length;
  const avgScore = matchedCount > 0 
    ? Math.round(matchedCandidates.reduce((sum, c) => sum + (c.matchResult?.overallScore || 0), 0) / matchedCount)
    : 0;

  // Get top score for ranking display
  const topScore = matchedCount > 0 
    ? Math.max(...matchedCandidates.map(c => c.matchResult?.overallScore || 0))
    : 0;

  const handleMatchAll = () => {
    if (candidates.length === 0) {
      toast.error('No candidates to match');
      return;
    }
    setIsMatchingAll(true);
    matchAllMutation.mutate(jobId);
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/jobs')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
              {job?.jobTitle || 'Candidates'}
            </h1>
            <p className="text-gray-600 mt-1">
              {candidates.length} candidate{candidates.length !== 1 ? 's' : ''} for this position
            </p>
          </div>
        </div>
   {/* ✅ Match All button - Hide from viewer */}
{canMatch && (
  <button
    onClick={handleMatchAll}
    disabled={isMatchingAll || candidates.length === 0}
    className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
  >
    {isMatchingAll ? (
      <>
        <Loader2 className="w-4 h-4 animate-spin" />
        Matching...
      </>
    ) : (
      <>
        <Zap className="w-4 h-4" />
        {matchedCount > 0 ? 'Re-Match All' : `Match All (${candidates.length})`}
      </>
    )}
  </button>
)}
      </div>

      {/* Stats - Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{candidates.length}</p>
              <p className="text-xs sm:text-sm text-gray-600">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{matchedCount}</p>
              <p className="text-xs sm:text-sm text-gray-600">Matched</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{matchedCount > 0 ? `${avgScore}%` : '—'}</p>
              <p className="text-xs sm:text-sm text-gray-600">Avg Score</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-yellow-50 rounded-lg">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{matchedCount > 0 ? `${topScore}%` : '—'}</p>
              <p className="text-xs sm:text-sm text-gray-600">Top Score</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-orange-50 rounded-lg">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {candidates.filter(c => c.education?.length > 0).length}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">With Edu</p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Ranking Info Banner */}
      {matchedCount > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-6">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <span className="text-sm sm:text-base text-gray-700">
              <span className="font-semibold">{matchedCount}</span> candidates ranked by match score
            </span>
            <span className="hidden sm:inline text-gray-400">|</span>
            <span className="text-xs sm:text-sm text-gray-500">
              🥇 Top score: <span className="font-semibold text-blue-600">{topScore}%</span>
            </span>
          </div>
        </div>
      )}

      {/* Candidates Grid */}
      {candidates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No candidates yet</h3>
          <p className="text-gray-500 mt-2">Upload resumes to see candidates here.</p>
          <button
            onClick={() => navigate('/upload')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Resumes →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {candidates.map((candidate, index) => {
            // ✅ Calculate rank based on match result
            const hasMatch = candidate.matchResult !== null;
            const rank = hasMatch ? index + 1 : null;
            
            return (
              <CandidateCard
                key={candidate._id}
                candidate={candidate}
                rank={rank}
                onClick={() => navigate(`/candidate/${candidate._id}`)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CandidatesPage;