import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app.js";

navigator.serviceWorker?.register("./sw.js").catch((err) => {
  console.log("failed to register service worker", err);
});

document.body.innerHTML = `<div id="app"></div>`;
const root = createRoot(document.getElementById("app")!);
root.render(<App />);
