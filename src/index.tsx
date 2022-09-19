import { ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { App } from "./App";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(container);
// @ts-ignore
window.root = root;

root.render(
  <>
    <ColorModeScript initialColorMode="light" />
    <App />
  </>
);
