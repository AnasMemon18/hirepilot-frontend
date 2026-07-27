import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getCandidateById } from '../api/resumeApi';
import { Loader2, ArrowLeft, Download, User, Mail, Phone, Briefcase, GraduationCap, Award, Code, Languages, Calendar, Building, FileText } from 'lucide-react';
import CandidateDetails from '../components/candidates/CandidateDetails';

const CandidateDetailsPage = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery(
    ['candidate', candidateId],
    () => getCandidateById(candidateId),
    { enabled: !!candidateId }
  );

  const candidate = data?.candidate;

  // View Resume - Open PDF in new tab
const handleViewResume = () => {
  if (candidate?.resumePath) {
    // Extract just the filename from the full path
    const fullPath = candidate.resumePath;
    const fileName = fullPath.split(/[\\/]/).pop(); // Works on Windows and Unix
    const resumeUrl = `http://localhost:5000/uploads/${fileName}`;
    window.open(resumeUrl, '_blank');
  } else {
    alert('No resume file found');
  }
};

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
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0"> {/* ✅ Prevents overflow */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
              {candidate.candidateName || 'Unnamed Candidate'}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 truncate">
              {candidate.email || 'No email'} • {candidate.phone || 'No phone'}
            </p>
          </div>
        </div>
        
        {/* Actions - Responsive wrap */}
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
        </div>
      </div>

      {/* Candidate Details Component - Responsive */}
      <div className="overflow-x-hidden">
        <CandidateDetails candidate={candidate} />
      </div>
    </div>
  );
};

export default CandidateDetailsPage;