import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Home } from 'lucide-react';
import UploadResumes from '../components/resumes/UploadResumes';

const UploadPage = () => {
  const navigate = useNavigate();
  const { isHR, isAdmin } = useAuth();
  const canUpload = isHR || isAdmin;

  // ✅ If viewer, show access denied
  if (!canUpload) {
    return (
      <div className="max-w-2xl mx-auto pt-16">
        {/* Access Denied Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            You don't have permission to upload resumes.
            <br />
            <span className="text-sm text-gray-400">
              This feature is only available for HR and Admin users.
            </span>
          </p>

          {/* Action Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

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