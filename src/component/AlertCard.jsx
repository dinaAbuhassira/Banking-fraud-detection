export default function AlertCard({ alert, onBlock, onSafe }) {
  const severityConfig = {
    HIGH:   { label: "HIGH SEVERITY",   className: "alert-card high"   },
    MEDIUM: { label: "MEDIUM SEVERITY", className: "alert-card medium" },
    LOW:    { label: "LOW SEVERITY",    className: "alert-card low"    },
  };

  const config = severityConfig[alert.severity] || severityConfig.LOW;

  return (
    <div className={config.className}>
      <div className="alert-card-header">
        <div className="alert-card-title">
          <i className="fa-solid fa-triangle-exclamation"></i>
          {alert.title}
        </div>
        <span className={`severity-badge ${alert.severity.toLowerCase()}`}>
          {config.label}
        </span>
      </div>

      <div className="alert-card-info">
        <div className="alert-card-left">
          <div className="info-row">
            <i className="fa-solid fa-user"></i>
            <span>{alert.customer}</span>
          </div>
          <div className="info-row">
            <i className="fa-solid fa-location-dot"></i>
            <span>{alert.location}</span>
          </div>
        </div>
        <div className="alert-card-right">
          <div className="info-row">
            <i className="fa-regular fa-clock"></i>
            <span>{alert.time || "Just now"}</span>
          </div>
          <div className="info-row value">
            <span>Value: {alert.value}</span>
          </div>
        </div>
      </div>

      <div className="alert-card-actions">
        <button className="btn-block" onClick={() => onBlock(alert.id)}>
          Block Account
        </button>
        <button className="btn-safe" onClick={() => onSafe(alert.id)}>
          Mark as Safe
        </button>
      </div>
    </div>
  );
}