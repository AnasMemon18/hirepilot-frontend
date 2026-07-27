import React from 'react';
import CreateJob from '../components/jobs/CreateJob';

const CreateJobPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Job</h1>
        <p className="text-gray-600 mt-1">Post a new job opening and let AI analyze candidates</p>
      </div>
      
      <CreateJob />
    </div>
  );
};

export default CreateJobPage;