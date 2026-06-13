import api from "./api";

const getMetrics = async () => {
    const response = await api.get("/dashboard/metrics");
    return response.data;
};

export default {
    getMetrics,
};