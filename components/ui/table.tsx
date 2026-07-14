"use client";

import { clsx } from "clsx";
import {
  forwardRef,
  type HTMLAttributes,
  type TableHTMLAttributes,
} from "react";

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  variant?: "default" | "striped" | "bordered";
  size?: "sm" | "md" | "lg";
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  (
    { className, variant = "default", size = "md", children, ...props },
    ref,
  ) => {
    return (
      <div className="overflow-x-auto rounded-xl border border-[#edf0ec] bg-white">
        <table
          ref={ref}
          className={clsx(
            "w-full",
            size === "sm" && "text-xs",
            size === "lg" && "text-base",
            className,
          )}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  },
);

Table.displayName = "Table";

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => {
  return (
    <thead ref={ref} className={clsx("bg-[#f7f8f6]", className)} {...props}>
      {children}
    </thead>
  );
});

TableHeader.displayName = "TableHeader";

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => {
  return (
    <tbody
      ref={ref}
      className={clsx("divide-y divide-[#edf0ec]", className)}
      {...props}
    >
      {children}
    </tbody>
  );
});

TableBody.displayName = "TableBody";

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  variant?: "default" | "striped";
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={clsx(
          "transition-colors duration-150",
          variant === "default" && "hover:bg-[#f7f8f6]",
          variant === "striped" && "even:bg-[#f7f8f6]",
          className,
        )}
        {...props}
      >
        {children}
      </tr>
    );
  },
);

TableRow.displayName = "TableRow";

export const TableHead = forwardRef<
  HTMLTableCellElement,
  HTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => {
  return (
    <th
      ref={ref}
      className={clsx(
        "px-4 py-3 text-left font-semibold text-[#1f2420] text-sm uppercase tracking-wider text-[#8d9890]",
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
});

TableHead.displayName = "TableHead";

export interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  variant?: "default" | "muted" | "right" | "center";
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={clsx(
          "px-4 py-3 text-sm text-[#111111]",
          variant === "default" && "",
          variant === "muted" && "text-[#8d9890]",
          variant === "right" && "text-right",
          variant === "center" && "text-center",
          className,
        )}
        {...props}
      >
        {children}
      </td>
    );
  },
);

TableCell.displayName = "TableCell";

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  HTMLAttributes<HTMLTableCaptionElement>
>(({ className, children, ...props }, ref) => {
  return (
    <caption
      ref={ref}
      className={clsx("px-4 py-3 text-sm text-[#8d9890]", className)}
      {...props}
    >
      {children}
    </caption>
  );
});

TableCaption.displayName = "TableCaption";
