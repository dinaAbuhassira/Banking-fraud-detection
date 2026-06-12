import { useEffect, useState } from "react";

const W = 460, H = 200, PAD = { top: 20, right: 20, bottom: 30, left: 36 };
const IW = W - PAD.left - PAD.right;
const IH = H - PAD.top - PAD.bottom;

const lines = [
  { key: "total", color: "#1a56db", label: "Total Transactions" },
  { key: "fraud", color: "#dc2626", label: "Fraud Transactions" },
  { key: "safe", color: "#16a34a", label: "Safe Transactions" },
];

function buildPath(data, key, maxVal) {
  if (data.length === 1) {
    const x = PAD.left + IW / 2;
    const y = PAD.top + IH - (data[0][key] / maxVal) * IH;
    return `M ${x} ${y}`;
  }

  return data
    .map((d, i) => {
      const x = PAD.left + (i / (data.length - 1)) * IW;
      const y = PAD.top + IH - (d[key] / maxVal) * IH;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export default function FraudTrendChart() {
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/transactions")
      .then((res) => res.json())
      .then((data) => {
        const grouped = {};

        data.forEach((tx) => {
          const date = tx.date || "Unknown";

          if (!grouped[date]) {
            grouped[date] = {
              date,
              total: 0,
              fraud: 0,
              safe: 0,
            };
          }

          grouped[date].total += 1;

          if (tx.status === "FRAUD") {
            grouped[date].fraud += 1;
          }

          if (tx.status === "SAFE") {
            grouped[date].safe += 1;
          }
        });

        const result = Object.values(grouped)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(-6);

        setTrendData(result);
      })
      .catch(() => setTrendData([]));
  }, []);

  const maxVal =
    Math.max(
      1,
      ...trendData.flatMap((d) => [d.total, d.fraud, d.safe])
    ) * 1.1;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((r) => ({
    val: Math.round(maxVal * r),
    y: PAD.top + IH - r * IH,
  }));

  return (
    <div className="report-card">
      <div className="report-card-header">
        <div className="report-card-title">
          <i className="fa-solid fa-chart-line"></i>
          Fraud Detection Trends
        </div>
        <span className="report-subtitle">From database</span>
      </div>

      <div className="chart-legend">
        {lines.map((l) => (
          <div className="legend-item" key={l.key}>
            <span
              className="legend-dot"
              style={{ background: l.color }}
            ></span>
            {l.label}
          </div>
        ))}
      </div>

      {trendData.length === 0 ? (
        <div style={{ padding: "40px", color: "#94a3b8" }}>
          No transaction data available
        </div>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg">
          {yTicks.map((t) => (
            <g key={t.val}>
              <line
                x1={PAD.left}
                y1={t.y}
                x2={W - PAD.right}
                y2={t.y}
                stroke="#f1f5f9"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 6}
                y={t.y + 4}
                fontSize="10"
                fill="#94a3b8"
                textAnchor="end"
              >
                {t.val}
              </text>
            </g>
          ))}

          {trendData.map((d, i) => (
            <text
              key={d.date}
              x={
                trendData.length === 1
                  ? PAD.left + IW / 2
                  : PAD.left + (i / (trendData.length - 1)) * IW
              }
              y={H - 8}
              fontSize="10"
              fill="#94a3b8"
              textAnchor="middle"
            >
              {d.date.slice(5)}
            </text>
          ))}

          {lines.map((l) => (
            <path
              key={l.key}
              d={buildPath(trendData, l.key, maxVal)}
              fill="none"
              stroke={l.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {lines.map((l) =>
            trendData.map((d, i) => (
              <circle
                key={`${l.key}-${i}`}
                cx={
                  trendData.length === 1
                    ? PAD.left + IW / 2
                    : PAD.left + (i / (trendData.length - 1)) * IW
                }
                cy={PAD.top + IH - (d[l.key] / maxVal) * IH}
                r="4"
                fill={l.color}
                stroke="white"
                strokeWidth="2"
              />
            ))
          )}
        </svg>
      )}
    </div>
  );
}