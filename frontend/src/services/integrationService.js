import api from "./api";

const getIntegrations = async () => {
    const response = await api.get("/integrations");
    return response.data.integrations;
};

const createIntegration = async (integration) => {
    const response = await api.post("/integrations", integration);
    return response.data;
};

export default {
    getIntegrations,
    createIntegration,
};