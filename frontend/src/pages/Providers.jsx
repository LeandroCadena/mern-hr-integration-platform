import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import providerService from "../services/providerService";
import companyService from "../services/companyService";

const Providers = () => {
    const { user } = useAuth();
    const [providers, setProviders] = useState([]);
    const [companies, setCompanies] = useState([]);

    const [form, setForm] = useState({
        name: "Workday",
        companyId: "",
    });

    const fetchProviders = async () => {
        const providers =
            await providerService.getProviders();

        setProviders(providers);
    };

    const fetchCompanies = async () => {
        const companies =
            await companyService.getCompanies();

        setCompanies(companies);
    };

    useEffect(() => {
        fetchProviders();
        fetchCompanies();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        await providerService.createProvider(
            form
        );

        setForm({
            name: "Workday",
            companyId: "",
        });

        fetchProviders();
    };

    return (
        <DashboardLayout title="Providers">
            {["admin", "developer"].includes(user?.role) && (
                <form onSubmit={handleSubmit}>
                    <select
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    >
                        <option value="Workday">Workday</option>
                        <option value="ADP">ADP</option>
                        <option value="BambooHR">BambooHR</option>
                    </select>

                    <select
                        value={form.companyId}
                        onChange={(e) =>
                            setForm({ ...form, companyId: e.target.value })
                        }
                    >
                        <option value="">Select company</option>

                        {companies.map((company) => (
                            <option key={company._id} value={company._id}>
                                {company.name}
                            </option>
                        ))}
                    </select>

                    <button type="submit">Connect Provider</button>
                </form>
            )}

            <hr />

            {providers.map((provider) => (
                <div className="metric-card" key={provider._id}>
                    <h3>{provider.name}</h3>
                    <p>Status: {provider.status}</p>
                    <p>Company: {provider.companyId?.name}</p>
                </div>
            ))}
        </DashboardLayout>
    );
};

export default Providers;