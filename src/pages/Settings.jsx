import { useState } from "react";
import "../styles/settings.css";

export default function Settings() {
  const [aiThreshold, setAiThreshold] = useState(75);
  const [riskLevel, setRiskLevel] = useState("Standard");
  const [browserAlerts, setBrowserAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    localStorage.setItem(
      "fraudSettings",
      JSON.stringify({
        aiThreshold,
        riskLevel,
        browserAlerts,
      })
    );

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    setAiThreshold(75);
    setRiskLevel("Standard");
    setBrowserAlerts(true);
  }

  return (
    <div className="content">
      {saved && (
        <div className="settings-toast">
          <i className="fa-solid fa-circle-check"></i>
          Settings saved successfully!
        </div>
      )}

      <div className="settings-card">
        <div className="settings-section-title">
          <i className="fa-solid fa-gear"></i>
          System Settings
        </div>

        <div className="settings-field">
          <label className="field-label">Risk Sensitivity Level</label>
          <p className="field-desc">
            Choose how strict the fraud detection system should be.
          </p>

          <select
            className="field-select"
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
          >
            <option>Low</option>
            <option>Standard</option>
            <option>High</option>
          </select>
        </div>

        <div className="settings-divider" />

        <div className="settings-field">
          <div className="field-label-row">
            <label className="field-label">
              AI Detection Threshold
            </label>
            <span className="threshold-value">{aiThreshold}%</span>
          </div>

          <p className="field-desc">
            Minimum confidence required before generating a fraud alert.
          </p>

          <input
            type="range"
            className="field-slider"
            min="50"
            max="100"
            value={aiThreshold}
            onChange={(e) => setAiThreshold(Number(e.target.value))}
          />

          <div className="slider-labels">
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="settings-divider" />

        <div className="notif-row">
          <div className="notif-row-left">
            <div className="notif-icon-wrap">
              <i className="fa-regular fa-bell"></i>
            </div>

            <div>
              <div className="notif-label">Browser Alerts</div>
              <div className="notif-desc">
                Show real-time fraud alerts inside the dashboard.
              </div>
            </div>
          </div>

          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={browserAlerts}
              onChange={() => setBrowserAlerts((v) => !v)}
            />
            <span className="toggle-track">
              <span className="toggle-thumb"></span>
            </span>
          </label>
        </div>
      </div>


      <div className="settings-actions">
        <button className="btn-reset" onClick={handleReset}>
          <i className="fa-solid fa-rotate-left"></i>
          Reset
        </button>

        <button className="btn-save" onClick={handleSave}>
          <i className="fa-solid fa-floppy-disk"></i>
          Save Settings
        </button>
      </div>
    </div>
  );
}
 
