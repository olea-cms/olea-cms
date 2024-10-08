import "./style.css";
import "./tracing";
import PineconeRouter from "pinecone-router";
import Alpine from "alpinejs";
import component from "alpinejs-component";
import morph from "@alpinejs/morph";
import { themeChange } from "theme-change";

import Navbar from "./components/navbar/navbar";
import LoginPage from "./pages/login/login";

/** Alpine setup **/
// Expose global
(window as any).Alpine = Alpine;
Alpine.plugin(morph);
Alpine.plugin(PineconeRouter);
Alpine.plugin(component);
(window as any).PineconeRouter.settings.templateTargetId = "app";
(window as any).htmx = htmx;
(window as any).htmx.config.selfRequestsOnly = false;

/** Init components **/
new Navbar();

/** Init pages **/
new LoginPage();

//** Start alpine **/
Alpine.start();

/** Theme setup **/
themeChange();
