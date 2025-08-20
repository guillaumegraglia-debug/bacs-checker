import React from "react";

export default function Input({ type = "text", className = "", ...props }) {
  const baseClasses =
    type === "checkbox"
      ? "mr-2 text-primary focus:ring-2 focus:ring-accent"
      : "w-full p-2 border border-secondary/30 rounded focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <input
      type={type}
      className={`${baseClasses} ${className}`}
      {...props}
    />
  );
}
