import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";  // Ensure this is here
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);