import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/dashboard.css";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";

const Companies = () => {
    const { user } = useAuth();
    const [companies, setCompanies] = useState([]);
    const [form, setForm] = useState({
        name: "",
        industry: "",
        country: "",
    });


    const fetchCompanies = async () => {
        const response = await api.get("/companies");
        setCompanies(response.data.companies);
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        await api.post("/companies", form);

        setForm({
            name: "",
            industry: "",
            country: "",
        });

        fetchCompanies();
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

                    <button type="submit">Create Company</button>
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
