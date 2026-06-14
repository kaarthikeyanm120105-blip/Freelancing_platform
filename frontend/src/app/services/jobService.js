import api from "./api";

const jobService = {
    createJob: async (jobData) => {
        const { data } = await api.post("/jobs", jobData);
        return data;
    },

    getAllJobs: async (page = 1, limit = 6) => {
        const { data } = await api.get(`/jobs?page=${page}&limit=${limit}`);
        return data;
    },

    getJobById: async (id) => {
        const { data } = await api.get(`/jobs/${id}`);
        return data;
    },

    getClientJobs: async () => {
        const { data } = await api.get("/jobs/client/myjobs");
        return data;
    },

    updateJob: async (id, jobData) => {
        const { data } = await api.put(`/jobs/${id}`, jobData);
        return data;
    },

    deleteJob: async (id) => {
        const { data } = await api.delete(`/jobs/${id}`);
        return data;
    },

    getMatchedJobs: async () => {
        const { data } = await api.get("/jobs/matched/recommendations");
        return data;
    },
};

export default jobService;
