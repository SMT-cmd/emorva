import React from "react";
import {createRoot} from "react-dom/client";
import App from "./App";
import "./site.css";
const root=document.getElementById("root");
if(!root)throw new Error("Emorva root element missing");
createRoot(root).render(<React.StrictMode><App/></React.StrictMode>);
