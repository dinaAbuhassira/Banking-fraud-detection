
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
import Transactions from "./pages/transactions";
import FraudAlerts from "./pages/FraudAlerts";
import Settings from "./pages/Settings";
import { Routes, Route } from "react-router-dom";
import Reports from "./pages/Reports";

function App() {
  return (
    <Routes>

      {/* login لحاله */}
      <Route path="/" element={<Login />} />

      {/* الصفحات اللي فيها sidebar/topbar */}
      <Route element={<Layout />}>
      <Route path="/settings" element={<Settings />} />
      <Route path="/reports" element={<Reports />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
         <Route path="/alerts"       element={<FraudAlerts />} />
      </Route>

    </Routes>
  );
}

export default App;