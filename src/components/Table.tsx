// src/components/Table.tsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type{ ClientRow } from "../types/client";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">{children}</th>;
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}

export function Table({ rows }: { rows: ClientRow[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border">
      <table className="min-w-full text-sm">
        <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <Th>ID</Th>
            <Th>Client Name</Th>
            <Th>Client Type</Th>
            <Th>Email</Th>
            <Th>Status</Th>
            <Th>Created At</Th>
            <Th>Updated At</Th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {rows.map((r) => (
              <motion.tr
                key={r.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-t bg-white hover:bg-muted/30"
              >
                <Td>
                  <a className="font-medium text-blue-600 hover:underline">{r.id}</a>
                </Td>
                <Td className="font-medium">{r.name}</Td>
                <Td>{r.type}</Td>
                <Td className="text-muted-foreground">{r.email}</Td>
                <Td>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${r.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                    <span className={`h-2 w-2 rounded-full ${r.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                    {r.status}
                  </span>
                </Td>
                <Td>{formatDate(r.createdAt)}</Td>
                <Td>{formatDate(r.updatedAt)}</Td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}