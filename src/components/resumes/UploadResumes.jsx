import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { Upload, File, Trash2, Loader2 } from 'lucide-react';
import { uploadResumes } from '../../api/resumeApi';
import { getAllJobs } from '../../api/jobApi'; // ← Import this

const UploadResumes = () => {
  const [files, setFiles] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const queryClient = useQueryClient();

  // Fetch jobs from database using react query
  const { data: jobsData, isLoading: jobsLoading, error: jobsError } = useQuery(
    'jobs', 
    getAllJobs
  );
  
  const jobs = jobsData?.jobs || [];

  const mutation = useMutation(uploadResumes, {
    onSuccess: (data) => {
      toast.success(`✅ ${data.message || 'Resumes uploaded successfully!'}`);
      setFiles([]);
      setSelectedJobId('');
      queryClient.invalidateQueries('candidates');
    },
    onError: (error) => {
      toast.error(`❌ Failed to upload: ${error.response?.data?.error || error.message}`);
    },
  });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (!selectedJobId) {
      toast.error('Please select a job');
      return;
    }
    if (files.length === 0) {
      toast.error('Please select at least one PDF file');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('resumes', file);
    });
    formData.append('jobId', selectedJobId);

    mutation.mutate(formData);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // Show loading state
  if (jobsLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading jobs...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (jobsError) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          Failed to load jobs. Please refresh the page.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Job Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Job <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        >
          <option value="">Select a job...</option>
          {jobs.map((job) => (
            <option key={job._id} value={job._id}>
              {job.jobTitle} - {job.location || 'Remote'} ({job.employmentType || 'Full-time'})
            </option>
          ))}
        </select>
        {jobs.length === 0 && (
          <p className="text-sm text-amber-600 mt-1">
            ⚠️ No jobs found. Please create a job first.
          </p>
        )}
        {jobs.length > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            {jobs.length} job{jobs.length > 1 ? 's' : ''} available
          </p>
        )}
      </div>

      {/* File Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer block">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Drag & drop PDF files here, or click to select
          </p>
          <p className="text-sm text-gray-400 mt-1">Supports up to 10 files, 10MB each</p>
        </label>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <File className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-400">
                  ({(file.size / 1024).toFixed(0)} KB)
                </span>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && (
        <div className="mt-6">
          <button
            onClick={handleUpload}
            disabled={mutation.isLoading || !selectedJobId}
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
                Uploading...
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload {files.length} Resume{files.length > 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadResumes;