import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { PlanProvider } from "./store/planStore";
import { ViewModeProvider } from "./store/viewMode";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ViewModeProvider>
      <PlanProvider>
        <App />
      </PlanProvider>
    </ViewModeProvider>
  </StrictMode>,
);
