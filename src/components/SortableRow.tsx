import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { X, ArrowUpAZ, ArrowDownAZ, ArrowUpWideNarrow, ArrowDownWideNarrow, GripVertical } from "lucide-react";
import type{ SortCriterion, SortDirection, SortField } from "../types/client";

const FIELD_LABEL: Record<SortField, string> = {
  name: "Client Name",
  email: "Email",
  createdAt: "Created At",
  updatedAt: "Updated At",
  id: "Client ID",
  status: "Status",
};

export function SortableRow({ criterion, onRemove, onToggle }: {
  criterion: SortCriterion;
  onRemove: (id: string) => void;
  onToggle: (id: string, dir: SortDirection) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: criterion.id });
  
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const isAlpha = criterion.field === "name" || criterion.field === "email" || criterion.field === "status";
  const AscIcon = isAlpha ? ArrowUpAZ : ArrowUpWideNarrow;
  const DescIcon = isAlpha ? ArrowDownAZ : ArrowDownWideNarrow;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className={`flex items-center justify-between gap-2 rounded-xl border bg-white px-3 py-2 shadow-sm ${isDragging ? "ring-2 ring-black/10" : ""}`}
    >
      <div className="flex items-center gap-3">
        <button className="cursor-grab active:cursor-grabbing text-muted-foreground" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="text-sm font-medium">{FIELD_LABEL[criterion.field]}</div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={criterion.direction === "asc" ? "default" : "outline"}
          size="sm"
          onClick={() => onToggle(criterion.id, "asc")}
          className="rounded-lg"
        >
          <AscIcon className="mr-1 h-4 w-4" />
          {isAlpha ? "A-Z" : "Low→High"}
        </Button>
        <Button
          variant={criterion.direction === "desc" ? "default" : "outline"}
          size="sm"
          onClick={() => onToggle(criterion.id, "desc")}
          className="rounded-lg"
        >
          <DescIcon className="mr-1 h-4 w-4" />
          {isAlpha ? "Z-A" : "High→Low"}
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onRemove(criterion.id)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}