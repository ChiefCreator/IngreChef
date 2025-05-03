import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./app/App.tsx";

import "./assets/styles/_vars.scss";
import "./assets/styles/_mixin.scss";
import "./assets/styles/_utils.scss";
import "./assets/styles/_reset.scss";
import "./assets/styles/_base.scss";

const root = document.getElementById('root') as HTMLElement;

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)