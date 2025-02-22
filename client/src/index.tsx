import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/Tailwind.css";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const future = {
  v7_fetcherPersist: true,
  v7_normalizeFormMethod: true,
  v7_partialHydration: true,
  v7_relativeSplatPath: true,
  v7_skipActionErrorRevalidation: true,
  v7_startTransition: true,
};

root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router future={future}>
        <App />
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
