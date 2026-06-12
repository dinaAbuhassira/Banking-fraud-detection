import { useState } from "react";
import "../styles/login.css";
import logo1 from "../assets/logo1.png";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  async function handleLogin() {
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError("Invalid email or password");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch {
      setError("Backend is not running");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img src={logo1} alt="logo1" className="logo" />
        </div>

        <h1 className="title">Banking Fraud Detection</h1>
        <p className="subtitle">Secure Access. Trusted Protection.</p>

        <label>Email</label>
        <input
          type="email"
          placeholder="admin@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={{ color: "red", fontSize: "13px" }}>{error}</p>}

        <button className="login-btn" onClick={handleLogin}>
          Login to System
        </button>

        <p className="footer-text">Authorized Personnel Only</p>
        <p className="copyright">© 2026 Banking Fraud Detection</p>
      </div>
    </div>
  );
}

export default Login;