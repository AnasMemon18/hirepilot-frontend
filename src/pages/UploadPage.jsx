import React from 'react';
import UploadResumes from '../components/resumes/UploadResumes';

const UploadPage = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Upload Resumes</h1>
        <p className="text-gray-600 mt-1">Upload PDF resumes for a specific job</p>
      </div>
      
      <UploadResumes />
    </div>
  );
};

export default UploadPage;