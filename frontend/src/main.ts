import "./style.css";

import Alpine from "alpinejs";
// import PineconeRouter from 'pinecone-router';
import { themeChange } from "theme-change";

import Nav from "./components/navbar/navbar";

/** Alpine setup **/
// Expose global
(window as any).Alpine = Alpine;
// Alpine.plugin(PineconeRouter);

/** Init components **/
new Nav();

//** Start alpine **/
Alpine.start();

/** Theme setup **/
themeChange();
