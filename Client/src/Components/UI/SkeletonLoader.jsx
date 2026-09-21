import React from "react";

export default function SkeletonLoader({ count = 3, height = "120px", type = "card" }) {
  if (type === "card-grid") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem", width: "100%" }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="skeleton" style={{ width: "100%", height: "160px", borderRadius: "var(--radius-md)" }} />
            <div className="skeleton" style={{ width: "70%", height: "20px" }} />
            <div className="skeleton" style={{ width: "40%", height: "14px" }} />
            <div className="skeleton" style={{ width: "100%", height: "36px", marginTop: "0.5rem" }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ width: "100%", height, borderRadius: "var(--radius-md)" }}
        />
      ))}
    </div>
  );
}

