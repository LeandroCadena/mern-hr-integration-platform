import api from "./api";

const getSyncLogs = async (filters = {}) => {
    const response = await api.get("/sync-logs", {
        params: filters,
    });

    return response.data;
};

export default {
    getSyncLogs,
};