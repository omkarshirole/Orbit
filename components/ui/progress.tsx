"use client";

import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

const sizes = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
};

const variantColors = {
  default: "bg-green-600",
  success: "bg-green-600",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
};

export function Progress({ className, value, max = 100, size = "md", showLabel, label, variant = "default", ...props }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={clsx("w-full", className)} {...props}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-[#1f2420]">{label || `${Math.round(percentage)}%`}</span>
          {showLabel && <span className="text-xs text-[#8d9890]">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={clsx("w-full rounded-full bg-[#edf0ec] overflow-hidden", sizes[size])}>
        <div
          className={clsx(
            "h-full rounded-full transition-all duration-300 ease-out",
            variantColors[variant]
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
        />
      </div>
    </div>
  );
}

export interface CircularProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  variant?: "default" | "success" | "warning" | "danger";
  children?: React.ReactNode;
}

const variantStrokeColors = {
  default: "stroke-green-600",
  success: "stroke-green-600",
  warning: "stroke-amber-500",
  danger: "stroke-red-500",
};

export function CircularProgress({
  className,
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  showValue = true,
  variant = "default",
  children,
  ...props
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={clsx("relative inline-flex items-center justify-center", className)} {...props}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="stroke-[#edf0ec]"
          strokeWidth={strokeWidth}
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={clsx(
            "stroke-linecap-round transition-all duration-500 ease-out",
            variantStrokeColors[variant]
          )}
          strokeWidth={strokeWidth}
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ strokeDasharray: circumference, strokeDashoffset }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {showValue && (
          <span className="text-2xl font-bold text-[#111111]">{Math.round(percentage)}%</span>
        )}
        {!showValue && children}
      </div>
    </div>
  );
}