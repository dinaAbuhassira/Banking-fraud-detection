import { useEffect, useState } from "react";
import AlertCard from "../component/AlertCard";
import "../styles/fraudAlerts.css";

export default function FraudAlerts() {
  const [alerts, setAlerts] = useState([]);

  async function fetchAlerts() {
    try {
      const response = await fetch("http://127.0.0.1:5000/alerts");
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      alert("Backend is not running. Please run: python app.py");
    }
  }

  useEffect(() => {
    fetchAlerts();
  }, []);

  async function deleteAlert(id) {
    try {
      const response = await fetch(`http://127.0.0.1:5000/alerts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Delete failed from backend");
        return;
      }

      setAlerts((prev) => prev.filter((a) => a.id !== id));
      alert("Alert removed successfully");
    } catch (error) {
      alert("Could not connect to backend");
    }
  }
  async function markSafe(id) {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/alerts/${id}/safe`,
      {
        method: "PUT",
      }
    );

    if (!response.ok) {
      alert("Operation failed");
      return;
    }

    setAlerts((prev) => prev.filter((a) => a.id !== id));

    alert("Transaction marked as SAFE");
  } catch {
    alert("Could not connect to backend");
  }
}
async function blockTransaction(id) {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/alerts/${id}/block`,
      { method: "PUT" }
    );

    if (!response.ok) {
      alert("Block failed");
      return;
    }

    setAlerts((prev) => prev.filter((a) => a.id !== id));
    alert("Transaction blocked successfully");
  } catch {
    alert("Could not connect to backend");
  }
}
function handleBlock(id) {
  blockTransaction(id);
}
function handleSafe(id) {
  markSafe(id);
}

  const sorted = [...alerts].sort((a, b) => {
    const order = {
      HIGH: 0,
      MEDIUM: 1,
      LOW: 2,
    };

    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="content">
      <div className="alerts-list">
        {sorted.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onBlock={handleBlock}
            onSafe={handleSafe}
          />
        ))}
      </div>
    </div>
  );
}