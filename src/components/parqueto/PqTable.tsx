import * as React from "react";
import { cn } from "@/lib/utils";

export interface PqTableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}

export interface PqTableProps<T> {
  columns: PqTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: React.ReactNode;
  className?: string;
}

export function PqTable<T>({ columns, rows, rowKey, empty, className }: PqTableProps<T>) {
  const alignClass = (a?: "left" | "right" | "center") =>
    a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left";

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card shadow-soft", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th key={String(c.key)} className={cn("px-4 py-3 font-medium", alignClass(c.align), c.className)}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={rowKey(row)} className="transition hover:bg-muted/30">
                {columns.map((c) => (
                  <td key={String(c.key)} className={cn("px-4 py-3 text-foreground", alignClass(c.align), c.className)}>
                    {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key as string] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  {empty ?? "Aucun résultat."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
