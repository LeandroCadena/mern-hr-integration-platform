import api from "./api";

const getIntegrations = async () => {
    const response = await api.get("/integrations");
    return response.data.integrations;
};

const createIntegration = async (integration) => {
    const response = await api.post("/integrations", integration);
    return response.data;
};

const simulateSync = async (integrationId, count) => {
    const response = await api.post(
        `/integrations/${integrationId}/simulate-sync`, {
            count
        }
    );

    return response.data;
};

export default {
    getIntegrations,
    createIntegration,
    simulateSync,
};