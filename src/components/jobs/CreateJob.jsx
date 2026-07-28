import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createJob } from '../../api/jobApi';
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
  Sparkles
} from 'lucide-react';

const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

const CreateJob = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const queryClient = useQueryClient();
  const jobDescription = watch('jobDescription', '');

  const mutation = useMutation(createJob, {
    onSuccess: (data) => {
      reset();
      queryClient.invalidateQueries('jobs');
      
      // ✅ Show success toast with option to view jobs
      toast.success(
        (t) => (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="text-green-600">✅ Job "{data.job?.jobTitle || 'Job'}" created successfully!</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate('/jobs');
                }}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                View All Jobs
              </button>
            </div>
          </div>
        ),
        { duration: 5000 }
      );
    },
    onError: (error) => {
      toast.error(`❌ Failed to create job: ${error.response?.data?.error || 'Please try again'}`);
    },
  });

  const onSubmit = (data) => {
    const requiredSkills = data.requiredSkills
      ?.split(',').map(s => s.trim()).filter(Boolean) || [];
    const preferredSkills = data.preferredSkills
      ?.split(',').map(s => s.trim()).filter(Boolean) || [];

    mutation.mutate({ ...data, requiredSkills, preferredSkills });
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
        {/* AI Parser Section - NEW */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 mt-1" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-800">AI Auto-Fill</h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Let AI extract skills, experience, and requirements from your job description
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
          {/* Experience Required */}
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

          {/* Employment Type */}
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

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={mutation.isLoading}
            className={`
              w-full flex items-center justify-center gap-2 px-6 py-3 
              bg-gradient-to-r from-blue-600 to-blue-700 text-white 
              rounded-lg font-medium transition-all duration-200
              hover:from-blue-700 hover:to-blue-800 hover:shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {mutation.isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Job...
              </>
            ) : (
              <>
                <Send size={18} />
                Create Job
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;