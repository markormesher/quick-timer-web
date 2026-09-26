import { createRoot } from "react-dom/client";
import { App } from "./components/app.js";

navigator.serviceWorker
	?.register("sw.js")
	.then(() => {
		console.log("registered service worker");
	})
	.catch((err) => {
		console.log("failed to register service worker", err);
	});

document.body.innerHTML = `<div id="app"></div>`;
const appEl = document.getElementById("app");
if (appEl) {
	const root = createRoot(appEl);
	root.render(<App />);
} else {
	document.body.innerHTML = "Error: couldn't find app div.";
}
