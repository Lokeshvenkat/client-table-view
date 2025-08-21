import { useState } from "react";
import type { ClientRow, SortConfig, SortField } from "../types/client";
import { SortPanel } from "./SortPanel";

interface ClientTableProps {
  clients: ClientRow[];
}

export function ClientTable({ clients }: ClientTableProps) {
  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients.filter(
    (client) =>
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
      <div className="flex justify-end items-center mb-4 gap-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={() => setSortOpen(true)}
          className="rounded-md bg-blue-500 px-3 py-2 text-white hover:bg-blue-600 transition"
        >
          Sort
        </button>

        <button
          onClick={() => console.log("Add client clicked")}
          className="rounded-md bg-gray-900 px-3 py-2 text-white hover:bg-neutral-500 transition"
        >
          <span className="text-lg font-bold">+</span> Add Client
        </button>
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
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Created At</th>
                <th className="p-3 text-left">Last Updated At</th>
              </tr>
            </thead>
            <tbody>
              {sortedClients.map((client) => (
                <tr key={client.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{client.id}</td>
                  <td className="p-3">{client.name}</td>
                  <td className="p-3">{client.email}</td>
                  <td className="p-3">{client.type}</td>
                  <td className="p-3">
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
                  <td className="p-3">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
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
