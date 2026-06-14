import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("leandro@test.com");
    const [password, setPassword] = useState("123456");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setError("");
            await login(email, password);
            navigate("/dashboard");
        } catch (error) {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="login-page">
            <div className="login-decoration left">
                <div className="floating-card">Employees<br /><strong>1,246</strong></div>
                <div className="floating-card small">HR Data</div>
            </div>

            <div className="login-card">
                <div className="login-icon">🔗</div>

                <h1>
                    <span>HR</span> Integration Platform
                </h1>

                <p className="subtitle">
                    Connect your HR systems. Sync your people. Simplify your workflow.
                </p>

                <h2>Welcome back</h2>
                <p className="login-helper">Please sign in to continue</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>

                    <div className="login-input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>

                    {error && <p className="login-error">{error}</p>}

                    <button type="submit" className="login-button">
                        Login →
                    </button>
                </form>
            </div>

            <div className="login-decoration right">
                <div className="floating-card">Integrations<br /><strong>23</strong></div>
                <div className="floating-card small">Secure Sync</div>
            </div>
        </div>
    );
};

export default Login;