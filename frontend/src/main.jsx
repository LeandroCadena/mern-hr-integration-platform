import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import App from "./App.jsx";
import "./index.css";
import "./styles/variables.css";
import "./styles/forms.css";
import "./styles/cards.css";
import "./styles/tables.css";
import "./styles/dashboard.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);