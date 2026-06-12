import { useEffect, useState } from "react";
import "../styles/dashboard.css";

const badgeClass = {
  BLOCKED: "badge-fraud",
  FRAUD: "badge-fraud",
  SAFE: "badge-safe",
  REVIEW: "badge-review",
};

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data.slice(0, 5)));

    fetch("http://127.0.0.1:5000/alerts")
      .then((res) => res.json())
      .then((data) => setAlerts(data.slice(0, 3)));
  }, []);

  const totalTransactions = transactions.length;
  const fraudTransactions = transactions.filter((t) => t.status === "FRAUD").length;
  const safeTransactions = transactions.filter((t) => t.status === "SAFE").length;

  const fraudRate =
    totalTransactions > 0
      ? ((fraudTransactions / totalTransactions) * 100).toFixed(1) + "%"
      : "0%";

  const stats = [
    { color: "blue", icon: "fa-solid fa-arrow-right-arrow-left", label: "Total Transactions", value: totalTransactions, change: "Stored in database", changeType: "neutral" },
    { color: "orange", icon: "fa-solid fa-triangle-exclamation", label: "Fraud Transactions", value: fraudTransactions, change: "Detected by ML", changeType: "positive" },
    { color: "green", icon: "fa-solid fa-circle-check", label: "Safe Transactions", value: safeTransactions, change: "Approved transactions", changeType: "positive" },
    { color: "yellow", icon: "fa-solid fa-chart-pie", label: "Fraud Rate", value: fraudRate, change: "Current fraud percentage", changeType: "neutral" },
  ];

  return (
    <div className="content dashboard-content">
      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon ${s.color}`}>
              <i className={s.icon}></i>
            </div>
            <div className="stat-body">
              <span className="stat-label">{s.label}</span>
              <div className="stat-value">{s.value}</div>
              <div className={`stat-change ${s.changeType}`}>{s.change}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bottom-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Transactions</span>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="tx-id">{tx.id}</td>
                    <td className="tx-customer">{tx.customer}</td>
                    <td className="tx-date">{tx.date}</td>
                    <td className="tx-amount">{tx.amount}</td>
                    <td className="tx-location">{tx.location}</td>
                    <td>
                      <span className={`badge ${badgeClass[tx.status]}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Security Alerts</span>
          </div>

          <div className="alert-list">
            {alerts.map((a) => (
              <div
                className={`alert-item ${a.severity === "HIGH" ? "high" : "med"}`}
                key={a.id}
              >
                <div className="alert-name">Fraud Alert - {a.customer}</div>

                <div className="alert-desc">
                  {a.amount} | {a.location} | Risk Score: {a.riskScore}%
                </div>

                <div className="alert-time">
                  <i className="fa-regular fa-clock"></i>
                  {a.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}