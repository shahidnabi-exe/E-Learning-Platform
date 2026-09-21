import React from "react";

export default function StatCard({ title, value, icon: Icon, subtitle, trend, color = "gold" }) {
  const iconBg = color === "gold" ? "var(--gold-dim)" : "rgba(255, 255, 255, 0.06)";
  const iconColor = color === "gold" ? "var(--gold-primary)" : "var(--text-primary)";

  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--text-secondary)",
            }}
          >
            {title}
          </span>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginTop: "4px",
              lineHeight: 1.1,
            }}
          >
            {value}
          </div>
        </div>

        {Icon && (
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-md)",
              background: iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: iconColor,
              flexShrink: 0,
            }}
          >
            <Icon size={22} />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem" }}>
          {trend && (
            <span
              style={{
                color: trend > 0 ? "var(--status-success)" : "var(--text-secondary)",
                fontWeight: 600,
              }}
            >
              {trend > 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
          {subtitle && <span style={{ color: "var(--text-muted)" }}>{subtitle}</span>}
        </div>
      )}
    </div>
  );
}

