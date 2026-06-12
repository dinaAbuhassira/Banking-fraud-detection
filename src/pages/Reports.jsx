import { useEffect, useState } from "react";
import FraudTrendChart from "../component/FraudTrendChart";
import FraudTypeChart from "../component/FraudTypeChart";
import HighRiskRegionsChart from "../component/HighRiskRegionsChart";
import "../styles/reports.css";

export default function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch(() => setTransactions([]));

    fetch("http://127.0.0.1:5000/alerts")
      .then((res) => res.json())
      .then((data) => setAlerts(data))
      .catch(() => setAlerts([]));
  }, []);

  const totalTransactions = transactions.length;
  const fraudAlerts = alerts.length;

  const totalFraudAmount = alerts.reduce((sum, alert) => {
    const amount = Number(String(alert.amount).replace("$", ""));
    return sum + amount;
  }, 0);

  const safeTransactions = transactions.filter(
    (tx) => tx.status === "SAFE"
  ).length;

  const accuracy =
    totalTransactions > 0
      ? ((safeTransactions + fraudAlerts) / totalTransactions) * 100
      : 0;

  const avgRiskScore =
    alerts.length > 0
      ? alerts.reduce((sum, a) => sum + Number(a.riskScore), 0) /
        alerts.length
      : 0;

  return (
    <div className="content">
      <div className="reports-stats">
        <div className="report-stat-card">
          <i className="fa-solid fa-shield-halved stat-ico blue"></i>
          <div>
            <div className="stat-s-val">{fraudAlerts}</div>
            <div className="stat-s-lbl">Fraud Alerts Detected</div>
          </div>
        </div>

        <div className="report-stat-card">
          <i className="fa-solid fa-ban stat-ico red"></i>
          <div>
            <div className="stat-s-val">
              ${totalFraudAmount.toLocaleString()}
            </div>
            <div className="stat-s-lbl">Prevented Losses</div>
          </div>
        </div>

        <div className="report-stat-card">
          <i className="fa-solid fa-circle-check stat-ico green"></i>
          <div>
            <div className="stat-s-val">{accuracy.toFixed(1)}%</div>
            <div className="stat-s-lbl">AI Detection Accuracy</div>
          </div>
        </div>

        <div className="report-stat-card">
          <i className="fa-solid fa-chart-line stat-ico orange"></i>
          <div>
            <div className="stat-s-val">{avgRiskScore.toFixed(1)}%</div>
            <div className="stat-s-lbl">Average Risk Score</div>
          </div>
        </div>
      </div>

      <div className="reports-grid">
        <FraudTrendChart />
        <FraudTypeChart />
      </div>

      <HighRiskRegionsChart />
    </div>
  );
}