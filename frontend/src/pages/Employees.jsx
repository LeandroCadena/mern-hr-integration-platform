import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import employeeService from "../services/employeeService";
import companyService from "../services/companyService";

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [companyId, setCompanyId] = useState("");
    const [provider, setProvider] = useState("Workday");
    const [search, setSearch] = useState("");

    const fetchEmployees = async () => {
        const employees =
            await employeeService.getEmployees();

        setEmployees(employees);
    };

    const fetchCompanies = async () => {
        const companies =
            await companyService.getCompanies();

        setCompanies(companies);
    };

    useEffect(() => {
        fetchEmployees();
        fetchCompanies();
    }, []);

    const importMockEmployees = async () => {
        if (!companyId) {
            alert("Please select a company before importing employees");
            return;
        }

        const mockEmployees =
            provider === "Workday"
                ? [
                    {
                        workerId: "WD-1001",
                        first_name: "John",
                        last_name: "Doe",
                        work_email: "john.doe@acme.com",
                    },
                    {
                        workerId: "WD-1002",
                        first_name: "Jane",
                        last_name: "Smith",
                        work_email: "jane.smith@acme.com",
                    },
                ]
                : [
                    {
                        associateId: "ADP-2001",
                        givenName: "Michael",
                        familyName: "Brown",
                        email: "michael.brown@acme.com",
                    },
                ];

        await employeeService.importEmployees(
            payload
        );

        fetchEmployees();
        alert("Employees imported successfully");
    };

    return (
        <DashboardLayout title="Employees">
            {["admin", "developer"].includes(user?.role) && (
                <div className="metric-card">
                    <h3>Import Mock Employees</h3>

                    <select
                        value={provider}
                        onChange={(e) => setProvider(e.target.value)}
                    >
                        <option value="Workday">Workday</option>
                        <option value="ADP">ADP</option>
                    </select>

                    <select
                        value={companyId}
                        onChange={(e) => setCompanyId(e.target.value)}
                    >
                        <option value="">Select company</option>

                        {companies.map((company) => (
                            <option key={company._id} value={company._id}>
                                {company.name}
                            </option>
                        ))}
                    </select>

                    <button onClick={importMockEmployees} disabled={!companyId}>
                        Import Employees
                    </button>
                </div>
            )}

            <input
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Provider</th>
                        <th>External ID</th>
                        <th>Company</th>
                    </tr>
                </thead>

                <tbody>
                    {employees
                        .filter((employee) => {
                            const fullName =
                                `${employee.firstName} ${employee.lastName}`.toLowerCase();

                            return fullName.includes(
                                search.toLowerCase()
                            );
                        }).map((employee) => (
                            <tr key={employee._id}>
                                <td>
                                    {employee.firstName} {employee.lastName}
                                </td>

                                <td>{employee.email}</td>

                                <td>{employee.provider}</td>

                                <td>{employee.externalId}</td>

                                <td>{employee.companyId?.name}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </DashboardLayout>
    );
};

export default Employees;