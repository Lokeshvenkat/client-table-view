export type SortField = "name" | "email" | "createdAt" | "updatedAt" | "id" | "status";

export type SortDirection = "asc" | "desc";

export interface SortCriterion {
  // unique id for DnD
  id: string;
  field: SortField;
  direction: SortDirection;
}

export interface ClientRow {
  id: number;
  name: string;
  email: string;
  type: "Individual" | "Company";
  status: "Active" | "Inactive";
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}


export interface SortConfig {
   id: string;
  field: SortField;
  direction: SortDirection;
}