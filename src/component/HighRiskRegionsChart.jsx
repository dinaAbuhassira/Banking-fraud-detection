import { useEffect, useState } from "react";

const colors = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#3b82f6",
  "#22c55e",
  "#8b5cf6",
];

export default function HighRiskRegionsChart() {
  const [hovered, setHovered] = useState(null);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/alerts")
      .then((res) => res.json())
      .then((data) => {
        const grouped = {};

        data.forEach((alert) => {
          const region = alert.location || "Unknown";
          grouped[region] = (grouped[region] || 0) + 1;
        });

        const result = Object.entries(grouped).map(
          ([region, incidents], index) => ({
            region,
            incidents,
            color: colors[index % colors.length],
          })
        );

        setRegions(result);
      })
      .catch(() => setRegions([]));
  }, []);

  const maxVal = Math.max(
    1,
    ...regions.map((r) => r.incidents)
  );

  const H = 180;
  const PAD_B = 28;
  const PAD_L = 44;
  const PAD_T = 16;
  const PAD_R = 16;

  const IH = H - PAD_B - PAD_T;
  const barW = 36;

  const totalW =
    Math.max(regions.length, 1) * (barW + 24) +
    PAD_L +
    PAD_R;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(
    (ratio) => ({
      val: Math.round(maxVal * ratio),
      y: PAD_T + IH - ratio * IH,
    })
  );

  return (
    <div className="report-card report-card-full">
      <div className="report-card-header">
        <div className="report-card-title">
          <i className="fa-solid fa-earth-americas"></i>
          High Risk Geographic Locations
        </div>

        <span className="report-subtitle">
          Fraud alerts by location
        </span>
      </div>

      {regions.length === 0 ? (
        <div style={{ padding: "40px", color: "#94a3b8" }}>
          No fraud alert locations available
        </div>
      ) : (
        <>
          <div className="bar-scroll chart-left">
            <svg
              viewBox={`0 0 ${totalW} ${H}`}
              className="bar-svg"
            >
              {yTicks.map((t, index) => (
                <g key={`tick-${index}`}>
                  <line
                    x1={PAD_L}
                    y1={t.y}
                    x2={totalW - PAD_R}
                    y2={t.y}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />

                  <text
                    x={PAD_L - 6}
                    y={t.y + 4}
                    fontSize="9"
                    fill="#94a3b8"
                    textAnchor="end"
                  >
                    {t.val}
                  </text>
                </g>
              ))}

              {regions.map((r, index) => {
                const barH = (r.incidents / maxVal) * IH;
                const x =
                  PAD_L + index * (barW + 24) + 12;
                const y = PAD_T + IH - barH;
                const isHov = hovered === index;

                return (
                  <g
                    key={`bar-${r.region}-${index}`}
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <rect
                      x={x}
                      y={y}
                      width={barW}
                      height={barH}
                      fill={r.color}
                      rx="5"
                      opacity={
                        hovered === null || isHov ? 1 : 0.5
                      }
                    />

                    {isHov && (
                      <text
                        x={x + barW / 2}
                        y={y - 6}
                        textAnchor="middle"
                        fontSize="10"
                        fill={r.color}
                        fontWeight="700"
                      >
                        {r.incidents}
                      </text>
                    )}

                    <text
                      x={x + barW / 2}
                      y={H - 6}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#94a3b8"
                    >
                      {r.region}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="region-list">
            {regions.map((r, index) => (
              <div
                key={`region-${r.region}-${index}`}
                className={`region-item${
                  hovered === index ? " active" : ""
                }`}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                <span
                  className="legend-dot"
                  style={{ background: r.color }}
                ></span>

                <span className="region-name">
                  {r.region}
                </span>

                <div className="region-bar-wrap">
                  <div
                    className="region-bar-fill"
                    style={{
                      width: `${
                        (r.incidents / maxVal) * 100
                      }%`,
                      background: r.color,
                    }}
                  ></div>
                </div>

                <span
                  className="region-val"
                  style={{ color: r.color }}
                >
                  {r.incidents}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}