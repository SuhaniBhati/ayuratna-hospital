// src/components/Chart.jsx
import React from "react";

/**
 * Lightweight, dependency-free SVG chart for high-contrast visibility.
 * Props:
 * - type: "line" | "bar"
 * - data: number[]
 * - labels: string[]
 * - options: {
 *     stroke?: string, fill?: string, barColor?: string,
 *     gridColor?: string, axisColor?: string, showGrid?: boolean,
 *     padding?: number, showBarLabels?: boolean
 *   }
 * - height?: number
 * - yMax?: number  // optional: pin top of y-scale (e.g., 100 for percentages)
 * - yMin?: number  // optional: pin bottom of y-scale (e.g., 0)
 */
const Chart = ({
  type = "line",
  data = [],
  labels = [],
  options = {},
  height = 260,
  yMax,
  yMin,
}) => {
  // Slightly taller default to give axes/labels breathing room
  const W = 640; // virtual width; container scales via CSS
  const H = height; // virtual height

  // Bump default padding so axis labels never clip
  const padding = Math.max(32, options.padding ?? 32);
  const innerW = Math.max(1, W - padding * 2);
  const innerH = Math.max(1, H - padding * 2);

  // Determine vertical scale with optional pinned bounds
  const maxDataVal = Math.max(1, ...data);
  const minDataVal = Math.min(0, ...data);
  const maxVal = typeof yMax === "number" ? yMax : maxDataVal;
  const minVal = typeof yMin === "number" ? yMin : minDataVal;
  const range = Math.max(1e-6, maxVal - minVal);

  const xStep = data.length > 1 ? innerW / (data.length - 1) : innerW;

  const toX = (i) => padding + i * xStep;
  const toY = (v) => padding + innerH - ((v - minVal) / range) * innerH;

  const stroke = options.stroke ?? "#1e7a6d";
  const fill = options.fill ?? "rgba(30,122,109,0.15)";
  const barColor = options.barColor ?? "#6c412f";
  const gridColor = options.gridColor ?? "rgba(108,65,47,0.2)";
  const axisColor = options.axisColor ?? "rgba(108,65,47,0.6)";
  const showGrid = options.showGrid ?? true;
  const showBarLabels = options.showBarLabels ?? false;

  // Build line path
  let d = "";
  data.forEach((v, i) => {
    const x = toX(i);
    const y = toY(v);
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  });

  // Area under the line
  const areaD =
    d +
    (data.length
      ? ` L ${toX(data.length - 1)} ${padding + innerH} L ${toX(0)} ${
          padding + innerH
        } Z`
      : "");

  // Grid lines (5 horizontal)
  const gridLines = 5;
  const gridYs = Array.from({ length: gridLines + 1 }, (_, i) => {
    const y = padding + (innerH * i) / gridLines;
    return y;
  });

  // Bar sizing: keep a comfortable min width and proportional spacing
  const barCount = data.length;
  const baseBand = barCount > 0 ? innerW / barCount : innerW;
  const bw = Math.max(16, Math.min(44, baseBand * 0.6)); // min 16px, max 44px, ~60% of band
  const xCenters =
    type === "bar"
      ? Array.from({ length: barCount }, (_, i) => padding + baseBand * i + baseBand / 2)
      : data.map((_, i) => toX(i));

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {/* Grid */}
        {showGrid &&
          gridYs.map((y, idx) => (
            <line
              key={idx}
              x1={padding}
              y1={y}
              x2={W - padding}
              y2={y}
              stroke={gridColor}
              strokeWidth="1"
            />
          ))}

        {/* Axes */}
        <line
          x1={padding}
          y1={padding + innerH}
          x2={W - padding}
          y2={padding + innerH}
          stroke={axisColor}
          strokeWidth="1.5"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={padding + innerH}
          stroke={axisColor}
          strokeWidth="1.5"
        />

        {/* Bars or line */}
        {type === "bar" ? (
          <>
            {data.map((v, i) => {
              const xCenter = xCenters[i];
              const x = xCenter - bw / 2;
              const y = toY(v);
              const bh = Math.max(0, padding + innerH - y);
              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={y}
                    width={bw}
                    height={bh}
                    fill={barColor}
                    rx="4"
                  />
                  {showBarLabels && (
                    <text
                      x={xCenter}
                      y={y - 8}
                      textAnchor="middle"
                      fontSize="11"
                      fill="rgba(108,65,47,0.9)"
                    >
                      {v}
                    </text>
                  )}
                </g>
              );
            })}
          </>
        ) : (
          <>
            <path d={areaD} fill={fill} stroke="none" />
            <path
              d={d}
              fill="none"
              stroke={stroke}
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {data.map((v, i) => {
              const x = toX(i);
              const y = toY(v);
              return <circle key={i} cx={x} cy={y} r="3.5" fill={stroke} />;
            })}
          </>
        )}

        {/* Labels (x-axis) */}
        {labels.map((lbl, i) => {
          const x = type === "bar" ? xCenters[i] : toX(i);
          const y = padding + innerH + 18; // a bit more spacing below axis
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize="11"
              fill="rgba(108,65,47,0.8)"
            >
              {lbl}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default Chart;



