import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import providerService from "../services/providerService";
import companyService from "../services/companyService";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const providerSchema = z.object({
    name: z.enum(["Workday", "ADP", "BambooHR"]),
    companyId: z.string().min(1, "Please select a company"),
});

const Providers = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [providers, setProviders] = useState([]);
    const [companies, setCompanies] = useState([]);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(providerSchema),
        defaultValues: {
            name: "Workday",
            companyId: "",
        },
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

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            await providerService.createProvider(data);

            reset({
                name: "Workday",
                companyId: "",
            });

            await fetchProviders();

            toast.success("Integration created successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not create integration");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout title="Integrations">
            {["admin", "developer"].includes(user?.role) && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <select {...register("name")}>
                        <option value="Workday">Workday</option>
                        <option value="ADP">ADP</option>
                        <option value="BambooHR">BambooHR</option>
                    </select>

                    <select {...register("companyId")}>
                        <option value="">Select company</option>
                        {companies.map((company) => (
                            <option key={company._id} value={company._id}>
                                {company.name}
                            </option>
                        ))}
                    </select>

                    {errors.companyId && <p>{errors.companyId.message}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Integration"}
                    </button>
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