import api from "./api";

const getSyncLogs = async () => {
    const response = await api.get("/sync-logs");
    return response.data.logs;
};

export default {
    getSyncLogs,
};