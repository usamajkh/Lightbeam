import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Function to load the Google Cast SDK
function loadGoogleCastSDK() {
  const script = document.createElement("script");
  script.src =
    "https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1";
  script.async = true;
  script.onload = () => {
    console.log("Google Cast SDK loaded");
  };
  document.body.appendChild(script);
}

// Load the Google Cast SDK
loadGoogleCastSDK();

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
