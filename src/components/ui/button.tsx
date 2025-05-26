import React from "react";

export function Button({
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold ${className}`}
      {...props}
    />
  );
}
