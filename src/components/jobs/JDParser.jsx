import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { parseJobDescription } from '../../api/jobApi';
import { toast } from 'react-hot-toast';

const JDParser = ({ jobDescription, onParseSuccess }) => {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState(null);
  const [parsedData, setParsedData] = useState(null);

const handleParse = async () => {
  if (!jobDescription || jobDescription.trim().length < 50) {
    setError('Please enter a detailed job description (minimum 50 characters)');
    return;
  }

  setIsParsing(true);
  setError(null);

  try {
    const response = await parseJobDescription(jobDescription);
    
    console.log("📥 Frontend received:", response); 
    
    if (response.success && response.data) {
      setParsedData(response.data);
      onParseSuccess(response.data);
      toast.success(`✨ Filled job details!`);
      setError(null);
    } else {
      setError(response.error || 'Failed to parse job description');
    }
  } catch (err) {
    console.error("❌ Frontend Error:", err);
    setError(err.response?.data?.error || 'Error connecting to AI service. Please try again.');
  } finally {
    setIsParsing(false);
  }
};

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleParse}
        disabled={isParsing || !jobDescription}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
          ${isParsing 
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:from-purple-700 hover:to-blue-700'
          }
          ${!jobDescription ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isParsing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing with AI...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Auto-Fill with AI
          </>
        )}
      </button>

      {isParsing && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          <span>AI is extracting all job details...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          <XCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {parsedData && !isParsing && !error && (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
          <CheckCircle className="w-4 h-4" />
          <span>
            ✅ Extracted: {parsedData.jobTitle || 'Job'} • 
            {parsedData.location || 'Location'} • 
            {parsedData.employmentType || 'Type'} • 
            {parsedData.requiredSkills?.length || 0} skills
          </span>
        </div>
      )}
    </div>
  );
};

export default JDParser;