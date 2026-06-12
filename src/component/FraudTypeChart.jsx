import { useEffect, useState } from "react";

const CX = 130, CY = 130, R = 100, GAP = 0.02;

function buildSlices(data) {
  const total = data.reduce((s, d) => s + d.value, 0);

  if (total === 0) return [];

  let angle = -Math.PI / 2;

  return data.map(d => {
    const sweep =
      (d.value / total) *
      (Math.PI * 2 - GAP * data.length);

    const start = angle + GAP / 2;
    const end = start + sweep;

    angle = end + GAP / 2;

    const x1 = CX + R * Math.cos(start);
    const y1 = CY + R * Math.sin(start);
    const x2 = CX + R * Math.cos(end);
    const y2 = CY + R * Math.sin(end);

    const large = sweep > Math.PI ? 1 : 0;

    return {
      ...d,
      path: `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`,
      pct: Math.round((d.value / total) * 100),
    };
  });
}

export default function FraudTypeChart() {
  const [hovered, setHovered] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/transactions")
      .then(res => res.json())
      .then(data => {
        const fraudCount = data.filter(
          tx => tx.status === "FRAUD"
        ).length;

        const safeCount = data.filter(
          tx => tx.status === "SAFE"
        ).length;

        setChartData([
          {
            label: "Fraud Transactions",
            value: fraudCount,
            color: "#ef4444",
          },
          {
            label: "Safe Transactions",
            value: safeCount,
            color: "#22c55e",
          },
        ]);
      })
      .catch(() => setChartData([]));
  }, []);

  const total = chartData.reduce((s, d) => s + d.value, 0);
  const slices = buildSlices(chartData);

  return (
    <div className="report-card">
      <div className="report-card-header">
        <div className="report-card-title">
          <i className="fa-solid fa-chart-pie"></i>
          Fraud Types Distribution
        </div>
        <span className="report-subtitle">From database</span>
      </div>

      <div className="pie-wrapper">
        <svg viewBox="0 0 260 260" className="pie-svg">
          {slices.map((s, i) => (
            <path
              key={s.label}
              d={s.path}
              fill={s.color}
              opacity={
                hovered === null || hovered === i ? 1 : 0.45
              }
              style={{
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}

          <circle cx={CX} cy={CY} r="52" fill="white" />

          <text
            x={CX}
            y={CY - 6}
            textAnchor="middle"
            fontSize="11"
            fill="#64748b"
          >
            Total
          </text>

          <text
            x={CX}
            y={CY + 12}
            textAnchor="middle"
            fontSize="17"
            fontWeight="700"
            fill="#0f172a"
          >
            {total}
          </text>
        </svg>

        <div className="pie-legend">
          {slices.map((s, i) => (
            <div
              key={s.label}
              className={`pie-legend-item${
                hovered === i ? " active" : ""
              }`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span
                className="legend-dot"
                style={{ background: s.color }}
              ></span>

              <span className="pie-legend-label">
                {s.label}
              </span>

              <span
                className="pie-legend-pct"
                style={{ color: s.color }}
              >
                {s.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}