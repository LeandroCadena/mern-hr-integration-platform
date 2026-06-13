import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import syncLogService from "../services/syncLogService";

const SyncLogs = () => {
    const [logs, setLogs] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [providerFilter, setProviderFilter] = useState("");
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);

    const fetchLogs = async () => {
        const data = await syncLogService.getSyncLogs({
            status: statusFilter,
            provider: providerFilter,
            page,
            limit: 10,
        });

        setLogs(data.logs);
        setPagination(data.pagination);
    };

    useEffect(() => {
        fetchLogs();
    }, [statusFilter, providerFilter, page]);

    return (
        <DashboardLayout title="Sync Logs">
            <select
                value={statusFilter}
                onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                }}
            >
                <option value="">All Statuses</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
            </select>

            <select
                value={providerFilter}
                onChange={(e) => {
                    setProviderFilter(e.target.value);
                    setPage(1);
                }}
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
            {pagination && (
                <div>
                    <button
                        disabled={pagination.currentPage === 1}
                        onClick={() => setPage((prev) => prev - 1)}
                    >
                        Previous
                    </button>

                    <span>
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>

                    <button
                        disabled={pagination.currentPage === pagination.totalPages}
                        onClick={() => setPage((prev) => prev + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </DashboardLayout>
    );
};

export default SyncLogs;