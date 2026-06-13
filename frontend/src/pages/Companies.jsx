import { useEffect, useState } from "react";
import "../styles/dashboard.css";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import companyService from "../services/companyService";
import { toast } from "react-toastify";

const Companies = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [form, setForm] = useState({
        name: "",
        industry: "",
        country: "",
    });


    const fetchCompanies = async () => {
        const companies = await companyService.getCompanies();
        setCompanies(companies);
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);

            await companyService.createCompany(form);

            setForm({
                name: "",
                industry: "",
                country: "",
            });

            await fetchCompanies();

            toast.success("Company created successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not create company");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout title="Companies">
            {user?.role === "admin" && (
                <form onSubmit={handleSubmit}>
                    <input
                        placeholder="Company name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />

                    <input
                        placeholder="Industry"
                        value={form.industry}
                        onChange={(e) =>
                            setForm({ ...form, industry: e.target.value })
                        }
                    />

                    <input
                        placeholder="Country"
                        value={form.country}
                        onChange={(e) =>
                            setForm({ ...form, country: e.target.value })
                        }
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Company"}
                    </button>
                </form>
            )}

            <hr />

            {companies.map((company) => (
                <div className="metric-card" key={company._id}>
                    <h3>{company.name}</h3>
                    <p>{company.industry}</p>
                    <p>{company.country}</p>
                </div>
            ))}
        </DashboardLayout>
    );
};

export default Companies;
