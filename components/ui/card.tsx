"use client";

import { clsx } from "clsx";
import { forwardRef, type HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "soft";
  padding?: "none" | "sm" | "md" | "lg";
}

const variants = {
  default: "bg-white border border-[#edf0ec] shadow-sm",
  elevated: "bg-white border border-[#edf0ec] shadow-lg",
  outlined: "bg-white border-2 border-[#edf0ec]",
  soft: "bg-[#f7f8f6] border border-transparent",
};

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = "default", padding = "md", children, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "rounded-2xl transition-shadow duration-200",
          variants[variant],
          paddings[padding],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={clsx("mb-4", className)} {...props}>
      {children}
    </div>
  );
});

CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={clsx("text-lg font-semibold text-[#111111]", className)}
      {...props}
    >
      {children}
    </h3>
  );
});

CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={clsx("mt-1 text-sm text-[#8d9890]", className)}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={clsx(className)} {...props}>
      {children}
    </div>
  );
});

CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx("mt-4 pt-4 border-t border-[#edf0ec]", className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = "CardFooter";
