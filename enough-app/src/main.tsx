import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { PlanProvider } from "./store/planStore";
import { ViewModeProvider } from "./store/viewMode";
import { SpendProvider } from "./store/spendStore";
// Initialise i18n (synchronously) BEFORE the React tree mounts so the first
// render already has the right language and <html lang> is set.
import "./i18n";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ViewModeProvider>
      <PlanProvider>
        <SpendProvider>
          <App />
        </SpendProvider>
      </PlanProvider>
    </ViewModeProvider>
  </StrictMode>,
);
