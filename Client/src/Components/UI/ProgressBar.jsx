import React from "react";

export default function ProgressBar({ value = 0, showLabel = true, height = 8 }) {
  const clamped = Math.min(Math.max(Math.round(value || 0), 0), 100);

  return (
    <div className="progress-container">
      {showLabel && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.8rem" }}>
          <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Progress</span>
          <span style={{ color: "var(--gold-primary)", fontWeight: 600 }}>{clamped}%</span>
        </div>
      )}
      <div className="progress-track" style={{ height: `${height}px` }}>
        <div className="progress-fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

