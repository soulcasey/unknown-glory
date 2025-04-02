import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${className}`} {...props}>
      {children}
    </button>
  );
}