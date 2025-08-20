import React from "react";

export default function Input({ type = "text", className = "", ...props }) {
  const baseClasses =
    type === "checkbox"
      ? "mr-2 focus:ring-2 focus:ring-accent"
      : "w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <input
      type={type}
      className={`${baseClasses} ${className}`}
      {...props}
    />
  );
}
