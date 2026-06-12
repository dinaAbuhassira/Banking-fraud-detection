import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { page: "dashboard", icon: "fa-solid fa-gauge-high", label: "Dashboard" },
  { page: "transactions", icon: "fa-solid fa-arrow-right-arrow-left", label: "Transactions" },
  { page: "alerts", icon: "fa-solid fa-triangle-exclamation", label: "Fraud Alerts" },
  { page: "reports", icon: "fa-solid fa-chart-bar", label: "Reports" },
  { page: "settings", icon: "fa-solid fa-gear", label: "Settings" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    if (window.confirm("Are you sure you want to logout?")) {
      navigate("/");
    }
  }

  return (
    <aside className="sidebar">

      <div className="logo">
        <i className="fa-solid fa-shield-halved logo-icon"></i>
        FraudGuard
      </div>

      <ul className="nav-list">
        {navItems.map((item) => (
          <li
            key={item.page}
            className={`nav-item ${
              location.pathname === "/" + item.page ? "active" : ""
            }`}
            onClick={() => navigate("/" + item.page)}
          >
            <i className={item.icon}></i>
            {item.label}
          </li>
        ))}
      </ul>

      <button className="logout-btn" onClick={handleLogout}>
        <i className="fa-solid fa-right-from-bracket"></i>
        Logout
      </button>

    </aside>
  );
}