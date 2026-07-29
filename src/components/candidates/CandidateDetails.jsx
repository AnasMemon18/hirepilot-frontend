import React, { useState, useCallback } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { 
  User, Mail, Phone, Briefcase, GraduationCap, Award, 
  Code, Languages, Calendar, Building, FileText, 
  TrendingUp, CheckCircle, XCircle, Loader2,
  Zap, BarChart3, Target, ThumbsUp, AlertCircle,
  Sparkles, MessageSquare // ✅ NEW
} from 'lucide-react';
import { matchCandidate } from '../../api/resumeApi';

const CandidateDetails = React.memo(({ candidate }) => {
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(candidate.matchResult || null);

  // Mutation for matching
  const matchMutation = useMutation(matchCandidate, {
    onSuccess: (data) => {
      if (data.success) {
        setMatchResult(data.matchResult);
        toast.success(`✅ Match score: ${data.matchResult.overallScore}%`);
      } else {
        toast.error('Failed to match candidate');
      }
      setIsMatching(false);
    },
    onError: (error) => {
      toast.error(`❌ ${error.response?.data?.error || 'Failed to match candidate'}`);
      setIsMatching(false);
    },
  });

  const handleMatch = useCallback(() => {
    setIsMatching(true);
    matchMutation.mutate(candidate._id);
  }, [candidate?._id, matchMutation]);

  // Helper to check if field has data
  const hasData = (field) => {
    if (Array.isArray(field)) return field.length > 0;
    if (typeof field === 'string') return field.trim() !== '';
    return field !== null && field !== undefined;
  };

  // Get score color
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

  // Get recommendation badge
  const getRecommendationBadge = (recommendation) => {
    const styles = {
      'Strong Candidate': 'bg-green-100 text-green-700 border-green-200',
      'Good Fit': 'bg-blue-100 text-blue-700 border-blue-200',
      'Consider': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Not Recommended': 'bg-red-100 text-red-700 border-red-200',
    };
    return styles[recommendation] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Match Score Section */}
      {matchResult ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Match Analysis
            </h2>
            <button
              onClick={handleMatch}
              disabled={isMatching}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              {isMatching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Re-analyze'}
            </button>
          </div>

          {/* Overall Score */}
          <div className="flex items-center gap-6 mb-6">
            <div className="text-center">
              <div className={`text-5xl font-bold ${getScoreColor(matchResult.overallScore)}`}>
                {matchResult.overallScore}%
              </div>
              <span className="text-xs text-gray-500">Overall Match</span>
            </div>
            <div className="flex-1">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRecommendationBadge(matchResult.recommendation)}`}>
                {matchResult.recommendation}
              </span>
            </div>
          </div>

          
          {matchResult.explanation && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-600" />
                    AI Assessment
                  </h4>
                  <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                    {matchResult.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Breakdown Bars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(matchResult.breakdown || {}).map(([key, score]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 capitalize">{key}</span>
                  <span className={`font-medium ${getScoreColor(score)}`}>{Math.round(score)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      score >= 80 ? 'bg-green-500' :
                      score >= 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(score, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchResult.strengths && matchResult.strengths.length > 0 && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="text-sm font-semibold text-green-800 flex items-center gap-2 mb-2">
                  <ThumbsUp className="w-4 h-4" />
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {matchResult.strengths.map((item, index) => (
                    <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      {item.replace('✓ ', '')}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {matchResult.weaknesses && matchResult.weaknesses.length > 0 && (
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h4 className="text-sm font-semibold text-red-800 flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  Missing / Areas to Improve
                </h4>
                <ul className="space-y-1">
                  {matchResult.weaknesses.map((item, index) => (
                    <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      {item.replace('✗ ', '')}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Matched & Missing Skills */}
          {(matchResult.matchedSkills?.length > 0 || matchResult.missingSkills?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {matchResult.matchedSkills?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">✅ Matched Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.matchedSkills.map((skill, index) => (
                      <span key={index} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {matchResult.missingSkills?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">❌ Missing Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.missingSkills.map((skill, index) => (
                      <span key={index} className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        // No match result - Show "Analyze" button
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <Zap className="w-12 h-12 text-blue-300" />
            <h3 className="text-lg font-semibold text-gray-700">Analyze Candidate Match</h3>
            <p className="text-sm text-gray-500 max-w-md">
              Compare this candidate against the job requirements and get an AI-powered match score.
            </p>
            <button
              onClick={handleMatch}
              disabled={isMatching}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2"
            >
              {isMatching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4" />
                  Calculate Match Score
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Rest of candidate details - Profile Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {candidate.candidateName || 'Unnamed Candidate'}
                </h2>
                <p className="text-sm text-gray-500">
                  {candidate.totalExperience || 'Experience not specified'}
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-100">
              {candidate.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{candidate.email}</span>
                </div>
              )}
              {candidate.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{candidate.phone}</span>
                </div>
              )}
              {candidate.languages?.length > 0 && (
                <div className="flex items-center gap-3 text-sm">
                  <Languages className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">
                    {candidate.languages.join(', ')}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <FileText className="w-4 h-4" />
                <span>{candidate.resumeFileName}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                <Calendar className="w-4 h-4" />
                <span>
                  Uploaded: {new Date(candidate.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          {hasData(candidate.skills) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-600" />
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {hasData(candidate.certifications) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                Certifications
              </h3>
              <ul className="space-y-1">
                {candidate.certifications.map((cert, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technologies */}
          {hasData(candidate.technologies) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-600" />
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Experience & Education */}
        <div className="lg:col-span-2 space-y-6">
          {/* Work Experience */}
          {hasData(candidate.workExperience) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-green-600" />
                Work Experience
              </h3>
              <div className="space-y-4">
                {candidate.workExperience.map((exp, index) => (
                  <div key={index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{exp.role || 'Role'}</h4>
                        <p className="text-sm text-gray-600">{exp.company || 'Company'}</p>
                      </div>
                      {exp.duration && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {exp.duration}
                        </span>
                      )}
                    </div>
                    {exp.description && (
                      <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {hasData(candidate.education) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-600" />
                Education
              </h3>
              <div className="space-y-3">
                {candidate.education.map((edu, index) => (
                  <div key={index} className="flex items-start justify-between pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-medium text-gray-900">{edu.degree || 'Degree'}</h4>
                      <p className="text-sm text-gray-600">{edu.institution || 'Institution'}</p>
                    </div>
                    {edu.year && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {edu.year}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {hasData(candidate.projects) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Building className="w-4 h-4 text-orange-600" />
                Projects
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.projects.map((project, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-50 text-orange-700 text-sm rounded-full"
                  >
                    {project}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Raw Extracted Text */}
      {candidate.resumeText && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <details>
            <summary className="text-sm font-semibold text-gray-700 cursor-pointer">
              Raw Extracted Text
            </summary>
            <pre className="mt-3 p-4 bg-gray-50 rounded-lg text-xs text-gray-600 overflow-auto max-h-64 whitespace-pre-wrap">
              {candidate.resumeText.substring(0, 2000)}
              {candidate.resumeText.length > 2000 && '...'}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
});

export default CandidateDetails;