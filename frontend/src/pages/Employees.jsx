import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import employeeService from "../services/employeeService";
import companyService from "../services/companyService";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import EmployeeCsvUpload from "../components/EmployeeCsvUpload";

const importEmployeesSchema = z.object({
    provider: z.enum(["Workday", "ADP"]),
    companyId: z.string().min(1, "Please select a company"),
});

const Employees = () => {
    const { user } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [filterCompanyId, setFilterCompanyId] = useState("");
    const [filterProvider, setFilterProvider] = useState("");
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(importEmployeesSchema),
        defaultValues: {
            provider: "Workday",
            companyId: "",
        },
    });

    const provider = watch("provider");

    const fetchEmployees = async () => {
        const data = await employeeService.getEmployees({
            companyId: filterCompanyId,
            provider: filterProvider,
            search,
            page,
            limit: 10,
        });

        setEmployees(data.employees);
        setPagination(data.pagination);
    };

    const fetchCompanies = async () => {
        const companies =
            await companyService.getCompanies();

        setCompanies(companies);
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [filterCompanyId, filterProvider, page]);

    const importMockEmployees = async (data) => {
        const mockEmployees =
            data.provider === "Workday"
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

        try {
            setLoading(true);

            await employeeService.importEmployees({
                provider: data.provider,
                companyId: data.companyId,
                employees: mockEmployees,
            });

            await fetchEmployees();

            toast.success("Employees imported successfully");

            reset({
                provider: "Workday",
                companyId: "",
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Import failed");
        } finally {
            setLoading(false);
        }
    };

    const validateCsvColumns = (employees, selectedProvider) => {
        const requiredColumns =
            selectedProvider === "Workday"
                ? ["workerId", "first_name", "last_name", "work_email"]
                : ["associateId", "givenName", "familyName", "email"];

        const firstRow = employees[0];

        return requiredColumns.every((column) =>
            Object.prototype.hasOwnProperty.call(firstRow, column)
        );
    };

    const downloadCsvTemplate = () => {
        const headers =
            provider === "Workday"
                ? "workerId,first_name,last_name,work_email\n"
                : "associateId,givenName,familyName,email\n";

        const blob = new Blob([headers], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${provider.toLowerCase()}-employee-template.csv`;
        link.click();

        URL.revokeObjectURL(url);
    };

    const importCsvEmployees = async (employees) => {
        const selectedCompanyId = watch("companyId");

        if (!selectedCompanyId) {
            toast.warning("Please select a company before importing CSV");
            return;
        }

        if (!employees.length) {
            toast.warning("CSV file is empty");
            return;
        }

        if (!validateCsvColumns(employees, provider)) {
            toast.error(`Invalid CSV columns for ${provider}`);
            return;
        }

        try {
            setLoading(true);

            await employeeService.importEmployees({
                provider,
                companyId: selectedCompanyId,
                employees,
            });

            await fetchEmployees();

            toast.success("CSV imported successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "CSV import failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout title="Employees">
            {["admin", "developer"].includes(user?.role) && (
                <div className="metric-card">
                    <form onSubmit={handleSubmit(importMockEmployees)}>
                        <select {...register("provider")}>
                            <option value="Workday">Workday</option>
                            <option value="ADP">ADP</option>
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
                            {loading ? "Importing..." : "Import Employees"}
                        </button>
                    </form>

                    <hr />

                    <h3>Import Employees From CSV</h3>

                    <button type="button" onClick={downloadCsvTemplate}>
                        Download CSV Template
                    </button>

                    <EmployeeCsvUpload
                        onImport={importCsvEmployees}
                    />

                    <p>
                        Expected CSV columns depend on selected provider.
                    </p>

                </div>
            )
            }

            <button onClick={fetchEmployees}>Search</button>

            <div className="metric-card">
                <h3>Filters</h3>

                <select
                    value={filterCompanyId}
                    onChange={(e) => {
                        setFilterCompanyId(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Companies</option>
                    {companies.map((company) => (
                        <option key={company._id} value={company._id}>
                            {company.name}
                        </option>
                    ))}
                </select>

                <select
                    value={filterProvider}
                    onChange={(e) => {
                        setFilterProvider(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Providers</option>
                    <option value="Workday">Workday</option>
                    <option value="ADP">ADP</option>
                </select>

                <button onClick={fetchEmployees}>Apply Filters</button>
            </div>

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
                        .map((employee) => (
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
        </DashboardLayout >
    );
};

export default Employees;