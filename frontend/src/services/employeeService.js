import api from "./api";

const getEmployees = async (filters = {}) => {
    const response = await api.get("/employees", {
        params: filters,
    });

    return response.data.employees;
};

const importEmployees = async (payload) => {
    const response = await api.post("/employees/import", payload);
    return response.data;
};

export default {
    getEmployees,
    importEmployees,
};