import { DndContext } from "@dnd-kit/core";
import type{ DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";
import { X, ChevronsUp } from "lucide-react";
import { useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Button } from "./ui/button";
import { SortableRow } from "./SortableRow";
import type { SortCriterion, SortDirection, SortField } from "../types/client";

const AVAILABLE_FIELDS = ["name", "createdAt", "updatedAt", "email", "id", "status"] as const;

const FIELD_LABEL: Record<SortField, string> = {
  name: "Client Name",
  email: "Email",
  createdAt: "Created At",
  updatedAt: "Updated At",
  id: "Client ID",
  status: "Status",
};

export function SortPanel({
  open,
  onClose,
  active,
  onChange,
}: {
  open: boolean;
  onClose: () => void;
  active: SortCriterion[];
  onChange: (next: SortCriterion[]) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const usedFields = new Set(active.map((a) => a.field));


  const available = AVAILABLE_FIELDS.filter((f) => !usedFields.has(f));

  function addField(field: SortField) {
    const id = `${field}-${crypto.randomUUID()}`;
    onChange([
      ...active,
      {
        id,
        field,
        direction: field === "createdAt" || field === "updatedAt" ? "desc" : "asc",
      },
    ]);
  }

  function removeField(id: string) {
    onChange(active.filter((a) => a.id !== id));
  }

  function toggleDir(id: string, dir: SortDirection) {
    onChange(active.map((a) => (a.id === id ? { ...a, direction: dir } : a)));
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active: a, over } = e;
    if (!over || a.id === over.id) return;
    const oldIndex = active.findIndex((x) => x.id === a.id);
    const newIndex = active.findIndex((x) => x.id === over.id);
    onChange(arrayMove(active, oldIndex, newIndex));
  }

  if (!open) return null;

  return (
    <div className="absolute right-6 top-16 z-50 w-[520px] rounded-2xl border bg-white p-4 shadow-2xl">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-lg font-semibold">Sort By</div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={active.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            <AnimatePresence>
              {active.map((a) => (
                <SortableRow key={a.id} criterion={a} onRemove={removeField} onToggle={toggleDir} />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-4 text-sm text-muted-foreground">Add fields</div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {available.length === 0 ? (
          <div className="col-span-2 text-sm text-muted-foreground">All fields added.</div>
        ) : (
          available.map((f) => (
            <Button
              key={f}
              variant="outline"
              onClick={() => addField(f as SortField)} 
              className="justify-start rounded-xl"
            >
              <ChevronsUp className="mr-2 h-4 w-4" />
              {FIELD_LABEL[f as SortField]}
            </Button>
          ))
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => onChange([])}>
          Clear all
        </Button>
        <Button onClick={onClose} className="rounded-xl">
          Apply Sort
        </Button>
      </div>
    </div>
  );
}
