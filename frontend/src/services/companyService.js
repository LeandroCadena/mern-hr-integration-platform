import api from "./api";

const getCompanies = async () => {
    const response =
        await api.get("/companies");

    return response.data.companies;
};

const createCompany =
    async (company) => {

        const response =
            await api.post(
                "/companies",
                company
            );

        return response.data;
    };

export default {
    getCompanies,
    createCompany,
};