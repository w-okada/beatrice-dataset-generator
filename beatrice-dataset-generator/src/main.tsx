import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./utils/i18n"; // i18nの初期化

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
