import React from "react";

export default function Button({ type = "button", className = "", ...props }) {
  return (
    <button
      type={type}
      className={`px-4 py-2 bg-primary text-white rounded hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
      {...props}
    />
  );
}
