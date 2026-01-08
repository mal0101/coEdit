/**
 * main.jsx
 *
 * Description: Application entry point that renders the React app
 * into the DOM root element.
 *
 * Usage:
 *   This file is the entry point for Vite
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Mount the application
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
