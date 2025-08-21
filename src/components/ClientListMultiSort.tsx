import  { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { SortAsc, SortDesc, Filter } from "lucide-react";
import { SortPanel } from "./SortPanel";
import { Table } from "./Table";
import type{ ClientRow, SortCriterion, SortField } from "../types/client";

const MOCK_CLIENTS: ClientRow[] = [
  { id: 20, name: "John Doe", email: "johndoe@email.com", type: "Individual", status: "Active", createdAt: "2024-10-02T09:31:00Z", updatedAt: "2025-01-12T12:05:00Z" },
  { id: 21, name: "Test Test", email: "test@test.com", type: "Individual", status: "Active", createdAt: "2025-01-03T11:25:00Z", updatedAt: "2025-01-11T08:45:00Z" },
  { id: 9, name: "Acme Corp", email: "contact@acme.com", type: "Company", status: "Inactive", createdAt: "2023-12-15T08:00:00Z", updatedAt: "2024-04-22T10:10:00Z" },
  { id: 3, name: "Blue Ocean", email: "hi@blueocean.co", type: "Company", status: "Active", createdAt: "2024-04-06T14:15:00Z", updatedAt: "2024-09-06T09:30:00Z" },
  { id: 44, name: "Karthik Kumar", email: "karthik@kk.dev", type: "Individual", status: "Active", createdAt: "2025-02-18T07:10:00Z", updatedAt: "2025-02-28T17:01:00Z" },
  { id: 7, name: "Zen Motors", email: "sales@zenmotors.com", type: "Company", status: "Inactive", createdAt: "2024-07-23T10:40:00Z", updatedAt: "2025-03-04T10:40:00Z" },
  { id: 68, name: "Alice Wonderland", email: "alice@wonder.land", type: "Individual", status: "Active", createdAt: "2025-03-01T06:30:00Z", updatedAt: "2025-03-03T06:31:00Z" },
  { id: 70, name: "Charlie Root", email: "charlie@root.io", type: "Individual", status: "Active", createdAt: "2024-11-25T13:10:00Z", updatedAt: "2024-12-05T13:30:00Z" },
  { id: 12, name: "Nimbus LLC", email: "admin@nimbus.llc", type: "Company", status: "Active", createdAt: "2023-10-09T05:00:00Z", updatedAt: "2025-01-05T10:00:00Z" },
  { id: 52, name: "Beta Labs", email: "team@betalabs.ai", type: "Company", status: "Inactive", createdAt: "2024-12-30T12:20:00Z", updatedAt: "2025-01-01T09:00:00Z" },
];

const FIELD_LABEL: Record<SortField, string> = {
  name: "Client Name",
  email: "Email",
  createdAt: "Created At",
  updatedAt: "Updated At",
  id: "Client ID",
  status: "Status",
};

// helper to parse/format values for sorting
function getFieldValue(row: ClientRow, field: SortField) {
  switch (field) {
    case "createdAt":
    case "updatedAt":
      return new Date(row[field]).getTime();
    case "id":
      return row.id;
    case "status":
      return row.status;
    default:
      return (row as any)[field] as string;
  }
}

function compareBy<T extends ClientRow>(a: T, b: T, criteria: SortCriterion[]): number {
  for (const c of criteria) {
    const va = getFieldValue(a, c.field);
    const vb = getFieldValue(b, c.field);
    let res = 0;
    if (typeof va === "number" && typeof vb === "number") {
      res = va - vb;
    } else {
      res = String(va).localeCompare(String(vb));
    }
    if (res !== 0) return c.direction === "asc" ? res : -res;
  }
  return 0;
}

export default function ClientListMultiSort() {
  const [query, setQuery] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [criteria, setCriteria] = useState<SortCriterion[]>([]);

  // Load from URL or localStorage on mount
  useEffect(() => {
    const searchParam = new URLSearchParams(window.location.search).get("sort");
    if (searchParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(searchParam));
        if (Array.isArray(parsed)) setCriteria(parsed);
      } catch {}
      return;
    }
    const saved = localStorage.getItem("client-sort");
    if (saved) {
      try { setCriteria(JSON.parse(saved)); } catch {}
    }
  }, []);

  // Persist to both URL and localStorage
  useEffect(() => {
    const encoded = encodeURIComponent(JSON.stringify(criteria));
    const url = new URL(window.location.href);
    if (criteria.length) url.searchParams.set("sort", encoded); else url.searchParams.delete("sort");
    window.history.replaceState({}, "", url.toString());
    localStorage.setItem("client-sort", JSON.stringify(criteria));
  }, [criteria]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = MOCK_CLIENTS.filter((r) =>
      !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || String(r.id).includes(q)
    );

    if (criteria.length) {
      rows = [...rows].sort((a, b) => compareBy(a, b, criteria));
    }
    return rows;
  }, [query, criteria]);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <Card className="rounded-2xl border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl">Clients</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input placeholder="Search by name, email, id…" value={query} onChange={(e) => setQuery(e.target.value)} className="w-72 rounded-xl" />
            </div>
            <Button variant="outline" onClick={() => setPanelOpen((v) => !v)} className="rounded-xl">
              <Filter className="mr-2 h-4 w-4" /> Sort
            </Button>
            <Button className="rounded-xl">+ Add Client</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Table rows={filtered} />
            <SortPanel open={panelOpen} onClose={() => setPanelOpen(false)} active={criteria} onChange={setCriteria} />
          </div>

          {criteria.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {criteria.map((c, idx) => (
                <Badge key={c.id} variant="secondary" className="flex items-center gap-1 rounded-full px-3 py-1">
                  <span className="text-xs text-muted-foreground">{idx + 1}</span>
                  {FIELD_LABEL[c.field]}
                  {c.direction === "asc" ? (
                    <SortAsc className="ml-1 h-3 w-3" />
                  ) : (
                    <SortDesc className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}