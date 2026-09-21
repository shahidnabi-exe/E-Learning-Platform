import React from "react";
import { FolderOpen } from "lucide-react";

export default function EmptyState({
  icon: Icon = FolderOpen,
  title = "No items found",
  description = "There is nothing to display here yet.",
  actionLabel,
  onAction,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3.5rem 1.5rem",
        textAlign: "center",
        background: "var(--surface-card)",
        borderRadius: "var(--radius-lg)",
        border: "1px dashed var(--surface-border)",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "var(--radius-pill)",
          background: "var(--gold-dim)",
          color: "var(--gold-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <Icon size={28} />
      </div>

      <h3 style={{ fontSize: "1.15rem", marginBottom: "0.4rem", color: "var(--text-primary)" }}>
        {title}
      </h3>
      <p style={{ maxWidth: "420px", color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: actionLabel ? "1.25rem" : "0" }}>
        {description}
      </p>

      {actionLabel && onAction && (
        <button className="btn-primary btn-sm" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

