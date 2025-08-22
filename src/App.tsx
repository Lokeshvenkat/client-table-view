import { ClientTable } from "./components/ClientTable";
import "./App.css";
import { MOCK_CLIENTS } from "./components/mock";

function App() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4 text-left">Clients</h1>
      <ClientTable clients={MOCK_CLIENTS} />
    </div>
  );
}

export default App;
