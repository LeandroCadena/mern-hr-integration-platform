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
    providerName: z.enum(["Workday", "ADP", "BambooHR"]),
    companyId: z.string().min(1, "Please select a company"),
});

const Integrations = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [integrations, setIntegrations] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [syncCounts, setSyncCounts] = useState({});
    const [syncResults, setSyncResults] = useState({});
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(integrationSchema),
        defaultValues: {
            providerName: "Workday",
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
        console.log("Submitting integration:", data);
        try {
            setLoading(true);

            await integrationService.createIntegration(data);

            reset({
                providerName: "Workday",
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

    const handleSimulateSync = async (integrationId, count) => {
        try {
            setLoading(true);

            const result = await integrationService.simulateSync(
                integrationId,
                count
            );

            setSyncResults({
                ...syncResults,
                [integrationId]: result,
            });

            await fetchIntegrations();

            toast.success(
                `Sync completed: ${result.inserted} inserted, ${result.updated} updated`
            );
        } catch (error) {
            toast.error(error.response?.data?.message || "Sync failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout title="Integrations">
            {["admin", "developer"].includes(user?.role) && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <select {...register("providerName")}>
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

                    {errors.providerName && <p>{errors.providerName.message}</p>}
                    {errors.companyId && <p>{errors.companyId.message}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Integration"}
                    </button>
                </form>
            )}

            <hr />

            {integrations.map((integration) => (
                <div className="metric-card" key={integration._id}>
                    <h3>{integration.providerName}</h3>
                    <p>Status: {integration.status}</p>
                    <p>Company: {integration.companyId?.name}</p>
                    {["admin", "developer"].includes(user?.role) && (
                        <>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={syncCounts[integration._id] || 5}
                                onChange={(e) =>
                                    setSyncCounts({
                                        ...syncCounts,
                                        [integration._id]: e.target.value,
                                    })
                                }
                            />

                            <button
                                type="button"
                                disabled={loading}
                                onClick={() =>
                                    handleSimulateSync(
                                        integration._id,
                                        syncCounts[integration._id] || 5
                                    )
                                }
                            >
                                {loading ? "Syncing..." : "Simulate Provider Sync"}
                            </button>
                            {syncResults[integration._id] && (
                                <p>
                                    Last result: {syncResults[integration._id].inserted} inserted,{" "}
                                    {syncResults[integration._id].updated} updated
                                </p>
                            )}
                        </>
                    )}
                </div>
            ))}
        </DashboardLayout>
    );
};

export default Integrations;