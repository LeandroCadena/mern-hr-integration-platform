import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";

const DashboardLayout = ({ children, title }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="dashboard-page">
            <aside className="sidebar">
                <div>
                    <h2>HR Platform</h2>

                    <nav>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/companies">Companies</Link>
                        <Link to="/providers">Providers</Link>
                        <Link to="/employees">Employees</Link>
                        <Link to="/sync-logs">Sync Logs</Link>
                    </nav>
                </div>

                <button onClick={handleLogout}>Logout</button>
            </aside>

            <main className="dashboard-content">
                <header className="dashboard-header">
                    <div>
                        <h1>{title}</h1>
                        <p>Welcome, {user?.name}</p>
                    </div>

                    <span className="role-badge">{user?.role}</span>
                </header>

                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;