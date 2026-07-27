import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { updateJob, parseJobDescription } from '../../api/jobApi';
import { matchAllCandidates } from '../../api/resumeApi';
import JDParser from './JDParser';
import { 
  Briefcase, 
  FileText, 
  Clock, 
  MapPin, 
  Tag, 
  Star,
  Send,
  Loader2,
  Sparkles,
  RefreshCw
} from 'lucide-react';

const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

const EditJob = ({ job }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showReAnalyze, setShowReAnalyze] = useState(false);
  const [isReAnalyzing, setIsReAnalyzing] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      jobTitle: job.jobTitle || '',
      jobDescription: job.jobDescription || '',
      experienceRequired: job.experienceRequired || '',
      employmentType: job.employmentType || '',
      location: job.location || '',
      requiredSkills: job.requiredSkills?.join(', ') || '',
      preferredSkills: job.preferredSkills?.join(', ') || '',
    }
  });

  const jobDescription = watch('jobDescription', '');

  // Update Job Mutation
  const updateMutation = useMutation(
    (data) => updateJob(job._id, data),
    {
      onSuccess: (data) => {
        toast.success('✅ Job updated successfully!');
        queryClient.invalidateQueries('jobs');
        queryClient.invalidateQueries(['job', job._id]);
        
        // If re-analyze was checked, run match all
        if (showReAnalyze) {
          handleReAnalyze();
        } else {
          navigate('/jobs');
        }
      },
      onError: (error) => {
        toast.error(`❌ ${error.response?.data?.error || 'Failed to update job'}`);
      },
    }
  );

  // Re-analyze Mutation
  const reAnalyzeMutation = useMutation(
    () => matchAllCandidates(job._id),
    {
      onSuccess: (data) => {
        toast.success(`✅ ${data.message || 'All candidates re-analyzed!'}`);
        setIsReAnalyzing(false);
        navigate('/jobs');
      },
      onError: (error) => {
        toast.error(`❌ ${error.response?.data?.error || 'Failed to re-analyze candidates'}`);
        setIsReAnalyzing(false);
      },
    }
  );

  const handleReAnalyze = async () => {
    setIsReAnalyzing(true);
    await reAnalyzeMutation.mutateAsync();
  };

  const onSubmit = (data) => {
    const requiredSkills = data.requiredSkills
      ?.split(',').map(s => s.trim()).filter(Boolean) || [];
    const preferredSkills = data.preferredSkills
      ?.split(',').map(s => s.trim()).filter(Boolean) || [];

    updateMutation.mutate({ ...data, requiredSkills, preferredSkills });
  };

  const handleAIParseSuccess = (parsedData) => {
    if (parsedData.jobTitle) {
      setValue('jobTitle', parsedData.jobTitle);
    }
    if (parsedData.location) {
      setValue('location', parsedData.location);
    }
    if (parsedData.employmentType) {
      setValue('employmentType', parsedData.employmentType);
    }
    if (parsedData.experienceRequired) {
      setValue('experienceRequired', parsedData.experienceRequired);
    }
    if (parsedData.requiredSkills?.length) {
      setValue('requiredSkills', parsedData.requiredSkills.join(', '));
    }
    if (parsedData.preferredSkills?.length) {
      setValue('preferredSkills', parsedData.preferredSkills.join(', '));
    }
    toast.success('✨ AI filled all fields automatically!');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* AI Parser Section */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 mt-1" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-800">AI Auto-Fill</h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Let AI extract skills, experience, and requirements from your updated job description
              </p>
              <JDParser 
                jobDescription={jobDescription} 
                onParseSuccess={handleAIParseSuccess} 
              />
            </div>
          </div>
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="flex items-center gap-2">
              <Briefcase size={16} />
              Job Title <span className="text-red-500">*</span>
            </span>
          </label>
          <input
            type="text"
            {...register('jobTitle', { required: 'Job title is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g., Senior React Developer"
          />
          {errors.jobTitle && (
            <p className="text-red-500 text-xs mt-1">{errors.jobTitle.message}</p>
          )}
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="flex items-center gap-2">
              <FileText size={16} />
              Job Description <span className="text-red-500">*</span>
            </span>
          </label>
          <textarea
            {...register('jobDescription', { required: 'Job description is required' })}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y"
            placeholder="Paste the full job description here..."
          />
          {errors.jobDescription && (
            <p className="text-red-500 text-xs mt-1">{errors.jobDescription.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            💡 AI will automatically extract skills, experience, and requirements from this description
          </p>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-2">
                <Clock size={16} />
                Experience Required <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="text"
              {...register('experienceRequired', { required: 'Experience required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g., 3+ years"
            />
            {errors.experienceRequired && (
              <p className="text-red-500 text-xs mt-1">{errors.experienceRequired.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employment Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register('employmentType', { required: 'Employment type is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
            >
              <option value="">Select type...</option>
              {employmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.employmentType && (
              <p className="text-red-500 text-xs mt-1">{errors.employmentType.message}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="flex items-center gap-2">
              <MapPin size={16} />
              Location <span className="text-red-500">*</span>
            </span>
          </label>
          <input
            type="text"
            {...register('location', { required: 'Location is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g., Remote, New York, Hyderabad"
          />
          {errors.location && (
            <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
          )}
        </div>

        {/* Required Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="flex items-center gap-2">
              <Tag size={16} />
              Required Skills
            </span>
          </label>
          <input
            type="text"
            {...register('requiredSkills')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="React, Node.js, MongoDB, TypeScript"
          />
          <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
        </div>

        {/* Preferred Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="flex items-center gap-2">
              <Star size={16} />
              Preferred Skills
            </span>
          </label>
          <input
            type="text"
            {...register('preferredSkills')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="AWS, Docker, GraphQL"
          />
          <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
        </div>

        {/* Re-analyze Checkbox */}
        <div className="pt-4 border-t border-gray-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showReAnalyze}
              onChange={(e) => setShowReAnalyze(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              <RefreshCw className="w-4 h-4 inline mr-1" />
              Re-analyze all candidates after update (recommended if job requirements changed)
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/jobs')}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateMutation.isLoading || isReAnalyzing}
            className={`
              flex-1 flex items-center justify-center gap-2 px-6 py-3 
              bg-gradient-to-r from-blue-600 to-blue-700 text-white 
              rounded-lg font-medium transition-all duration-200
              hover:from-blue-700 hover:to-blue-800 hover:shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {updateMutation.isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : isReAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Re-analyzing Candidates...
              </>
            ) : (
              <>
                <Send size={18} />
                {showReAnalyze ? 'Update & Re-analyze' : 'Update Job'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;