import { useState } from "react";
import type { ClientRow, SortConfig, SortField } from "../types/client";
import { SortPanel } from "./SortPanel";
import { Funnel, ArrowDownUp, Search } from "lucide-react";

interface ClientTableProps {
  clients: ClientRow[];
}

export function ClientTable({ clients }: ClientTableProps) {
  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [typeFilter, setTypeFilter] = useState<"All" | "Individual" | "Company">("All"); // default filter

  // Filter clients by type first, then by search term
  const filteredClients = clients
    .filter(client => typeFilter === "All" || client.type === typeFilter)
    .filter(
      client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const sortedClients = [...filteredClients].sort((a, b) => {
    for (const config of sortConfigs) {
      const field: SortField = config.field;
      const direction = config.direction === "asc" ? 1 : -1;

      let valA: any = a[field];
      let valB: any = b[field];

      if (field === "createdAt" || field === "updatedAt") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return -1 * direction;
      if (valA > valB) return 1 * direction;
    }
    return 0;
  });

  return (
    <div className="p-6">
  {/* Top row: filters on left, actions on right */}
  <div className="flex justify-between items-center mb-4 gap-4">
    {/* Left: Type filters */}
     <div className="flex items-center gap-1">
  {(["All", "Individual", "Company"] as const).map((option, index) => (
    <div key={option} className="flex items-center">
      <button
        onClick={() => setTypeFilter(option)}
        className={`px-2 py-1 text-sm font-medium transition
          ${typeFilter === option ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500 hover:text-gray-700"}`}
      >
        {option}
      </button>
      {index < 2 && <span className="text-gray-400 mx-1">|</span>} {/* Separator except after last */}
    </div>
  ))}
</div>

    {/* Right: Search + Sort + Filter Icon + Add Client */}
    <div className="flex items-center gap-1">
      {/* Search icon + input */}
      <div className="flex items-center overflow-hidden transition-all duration-300 ease-in-out">
        <button
          onClick={() => setShowSearch(true)}
          className={`flex items-center justify-center rounded-md px-3 py-2 text-gray-600 transition cursor-pointer
            ${showSearch ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <Search className="w-5 h-5" />
        </button>

        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onBlur={() => setShowSearch(false)}
          autoFocus={showSearch}
          className={`rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
            transition-all duration-300 ease-in-out
            ${showSearch ? "w-64 ml-1 opacity-100" : "w-0 ml-0 opacity-0"}`}
        />
      </div>

      {/* Sort button */}
      <button
      onClick={() => setSortOpen(true)}
       className="relative flex items-center rounded-md px-3 py-2 text-gray-600 cursor-pointer transition-all"
        >
              <ArrowDownUp className="w-5 h-5" />

            {/* Badge showing number of active sort options */}
              {sortConfigs.length > 0 && (
                 <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                     {sortConfigs.length}
        </span>
        )}
      </button>

      {/* Filter icon */}
      <button className="flex items-center gap-1 rounded-md px-3 py-2 text-gray-600 transition cursor-pointer">
        <Funnel className="w-5 h-5" />
      </button>

      {/* Add client button */}
      <button
        onClick={() => console.log("Add client clicked")}
        className="rounded-md bg-gray-900 px-3 py-2 text-white hover:bg-neutral-500 transition cursor-pointer"
      >
        <span className="text-lg font-bold">+</span> Add Client
      </button>
    </div>
  </div>

  {/* Sort panel */}
  <SortPanel
    open={sortOpen}
    onClose={() => setSortOpen(false)}
    active={sortConfigs}
    onChange={setSortConfigs}
  />

  {/* Table */}
  <div className="overflow-x-auto rounded-2xl shadow-md">
    {sortedClients.length > 0 ? (
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-center">ID</th>
            <th className="p-3 text-center">Name</th>
            <th className="p-3 text-center">Email</th>
            <th className="p-3 text-center">Type</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-center">Created At</th>
            <th className="p-3 text-center">Last Updated At</th>
          </tr>
        </thead>
        <tbody>
          {sortedClients.map((client) => (
            <tr key={client.id} className="border-t hover:bg-gray-50">
              <td className="p-3 text-center">{client.id}</td>
              <td className="p-3 text-center">{client.name}</td>
              <td className="p-3 text-center">{client.email}</td>
              <td className="p-3 text-center">{client.type}</td>
              <td className="p-3 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    client.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {client.status}
                </span>
              </td>
              <td className="p-3 text-center">
                {new Date(client.createdAt).toLocaleDateString()}
              </td>
              <td className="p-3 text-center">
                {new Date(client.updatedAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p className="p-4 text-center text-gray-500">
        {searchTerm ? "No results found" : "No clients available"}
      </p>
    )}
  </div>
</div>

  );
}
