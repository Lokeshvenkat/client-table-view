import type { ClientRow, SortCriterion, SortField } from "../types/client";


export const MOCK_CLIENTS: ClientRow[] = [
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


export const FIELD_LABEL: Record<SortField, string> = {
id: "Client ID",
name: "Client Name",
email: "Email",
createdAt: "Created At",
updatedAt: "Updated At",
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


export function compareBy<T extends ClientRow>(a: T, b: T, criteria: SortCriterion[]): number {
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