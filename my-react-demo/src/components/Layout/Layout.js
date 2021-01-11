import React from "react";

import Emb from "../../hoc/Emb";
import classes from "./Layout.css";

const layout = (props) => (
  <Emb>
    <div>Toolbar, SideDrawer, Backdrop</div>
    <main className={classes.Content}>{props.children}</main>
  </Emb>
);

export default layout;
