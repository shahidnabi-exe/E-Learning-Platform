import React from "react";

export default function Badge({ variant = "neutral", children, icon: Icon }) {
  const variantClass = {
    gold: "badge-gold",
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger",
    info: "badge-info",
    neutral: "badge-neutral",
  }[variant] || "badge-neutral";

  return (
    <span className={`badge ${variantClass}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}

