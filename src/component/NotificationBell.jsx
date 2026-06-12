import { useEffect, useState } from "react";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);

  async function fetchAlerts() {
    try {
      const response = await fetch("http://127.0.0.1:5000/alerts");
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      setAlerts([]);
    }
  }

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="notif-wrapper">
      <div
        className={`notif-btn ${alerts.length > 0 ? "bell-shake" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <i className="fa-regular fa-bell"></i>

        {alerts.length > 0 && (
          <span className="notif-badge">{alerts.length}</span>
        )}
      </div>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-dropdown-header">
            Security Alerts
          </div>

          {alerts.length === 0 ? (
            <div className="notif-empty">No new alerts</div>
          ) : (
            alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="notif-item high">
                <div className="notif-title">
                  Fraud Alert - {alert.customer}
                </div>

                <div className="notif-location">
                  {alert.amount} | {alert.location} | Risk: {alert.riskScore}%
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}