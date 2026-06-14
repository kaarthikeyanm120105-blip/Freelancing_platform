import api from "./api";

const submissionService = {
  // Submit work for a project (Multi-part form data)
  submitWork: async (formData) => {
    try {
      const response = await api.post("/submissions/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get my submissions for a specific project
  getMySubmissions: async (proposalId) => {
    try {
      const response = await api.get(`/submissions/my-submissions/${proposalId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get job submissions (Client view)
  getJobSubmissions: async (jobId) => {
    try {
      const response = await api.get(`/submissions/job-submissions/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // Client: Approve or Request Revision
  updateSubmissionStatus: async (submissionId, statusData) => {
    try {
      const response = await api.put(`/submissions/${submissionId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default submissionService;
