"use client";

import { clsx } from "clsx";
import { forwardRef, type HTMLAttributes, useState, isValidElement, cloneElement, type ReactElement } from "react";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  shape?: "circle" | "square";
}

const sizes = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
  xl: "h-16 w-16 text-xl",
  "2xl": "h-20 w-20 text-2xl",
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", shape = "circle", ...props }, ref) => {
    const [imageError, setImageError] = useState(false);

    const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    const fallbackContent = fallback || (alt ? getInitials(alt) : "?");

    return (
      <div
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center overflow-hidden bg-[#edf0ec] flex-shrink-0",
          sizes[size],
          shape === "circle" ? "rounded-full" : "rounded-xl",
          className
        )}
        {...props}
      >
        {src && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt || ""}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-medium text-[#8d9890]">{fallbackContent}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: AvatarProps["size"];
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max = 4, size = "md", children, ...props }, ref) => {
    const childArray = Array.isArray(children) ? children : [children];
    const visibleChildren = childArray.slice(0, max);
    const remainingCount = childArray.length - max;

    return (
      <div
        ref={ref}
        className={clsx("flex -space-x-2", className)}
        {...props}
      >
        {visibleChildren.map((child, index) =>
          isValidElement<AvatarProps>(child) ? (
            cloneElement(child, {
              key: index,
              size,
              className: clsx("ring-2 ring-white border-0", child.props.className),
            })
          ) : (
            child
          )
        )}
        {remainingCount > 0 && (
          <div
            className={clsx(
              "inline-flex items-center justify-center overflow-hidden bg-green-100 text-green-700 font-medium ring-2 ring-white border-0",
              sizes[size],
              "rounded-full"
            )}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";