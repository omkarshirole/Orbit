"use client";

import { clsx } from "clsx";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, helperText, leftIcon, rightIcon, id, ...props },
    ref,
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#1f2420] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d9890] pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              "w-full rounded-xl border bg-white text-[#111111] placeholder-[#8d9890] transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500",
              "disabled:bg-[#f7f8f6] disabled:cursor-not-allowed",
              leftIcon ? "pl-10" : "pl-4",
              rightIcon ? "pr-10" : "pr-4",
              "py-2.5 text-sm",
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/30"
                : "border-[#edf0ec] hover:border-green-200",
              className,
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d9890] pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-[#8d9890]">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#1f2420] mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={clsx(
            "w-full rounded-xl border bg-white text-[#111111] placeholder-[#8d9890] transition-all duration-200 resize-none",
            "focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500",
            "disabled:bg-[#f7f8f6] disabled:cursor-not-allowed",
            "p-4 text-sm",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/30"
              : "border-[#edf0ec] hover:border-green-200",
            className,
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-[#8d9890]">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
