import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import syncLogService from "../services/syncLogService";

const SyncLogs = () => {
    const [logs, setLogs] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [providerFilter, setProviderFilter] = useState("");

    const fetchLogs = async () => {
        const logs = await syncLogService.getSyncLogs({
            status: statusFilter,
            provider: providerFilter,
        });

        setLogs(logs);
    };

    useEffect(() => {
        fetchLogs();
    }, [statusFilter, providerFilter]);

    return (
        <DashboardLayout title="Sync Logs">
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                <option value="">All Statuses</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
            </select>

            <select
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
            >
                <option value="">All Providers</option>
                <option value="Workday">Workday</option>
                <option value="ADP">ADP</option>
                <option value="BambooHR">BambooHR</option>
            </select>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Provider</th>
                        <th>Status</th>
                        <th>Records</th>
                        <th>Company</th>
                        <th>Triggered By</th>
                        <th>Date</th>
                        <th>Inserted</th>
                        <th>Updated</th>
                    </tr>
                </thead>

                <tbody>
                    {logs
                        .filter((log) => !statusFilter || log.status === statusFilter)
                        .map((log) => (
                            <tr key={log._id}>
                                <td>{log.provider}</td>
                                <td className={`status-${log.status}`}>
                                    {log.status}
                                </td>
                                <td>{log.recordsProcessed}</td>
                                <td>{log.companyId?.name}</td>
                                <td>{log.triggeredBy?.email}</td>
                                <td>{new Date(log.createdAt).toLocaleString()}</td>
                                <td>{log.insertedRecords}</td>
                                <td>{log.updatedRecords}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </DashboardLayout>
    );
};

export default SyncLogs;