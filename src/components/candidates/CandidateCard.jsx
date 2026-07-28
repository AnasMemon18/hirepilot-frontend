import React from 'react';
import { User, Mail, Briefcase, GraduationCap, FileText, TrendingUp, Crown, Trophy, Award } from 'lucide-react';

const CandidateCard = ({ candidate, onClick, rank }) => {
  const topSkills = candidate.skills?.slice(0, 3) || [];
  const hasMoreSkills = (candidate.skills?.length || 0) > 3;

  const matchScore = candidate.matchResult?.overallScore || null;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getRankBadge = (rank) => {
    if (!rank) return null;
    
    const rankStyles = {
      1: {
        bg: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
        text: 'text-white',
        icon: Crown,
        label: '🏆 #1'
      },
      2: {
        bg: 'bg-gradient-to-r from-gray-300 to-gray-400',
        text: 'text-white',
        icon: Trophy,
        label: '🥈 #2'
      },
      3: {
        bg: 'bg-gradient-to-r from-amber-600 to-amber-700',
        text: 'text-white',
        icon: Award,
        label: '🥉 #3'
      }
    };

    if (rank > 3) {
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        icon: null,
        label: `#${rank}`
      };
    }

    return rankStyles[rank] || {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      icon: null,
      label: `#${rank}`
    };
  };

  const rankStyle = rank ? getRankBadge(rank) : null;

  const uploadedDate = candidate.createdAt 
    ? new Date(candidate.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer relative group"
    >
      {/* ✅ Rank Badge - Top Left (Responsive) */}
      {rankStyle && (
        <div className={`absolute -top-2 -left-2 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold ${rankStyle.bg} ${rankStyle.text} shadow-md z-10`}>
          {rankStyle.icon ? (
            <div className="flex items-center gap-0.5 sm:gap-1">
              <rankStyle.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>{rankStyle.label}</span>
            </div>
          ) : (
            rankStyle.label
          )}
        </div>
      )}

      {/* ✅ Match Score Badge - Top Right (Responsive) */}
      {matchScore !== null && (
        <div className={`absolute -top-2 -right-2 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full ${getScoreBg(matchScore)} flex items-center gap-0.5 sm:gap-1 shadow-md z-10`}>
          <TrendingUp className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${getScoreColor(matchScore)}`} />
          <span className={`text-[10px] sm:text-sm font-bold ${getScoreColor(matchScore)}`}>
            {matchScore}%
          </span>
        </div>
      )}

      {/* Header - Name & Status */}
      <div className="flex items-start justify-between mb-3 pt-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <User className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
              {candidate.candidateName || 'Unnamed Candidate'}
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-500">{uploadedDate}</p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-1 mb-3">
        {candidate.email && (
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-gray-600">
            <Mail className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span className="truncate">{candidate.email}</span>
          </div>
        )}
        {candidate.phone && (
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-gray-600">
            <FileText className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span className="truncate">{candidate.phone}</span>
          </div>
        )}
      </div>

      {/* Skills */}
      {topSkills.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {topSkills.map((skill, index) => (
              <span
                key={index}
                className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-blue-50 text-blue-700 text-[9px] sm:text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
            {hasMoreSkills && (
              <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-gray-100 text-gray-600 text-[9px] sm:text-xs rounded-full">
                +{candidate.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer - Experience & Education */}
      <div className="flex items-center gap-2 sm:gap-4 pt-3 border-t border-gray-100 text-[10px] sm:text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Briefcase className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
          <span>{candidate.workExperience?.length || 0} exp</span>
        </div>
        <div className="flex items-center gap-1">
          <GraduationCap className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
          <span>{candidate.education?.length || 0} edu</span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-gray-400 truncate max-w-[60px] sm:max-w-none">
            {candidate.totalExperience || 'N/A'}
          </span>
        </div>
      </div>

      {/* Job Title Badge - Bottom */}
      {candidate.jobTitle && (
        <div className="mt-2 pt-2 border-t border-gray-50">
          <span className="text-[9px] sm:text-xs text-gray-400 truncate block">
            {candidate.jobTitle}
          </span>
        </div>
      )}
    </div>
  );
};

export default CandidateCard;