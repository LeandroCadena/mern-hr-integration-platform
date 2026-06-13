import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
        <div>
            <h1>HR Integration Platform</h1>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>

                {error && <p>{error}</p>}

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;