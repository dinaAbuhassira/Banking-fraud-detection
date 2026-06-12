import { useEffect } from "react";

export default function AlertToast({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div className={`toast-item ${toast.severity.toLowerCase()}`}>
      <div className="toast-header">
        <span className="toast-icon">
          {toast.severity === "HIGH" ? "🚨" : toast.severity === "MEDIUM" ? "⚠️" : "🔔"}
        </span>
        <span className="toast-title">{toast.title}</span>
        <button className="toast-close" onClick={() => onRemove(toast.id)}>×</button>
      </div>
      <div className="toast-body">
        <div>Amount: <strong>{toast.value}</strong></div>
        <div>Location: <strong>{toast.location}</strong></div>
      </div>
    </div>
  );
}