import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-hot-toast";
import { getAllJobs, deleteJob } from "../../api/jobApi";
import { useAuth } from "../../context/AuthContext";

import {
  Briefcase,
  MapPin,
  Clock,
  Calendar,
  ChevronRight,
  Loader2,
  Trash2,
  Pencil,
  Eye,
  Users,
} from "lucide-react";

const JobList = React.memo(() => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isHR, isAdmin } = useAuth();
  const canEdit = isHR || isAdmin;
  const canDelete = isAdmin;

  const { data, isLoading, error } = useQuery("jobs", getAllJobs);

  const deleteMutation = useMutation(deleteJob, {
    onSuccess: (data) => {
      toast.success(`✅ ${data.message || "Job deleted successfully!"}`);
      queryClient.invalidateQueries("jobs");
    },
    onError: (error) => {
      toast.error(
        `❌ ${error.response?.data?.error || "Failed to delete job"}`,
      );
    },
  });

  const handleDelete = (e, jobId, jobTitle) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to delete "${jobTitle}"? This will also delete all associated candidates and resume files.`,
      )
    ) {
      deleteMutation.mutate(jobId);
    }
  };

  const handleEdit = (e, jobId) => {
    e.stopPropagation();
    navigate(`/edit-job/${jobId}`);
  };

  // Handle View Details
  const handleViewDetails = (e, jobId) => {
    e.stopPropagation();
    navigate(`/job/${jobId}`);
  };

  // Handle View Candidates
  const handleViewCandidates = (e, jobId) => {
    e.stopPropagation();
    navigate(`/candidates/${jobId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span>Loading jobs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        Failed to load jobs. Please try again.
      </div>
    );
  }

  const jobs = data?.jobs || [];

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">
          No jobs created yet
        </h3>
        <p className="text-gray-500 mt-2">
          Create your first job posting to get started.
        </p>
        <button
          onClick={() => navigate("/create-job")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Job
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job._id}
          onClick={() => navigate(`/job/${job._id}`)} // ✅ Navigate to Job Details
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            {/* Left - Job Info */}
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {job.jobTitle}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location || "Remote"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.employmentType || "Full-time"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              {job.requiredSkills && job.requiredSkills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.requiredSkills.slice(0, 5).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.requiredSkills.length > 5 && (
                    <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                      +{job.requiredSkills.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Right - Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                Active
              </span>

              {/* View Details Button */}
              <button
                onClick={(e) => handleViewDetails(e, job._id)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Details</span>
              </button>

              {/*  View Candidates Button */}
              <button
                onClick={(e) => handleViewCandidates(e, job._id)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Candidates</span>
              </button>

              {/* ✅ Edit Button - Hide from viewer */}
              {canEdit && (
                <button
                  onClick={(e) => handleEdit(e, job._id)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Edit job"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}

              {/* ✅ Delete Button - Admin only */}
              {canDelete && (
                <button
                  onClick={(e) => handleDelete(e, job._id, job.jobTitle)}
                  disabled={deleteMutation.isLoading}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete job"
                >
                  {deleteMutation.isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              )}

              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      ))}

      <div className="text-sm text-gray-500 text-center pt-4 border-t border-gray-200">
        Showing {jobs.length} job{jobs.length > 1 ? "s" : ""}
      </div>
    </div>
  );
});

export default JobList;
