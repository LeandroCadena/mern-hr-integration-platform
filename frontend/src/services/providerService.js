import api from "./api";

const getProviders = async () => {
    const response = await api.get("/providers");
    return response.data.providers;
};

const createProvider = async (provider) => {
    const response = await api.post("/providers", provider);
    return response.data;
};

export default {
    getProviders,
    createProvider,
};