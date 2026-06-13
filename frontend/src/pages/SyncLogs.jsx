import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import syncLogService from "../services/syncLogService";

const SyncLogs = () => {
    const [logs, setLogs] = useState([]);

    const fetchLogs = async () => {
        const logs =
            await syncLogService.getSyncLogs();

        setLogs(logs);
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <DashboardLayout title="Sync Logs">
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
                    {logs.map((log) => (
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