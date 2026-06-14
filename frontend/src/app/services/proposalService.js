import api from "./api";

const proposalService = {
    applyToJob: async (proposalData) => {
        const { data } = await api.post("/proposals", proposalData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    },

    getJobProposals: async (jobId) => {
        const { data } = await api.get(`/proposals/job/${jobId}`);
        return data;
    },

    updateProposalStatus: async (proposalId, status) => {
        const { data } = await api.put(`/proposals/${proposalId}`, { status });
        return data;
    },

    getMyProposals: async () => {
        const { data } = await api.get("/proposals/my-applications");
        return data;
    },

    getUnseenCount: async () => {
        const { data } = await api.get("/proposals/unseen-count");
        return data;
    },

    markAsSeen: async () => {
        const { data } = await api.put("/proposals/mark-seen");
        return data;
    },
};

export default proposalService;
