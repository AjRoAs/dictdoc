import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import { FluentProvider, webDarkTheme } from "@fluentui/react-components";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FluentProvider theme={webDarkTheme} style={{ height: '100%', background: webDarkTheme.colorNeutralBackground1 }}>
      <App />
    </FluentProvider>
  </React.StrictMode>,
);
