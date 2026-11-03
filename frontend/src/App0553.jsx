import React from "react";
import {BrowserRouter,NavLink,Navigate,useRoutes} from "react-router-dom";
import {PJ26080553} from "./pages/PJ26080553";

export const PROJECT_0553_PATH="/projects/pj2608-0553";
export const PROJECT_0553_ROUTES=[
 {path:PROJECT_0553_PATH,element:<PJ26080553/>},
 {path:"*",element:<Navigate to={PROJECT_0553_PATH} replace/>}
];
// Dedicated0553 entry: no project picker,0550 page,employee page or portal Home.
export function Project0553Shell({children}){
 return <div className="genesis-shell" data-project-workspace="PJ2608-0553">
  <header className="genesis-topbar">
   <NavLink to={PROJECT_0553_PATH} className="genesis-brand">
    <span className="genesis-brand__mark">G</span>
    <span className="genesis-brand__text"><strong>GENESIS · PJ2608-0553</strong><span>Zawtika Phase 1F Telecom</span></span>
   </NavLink>
   <nav className="genesis-nav" aria-label="Primary navigation">
    <NavLink to={PROJECT_0553_PATH} className={({isActive})=>isActive?"active":""}>PJ2608-0553 Bid</NavLink>
   </nav>
  </header>
  <main className="genesis-main">{children}</main>
 </div>;
}
function Project0553Routes(){return useRoutes(PROJECT_0553_ROUTES);}
export function App0553(){
 return <BrowserRouter><Project0553Shell><Project0553Routes/></Project0553Shell></BrowserRouter>;
}
