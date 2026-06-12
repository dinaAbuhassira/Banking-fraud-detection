import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

const pageTitles = {
  dashboard: "Dashboard",
  transactions: "Transactions",
  alerts: "Fraud Alerts",
  reports: "Reports",
  settings: "Settings",
};

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = location.pathname.split("/")[1] || "dashboard";

  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch(() => setTransactions([]));
  }, []);

  const filteredTransactions =
    search.trim().length === 0
      ? []
      : transactions.filter((tx) =>
          tx.customer.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <div className="topbar">
      <div className="page-title">{pageTitles[currentPage]}</div>

      <div className="topbar-right">
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass"></i>

          <input
            className="search-input"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filteredTransactions.length > 0 && (
            <div className="search-dropdown">
              {filteredTransactions.slice(0, 6).map((tx) => (
                <div
                  key={tx.id}
                  className="search-item"
                  onClick={() => {
                    navigate("/transactions");
                    setSearch("");
                  }}
                >
                  <div className="search-name">
                    {tx.customer} — {tx.amount}
                  </div>

                  <div className="search-location">
                    {tx.location} | {tx.status} | {tx.date}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <NotificationBell />

        <div className="admin-info">
          <div className="admin-avatar">
            <i className="fa-solid fa-user"></i>
          </div>

          <div className="admin-text">
            <div className="admin-name">Admin User</div>
            <div className="admin-role">Security Analyst</div>
          </div>
        </div>
      </div>
    </div>
  );
}