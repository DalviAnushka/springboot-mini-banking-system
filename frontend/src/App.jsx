import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import CreateAccount from "./pages/CreateAccount.jsx";
import Transactions from "./pages/Transactions.jsx";
import HomePage from "./pages/HomePage";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard"

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/create" element={<CreateAccount />} />
          <Route path="/transactions" element={<Transactions />} />
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/" element={<Dashboard />} />



        </Routes>
      </div>
    </BrowserRouter>
  );
}
