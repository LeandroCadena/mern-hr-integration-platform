import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import companyService from "../services/companyService";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import integrationService from "../services/integrationService";

const integrationSchema = z.object({
    name: z.enum(["Workday", "ADP", "BambooHR"]),
    companyId: z.string().min(1, "Please select a company"),
});

const Integrations = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [integrations, setIntegrations] = useState([]);
    const [companies, setCompanies] = useState([]);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(integrationSchema),
        defaultValues: {
            name: "Workday",
            companyId: "",
        },
    });

    const fetchIntegrations = async () => {
        const integrations =
            await integrationService.getIntegrations();

        setIntegrations(integrations);
    };

    const fetchCompanies = async () => {
        const companies =
            await companyService.getCompanies();

        setCompanies(companies);
    };

    useEffect(() => {
        fetchIntegrations();
        fetchCompanies();
    }, []);

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            await integrationService.createIntegration(data);

            reset({
                name: "Workday",
                companyId: "",
            });

            await fetchIntegrations();

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

            {integrations.map((integration) => (
                <div className="metric-card" key={integration._id}>
                    <h3>{integration.name}</h3>
                    <p>Status: {integration.status}</p>
                    <p>Company: {integration.companyId?.name}</p>
                </div>
            ))}
        </DashboardLayout>
    );
};

export default Integrations;