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

                    <EmployeeCsvUpload
                        onImport={importCsvEmployees}
                    />

                    <p>
                        Expected CSV columns depend on selected provider.
                    </p>

                </div>
            )
            }

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
        </DashboardLayout >
    );
};

export default Employees;