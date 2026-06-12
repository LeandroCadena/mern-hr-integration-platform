import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/dashboard.css";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

const Dashboard = () => {
    const { user, logout } = useAuth();

    const [metrics, setMetrics] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await api.get("/dashboard/metrics");
                setMetrics(response.data);
            } catch (error) {
                setError("Could not load dashboard metrics");
            }
        };

        fetchMetrics();
    }, []);

    return (
        <DashboardLayout title="Dashboard">
            {error && <p>{error}</p>}
            {!metrics && !error && <p>Loading metrics...</p>}

            {metrics && (
                <section className="metrics-grid">
                    <div className="metric-card">
                        <p>Total Companies</p>
                        <h2>{metrics.totalCompanies}</h2>
                    </div>

                    <div className="metric-card">
                        <p>Total Providers</p>
                        <h2>{metrics.totalProviders}</h2>
                    </div>

                    <div className="metric-card">
                        <p>Total Employees</p>
                        <h2>{metrics.totalEmployees}</h2>
                    </div>

                    <div className="metric-card">
                        <p>Sync Logs</p>
                        <h2>{metrics.totalSyncLogs}</h2>
                    </div>

                    <div className="metric-card">
                        <p>Successful Syncs</p>
                        <h2>{metrics.successfulSyncs}</h2>
                    </div>

                    <div className="metric-card">
                        <p>Failed Syncs</p>
                        <h2>{metrics.failedSyncs}</h2>
                    </div>
                </section>
            )}
        </DashboardLayout>
    );
};

export default Dashboard;