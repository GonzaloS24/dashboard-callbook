import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/auth/login/Login";
import TransactionConfirmation from "./pages/transactionSummary/TransactionConfirmation";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transaction-summary" element={<TransactionConfirmation />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
