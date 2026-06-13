import { useEffect, useState } from "react";
import "../styles/dashboard.css";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import companyService from "../services/companyService";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const companySchema = z.object({
    name: z.string().min(3, "Company name must have at least 3 characters"),
    industry: z.string().min(2, "Industry is required"),
    country: z.string().min(2, "Country is required"),
});

const Companies = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [companies, setCompanies] = useState([]);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(companySchema),
    });


    const fetchCompanies = async () => {
        const companies = await companyService.getCompanies();
        setCompanies(companies);
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            await companyService.createCompany(data);

            reset();

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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input placeholder="Company name" {...register("name")} />
                    {errors.name && <p>{errors.name.message}</p>}

                    <input placeholder="Industry" {...register("industry")} />
                    {errors.industry && <p>{errors.industry.message}</p>}

                    <input placeholder="Country" {...register("country")} />
                    {errors.country && <p>{errors.country.message}</p>}

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
