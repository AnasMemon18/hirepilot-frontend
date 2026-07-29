import React, {useCallback} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getCandidateById, deleteCandidate } from '../api/resumeApi';
import { toast } from 'react-hot-toast';
import { Loader2, ArrowLeft, Download, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CandidateDetails from '../components/candidates/CandidateDetails';

const CandidateDetailsPage = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  const canDelete = isAdmin;

  // ✅ Optimized: Uses .select("-resumeText") to exclude heavy field
  const { data, isLoading, error } = useQuery(
    ['candidate', candidateId],
    () => getCandidateById(candidateId),
    {
      staleTime: 2 * 60 * 1000,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const candidate = data?.candidate;

  // Delete Mutation (Admin only)
  const deleteMutation = useMutation(deleteCandidate, {
    onSuccess: () => {
      toast.success('✅ Candidate deleted successfully!');
      queryClient.invalidateQueries(['candidates']);
      navigate(-1);
    },
    onError: (error) => {
      toast.error(`❌ ${error.response?.data?.error || 'Failed to delete candidate'}`);
    },
  });

  const handleDelete = useCallback(() => {
    if (window.confirm(`Are you sure you want to delete this candidate?`)) {
      deleteMutation.mutate(candidateId);
    }
  }, [candidateId, deleteMutation]);

  // View Resume
  const handleViewResume = useCallback(() => {
    if (candidate?.resumePath) {
      const fullPath = candidate.resumePath;
      const fileName = fullPath.split(/[\\/]/).pop();
      const resumeUrl = `http://localhost:5000/uploads/${fileName}`;
      window.open(resumeUrl, '_blank');
    } else {
      alert('No resume file found');
    }
  }, [candidate?.resumePath]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span>Loading candidate details...</span>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        Failed to load candidate details. Please try again.
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
              {candidate.candidateName || 'Unnamed Candidate'}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 truncate">
              {candidate.email || 'No email'} • {candidate.phone || 'No phone'}
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className={`px-2 py-1 text-xs sm:text-sm rounded-full whitespace-nowrap ${
            candidate.status === 'parsed' 
              ? 'bg-green-100 text-green-700' 
              : candidate.status === 'parsed_with_errors'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {candidate.status || 'uploaded'}
          </span>
          
          <button
            onClick={handleViewResume}
            className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span className="hidden xs:inline">View Resume</span>
            <span className="xs:hidden">Resume</span>
          </button>

          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isLoading}
              className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white text-sm sm:text-base rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
            >
              {deleteMutation.isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden xs:inline">Delete</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-hidden">
        <CandidateDetails candidate={candidate} />
      </div>
    </div>
  );
};

export default CandidateDetailsPage;