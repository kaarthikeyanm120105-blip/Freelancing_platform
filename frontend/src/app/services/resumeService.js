import api from "./api";

const resumeService = {
  analyzeResume: async (file) => {
    const formData = new FormData();
    formData.append("resume", file);
    
    try {
      const { data } = await api.post("/resume/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error) {
      console.error("Resume analysis service error:", error);
      throw error.response?.data || { message: "Analysis failed" };
    }
  },
};

export default resumeService;
