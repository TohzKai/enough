import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Inputs } from "./pages/Inputs";
import { Dashboard } from "./pages/Dashboard";
import { FamilyReport } from "./pages/FamilyReport";
import { Business } from "./pages/Business";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="plan" element={<Inputs />} />
          <Route path="result" element={<Dashboard />} />
          <Route path="family" element={<FamilyReport />} />
          <Route path="partners" element={<Business />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
